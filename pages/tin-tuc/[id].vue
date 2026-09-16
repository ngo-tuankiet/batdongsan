<template>
  <div class="article-detail-page">
    <div class="container" style="max-width: 960px;">
      
      <!-- BREADCRUMB -->
      <nav class="detail-breadcrumb">
        <NuxtLink to="/">Trang Chủ</NuxtLink>
        <i class="fa-solid fa-chevron-right"></i>
        <NuxtLink to="/tin-tuc">Tin Tức</NuxtLink>
        <i class="fa-solid fa-chevron-right"></i>
        <span class="active-crumb">{{ article?.category }}</span>
      </nav>

      <div v-if="pending" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i> Đang tải bài viết...
      </div>

      <div v-else-if="!article" class="not-found-state">
        <h2>Không tìm thấy bài viết</h2>
        <NuxtLink to="/tin-tuc" class="btn btn-gold">Quay lại danh sách</NuxtLink>
      </div>

      <article v-else class="article-main-content">
        <!-- HEADER BÀI VIẾT -->
        <header class="article-header">
          <div class="header-tags-row">
            <span class="article-cat-badge">{{ article.category }}</span>
            <span class="meta-item"><i class="fa-regular fa-clock"></i> {{ article.readTime }}</span>
            <span class="meta-item"><i class="fa-regular fa-calendar"></i> {{ new Date(article.createdAt).toLocaleDateString('vi-VN') }}</span>
            <span class="meta-item"><i class="fa-regular fa-eye"></i> {{ article.views?.toLocaleString('vi-VN') }} lượt đọc</span>
          </div>

          <h1 class="article-main-title">{{ article.title }}</h1>

          <div class="author-info-banner">
            <div class="author-avatar-badge">
              <i class="fa-solid fa-user-tie"></i>
            </div>
            <div>
              <div class="author-name-text">{{ article.author }}</div>
              <small class="author-desc-text">Nguồn: {{ article.source || 'BĐS Bến Thành Thực Chiến' }}</small>
            </div>
          </div>
        </header>

        <!-- ẢNH BÌA CHÍNH -->
        <div class="article-cover-img">
          <img :src="article.image" :alt="article.title">
        </div>

        <!-- TÓM TẮT DẪN NHẬP (LEAD) -->
        <div class="article-lead-box">
          <i class="fa-solid fa-quote-left quote-icon"></i>
          <p>{{ article.excerpt }}</p>
        </div>

        <!-- NỘI DUNG CHI TIẾT (RENDER HTML) -->
        <div class="article-body-html" v-html="article.content"></div>

        <!-- SHARE & CTA TƯ VẤN -->
        <div class="article-cta-box">
          <div class="cta-box-left">
            <h3>Cần Tra Cứu Quy Hoạch & Thẩm Định Giá Nhà Phố?</h3>
            <p>Liên hệ trực tiếp Ban Giám Đốc Sàn Bến Thành để được hỗ trợ kiểm tra pháp lý và xem quỹ căn độc quyền giá gốc.</p>
          </div>
          <div class="cta-box-right">
            <a href="tel:0912131329" class="btn btn-gold">
              <i class="fa-solid fa-phone"></i> Hotline: 0912.131.329
            </a>
          </div>
        </div>

        <!-- TÁC GIẢ BIO CARD -->
        <div class="author-bio-card">
          <div class="bio-avatar">BT</div>
          <div class="bio-content">
            <h4>Bất Động Sản Bến Thành</h4>
            <p>Đơn vị chuyên tư vấn đầu tư, định giá và phân phối nhà phố trung tâm Quận 1 & các dự án căn hộ hạng sang. Nắm giữ quỹ căn độc quyền với đầy đủ hồ sơ pháp lý hoàn công.</p>
          </div>
        </div>

        <!-- NÚT ĐIỀU HƯỚNG BÀI VIẾT -->
        <div class="article-nav-buttons">
          <NuxtLink to="/tin-tuc" class="btn btn-outline-gold">
            <i class="fa-solid fa-arrow-left"></i> Xem các bài viết khác
          </NuxtLink>
          <NuxtLink to="/#properties" class="btn btn-gold">
            <i class="fa-solid fa-building"></i> Xem Quỹ Căn Đang Bán
          </NuxtLink>
        </div>
      </article>

    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const idOrSlug = computed(() => route.params.id as string);

