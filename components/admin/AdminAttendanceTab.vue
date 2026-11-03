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

      <div style="display: flex; gap: 10px; align-items: center;">
        <button class="btn-excel-export" @click="openExcelModal" style="font-size: 0.82rem; padding: 8px 14px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 6px rgba(16, 185, 129, 0.25);">
          <i class="fa-solid fa-file-excel"></i> Xuất Excel (Tùy Chọn Ngày)
        </button>

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

    <!-- MODAL TÙY CHỌN XUẤT FILE EXCEL (HỖ TRỢ CHỌN KỲ NGÀY 10 HOẶC KHOẢNG NGÀY BẤT KỲ) -->
    <div v-if="showExcelModal" class="modal-overlay" @click.self="showExcelModal = false">
      <div class="admin-modal-card" style="max-width: 530px;">
        <div class="modal-header">
          <h3 style="display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-file-excel" style="color: #10b981;"></i>
            Xuất File Excel Chấm Công & Lương
          </h3>
          <button class="modal-close-icon" @click="showExcelModal = false">&times;</button>
        </div>

        <div style="padding: 20px;">
          <!-- CHỌN CHU KỲ TÍNH CÔNG -->
          <div style="margin-bottom: 18px;">
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--text-main, #0f172a); display: block; margin-bottom: 8px;">
              <i class="fa-solid fa-calendar-days" style="color: var(--gold-primary);"></i> 1. Chọn chu kỳ tính chấm công:
            </label>
            
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <!-- Kỳ cty ngày 11 -> ngày 10 -->
              <label class="export-radio-box" :class="{ active: excelCycleType === 'company_10' }">
                <input type="radio" v-model="excelCycleType" value="company_10" @change="updateExcelDates" />
                <div style="flex: 1;">
                  <strong style="color: #0f172a; font-size: 0.85rem;">Kỳ theo Cty: Ngày 11 tháng trước → Ngày 10 tháng này</strong>
                  <small style="display: block; color: var(--text-muted); font-size: 0.74rem;">Chuẩn theo kỳ tính công & trả lương ngày 10 của công ty</small>
                </div>
              </label>

              <!-- Trọn vẹn tháng 1 -> cuối tháng -->
              <label class="export-radio-box" :class="{ active: excelCycleType === 'full_month' }">
                <input type="radio" v-model="excelCycleType" value="full_month" @change="updateExcelDates" />
                <div style="flex: 1;">
                  <strong style="color: #0f172a; font-size: 0.85rem;">Trọn vẹn 1 tháng: Ngày 1 → Ngày cuối tháng (30/31)</strong>
                  <small style="display: block; color: var(--text-muted); font-size: 0.74rem;">Theo tháng dương lịch chuẩn</small>
                </div>
              </label>

              <!-- Tùy chỉnh ngày bất kỳ -->
              <label class="export-radio-box" :class="{ active: excelCycleType === 'custom' }">
                <input type="radio" v-model="excelCycleType" value="custom" />
                <div style="flex: 1;">
                  <strong style="color: #0f172a; font-size: 0.85rem;">Tự chọn khoảng ngày bất kỳ (Tùy chỉnh)</strong>
                  <small style="display: block; color: var(--text-muted); font-size: 0.74rem;">Tự nhập ngày bắt đầu và kết thúc theo yêu cầu</small>
                </div>
              </label>
            </div>
          </div>

          <!-- BỘ CHỌN THỜI GIAN CỤ THỂ -->
          <div style="background: rgba(241, 245, 249, 0.7); border: 1px solid var(--border-color, #e2e8f0); border-radius: 8px; padding: 12px 14px; margin-bottom: 18px;">
            <div v-if="excelCycleType !== 'custom'" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px;">
              <span style="font-size: 0.82rem; font-weight: 600; color: #475569;">Chọn tháng chốt lương:</span>
              <input type="month" v-model="excelMonth" class="admin-input" style="width: 155px; font-weight: 700; color: var(--gold-primary);" @change="updateExcelDates" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 0.75rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Từ ngày:</label>
                <input type="date" v-model="excelFromDate" class="admin-input" style="width: 100%; font-size: 0.82rem;" :disabled="excelCycleType !== 'custom'" />
              </div>
              <div>
                <label style="font-size: 0.75rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Đến ngày:</label>
                <input type="date" v-model="excelToDate" class="admin-input" style="width: 100%; font-size: 0.82rem;" :disabled="excelCycleType !== 'custom'" />
              </div>
            </div>

            <div style="margin-top: 10px; font-size: 0.76rem; color: #059669; font-weight: 600; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-circle-check"></i> Khoảng thời gian: Từ {{ formatDisplayDate(excelFromDate) }} đến {{ formatDisplayDate(excelToDate) }} ({{ calculateDaysCount }} ngày)
            </div>
          </div>

          <!-- CHỌN LOẠI BẢNG XUẤT -->
          <div style="margin-bottom: 20px;">
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--text-main, #0f172a); display: block; margin-bottom: 8px;">
              <i class="fa-solid fa-table" style="color: #3b82f6;"></i> 2. Chọn loại bảng xuất:
            </label>
            
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <label class="export-type-row" :class="{ selected: excelExportType === 'all' }">
                <input type="radio" v-model="excelExportType" value="all" />
                <i class="fa-solid fa-layer-group" style="color: #8b5cf6; font-size: 1.1rem;"></i>
                <div>
                  <strong style="display: block; font-size: 0.85rem; color: #0f172a;">Xuất Trọn Bộ (Gồm cả 2 Sheet)</strong>
                  <small style="color: var(--text-muted); font-size: 0.74rem;">Sheet 1: Tổng Hợp Gọn + Sheet 2: Chi Tiết Các Ngày (Khuyên dùng)</small>
                </div>
              </label>

              <label class="export-type-row" :class="{ selected: excelExportType === 'summary' }">
                <input type="radio" v-model="excelExportType" value="summary" />
                <i class="fa-solid fa-table-list" style="color: #10b981; font-size: 1.1rem;"></i>
                <div>
                  <strong style="display: block; font-size: 0.85rem; color: #0f172a;">Chỉ xuất Bảng Tổng Hợp</strong>
                  <small style="color: var(--text-muted); font-size: 0.74rem;">Lược bỏ ngày chi tiết, chỉ gồm số công, tiền lương, phụ cấp xăng xe</small>
                </div>
              </label>

              <label class="export-type-row" :class="{ selected: excelExportType === 'detail' }">
                <input type="radio" v-model="excelExportType" value="detail" />
                <i class="fa-solid fa-calendar-days" style="color: #3b82f6; font-size: 1.1rem;"></i>
                <div>
                  <strong style="display: block; font-size: 0.85rem; color: #0f172a;">Chỉ xuất Bảng Chi Tiết</strong>
                  <small style="color: var(--text-muted); font-size: 0.74rem;">Chi tiết từng ngày (1, 0.5, 1.5), tô màu T7 & CN y hệt mẫu công ty</small>
                </div>
              </label>
            </div>
          </div>

          <!-- FOOTER ACTIONS -->
          <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--border-color, #e2e8f0); padding-top: 14px;">
            <button type="button" class="btn-admin-cancel" @click="showExcelModal = false">Hủy</button>
            <button type="button" class="btn-admin-primary" style="background: #10b981; border-color: #10b981; font-size: 0.85rem; padding: 8px 18px;" @click="downloadExcel">
              <i class="fa-solid fa-file-excel"></i> Tải File Excel Xuống
            </button>
          </div>
        </div>
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
const showExcelModal = ref(false);
const excelCycleType = ref<'company_10' | 'full_month' | 'custom'>('company_10');
const excelMonth = ref(new Date().toISOString().slice(0, 7));
const excelFromDate = ref('');
const excelToDate = ref('');
const excelExportType = ref<'all' | 'summary' | 'detail'>('all');

