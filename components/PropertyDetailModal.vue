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
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted); width: 40%;">Diện tích:</td><td style="font-weight: 600;">{{ property.area }}</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Kích thước:</td><td style="font-weight: 600;">{{ property.dimensions || 'Chuẩn' }}</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Kết cấu:</td><td style="font-weight: 600;">{{ property.structure || 'Chuẩn' }}</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Pháp lý:</td><td style="font-weight: 600; color: #10b981;">✓ {{ property.legal || 'Sổ hồng riêng' }}</td></tr>
          <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Dòng tiền khai thác:</td><td style="font-weight: 700; color: var(--gold-primary);">{{ property.rentIncome || 'Thương lượng' }}</td></tr>
          <tr v-if="property.agent"><td style="padding: 8px 0; color: var(--text-muted);">Chuyên viên phụ trách:</td><td style="font-weight: 600;">{{ property.agent.name }} ({{ property.agent.phoneDisplay || property.agent.phone }})</td></tr>
        </table>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a :href="`tel:${(property.agent?.phone || '0938888999').replace(/[^0-9]/g, '')}`" class="btn btn-call" style="flex: 1;">
            <i class="fa-solid fa-phone"></i> Gọi Tư Vấn: {{ property.agent?.phoneDisplay || property.agent?.phone || '0938.888.999' }}
          </a>
          <a :href="property.agent?.zalo || 'https://zalo.me'" target="_blank" class="btn btn-zalo" style="flex: 1;">
            <i class="fa-solid fa-comment-dots"></i> Nhận Bảng Pháp Lý Qua Zalo
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  property: any;
}>();

defineEmits(['close']);
</script>
