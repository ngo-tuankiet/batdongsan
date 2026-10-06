<template>
  <div class="payroll-container">
    <!-- BỘ LỌC THÁNG & NÚT HÀNH ĐỘNG -->
    <div class="table-filter-bar" style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div class="filter-group">
          <span class="filter-label"><i class="fa-solid fa-calendar-days"></i> Tháng tính lương:</span>
          <input 
            v-model="selectedMonth" 
            type="month" 
            class="admin-input" 
            style="width: 160px; font-weight: 700; color: var(--gold-primary);"
            @change="loadPayroll"
          />
        </div>

        <div v-if="isAdminOrManager" class="filter-stats">
          Số nhân sự tính lương: <strong>{{ payrollList.length }}</strong>
        </div>
        <div v-else class="filter-stats" style="background: rgba(16, 185, 129, 0.1); color: #059669; border-color: rgba(16, 185, 129, 0.25);">
          <i class="fa-solid fa-lock"></i> Phiếu Lương Cá Nhân: <strong>{{ localUser?.name }} ({{ localUser?.code }})</strong>
        </div>
      </div>

      <div style="display: flex; gap: 10px;">
        <button class="btn-admin-primary" @click="printPayroll" style="font-size: 0.82rem; padding: 8px 16px;">
          <i class="fa-solid fa-print"></i> {{ isEmployee ? 'In Phiếu Lương' : 'In Bảng Lương' }}
        </button>
      </div>
    </div>

    <!-- THÔNG TIN ĐỊNH MỨC HIỆN HÀNH (4 KHOẢN) -->
    <div class="rates-overview-banner">
      <div class="rate-card-item">
        <div class="rate-card-icon gold"><i class="fa-solid fa-coins"></i></div>
        <div>
          <span class="rc-label">① Lương ngày công chuẩn:</span>
          <strong class="rc-val">{{ formatVND(rates.salaryPerDay) }} / ngày</strong>
          <small style="display:block; font-size: 0.7rem; color: var(--text-muted);">1 ngày làm việc văn phòng</small>
        </div>
      </div>
      <div class="rate-card-item">
        <div class="rate-card-icon blue"><i class="fa-solid fa-utensils"></i></div>
        <div>
          <span class="rc-label">② Phụ cấp cố định:</span>
          <strong class="rc-val">{{ formatVND(rates.allowancePerDay) }} / ngày</strong>
          <small style="display:block; font-size: 0.7rem; color: var(--text-muted);">Phụ cấp ăn trưa / trách nhiệm</small>
        </div>
      </div>
      <div class="rate-card-item">
        <div class="rate-card-icon green"><i class="fa-solid fa-car-side"></i></div>
        <div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="rc-label">③ Chi phí công tác:</span>
            <span class="badge-adj-mini">Leader báo lại</span>
          </div>
          <strong class="rc-val green">{{ formatVND(rates.tripAllowance) }} / ngày</strong>
          <small style="display:block; font-size: 0.7rem; color: var(--text-muted);">1 ngày công tác = 100k (50k lương + 50k phí)</small>
        </div>
      </div>
      <div class="rate-card-item">
        <div class="rate-card-icon purple"><i class="fa-solid fa-wallet"></i></div>
        <div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="rc-label">④ Chi phí khác:</span>
            <span class="badge-adj-mini">Leader báo lại</span>
          </div>
          <strong class="rc-val purple">{{ formatVND(rates.otherAllowance) }}</strong>
          <small style="display:block; font-size: 0.7rem; color: var(--text-muted);">Xăng xe, điện thoại... báo theo tháng</small>
        </div>
      </div>
    </div>

    <!-- BANNER HƯỚNG DẪN NGHIỆP VỤ LEADER BÁO LẠI -->
    <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 10px; padding: 10px 16px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
      <div style="display: flex; align-items: center; gap: 10px; font-size: 0.82rem; color: var(--text-main, #0f172a);">
        <i class="fa-solid fa-circle-info" style="color: #059669; font-size: 1.05rem;"></i>
        <span>
          <strong>Lưu ý nghiệp vụ:</strong> Khoản (3) Chi phí công tác & (4) Chi phí khác không cố định. Sau mỗi chuyến đi hoặc cuối tháng, 
          Leader sẽ báo lại số tiền phát sinh thực tế. Admin/Leader chỉ cần bấm nút <strong>[<i class="fa-solid fa-pen-to-square"></i> Kê Phí]</strong> ở dòng nhân viên tương ứng để cập nhật trực tiếp vào bảng lương.
        </span>
      </div>
    </div>

    <!-- BẢNG LƯƠNG CHI TIẾT -->
    <div class="admin-table-container">
      <table class="admin-data-table">
        <thead>
          <tr>
            <th style="width: 75px;">Mã NV</th>
            <th>Nhân Viên</th>
            <th style="text-align: center;">Ngày Công</th>
            <th style="text-align: center;">Công Tác</th>
            <th style="text-align: center;">Đi Trễ</th>
            <th style="text-align: right;">(1) Lương Chuẩn</th>
            <th style="text-align: right;">(2) Phụ Cấp</th>
            <th style="text-align: right;">(3) Tiền Công Tác</th>
            <th style="text-align: right;">(4) Chi Phí Khác</th>
            <th style="text-align: right; color: var(--gold-primary);">TỔNG THỰC LĨNH</th>
            <th v-if="isAdminOrManager" style="text-align: center; width: 100px;">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="isAdminOrManager ? 11 : 10" style="text-align: center; padding: 40px; color: var(--text-muted);">
              <i class="fa-solid fa-spinner fa-spin"></i> Đang tính toán bảng lương...
            </td>
          </tr>
          <tr v-else-if="displayPayrollList.length === 0">
            <td :colspan="isAdminOrManager ? 11 : 10" class="empty-table">
              <i class="fa-solid fa-file-invoice-dollar"></i>
              <p>{{ isEmployee ? 'Bạn chưa có dữ liệu bảng lương trong tháng này.' : 'Chưa có dữ liệu bảng lương cho tháng này.' }}</p>
            </td>
          </tr>
          <tr v-for="item in displayPayrollList" :key="item.userId">
            <td>
              <span class="code-pill">{{ item.userCode }}</span>
            </td>
            <td>
              <div style="display: flex; align-items: center; gap: 12px;">
                <img :src="item.avatar" class="agent-avatar-circle" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--border-gold);" alt="" />
                <div>
                  <strong style="color: var(--text-main, #0f172a); font-size: 0.9rem; display: block;">{{ item.name }}</strong>
                  <span style="font-size: 0.74rem; color: var(--text-muted);">{{ item.role }}</span>
                </div>
              </div>
            </td>
            <td style="text-align: center;">
              <span class="workday-chip">{{ item.workDays }} ngày</span>
            </td>
            <td style="text-align: center;">
              <span v-if="item.tripDays > 0" class="tripday-chip">{{ item.tripDays }} ngày</span>
              <span v-else style="color: var(--text-muted);">-</span>
            </td>
            <td style="text-align: center;">
              <span v-if="item.lateDays > 0" class="lateday-chip">{{ item.lateDays }} lần</span>
              <span v-else style="color: #059669; font-weight: 700;">0</span>
            </td>
            <td style="text-align: right; font-weight: 600; color: var(--text-main, #0f172a);">
              {{ formatVND(item.baseSalary) }}
            </td>
            <td style="text-align: right; font-weight: 600; color: var(--text-main, #0f172a);">
              {{ formatVND(item.allowance) }}
            </td>
            <td style="text-align: right; font-weight: 600; color: #059669;">
              <div>{{ formatVND(item.tripPay) }}</div>
              <span v-if="item.hasTripAdjustment" class="badge-adj green" :title="item.adjustmentNote || 'Leader báo lại'">
                <i class="fa-solid fa-pen-nib"></i> Leader báo
              </span>
            </td>
            <td style="text-align: right; font-weight: 600; color: #7c3aed;">
              <div>{{ formatVND(item.otherPay) }}</div>
              <span v-if="item.hasOtherAdjustment" class="badge-adj purple" :title="item.adjustmentNote || 'Leader báo lại'">
                <i class="fa-solid fa-pen-nib"></i> Leader báo
              </span>
            </td>
            <td style="text-align: right;">
              <strong style="font-size: 1.05rem; color: #b8860b; font-weight: 800;">
                {{ formatVND(item.totalSalary) }}
              </strong>
            </td>
            <td v-if="isAdminOrManager" style="text-align: center;">
              <button 
                class="btn-adjust-row" 
                @click="openAdjustModal(item)" 
                title="Nhập chi phí công tác & chi phí khác theo số liệu Leader báo"
              >
                <i class="fa-solid fa-pen-to-square"></i> Kê Phí
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="isAdminOrManager && payrollList.length > 0">
          <tr style="background: var(--bg-secondary, #f8fafc); font-weight: 800; border-top: 2px solid var(--border-color, #cbd5e1);">
            <td colspan="5" style="text-align: right; text-transform: uppercase; font-size: 0.85rem; color: var(--text-main, #0f172a);">
              Tổng Chi Lương Toàn Bộ Sàn:
            </td>
            <td style="text-align: right; color: var(--text-main, #0f172a);">{{ formatVND(sumBaseSalary) }}</td>
            <td style="text-align: right; color: var(--text-main, #0f172a);">{{ formatVND(sumAllowance) }}</td>
            <td style="text-align: right; color: #059669;">{{ formatVND(sumTripPay) }}</td>
            <td style="text-align: right; color: #7c3aed;">{{ formatVND(sumOtherPay) }}</td>
            <td style="text-align: right; color: #b8860b; font-size: 1.2rem; font-weight: 900;">
              {{ formatVND(totalGrandSalary) }}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- MODAL KÊ / ĐIỀU CHỈNH CHI PHÍ DO LEADER BÁO LẠI -->
    <div v-if="showAdjustModal" class="modal-overlay" @click.self="showAdjustModal = false">
      <div class="admin-modal-card" style="max-width: 500px;">
        <div class="modal-header">
          <h3>
            <i class="fa-solid fa-file-invoice-dollar" style="color: var(--gold-primary);"></i>
            Kê Phí Lương Tháng {{ selectedMonth }}
          </h3>
          <button class="modal-close-icon" @click="showAdjustModal = false">&times;</button>
        </div>

        <div style="padding: 16px 20px 0; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--border-color, #e2e8f0); padding-bottom: 14px;">
          <img :src="adjustItem?.avatar" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--border-gold);" alt="" />
          <div>
            <strong style="font-size: 0.95rem; color: var(--text-main, #0f172a); display: block;">{{ adjustItem?.name }} ({{ adjustItem?.userCode }})</strong>
            <span style="font-size: 0.75rem; color: var(--text-muted);">
              Số ngày công tác ghi nhận: <strong style="color: #059669;">{{ adjustItem?.tripDays }} ngày</strong> | Tổng ngày làm: {{ adjustItem?.workDays }} ngày
            </span>
          </div>
        </div>

        <form @submit.prevent="saveAdjustment" class="modal-form" style="padding-top: 16px;">
          <div class="form-grid">
            <div class="form-col-full">
              <label style="display: flex; justify-content: space-between; align-items: center;">
                <span>(3) Chi phí công tác do Leader báo (VNĐ)</span>
                <small style="color: var(--text-muted);">Định mức gợi ý: {{ formatVND(adjustItem?.tripDays * rates.tripAllowance) }}</small>
              </label>
              <input 
                v-model.number="adjustForm.tripAllowance" 
                type="number" 
                step="1000" 
                min="0"
                class="admin-input" 
                placeholder="Nhập số tiền Leader duyệt (VD: 150000) hoặc để trống"
              />
              <small style="color: var(--text-muted); font-size: 0.72rem; margin-top: 4px; display: block;">
                Khoản này không cố định, Leader sẽ báo lại để cộng thẳng vào lương của nhân viên.
              </small>
            </div>

            <div class="form-col-full">
              <label>(4) Chi phí khác (xăng xe, điện thoại...) do Leader báo (VNĐ)</label>
              <input 
                v-model.number="adjustForm.otherAllowance" 
                type="number" 
                step="1000" 
                min="0"
                class="admin-input" 
                placeholder="Nhập số tiền chi phí khác (VD: 100000)"
              />
            </div>

            <div class="form-col-full">
              <label>Ghi chú chi tiết từ Leader / Quản lý</label>
              <input 
                v-model="adjustForm.note" 
                type="text" 
                class="admin-input" 
                placeholder="VD: Đi tiếp khách Long An 2 ngày, phụ cấp xăng xe 100k"
              />
            </div>
          </div>

          <div class="modal-actions-footer" style="margin-top: 20px;">
            <button type="button" class="btn-admin-cancel" @click="showAdjustModal = false">Hủy</button>
            <button type="submit" class="btn-admin-primary" :disabled="savingAdjustment">
              <i class="fa-solid fa-floppy-disk"></i> Lưu Vào Bảng Lương
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

