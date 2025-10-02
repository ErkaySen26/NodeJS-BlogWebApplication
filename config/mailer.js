const nodemailer = require("nodemailer");

// Mail yapılandırması
const mailConfig = {
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: process.env.MAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER || "your-email@gmail.com",
    pass: process.env.MAIL_PASS || "your-app-password",
  },
};

// Transporter oluştur
const transporter = nodemailer.createTransport(mailConfig);

// Mail gönderme fonksiyonu
async function sendMail(options) {
  try {
    const mailOptions = {
      from: options.from || `"Node Blog" <${mailConfig.auth.user}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Mail gönderildi:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Mail gönderme hatası:", error);
    return { success: false, error: error.message };
  }
}

// İletişim formu mail şablonu
function contactMailTemplate(data) {
  return {
    subject: `İletişim Formu: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Yeni İletişim Mesajı</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
          <p><strong>Ad Soyad:</strong> ${data.name}</p>
          <p><strong>E-posta:</strong> ${data.email}</p>
          <p><strong>Konu:</strong> ${data.subject}</p>
          <hr style="border: 1px solid #ddd;">
          <p><strong>Mesaj:</strong></p>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          Bu mesaj ${new Date().toLocaleString('tr-TR')} tarihinde gönderilmiştir.
        </p>
      </div>
    `,
    text: `
      Yeni İletişim Mesajı
      
      Ad Soyad: ${data.name}
      E-posta: ${data.email}
      Konu: ${data.subject}
      
      Mesaj:
      ${data.message}
      
      Gönderim Tarihi: ${new Date().toLocaleString('tr-TR')}
    `,
  };
}

module.exports = {
  sendMail,
  contactMailTemplate,
  transporter,
};

