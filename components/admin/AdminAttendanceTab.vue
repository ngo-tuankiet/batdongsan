<template>
  <div class="attendance-container">
    <!-- THANH LỌC NGÀY & VĂN PHÒNG -->
    <div class="table-filter-bar" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
      <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
        <div class="filter-group">
          <span class="filter-label"><i class="fa-solid fa-calendar-day"></i> Ngày:</span>
          <input 
            v-model="filterDate" 
            type="date" 
            class="admin-input" 
            style="width: 155px; font-weight: 700; color: var(--gold-primary);" 
            @change="loadAttendance"
          />
        </div>

        <div class="filter-group">
          <span class="filter-label"><i class="fa-solid fa-building"></i> Văn phòng:</span>
          <select v-model="filterOffice" class="admin-select" @change="loadAttendance">
            <option value="all">Tất cả văn phòng</option>
            <option value="VP1">VP1 - 12 Đường số 2</option>
            <option value="VP2">VP2 - Số 6 Đường 5A</option>
            <option value="VP3">VP3 - 70D Phú Thọ</option>
          </select>
        </div>

        <button class="btn-quick-today" @click="setToday" title="Về ngày hôm nay">
          Hôm nay
        </button>
      </div>

      <div style="display: flex; gap: 10px;">
        <button class="btn-admin-primary" @click="openQuickCheckinModal">
          <i class="fa-solid fa-fingerprint"></i> + Điểm Danh / Chấm Công Hộ
        </button>
      </div>
    </div>

    <!-- KPI THỐNG KÊ NGÀY -->
    <div class="att-kpi-row">
      <div class="kpi-mini-card">
        <span class="km-label">Tổng Nhân Sự</span>
        <strong class="km-num">{{ totalEmployees }}</strong>
      </div>
      <div class="kpi-mini-card green">
        <span class="km-label">Có Mặt</span>
        <strong class="km-num">{{ countPresent }}</strong>
      </div>
      <div class="kpi-mini-card orange">
        <span class="km-label">Đi Trễ</span>
        <strong class="km-num">{{ countLate }}</strong>
      </div>
      <div class="kpi-mini-card purple">
        <span class="km-label">Đi Công Tác</span>
        <strong class="km-num">{{ countTrip }}</strong>
      </div>
    </div>

    <!-- BẢNG CHẤM CÔNG HÀNG NGÀY -->
    <div class="admin-table-container">
      <table class="admin-data-table">
        <thead>
          <tr>
            <th style="width: 75px;">Mã NV</th>
            <th>Nhân Viên</th>
            <th>Văn Phòng</th>
            <th style="text-align: center;">Giờ Vào</th>
            <th style="text-align: center;">Giờ Ra</th>
            <th style="text-align: center;">Đi Trễ</th>
            <th style="text-align: center;">Trạng Thái</th>
            <th>Ghi Chú</th>
            <th style="width: 140px; text-align: center;">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">
              <i class="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu chấm công...
            </td>
          </tr>
          <tr v-else-if="records.length === 0">
            <td colspan="9" class="empty-table">
              <i class="fa-solid fa-calendar-xmark"></i>
              <p>Chưa có dữ liệu chấm công nào trong ngày {{ filterDate }}.</p>
            </td>
          </tr>
          <tr v-for="att in records" :key="att.id">
            <td>
              <span class="code-pill">{{ att.userCode || att.agent?.code || 'NV' }}</span>
            </td>
            <td>
              <div style="display: flex; align-items: center; gap: 12px;">
                <img :src="att.agent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'" class="agent-avatar-circle" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--border-gold);" alt="" />
                <div>
                  <strong style="color: var(--text-main, #0f172a); font-size: 0.9rem; display: block;">{{ att.userName || att.agent?.name }}</strong>
                  <span style="font-size: 0.74rem; color: var(--text-muted);">{{ att.agent?.role || 'Chuyên viên' }}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="office-pill">{{ att.officeName || att.officeId || 'VP1' }}</span>
            </td>
            <td style="text-align: center; font-family: monospace; font-size: 0.95rem;">
              <span v-if="att.checkIn" style="color: #10b981; font-weight: 700;">{{ att.checkIn }}</span>
              <span v-else style="color: var(--text-muted);">-</span>
            </td>
            <td style="text-align: center; font-family: monospace; font-size: 0.95rem;">
              <span v-if="att.checkOut" style="color: #60a5fa; font-weight: 700;">{{ att.checkOut }}</span>
              <span v-else style="color: var(--text-muted);">-</span>
            </td>
            <td style="text-align: center;">
              <span v-if="att.isLate" class="late-badge">
                <i class="fa-solid fa-triangle-exclamation"></i> {{ att.lateMinutes }}p
              </span>
              <span v-else style="color: #10b981; font-size: 0.8rem;">Đúng giờ</span>
            </td>
            <td style="text-align: center;">
              <span v-if="att.isTrip || att.status === 'trip'" class="status-chip purple">
                <i class="fa-solid fa-plane"></i> Đi Công Tác
              </span>
              <span v-else-if="att.isLate" class="status-chip orange">
                <i class="fa-solid fa-clock"></i> Đi Trễ
              </span>
              <span v-else class="status-chip green">
                <i class="fa-solid fa-circle-check"></i> Có Mặt
              </span>
            </td>
            <td>
              <span style="font-size: 0.78rem; color: var(--text-muted);">{{ att.tripReason || att.note || '-' }}</span>
            </td>
            <td style="text-align: center;">
              <div style="display: flex; gap: 6px; justify-content: center;">
                <button class="action-btn delete-btn" @click="deleteRecord(att)" title="Xóa bản ghi">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL ĐIỂM DANH HỘ -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="admin-modal-card" style="max-width: 500px;">
        <div class="modal-header">
          <h3>
            <i class="fa-solid fa-fingerprint" style="color: var(--gold-primary);"></i>
            Điểm Danh / Chấm Công Hộ
          </h3>
          <button class="modal-close-icon" @click="showModal = false">&times;</button>
        </div>

        <form @submit.prevent="saveAttendance" class="modal-form">
          <div class="form-grid">
            <div class="form-col-full">
              <label>Chọn Nhân Viên *</label>
              <select v-model="modalForm.userId" class="admin-select" required>
                <option value="">-- Chọn nhân viên --</option>
                <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                  {{ emp.code || 'NV' }} - {{ emp.name }} ({{ emp.role }})
                </option>
              </select>
            </div>

            <div>
              <label>Ngày Chấm Công *</label>
              <input v-model="modalForm.date" type="date" class="admin-input" required />
            </div>

            <div>
              <label>Văn Phòng</label>
              <select v-model="modalForm.officeId" class="admin-select">
                <option value="VP1">VP1 - 12 Đường số 2</option>
                <option value="VP2">VP2 - Số 6 Đường 5A</option>
                <option value="VP3">VP3 - 70D Phú Thọ</option>
              </select>
            </div>

            <div>
              <label>Giờ Vào (Check-in)</label>
              <input v-model="modalForm.checkIn" type="time" class="admin-input" />
            </div>

            <div>
              <label>Giờ Ra (Check-out)</label>
              <input v-model="modalForm.checkOut" type="time" class="admin-input" />
            </div>

            <div class="form-col-full">
              <label class="toggle-checkbox-label">
                <input type="checkbox" v-model="modalForm.isTrip" />
                <span><i class="fa-solid fa-car-side" style="color: #10b981;"></i> Đánh dấu là ngày Đi Công Tác (Được tính chi phí công tác)</span>
              </label>
            </div>

            <div v-if="modalForm.isTrip" class="form-col-full">
              <label>Lý do / Địa điểm công tác</label>
              <input v-model="modalForm.tripReason" type="text" class="admin-input" placeholder="VD: Khảo sát căn hộ Q.1, gặp chủ nhà công chứng..." />
            </div>

            <div class="form-col-full">
              <label>Ghi chú khác</label>
              <input v-model="modalForm.note" type="text" class="admin-input" placeholder="Ghi chú thêm..." />
            </div>
          </div>

          <div class="modal-actions-footer" style="margin-top: 20px;">
            <button type="button" class="btn-admin-cancel" @click="showModal = false">Hủy</button>
            <button type="submit" class="btn-admin-primary" :disabled="saving">
              <i class="fa-solid fa-check"></i> Lưu Điểm Danh
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';

