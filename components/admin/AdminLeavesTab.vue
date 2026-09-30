<template>
  <div class="leaves-container">
    <div class="table-filter-bar" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
      <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
        <div class="filter-group">
          <span class="filter-label"><i class="fa-solid fa-filter"></i> Trạng thái đơn:</span>
          <select v-model="filterStatus" class="admin-select">
            <option value="all">Tất cả đơn ({{ leaves.length }})</option>
            <option value="pending">⏳ Chờ duyệt ({{ countPending }})</option>
            <option value="approved">✓ Đã duyệt ({{ countApproved }})</option>
            <option value="rejected">✕ Đã từ chối ({{ countRejected }})</option>
          </select>
        </div>
      </div>

      <button class="btn-admin-primary" @click="openNewLeaveModal">
        <i class="fa-solid fa-plus"></i> + Tạo Đơn Xin Phép / Công Tác
      </button>
    </div>

    <!-- BẢNG ĐƠN XIN VẮNG -->
    <div class="admin-table-container">
      <table class="admin-data-table">
        <thead>
          <tr>
            <th style="width: 75px;">Mã NV</th>
            <th>Nhân Viên</th>
            <th>Loại Đơn</th>
            <th>Thời Gian</th>
            <th>Lý Do</th>
            <th style="text-align: center;">Trạng Thái</th>
            <th style="width: 170px; text-align: center;">Duyệt Đơn</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
              <i class="fa-solid fa-spinner fa-spin"></i> Đang tải danh sách đơn...
            </td>
          </tr>
          <tr v-else-if="filteredLeaves.length === 0">
            <td colspan="7" class="empty-table">
              <i class="fa-solid fa-inbox"></i>
              <p>Chưa có đơn xin phép hoặc công tác nào.</p>
            </td>
          </tr>
          <tr v-for="l in filteredLeaves" :key="l.id">
            <td>
              <span class="code-pill">{{ l.userCode || l.agent?.code || 'NV' }}</span>
            </td>
            <td>
              <div style="display: flex; align-items: center; gap: 12px;">
                <img :src="l.agent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'" class="agent-avatar-circle" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--border-gold);" alt="" />
                <div>
                  <strong style="color: var(--text-main, #0f172a); font-size: 0.9rem; display: block;">{{ l.userName || l.agent?.name }}</strong>
                  <span style="font-size: 0.74rem; color: var(--text-muted);">{{ l.agent?.role || 'Nhân viên' }}</span>
                </div>
              </div>
            </td>
            <td>
              <span v-if="l.type === 'trip'" class="leave-type-chip trip">
                <i class="fa-solid fa-car-side"></i> Đi Công Tác
              </span>
              <span v-else-if="l.type === 'late'" class="leave-type-chip late">
                <i class="fa-solid fa-clock"></i> Đi Trễ / Về Sớm
              </span>
              <span v-else class="leave-type-chip leave">
                <i class="fa-solid fa-house-user"></i> Nghỉ Phép
              </span>
            </td>
            <td>
              <div style="font-size: 0.85rem; color: var(--text-main, #0f172a);">
                <strong>{{ l.fromDate }}</strong>
                <span v-if="l.toDate && l.toDate !== l.fromDate" style="color: var(--text-muted);"> đến {{ l.toDate }}</span>
              </div>
            </td>
            <td>
              <span style="font-size: 0.85rem; color: var(--text-main, #0f172a); font-weight: 500;">{{ l.reason }}</span>
              <small v-if="l.note" style="display: block; color: var(--text-muted); font-size: 0.74rem; margin-top: 2px;">Phản hồi: {{ l.note }}</small>
            </td>
            <td style="text-align: center;">
              <span v-if="l.status === 'approved'" class="status-chip green">✓ ĐÃ DUYỆT</span>
              <span v-else-if="l.status === 'rejected'" class="status-chip red">✕ TỪ CHỐI</span>
              <span v-else class="status-chip orange">⏳ CHỜ DUYỆT</span>
            </td>
            <td style="text-align: center;">
              <div v-if="l.status === 'pending'" style="display: flex; gap: 6px; justify-content: center;">
                <button class="btn-action-approve" @click="updateStatus(l, 'approved')" title="Duyệt đơn này">
                  <i class="fa-solid fa-check"></i> Duyệt
                </button>
                <button class="btn-action-reject" @click="updateStatus(l, 'rejected')" title="Từ chối đơn">
                  <i class="fa-solid fa-xmark"></i> Từ Chối
                </button>
              </div>
              <span v-else style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">Đã xử lý</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL TẠO ĐƠN -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="admin-modal-card" style="max-width: 500px;">
        <div class="modal-header">
          <h3>
            <i class="fa-solid fa-file-pen" style="color: var(--gold-primary);"></i>
            Tạo Đơn Xin Vắng / Đi Công Tác
          </h3>
          <button class="modal-close-icon" @click="showModal = false">&times;</button>
        </div>

        <form @submit.prevent="submitLeave" class="modal-form">
          <div class="form-grid">
            <div class="form-col-full">
              <label>Chọn Nhân Viên *</label>
              <select v-model="modalForm.userId" class="admin-select" required>
                <option value="">-- Chọn nhân viên --</option>
                <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                  {{ emp.code || 'NV' }} - {{ emp.name }}
                </option>
              </select>
            </div>

            <div>
              <label>Loại Đơn *</label>
              <select v-model="modalForm.type" class="admin-select">
                <option value="leave">Nghỉ Phép Cá Nhân</option>
                <option value="trip">Đi Công Tác / Khảo Sát BĐS (Tính tiền công tác)</option>
                <option value="late">Xin Đến Muộn / Về Sớm</option>
              </select>
            </div>

            <div>
              <label>Từ Ngày *</label>
              <input v-model="modalForm.fromDate" type="date" class="admin-input" required />
            </div>

            <div>
              <label>Đến Ngày (Tùy chọn)</label>
              <input v-model="modalForm.toDate" type="date" class="admin-input" />
            </div>

            <div>
              <label>Trạng Thái</label>
              <select v-model="modalForm.status" class="admin-select">
                <option value="approved">Duyệt Luôn (Approved)</option>
                <option value="pending">Chờ Duyệt (Pending)</option>
              </select>
            </div>

            <div class="form-col-full">
              <label>Lý do chi tiết *</label>
              <textarea v-model="modalForm.reason" rows="3" class="admin-textarea" placeholder="Nhập lý do xin vắng hoặc địa điểm công tác..." required></textarea>
            </div>
          </div>

          <div class="modal-actions-footer" style="margin-top: 20px;">
            <button type="button" class="btn-admin-cancel" @click="showModal = false">Hủy</button>
            <button type="submit" class="btn-admin-primary" :disabled="saving">
              <i class="fa-solid fa-paper-plane"></i> Gửi Đơn
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

