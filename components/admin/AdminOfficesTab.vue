<template>
  <div class="offices-container">
    <div class="table-filter-bar" style="margin-bottom: 24px;">
      <div>
        <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main, #0f172a); margin: 0 0 4px;">
          <i class="fa-solid fa-wifi" style="color: var(--gold-primary);"></i>
          Quản Lý Văn Phòng & Mạng WiFi Điểm Danh
        </h3>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">
          Cấu hình tên WiFi và dải địa chỉ IP mạng nội bộ của từng văn phòng để xác thực khi nhân viên chấm công.
        </p>
      </div>
    </div>

    <div class="offices-grid">
      <div v-for="office in offices" :key="office.id" class="office-card">
        <div class="office-head">
          <div>
            <span class="office-id-tag">{{ office.id }}</span>
            <h4 class="office-name">{{ office.name }}</h4>
            <span class="office-address"><i class="fa-solid fa-location-dot"></i> {{ office.address }}</span>
          </div>
          <button class="btn-edit-office" @click="openEditModal(office)">
            <i class="fa-solid fa-pen"></i> Sửa Cấu Hình
          </button>
        </div>

        <div class="office-body">
          <div class="wifi-info-item">
            <span class="wi-label"><i class="fa-solid fa-wifi" style="color: #60a5fa;"></i> Tên WiFi (SSID):</span>
            <strong class="wi-val">{{ office.ssid || 'Chưa đặt' }}</strong>
          </div>

          <div class="wifi-info-item">
            <span class="wi-label"><i class="fa-solid fa-network-wired" style="color: #10b981;"></i> Dải IP Hợp Lệ:</span>
            <div class="ip-tags-wrap">
              <span v-for="(ip, idx) in parseNetworks(office.networks)" :key="idx" class="ip-tag">
                {{ ip }}
              </span>
              <span v-if="parseNetworks(office.networks).length === 0" style="color: var(--text-muted); font-size: 0.75rem;">
                Chưa gán dải IP
              </span>
            </div>
          </div>

          <div class="wifi-info-item">
            <span class="wi-label"><i class="fa-solid fa-clock" style="color: #f59e0b;"></i> Giờ Vào / Ra:</span>
            <strong class="wi-val">{{ office.workStart || '09:30' }} - {{ office.workEnd || '12:00' }}</strong>
          </div>

          <!-- Phòng ban thuộc VP -->
          <div style="margin-top: 14px; border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 12px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 6px;">Phòng ban trực thuộc:</span>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <span 
                v-for="d in departments.filter(dep => dep.officeId === office.id)" 
                :key="d.id"
                class="dep-tag"
              >
                {{ d.name }}
              </span>
              <span v-if="departments.filter(dep => dep.officeId === office.id).length === 0" style="color: var(--text-muted); font-size: 0.72rem;">
                Chưa gán phòng ban
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL SỬA VĂN PHÒNG & WIFI -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="admin-modal-card" style="max-width: 520px;">
        <div class="modal-header">
          <h3>
            <i class="fa-solid fa-wifi" style="color: var(--gold-primary);"></i>
            Cấu Hình Văn Phòng & WiFi {{ editForm.id }}
          </h3>
          <button class="modal-close-icon" @click="showModal = false">&times;</button>
        </div>

        <form @submit.prevent="saveOffice" class="modal-form">
          <div class="form-grid">
            <div class="form-col-full">
              <label>Tên Văn Phòng *</label>
              <input v-model="editForm.name" type="text" class="admin-input" required />
            </div>

            <div class="form-col-full">
              <label>Địa Chỉ Văn Phòng</label>
              <input v-model="editForm.address" type="text" class="admin-input" />
            </div>

            <div>
              <label>Tên Sóng WiFi (SSID)</label>
              <input v-model="editForm.ssid" type="text" class="admin-input" placeholder="VD: BDS_BenThanh" />
            </div>

            <div>
              <label>Phút Cho Phép Trễ</label>
              <input v-model.number="editForm.lateGraceMinutes" type="number" min="0" max="60" class="admin-input" />
            </div>

            <div>
              <label>Giờ Vào Tiêu Chuẩn</label>
              <input v-model="editForm.workStart" type="time" class="admin-input" />
            </div>

            <div>
              <label>Giờ Ra Tiêu Chuẩn</label>
              <input v-model="editForm.workEnd" type="time" class="admin-input" />
            </div>

            <div class="form-col-full">
              <label>Dải Địa Chỉ IP Mạng Hợp Lệ (Cách nhau bằng dấu phẩy)</label>
              <input 
                v-model="networksInput" 
                type="text" 
                class="admin-input" 
                placeholder="VD: 192.168.1.91, 116.109.185., 171.240.251." 
              />
              <small style="color: var(--text-muted); font-size: 0.72rem; margin-top: 4px; display: block;">
                Nhân viên phải kết nối IP bắt đầu bằng các dải trên thì mới hợp lệ điểm danh.
              </small>
            </div>
          </div>

          <div class="modal-actions-footer" style="margin-top: 20px;">
            <button type="button" class="btn-admin-cancel" @click="showModal = false">Hủy</button>
            <button type="submit" class="btn-admin-primary" :disabled="saving">
              <i class="fa-solid fa-check"></i> Lưu Cấu Hình
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