const { showToast } = useToast();

const getTodayStr = () => new Date().toISOString().slice(0, 10);
const filterDate = ref(getTodayStr());
const filterOffice = ref('all');
const loading = ref(false);
const saving = ref(false);
const showModal = ref(false);

const records = ref<any[]>([]);
const employees = ref<any[]>([]);

const modalForm = reactive({
  userId: '',
  date: getTodayStr(),
  officeId: 'VP1',
  checkIn: '09:15',
  checkOut: '12:00',
  isTrip: false,
  tripReason: '',
  note: '',
});

const setToday = () => {
  filterDate.value = getTodayStr();
  loadAttendance();
};

const loadAttendance = async () => {
  loading.value = true;
  try {
    const data: any = await $fetch(`/api/cham-cong/attendance?date=${filterDate.value}&officeId=${filterOffice.value}`);
    records.value = data || [];
  } catch (err) {
    console.error('Lỗi tải dữ liệu chấm công:', err);
  } finally {
    loading.value = false;
  }
};

const loadEmployees = async () => {
  try {
    const data: any = await $fetch('/api/agents?all=true');
    employees.value = data || [];
  } catch (err) {
    console.error('Lỗi tải nhân viên:', err);
  }
};

const totalEmployees = computed(() => employees.value.length);
const countPresent = computed(() => records.value.filter(r => !r.isTrip && !r.isLate && (r.status === 'present' || r.checkIn)).length);
const countLate = computed(() => records.value.filter(r => r.isLate).length);
const countTrip = computed(() => records.value.filter(r => r.isTrip || r.status === 'trip').length);

