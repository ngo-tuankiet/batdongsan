<template>
  <div class="salary-settings-container">
    <!-- TIÊU ĐỀ & MÔ TẢ PHÂN HỆ -->
    <div class="tab-header-box">
      <div>
        <h2 class="tab-main-title">
          <i class="fa-solid fa-coins" style="color: var(--gold-primary);"></i>
          Cài Đặt Định Mức Lương & Khung Giờ Làm Việc
        </h2>
        <p class="tab-sub-desc">
          Áp dụng định mức tính lương 4 khoản chuẩn và thiết lập nhiều khung giờ làm việc linh hoạt cho các phòng ban, văn phòng.
        </p>
      </div>

      <button class="btn-admin-primary" @click="saveSalarySettings" :disabled="saving">
        <i class="fa-solid fa-floppy-disk"></i>
        <span>{{ saving ? 'Đang Lưu...' : 'Lưu Toàn Bộ Cài Đặt' }}</span>
      </button>
    </div>

    <div class="settings-grid-layout">
      <!-- CỘT 1: 4 KHOẢN ĐỊNH MỨC LƯƠNG CHUẨN (THEO YÊU CẦU NGHIỆP VỤ) -->
      <div class="setting-card">
        <div class="card-head">
          <div class="card-head-left">
            <span class="card-head-icon"><i class="fa-solid fa-sack-dollar"></i></span>
            <div>
              <h3>Định Mức Lương 4 Khoản</h3>
              <p>Công thức tính lương chi tiết cho mỗi ngày công và phụ cấp</p>
            </div>
          </div>
          <span class="pill-badge gold">4 Khoản Chuẩn</span>
        </div>

        <div class="card-body">
          <!-- KHOẢN 1: LƯƠNG MỘT NGÀY CÔNG CHUẨN -->
          <div class="form-row-item highlight">
            <label class="item-label">
              <span class="step-num">1</span>
              <div>
                <strong>Lương một ngày công chuẩn (VNĐ) *</strong>
                <span class="item-hint">Mức lương 1 ngày làm việc văn phòng (Ví dụ mức hiện tại: 50.000 đ/ngày)</span>
              </div>
            </label>
            <div class="input-currency-wrap">
              <input 
                v-model.number="form.salaryPerDay" 
                type="number" 
                min="0" 
                step="1000" 
                class="admin-input currency-input" 
                required
              />
              <span class="currency-tag">VNĐ / ngày</span>
            </div>
          </div>

          <!-- KHOẢN 2: PHỤ CẤP -->
          <div class="form-row-item">
            <label class="item-label">
              <span class="step-num">2</span>
              <div>
                <strong>Phụ cấp (VNĐ)</strong>
                <span class="item-hint">Phụ cấp ăn trưa / trách nhiệm nếu có (để 0 đ nếu không áp dụng)</span>
              </div>
            </label>
            <div class="input-currency-wrap">
              <input 
                v-model.number="form.allowancePerDay" 
                type="number" 
                min="0" 
                step="1000" 
                class="admin-input currency-input" 
              />
              <span class="currency-tag">VNĐ / ngày</span>
            </div>
          </div>

          <!-- KHOẢN 3: CHI PHÍ CÔNG TÁC -->
          <div class="form-row-item">
            <label class="item-label">
              <span class="step-num">3</span>
              <div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <strong>Chi phí công tác (VNĐ)</strong>
                  <span class="badge-flexible">Leader báo lại</span>
                </div>
                <span class="item-hint">Chi phí này không cố định, Leader sẽ báo lại để cộng vào lương. Mức ở đây là mức cơ sở (VD: 50.000 đ để ngày công tác = 100.000 đ).</span>
              </div>
            </label>
            <div class="input-currency-wrap">
              <input 
                v-model.number="form.tripAllowance" 
                type="number" 
                min="0" 
                step="1000" 
                class="admin-input currency-input" 
              />
              <span class="currency-tag">VNĐ / ngày</span>
            </div>
          </div>

          <!-- KHOẢN 4: CHI PHÍ KHÁC (XĂNG XE, ĐIỆN THOẠI, HỖ TRỢ CÔNG VIỆC) -->
          <div class="form-row-item">
            <label class="item-label">
              <span class="step-num">4</span>
              <div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <strong>Chi phí khác (VNĐ)</strong>
                  <span class="badge-flexible">Leader báo lại</span>
                </div>
                <span class="item-hint">Cũng giống khoản 3, khoản này không cố định, Leader sẽ báo lại (xăng xe, điện thoại...) để cộng vào lương nhân viên.</span>
              </div>
            </label>
            <div class="input-currency-wrap">
              <input 
                v-model.number="form.otherAllowance" 
                type="number" 
                min="0" 
                step="1000" 
                class="admin-input currency-input" 
                placeholder="0"
              />
              <span class="currency-tag">VNĐ</span>
            </div>
          </div>

          <div style="margin-top: 10px;">
            <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 5px;">
              Ghi chú loại chi phí khác:
            </label>
            <input 
              v-model="form.otherAllowanceNote" 
              type="text" 
              class="admin-input" 
              placeholder="VD: Hỗ trợ xăng xe & điện thoại liên hệ khách hàng"
            />
          </div>

          <!-- HỘP MINH HỌA VÍ DỤ TỰ ĐỘNG TÍNH TOÁN -->
          <div class="salary-example-box">
            <div class="example-head">
              <i class="fa-solid fa-calculator" style="color: var(--gold-primary);"></i>
              <strong>Minh Họa Mức Chi Trả Thực Tế:</strong>
            </div>
            <ul class="example-list">
              <li>
                <span>• 1 Ngày làm tại văn phòng:</span>
                <strong>{{ formatVND(form.salaryPerDay + form.allowancePerDay) }}</strong>
                <small v-if="form.allowancePerDay > 0">({{ formatVND(form.salaryPerDay) }} lương + {{ formatVND(form.allowancePerDay) }} phụ cấp)</small>
                <small v-else>(Theo mức lương chuẩn 1 ngày làm việc)</small>
              </li>
              <li>
                <span>• 1 Ngày đi công tác thị trường:</span>
                <strong style="color: #10b981;">{{ formatVND(form.salaryPerDay + form.allowancePerDay + form.tripAllowance) }}</strong>
                <small>(Gồm lương ngày + tiền công tác cơ sở)</small>
              </li>
              <li v-if="form.otherAllowance > 0">
                <span>• Chi phí khác mặc định ({{ form.otherAllowanceNote }}):</span>
                <strong style="color: #a855f7;">+ {{ formatVND(form.otherAllowance) }}</strong>
              </li>
              <li>
                <span>• 1 Ngày vắng không phép:</span>
                <strong style="color: #ef4444;">0 đ</strong>
              </li>
            </ul>
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed rgba(255,255,255,0.1); font-size: 0.74rem; color: var(--text-muted); line-height: 1.5;">
              <i class="fa-solid fa-circle-info" style="color: #38bdf8;"></i>
              <strong>Lưu ý:</strong> Khoản (3) Chi phí công tác và (4) Chi phí khác không cố định. Leader sẽ báo lại chi phí phát sinh thực tế theo từng tháng, Admin/Leader có thể bấm chỉnh sửa trực tiếp cho từng nhân viên trong tab <strong>"Bảng Lương & Chi Trả"</strong>.
            </div>
          </div>
        </div>
      </div>

      <!-- CỘT 2: KHUNG GIỜ LÀM VIỆC (ADMIN BỔ SUNG NHIỀU KHUNG GIỜ) -->
      <div class="setting-card">
        <div class="card-head">
          <div class="card-head-left">
            <span class="card-head-icon" style="background: rgba(37, 99, 235, 0.15); color: #60a5fa;">
              <i class="fa-solid fa-business-time"></i>
            </span>
            <div>
              <h3>Khung Giờ Làm Việc (Ca Làm)</h3>
              <p>Admin có thể bổ sung nhiều khung giờ cho các ca và văn phòng</p>
            </div>
          </div>
          <button class="btn-admin-add-shift" @click="openNewShiftModal">
            <i class="fa-solid fa-plus"></i> + Bổ Sung Khung Giờ
          </button>
        </div>

        <div class="card-body">
          <div class="shifts-list">
            <div 
              v-for="shift in shifts" 
              :key="shift.id"
              class="shift-item-card"
              :class="{ 'is-default': shift.isDefault }"
            >
              <div class="shift-top">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="shift-title">{{ shift.name }}</span>
                  <span v-if="shift.isDefault" class="badge-default-shift">Mặc định</span>
                </div>
                <div class="shift-actions">
                  <button class="btn-icon-sub" @click="openEditShiftModal(shift)" title="Sửa khung giờ">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button class="btn-icon-sub del" @click="deleteShift(shift)" title="Xóa khung giờ">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>

              <div class="shift-time-row">
                <div class="time-block">
                  <span class="time-label"><i class="fa-solid fa-right-to-bracket" style="color: #10b981;"></i> Giờ Vào:</span>
                  <strong class="time-val">{{ shift.workStart }}</strong>
                </div>
                <i class="fa-solid fa-arrow-right time-arrow"></i>
                <div class="time-block">
                  <span class="time-label"><i class="fa-solid fa-right-from-bracket" style="color: #f59e0b;"></i> Giờ Ra:</span>
                  <strong class="time-val">{{ shift.workEnd }}</strong>
                </div>
              </div>

              <div class="shift-bottom-meta">
                <span>
                  <i class="fa-solid fa-clock-rotate-left"></i> Cho phép trễ: 
                  <strong>{{ shift.lateGraceMinutes }} phút</strong>
                </span>
                <span v-if="shift.officeId" class="shift-office-tag">
                  <i class="fa-solid fa-location-dot"></i> {{ shift.officeId }}
                </span>
                <span v-else class="shift-office-tag all">
                  <i class="fa-solid fa-building"></i> Toàn công ty
                </span>
              </div>

              <!-- PHÒNG BAN ÁP DỤNG -->
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--border-color, #e2e8f0); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; font-size: 0.76rem;">
                <span style="color: var(--text-muted); font-weight: 600;"><i class="fa-solid fa-users-gear" style="color: #6366f1;"></i> Áp dụng:</span>
                <span v-if="shift.departmentIds" style="color: #4338ca; font-weight: 700; background: rgba(99, 102, 241, 0.12); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(99, 102, 241, 0.2);">
                  {{ getDeptNames(shift.departmentIds) }}
                </span>
                <span v-else style="color: #047857; font-weight: 600; background: rgba(16, 185, 129, 0.12); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.2);">
                  Toàn bộ các phòng ban
                </span>
              </div>
            </div>
          </div>

          <!-- CẤU HÌNH TÊN CÔNG TY & CHÍNH SÁCH CHẤM CÔNG -->
          <div class="general-config-box" style="margin-top: 20px;">
            <h4 style="color: var(--text-main, #0f172a); font-size: 0.92rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-shield-halved" style="color: var(--gold-primary);"></i>
              Chính Sách Chấm Công & WiFi
            </h4>

            <div class="form-grid-inner">
              <div>
                <label>Tên Công Ty Hiển Thị</label>
                <input v-model="form.companyName" type="text" class="admin-input" required />
              </div>

              <div>
                <label>Số phút ân hạn cho phép trễ chung</label>
                <input v-model.number="form.lateGraceMinutes" type="number" min="0" max="120" class="admin-input" />
              </div>
            </div>

            <div style="display: flex; gap: 20px; margin-top: 14px; flex-wrap: wrap;">
              <label class="toggle-checkbox-label">
                <input type="checkbox" v-model="form.requireWifi" />
                <span>Bắt buộc kết nối WiFi văn phòng khi chấm công</span>
              </label>

              <label class="toggle-checkbox-label">
                <input type="checkbox" v-model="form.trustProxy" />
                <span>Hỗ trợ nhận diện IP qua Nginx / Cloudflare (Trust Proxy)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL THÊM / SỬA KHUNG GIỜ LÀM VIỆC -->
    <div v-if="showShiftModal" class="modal-overlay" @click.self="showShiftModal = false">
      <div class="admin-modal-card" style="max-width: 500px;">
        <div class="modal-header">
          <h3>
            <i class="fa-solid fa-business-time" style="color: var(--gold-primary);"></i>
            {{ shiftForm.isEdit ? 'Chỉnh Sửa Khung Giờ' : 'Bổ Sung Khung Giờ Mới' }}
          </h3>
          <button class="modal-close-icon" @click="showShiftModal = false">&times;</button>
        </div>

        <form @submit.prevent="saveShift" class="modal-form">
          <div class="form-grid">
            <div class="form-col-full">
              <label>Tên Khung Giờ (Ca Làm) *</label>
              <input 
                v-model="shiftForm.name" 
                type="text" 
                class="admin-input" 
                placeholder="VD: Ca Sáng, Ca Chiều, Ca Tăng Ca..." 
                required 
              />
            </div>

            <div>
              <label>Giờ Vào Chuẩn *</label>
              <input v-model="shiftForm.workStart" type="time" class="admin-input" required />
            </div>

            <div>
              <label>Giờ Ra Chuẩn *</label>
              <input v-model="shiftForm.workEnd" type="time" class="admin-input" required />
            </div>

            <div>
              <label>Số Phút Cho Phép Trễ</label>
              <input v-model.number="shiftForm.lateGraceMinutes" type="number" min="0" max="60" class="admin-input" />
            </div>

            <div>
              <label>Văn Phòng Áp Dụng</label>
              <select v-model="shiftForm.officeId" class="admin-select">
                <option value="">-- Áp Dụng Cho Tất Cả Văn Phòng --</option>
                <option value="VP1">VP1 - 12 Đường số 2</option>
                <option value="VP2">VP2 - Số 6 Đường 5A</option>
                <option value="VP3">VP3 - 70D Phú Thọ</option>
              </select>
            </div>

            <!-- CHỌN PHÒNG BAN ÁP DỤNG -->
            <div class="form-col-full" style="padding: 14px; background: var(--bg-secondary, #f8fafc); border-radius: 8px; border: 1px solid var(--border-color, #e2e8f0);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <label style="font-weight: 700; color: var(--text-main, #0f172a); margin: 0; display: flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-users-gear" style="color: #6366f1;"></i> Phòng Ban Áp Dụng *
                </label>
                <label style="font-size: 0.8rem; display: flex; align-items: center; gap: 6px; cursor: pointer; color: #2563eb; font-weight: 600; margin: 0;">
                  <input type="checkbox" v-model="shiftForm.applyAllDepts" @change="onToggleApplyAllDepts" style="accent-color: #2563eb; width: 16px; height: 16px;" />
                  <span>Áp dụng tất cả</span>
                </label>
              </div>

              <div v-if="!shiftForm.applyAllDepts" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px;">
                <label 
                  v-for="dept in departments" 
                  :key="dept.id" 
                  style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; cursor: pointer; padding: 7px 10px; background: var(--bg-card, #fff); border: 1px solid var(--border-color, #cbd5e1); border-radius: 6px; user-select: none;"
                >
                  <input 
                    type="checkbox" 
                    :value="dept.id" 
                    v-model="shiftForm.departmentIds" 
                    style="accent-color: #2563eb; width: 16px; height: 16px;" 
                  />
                  <span style="color: var(--text-main, #0f172a); font-weight: 600;">{{ dept.name }}</span>
                </label>
              </div>

              <p style="font-size: 0.74rem; color: var(--text-muted); margin: 8px 0 0 0;">
                💡 <em>Ví dụ:</em> 2 phòng ban làm ca <strong>09:00 - 11:30</strong> thì tích chọn 2 phòng đó; 1 phòng làm ca <strong>14:00 - 15:00</strong> thì tạo ca riêng và chỉ tích phòng đó. Hệ thống sẽ tự động tính công và giờ trễ theo đúng ca của từng phòng!
              </p>
            </div>

            <div class="form-col-full">
              <label>Ghi chú ca làm</label>
              <input v-model="shiftForm.note" type="text" class="admin-input" placeholder="Áp dụng cho nhân viên kinh doanh / bảo vệ..." />
            </div>

            <div class="form-col-full">
              <label class="toggle-checkbox-label">
                <input type="checkbox" v-model="shiftForm.isDefault" />
                <span>Đặt làm khung giờ mặc định toàn công ty</span>
              </label>
            </div>
          </div>

          <div class="modal-actions-footer" style="margin-top: 20px;">
            <button type="button" class="btn-admin-cancel" @click="showShiftModal = false">Hủy</button>
            <button type="submit" class="btn-admin-primary" :disabled="savingShift">
              <i class="fa-solid fa-check"></i> Lưu Khung Giờ
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

const saving = ref(false);
const savingShift = ref(false);
const showShiftModal = ref(false);

const form = reactive({
  companyName: 'Công Ty Bến Thành',
  salaryPerDay: 50000,
  allowancePerDay: 0,
  tripAllowance: 50000,
  otherAllowance: 0,
  otherAllowanceNote: 'Phụ cấp xăng xe, điện thoại, hỗ trợ công việc',
  lateGraceMinutes: 15,
  workStart: '09:30',
  workEnd: '12:00',
  requireWifi: true,
  trustProxy: true,
});

const shifts = ref<any[]>([]);

const departments = ref<any[]>([
  { id: 'PB01', name: 'Phòng Kinh Doanh 1' },
  { id: 'PB02', name: 'Phòng Kinh Doanh 2' },
  { id: 'PB03', name: 'Phòng Marketing & Truyền Thông' },
  { id: 'PB04', name: 'Phòng Pháp Lý & Công Chứng' },
  { id: 'PB05', name: 'Phòng Hành Chính Nhân Sự' },
  { id: 'PB06', name: 'Phòng Kế Toán & Tài Chính' },
]);

const shiftForm = reactive({
  isEdit: false,
  id: '',
  name: '',
  workStart: '08:30',
  workEnd: '17:30',
  lateGraceMinutes: 15,
  isDefault: false,
  officeId: '',
  departmentIds: [] as string[],
  applyAllDepts: true,
  note: '',
});

const onToggleApplyAllDepts = () => {
  if (shiftForm.applyAllDepts) {
    shiftForm.departmentIds = [];
  }
};

const getDeptNames = (deptIdsStr?: string) => {
  if (!deptIdsStr) return 'Tất cả phòng ban';
  const ids = deptIdsStr.split(',').filter(Boolean);
  if (ids.length === 0) return 'Tất cả phòng ban';
  const names = ids.map(id => {
    const found = departments.value.find(d => d.id === id);
    return found ? found.name : id;
  });
  return names.join(', ');
};

const formatVND = (num: number) => {
  return (num || 0).toLocaleString('vi-VN') + ' đ';
};

const loadDepartments = async () => {
  try {
    const data: any = await $fetch('/api/cham-cong/departments');
    if (data && data.length > 0) {
      departments.value = data;
    }
  } catch (err) {
    console.error('Lỗi tải phòng ban:', err);
  }
};

const loadSalarySettings = async () => {
  try {
    const data: any = await $fetch('/api/cham-cong/salary-settings');
    if (data) {
      Object.assign(form, data);
    }
  } catch (err) {
    console.error('Lỗi tải cài đặt lương:', err);
  }
};

const loadShifts = async () => {
  try {
    const data: any = await $fetch('/api/cham-cong/shifts');
    shifts.value = data || [];
  } catch (err) {
    console.error('Lỗi tải khung giờ:', err);
  }
};

const saveSalarySettings = async () => {
  saving.value = true;
  try {
    const res: any = await $fetch('/api/cham-cong/salary-settings', {
      method: 'PUT',
      body: form,
    });
    if (res?.success) {
      showToast('Đã lưu cấu hình 4 khoản định mức lương thành công!');
    }
  } catch (err: any) {
    alert(err?.data?.message || 'Lỗi khi lưu cài đặt lương!');
  } finally {
    saving.value = false;
  }
};

const openNewShiftModal = () => {
  shiftForm.isEdit = false;
  shiftForm.id = '';
  shiftForm.name = '';
  shiftForm.workStart = '09:00';
  shiftForm.workEnd = '11:30';
  shiftForm.lateGraceMinutes = 15;
  shiftForm.isDefault = false;
  shiftForm.officeId = '';
  shiftForm.departmentIds = [];
  shiftForm.applyAllDepts = true;
  shiftForm.note = '';
  showShiftModal.value = true;
};

const openEditShiftModal = (shift: any) => {
  shiftForm.isEdit = true;
  shiftForm.id = shift.id;
  shiftForm.name = shift.name;
  shiftForm.workStart = shift.workStart;
  shiftForm.workEnd = shift.workEnd;
  shiftForm.lateGraceMinutes = shift.lateGraceMinutes;
  shiftForm.isDefault = shift.isDefault;
  shiftForm.officeId = shift.officeId || '';
  shiftForm.departmentIds = shift.departmentIds ? shift.departmentIds.split(',').filter(Boolean) : [];
  shiftForm.applyAllDepts = !shift.departmentIds || shift.departmentIds.length === 0;
  shiftForm.note = shift.note || '';
  showShiftModal.value = true;
};

const saveShift = async () => {
  savingShift.value = true;
  try {
    const payload = {
      ...shiftForm,
      departmentIds: shiftForm.applyAllDepts ? null : shiftForm.departmentIds,
    };

    if (shiftForm.isEdit) {
      await $fetch(`/api/cham-cong/shifts/${shiftForm.id}`, {
        method: 'PUT',
        body: payload,
      });
      showToast('Đã cập nhật khung giờ làm việc!');
    } else {
      await $fetch('/api/cham-cong/shifts', {
        method: 'POST',
        body: payload,
      });
      showToast('Đã bổ sung khung giờ mới!');
    }
    showShiftModal.value = false;
    await loadShifts();
  } catch (err: any) {
    alert(err?.data?.message || 'Lỗi khi lưu khung giờ!');
  } finally {
    savingShift.value = false;
  }
};

const deleteShift = async (shift: any) => {
  if (!confirm(`Bạn có chắc muốn xóa khung giờ "${shift.name}"?`)) return;
  try {
    await $fetch(`/api/cham-cong/shifts/${shift.id}`, { method: 'DELETE' });
    showToast(`Đã xóa khung giờ "${shift.name}"!`);
    await loadShifts();
  } catch (err: any) {
    alert(err?.data?.message || 'Lỗi khi xóa khung giờ!');
  }
};

onMounted(() => {
  loadSalarySettings();
  loadShifts();
  loadDepartments();
});
</script>

<style scoped>
.salary-settings-container {
  padding: 10px 0;
}

.tab-header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  background: var(--bg-card, #ffffff);
  padding: 20px 24px;
  border-radius: var(--radius-md, 14px);
  border: 1px solid var(--border-color, #e2e8f0);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.tab-main-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tab-sub-desc {
  font-size: 0.84rem;
  color: var(--text-muted, #64748b);
  margin: 0;
}

.settings-grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(460px, 1fr));
  gap: 24px;
}

.setting-card {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: var(--radius-md, 14px);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-head {
  padding: 16px 22px;
  background: var(--bg-secondary, #f8fafc);
  border-bottom: 1.5px solid var(--border-color, #e2e8f0);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-head-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-head-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(212, 175, 55, 0.16);
  color: #b8860b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.card-head h3 {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
  margin: 0 0 2px;
}

.card-head p {
  font-size: 0.78rem;
  color: var(--text-muted, #64748b);
  margin: 0;
}

.pill-badge.gold {
  background: rgba(212, 175, 55, 0.15);
  color: #b8860b;
  border: 1px solid rgba(212, 175, 55, 0.35);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.74rem;
  font-weight: 800;
}

.badge-flexible {
  display: inline-block;
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 2px 7px;
  border-radius: 12px;
  font-size: 0.68rem;
  font-weight: 700;
}

.card-body {
  padding: 24px;
}

.form-row-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  border-radius: 10px;
  background: var(--bg-secondary, #f8fafc);
  border: 1px solid var(--border-color, #e2e8f0);
  margin-bottom: 14px;
  transition: all 0.2s ease;
}

.form-row-item:hover {
  background: rgba(212, 175, 55, 0.04);
  border-color: rgba(212, 175, 55, 0.5);
}

.item-label {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
}

.step-num {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.18);
  color: #b8860b;
  font-weight: 800;
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(212, 175, 55, 0.4);
  flex-shrink: 0;
}

.item-label strong {
  display: block;
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
}

.item-hint {
  display: block;
  font-size: 0.76rem;
  color: var(--text-muted, #64748b);
  margin-top: 2px;
}

.input-currency-wrap {
  position: relative;
  width: 180px;
}

.currency-input {
  font-size: 1.05rem !important;
  font-weight: 800 !important;
  color: #b8860b !important;
  text-align: right;
  padding-right: 70px !important;
  background: var(--bg-card, #ffffff) !important;
  border: 1.5px solid var(--border-color, #cbd5e1) !important;
}

[data-theme="dark"] .currency-input {
  color: #fef08a !important;
}

.currency-tag {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--text-muted, #64748b);
  pointer-events: none;
}

.salary-example-box {
  background: rgba(212, 175, 55, 0.08);
  border: 1.5px dashed rgba(212, 175, 55, 0.5);
  border-radius: 10px;
  padding: 16px 20px;
  margin-top: 18px;
}

.example-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  color: var(--text-main, #0f172a);
  margin-bottom: 10px;
}

.example-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.84rem;
}

.example-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  color: var(--text-main, #0f172a);
}

.example-list strong {
  color: #b8860b;
}

[data-theme="dark"] .example-list strong {
  color: #fef08a;
}

.example-list small {
  color: var(--text-muted, #64748b);
  font-size: 0.74rem;
}

/* SHIFTS */
.btn-admin-add-shift {
  background: #2563eb;
  color: #fff;
  border: none;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
}

.btn-admin-add-shift:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.shifts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shift-item-card {
  background: var(--bg-card, #ffffff);
  border: 1.5px solid var(--border-color, #e2e8f0);
  border-radius: 10px;
  padding: 16px 20px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.shift-item-card:hover {
  border-color: rgba(37, 99, 235, 0.5);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
}

.shift-item-card.is-default {
  border-left: 4px solid var(--gold-primary, #d4af37);
}

.shift-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.shift-title {
  font-size: 0.98rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
}

.badge-default-shift {
  font-size: 0.68rem;
  font-weight: 800;
  background: rgba(212, 175, 55, 0.18);
  color: #b8860b;
  border: 1px solid rgba(212, 175, 55, 0.4);
  padding: 2px 7px;
  border-radius: 4px;
}

.shift-actions {
  display: flex;
  gap: 6px;
}

.btn-icon-sub {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: var(--bg-secondary, #f1f5f9);
  border: 1px solid var(--border-color, #cbd5e1);
  color: var(--text-main, #0f172a);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.78rem;
  transition: all 0.2s;
}

.btn-icon-sub:hover {
  background: #d4af37;
  color: #111827;
  border-color: #d4af37;
}

.btn-icon-sub.del:hover {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
}

.shift-time-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
  padding: 8px 12px;
  background: var(--bg-secondary, #f8fafc);
  border-radius: 6px;
}

.time-block {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.84rem;
}

.time-label {
  color: var(--text-muted, #64748b);
  font-weight: 600;
}

.time-val {
  font-size: 1.05rem;
  color: #2563eb;
  font-family: monospace;
  font-weight: 800;
}

.time-arrow {
  color: var(--text-muted, #94a3b8);
  font-size: 0.85rem;
}

.shift-bottom-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.76rem;
  color: var(--text-muted, #64748b);
}

.shift-office-tag {
  background: var(--bg-secondary, #f1f5f9);
  border: 1px solid var(--border-color, #e2e8f0);
  padding: 3px 9px;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
}

.shift-office-tag.all {
  color: #059669;
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.25);
}

.general-config-box {
  background: var(--bg-secondary, #f8fafc);
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 10px;
  padding: 18px;
}

.form-grid-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-grid-inner label {
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-muted, #64748b);
  margin-bottom: 6px;
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
  width: 17px;
  height: 17px;
  accent-color: #d4af37;
}
</style>
