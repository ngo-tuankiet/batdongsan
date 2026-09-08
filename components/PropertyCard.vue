<template>
  <div class="prop-card">
    <div class="prop-img-wrap">
      <img :src="property.image" :alt="property.title" class="prop-img" loading="lazy">
      <span class="prop-badge">{{ property.badge || 'Đang Bán' }}</span>
      <span class="prop-price-tag">{{ property.price }}</span>
    </div>
    <div class="prop-body">
      <div class="prop-location">
        <i class="fa-solid fa-location-dot"></i> {{ property.location || 'Phường Bến Thành, Q.1' }}
      </div>
      <h3 class="prop-title" :title="property.title">{{ property.title }}</h3>
      
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
        <button class="btn btn-outline-gold" @click="$emit('select', property)">
          <i class="fa-regular fa-eye"></i> Chi Tiết
        </button>
        <a :href="`tel:${(property.agent?.phone || '0938888999').replace(/[^0-9]/g, '')}`" class="btn btn-gold">
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