const filterStatus = ref('all');
const loading = ref(false);
const saving = ref(false);
const showModal = ref(false);

const leaves = ref<any[]>([]);
const employees = ref<any[]>([]);

const getToday = () => new Date().toISOString().slice(0, 10);

const modalForm = reactive({
  userId: '',
  type: 'trip',
  fromDate: getToday(),
  toDate: getToday(),
  reason: '',
  status: 'approved',
});

const loadLeaves = async () => {
  loading.value = true;
  try {
    const data: any = await $fetch('/api/cham-cong/leaves');
    leaves.value = data || [];
  } catch (err) {
    console.error('Lỗi tải đơn:', err);
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

const countPending = computed(() => leaves.value.filter(l => l.status === 'pending').length);
const countApproved = computed(() => leaves.value.filter(l => l.status === 'approved').length);
const countRejected = computed(() => leaves.value.filter(l => l.status === 'rejected').length);

const filteredLeaves = computed(() => {
  if (filterStatus.value === 'all') return leaves.value;
  return leaves.value.filter(l => l.status === filterStatus.value);
});

const openNewLeaveModal = () => {
  modalForm.userId = employees.value[0]?.id || '';
  modalForm.type = 'trip';
  modalForm.fromDate = getToday();
  modalForm.toDate = getToday();
  modalForm.reason = '';
  modalForm.status = 'approved';
  showModal.value = true;
};

const submitLeave = async () => {
  saving.value = true;
  try {
    const res: any = await $fetch('/api/cham-cong/leaves', {
      method: 'POST',
      body: modalForm,
    });
    if (res?.success) {
      showToast('Đã tạo đơn thành công!');
      showModal.value = false;
      await loadLeaves();
    }
  } catch (err: any) {
    alert(err?.data?.message || 'Lỗi khi tạo đơn!');
  } finally {
    saving.value = false;
  }
};

const updateStatus = async (leave: any, nextStatus: 'approved' | 'rejected') => {
  try {
    await $fetch(`/api/cham-cong/leaves/${leave.id}`, {
      method: 'PUT',
      body: { status: nextStatus },
    });
    showToast(`Đã ${nextStatus === 'approved' ? 'DUYỆT' : 'TỪ CHỐI'} đơn thành công!`);
    await loadLeaves();
  } catch (err: any) {
    alert(err?.data?.message || 'Lỗi khi cập nhật trạng thái đơn!');
  }
};

onMounted(() => {
  loadLeaves();
  loadEmployees();
});
</script>

<style scoped>
.leaves-container {
  padding: 10px 0;
}

.leave-type-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.76rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
}

.leave-type-chip.trip {
  background: rgba(147, 51, 234, 0.12);
  color: #7c3aed;
  border: 1px solid rgba(147, 51, 234, 0.25);
}

.leave-type-chip.late {
  background: rgba(217, 119, 6, 0.12);
  color: #d97706;
  border: 1px solid rgba(217, 119, 6, 0.25);
}

.leave-type-chip.leave {
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
  border: 1px solid rgba(37, 99, 235, 0.25);
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 800;
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

.status-chip.red {
  background: rgba(239, 68, 68, 0.14);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.btn-action-approve {
  background: #059669;
  color: #fff;
  border: none;
  font-weight: 700;
  font-size: 0.76rem;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(5, 150, 105, 0.3);
}

.btn-action-approve:hover {
  background: #047857;
  transform: translateY(-1px);
}

.btn-action-reject {
  background: #dc2626;
  color: #fff;
  border: none;
  font-weight: 700;
  font-size: 0.76rem;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(220, 38, 38, 0.3);
}

.btn-action-reject:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}
</style>
