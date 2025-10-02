/**
 * Sayfalama helper fonksiyonları
 */

/**
 * Sayfalama bilgilerini hesaplar
 * @param {number} currentPage - Mevcut sayfa
 * @param {number} totalItems - Toplam öğe sayısı
 * @param {number} itemsPerPage - Sayfa başına öğe sayısı
 * @returns {object} - Sayfalama bilgileri
 */
function calculatePagination(currentPage = 1, totalItems = 0, itemsPerPage = 10) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  const skip = (currentPage - 1) * itemsPerPage;

  // Sayfa numaralarını hesapla (örn: 1, 2, 3, 4, 5)
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  const pages = [];
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push({
      number: i,
      isCurrent: i === currentPage,
      url: `?page=${i}`
    });
  }

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? currentPage + 1 : null,
    prevPage: hasPrevPage ? currentPage - 1 : null,
    skip,
    pages,
    startItem: skip + 1,
    endItem: Math.min(skip + itemsPerPage, totalItems)
  };
}

/**
 * URL query parametrelerini parse eder
 * @param {object} query - Express req.query objesi
 * @returns {object} - Parse edilmiş parametreler
 */
function parseQueryParams(query) {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const search = query.search || '';
  const category = query.category || '';
  const sort = query.sort || 'newest';

  return {
    page: Math.max(1, page),
    limit: Math.min(50, Math.max(1, limit)), // 1-50 arası sınırla
    search: search.trim(),
    category,
    sort
  };
}

/**
 * MongoDB sort objesi oluşturur
 * @param {string} sortType - Sıralama tipi
 * @returns {object} - MongoDB sort objesi
 */
function createSortObject(sortType) {
  switch (sortType) {
    case 'oldest':
      return { createdAt: 1 };
    case 'title':
      return { title: 1 };
    case 'views':
      return { views: -1 };
    case 'newest':
    default:
      return { createdAt: -1 };
  }
}

/**
 * Arama ve filtreleme için MongoDB query objesi oluşturur
 * @param {object} params - Arama parametreleri
 * @returns {object} - MongoDB query objesi
 */
function createSearchQuery(params) {
  const query = { status: 'published' }; // Sadece yayınlanmış postlar

  // Metin araması
  if (params.search) {
    query.$or = [
      { title: { $regex: params.search, $options: 'i' } },
      { content: { $regex: params.search, $options: 'i' } },
      { summary: { $regex: params.search, $options: 'i' } }
    ];
  }

  // Kategori filtresi
  if (params.category) {
    query.category = params.category;
  }

  return query;
}

module.exports = {
  calculatePagination,
  parseQueryParams,
  createSortObject,
  createSearchQuery
};
