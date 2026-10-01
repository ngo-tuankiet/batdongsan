<template>
  <div class="offices-container">
    <div class="table-filter-bar" style="margin-bottom: 20px;">
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

    <!-- BANNER NHẬN DIỆN MẠNG WIFI TỰ ĐỘNG -->
    <div class="auto-wifi-banner">
      <div class="awb-left">
        <div class="awb-icon">
          <i class="fa-solid fa-wifi"></i>
        </div>
        <div>
          <div class="awb-title">
            <span>Nhận Diện WiFi Văn Phòng Tự Động</span>
            <span v-if="currentNetwork.matchedOffice" class="badge-matched-ok">
              <i class="fa-solid fa-circle-check"></i> Đang khớp với: {{ currentNetwork.matchedOffice.name }}
            </span>
            <span v-else class="badge-not-matched">
              <i class="fa-solid fa-triangle-exclamation"></i> Mạng hiện tại chưa gán vào văn phòng
            </span>
          </div>
          <div class="awb-desc">
            IP thiết bị hiện tại: <strong>{{ currentNetwork.ip || 'Đang nhận diện...' }}</strong>
            <span style="margin: 0 8px; opacity: 0.4;">|</span>
            Dải mạng tự động: <strong style="color: #059669;">{{ currentNetwork.subnet || '...' }}</strong>
          </div>
        </div>
      </div>

      <div class="awb-actions">
        <button class="btn-awb-refresh" @click="detectMyNetwork" :disabled="detectingNet" title="Quét lại mạng hiện tại">
          <i class="fa-solid fa-arrows-rotate" :class="{ 'fa-spin': detectingNet }"></i> Quét Lại
        </button>

        <div class="dropdown-assign-wrap">
          <button class="btn-awb-assign" @click="showAssignMenu = !showAssignMenu">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Lấy WiFi Này Gán Cho... <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; margin-left: 4px;"></i>
          </button>
          <div v-if="showAssignMenu" class="assign-menu-popover">
            <div 
              v-for="o in offices" 
              :key="o.id" 
              class="assign-menu-item"
              @click="assignCurrentNetToOffice(o)"
            >
              <i class="fa-solid fa-building" style="color: var(--gold-primary);"></i>
              <div>
                <strong>{{ o.name }}</strong>
                <small style="display: block; font-size: 0.7rem; color: var(--text-muted);">Mã: {{ o.id }}</small>
              </div>
            </div>
          </div>
        </div>
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
          <div class="office-head-btns">
            <button class="btn-quick-wifi" @click="quickAssignMyNetwork(office)" title="Gán dải WiFi/IP hiện tại của máy này vào văn phòng">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Lấy WiFi Máy Này
            </button>
            <button class="btn-edit-office" @click="openEditModal(office)">
              <i class="fa-solid fa-pen"></i> Sửa Cấu Hình
            </button>
          </div>
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
      <div class="admin-modal-card" style="max-width: 540px;">
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

            <!-- MỤC LẤY WIFI TỰ ĐỘNG TRONG MODAL -->
            <div class="form-col-full">
              <div class="modal-auto-wifi-helper">
                <div class="mawh-info">
                  <i class="fa-solid fa-network-wired" style="color: #059669; font-size: 1.1rem;"></i>
                  <div>
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-main, #0f172a); display: block;">
                      IP mạng máy hiện tại: <code style="color: #059669;">{{ currentNetwork.ip || 'Chưa phát hiện' }}</code>
                    </span>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">
                      Dải mạng tự động: <code>{{ currentNetwork.subnet || '...' }}</code>
                    </span>
                  </div>
                </div>
                <button type="button" class="btn-modal-auto-fill" @click="autoFillNetwork">
                  <i class="fa-solid fa-plus"></i> Thêm Dải Này Vào Cấu Hình
                </button>
              </div>
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
const showAssignMenu = ref(false);
const detectingNet = ref(false);

const currentNetwork = ref<{
  ip: string;
  subnet: string;
  matchedOffice: any;
}>({
  ip: '',
  subnet: '',
  matchedOffice: null,
});

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

