<template>
  <div class="news-page-container">
    <div class="container">
      
      <!-- HERO HEADER (THEO ĐÚNG MẪU BẠN GỬI) -->
      <section class="news-hero-section">
        <div class="hero-badge">
          <i class="fa-solid fa-book-open"></i> NHẬT KÝ & CHIA SẺ THỰC CHIẾN
        </div>
        <h1 class="hero-title">Câu Chuyện Đầu Tư Bất Động Sản</h1>
        <p class="hero-subtitle">
          Nơi chia sẻ góc nhìn thẳng thắn từ hơn 12 năm lăn lộn trên thị trường: từ những thương vụ nhân ba tài sản đến những bài học mất cọc xương máu mà bạn không tìm thấy trong sách giáo khoa.
        </p>
      </section>

      <!-- BÀI VIẾT TIÊU ĐIỂM (FEATURED ARTICLE CARD) -->
      <section v-if="featuredArticle" class="featured-article-card">
        <div class="featured-media">
          <img :src="featuredArticle.image" :alt="featuredArticle.title" loading="lazy">
          <span class="featured-tag">
            <i class="fa-solid fa-star"></i> BÀI VIẾT TIÊU ĐIỂM
          </span>
        </div>

        <div class="featured-body">
          <div class="featured-meta-top">
            <span class="category-pill">{{ featuredArticle.category }}</span>
            <span class="meta-separator">•</span>
            <span class="read-time"><i class="fa-regular fa-clock"></i> {{ featuredArticle.readTime }}</span>
          </div>

          <h2 class="featured-title">
            <NuxtLink :to="`/tin-tuc/${featuredArticle.slug || featuredArticle.id}`">
              {{ featuredArticle.title }}
            </NuxtLink>
          </h2>

          <p class="featured-excerpt">
            {{ featuredArticle.excerpt }}
          </p>

          <div class="featured-footer">
            <div class="views-count">
              <i class="fa-regular fa-eye"></i> {{ featuredArticle.views.toLocaleString('vi-VN') }} lượt đọc
            </div>
            <NuxtLink :to="`/tin-tuc/${featuredArticle.slug || featuredArticle.id}`" class="read-more-btn">
              <span>Đọc ngay</span>
              <i class="fa-solid fa-arrow-right"></i>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- BỘ LỌC CHỦ ĐỀ & THANH TÌM KIẾM -->
      <div class="filter-and-search-bar">
        <div class="topic-tabs-list">
          <button 
            v-for="t in TOPIC_TABS" 
            :key="t.id"
            class="topic-tab-item"
            :class="{ active: selectedTopic === t.id }"
            @click="selectedTopic = t.id"
          >
            {{ t.name }}
          </button>
        </div>

        <div class="search-input-box">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Tìm bài viết..."
            class="search-input"
          >
          <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">&times;</button>
        </div>
      </div>

      <!-- LƯỚI BÀI VIẾT (ARTICLES GRID) -->
      <div v-if="filteredArticles.length === 0" class="no-articles-found">
        <i class="fa-regular fa-newspaper"></i>
        <h3>Không tìm thấy bài viết phù hợp</h3>
        <p>Vui lòng thử chọn chủ đề khác hoặc thay đổi từ khóa tìm kiếm.</p>
        <button class="btn btn-outline-gold" style="margin-top: 15px;" @click="resetFilters">
          Xem tất cả bài viết
        </button>
      </div>

      <div v-else class="articles-grid">
        <article 
          v-for="item in filteredArticles" 
          :key="item.id" 
          class="article-grid-card"
        >
          <NuxtLink :to="`/tin-tuc/${item.slug || item.id}`" class="card-thumb-link">
            <img :src="item.image" :alt="item.title" loading="lazy">
            <span class="card-category-badge">{{ item.category }}</span>
          </NuxtLink>

          <div class="card-content-box">
            <div class="card-meta">
              <span><i class="fa-regular fa-clock"></i> {{ item.readTime }}</span>
              <span>•</span>
              <span>{{ new Date(item.createdAt).toLocaleDateString('vi-VN') }}</span>
            </div>

            <h3 class="card-title">
              <NuxtLink :to="`/tin-tuc/${item.slug || item.id}`">
                {{ item.title }}
              </NuxtLink>
            </h3>

            <p class="card-excerpt">
              {{ item.excerpt }}
            </p>

            <div class="card-footer">
              <span class="author-name">
                <i class="fa-solid fa-newspaper" style="color: var(--gold-primary);"></i> {{ item.source || item.author }}
              </span>
              <div style="display: flex; align-items: center; gap: 12px;">
                <a 
                  v-if="item.sourceUrl" 
                  :href="item.sourceUrl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style="font-size: 0.78rem; color: var(--gold-primary); text-decoration: underline; font-weight: 600;"
                  title="Mở bài viết gốc tại trang báo"
                  @click.stop
                >
                  Link gốc ↗
                </a>
                <NuxtLink :to="`/tin-tuc/${item.slug || item.id}`" class="card-read-link">
                  Đọc tiếp <i class="fa-solid fa-arrow-right"></i>
                </NuxtLink>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- BANNER CTA TƯ VẤN THỰC CHIẾN -->
      <section class="consult-cta-banner">
        <div class="cta-inner">
          <div class="cta-text">
            <span class="cta-mini-tag"><i class="fa-solid fa-shield-halved"></i> TƯ VẤN CHIẾN LƯỢC ĐẦU TƯ</span>
            <h2>Bạn Cần Thẩm Định Pháp Lý & Dòng Tiền Nhà Phố Quận 1?</h2>
            <p>Tránh mất tiền oan từ các bẫy quy hoạch ngầm, lộ giới mở rộng và tính toán chính xác dòng tiền sinh lời trước khi đặt cọc.</p>
          </div>
          <div class="cta-actions">
            <a href="tel:0901355446" class="btn btn-gold cta-btn">
              <i class="fa-solid fa-phone"></i> Đặt Lịch Tư Vấn 1-1 (0901.355.446)
            </a>
            <a href="https://zalo.me/0901355446" target="_blank" class="btn btn-outline-gold cta-btn">
              <i class="fa-solid fa-comment-dots"></i> Nhắn Tin Zalo Chuyên Gia
            </a>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