const props = defineProps<{
  currentUser?: any;
}>();

const localUser = computed(() => {
  if (props.currentUser) return props.currentUser;
  if (process.client) {
    try {
      const u = localStorage.getItem('bds_user_info');
      if (u) return JSON.parse(u);
    } catch (e) {}
  }
  return null;
});

const isEmployee = computed(() => {
  return localUser.value?.role === 'user';
});

const isAdminOrManager = computed(() => {
  return !localUser.value || localUser.value.role === 'admin' || localUser.value.role === 'manager';
});

const now = new Date();
const selectedMonth = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
const loading = ref(false);

const rates = ref({
  salaryPerDay: 50000,
  allowancePerDay: 0,
  tripAllowance: 50000,
  otherAllowance: 0,
  otherAllowanceNote: '',
});

const payrollList = ref<any[]>([]);

const displayPayrollList = computed(() => {
  if (isAdminOrManager.value) {
    return payrollList.value;
  }
  // Nếu là Nhân viên: CHỈ xem dòng bảng lương của chính mình!
  const myId = localUser.value?.id;
  const myCode = localUser.value?.code;
  const myUsername = localUser.value?.username;
  const myName = localUser.value?.name;

  return payrollList.value.filter(item => 
    (myId && item.userId === myId) || 
    (myCode && item.userCode === myCode) ||
    (myUsername && item.username === myUsername) ||
    (myName && item.name?.toLowerCase() === myName?.toLowerCase())
  );
});