const openQuickCheckinModal = () => {
  modalForm.userId = employees.value[0]?.id || '';
  modalForm.date = filterDate.value;
  modalForm.officeId = 'VP1';
  modalForm.checkIn = '09:15';
  modalForm.checkOut = '12:00';
  modalForm.isTrip = false;
  modalForm.tripReason = '';
  modalForm.note = '';
  showModal.value = true;
};

const saveAttendance = async () => {
  saving.value = true;
  try {
    const res: any = await $fetch('/api/cham-cong/attendance', {
      method: 'POST',
      body: modalForm,
    });
    if (res?.success) {
      showToast('Đã lưu thông tin điểm danh thành công!');
      showModal.value = false;
      await loadAttendance();
    }
  } catch (err: any) {
    alert(err?.data?.message || 'Lỗi khi lưu điểm danh!');
  } finally {
    saving.value = false;
  }
};

const deleteRecord = async (att: any) => {
  if (!confirm(`Bạn có chắc muốn xóa bản ghi chấm công của "${att.userName || 'nhân viên'}"?`)) return;
  try {
    await $fetch(`/api/cham-cong/attendance/${att.id}`, { method: 'DELETE' });
    showToast('Đã xóa bản ghi chấm công!');
    await loadAttendance();
  } catch (err: any) {
    alert(err?.data?.message || 'Lỗi khi xóa!');
  }
};

onMounted(() => {
  loadEmployees();
  loadAttendance();
});
</script>

<style scoped>
.attendance-container {
  padding: 10px 0;
}

.btn-quick-today {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-quick-today:hover {
  background: var(--gold-primary);
  color: #000;
}

.att-kpi-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.kpi-mini-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kpi-mini-card.green { border-left: 3px solid #10b981; }
.kpi-mini-card.orange { border-left: 3px solid #f59e0b; }
.kpi-mini-card.purple { border-left: 3px solid #a855f7; }

.km-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.km-num {
  font-size: 1.45rem;
  color: var(--text-main, #0f172a);
  font-weight: 800;
}

.office-pill {
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
  background: var(--bg-secondary, #f1f5f9);
  border: 1px solid var(--border-color, #e2e8f0);
  padding: 3px 8px;
  border-radius: 4px;
}

.late-badge {
  background: rgba(239, 68, 68, 0.14);
  color: #dc2626;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
}

.status-chip.green {
  background: rgba(16, 185, 129, 0.14);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-chip.orange {
  background: rgba(245, 158, 11, 0.14);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-chip.purple {
  background: rgba(147, 51, 234, 0.14);
  color: #7c3aed;
  border: 1px solid rgba(147, 51, 234, 0.3);
}

.toggle-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--text-main, #0f172a);
  cursor: pointer;
  font-weight: 600;
}

.toggle-checkbox-label input {
  width: 18px;
  height: 18px;
  accent-color: #d4af37;
}
</style>
