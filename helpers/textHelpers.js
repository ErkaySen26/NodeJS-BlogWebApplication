// Text işleme helper fonksiyonları

/**
 * Metni belirtilen uzunlukta keser ve "..." ekler
 * @param {string} text - Kesilecek metin
 * @param {number} length - Maksimum uzunluk
 * @returns {string} - Kesilmiş metin
 */
function truncateText(text, length = 150) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

/**
 * HTML etiketlerini temizler
 * @param {string} html - HTML içeriği
 * @returns {string} - Temizlenmiş metin
 */
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Metinden özet çıkarır
 * @param {string} content - İçerik
 * @param {number} length - Özet uzunluğu
 * @returns {string} - Özet
 */
function createSummary(content, length = 200) {
  if (!content) return '';
  const cleanText = stripHtml(content);
  return truncateText(cleanText, length);
}

/**
 * Slug oluşturur (URL dostu)
 * @param {string} text - Dönüştürülecek metin
 * @returns {string} - Slug
 */
function createSlug(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Özel karakterleri kaldır
    .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
    .replace(/-+/g, '-') // Çoklu tireleri tek tire yap
    .replace(/^-+|-+$/g, ''); // Başta ve sonda tire varsa kaldır
}

/**
 * Kelime sayısını hesaplar
 * @param {string} text - Metin
 * @returns {number} - Kelime sayısı
 */
function wordCount(text) {
  if (!text) return 0;
  const cleanText = stripHtml(text);
  return cleanText.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Okuma süresini hesaplar (dakika)
 * @param {string} text - Metin
 * @param {number} wordsPerMinute - Dakikada okunan kelime sayısı
 * @returns {number} - Okuma süresi (dakika)
 */
function readingTime(text, wordsPerMinute = 200) {
  const words = wordCount(text);
  return Math.ceil(words / wordsPerMinute);
}

module.exports = {
  truncateText,
  stripHtml,
  createSummary,
  createSlug,
  wordCount,
  readingTime
};