const updateExcelDates = () => {
  const [yStr, mStr] = excelMonth.value.split('-');
  let y = parseInt(yStr, 10);
  let m = parseInt(mStr, 10);

  if (excelCycleType.value === 'company_10') {
    let prevY = y;
    let prevM = m - 1;
    if (prevM === 0) {
      prevM = 12;
      prevY = y - 1;
    }
    excelFromDate.value = `${prevY}-${String(prevM).padStart(2, '0')}-11`;
    excelToDate.value = `${y}-${String(m).padStart(2, '0')}-10`;
  } else if (excelCycleType.value === 'full_month') {
    const lastDay = new Date(y, m, 0).getDate();
    excelFromDate.value = `${y}-${String(m).padStart(2, '0')}-01`;
    excelToDate.value = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  }
};

const calculateDaysCount = computed(() => {
  if (!excelFromDate.value || !excelToDate.value) return 0;
  const d1 = new Date(excelFromDate.value);
  const d2 = new Date(excelToDate.value);
  const diffTime = d2.getTime() - d1.getTime();
  if (diffTime < 0) return 0;
  return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
});

const formatDisplayDate = (dStr: string) => {
  if (!dStr) return '';
  const parts = dStr.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dStr;
};

const openExcelModal = () => {
  excelMonth.value = filterDate.value ? filterDate.value.slice(0, 7) : new Date().toISOString().slice(0, 7);
  updateExcelDates();
  showExcelModal.value = true;
};

const downloadExcel = () => {
  if (!excelFromDate.value || !excelToDate.value) {
    alert('Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc!');
    return;
  }
  showExcelModal.value = false;
  const link = document.createElement('a');
  link.href = `/api/cham-cong/export-excel?fromDate=${excelFromDate.value}&toDate=${excelToDate.value}&type=${excelExportType.value}`;
  link.download = '';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Đang tạo và tải file Excel xuống...');
};

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

.export-radio-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
}

.export-radio-box:hover {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.02);
}

.export-radio-box.active {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.06);
}

.export-radio-box input {
  margin-top: 3px;
  accent-color: #10b981;
}

.export-type-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
}

.export-type-row:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.02);
}

.export-type-row.selected {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.06);
}

.export-type-row input {
  accent-color: #3b82f6;
}
</style>
