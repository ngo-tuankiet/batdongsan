<template>
  <div>
    <div class="floating-contact-bar">
      <a href="tel:0938888999" class="float-circle-btn call" title="Gọi Hotline Sàn">
        <i class="fa-solid fa-phone"></i>
      </a>
      <a href="https://zalo.me" target="_blank" class="float-circle-btn zalo" title="Chat Zalo Sàn">
        <i class="fa-solid fa-comment-dots"></i>
      </a>
    </div>

    <!-- Toast Notification Global -->
    <div v-if="toastMsg" class="modal-overlay" style="background: transparent; pointer-events: none; z-index: 3000; justify-content: flex-end; align-items: flex-start; padding: 25px;">
      <div style="background: #10b981; color: #fff; padding: 14px 22px; border-radius: var(--radius-sm); box-shadow: var(--shadow-md); font-size: 0.92rem; font-weight: 600; display: flex; align-items: center; gap: 10px; pointer-events: auto;">
        <i class="fa-solid fa-circle-check"></i> {{ toastMsg }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { toastMsg } = useToast();
</script>