// Chủ đề khớp với ảnh mẫu của bạn
const TOPIC_TABS = [
  { id: 'all', name: 'Tất cả chủ đề' },
  { id: 'Kinh nghiệm thực chiến', name: 'Kinh nghiệm thực chiến' },
  { id: 'Pháp lý an toàn', name: 'Pháp lý an toàn' },
  { id: 'Đòn bẩy tài chính', name: 'Đòn bẩy tài chính' },
  { id: 'Phân tích chu kỳ', name: 'Phân tích chu kỳ' },
  { id: 'Bài học đắt giá', name: 'Bài học đắt giá' },
];

const selectedTopic = ref('all');
const searchQuery = ref('');

// Fetch danh sách bài viết từ Backend (chỉ lấy các bài đã duyệt xuất bản isPublished = true)
const { data: articlesData } = await useFetch('/api/articles?published=true');
const articles = computed(() => articlesData.value || []);

// Bài viết tiêu điểm (bài đầu tiên có isFeatured = true hoặc bài mới nhất)
const featuredArticle = computed(() => {
  if (!articles.value || articles.value.length === 0) return null;
  const feat = articles.value.find((a: any) => a.isFeatured);
  return feat || articles.value[0];
});

// Lọc bài viết hiển thị ở lưới bên dưới (loại bỏ bài tiêu điểm nếu đang chọn "Tất cả")
const filteredArticles = computed(() => {
  let list = articles.value;

  // Lọc theo chủ đề
  if (selectedTopic.value !== 'all') {
    list = list.filter((a: any) => a.category === selectedTopic.value);
  }

  // Lọc theo tìm kiếm từ khóa
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter((a: any) => 
      a.title?.toLowerCase().includes(q) || 
      a.excerpt?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q)
    );
  }

  return list;
});

const resetFilters = () => {
  selectedTopic.value = 'all';
  searchQuery.value = '';
};

useHead({
  title: 'Câu Chuyện Đầu Tư BĐS - Kinh Nghiệm Thực Chiến Bến Thành',
  meta: [
    { name: 'description', content: 'Góc nhìn thẳng thắn từ 12 năm đầu tư BĐS trung tâm: đòn bẩy tài chính an toàn, pháp lý nhà phố Quận 1 và phân tích chu kỳ.' },
  ],
});
</script>

<style scoped>
.news-page-container {
  padding: 110px 0 80px;
  min-height: 85vh;
  background: var(--bg-primary);
  color: var(--text-main);
}

/* HERO SECTION */
.news-hero-section {
  text-align: center;
  max-width: 860px;
  margin: 0 auto 40px;
  padding: 20px 15px 0;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(212, 175, 55, 0.12);
  border: 1px solid var(--border-gold);
  border-radius: 999px;
  color: var(--gold-primary);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 2.5rem;
  font-family: var(--font-heading);
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.25;
  margin-bottom: 16px;
}