// Quản lý Modal Kê Phí Leader
const showAdjustModal = ref(false);
const savingAdjustment = ref(false);
const adjustItem = ref<any>(null);
const adjustForm = reactive({
  userId: '',
  tripAllowance: undefined as number | undefined,
  otherAllowance: undefined as number | undefined,
  note: '',
});

const formatVND = (num: number) => {
  return (num || 0).toLocaleString('vi-VN') + ' đ';
};

const loadPayroll = async () => {
  loading.value = true;
  try {
    const data: any = await $fetch(`/api/cham-cong/payroll?month=${selectedMonth.value}`);
    if (data) {
      rates.value = data.rates || rates.value;
      payrollList.value = data.payrollList || [];
    }
  } catch (err) {
    console.error('Lỗi tính bảng lương:', err);
  } finally {
    loading.value = false;
  }
};

const openAdjustModal = (item: any) => {
  adjustItem.value = item;
  adjustForm.userId = item.userId;
  adjustForm.tripAllowance = item.hasTripAdjustment ? item.tripPay : (item.tripDays > 0 ? item.tripPay : undefined);
  adjustForm.otherAllowance = item.hasOtherAdjustment ? item.otherPay : (item.otherPay > 0 ? item.otherPay : undefined);
  adjustForm.note = item.adjustmentNote || '';
  showAdjustModal.value = true;
};

