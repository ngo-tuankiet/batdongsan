<template>
  <main style="padding: 110px 0 80px; min-height: 85vh;">
    <div class="container">
      
      <!-- 1. FORM ĐĂNG NHẬP NẾU CHƯA LOGIN -->
      <div v-if="!isLoggedIn" style="max-width: 440px; margin: 50px auto; background: var(--bg-card); border: 1px solid var(--border-gold); border-radius: var(--radius-lg); padding: 40px 30px; box-shadow: var(--shadow-md);">
        <div style="text-align: center; margin-bottom: 25px;">
          <div class="logo-icon" style="margin: 0 auto 12px; width: 52px; height: 52px; font-size: 1.4rem;">BT</div>
          <h2 style="font-size: 1.45rem; color: var(--text-main);">Đăng Nhập Quản Trị</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Dành cho Ban Giám Đốc & Quản lý Sàn Bến Thành</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div style="margin-bottom: 18px;">
            <label style="display: block; font-size: 0.85rem; margin-bottom: 6px; font-weight: 600;">Mật khẩu quản trị</label>
            <input v-model="password" type="password" class="filter-input" placeholder="Nhập mật khẩu (Mặc định: admin123)" required>
            <small style="color: var(--gold-primary); font-size: 0.78rem; margin-top: 4px; display: block;">* Mật khẩu mặc định: <strong>admin123</strong></small>
          </div>
          <button type="submit" class="btn btn-gold" style="width: 100%; padding: 12px;" :disabled="loginLoading">
            <i class="fa-solid fa-right-to-bracket"></i> {{ loginLoading ? 'Đang xác thực...' : 'Đăng Nhập CMS' }}
          </button>
        </form>
      </div>

      <!-- 2. BẢNG ĐIỀU KHIỂN QUẢN TRỊ ADMIN (CMS) -->
      <div v-else style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md);">
        
        <!-- Header Dashboard -->
        <div style="padding: 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); flex-wrap: wrap; gap: 15px;">
          <div>
            <h1 style="font-size: 1.45rem; color: var(--text-main); font-family: var(--font-heading);">
              <i class="fa-solid fa-gauge-high" style="color: var(--gold-primary);"></i> Trung Tâm Quản Trị Sàn Bến Thành
            </h1>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
              Quản lý danh mục BĐS, phân quyền nhân viên và theo dõi khách hàng tiềm năng (SQLite Engine)
            </p>
          </div>
          <button class="btn btn-outline-gold" style="font-size: 0.82rem; padding: 7px 16px;" @click="handleLogout">
            <i class="fa-solid fa-right-from-bracket"></i> Đăng Xuất
          </button>
        </div>

        <!-- Dashboard Navigation Tabs -->
        <div class="admin-tabs">
          <button 
            class="admin-tab-btn" 
            :class="{ active: activeTab === 'properties' }" 
            @click="activeTab = 'properties'"
          >
            <i class="fa-solid fa-building"></i> Quản Lý Nhà Đất ({{ properties.length }})
          </button>
          <button 
            class="admin-tab-btn" 
            :class="{ active: activeTab === 'agents' }" 
            @click="activeTab = 'agents'"
          >
            <i class="fa-solid fa-users"></i> Quản Lý Nhân Viên ({{ agents.length }})
          </button>
          <button 
            class="admin-tab-btn" 
            :class="{ active: activeTab === 'leads' }" 
            @click="activeTab = 'leads'"
          >
            <i class="fa-solid fa-envelope-open-text"></i> Khách Hàng Leads ({{ leads.length }})
          </button>
        </div>

        <!-- ==================== TAB 1: QUẢN LÝ NHÀ ĐẤT ==================== -->
        <div v-if="activeTab === 'properties'" class="admin-content-pane">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 10px;">
            <h3 style="font-size: 1.15rem; color: var(--text-main);">Danh Sách Bất Động Sản Trong Hệ Thống</h3>
            <button class="btn btn-gold" style="font-size: 0.85rem; padding: 8px 18px;" @click="openNewPropertyModal">
              <i class="fa-solid fa-plus"></i> Đăng Tin BĐS Mới
            </button>
          </div>

          <div style="overflow-x: auto;">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Mã BĐS</th>
                  <th>Tiêu Đề & Vị Trí</th>
                  <th>Giá Bán</th>
                  <th>Phân Loại</th>
                  <th>Phụ Trách</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in properties" :key="p.id">
                  <td><strong>{{ p.id }}</strong></td>
                  <td>
                    <div style="font-weight: 600; color: var(--text-main);">{{ p.title }}</div>
                    <small style="color: var(--text-muted);">{{ p.location }}</small>
                  </td>
                  <td><strong style="color: var(--gold-primary);">{{ p.price }}</strong></td>
                  <td>{{ p.category?.name || p.categoryId }}</td>
                  <td>
                    <span v-if="p.agent" style="color: var(--text-main); font-weight: 500;">
                      <i class="fa-solid fa-user-tie" style="color: var(--gold-primary);"></i> {{ p.agent.name }}
                    </span>
                    <span v-else style="color: var(--text-muted); font-style: italic;">Chưa gán</span>
                  </td>
                  <td>
                    <div style="display: flex; gap: 6px;">
                      <button class="btn btn-outline-gold" style="padding: 4px 10px; font-size: 0.78rem;" @click="openEditPropertyModal(p)">
                        <i class="fa-solid fa-pen"></i> Sửa
                      </button>
                      <button class="btn btn-call" style="background:#ef4444; padding: 4px 10px; font-size: 0.78rem;" @click="deleteProperty(p.id)">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ==================== TAB 2: QUẢN LÝ NHÂN VIÊN & PHÂN CÔNG ==================== -->
        <div v-if="activeTab === 'agents'" class="admin-content-pane">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 10px;">
            <h3 style="font-size: 1.15rem; color: var(--text-main);">Đội Ngũ Chuyên Viên & Phân Công Dự Án</h3>
            <button class="btn btn-gold" style="font-size: 0.85rem; padding: 8px 18px;" @click="openNewAgentModal">
              <i class="fa-solid fa-user-plus"></i> Thêm Nhân Viên Mới
            </button>
          </div>

          <div style="overflow-x: auto;">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Họ Tên & Chức Danh</th>
                  <th>Hotline</th>
                  <th>Dự Án / Căn Phụ Trách</th>
                  <th>Đã Chốt</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="a in agents" :key="a.id">
                  <td>
                    <img :src="a.avatar" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-gold);">
                  </td>
                  <td>
                    <strong style="font-size: 0.95rem;">{{ a.name }}</strong>
                    <div style="font-size: 0.78rem; color: var(--gold-primary);">{{ a.role }}</div>
                  </td>
                  <td><strong style="color: var(--text-main); font-size: 0.88rem;">{{ a.phoneDisplay || a.phone }}</strong></td>
                  <td>
                    <div style="margin-bottom: 4px;">
                      <strong style="color: var(--text-main);">{{ a.properties?.length || 0 }}</strong> căn phụ trách
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                      <span 
                        v-for="p in a.properties" 
                        :key="p.id"
                        style="background: rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.3); color: var(--gold-primary); padding: 2px 7px; border-radius: 4px; font-size: 0.75rem;"
                        :title="p.title"
                      >
                        {{ p.id }}
                      </span>
                    </div>
                  </td>
                  <td>{{ a.deals }}</td>
                  <td>
                    <div style="display: flex; gap: 6px;">
                      <!-- Nút Phân Công Dự Án -->
                      <button class="btn btn-outline-gold" style="padding: 4px 10px; font-size: 0.78rem;" @click="openAssignModal(a)">
                        <i class="fa-solid fa-house-chimney-user"></i> Giao Căn
                      </button>
                      <button class="btn btn-outline-gold" style="padding: 4px 10px; font-size: 0.78rem;" @click="openEditAgentModal(a)">
                        <i class="fa-solid fa-pen"></i> Sửa
                      </button>
                      <button class="btn btn-call" style="background:#ef4444; padding: 4px 10px; font-size: 0.78rem;" @click="deleteAgent(a.id)">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ==================== TAB 3: QUẢN LÝ LEADS ==================== -->
        <div v-if="activeTab === 'leads'" class="admin-content-pane">
          <h3 style="font-size: 1.15rem; color: var(--text-main); margin-bottom: 16px;">Danh Sách Khách Hàng Đăng Ký & Ký Gửi</h3>
          
          <div style="overflow-x: auto;">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Thời Gian</th>
                  <th>Họ Tên</th>
                  <th>Số Điện Thoại</th>
                  <th>Nhu Cầu</th>
                  <th>BĐS Quan Tâm / Địa Chỉ Ký Gửi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="leads.length === 0">
                  <td colspan="5" style="text-align: center; padding: 30px; color: var(--text-muted);">
                    Chưa có khách hàng nào để lại thông tin.
                  </td>
                </tr>
                <tr v-for="lead in leads" :key="lead.id">
                  <td>{{ new Date(lead.createdAt).toLocaleString('vi-VN') }}</td>
                  <td><strong>{{ lead.name }}</strong></td>
                  <td><a :href="`tel:${lead.phone}`" style="color: var(--gold-primary); font-weight: 600;">{{ lead.phone }}</a></td>
                  <td>{{ lead.demand || 'Tư vấn' }}</td>
                  <td>{{ lead.propertyInterest || lead.budget || '' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- ==================== MODAL THÊM / SỬA BĐS ==================== -->
      <div v-if="showPropModal" class="modal-overlay" @click.self="showPropModal = false">
        <div class="modal-dialog" style="max-width: 650px; padding: 30px;">
          <button class="modal-close-btn" @click="showPropModal = false">&times;</button>
          <h3 style="font-size: 1.3rem; margin-bottom: 20px; color: var(--gold-primary);">
            {{ propForm.isEdit ? 'Chỉnh Sửa Bất Động Sản' : 'Thêm Bất Động Sản Mới' }}
          </h3>

          <form @submit.prevent="saveProperty">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
              <div style="grid-column: span 2;">
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Tiêu đề tin đăng *</label>
                <input v-model="propForm.title" type="text" class="filter-input" placeholder="VD: Mặt tiền CMT8, P. Bến Thành" required>
              </div>

              <div>
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Phân loại *</label>
                <select v-model="propForm.categoryId" class="filter-select">
                  <option value="nha-pho">Nhà phố trung tâm</option>
                  <option value="can-ho">Căn hộ cao cấp</option>
                  <option value="mat-bang">Tòa nhà / Mặt bằng</option>
                  <option value="khach-san">Khách sạn du lịch</option>
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Giá hiển thị (VD: 38.5 Tỷ) *</label>
                <input v-model="propForm.price" type="text" class="filter-input" placeholder="38.5 Tỷ" required>
              </div>

              <div>
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Giá số (Tỷ) để lọc *</label>
                <input v-model="propForm.priceRaw" type="number" step="0.1" class="filter-input" placeholder="38.5" required>
              </div>

              <div>
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Diện tích (VD: 112 m²)</label>
                <input v-model="propForm.area" type="text" class="filter-input" placeholder="112 m²" required>
              </div>

              <div>
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Vị trí địa chỉ</label>
                <input v-model="propForm.location" type="text" class="filter-input" placeholder="Mặt tiền CMT8, P. Bến Thành, Q.1" required>
              </div>

              <div>
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Kết cấu (VD: 1 Hầm 5 Tầng)</label>
                <input v-model="propForm.structure" type="text" class="filter-input" placeholder="1 Hầm 5 Tầng Thang máy">
              </div>

              <div style="grid-column: span 2;">
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Link hình ảnh BĐS (URL)</label>
                <input v-model="propForm.image" type="url" class="filter-input" placeholder="https://images.unsplash.com/..." required>
              </div>

              <div>
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Nhân viên phụ trách</label>
                <select v-model="propForm.agentId" class="filter-select">
                  <option value="">-- Chưa gán (Chung) --</option>
                  <option v-for="a in agents" :key="a.id" :value="a.id">{{ a.name }} ({{ a.role }})</option>
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Pháp lý</label>
                <input v-model="propForm.legal" type="text" class="filter-input" placeholder="Sổ hồng hoàn công đầy đủ">
              </div>

              <div style="grid-column: span 2;">
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Dòng tiền khai thác / HĐ thuê</label>
                <input v-model="propForm.rentIncome" type="text" class="filter-input" placeholder="Đang có HĐ thuê 85 Triệu/tháng">
              </div>

              <div style="grid-column: span 2;">
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Mô tả chi tiết</label>
                <textarea v-model="propForm.description" rows="3" class="filter-input" placeholder="Vị trí đắc địa gần Chợ Bến Thành..."></textarea>
              </div>
            </div>

            <div style="text-align: right; display: flex; justify-content: flex-end; gap: 10px;">
              <button type="button" class="btn btn-outline-gold" @click="showPropModal = false">Hủy</button>
              <button type="submit" class="btn btn-gold">Lưu Bất Động Sản</button>
            </div>
          </form>
        </div>
      </div>

      <!-- ==================== MODAL THÊM / SỬA NHÂN VIÊN ==================== -->
      <div v-if="showAgentModal" class="modal-overlay" @click.self="showAgentModal = false">
        <div class="modal-dialog" style="max-width: 550px; padding: 30px;">
          <button class="modal-close-btn" @click="showAgentModal = false">&times;</button>
          <h3 style="font-size: 1.3rem; margin-bottom: 20px; color: var(--gold-primary);">
            {{ agentForm.isEdit ? 'Chỉnh Sửa Nhân Viên' : 'Thêm Nhân Viên Mới' }}
          </h3>

          <form @submit.prevent="saveAgent">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
              <div style="grid-column: span 2;">
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Họ và tên chuyên viên *</label>
                <input v-model="agentForm.name" type="text" class="filter-input" placeholder="Ví dụ: Ngô Tuấn Kiệt" required>
              </div>

              <div style="grid-column: span 2;">
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Chức danh / Phân khúc phụ trách *</label>
                <input v-model="agentForm.role" type="text" class="filter-input" placeholder="Chuyên Viên Nhà Phố & Tòa Nhà Q.1" required>
              </div>

              <div>
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Số điện thoại (Hotline) *</label>
                <input v-model="agentForm.phone" type="tel" class="filter-input" placeholder="0901234567" required>
              </div>

              <div>
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Link Zalo</label>
                <input v-model="agentForm.zalo" type="url" class="filter-input" placeholder="https://zalo.me/0901234567">
              </div>

              <div>
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Kinh nghiệm</label>
                <input v-model="agentForm.exp" type="text" class="filter-input" placeholder="6+ Năm">
              </div>

              <div>
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Đã giao dịch</label>
                <input v-model="agentForm.deals" type="text" class="filter-input" placeholder="135+ Căn">
              </div>

              <div style="grid-column: span 2;">
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Link Ảnh Avatar (Chân dung vest)</label>
                <input v-model="agentForm.avatar" type="url" class="filter-input" placeholder="https://images.unsplash.com/...">
              </div>

              <div style="grid-column: span 2;">
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Slogan cá nhân</label>
                <input v-model="agentForm.slogan" type="text" class="filter-input" placeholder="Tận Tâm - Minh Bạch - Đầu Tư Hiệu Quả">
              </div>

              <div style="grid-column: span 2;">
                <label style="display: block; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">Tag danh hiệu</label>
                <input v-model="agentForm.tag" type="text" class="filter-input" placeholder="Top Producer">
              </div>
            </div>

            <div style="text-align: right; display: flex; justify-content: flex-end; gap: 10px;">
              <button type="button" class="btn btn-outline-gold" @click="showAgentModal = false">Hủy</button>
              <button type="submit" class="btn btn-gold">Lưu Nhân Viên</button>
            </div>
          </form>
        </div>
      </div>

      <!-- ==================== MODAL PHÂN CÔNG DỰ ÁN CHO NHÂN VIÊN ==================== -->
      <div v-if="showAssignModal" class="modal-overlay" @click.self="showAssignModal = false">
        <div class="modal-dialog" style="max-width: 600px; padding: 30px;">
          <button class="modal-close-btn" @click="showAssignModal = false">&times;</button>
          
          <h3 style="font-size: 1.3rem; margin-bottom: 8px; color: var(--gold-primary);">
            <i class="fa-solid fa-list-check"></i> Phân Công Dự Án / Quỹ Căn
          </h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 20px;">
            Giao các bất động sản phụ trách cho chuyên viên: <strong style="color: var(--gold-primary);">{{ selectedAgentToAssign?.name }}</strong>
          </p>

          <div style="max-height: 380px; overflow-y: auto; padding-right: 8px; margin-bottom: 22px; display: flex; flex-direction: column; gap: 10px;">
            <label 
              v-for="p in properties" 
              :key="p.id"
              style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); cursor: pointer;"
            >
              <div style="display: flex; align-items: center; gap: 12px;">
                <input 
                  type="checkbox" 
                  :value="p.id" 
                  v-model="assignedPropertyIds"
                  style="width: 18px; height: 18px; accent-color: var(--gold-primary); cursor: pointer;"
                >
                <div>
                  <strong style="color: var(--text-main); font-size: 0.9rem;">[{{ p.id }}] {{ p.title }}</strong>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">{{ p.location }} • <span style="color:var(--gold-primary); font-weight:600;">{{ p.price }}</span></div>
                </div>
              </div>
              <span style="font-size: 0.75rem; color: #10b981; font-weight: 600;" v-if="assignedPropertyIds.includes(p.id)">
                ✓ Đang phụ trách
              </span>
            </label>
          </div>

          <div style="text-align: right; display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" class="btn btn-outline-gold" @click="showAssignModal = false">Hủy</button>
            <button type="button" class="btn btn-gold" @click="saveAssignment">Lưu Phân Công</button>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
const { showToast } = useToast();

const isLoggedIn = ref(false);
const password = ref('');
const loginLoading = ref(false);
const activeTab = ref<'properties' | 'agents' | 'leads'>('properties');

// Modals State
const showPropModal = ref(false);
const showAgentModal = ref(false);
const showAssignModal = ref(false);
const selectedAgentToAssign = ref<any>(null);
const assignedPropertyIds = ref<string[]>([]);

// Forms State
const propForm = reactive({
  isEdit: false,
  id: '',
  title: '',
  categoryId: 'nha-pho',
  price: '',
  priceRaw: 0,
  area: '',
  location: '',
  structure: '',
  image: '',
  agentId: '',
  legal: '',
  rentIncome: '',
  description: ''
});

const agentForm = reactive({
  isEdit: false,
  id: '',
  name: '',
  role: '',
  phone: '',
  zalo: '',
  exp: '5+ Năm',
  deals: '50+ Căn',
  avatar: '',
  slogan: '',
  tag: 'Chuyên Viên'
});

// Fetch Data từ Backend SQLite
const { data: propertiesData, refresh: refreshProps } = await useFetch('/api/properties');
const { data: agentsData, refresh: refreshAgents } = await useFetch('/api/agents');
const { data: leadsData, refresh: refreshLeads } = await useFetch('/api/leads');

const properties = computed(() => propertiesData.value || []);
const agents = computed(() => agentsData.value || []);
const leads = computed(() => leadsData.value || []);

onMounted(() => {
  if (localStorage.getItem('bds_admin_session')) {
    isLoggedIn.value = true;
  }
});

const handleLogin = async () => {
  loginLoading.value = true;
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { password: password.value },
    });
    if (res.success) {
      isLoggedIn.value = true;
      localStorage.setItem('bds_admin_session', res.token);
      showToast('Đăng nhập quản trị thành công!');
    }
  } catch (err: any) {
    alert(err?.data?.message || 'Mật khẩu sai! (Mặc định: admin123)');
  } finally {
    loginLoading.value = false;
  }
};