const { data: article, pending } = await useFetch(`/api/articles/${idOrSlug.value}`);

useHead(() => ({
  title: article.value ? `${article.value.title} - BĐS Bến Thành` : 'Bài Viết Đầu Tư BĐS Bến Thành',
  meta: [
    { name: 'description', content: article.value?.excerpt || 'Kinh nghiệm đầu tư BĐS thực chiến Quận 1' },
    { property: 'og:title', content: article.value?.title || 'Bài Viết Đầu Tư' },
    { property: 'og:image', content: article.value?.image || '' },
  ],
}));
</script>

<style scoped>
.article-detail-page {
  padding: 110px 0 80px;
  min-height: 85vh;
  background: var(--bg-primary);
  color: var(--text-main);
}

.detail-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.detail-breadcrumb a {
  color: var(--text-muted);
  text-decoration: none;
  transition: var(--transition);
}

.detail-breadcrumb a:hover {
  color: var(--gold-primary);
}

.detail-breadcrumb i {
  font-size: 0.7rem;
}

.active-crumb {
  color: var(--gold-primary);
  font-weight: 600;
}

.article-header {
  margin-bottom: 30px;
}

.header-tags-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.article-cat-badge {
  background: rgba(212, 175, 55, 0.15);
  border: 1px solid var(--border-gold);
  color: var(--gold-primary);
  font-size: 0.82rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 4px;
}

.meta-item {
  font-size: 0.85rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.article-main-title {
  font-size: 2.2rem;
  font-family: var(--font-heading);
  line-height: 1.35;
  color: var(--text-main);
  margin-bottom: 20px;
}

.author-info-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  width: fit-content;
}

.author-avatar-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold-primary);
  font-size: 1.1rem;
}

.author-name-text {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-main);
}

.author-desc-text {
  color: var(--text-muted);
  font-size: 0.78rem;
}

.article-cover-img {
  margin: 30px 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-color);
  max-height: 480px;
  background: #000;
}

.article-cover-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.article-lead-box {
  position: relative;
  background: rgba(212, 175, 55, 0.08);
  border-left: 4px solid var(--gold-primary);
  padding: 24px 30px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  margin-bottom: 35px;
}

.quote-icon {
  position: absolute;
  top: 14px;
  right: 18px;
  font-size: 2rem;
  color: var(--gold-primary);
  opacity: 0.2;
}

.article-lead-box p {
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.65;
  color: var(--text-main);
  margin: 0;
  font-style: italic;
}

/* NỘI DUNG HTML */
.article-body-html {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-main);
  margin-bottom: 45px;
}

.article-body-html :deep(h2),
.article-body-html :deep(h3) {
  font-family: var(--font-heading);
  color: var(--text-main);
  margin: 35px 0 16px;
  line-height: 1.4;
}

.article-body-html :deep(h3) {
  font-size: 1.4rem;
  color: var(--gold-primary);
}

.article-body-html :deep(p) {
  margin-bottom: 18px;
}

.article-body-html :deep(blockquote) {
  margin: 25px 0;
  padding: 18px 24px;
  background: var(--bg-card);
  border-left: 3px solid var(--gold-primary);
  font-style: italic;
  color: var(--gold-light);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.article-body-html :deep(ul),
.article-body-html :deep(ol) {
  margin: 18px 0 25px 25px;
}

.article-body-html :deep(li) {
  margin-bottom: 10px;
}

/* CTA BOX */
.article-cta-box {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, var(--bg-card) 100%);
  border: 1px solid var(--border-gold);
  border-radius: var(--radius-md);
  padding: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 35px;
  flex-wrap: wrap;
}

.cta-box-left h3 {
  font-size: 1.25rem;
  color: var(--text-main);
  margin-bottom: 6px;
}

.cta-box-left p {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
}

/* AUTHOR BIO */
.author-bio-card {
  display: flex;
  gap: 20px;
  padding: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  margin-bottom: 40px;
  align-items: center;
}

.bio-avatar {
  width: 54px;
  height: 54px;
  border-radius: var(--radius-sm);
  background: var(--gold-gradient);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.bio-content h4 {
  font-size: 1.1rem;
  margin-bottom: 6px;
  color: var(--text-main);
}

.bio-content p {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.55;
  margin: 0;
}

.article-nav-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  padding-top: 25px;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .article-main-title {
    font-size: 1.65rem;
  }
  .article-cta-box {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
