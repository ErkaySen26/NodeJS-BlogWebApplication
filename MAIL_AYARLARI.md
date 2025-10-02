# 📧 Mail Ayarları Nasıl Yapılır?

## 🎯 Sorun

İletişim formundan mail gönderilemiyor çünkü gerçek mail ayarları yapılmamış.

## ✅ Çözüm: Gmail ile Mail Gönderimi

### Adım 1: Gmail Uygulama Şifresi Oluşturun

1. **Google Hesabınıza gidin**: https://myaccount.google.com/
2. **Güvenlik** sekmesine tıklayın
3. **2 Adımlı Doğrulama**'yı açın (eğer kapalıysa)
4. **Uygulama şifreleri** bölümüne gidin
5. **Uygulama seçin** → "Mail" seçin
6. **Cihaz seçin** → "Diğer" seçin ve "Node Blog" yazın
7. **Oluştur** butonuna tıklayın
8. **16 haneli şifreyi** kopyalayın (örnek: `abcd efgh ijkl mnop`)

### Adım 2: .env Dosyası Oluşturun

Proje ana dizininde `.env` dosyası oluşturun:

```env
# Veritabanı
MONGODB_URI=mongodb://127.0.0.1/nodeblog_db

# Session
SESSION_SECRET=gizli-anahtar-buraya-yazin

# Mail Ayarları
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=sizin-gmail-adresiniz@gmail.com
MAIL_PASS=abcdefghijklmnop
CONTACT_EMAIL=sizin-gmail-adresiniz@gmail.com

# Sunucu
PORT=3000
```

**ÖNEMLİ:** 
- `MAIL_USER`: Gmail adresiniz
- `MAIL_PASS`: Adım 1'de oluşturduğunuz 16 haneli şifre (boşluksuz)
- `CONTACT_EMAIL`: İletişim formundan gelen maillerin gönderileceği adres

### Adım 3: app.js'i Güncelleyin

`app.js` dosyasının en üstüne ekleyin:

```javascript
require('dotenv').config();
```

### Adım 4: dotenv Paketini Yükleyin

```bash
npm install dotenv
```

### Adım 5: Sunucuyu Yeniden Başlatın

```bash
npm run boot
```

---

## 🔧 Alternatif: Başka Mail Servisleri

### Outlook/Hotmail

```env
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_USER=sizin-email@outlook.com
MAIL_PASS=sifreniz
```

### Yahoo Mail

```env
MAIL_HOST=smtp.mail.yahoo.com
MAIL_PORT=587
MAIL_USER=sizin-email@yahoo.com
MAIL_PASS=uygulama-sifreniz
```

### Özel SMTP Sunucusu

```env
MAIL_HOST=mail.sirketiniz.com
MAIL_PORT=587
MAIL_USER=info@sirketiniz.com
MAIL_PASS=sifreniz
```

---

## 🧪 Test Etme

1. Sunucuyu başlatın: `npm run boot`
2. Tarayıcıda `http://localhost:3000/contact` adresine gidin
3. Formu doldurun ve gönderin
4. Terminal'de şu mesajı görmelisiniz:
   ```
   ✅ Mail gönderildi: <message-id>
   ```

---

## ⚠️ Sık Karşılaşılan Hatalar

### Hata 1: "Invalid login"
**Çözüm:** 
- Gmail'de 2 Adımlı Doğrulama açık mı kontrol edin
- Uygulama şifresini doğru kopyaladığınızdan emin olun
- Boşlukları kaldırın

### Hata 2: "Connection timeout"
**Çözüm:**
- İnternet bağlantınızı kontrol edin
- Firewall/Antivirus'ün port 587'yi engellemediğinden emin olun

### Hata 3: "Self signed certificate"
**Çözüm:**
`config/mailer.js` dosyasında:
```javascript
const mailConfig = {
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: process.env.MAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false  // Bu satırı ekleyin
  }
};
```

---

## 📝 Not

Mail ayarları **opsiyoneldir**. Mail ayarları yapılmasa bile:
- İletişim formu çalışır
- Kullanıcıya "Mesajınız alındı" mesajı gösterilir
- Sadece mail gönderimi yapılmaz

Ancak gerçek bir üretim ortamında mail ayarlarının yapılması önerilir.

---

## 🎉 Başarılı Kurulum Sonrası

Mail ayarları başarıyla yapıldıktan sonra:
1. İletişim formundan test mesajı gönderin
2. `CONTACT_EMAIL` adresine mail geldiğini kontrol edin
3. Mail içeriğinin düzgün göründüğünden emin olun

---

**Hazırlayan:** Node Blog Projesi  
**Tarih:** 2025