const saveAdjustment = async () => {
  savingAdjustment.value = true;
  try {
    await $fetch('/api/cham-cong/payroll/adjust', {
      method: 'POST',
      body: {
        month: selectedMonth.value,
        userId: adjustForm.userId,
        tripAllowance: adjustForm.tripAllowance,
        otherAllowance: adjustForm.otherAllowance,
        note: adjustForm.note,
      },
    });
    showToast(`Đã cập nhật chi phí cho nhân viên ${adjustItem.value?.name}!`);
    showAdjustModal.value = false;
    await loadPayroll();
  } catch (err: any) {
    alert(err?.data?.message || 'Lỗi khi lưu chi phí!');
  } finally {
    savingAdjustment.value = false;
  }
};

const sumBaseSalary = computed(() => payrollList.value.reduce((acc, cur) => acc + (cur.baseSalary || 0), 0));
const sumAllowance = computed(() => payrollList.value.reduce((acc, cur) => acc + (cur.allowance || 0), 0));
const sumTripPay = computed(() => payrollList.value.reduce((acc, cur) => acc + (cur.tripPay || 0), 0));
const sumOtherPay = computed(() => payrollList.value.reduce((acc, cur) => acc + (cur.otherPay || 0), 0));
const totalGrandSalary = computed(() => payrollList.value.reduce((acc, cur) => acc + (cur.totalSalary || 0), 0));

