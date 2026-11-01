// Simple in-memory store for serverless (or hook up Vercel KV later)
// For a simple personal switch, this holds state across warm serverless instances.
let lightStates = {
  elk: "off",
  gatt: "off",
  clk: "off",
  all: "off"
};

export default function handler(req, res) {
  // Allow cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET request (ESP32 polls this to check what to do)
  if (req.method === 'GET') {
    return res.status(200).json(lightStates);
  }

  // Handle POST request (Your Web Panel sends commands here)
  if (req.method === 'POST') {
    const { light, action } = req.body; // e.g. { light: "elk", action: "on" }
    if (light && action) {
      lightStates[light] = action;
      return res.status(200).json({ success: true, lightStates });
    }
    return res.status(400).json({ error: "Invalid payload" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}