const handleLogout = () => {
  isLoggedIn.value = false;
  localStorage.removeItem('bds_admin_session');
  showToast('Đã đăng xuất khỏi hệ thống.');
};

// CRUD Properties
const openNewPropertyModal = () => {
  propForm.isEdit = false;
  propForm.id = '';
  propForm.title = '';
  propForm.categoryId = 'nha-pho';
  propForm.price = '';
  propForm.priceRaw = 0;
  propForm.area = '';
  propForm.location = '';
  propForm.structure = '';
  propForm.image = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
  propForm.agentId = '';
  propForm.legal = 'Sổ hồng hoàn công đầy đủ';
  propForm.rentIncome = '';
  propForm.description = '';
  showPropModal.value = true;
};

const openEditPropertyModal = (p: any) => {
  propForm.isEdit = true;
  propForm.id = p.id;
  propForm.title = p.title;
  propForm.categoryId = p.categoryId || 'nha-pho';
  propForm.price = p.price;
  propForm.priceRaw = p.priceRaw;
  propForm.area = p.area;
  propForm.location = p.location;
  propForm.structure = p.structure;
  propForm.image = p.image;
  propForm.agentId = p.agentId || '';
  propForm.legal = p.legal;
  propForm.rentIncome = p.rentIncome;
  propForm.description = p.description;
  showPropModal.value = true;
};

