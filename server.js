const express = require('express');
const twilio = require('twilio');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // serve order.html

// =====================================================
// CONFIGURATION — fill these in after Twilio signup
// =====================================================
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const TWILIO_AUTH_TOKEN  = process.env.TWILIO_AUTH_TOKEN  || 'your_auth_token_here';
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER || '+1XXXXXXXXXX'; // Your Twilio number
const SHOP_PHONE         = '+19709023252';                                    // DBP iPhone
// =====================================================

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

app.post('/send-order', async (req, res) => {
  const { message, customerName } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    await client.messages.create({
      body: message,
      from: TWILIO_FROM_NUMBER,
      to: SHOP_PHONE,
    });

    console.log(`✅ Order from ${customerName} sent to shop at ${new Date().toLocaleTimeString()}`);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Twilio error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚲☕ DBP Order Server running at http://localhost:${PORT}`);
  console.log(`   Texts will be sent to ${SHOP_PHONE}\n`);
});
