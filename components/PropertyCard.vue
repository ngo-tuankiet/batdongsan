<template>
  <div class="prop-card">
    <NuxtLink :to="`/bat-dong-san/${property.id}`" class="prop-img-wrap" style="display: block; text-decoration: none;">
      <img :src="property.image" :alt="property.title" class="prop-img" loading="lazy">
      <span class="prop-badge">{{ property.badge || 'Đang Bán' }}</span>
      <span class="prop-price-tag">{{ property.price }}</span>
    </NuxtLink>
    <div class="prop-body">
      <div class="prop-location" style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">
        <span v-if="property.categoryId === 'nha-pho'" class="prop-type-pill house">
          Nhà Phố <span v-if="property.province || property.ward">• {{ [property.province, property.ward].filter(Boolean).join(' • ').replace(/Phường /g, 'P. ') }}</span>
        </span>
        <span v-else-if="property.categoryId === 'du-an'" class="prop-type-pill project">
          Dự Án <span v-if="property.province || property.ward">• {{ [property.province, property.ward].filter(Boolean).join(' • ').replace(/Phường /g, 'P. ') }}</span>
        </span>
        <span><i class="fa-solid fa-location-dot"></i> {{ property.location || 'TP.HCM' }}</span>
      </div>
      <NuxtLink :to="`/bat-dong-san/${property.id}`" style="text-decoration: none;">
        <h3 class="prop-title" :title="property.title">{{ property.title }}</h3>
      </NuxtLink>
      
      <div class="prop-meta-grid">
        <div class="prop-meta-item">
          <span>Diện tích</span>
          <strong>{{ property.area }}</strong>
        </div>
        <div class="prop-meta-item">
          <span>Kết cấu</span>
          <strong>{{ property.structure || property.dimensions || 'Chuẩn' }}</strong>
        </div>
        <div class="prop-meta-item">
          <span>Pháp lý</span>
          <strong>{{ property.legal ? 'Sổ hồng' : 'Chuẩn' }}</strong>
        </div>
      </div>

      <div class="prop-agent-tag" v-if="property.agent">
        <i class="fa-solid fa-user-tie" style="color: var(--gold-primary);"></i>
        <span>Phụ trách: <strong>{{ property.agent.name }}</strong></span>
      </div>

      <div class="prop-actions">
        <NuxtLink :to="`/bat-dong-san/${property.id}`" class="btn btn-outline-gold">
          <i class="fa-regular fa-eye"></i> Chi Tiết
        </NuxtLink>
        <a :href="`tel:${(property.agent?.phone || '0912131329').replace(/[^0-9]/g, '')}`" class="btn btn-gold">
          <i class="fa-solid fa-phone"></i> Xem Nhà
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  property: any;
}>();

defineEmits(['select']);
</script>

<style scoped>
.prop-type-pill {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 4px;
  display: inline-block;
}
.prop-type-pill.house {
  background: rgba(212, 175, 55, 0.15);
  color: var(--gold-primary);
  border: 1px solid rgba(212, 175, 55, 0.35);
}
.prop-type-pill.project {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.35);
}
</style>
