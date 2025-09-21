require("dotenv").config();          // must be first
const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000; // default if env missing

// keep raw body for signature verification later
app.use(bodyParser.json({
  verify: (req, res, buf) => { req.rawBody = buf; }
}));

// health check
app.get("/orion_beta1.0.0", (_, res) => res.status(200).send("ok"));

// --- GET: webhook verification ---
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// --- helper: verify X-Hub-Signature-256 (we'll enable after basic test) ---
function verifySignature(req) {
  const appSecret = process.env.APP_SECRET;
  if (!appSecret) return true; // allow while testing
  // Temporarily disable for local testing
  return true; // TODO: Re-enable this for production
  const sig = req.get("X-Hub-Signature-256"); // format: sha256=...
  if (!sig) return false;
  const hmac = crypto.createHmac("sha256", appSecret);
  hmac.update(req.rawBody);
  const expected = "sha256=" + hmac.digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

// --- POST: receive events ---
app.post("/webhook", (req, res) => {
  if (!verifySignature(req)) {
    console.warn("⚠️ Invalid signature");
    return res.sendStatus(401);
  }

  // Always 200 quickly or Meta retries
  res.sendStatus(200);

  try {
    const body = req.body || {};
    const change = body?.entry?.[0]?.changes?.[0];
    const field = change?.field;
    const value = change?.value;

    if (field === "messages") {
      if (value?.messages?.length) {
        const msg = value.messages[0];
        const from = msg.from;
        const type = msg.type;
        if (type === "text") {
          console.log("📩 text from", from, "→", msg.text.body);
        } else if (type === "button") {
          console.log("🔘 button from", from, "→", msg.button.text);
        } else {
          console.log("📩 message", JSON.stringify(msg));
        }
      }
      if (value?.statuses?.length) {
        const st = value.statuses[0];
        console.log("📦 status:", st.status, "for", st.id, "conversation", st.conversation?.id);
      }
    } else if (field === "message_template_status_update") {
      console.log("🧾 template status update:", JSON.stringify(value));
    } else if (field === "message_template_quality_update") {
      console.log("📊 template quality update:", JSON.stringify(value));
    } else {
      console.log("ℹ️ other field:", field, JSON.stringify(value));
    }
  } catch (e) {
    console.error("Parse error:", e);
  }
});

app.listen(PORT, () => console.log(`Webhook listening on :${PORT}`));