const { showToast } = useToast();

const offices = ref<any[]>([]);
const departments = ref<any[]>([]);
const showModal = ref(false);
const saving = ref(false);
const networksInput = ref('');

const editForm = reactive({
  id: '',
  name: '',
  address: '',
  ssid: '',
  workStart: '09:30',
  workEnd: '12:00',
  lateGraceMinutes: 15,
});

const parseNetworks = (raw: any): string[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return [raw];
  }
};

const loadData = async () => {
  try {
    const [offs, deps]: any = await Promise.all([
      $fetch('/api/cham-cong/offices'),
      $fetch('/api/cham-cong/departments'),
    ]);
    offices.value = offs || [];
    departments.value = deps || [];
  } catch (err) {
    console.error('Lỗi tải văn phòng:', err);
  }
};

const openEditModal = (o: any) => {
  editForm.id = o.id;
  editForm.name = o.name;
  editForm.address = o.address;
  editForm.ssid = o.ssid || '';
  editForm.workStart = o.workStart || '09:30';
  editForm.workEnd = o.workEnd || '12:00';
  editForm.lateGraceMinutes = o.lateGraceMinutes || 15;
  networksInput.value = parseNetworks(o.networks).join(', ');
  showModal.value = true;
};

const saveOffice = async () => {
  saving.value = true;
  try {
    const nets = networksInput.value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    await $fetch('/api/cham-cong/offices', {
      method: 'PUT',
      body: {
        ...editForm,
        networks: nets,
      },
    });
    showToast(`Đã lưu cấu hình văn phòng ${editForm.name}!`);
    showModal.value = false;
    await loadData();
  } catch (err: any) {
    alert(err?.data?.message || 'Lỗi khi lưu văn phòng!');
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.offices-container {
  padding: 10px 0;
}

.offices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 20px;
}

.office-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md, 14px);
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #e2e8f0);
}

.office-head {
  padding: 18px 22px;
  background: var(--bg-secondary, #f8fafc);
  border-bottom: 1.5px solid var(--border-color, #e2e8f0);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.office-id-tag {
  font-size: 0.7rem;
  font-weight: 800;
  background: rgba(212, 175, 55, 0.18);
  color: #b8860b;
  border: 1px solid rgba(212, 175, 55, 0.35);
  padding: 2px 7px;
  border-radius: 4px;
}

.office-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
  margin: 6px 0 3px;
}

.office-address {
  font-size: 0.78rem;
  color: var(--text-muted, #64748b);
}

.btn-edit-office {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #cbd5e1);
  color: var(--text-main, #0f172a);
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-edit-office:hover {
  background: #d4af37;
  color: #111827;
  border-color: #d4af37;
}

.office-body {
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wifi-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 0.84rem;
}

.wi-label {
  color: var(--text-muted, #64748b);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.wi-val {
  color: var(--text-main, #0f172a);
  font-weight: 700;
}

.ip-tags-wrap {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.ip-tag {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.25);
  font-size: 0.74rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  font-family: monospace;
}

.dep-tag {
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
  border: 1px solid rgba(37, 99, 235, 0.25);
  font-size: 0.74rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
}
</style>