const printPayroll = () => {
  if (typeof window !== 'undefined') window.print();
};

onMounted(() => {
  loadPayroll();
});
</script>

<style scoped>
.payroll-container {
  padding: 10px 0;
}

.rates-overview-banner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.rate-card-item {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: var(--radius-md, 12px);
  padding: 16px 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.rate-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.rate-card-icon.gold {
  background: rgba(212, 175, 55, 0.16);
  color: #b8860b;
}

.rate-card-icon.blue {
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
}

.rate-card-icon.green {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
}

.rate-card-icon.purple {
  background: rgba(147, 51, 234, 0.12);
  color: #7c3aed;
}

.rc-label {
  font-size: 0.76rem;
  color: var(--text-muted, #64748b);
  display: block;
  margin-bottom: 2px;
}

.rc-val {
  font-size: 1.12rem;
  color: var(--text-main, #0f172a);
  font-weight: 800;
  display: block;
}

.rc-val.green {
  color: #059669;
}

.rc-val.purple {
  color: #7c3aed;
}

.workday-chip {
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
  padding: 3px 9px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.76rem;
}

.tripday-chip {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
  padding: 3px 9px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.76rem;
}

.lateday-chip {
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
  padding: 3px 9px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.76rem;
}

.badge-adj-mini {
  background: rgba(16, 185, 129, 0.14);
  color: #059669;
  font-size: 0.65rem;
  padding: 1px 6px;
  border-radius: 10px;
  font-weight: 700;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.badge-adj {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.65rem;
  padding: 1px 6px;
  border-radius: 10px;
  font-weight: 700;
  margin-top: 2px;
}

.badge-adj.green {
  background: rgba(16, 185, 129, 0.14);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.badge-adj.purple {
  background: rgba(147, 51, 234, 0.14);
  color: #7c3aed;
  border: 1px solid rgba(147, 51, 234, 0.3);
}

.btn-adjust-row {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(212, 175, 55, 0.12);
  color: #b8860b;
  border: 1px solid rgba(212, 175, 55, 0.35);
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-adjust-row:hover {
  background: var(--gold-primary, #d4af37);
  color: #ffffff;
  border-color: var(--gold-primary, #d4af37);
  transform: translateY(-1px);
}
</style>
