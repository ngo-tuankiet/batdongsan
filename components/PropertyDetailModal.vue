<template>
  <div v-if="property" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-dialog">
      <button class="modal-close-btn" @click="$emit('close')">&times;</button>
      
      <img :src="property.image" :alt="property.title" style="width: 100%; height: 290px; object-fit: cover;">
      <div style="padding: 26px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 15px;">
          <span class="prop-badge" style="position: static;">{{ property.badge || 'Đang Bán' }}</span>
          <span style="font-size: 1.5rem; font-weight: 800; color: var(--gold-primary);">{{ property.price }}</span>
        </div>

        <h2 style="font-size: 1.35rem; margin-bottom: 8px; color: var(--text-main);">{{ property.title }}</h2>
        <div style="color: var(--gold-primary); font-size: 0.88rem; margin-bottom: 18px;">
          <i class="fa-solid fa-location-dot"></i> {{ property.location }}
        </div>

        <p style="color: var(--text-sub); font-size: 0.94rem; line-height: 1.6; margin-bottom: 20px;">
          {{ property.description }}
        </p>

        <h4 style="font-size: 1rem; color: var(--gold-primary); margin-bottom: 10px;">THÔNG TIN KỸ THUẬT & PHÁP LÝ</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.9rem;">
          <tbody>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted); width: 40%;">Phân loại BĐS:</td><td style="font-weight: 700; color: var(--gold-primary);">{{ property.categoryId === 'nha-pho' ? 'Nhà Phố' : 'Dự Án' }}</td></tr>
          <tr v-if="property.createdAt" style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Ngày đăng:</td><td style="font-weight: 600;"><i class="fa-regular fa-calendar-days" style="color: var(--gold-primary); margin-right: 5px;"></i>{{ new Date(property.createdAt).toLocaleDateString('vi-VN') }}</td></tr>
          <tr v-if="property.ward" style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Khu vực phường:</td><td style="font-weight: 600;">{{ property.ward }}</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Diện tích:</td><td style="font-weight: 600;">{{ property.area }}</td></tr>
          <tr v-if="property.dimensions" style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Kích thước (Dài x Rộng):</td><td style="font-weight: 700; color: var(--gold-primary);"><i class="fa-solid fa-arrows-left-right-to-line"></i> {{ property.dimensions }}</td></tr>
          <tr v-if="unitPrice" style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Đơn giá / m²:</td><td style="font-weight: 700; color: #10b981;"><i class="fa-solid fa-chart-line"></i> {{ unitPrice }}</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Kết cấu:</td><td style="font-weight: 600;">{{ property.structure || 'Chuẩn' }}</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Pháp lý:</td><td style="font-weight: 600; color: #10b981;">✓ {{ property.legal || 'Sổ hồng riêng' }}</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Dòng tiền khai thác:</td><td style="font-weight: 700; color: var(--gold-primary);">{{ property.rentIncome || 'Thương lượng' }}</td></tr>
          <tr v-if="property.agent"><td style="padding: 8px 0; color: var(--text-muted);">Chuyên viên phụ trách:</td><td style="font-weight: 600;">{{ property.agent.name }} ({{ property.agent.phoneDisplay || property.agent.phone }})</td></tr>
          </tbody>
        </table>

        <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 10px;">
          <a :href="`tel:${(property.agent?.phone || '0901355446').replace(/[^0-9]/g, '')}`" class="btn btn-call" style="flex: 1;">
            <i class="fa-solid fa-phone"></i> Gọi: {{ property.agent?.phoneDisplay || property.agent?.phone || '0901.355.446' }}
          </a>
          <a :href="property.agent?.zalo || 'https://zalo.me'" target="_blank" class="btn btn-zalo" style="flex: 1;">
            <i class="fa-solid fa-comment-dots"></i> Nhắn Zalo
          </a>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <NuxtLink :to="`/bat-dong-san/${property.id}`" class="btn btn-gold" style="flex: 1.2; justify-content: center; font-size: 0.85rem; font-weight: 700;" @click="$emit('close')">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Xem Chi Tiết, Video Tour &amp; Bản Đồ Tọa Độ
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { calculatePricePerM2 } from '~/composables/usePropertyUtils';

const props = defineProps<{
  property: any;
}>();

defineEmits(['close']);

const unitPrice = computed(() => {
  if (!props.property) return '';
  return calculatePricePerM2(props.property.priceRaw, props.property.area, props.property.price);
});
</script>
