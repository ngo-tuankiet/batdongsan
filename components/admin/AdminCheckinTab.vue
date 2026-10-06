<template>
  <div class="checkin-container">
    <!-- TIÊU ĐỀ PHÂN HỆ VÀ THỜI GIAN THỰC -->
    <div class="checkin-top-header">
      <div>
        <h2 class="checkin-page-title">
          <i class="fa-solid fa-wifi" style="color: #6366f1;"></i>
          Chấm Công WiFi
        </h2>
        <p class="checkin-subtitle">Hệ thống điểm danh tự động qua mạng nội bộ Bến Thành Land</p>
      </div>
      <div class="realtime-badge">
        <i class="fa-regular fa-clock"></i>
        <span>{{ currentDayOfWeek }}, {{ currentDateFormatted }} — {{ currentTimeFormatted }}</span>
      </div>
    </div>

    <!-- KHỐI NỘI DUNG CHÍNH: 2 CỘT -->
    <div class="checkin-grid">
      <!-- CỘT TRÁI: BẢNG ĐIỀU KHIỂN CHẤM CÔNG CHÍNH (GRADIENT PURPLE) -->
      <div class="checkin-hero-card">
        <!-- Đồng hồ thời gian thực -->
        <div class="clock-display">
          <div class="digital-time">{{ currentTimeFormatted }}</div>
          <div class="digital-date">{{ currentDayOfWeek }}, ngày {{ currentDateFormatted }}</div>
        </div>

        <!-- Trạng thái kết nối WiFi văn phòng -->
        <div class="wifi-status-box">
          <div class="wifi-indicator">
            <span class="pulse-dot"></span>
            <strong>{{ currentWifiName }}</strong>
          </div>
          <p class="wifi-desc">
            Đã kết nối mạng <strong>{{ activeOfficeName }}</strong> — có thể chấm công ngay
          </p>
        </div>

        <!-- 3 Nút Thao Tác Nhanh Lớn -->
        <div class="action-tiles-grid">
          <!-- 1. Nút Chấm Công Vào -->
          <button 
            type="button" 
            class="action-tile in-tile" 
            :class="{ 'tile-done': todayRecord?.checkIn }"
            @click="handleCheckIn"
            :disabled="actionLoading"
          >
            <div class="tile-icon-box">
              <i class="fa-solid fa-arrow-right-to-bracket"></i>
            </div>
            <div class="tile-title">Chấm công vào</div>
            <div class="tile-sub">
              {{ todayRecord?.checkIn ? `Đã vào: ${todayRecord.checkIn}` : 'Vào ca làm việc' }}
            </div>
          </button>

          <!-- 2. Nút Báo Đi Công Tác -->
          <button 
            type="button" 
            class="action-tile trip-tile" 
            :class="{ 'tile-done': todayRecord?.isTrip }"
            @click="openTripModal"
            :disabled="actionLoading"
          >
            <div class="tile-icon-box">
              <i class="fa-solid fa-car-side"></i>
            </div>
            <div class="tile-title">Đi công tác</div>
            <div class="tile-sub">
              {{ todayRecord?.isTrip ? 'Đang công tác' : 'Không cần WiFi' }}
            </div>
          </button>

          <!-- 3. Nút Báo Vắng / Nghỉ -->
          <button 
            type="button" 
            class="action-tile leave-tile" 
            @click="openLeaveModal"
            :disabled="actionLoading"
          >
            <div class="tile-icon-box">
              <i class="fa-solid fa-calendar-xmark"></i>
            </div>
            <div class="tile-title">Báo Vắng</div>
            <div class="tile-sub">Gửi cấp trên duyệt</div>
          </button>
        </div>

        <!-- Hàng nút hành động phụ -->
        <div class="action-footer-bar">
          <button type="button" class="btn-hero-action light" @click="loadTodayRecord" :disabled="actionLoading">
            <i class="fa-solid fa-arrows-rotate" :class="{ 'fa-spin': actionLoading }"></i>
            Cập nhật trạng thái
          </button>

          <button 
            type="button" 
            class="btn-hero-action primary" 
            @click="handleCheckOut"
            :disabled="actionLoading || !todayRecord?.checkIn"
            :title="!todayRecord?.checkIn ? 'Cần chấm công vào trước' : 'Bấm để ghi nhận giờ về'"
          >
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            {{ todayRecord?.checkOut ? `Đã ra: ${todayRecord.checkOut} (Cập nhật lại)` : 'Chấm công ra' }}
          </button>
        </div>
      </div>

      <!-- CỘT PHẢI: 2 CARD THÔNG TIN CỦA TÔI -->
      <div class="checkin-side-col">
        <!-- CARD 1: HÔM NAY CỦA BẠN -->
        <div class="info-card">
          <div class="info-card-header">
            <div class="ich-left">
              <i class="fa-solid fa-calendar-check" style="color: #6366f1;"></i>
              <strong>Hôm nay</strong>
            </div>
            <span v-if="todayRecord?.isTrip" class="status-pill purple">
              <i class="fa-solid fa-plane"></i> Đi công tác
            </span>
            <span v-else-if="todayRecord?.isLate" class="status-pill orange">
              <i class="fa-solid fa-clock"></i> Đi muộn ({{ todayRecord.lateMinutes }}p)
            </span>
            <span v-else-if="todayRecord?.checkIn" class="status-pill green">
              <i class="fa-solid fa-check"></i> Đúng giờ
            </span>
            <span v-else class="status-pill gray">
              Chưa chấm công
            </span>
          </div>

          <!-- 2 Ô Giờ Vào - Giờ Ra Lớn -->
          <div class="time-pills-row">
            <div class="time-pill in">
              <span class="tp-label">Giờ vào</span>
              <strong class="tp-value">{{ todayRecord?.checkIn || '--:--' }}</strong>
            </div>
            <div class="time-pill out">
              <span class="tp-label">Giờ ra</span>
              <strong class="tp-value">{{ todayRecord?.checkOut || '--:--' }}</strong>
            </div>
          </div>

          <!-- Chi tiết lương công & giờ chuẩn -->
          <div class="today-detail-list">
            <div class="td-row">
              <span class="td-label">Lương / ngày công:</span>
              <strong class="td-value">{{ formatVND(rates.salaryPerDay || 50000) }}</strong>
            </div>
            <div class="td-row">
              <span class="td-label">Phụ cấp công tác:</span>
              <strong class="td-value text-green">
                {{ todayRecord?.isTrip ? `+ ${formatVND(rates.tripAllowance || 50000)}` : '0 đ' }}
              </strong>
            </div>
            <div class="td-row">
              <span class="td-label">Giờ vào chuẩn:</span>
              <span class="td-value text-muted">
                {{ standardStartTime }} (trễ tối đa {{ graceMinutes }} phút)
              </span>
            </div>
            <div class="td-row" v-if="todayRecord?.note || todayRecord?.tripReason">
              <span class="td-label">Ghi chú:</span>
              <span class="td-value text-muted">{{ todayRecord.tripReason || todayRecord.note }}</span>
            </div>
          </div>
        </div>

        <!-- CARD 2: VĂN PHÒNG & THÔNG TIN CỦA TÔI -->
        <div class="info-card">
          <div class="info-card-header">
            <div class="ich-left">
              <i class="fa-solid fa-id-card-clip" style="color: #10b981;"></i>
              <strong>Văn phòng của tôi</strong>
            </div>
            <span class="office-tag">{{ activeOfficeCode }}</span>
          </div>

          <div class="my-office-details">
            <div class="mo-row">
              <span class="mo-label">Nhân viên:</span>
              <strong class="mo-value">{{ userDisplayName }} ({{ userDisplayCode }})</strong>
            </div>
            <div class="mo-row">
              <span class="mo-label">Văn phòng:</span>
              <div class="mo-value-select">
                <select v-model="selectedOfficeId" class="office-quick-select" @change="onOfficeChange">
                  <option v-for="off in officeOptions" :key="off.id" :value="off.id">
                    {{ off.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="mo-row">
              <span class="mo-label">Phòng ban:</span>
              <span class="mo-value text-muted">{{ userDepartmentName }}</span>
            </div>
            <div class="mo-row">
              <span class="mo-label">Tên Wi-Fi:</span>
              <span class="mo-value text-green font-bold">{{ currentWifiName }}</span>
            </div>
            <div class="mo-row">
              <span class="mo-label">Mạng đang dùng:</span>
              <span class="network-badge">{{ activeOfficeName }}</span>
            </div>
            <div class="mo-row">
              <span class="mo-label">IP thiết bị:</span>
              <span class="mo-value text-muted font-mono">{{ clientIp }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PHẦN LỊCH SỬ CHẤM CÔNG CỦA TÔI TRONG THÁNG -->
    <div class="my-history-section">
      <div class="mhs-header">
        <div>
          <h3><i class="fa-solid fa-clock-rotate-left" style="color: var(--gold-primary);"></i> Lịch Sử Chấm Công Của Tôi (Tháng {{ currentMonthFormatted }})</h3>
          <p>Bảng theo dõi ngày công thực tế của riêng bạn</p>
        </div>
        <div class="mhs-stats-summary">
          <div class="stat-badge">
            Tổng ngày làm: <strong>{{ myMonthlyRecords.filter(r => r.checkIn).length }} ngày</strong>
          </div>
          <div class="stat-badge green">
            Công tác: <strong>{{ myMonthlyRecords.filter(r => r.isTrip).length }} ngày</strong>
          </div>
          <div class="stat-badge orange">
            Đi trễ: <strong>{{ myMonthlyRecords.filter(r => r.isLate).length }} lần</strong>
          </div>
        </div>
      </div>

      <div class="admin-table-container">
        <table class="admin-data-table">
          <thead>
            <tr>
              <th style="width: 120px;">Ngày</th>
              <th>Văn Phòng</th>
              <th style="text-align: center;">Giờ Vào</th>
              <th style="text-align: center;">Giờ Ra</th>
              <th style="text-align: center;">Đi Trễ</th>
              <th style="text-align: center;">Trạng Thái</th>
              <th>Ghi Chú / Địa Điểm</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="historyLoading">
              <td colspan="7" style="text-align: center; padding: 30px; color: var(--text-muted);">
                <i class="fa-solid fa-spinner fa-spin"></i> Đang tải lịch sử chấm công...
              </td>
            </tr>
            <tr v-else-if="myMonthlyRecords.length === 0">
              <td colspan="7" class="empty-table">
                <i class="fa-solid fa-calendar-xmark"></i>
                <p>Bạn chưa có dữ liệu chấm công nào trong tháng này.</p>
              </td>
            </tr>
            <tr v-for="rec in myMonthlyRecords" :key="rec.id">
              <td style="font-weight: 600; color: var(--gold-primary);">
                {{ rec.date }}
              </td>
              <td>
                <span class="office-pill">{{ rec.officeName || rec.officeId || 'VP1' }}</span>
              </td>
              <td style="text-align: center; font-family: monospace; font-weight: 700; color: #10b981;">
                {{ rec.checkIn || '-' }}
              </td>
              <td style="text-align: center; font-family: monospace; font-weight: 700; color: #3b82f6;">
                {{ rec.checkOut || '-' }}
              </td>
              <td style="text-align: center;">
                <span v-if="rec.isLate" class="late-badge">
                  <i class="fa-solid fa-triangle-exclamation"></i> {{ rec.lateMinutes }}p
                </span>
                <span v-else-if="rec.checkIn" style="color: #10b981; font-size: 0.8rem;">Đúng giờ</span>
                <span v-else style="color: var(--text-muted);">-</span>
              </td>
              <td style="text-align: center;">
                <span v-if="rec.isTrip" class="status-chip purple">
                  <i class="fa-solid fa-plane"></i> Đi Công Tác
                </span>
                <span v-else-if="rec.isLate" class="status-chip orange">
                  <i class="fa-solid fa-clock"></i> Đi Trễ
                </span>
                <span v-else-if="rec.checkIn" class="status-chip green">
                  <i class="fa-solid fa-circle-check"></i> Có Mặt
                </span>
                <span v-else class="status-chip gray">Vắng</span>
              </td>
              <td style="color: var(--text-muted); font-size: 0.82rem;">
                {{ rec.tripReason || rec.note || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL BÁO ĐI CÔNG TÁC -->
    <div v-if="showTripModal" class="modal-overlay" @click.self="showTripModal = false">
      <div class="admin-modal-card" style="max-width: 480px;">
        <div class="modal-header">
          <h3>
            <i class="fa-solid fa-car-side" style="color: #8b5cf6;"></i>
            Báo Đi Công Tác Ngoài Văn Phòng
          </h3>
          <button class="modal-close-icon" @click="showTripModal = false">&times;</button>
        </div>

        <form @submit.prevent="submitTripRecord" class="modal-form" style="padding-top: 14px;">
          <div class="form-grid">
            <div class="form-col-full">
              <label>Địa điểm / Lý do công tác *</label>
              <input 
                v-model="tripForm.reason" 
                type="text" 
                class="admin-input" 
                placeholder="VD: Tiếp khách Long An, xem dự án Q.7..." 
                required 
              />
            </div>

            <div class="form-col-full">
              <label>Giờ bắt đầu công tác</label>
              <input v-model="tripForm.checkIn" type="time" class="admin-input" />
              <small style="color: var(--text-muted); font-size: 0.72rem; margin-top: 4px; display: block;">
                Đi công tác không yêu cầu kết nối mạng WiFi văn phòng và được ghi nhận phụ cấp công tác.
              </small>
            </div>
          </div>

          <div class="modal-actions-footer" style="margin-top: 20px;">
            <button type="button" class="btn-admin-cancel" @click="showTripModal = false">Đóng</button>
            <button type="submit" class="btn-admin-primary" :disabled="actionLoading" style="background: linear-gradient(135deg, #8b5cf6, #6366f1);">
              <i class="fa-solid fa-paper-plane"></i> Xác Nhận Đi Công Tác
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';

const { showToast } = useToast();

const props = defineProps<{
  currentUser?: any;
}>();

const emit = defineEmits<{
  (e: 'navigate-tab', tab: string): void;
}>();

// Đồng hồ thời gian thực
const now = ref(new Date());
let timerInterval: any = null;

const currentDayOfWeek = computed(() => {
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  return days[now.value.getDay()];
});

const currentDateFormatted = computed(() => {
  const d = String(now.value.getDate()).padStart(2, '0');
  const m = String(now.value.getMonth() + 1).padStart(2, '0');
  const y = now.value.getFullYear();
  return `${d}/${m}/${y}`;
});

const todayDateIso = computed(() => {
  return now.value.toISOString().slice(0, 10);
});

const currentMonthFormatted = computed(() => {
  const m = String(now.value.getMonth() + 1).padStart(2, '0');
  const y = now.value.getFullYear();
  return `${m}/${y}`;
});

const currentMonthIso = computed(() => {
  return now.value.toISOString().slice(0, 7);
});

const currentTimeFormatted = computed(() => {
  const h = String(now.value.getHours()).padStart(2, '0');
  const m = String(now.value.getMinutes()).padStart(2, '0');
  const s = String(now.value.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
});

// Thông tin nhân viên & văn phòng
const userDisplayName = computed(() => props.currentUser?.name || 'Nhân Viên');
const userDisplayCode = computed(() => props.currentUser?.code || 'NV001');
const userDepartmentName = computed(() => props.currentUser?.departmentName || 'Ban Kinh Doanh & Môi Giới BĐS');
const clientIp = ref('171.240.251.151');

const officeOptions = ref<any[]>([
  { id: 'VP1', name: 'VP1 - 12 Đường số 2', wifi: 'Ben Thanh Center' },
  { id: 'VP2', name: 'VP2 - Số 6 Đường 5A', wifi: 'Ben Thanh Office 2' },
  { id: 'VP3', name: 'VP3 - 70D Phú Thọ', wifi: 'Ben Thanh Light' },
]);

const selectedOfficeId = ref(props.currentUser?.officeId || 'VP3');

const activeOfficeName = computed(() => {
  const off = officeOptions.value.find(o => o.id === selectedOfficeId.value);
  return off ? off.name : '70D Phú Thọ';
});

const activeOfficeCode = computed(() => selectedOfficeId.value);

const currentWifiName = computed(() => {
  const off = officeOptions.value.find(o => o.id === selectedOfficeId.value);
  return off?.wifi || 'Ben Thanh Light';
});

const onOfficeChange = () => {
  showToast(`Đã chuyển sang văn phòng ${activeOfficeName.value}`);
};

// Định mức lương
const rates = ref({
  salaryPerDay: 50000,
  allowancePerDay: 0,
  tripAllowance: 50000,
});
const standardStartTime = ref('09:30');
const graceMinutes = ref(15);

// Dữ liệu chấm công hôm nay
const actionLoading = ref(false);
const todayRecord = ref<any>(null);

// Lịch sử tháng
const historyLoading = ref(false);
const myMonthlyRecords = ref<any[]>([]);

// Modal công tác
const showTripModal = ref(false);
const tripForm = reactive({
  reason: '',
  checkIn: '09:15',
});

const formatVND = (num: number) => {
  return (num || 0).toLocaleString('vi-VN') + ' đ';
};

// Tải dữ liệu hôm nay
const loadTodayRecord = async () => {
  actionLoading.value = true;
  try {
    const userId = props.currentUser?.id;
    if (!userId) return;

    const data: any = await $fetch(`/api/cham-cong/attendance?date=${todayDateIso.value}&userId=${userId}`);
    if (Array.isArray(data) && data.length > 0) {
      todayRecord.value = data[0];
    } else {
      todayRecord.value = null;
    }
  } catch (err) {
    console.error('Lỗi tải chấm công hôm nay:', err);
  } finally {
    actionLoading.value = false;
  }
};

// Tải lịch sử cá nhân trong tháng
const loadMonthlyHistory = async () => {
  historyLoading.value = true;
  try {
    const userId = props.currentUser?.id;
    if (!userId) return;

    const data: any = await $fetch(`/api/cham-cong/attendance?month=${currentMonthIso.value}&userId=${userId}`);
    if (Array.isArray(data)) {
      myMonthlyRecords.value = data;
    }
  } catch (err) {
    console.error('Lỗi tải lịch sử chấm công:', err);
  } finally {
    historyLoading.value = false;
  }
};

// Tải cài đặt giờ & định mức lương
const loadSettings = async () => {
  try {
    const res: any = await $fetch('/api/cham-cong/salary-settings');
    if (res?.setting) {
      rates.value.salaryPerDay = res.setting.salaryPerDay || 50000;
      rates.value.allowancePerDay = res.setting.allowancePerDay || 0;
      rates.value.tripAllowance = res.setting.tripAllowance || 50000;
      standardStartTime.value = res.setting.workStart || '09:30';
      graceMinutes.value = res.setting.lateGraceMinutes ?? 15;
    }
    if (Array.isArray(res?.offices) && res.offices.length > 0) {
      officeOptions.value = res.offices;
    }
  } catch (err) {
    console.error('Lỗi tải cài đặt lương:', err);
  }
};

// Chấm công vào
const handleCheckIn = async () => {
  if (!props.currentUser?.id) {
    showToast('Vui lòng đăng nhập để thực hiện chấm công.');
    return;
  }

  actionLoading.value = true;
  const timeNow = new Date().toTimeString().slice(0, 5);

  try {
    const res: any = await $fetch('/api/cham-cong/attendance', {
      method: 'POST',
      body: {
        userId: props.currentUser.id,
        date: todayDateIso.value,
        checkIn: timeNow,
        officeId: selectedOfficeId.value,
        officeName: activeOfficeName.value,
      },
    });

    todayRecord.value = res;
    if (res.isLate) {
      showToast(`Chấm công vào thành công lúc ${timeNow}! (Ghi nhận đi muộn ${res.lateMinutes} phút)`);
    } else {
      showToast(`Chấm công vào thành công lúc ${timeNow}! Chúc bạn ngày làm việc hiệu quả.`);
    }

    await loadMonthlyHistory();
  } catch (err: any) {
    alert(err?.data?.message || 'Có lỗi khi chấm công vào.');
  } finally {
    actionLoading.value = false;
  }
};

// Chấm công ra
const handleCheckOut = async () => {
  if (!props.currentUser?.id) return;

  actionLoading.value = true;
  const timeNow = new Date().toTimeString().slice(0, 5);

  try {
    const res: any = await $fetch('/api/cham-cong/attendance', {
      method: 'POST',
      body: {
        userId: props.currentUser.id,
        date: todayDateIso.value,
        checkOut: timeNow,
        officeId: selectedOfficeId.value,
        officeName: activeOfficeName.value,
      },
    });

    todayRecord.value = res;
    showToast(`Chấm công ra thành công lúc ${timeNow}!`);
    await loadMonthlyHistory();
  } catch (err: any) {
    alert(err?.data?.message || 'Có lỗi khi chấm công ra.');
  } finally {
    actionLoading.value = false;
  }
};

// Mở modal công tác
const openTripModal = () => {
  tripForm.reason = '';
  tripForm.checkIn = new Date().toTimeString().slice(0, 5);
  showTripModal.value = true;
};

// Gửi báo công tác
const submitTripRecord = async () => {
  if (!props.currentUser?.id) return;

  actionLoading.value = true;
  try {
    const res: any = await $fetch('/api/cham-cong/attendance', {
      method: 'POST',
      body: {
        userId: props.currentUser.id,
        date: todayDateIso.value,
        checkIn: tripForm.checkIn || new Date().toTimeString().slice(0, 5),
        isTrip: true,
        tripReason: tripForm.reason,
        status: 'trip',
        officeId: selectedOfficeId.value,
        officeName: activeOfficeName.value,
      },
    });

    todayRecord.value = res;
    showToast('Đã ghi nhận báo đi công tác hôm nay!');
    showTripModal.value = false;
    await loadMonthlyHistory();
  } catch (err: any) {
    alert(err?.data?.message || 'Lỗi khi báo đi công tác.');
  } finally {
    actionLoading.value = false;
  }
};

// Mở đơn nghỉ / vắng
const openLeaveModal = () => {
  emit('navigate-tab', 'leaves');
  showToast('Chuyển sang phân hệ Đơn Nghỉ / Công Tác để gửi đơn lên cấp trên.');
};

onMounted(() => {
  timerInterval = setInterval(() => {
    now.value = new Date();
  }, 1000);

  loadSettings();
  loadTodayRecord();
  loadMonthlyHistory();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.checkin-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.checkin-top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  background: var(--adm-bg-card, #ffffff);
  border: 1px solid var(--adm-border, #e2e8f0);
  border-radius: var(--adm-radius-lg, 14px);
  padding: 18px 24px;
  box-shadow: var(--adm-shadow-sm, 0 1px 3px rgba(0,0,0,0.05));
}

.checkin-page-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkin-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted, #64748b);
  margin: 0;
}

.realtime-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.25);
  color: #4f46e5;
  padding: 8px 14px;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 700;
}

/* 2 Cột Grid */
.checkin-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 20px;
}

/* Card tím gradient phong cách Bến Thành WiFi */
.checkin-hero-card {
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 45%, #7c3aed 100%);
  border-radius: var(--adm-radius-lg, 16px);
  padding: 32px 28px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 12px 30px rgba(79, 70, 229, 0.25);
  position: relative;
  overflow: hidden;
}

.checkin-hero-card::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 180px;
  height: 180px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  pointer-events: none;
}

.clock-display {
  margin-bottom: 24px;
}

.digital-time {
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: 2px;
  line-height: 1;
  font-family: 'Outfit', 'Plus Jakarta Sans', monospace;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.digital-date {
  font-size: 1.05rem;
  opacity: 0.9;
  margin-top: 8px;
  font-weight: 500;
}

.wifi-status-box {
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 28px;
}

.wifi-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.02rem;
  margin-bottom: 4px;
}

.pulse-dot {
  width: 10px;
  height: 10px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 10px #10b981;
}

.wifi-desc {
  font-size: 0.85rem;
  margin: 0;
  opacity: 0.92;
}

.action-tiles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.action-tile {
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  padding: 18px 12px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.action-tile:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.28);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.action-tile:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-tile.tile-done {
  background: rgba(16, 185, 129, 0.35);
  border-color: rgba(16, 185, 129, 0.7);
}

.tile-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-bottom: 2px;
}

.tile-title {
  font-size: 0.95rem;
  font-weight: 700;
}

.tile-sub {
  font-size: 0.72rem;
  opacity: 0.85;
}

.action-footer-bar {
  display: flex;
  gap: 12px;
}

.btn-hero-action {
  flex: 1;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  border: none;
}

.btn-hero-action.light {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-hero-action.light:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.32);
}

.btn-hero-action.primary {
  background: #ffffff;
  color: #4f46e5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.btn-hero-action.primary:hover:not(:disabled) {
  background: #f8fafc;
  transform: translateY(-1px);
}

.btn-hero-action:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* Cột phải */
.checkin-side-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: var(--adm-bg-card, #ffffff);
  border: 1px solid var(--adm-border, #e2e8f0);
  border-radius: var(--adm-radius-lg, 16px);
  padding: 22px;
  box-shadow: var(--adm-shadow-sm, 0 1px 3px rgba(0,0,0,0.05));
}

.info-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.ich-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
}

.status-pill {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.76rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.status-pill.green {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.status-pill.orange {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.status-pill.purple {
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
  border: 1px solid rgba(139, 92, 246, 0.25);
}

.status-pill.gray {
  background: rgba(100, 116, 139, 0.1);
  color: #64748b;
  border: 1px solid rgba(100, 116, 139, 0.2);
}

.time-pills-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 18px;
}

.time-pill {
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time-pill.in {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.time-pill.in .tp-value {
  color: #059669;
}

.time-pill.out {
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.18);
}

.time-pill.out .tp-value {
  color: #dc2626;
}

.tp-label {
  font-size: 0.75rem;
  color: var(--text-muted, #64748b);
}

.tp-value {
  font-size: 1.45rem;
  font-weight: 800;
  font-family: monospace;
}

.today-detail-list,
.my-office-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.85rem;
}

.td-row,
.mo-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--adm-border, #e2e8f0);
}

.td-row:last-child,
.mo-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.td-label,
.mo-label {
  color: var(--text-muted, #64748b);
}

.td-value,
.mo-value {
  font-weight: 600;
  color: var(--text-main, #0f172a);
}

.text-green { color: #059669 !important; }
.text-muted { color: var(--text-muted, #64748b) !important; }
.font-bold { font-weight: 700 !important; }
.font-mono { font-family: monospace !important; }

.office-tag {
  background: var(--gold-primary, #b45309);
  color: #fff;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
}

.office-quick-select {
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid var(--adm-border, #cbd5e1);
  background: var(--adm-bg-card, #ffffff);
  color: var(--text-main, #0f172a);
  font-size: 0.8rem;
  font-weight: 600;
}

.network-badge {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.78rem;
}

/* Lịch sử cá nhân */
.my-history-section {
  background: var(--adm-bg-card, #ffffff);
  border: 1px solid var(--adm-border, #e2e8f0);
  border-radius: var(--adm-radius-lg, 16px);
  padding: 22px;
  box-shadow: var(--adm-shadow-sm, 0 1px 3px rgba(0,0,0,0.05));
}

.mhs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 18px;
}

.mhs-header h3 {
  font-size: 1.1rem;
  margin: 0 0 4px;
  color: var(--text-main, #0f172a);
}

.mhs-header p {
  font-size: 0.82rem;
  color: var(--text-muted, #64748b);
  margin: 0;
}

.mhs-stats-summary {
  display: flex;
  gap: 10px;
}

.stat-badge {
  background: rgba(100, 116, 139, 0.08);
  border: 1px solid rgba(100, 116, 139, 0.18);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  color: var(--text-main, #0f172a);
}

.stat-badge.green {
  background: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.2);
  color: #059669;
}

.stat-badge.orange {
  background: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.2);
  color: #d97706;
}

@media (max-width: 1024px) {
  .checkin-grid {
    grid-template-columns: 1fr;
  }
}
</style>