.hero-subtitle {
  font-size: 1.05rem;
  color: var(--text-muted);
  line-height: 1.65;
  margin: 0 auto;
}

/* FEATURED CARD */
.featured-article-card {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  margin-bottom: 50px;
  transition: var(--transition);
}

.featured-article-card:hover {
  box-shadow: var(--shadow-gold);
  border-color: var(--gold-primary);
}

.featured-media {
  position: relative;
  min-height: 380px;
  background: #000;
}

.featured-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.featured-tag {
  position: absolute;
  top: 18px;
  left: 18px;
  background: var(--gold-gradient);
  color: #000;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.featured-body {
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.featured-meta-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.category-pill {
  color: var(--gold-primary);
  font-weight: 700;
  font-size: 0.88rem;
}

.meta-separator {
  color: var(--text-muted);
}

.read-time {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.featured-title {
  font-size: 1.65rem;
  font-family: var(--font-heading);
  line-height: 1.35;
  margin-bottom: 16px;
}

.featured-title a {
  color: var(--text-main);
  text-decoration: none;
  transition: var(--transition);
}

.featured-title a:hover {
  color: var(--gold-primary);
}

.featured-excerpt {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 24px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid var(--border-color);
}

.views-count {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.read-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--gold-primary);
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  transition: var(--transition);
}

.read-more-btn:hover {
  transform: translateX(4px);
}

/* FILTER & SEARCH BAR */
.filter-and-search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 35px;
  flex-wrap: wrap;
}

.topic-tabs-list {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.topic-tab-item {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 8px 18px;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.topic-tab-item:hover {
  border-color: var(--gold-primary);
  color: var(--gold-primary);
}

.topic-tab-item.active {
  background: var(--gold-gradient);
  border-color: transparent;
  color: #000;
  font-weight: 700;
  box-shadow: var(--shadow-sm);
}

.search-input-box {
  position: relative;
  min-width: 260px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 0.85rem;
}

.search-input {
  width: 100%;
  padding: 9px 36px 9px 38px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  color: var(--text-main);
  font-size: 0.85rem;
  outline: none;
  transition: var(--transition);
}

.search-input:focus {
  border-color: var(--gold-primary);
  box-shadow: 0 0 0 2px var(--gold-glow);
}

.clear-search-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.1rem;
  cursor: pointer;
}

/* ARTICLES GRID */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.article-grid-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
}

.article-grid-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-gold);
  box-shadow: var(--shadow-md);
}

.card-thumb-link {
  position: relative;
  height: 210px;
  overflow: hidden;
  display: block;
}

.card-thumb-link img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-grid-card:hover .card-thumb-link img {
  transform: scale(1.05);
}

.card-category-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  border: 1px solid var(--border-gold);
  color: var(--gold-primary);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 4px;
}

.card-content-box {
  padding: 22px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 10px;
}

.card-title a {
  color: var(--text-main);
  text-decoration: none;
  transition: var(--transition);
}

.card-title a:hover {
  color: var(--gold-primary);
}

.card-excerpt {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.55;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid var(--border-color);
  font-size: 0.82rem;
}

.author-name {
  color: var(--text-muted);
  font-weight: 500;
}

.card-read-link {
  color: var(--gold-primary);
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* NO ARTICLES */
.no-articles-found {
  text-align: center;
  padding: 60px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  margin-bottom: 50px;
}

.no-articles-found i {
  font-size: 3rem;
  color: var(--gold-primary);
  margin-bottom: 14px;
  opacity: 0.7;
}

/* CTA BANNER */
.consult-cta-banner {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(14, 26, 48, 0.95) 100%);
  border: 1px solid var(--border-gold);
  border-radius: var(--radius-lg);
  padding: 40px;
  margin-top: 40px;
}

.cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
}

.cta-text {
  max-width: 620px;
}

.cta-mini-tag {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--gold-primary);
  letter-spacing: 0.5px;
  display: inline-block;
  margin-bottom: 8px;
}

.cta-text h2 {
  font-size: 1.6rem;
  font-family: var(--font-heading);
  color: var(--text-main);
  margin-bottom: 10px;
}

.cta-text p {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cta-btn {
  padding: 12px 24px;
  font-size: 0.92rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

/* RESPONSIVE */
@media (max-width: 992px) {
  .featured-article-card {
    grid-template-columns: 1fr;
  }
  .featured-media {
    min-height: 250px;
  }
  .featured-body {
    padding: 24px 20px;
  }
  .hero-title {
    font-size: 1.9rem;
  }
  .consult-cta-banner {
    padding: 24px 20px;
  }
}
</style>
