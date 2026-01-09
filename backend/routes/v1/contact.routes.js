const express = require('express');
const router = express.Router();
const { sendContactFormEmail } = require('../../utils/emailService');

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
        }

        await sendContactFormEmail({ name, email, subject: subject || 'No Subject', message });

        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
});

module.exports = router;
