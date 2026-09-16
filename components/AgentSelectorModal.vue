<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="agent-selector-modal" @click.stop>
      <div class="modal-header">
        <div>
          <h3 style="font-size: 1.25rem; color: var(--gold-primary); display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-users-gear"></i> Chọn Chuyên Viên Tư Vấn
          </h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 3px;">
            Chọn chuyên viên bạn muốn đồng hành để nhận tư vấn giỏ hàng & chính sách tốt nhất
          </p>
        </div>
        <button class="modal-close-icon" @click="$emit('close')">&times;</button>
      </div>

      <div class="agent-selector-list">
        <div 
          v-for="ag in agents" 
          :key="ag.id" 
          class="agent-selector-card"
          :class="{ 'is-active': ag.id === currentAgentId }"
          @click="selectAgent(ag)"
        >
          <div class="selector-avatar-wrap">
            <img :src="ag.avatar" :alt="ag.name" class="selector-avatar">
            <span v-if="ag.id === currentAgentId" class="active-badge-dot" title="Đang được chọn">
              <i class="fa-solid fa-check"></i>
            </span>
          </div>

          <div class="selector-info">
            <div class="selector-name-row">
              <h4 class="selector-name">{{ ag.name }}</h4>
              <span class="selector-tag">{{ ag.tag || 'Chuyên Viên' }}</span>
            </div>
            <p class="selector-role">{{ ag.role }}</p>
            <div class="selector-stats">
              <span><i class="fa-regular fa-clock"></i> {{ ag.exp }}</span>
              <span>•</span>
              <span><i class="fa-solid fa-handshake"></i> {{ ag.deals }}</span>
              <span>•</span>
              <span><i class="fa-solid fa-phone"></i> {{ ag.phoneDisplay || ag.phone }}</span>
            </div>
            <p v-if="ag.slogan" class="selector-slogan">"{{ ag.slogan }}"</p>
          </div>

          <div class="selector-action">
            <button 
              type="button" 
              class="btn" 
              :class="ag.id === currentAgentId ? 'btn-gold' : 'btn-outline-gold'"
              style="padding: 7px 16px; font-size: 0.82rem; white-space: nowrap;"
              @click.stop="selectAgent(ag)"
            >
              <i :class="ag.id === currentAgentId ? 'fa-solid fa-circle-check' : 'fa-solid fa-user-check'"></i>
              {{ ag.id === currentAgentId ? 'Đang Phân Bổ' : 'Chọn Người Này' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  currentAgentId?: string;
  agents: any[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select', agent: any): void;
}>();

const selectAgent = (ag: any) => {
  emit('select', ag);
  emit('close');
};
</script>

<style scoped>
.agent-selector-modal {
  background: var(--bg-card, #132442);
  border: 1px solid var(--border-gold, #c5a059);
  border-radius: var(--radius-lg, 16px);
  width: 100%;
  max-width: 680px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-md, 0 10px 30px rgba(0,0,0,0.5));
  animation: modalFadeIn 0.25s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  padding: 18px 24px;
  border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.1));
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-close-icon {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: var(--text-muted, #94a3b8);
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
}

.modal-close-icon:hover {
  color: var(--gold-primary, #dfb76c);
}

.agent-selector-list {
  padding: 18px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.agent-selector-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  background: var(--bg-primary, #070e1b);
  border: 1px solid var(--border-color, rgba(255,255,255,0.08));
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.agent-selector-card:hover {
  border-color: var(--gold-primary, #dfb76c);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.agent-selector-card.is-active {
  border-color: var(--gold-primary, #dfb76c);
  background: rgba(212, 175, 55, 0.08);
}

.selector-avatar-wrap {
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.selector-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--gold-primary, #dfb76c);
}

.active-badge-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--gold-primary, #dfb76c);
  color: #070e1b;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--bg-card);
  font-weight: bold;
}

.selector-info {
  flex: 1;
  min-width: 0;
}

.selector-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.selector-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main, #fff);
  margin: 0;
}

.selector-tag {
  font-size: 0.68rem;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(212, 175, 55, 0.15);
  color: var(--gold-primary, #dfb76c);
  font-weight: 600;
}

.selector-role {
  font-size: 0.8rem;
  color: var(--text-muted, #94a3b8);
  margin: 2px 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selector-stats {
  font-size: 0.76rem;
  color: var(--text-sub, #cbd5e1);
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}

.selector-stats i {
  color: var(--gold-primary);
}

.selector-slogan {
  font-size: 0.75rem;
  font-style: italic;
  color: var(--text-muted, #94a3b8);
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selector-action {
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .agent-selector-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .selector-action {
    width: 100%;
    margin-top: 8px;
  }
  .selector-action button {
    width: 100%;
  }
}
</style>