const saveProperty = async () => {
  try {
    if (propForm.isEdit) {
      await $fetch(`/api/properties/${propForm.id}`, {
        method: 'PUT',
        body: propForm,
      });
      showToast('Đã cập nhật bất động sản!');
    } else {
      await $fetch('/api/properties', {
        method: 'POST',
        body: propForm,
      });
      showToast('Đã đăng tin BĐS mới thành công!');
    }
    showPropModal.value = false;
    await refreshProps();
    await refreshAgents();
  } catch (e) {
    showToast('Lỗi khi lưu BĐS!');
  }
};

const deleteProperty = async (id: string) => {
  if (confirm(`Bạn có chắc chắn muốn xóa BĐS mã [${id}] không?`)) {
    try {
      await $fetch(`/api/properties/${id}`, { method: 'DELETE' });
      showToast('Đã xóa bất động sản!');
      await refreshProps();
      await refreshAgents();
    } catch (e) {
      showToast('Lỗi khi xóa BĐS!');
    }
  }
};

// CRUD Agents
const openNewAgentModal = () => {
  agentForm.isEdit = false;
  agentForm.id = '';
  agentForm.name = '';
  agentForm.role = 'Chuyên Viên Tư Vấn BĐS Q.1';
  agentForm.phone = '';
  agentForm.zalo = '';
  agentForm.exp = '5+ Năm';
  agentForm.deals = '50+ Căn';
  agentForm.avatar = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80';
  agentForm.slogan = 'Tận Tâm - Uy Tín - Đầu Tư Hiệu Quả';
  agentForm.tag = 'Chuyên Viên';
  showAgentModal.value = true;
};

