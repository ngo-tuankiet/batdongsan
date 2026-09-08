<template>
  <div class="team-card">
    <span class="team-tag">{{ agent.tag || 'Chuyên Viên' }}</span>
    <div class="team-avatar-box">
      <img :src="agent.avatar" :alt="agent.name">
    </div>
    <h3 class="team-name">{{ agent.name }}</h3>
    <p class="team-role">{{ agent.role }}</p>

    <div class="team-specs">
      <div>
        <span>Kinh nghiệm</span>
        <strong>{{ agent.exp }}</strong>
      </div>
      <div>
        <span>Đã chốt</span>
        <strong>{{ agent.deals }}</strong>
      </div>
      <div>
        <span>Quỹ căn</span>
        <strong>{{ agent.properties?.length || 0 }} căn</strong>
      </div>
    </div>

    <div class="team-actions">
      <NuxtLink :to="`/nhan-vien/${agent.id}`" class="btn btn-gold">
        <i class="fa-solid fa-id-badge"></i> Xem Website Cá Nhân
      </NuxtLink>
      <a :href="`tel:${agent.phone.replace(/[^0-9]/g, '')}`" class="btn btn-outline-gold" style="font-size: 0.82rem; padding: 8px;">
        <i class="fa-solid fa-phone"></i> Hotline: {{ agent.phoneDisplay || agent.phone }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  agent: any;
}>();
</script>
