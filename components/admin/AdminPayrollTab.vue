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

      <div style="display: flex; gap: 10px; align-items: center;">
        <button class="btn-admin-primary" @click="printPayroll" style="font-size: 0.82rem; padding: 8px 16px;">
          <i class="fa-solid fa-print"></i> {{ isEmployee ? 'In Phiếu Lương' : 'In Bảng Lương' }}
        </button>

        <button class="btn-excel-export" @click="openExcelModal" style="font-size: 0.82rem; padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 6px rgba(16, 185, 129, 0.25);">
          <i class="fa-solid fa-file-excel"></i> Xuất Excel (Tùy Chọn Ngày)
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

const showExcelModal = ref(false);
const excelCycleType = ref<'company_10' | 'full_month' | 'custom'>('company_10');
const excelMonth = ref(selectedMonth.value || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
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
  excelMonth.value = selectedMonth.value || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
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
