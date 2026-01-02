const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: process.env.EMAIL_USER || "laptoptest7788@gmail.com",
    pass: process.env.EMAIL_PASS || "uqfiabjkiqudrgdw",
  },
});

async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER || "laptoptest7788@gmail.com",
    to,
    subject: 'Your Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
  };
  return transporter.sendMail(mailOptions);
  return transporter.sendMail(mailOptions);
}

async function sendVerificationEmail(to, name) {
  const mailOptions = {
    from: process.env.EMAIL_USER || "laptoptest7788@gmail.com",
    to,
    subject: 'Your Seller Account is Approved!',
    text: `Hello ${name},\n\nYour seller account has been successfully verified/approved by our admin team.\n\nYou can now log in to the Seller Hub and start selling.\n\nLogin here: http://localhost:8081/login\n\nBest Regards,\nNevyra Team`,
  };
  return transporter.sendMail(mailOptions);
}

async function sendContactFormEmail(data) {
  const { name, email, subject, message } = data;
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || "laptoptest7788@gmail.com";

  const mailOptions = {
    from: process.env.EMAIL_USER || "laptoptest7788@gmail.com",
    to: adminEmail,
    replyTo: email,
    subject: `New Contact Form Submission: ${subject}`,
    text: `You have received a new message from the contact form.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail, sendVerificationEmail, sendContactFormEmail }; 