const detectMyNetwork = async () => {
  detectingNet.value = true;
  try {
    const res: any = await $fetch('/api/cham-cong/my-network');
    if (res && res.success) {
      currentNetwork.value = {
        ip: res.ip || '',
        subnet: res.subnet || '',
        matchedOffice: res.matchedOffice || null,
      };
    }
  } catch (err) {
    console.error('Lỗi nhận diện mạng:', err);
  } finally {
    detectingNet.value = false;
  }
};

const autoFillNetwork = () => {
  if (!currentNetwork.value.subnet) {
    detectMyNetwork();
    return;
  }
  const prefix = currentNetwork.value.subnet;
  const currentList = networksInput.value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (!currentList.includes(prefix)) {
    currentList.push(prefix);
    networksInput.value = currentList.join(', ');
    showToast(`Đã thêm dải mạng ${prefix} vào ô cấu hình! Nhớ bấm "Lưu Cấu Hình".`);
  } else {
    showToast(`Dải mạng ${prefix} đã có trong danh sách!`);
  }
};

const assignCurrentNetToOffice = async (office: any) => {
  showAssignMenu.value = false;
  if (!currentNetwork.value.subnet) {
    await detectMyNetwork();
  }
  const prefix = currentNetwork.value.subnet;
  if (!prefix) return;

  const nets = parseNetworks(office.networks);
  if (!nets.includes(prefix)) {
    nets.push(prefix);
    try {
      await $fetch('/api/cham-cong/offices', {
        method: 'PUT',
        body: {
          id: office.id,
          name: office.name,
          address: office.address,
          ssid: office.ssid,
          workStart: office.workStart,
          workEnd: office.workEnd,
          lateGraceMinutes: office.lateGraceMinutes,
          networks: nets,
        },
      });
      showToast(`Đã gán dải mạng WiFi [${prefix}] cho văn phòng ${office.name}!`);
      await loadData();
      await detectMyNetwork();
    } catch (err: any) {
      alert(err?.data?.message || 'Lỗi khi cập nhật văn phòng!');
    }
  } else {
    showToast(`Văn phòng ${office.name} đã chứa dải mạng [${prefix}] rồi.`);
  }
};

const quickAssignMyNetwork = async (office: any) => {
  await assignCurrentNetToOffice(office);
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
    await detectMyNetwork();
  } catch (err: any) {
    alert(err?.data?.message || 'Lỗi khi lưu văn phòng!');
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadData();
  detectMyNetwork();
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

/* BANNER TỰ ĐỘNG NHẬN DIỆN WIFI */
.auto-wifi-banner {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%);
  border: 1.5px solid rgba(16, 185, 129, 0.3);
  border-radius: var(--radius-md, 14px);
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.05);
}

.awb-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.awb-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #10b981;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
  flex-shrink: 0;
}

.awb-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 3px;
}

.badge-matched-ok {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.35);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-not-matched {
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.35);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.awb-desc {
  font-size: 0.78rem;
  color: var(--text-muted, #64748b);
}

.awb-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-awb-refresh {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #cbd5e1);
  color: var(--text-main, #0f172a);
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn-awb-refresh:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.dropdown-assign-wrap {
  position: relative;
}

.btn-awb-assign {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: #ffffff;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
  transition: all 0.2s;
}

.btn-awb-assign:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.assign-menu-popover {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #cbd5e1);
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  min-width: 220px;
  z-index: 100;
  overflow: hidden;
  padding: 6px;
}

.assign-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--text-main, #0f172a);
}

.assign-menu-item:hover {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.office-head-btns {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-quick-wifi {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
}

.btn-quick-wifi:hover {
  background: #059669;
  color: #ffffff;
  border-color: #059669;
  transform: translateY(-1px);
}

.modal-auto-wifi-helper {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.mawh-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-modal-auto-fill {
  background: #059669;
  color: #ffffff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
}

.btn-modal-auto-fill:hover {
  background: #047857;
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
