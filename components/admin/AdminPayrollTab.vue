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

        <div class="filter-stats">
          Số nhân sự tính lương: <strong>{{ payrollList.length }}</strong>
        </div>
      </div>

      <div style="display: flex; gap: 10px;">
        <button class="btn-admin-primary" @click="printPayroll" style="font-size: 0.82rem; padding: 8px 16px;">
          <i class="fa-solid fa-print"></i> In Bảng Lương
        </button>
      </div>
    </div>

    <!-- THÔNG TIN ĐỊNH MỨC HIỆN HÀNH (4 KHOẢN) -->
    <div class="rates-overview-banner">
      <div class="rate-card-item">
        <div class="rate-card-icon gold"><i class="fa-solid fa-coins"></i></div>
        <div>
          <span class="rc-label">① Lương một ngày công chuẩn:</span>
          <strong class="rc-val">{{ formatVND(rates.salaryPerDay) }}</strong>
        </div>
      </div>
      <div class="rate-card-item">
        <div class="rate-card-icon blue"><i class="fa-solid fa-utensils"></i></div>
        <div>
          <span class="rc-label">② Phụ cấp cố định:</span>
          <strong class="rc-val">{{ formatVND(rates.allowancePerDay) }}</strong>
        </div>
      </div>
      <div class="rate-card-item">
        <div class="rate-card-icon green"><i class="fa-solid fa-car-side"></i></div>
        <div>
          <span class="rc-label">③ Chi phí công tác:</span>
          <strong class="rc-val green">{{ formatVND(rates.tripAllowance) }}</strong>
        </div>
      </div>
      <div class="rate-card-item">
        <div class="rate-card-icon purple"><i class="fa-solid fa-wallet"></i></div>
        <div>
          <span class="rc-label">④ Chi phí khác (xăng xe...):</span>
          <strong class="rc-val purple">{{ formatVND(rates.otherAllowance) }}</strong>
        </div>
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
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="10" style="text-align: center; padding: 40px; color: var(--text-muted);">
              <i class="fa-solid fa-spinner fa-spin"></i> Đang tính toán bảng lương...
            </td>
          </tr>
          <tr v-else-if="payrollList.length === 0">
            <td colspan="10" class="empty-table">
              <i class="fa-solid fa-file-invoice-dollar"></i>
              <p>Chưa có dữ liệu bảng lương cho tháng này.</p>
            </td>
          </tr>
          <tr v-for="item in payrollList" :key="item.userId">
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
              {{ formatVND(item.tripPay) }}
            </td>
            <td style="text-align: right; font-weight: 600; color: #7c3aed;">
              {{ formatVND(item.otherPay) }}
            </td>
            <td style="text-align: right;">
              <strong style="font-size: 1.05rem; color: #b8860b; font-weight: 800;">
                {{ formatVND(item.totalSalary) }}
              </strong>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="payrollList.length > 0">
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
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const now = new Date();
const selectedMonth = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
const loading = ref(false);

const rates = ref({
  salaryPerDay: 50000,
  allowancePerDay: 50000,
  tripAllowance: 50000,
  otherAllowance: 0,
  otherAllowanceNote: '',
});

const payrollList = ref<any[]>([]);

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
</style>