const openEditAgentModal = (a: any) => {
  agentForm.isEdit = true;
  agentForm.id = a.id;
  agentForm.name = a.name;
  agentForm.role = a.role;
  agentForm.phone = a.phone;
  agentForm.zalo = a.zalo;
  agentForm.exp = a.exp;
  agentForm.deals = a.deals;
  agentForm.avatar = a.avatar;
  agentForm.slogan = a.slogan;
  agentForm.tag = a.tag;
  showAgentModal.value = true;
};

const saveAgent = async () => {
  try {
    if (agentForm.isEdit) {
      await $fetch(`/api/agents/${agentForm.id}`, {
        method: 'PUT',
        body: agentForm,
      });
      showToast('Đã cập nhật thông tin nhân viên!');
    } else {
      await $fetch('/api/agents', {
        method: 'POST',
        body: agentForm,
      });
      showToast('Đã thêm nhân viên mới thành công!');
    }
    showAgentModal.value = false;
    await refreshAgents();
  } catch (e) {
    showToast('Lỗi khi lưu nhân viên!');
  }
};

const deleteAgent = async (id: string) => {
  if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
    try {
      await $fetch(`/api/agents/${id}`, { method: 'DELETE' });
      showToast('Đã xóa nhân viên!');
      await refreshAgents();
    } catch (e) {
      showToast('Lỗi khi xóa nhân viên!');
    }
  }
};

// Phân công dự án
const openAssignModal = (agent: any) => {
  selectedAgentToAssign.value = agent;
  assignedPropertyIds.value = (agent.properties || []).map((p: any) => p.id);
  showAssignModal.value = true;
};

const saveAssignment = async () => {
  if (!selectedAgentToAssign.value) return;
  try {
    await $fetch(`/api/agents/${selectedAgentToAssign.value.id}/assign`, {
      method: 'POST',
      body: { propertyIds: assignedPropertyIds.value },
    });
    showToast(`Đã phân công ${assignedPropertyIds.value.length} bất động sản cho ${selectedAgentToAssign.value.name}!`);
    showAssignModal.value = false;
    await refreshAgents();
    await refreshProps();
  } catch (e) {
    showToast('Lỗi khi phân công dự án!');
  }
};

useHead({
  title: 'Hệ Thống Quản Trị CMS - Bất Động Sản Bến Thành',
});
</script>
