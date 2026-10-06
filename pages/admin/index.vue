<template>
  <div class="admin-root" :data-theme="theme">
    <!-- Toast Thông Báo Góc Phải -->
    <div v-if="toastMsg" class="admin-toast">
      <i class="fa-solid fa-circle-check"></i>
      <span>{{ toastMsg }}</span>
    </div>

    <!-- 1. MÀN HÌNH ĐĂNG NHẬP (HỖ TRỢ CẢ ADMIN & NHÂN VIÊN USER) -->
    <div v-if="!isLoggedIn" class="admin-login-wrapper">
      <div class="admin-login-box">
        <div class="login-header">
          <div class="admin-brand-logo-wrap" style="margin: 0 auto 12px; width: 60px; height: 60px;">
            <img src="/images/logo-ben-thanh.png" alt="Bến Thành Land" class="admin-sidebar-logo-img">
          </div>
          <h2>Hệ Thống Bến Thành Land</h2>
          <p>Cổng Điều Hành Doanh Nghiệp & Chấm Công Bến Thành Land</p>
        </div>

        <!-- NÚT CHUYỂN ĐỔI: ĐĂNG NHẬP / ĐĂNG KÝ TÀI KHOẢN -->
        <div class="auth-mode-switch">
          <button 
            type="button" 
            class="auth-switch-btn"
            :class="{ active: authMode === 'login' }"
            @click="authMode = 'login'" 
          >
            <i class="fa-solid fa-right-to-bracket"></i> Đăng Nhập
          </button>
          <button 
            type="button" 
            class="auth-switch-btn"
            :class="{ active: authMode === 'register' }"
            @click="authMode = 'register'" 
          >
            <i class="fa-solid fa-user-plus"></i> Đăng Ký Tài Khoản
          </button>
        </div>

        <!-- FORM 1: ĐĂNG NHẬP -->
        <form v-if="authMode === 'login'" @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>Tài khoản / Mã nhân viên *</label>
            <div class="input-with-icon">
              <i class="fa-solid fa-user"></i>
              <input 
                v-model="loginUsername" 
                type="text" 
                placeholder="Mã NV (VD: NV001), username hoặc admin..." 
                required
                autocomplete="username"
              >
            </div>
          </div>

          <div class="form-group">
            <label>Mật khẩu *</label>
            <div class="input-with-icon" style="position: relative;">
              <i class="fa-solid fa-lock"></i>
              <input 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="Nhập mật khẩu (Mặc định: 123456)..." 
                required
                autocomplete="current-password"
                style="padding-right: 40px;"
              >
              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.9rem;"
                tabindex="-1"
                :title="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
              >
                <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Thông báo lỗi khi sai pass hoặc tài khoản bị khóa -->
          <div v-if="loginError" style="margin-bottom: 16px; padding: 10px 14px; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; color: #dc2626; font-size: 0.82rem; display: flex; align-items: flex-start; gap: 8px; text-align: left;">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1rem; flex-shrink: 0; margin-top: 2px;"></i>
            <span>{{ loginError }}</span>
          </div>

          <button type="submit" class="btn-admin-primary login-btn" :disabled="loginLoading">
            <i class="fa-solid fa-right-to-bracket"></i>
            {{ loginLoading ? 'Đang xác thực...' : 'Đăng Nhập Vào Hệ Thống' }}
          </button>
        </form>

        <!-- FORM 2: ĐĂNG KÝ TÀI KHOẢN NHÂN VIÊN MỚI -->
        <form v-else @submit.prevent="handleRegister" class="login-form">
          <div class="form-group">
            <label>Họ và tên nhân viên *</label>
            <div class="input-with-icon">
              <i class="fa-solid fa-id-card"></i>
              <input v-model="registerForm.name" type="text" placeholder="Ví dụ: Nguyễn Văn Nam" required>
            </div>
          </div>

          <div class="form-group">
            <label>Số điện thoại (Hotline) *</label>
            <div class="input-with-icon">
              <i class="fa-solid fa-phone"></i>
              <input v-model="registerForm.phone" type="tel" placeholder="Ví dụ: 0901234567" required>
            </div>
          </div>

          <div class="form-group">
            <label>Tên đăng nhập (Username) *</label>
            <div class="input-with-icon">
              <i class="fa-solid fa-user"></i>
              <input v-model="registerForm.username" type="text" placeholder="VD: namnguyen" required>
            </div>
          </div>

          <div class="form-group">
            <label>Mật khẩu khởi tạo *</label>
            <div class="input-with-icon">
              <i class="fa-solid fa-lock"></i>
              <input v-model="registerForm.password" type="text" placeholder="Mặc định: 123456" required>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
            <div>
              <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">Văn phòng *</label>
              <select v-model="registerForm.officeId" class="admin-select" required>
                <option v-for="o in officesList" :key="o.id" :value="o.id">
                  {{ o.name }} ({{ o.id }})
                </option>
              </select>
            </div>
            <div>
              <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">Phòng ban *</label>
              <select v-model="registerForm.departmentId" class="admin-select" required>
                <option v-for="d in filteredDepartmentsForRegister" :key="d.id" :value="d.id">
                  {{ d.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Thông báo lỗi khi đăng ký -->
          <div v-if="registerError" style="margin-bottom: 16px; padding: 10px 14px; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; color: #dc2626; font-size: 0.82rem; display: flex; align-items: flex-start; gap: 8px; text-align: left;">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1rem; flex-shrink: 0; margin-top: 2px;"></i>
            <span>{{ registerError }}</span>
          </div>

          <button type="submit" class="btn-admin-primary login-btn btn-register-submit" :disabled="registerLoading">
            <i class="fa-solid fa-user-plus"></i>
            {{ registerLoading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản & Cấp Mã NV' }}
          </button>
        </form>

        <!-- Thẻ hướng dẫn nhanh tài khoản -->
        <div v-if="authMode === 'login'" class="auth-credential-guide">
          <strong style="color: var(--adm-text-main); display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <i class="fa-solid fa-circle-info" style="color: #3b82f6;"></i> Thông tin đăng nhập hệ thống:
          </strong>
          <div style="color: var(--adm-text-muted); line-height: 1.6;">
            <div>• <strong>Quản trị viên (Admin):</strong> <code>admin</code> (Mật khẩu: <code>Kiet1234@</code>)</div>
            <div>• <strong>Nhân viên / Sales:</strong> Mã NV (VD: <code>NV001</code>, <code>NV010</code>...) hoặc Username (Pass mặc định: <code>123456</code>)</div>
          </div>
        </div>

        <div class="login-footer" style="margin-top: 16px;">
          <NuxtLink to="/" class="back-home-link">
            <i class="fa-solid fa-arrow-left"></i> Quay lại trang chủ khách
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 2. DASHBOARD QUẢN TRỊ VỚI THANH BÊN (SIDEBAR) BÊN TRÁI -->
    <div v-else class="admin-dashboard">
      <!-- Backdrop cho màn hình điện thoại khi mở sidebar -->
      <div 
        v-if="mobileSidebarOpen" 
        class="admin-sidebar-backdrop" 
        @click="mobileSidebarOpen = false"
      ></div>

      <!-- THANH BÊN BÊN TRÁI (EXECUTIVE SLATE & GOLD SIDEBAR) -->
      <aside class="admin-sidebar" :class="{ 'sidebar-open': mobileSidebarOpen, 'sidebar-collapsed': isSidebarCollapsed }">
        <!-- Brand Header -->
        <div class="sidebar-brand">
          <div class="admin-brand-logo-wrap" @click="toggleSidebar" :title="isSidebarCollapsed ? 'Bấm để mở rộng sidebar (Ctrl+B)' : 'Thu gọn sidebar (Ctrl+B)'" style="cursor: pointer;">
            <img src="/images/logo-ben-thanh.png" alt="Bến Thành Land" class="admin-sidebar-logo-img">
          </div>
          <div class="brand-info">
            <h3 class="brand-title">BẾN THÀNH LAND</h3>
            <span class="brand-badge"><i class="fa-solid fa-shield-halved"></i> Trung Tâm Điều Hành</span>
          </div>
          <button class="sidebar-collapse-btn" @click="toggleSidebar" :title="isSidebarCollapsed ? 'Mở rộng sidebar (Ctrl+B)' : 'Thu gọn sidebar (Ctrl+B)'">
            <i :class="isSidebarCollapsed ? 'fa-solid fa-angles-right' : 'fa-solid fa-angles-left'"></i>
          </button>
          <button class="sidebar-close-btn" @click="mobileSidebarOpen = false" aria-label="Đóng menu">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Trạng thái Tài Khoản Đang Đăng Nhập -->
        <div class="admin-user-card" :title="isSidebarCollapsed ? (currentUser?.name || 'Tài khoản điều hành') : ''">
          <div class="user-avatar-wrap">
            <img v-if="currentUser?.avatar" :src="currentUser.avatar" alt="Avatar" class="user-avatar-img" />
            <div v-else class="user-avatar-placeholder">
              <i class="fa-solid fa-user-tie"></i>
            </div>
            <span class="user-online-dot" title="Đang trực tuyến"></span>
          </div>
          <div class="user-meta-info">
            <strong class="user-display-name" :title="currentUser?.name">{{ currentUser?.name || 'Ban Điều Hành Sàn' }}</strong>
            <div class="user-role-line">
              <span class="user-role-badge" :class="currentUser?.role || 'user'">
                {{ currentUser?.role === 'admin' ? '👑 Admin' : currentUser?.role === 'manager' ? '👔 Quản Lý' : '👤 Nhân Viên' }}
              </span>
              <span v-if="currentUser?.code" class="user-code-pill">{{ currentUser.code }}</span>
            </div>
          </div>
        </div>

        <!-- Menu Điều Hướng Phân Hệ -->
        <div class="sidebar-scrollable-menu">
          <!-- NHÓM 1: BẤT ĐỘNG SẢN & KINH DOANH -->
          <div class="menu-group">
            <div class="menu-group-title">
              <span>KINH DOANH & BĐS</span>
            </div>
            <nav class="sidebar-nav">
              <button 
                class="nav-item" 
                :class="{ active: activeTab === 'properties' }"
                @click="switchTab('properties')"
                :title="isSidebarCollapsed ? `Quỹ Căn BĐS (${properties.length})` : ''"
              >
                <div class="nav-item-left">
                  <div class="nav-icon gold"><i class="fa-solid fa-building"></i></div>
                  <span class="nav-label">Quỹ Căn BĐS</span>
                </div>
                <span class="nav-count-badge gold">{{ properties.length }}</span>
              </button>

              <button 
                class="nav-item" 
                :class="{ active: activeTab === 'leads' }"
                @click="switchTab('leads')"
                :title="isSidebarCollapsed ? `Khách Hàng Leads (${leads.length})` : ''"
              >
                <div class="nav-item-left">
                  <div class="nav-icon green"><i class="fa-solid fa-envelope-open-text"></i></div>
                  <span class="nav-label">Khách Hàng Leads</span>
                </div>
                <span class="nav-count-badge green">{{ leads.length }}</span>
              </button>
            </nav>
          </div>

          <!-- NHÓM: TRUYỀN THÔNG & WEBSITE (ĐĂNG TIN & BANNER) -->
          <div class="menu-group">
            <div class="menu-group-title">
              <span>TRUYỀN THÔNG & WEBSITE</span>
            </div>
            <nav class="sidebar-nav">
              <button 
                class="nav-item" 
                :class="{ active: activeTab === 'articles' }"
                @click="switchTab('articles')"
                :title="isSidebarCollapsed ? `Đăng Tin & Tin Tức (${articles.length})` : ''"
              >
                <div class="nav-item-left">
                  <div class="nav-icon purple"><i class="fa-solid fa-newspaper"></i></div>
                  <span class="nav-label">Đăng Tin & Tin Tức</span>
                </div>
                <span class="nav-count-badge purple">
                  {{ articles.length }}
                  <span v-if="articles.some(a => !a.isPublished)" class="badge-dot-warn" title="Có bản nháp"></span>
                </span>
              </button>

              <button 
                class="nav-item" 
                :class="{ active: activeTab === 'banners' }"
                @click="switchTab('banners')"
                :title="isSidebarCollapsed ? `Banner Quảng Cáo (${banners.length})` : ''"
              >
                <div class="nav-item-left">
                  <div class="nav-icon amber"><i class="fa-solid fa-rectangle-ad"></i></div>
                  <span class="nav-label">Banner Quảng Cáo</span>
                </div>
                <span class="nav-count-badge amber">{{ banners.length }}</span>
              </button>
            </nav>
          </div>

          <!-- NHÓM 2: CHẤM CÔNG & NHÂN SỰ -->
          <div class="menu-group">
            <div class="menu-group-title">
              <span>CHẤM CÔNG & NHÂN SỰ</span>
            </div>
            <nav class="sidebar-nav">
              <!-- Mục 1: Chấm công WiFi cá nhân (Tách riêng biệt) -->
              <button 
                class="nav-item" 
                :class="{ active: activeTab === 'checkin' }"
                @click="switchTab('checkin')"
                :title="isSidebarCollapsed ? 'Chấm Công WiFi' : ''"
              >
                <div class="nav-item-left">
                  <div class="nav-icon purple"><i class="fa-solid fa-wifi"></i></div>
                  <span class="nav-label">Chấm Công WiFi</span>
                </div>
              </button>

              <!-- Mục 2: Thống kê điểm danh (Tách riêng cho theo dõi & xem báo cáo) -->
              <button 
                class="nav-item" 
                :class="{ active: activeTab === 'attendance' }"
                @click="switchTab('attendance')"
                :title="isSidebarCollapsed ? 'Thống Kê Điểm Danh' : ''"
              >
                <div class="nav-item-left">
                  <div class="nav-icon emerald"><i class="fa-solid fa-chart-pie"></i></div>
                  <span class="nav-label">Thống Kê Điểm Danh</span>
                </div>
              </button>

              <button 
                v-if="!currentUser || currentUser.role !== 'user'"
                class="nav-item" 
                :class="{ active: activeTab === 'agents' }"
                @click="switchTab('agents')"
                :title="isSidebarCollapsed ? `Đội Ngũ Nhân Sự (${agents.length})` : ''"
              >
                <div class="nav-item-left">
                  <div class="nav-icon blue"><i class="fa-solid fa-user-tie"></i></div>
                  <span class="nav-label">Đội Ngũ Nhân Sự ⭐</span>
                </div>
                <span class="nav-count-badge blue">{{ agents.length }}</span>
              </button>

              <button 
                class="nav-item" 
                :class="{ active: activeTab === 'leaves' }"
                @click="switchTab('leaves')"
                :title="isSidebarCollapsed ? 'Đơn Nghỉ / Công Tác' : ''"
              >
                <div class="nav-item-left">
                  <div class="nav-icon orange"><i class="fa-solid fa-file-signature"></i></div>
                  <span class="nav-label">Đơn Nghỉ / Công Tác</span>
                </div>
              </button>

              <button 
                class="nav-item" 
                :class="{ active: activeTab === 'payroll' }"
                @click="switchTab('payroll')"
                :title="isSidebarCollapsed ? (currentUser?.role === 'user' ? 'Phiếu Lương Của Tôi' : 'Bảng Lương 4 Khoản') : ''"
              >
                <div class="nav-item-left">
                  <div class="nav-icon gold"><i class="fa-solid fa-file-invoice-dollar"></i></div>
                  <span class="nav-label">{{ currentUser?.role === 'user' ? 'Phiếu Lương Của Tôi' : 'Bảng Lương 4 Khoản' }}</span>
                </div>
              </button>
            </nav>
          </div>

          <!-- NHÓM 3: HỆ THỐNG & CẤU HÌNH (ADMIN ONLY) -->
          <div v-if="!currentUser || currentUser.role === 'admin'" class="menu-group">
            <div class="menu-group-title">
              <span>HỆ THỐNG ĐIỀU HÀNH</span>
            </div>
            <nav class="sidebar-nav">
              <button 
                class="nav-item" 
                :class="{ active: activeTab === 'salary_settings' }"
                @click="switchTab('salary_settings')"
                :title="isSidebarCollapsed ? 'Cài Đặt Lương & Giờ' : ''"
              >
                <div class="nav-item-left">
                  <div class="nav-icon purple"><i class="fa-solid fa-sliders"></i></div>
                  <span class="nav-label">Cài Đặt Lương & Giờ</span>
                </div>
              </button>

              <button 
                class="nav-item" 
                :class="{ active: activeTab === 'offices' }"
                @click="switchTab('offices')"
                :title="isSidebarCollapsed ? 'Văn Phòng & WiFi' : ''"
              >
                <div class="nav-item-left">
                  <div class="nav-icon cyan"><i class="fa-solid fa-network-wired"></i></div>
                  <span class="nav-label">Văn Phòng & WiFi</span>
                </div>
              </button>
            </nav>
          </div>

        </div>

        <!-- Chân Sidebar: Nút Về Trang Chủ & Đăng Xuất -->
        <div class="sidebar-footer">
          <NuxtLink to="/" target="_blank" class="sidebar-home-btn" :title="isSidebarCollapsed ? 'Về Trang Chủ Web' : 'Mở trang chủ website khách'">
            <div style="display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-house" style="color: var(--adm-gold);"></i>
              <span>Về Trang Chủ Web</span>
            </div>
            <i class="fa-solid fa-arrow-up-right-from-square external-icon"></i>
          </NuxtLink>

          <button class="logout-btn" @click="handleLogout" :title="isSidebarCollapsed ? 'Đăng Xuất Hệ Thống' : ''">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Đăng Xuất Hệ Thống</span>
          </button>
        </div>
      </aside>

      <!-- KHU VỰC NỘI DUNG CHÍNH (MAIN BODY) -->
      <main class="admin-main">
        <!-- Topbar Điều Khiển Trên Cùng -->
        <header class="admin-topbar">
          <div class="topbar-left">
            <!-- Nút Bật/Tắt Thu Gọn Menu (Co hẹp & Mở rộng ra vào) -->
            <button class="topbar-toggle-sidebar-btn" @click="toggleSidebar" :title="isSidebarCollapsed ? 'Mở rộng menu (Ctrl+B)' : 'Thu gọn menu (Ctrl+B)'">
              <i :class="isSidebarCollapsed ? 'fa-solid fa-bars' : 'fa-solid fa-bars-staggered'"></i>
            </button>
            <div class="page-title-area">
              <div class="breadcrumb">
                <span>Bến Thành Land</span>
                <i class="fa-solid fa-chevron-right"></i>
                <span class="active-crumb">
                  {{ 
                    activeTab === 'properties' ? 'Quản Lý Bất Động Sản' : 
                    activeTab === 'agents' ? 'Nhân Viên & Quản Lý User (⭐ Lên Web)' : 
                    activeTab === 'articles' ? 'Tin Tức & Góc Nhìn Đầu Tư' :
                    activeTab === 'banners' ? 'Quản Lý Banner Quảng Cáo' :
                    activeTab === 'leads' ? 'Khách Hàng Leads' :
                    activeTab === 'checkin' ? 'Chấm Công WiFi' :
                    activeTab === 'attendance' ? 'Thống Kê Điểm Danh' :
                    activeTab === 'leaves' ? 'Duyệt Đơn Nghỉ Phép & Công Tác' :
                    activeTab === 'payroll' ? (currentUser?.role === 'user' ? 'Phiếu Lương Cá Nhân' : 'Bảng Lương Nhân Sự 4 Khoản') :
                    activeTab === 'salary_settings' ? 'Cài Đặt Định Mức Lương & Khung Giờ' :
                    activeTab === 'offices' ? 'Cấu Hình Văn Phòng & WiFi Điểm Danh' :
                    'Bảng Điều Hành' 
                  }}
                </span>
              </div>
              <h1 class="page-heading">
                {{ 
                  activeTab === 'properties' ? 'Danh Sách Quỹ Căn BĐS' : 
                  activeTab === 'agents' ? 'Đội Ngũ Nhân Sự & Đồng Bộ Web BĐS (⭐)' : 
                  activeTab === 'articles' ? 'Quản Lý Bài Viết & Tin Thị Trường' :
                  activeTab === 'banners' ? 'Cấu Hình Banner Quảng Cáo Sàn BĐS' :
                  activeTab === 'leads' ? 'Khách Hàng Đăng Ký & Ký Gửi' :
                  activeTab === 'checkin' ? 'Chấm Công WiFi Điểm Danh & Giờ Làm' :
                  activeTab === 'attendance' ? 'Thống Kê Điểm Danh & Báo Cáo Toàn Sàn' :
                  activeTab === 'leaves' ? 'Quản Lý Đơn Nghỉ & Phê Duyệt' :
                  activeTab === 'payroll' ? (currentUser?.role === 'user' ? 'Phiếu Lương Cá Nhân 4 Khoản' : 'Bảng Tổng Hợp Lương & Phụ Cấp 4 Khoản') :
                  activeTab === 'salary_settings' ? 'Định Mức Lương 4 Khoản & Khung Giờ Ca Làm' :
                  activeTab === 'offices' ? 'Văn Phòng Trụ Sở & Cấu Hình Mạng WiFi' :
                  'Bảng Điều Hành'
                }}
              </h1>
            </div>
          </div>

          <div class="topbar-right">
            <!-- Nút Tạo Mới Tương Ứng Từng Phân Hệ -->
            <button 
              v-if="activeTab === 'properties'" 
              class="btn-admin-primary" 
              @click="openNewPropertyModal"
            >
              <i class="fa-solid fa-plus"></i>
              <span>Đăng Tin BĐS Mới</span>
            </button>

            <button 
              v-if="activeTab === 'agents'" 
              class="btn-admin-primary" 
              @click="openNewAgentModal"
            >
              <i class="fa-solid fa-user-plus"></i>
              <span>+ Tạo Tài Khoản / Thêm Nhân Viên</span>
            </button>

            <button 
              v-if="activeTab === 'banners'" 
              class="btn-admin-primary" 
              @click="openNewBannerModal"
            >
              <i class="fa-solid fa-plus"></i>
              <span>Thêm Banner Mới</span>
            </button>

            <!-- Nút Hành Động Cho Tab Tin Tức (Cào tin + Viết bài) -->
            <template v-if="activeTab === 'articles'">
              <button 
                class="btn-admin-crawl" 
                :disabled="crawlingNews"
                @click="handleCrawlNews"
                title="Kéo các tin thị trường BĐS mới nhất từ CafeLand.vn về làm bản nháp"
              >
                <i class="fa-solid fa-bolt" :class="{ 'fa-spin': crawlingNews }"></i>
                <span>{{ crawlingNews ? 'Đang Lấy Tin...' : '⚡ Cào Tin Mới' }}</span>
              </button>

              <button 
                class="btn-admin-primary" 
                @click="openNewArticleModal"
              >
                <i class="fa-solid fa-pen-to-square"></i>
                <span>Viết Bài Mới</span>
              </button>
            </template>

            <!-- Nút Xem Website Trang Chủ -->
            <NuxtLink to="/" target="_blank" class="topbar-home-btn" title="Mở trang chủ website khách ngoài tab mới">
              <i class="fa-solid fa-house" style="color: var(--adm-gold);"></i>
              <span>Trang Chủ Web</span>
              <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.68rem; opacity: 0.7;"></i>
            </NuxtLink>

            <!-- Quick Theme Switch -->
            <button class="topbar-icon-btn" @click="toggleTheme" :title="`Chuyển sang nền ${theme === 'dark' ? 'sáng' : 'tối'}`">
              <i :class="theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
            </button>

            <button class="topbar-logout-btn" @click="handleLogout" title="Đăng xuất">
              <i class="fa-solid fa-power-off"></i>
            </button>
          </div>
        </header>

        <!-- Thống Kê Tổng Quan KPI Tinh Gọn (Quỹ Căn BĐS, Leads, Banner, Đăng Tin) -->
        <section v-if="['properties', 'leads', 'banners', 'articles'].includes(activeTab)" class="admin-kpi-grid">
          <div class="kpi-card" :class="{ 'kpi-card-active': activeTab === 'properties' }" @click="switchTab('properties')">
            <div class="kpi-icon-wrap gold">
              <i class="fa-solid fa-building"></i>
            </div>
            <div class="kpi-data-body">
              <div class="kpi-num">{{ properties.length }}</div>
              <div class="kpi-label">Quỹ Căn BĐS</div>
              <div class="kpi-sub-line">
                <span>{{ properties.filter(p => p.categoryId === 'nha-pho').length }} Nhà Phố</span> • 
                <span>{{ properties.filter(p => p.categoryId === 'du-an').length }} Dự Án</span>
              </div>
            </div>
          </div>

          <div class="kpi-card" :class="{ 'kpi-card-active': activeTab === 'leads' }" @click="switchTab('leads')">
            <div class="kpi-icon-wrap green">
              <i class="fa-solid fa-envelope-open-text"></i>
            </div>
            <div class="kpi-data-body">
              <div class="kpi-num">{{ leads.length }}</div>
              <div class="kpi-label">Khách Hàng Leads</div>
              <div class="kpi-sub-line">
                <span style="color: #10b981;">Đăng ký xem & ký gửi</span>
              </div>
            </div>
          </div>

          <div class="kpi-card" :class="{ 'kpi-card-active': activeTab === 'banners' }" @click="switchTab('banners')">
            <div class="kpi-icon-wrap amber">
              <i class="fa-solid fa-rectangle-ad"></i>
            </div>
            <div class="kpi-data-body">
              <div class="kpi-num">{{ banners.length }}</div>
              <div class="kpi-label">Banner Quảng Cáo</div>
              <div class="kpi-sub-line">
                <span style="color:#10b981;">{{ banners.filter(b => b.isActive).length }} Bật</span> • 
                <span>{{ banners.filter(b => !b.isActive).length }} Tắt</span>
              </div>
            </div>
          </div>

          <div class="kpi-card" :class="{ 'kpi-card-active': activeTab === 'articles' }" @click="switchTab('articles')">
            <div class="kpi-icon-wrap purple">
              <i class="fa-solid fa-newspaper"></i>
            </div>
            <div class="kpi-data-body">
              <div class="kpi-num">{{ articles.length }}</div>
              <div class="kpi-label">Đăng Tin & Tin Tức</div>
              <div class="kpi-sub-line">
                <span style="color:#10b981;">{{ articles.filter(a => a.isPublished).length }} Xuất bản</span> • 
                <span style="color:#f59e0b;">{{ articles.filter(a => !a.isPublished).length }} Bản nháp</span>
              </div>
            </div>
          </div>
        </section>

        <!-- NỘI DUNG TỪNG PHÂN HỆ -->
        <div class="admin-content-box">
          <!-- ==================== TAB 1: QUẢN LÝ NHÀ ĐẤT ==================== -->
          <div v-if="activeTab === 'properties'" class="tab-pane">
            <!-- Thanh Bộ Lọc -->
            <div class="table-filter-bar">
              <div class="filter-left-group">
                <div class="filter-group">
                  <span class="filter-label"><i class="fa-solid fa-filter"></i> Phân loại:</span>
                  <select v-model="adminPropFilter.category" class="admin-select">
                    <option value="all">Tất cả loại ({{ properties.length }})</option>
                    <option value="nha-pho">Nhà Phố ({{ properties.filter(p => p.categoryId === 'nha-pho').length }})</option>
                    <option value="du-an">Dự Án ({{ properties.filter(p => p.categoryId === 'du-an').length }})</option>
                  </select>
                </div>

                <div class="filter-group">
                  <span class="filter-label"><i class="fa-solid fa-earth-asia"></i> Tỉnh thành:</span>
                  <select v-model="adminPropFilter.province" class="admin-select">
                    <option value="all">Tất cả Tỉnh Thành ({{ distinctProvinces.length }})</option>
                    <option v-for="prov in distinctProvinces" :key="prov" :value="prov">{{ prov }}</option>
                  </select>
                </div>

                <div class="filter-group">
                  <span class="filter-label"><i class="fa-solid fa-map-pin"></i> Quận / Phường:</span>
                  <select v-model="adminPropFilter.ward" class="admin-select">
                    <option value="all">Tất cả Quận / Phường ({{ distinctFilteredWards.length }})</option>
                    <option v-for="w in distinctFilteredWards" :key="w" :value="w">{{ w }}</option>
                  </select>
                </div>
              </div>

              <div class="filter-stats">
                Đang hiển thị: <strong>{{ filteredAdminProperties.length }}</strong> / {{ properties.length }} căn
              </div>
            </div>

            <!-- Bảng Dữ Liệu BĐS -->
            <div class="admin-table-container">
              <table class="admin-data-table">
                <thead>
                  <tr>
                    <th style="width: 70px;">Ảnh</th>
                    <th style="width: 80px;">Mã Căn</th>
                    <th>Tiêu Đề & Vị Trí Chi Tiết</th>
                    <th style="width: 120px;">Giá Bán</th>
                    <th style="width: 160px;">Phân Loại / Phường</th>
                    <th style="width: 160px;">Sales Phụ Trách</th>
                    <th style="width: 150px; text-align: center;">Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredAdminProperties.length === 0">
                    <td colspan="7" class="empty-table">
                      <i class="fa-solid fa-inbox"></i>
                      <p>Không tìm thấy bất động sản nào khớp bộ lọc.</p>
                    </td>
                  </tr>
                  <tr v-for="p in filteredAdminProperties" :key="p.id">
                    <td>
                      <div class="prop-thumb">
                        <img :src="p.image" :alt="p.title" loading="lazy">
                        <span v-if="getGalleryCount(p) > 0" class="thumb-badge" :title="`${getGalleryCount(p)} ảnh album`">
                          <i class="fa-solid fa-images"></i> {{ getGalleryCount(p) }}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span class="prop-code">{{ p.id }}</span>
                    </td>
                    <td>
                      <div class="prop-title-cell">
                        <div v-if="isFeaturedTownhouse(p)" class="badge-featured-banner">
                          <i class="fa-solid fa-star"></i> Banner Tiêu Biểu Nhà Phố
                        </div>
                        <NuxtLink :to="`/bat-dong-san/${p.id}`" target="_blank" class="prop-name-link" title="Xem trang chi tiết BĐS">
                          {{ p.title }}
                          <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </NuxtLink>
                        <div class="prop-loc-text">
                          <i class="fa-solid fa-location-dot"></i> {{ p.location }}
                        </div>
                        <div class="prop-meta-inline">
                          <span v-if="p.area"><i class="fa-solid fa-ruler-combined"></i> {{ p.area }}</span>
                          <span v-if="p.dimensions" style="color: var(--gold-primary); font-weight: 600;">
                            <i class="fa-solid fa-arrows-left-right-to-line"></i> {{ p.dimensions }}
                          </span>
                          <span v-if="calculatePricePerM2(p.priceRaw, p.area, p.price)" style="color: #10b981; font-weight: 600;">
                            <i class="fa-solid fa-tag"></i> {{ calculatePricePerM2(p.priceRaw, p.area, p.price) }}
                          </span>
                          <span v-if="p.structure"><i class="fa-solid fa-layer-group"></i> {{ p.structure }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong class="prop-price-text">{{ p.price }}</strong>
                      <div v-if="calculatePricePerM2(p.priceRaw, p.area, p.price)" style="font-size: 0.76rem; color: #10b981; margin-top: 2px;">
                        {{ calculatePricePerM2(p.priceRaw, p.area, p.price) }}
                      </div>
                    </td>
                    <td>
                      <div v-if="p.categoryId === 'nha-pho'" class="cat-pill nha-pho">
                        <span>Nhà Phố</span>
                        <small class="ward-text">
                          <i class="fa-solid fa-map-pin"></i> {{ [p.province, p.ward].filter(Boolean).join(' • ') || 'Chưa gán' }}
                        </small>
                      </div>
                      <div v-else-if="p.categoryId === 'du-an'" class="cat-pill du-an">
                        <span>Dự Án</span>
                        <small class="ward-text">
                          <i class="fa-solid fa-map-pin"></i> {{ [p.province, p.ward].filter(Boolean).join(' • ') || 'Chưa gán' }}
                        </small>
                      </div>
                      <span v-else class="cat-pill other">{{ p.category?.name || p.categoryId }}</span>
                    </td>
                    <td>
                      <div v-if="p.agent" class="agent-chip">
                        <img :src="p.agent.avatar" class="agent-mini-avatar" alt="">
                        <div>
                          <strong>{{ p.agent.name }}</strong>
                          <small>{{ p.agent.phoneDisplay || p.agent.phone }}</small>
                        </div>
                      </div>
                      <span v-else class="unassigned-text">Chưa phân công</span>
                    </td>
                    <td>
                      <div class="table-actions">
                        <button 
                          v-if="p.categoryId === 'nha-pho'" 
                          type="button"
                          class="action-btn featured-btn" 
                          :class="{ 'featured-active': isFeaturedTownhouse(p) }" 
                          @click="toggleFeaturedTownhouse(p)" 
                          :title="isFeaturedTownhouse(p) ? 'Đang là Banner Tiêu Biểu (Bấm để gỡ)' : 'Chọn làm Banner Tiêu Biểu trên trang Nhà Phố'"
                        >
                          <i class="fa-solid fa-star"></i>
                        </button>
                        <NuxtLink :to="`/bat-dong-san/${p.id}`" target="_blank" class="action-btn view-btn" title="Xem chi tiết">
                          <i class="fa-solid fa-eye"></i>
                        </NuxtLink>
                        <button class="action-btn edit-btn" @click="openEditPropertyModal(p)" title="Chỉnh sửa">
                          <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="action-btn delete-btn" @click="confirmDeleteItem('property', p.id, p.title)" title="Xóa">
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ==================== TAB 2: QUẢN LÝ NHÂN VIÊN & USER CHẤM CÔNG ==================== -->
          <div v-if="activeTab === 'agents'" class="tab-pane">
            <!-- Filter Bar for Agents -->
            <div class="table-filter-bar">
              <div class="filter-left-group">
                <div class="filter-group">
                  <span class="filter-label"><i class="fa-solid fa-star" style="color: var(--adm-gold);"></i> Lọc hiển thị:</span>
                  <select v-model="agentFilterStarred" class="admin-select">
                    <option value="all">Tất cả nhân sự ({{ agents.length }})</option>
                    <option value="starred">⭐ Chỉ nhân viên đã lên Web ({{ agents.filter((a: any) => a.isStarred).length }})</option>
                    <option value="unstarred">Chưa lên Web (Chỉ nội bộ) ({{ agents.filter((a: any) => !a.isStarred).length }})</option>
                  </select>
                </div>

                <div class="filter-group">
                  <span class="filter-label"><i class="fa-solid fa-shield-halved"></i> Quyền:</span>
                  <select v-model="agentFilterRole" class="admin-select">
                    <option value="all">Tất cả quyền</option>
                    <option value="admin">👑 Ban Điều Hành (Admin)</option>
                    <option value="manager">👔 Quản lý (Leader)</option>
                    <option value="user">👤 Nhân viên</option>
                  </select>
                </div>
              </div>

              <div class="filter-stats">
                Tổng: <strong>{{ filteredAgents.length }}</strong> tài khoản • 
                <strong style="color: var(--adm-gold);">{{ agents.filter((a: any) => a.isStarred).length }}</strong> lên web ⭐
              </div>
            </div>

            <div class="admin-table-container">
              <table class="admin-data-table">
                <thead>
                  <tr>
                    <th style="width: 60px;">Ảnh</th>
                    <th style="width: 110px;">Mã / User</th>
                    <th>Chuyên Viên Sales</th>
                    <th style="width: 125px;">Quyền Hạn</th>
                    <th style="width: 110px; text-align: center;">Trạng Thái</th>
                    <th style="width: 145px; text-align: center;">Web BĐS (⭐)</th>
                    <th style="width: 130px;">Hotline</th>
                    <th style="width: 90px;">Văn Phòng</th>
                    <th>Quỹ Căn Phụ Trách</th>
                    <th style="width: 190px; text-align: center;">Tài Khoản & Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredAgents.length === 0">
                    <td colspan="10" class="empty-table">
                      <i class="fa-solid fa-users"></i>
                      <p>Không tìm thấy nhân viên nào phù hợp bộ lọc.</p>
                    </td>
                  </tr>
                  <tr v-for="a in filteredAgents" :key="a.id" :style="a.status === 'locked' ? 'opacity: 0.75; background: rgba(239, 68, 68, 0.04);' : ''">
                    <td>
                      <img :src="a.avatar" class="agent-avatar-circle" alt="">
                    </td>
                    <td>
                      <span class="user-code-pill">{{ a.code || a.id }}</span>
                      <small style="display: block; font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">{{ a.username }}</small>
                    </td>
                    <td>
                      <div class="agent-info-cell">
                        <strong>{{ a.name }}</strong>
                        <span class="agent-role-pill">{{ a.role }}</span>
                        <small v-if="a.tag" class="agent-tag">{{ a.tag }}</small>
                      </div>
                    </td>
                    <td>
                      <span v-if="a.userRole === 'admin'" class="role-badge-pill admin">
                        <i class="fa-solid fa-crown"></i> Admin
                      </span>
                      <span v-else-if="a.userRole === 'manager'" class="role-badge-pill manager">
                        <i class="fa-solid fa-user-shield"></i> Quản lý
                      </span>
                      <span v-else class="role-badge-pill user">
                        <i class="fa-solid fa-user"></i> Nhân viên
                      </span>
                    </td>
                    <td style="text-align: center;">
                      <!-- HUY HIỆU TRẠNG THÁI KHÓA / HOẠT ĐỘNG -->
                      <span v-if="a.status === 'locked'" class="status-pill-locked">
                        <i class="fa-solid fa-lock"></i> Đã khóa
                      </span>
                      <span v-else class="status-pill-active">
                        <i class="fa-solid fa-circle-check"></i> Hoạt động
                      </span>
                    </td>
                    <td style="text-align: center;">
                      <!-- NÚT BẤM TOGGLE NGÔI SAO TỨC THÌ (⭐) -->
                      <button 
                        type="button"
                        class="btn-star-toggle"
                        :class="{ 'is-starred': a.isStarred }"
                        @click="toggleStarAgent(a)"
                        :title="a.isStarred ? 'Đang hiển thị trên Web BĐS (Bấm để gỡ)' : 'Chưa hiển thị trên Web (Bấm để đưa lên)'"
                      >
                        <i :class="a.isStarred ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
                        <span>{{ a.isStarred ? '⭐ Đã Lên Web' : 'Chưa Lên' }}</span>
                      </button>
                    </td>
                    <td>
                      <div class="agent-contact-cell">
                        <a :href="`tel:${a.phone}`" class="phone-link">
                          <i class="fa-solid fa-phone"></i> {{ a.phoneDisplay || a.phone }}
                        </a>
                      </div>
                    </td>
                    <td>
                      <span class="office-badge-chip">{{ a.officeId || 'VP1' }}</span>
                    </td>
                    <td>
                      <div class="assigned-props-cell">
                        <div class="assigned-header">
                          <strong>{{ a.properties?.length || 0 }}</strong> căn
                        </div>
                        <div class="assigned-badges">
                          <span 
                            v-for="p in a.properties" 
                            :key="p.id"
                            class="prop-id-badge"
                            :title="p.title"
                          >
                            {{ p.id }}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="table-actions">
                        <!-- NÚT RESET MẬT KHẨU -->
                        <button 
                          class="action-btn key-btn" 
                          @click="openResetPasswordModal(a)" 
                          title="Khôi phục / Đổi mật khẩu nhân viên"
                        >
                          <i class="fa-solid fa-key"></i>
                        </button>
                        <!-- NÚT KHÓA / MỞ KHÓA TÀI KHOẢN -->
                        <button 
                          class="action-btn" 
                          :class="a.status === 'locked' ? 'unlock-btn' : 'lock-btn'" 
                          @click="toggleLockAgent(a)" 
                          :title="a.status === 'locked' ? 'Mở khóa cho nhân viên đăng nhập' : 'Khóa tài khoản nhân viên'"
                        >
                          <i :class="a.status === 'locked' ? 'fa-solid fa-lock-open' : 'fa-solid fa-user-lock'"></i>
                        </button>
                        <button class="action-btn assign-btn" @click="openAssignModal(a)" title="Giao căn phụ trách">
                          <i class="fa-solid fa-house-chimney-user"></i>
                        </button>
                        <button class="action-btn edit-btn" @click="openEditAgentModal(a)" title="Sửa thông tin">
                          <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="action-btn delete-btn" @click="confirmDeleteItem('agent', a.id, a.name)" title="Xóa nhân viên">
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ==================== TAB 3: QUẢN LÝ TIN TỨC & GÓC NHÌN ĐẦU TƯ ==================== -->
          <div v-if="activeTab === 'articles'" class="tab-pane">
            <!-- Thanh Lọc Tin Tức & Thao Tác Nhanh -->
            <div class="table-filter-bar">
              <div class="filter-group">
                <span class="filter-label"><i class="fa-solid fa-layer-group"></i> Chủ đề:</span>
                <select v-model="adminArticleFilter.category" class="admin-select">
                  <option value="all">Tất cả chủ đề</option>
                  <option value="Kinh nghiệm thực chiến">Kinh nghiệm thực chiến</option>
                  <option value="Pháp lý an toàn">Pháp lý an toàn</option>
                  <option value="Đòn bẩy tài chính">Đòn bẩy tài chính</option>
                  <option value="Phân tích chu kỳ">Phân tích chu kỳ</option>
                  <option value="Bài học đắt giá">Bài học đắt giá</option>
                </select>
              </div>

              <div class="filter-group">
                <span class="filter-label"><i class="fa-solid fa-toggle-on"></i> Trạng thái:</span>
                <select v-model="adminArticleFilter.status" class="admin-select">
                  <option value="all">Tất cả trạng thái ({{ articles.length }})</option>
                  <option value="published">Đã xuất bản ({{ articles.filter(a => a.isPublished).length }})</option>
                  <option value="draft">Bản nháp chờ duyệt ({{ articles.filter(a => !a.isPublished).length }})</option>
                </select>
              </div>

              <div class="filter-stats">
                Hiển thị: <strong>{{ filteredAdminArticles.length }}</strong> / {{ articles.length }} bài viết
              </div>
            </div>

            <!-- Bảng Dữ Liệu Bài Viết -->
            <div class="admin-table-container">
              <table class="admin-data-table">
                <thead>
                  <tr>
                    <th style="width: 70px;">Ảnh</th>
                    <th>Tiêu Đề Bài Viết & Tác Giả</th>
                    <th style="width: 160px;">Chủ Đề</th>
                    <th style="width: 100px;">Lượt Đọc</th>
                    <th style="width: 170px; text-align: center;">Trạng Thái Xuất Bản</th>
                    <th style="width: 150px; text-align: center;">Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredAdminArticles.length === 0">
                    <td colspan="6" class="empty-table">
                      <i class="fa-regular fa-newspaper"></i>
                      <p>Chưa có bài viết nào khớp với bộ lọc.</p>
                    </td>
                  </tr>
                  <tr v-for="item in filteredAdminArticles" :key="item.id">
                    <td>
                      <div class="prop-thumb">
                        <img :src="item.image" :alt="item.title" loading="lazy">
                        <span v-if="item.isFeatured" class="thumb-badge gold" title="Bài viết tiêu điểm">
                          <i class="fa-solid fa-star"></i>
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="prop-title-cell">
                        <NuxtLink :to="`/tin-tuc/${item.slug || item.id}`" target="_blank" class="prop-name-link" title="Xem bài viết ngoài web">
                          {{ item.title }}
                          <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </NuxtLink>
                        <div class="prop-loc-text">
                          <span v-if="item.source" style="color: var(--gold-primary); font-weight: 700;">[{{ item.source }}]</span>
                          <a v-if="item.sourceUrl" :href="item.sourceUrl" target="_blank" rel="noopener noreferrer" style="margin-left: 6px; color: var(--gold-primary); font-weight: 600; text-decoration: underline;" title="Mở link gốc bài viết CafeLand">
                            Link gốc <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.72rem;"></i>
                          </a>
                          <span style="margin: 0 4px;">•</span>
                          <span>{{ item.author }}</span>
                          <span style="margin: 0 4px;">•</span>
                          <span>{{ new Date(item.createdAt).toLocaleDateString('vi-VN') }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="cat-pill nha-pho" style="font-size: 0.8rem;">
                        {{ item.category }}
                      </span>
                    </td>
                    <td>
                      <span style="font-weight: 600; color: var(--text-muted);">
                        <i class="fa-regular fa-eye"></i> {{ item.views }}
                      </span>
                    </td>
                    <td style="text-align: center;">
                      <div v-if="item.isPublished" style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        <span class="status-published-pill">✓ Đã xuất bản</span>
                        <button class="btn-toggle-status" @click="togglePublishArticle(item)" title="Chuyển về bản nháp">
                          <i class="fa-solid fa-eye-slash"></i> Tạm ẩn bài
                        </button>
                      </div>
                      <div v-else style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        <span class="status-draft-pill">⏳ Bản nháp</span>
                        <button class="btn-approve-publish" @click="togglePublishArticle(item)" title="Duyệt bài đăng ngay">
                          <i class="fa-solid fa-check"></i> Duyệt Đăng Ngay
                        </button>
                      </div>
                    </td>
                    <td>
                      <div class="table-actions">
                        <NuxtLink :to="`/tin-tuc/${item.slug || item.id}`" target="_blank" class="action-btn view-btn" title="Xem ngoài web">
                          <i class="fa-solid fa-eye"></i>
                        </NuxtLink>
                        <button class="action-btn edit-btn" @click="openEditArticleModal(item)" title="Sửa nội dung">
                          <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="action-btn delete-btn" @click="confirmDeleteItem('article', item.id, item.title)" title="Xóa bài viết">
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ==================== TAB 4: QUẢN LÝ LEADS ==================== -->
          <div v-if="activeTab === 'leads'" class="tab-pane">
            <div class="admin-table-container">
              <table class="admin-data-table">
                <thead>
                  <tr>
                    <th style="width: 140px;">Thời Gian</th>
                    <th style="width: 170px;">Họ Tên Khách</th>
                    <th style="width: 150px;">Số Điện Thoại</th>
                    <th style="width: 140px;">Nhu Cầu</th>
                    <th>BĐS Quan Tâm / Địa Chỉ Ký Gửi</th>
                    <th style="width: 170px;">Hình Ảnh Ký Gửi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="leads.length === 0">
                    <td colspan="6" class="empty-table">
                      <i class="fa-solid fa-inbox"></i>
                      <p>Chưa có khách hàng nào để lại thông tin liên hệ.</p>
                    </td>
                  </tr>
                  <tr v-for="lead in leads" :key="lead.id">
                    <td>
                      <span class="lead-time">{{ new Date(lead.createdAt).toLocaleString('vi-VN') }}</span>
                    </td>
                    <td>
                      <strong class="lead-name">{{ lead.name }}</strong>
                    </td>
                    <td>
                      <a :href="`tel:${lead.phone}`" class="lead-phone-btn">
                        <i class="fa-solid fa-phone"></i> {{ lead.phone }}
                      </a>
                    </td>
                    <td>
                      <span class="demand-pill">{{ lead.demand || 'Tư vấn' }}</span>
                    </td>
                    <td>
                      <div class="lead-details">
                        {{ lead.propertyInterest || lead.budget || 'Không có ghi chú' }}
                      </div>
                    </td>
                    <td>
                      <div v-if="parseLeadImages(lead.images).length > 0" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                        <a 
                          v-for="(img, i) in parseLeadImages(lead.images)" 
                          :key="i"
                          :href="img"
                          target="_blank"
                          @click.prevent="viewLeadImage(img)"
                          title="Bấm để xem ảnh gốc"
                          style="display: inline-block; position: relative;"
                        >
                          <img 
                            :src="img" 
                            style="width: 46px; height: 46px; object-fit: cover; border-radius: 6px; border: 1.5px solid var(--border-gold); cursor: pointer; transition: all 0.2s; background: rgba(255,255,255,0.05);" 
                            class="lead-thumb-preview"
                            @error="(e: any) => { e.target.style.opacity = '0.6'; }"
                          />
                        </a>
                      </div>
                      <span v-else style="color: var(--text-muted); font-size: 0.8rem; font-style: italic;">Không có ảnh</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ==================== TAB 5: QUẢN LÝ BANNER QUẢNG CÁO ==================== -->
          <div v-if="activeTab === 'banners'" class="tab-pane">
            <div class="table-filter-bar">
              <div class="filter-left-group">
                <div class="filter-group">
                  <span class="filter-label"><i class="fa-solid fa-filter"></i> Lọc trang:</span>
                  <select v-model="bannerFilterPage" class="admin-select">
                    <option value="all">Tất cả trang</option>
                    <option value="home">Trang Chủ (/)</option>
                    <option value="nha-pho">Trang Nhà Phố (/nha-pho)</option>
                    <option value="du-an">Trang Dự Án (/du-an)</option>
                  </select>
                </div>

                <div class="filter-group">
                  <span class="filter-label"><i class="fa-solid fa-arrows-left-right"></i> Vị trí:</span>
                  <select v-model="bannerFilterPosition" class="admin-select" style="font-weight: 700;">
                    <option value="all">Tất cả vị trí (Trái & Phải)</option>
                    <option value="left">👈 Banner Bên Trái</option>
                    <option value="right">👉 Banner Bên Phải</option>
                  </select>
                </div>

                <div class="filter-stats">
                  Tổng: <strong>{{ filteredBanners.length }}</strong>/{{ banners.length }} banner
                </div>
              </div>

              <!-- Nút Thêm Mới Banner Trái / Phải -->
              <div style="display: flex; gap: 8px;">
                <button 
                  type="button" 
                  class="btn-admin-action btn-banner-left"
                  @click="openNewBannerModal('left')"
                  title="Thêm banner cố định sườn trái"
                >
                  <i class="fa-solid fa-plus"></i> + Banner Trái 👈
                </button>
                <button 
                  type="button" 
                  class="btn-admin-action btn-banner-right"
                  @click="openNewBannerModal('right')"
                  title="Thêm banner cố định sườn phải"
                >
                  <i class="fa-solid fa-plus"></i> + Banner Phải 👉
                </button>
              </div>
            </div>

            <!-- Grid danh sách Banners với xem trước trực quan -->
            <div class="admin-banners-grid">
              <div 
                v-for="b in filteredBanners" 
                :key="b.id" 
                class="admin-banner-card"
                :class="{ 'inactive': !b.isActive, 'is-right': b.position === 'right' }"
              >
                <!-- Cột xem trước hình ảnh poster dọc -->
                <div class="banner-card-preview">
                  <img :src="b.imageUrl" :alt="b.title" class="banner-preview-img" />
                  <span class="banner-preview-badge" :class="{ active: b.isActive }">
                    <i :class="b.isActive ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"></i>
                    {{ b.isActive ? 'ĐANG HIỂN THỊ' : 'ĐÃ TẮT' }}
                  </span>
                </div>

                <!-- Cột thông tin chi tiết & điều khiển -->
                <div class="banner-card-info">
                  <div class="banner-card-top">
                    <div>
                      <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 6px; flex-wrap: wrap;">
                        <span class="banner-page-tag">
                          <i class="fa-solid fa-compass"></i>
                          {{ b.page === 'home' ? 'Trang Chủ (/)' : (b.page === 'nha-pho' ? 'Trang Nhà Phố (/nha-pho)' : (b.page === 'du-an' ? 'Trang Dự Án (/du-an)' : 'Tất cả trang')) }}
                        </span>
                        <!-- ĐÁNH DẤU RIÊNG VỊ TRÍ ĐỂ ADMIN DỄ QUẢN LÝ -->
                        <span 
                          class="banner-pos-tag" 
                          :class="b.position === 'right' ? 'pos-right' : 'pos-left'"
                        >
                          {{ b.position === 'right' ? '👉 BANNER BÊN PHẢI' : '👈 BANNER BÊN TRÁI' }}
                        </span>
                      </div>
                      <h3 class="banner-card-title">{{ b.name }}</h3>
                    </div>

                    <!-- Nút Bật / Tắt nhanh bằng switch -->
                    <div class="banner-toggle-wrap" title="Bấm để Bật/Tắt hiển thị trên web">
                      <label class="switch-toggle">
                        <input 
                          type="checkbox" 
                          :checked="b.isActive" 
                          @change="toggleBannerStatus(b)"
                        >
                        <span class="slider round"></span>
                      </label>
                      <span class="toggle-text">{{ b.isActive ? 'Bật' : 'Tắt' }}</span>
                    </div>
                  </div>

                  <div class="banner-props-list">
                    <div class="bprop-item">
                      <span class="bprop-label">Vị trí hiển thị:</span>
                      <strong class="bprop-val" :style="{ color: b.position === 'right' ? '#c084fc' : '#60a5fa' }">
                        {{ b.position === 'right' ? '👉 Sườn Phải Màn Hình (Kéo dài)' : '👈 Sườn Trái Màn Hình (Kéo dài)' }}
                      </strong>
                    </div>
                    <div class="bprop-item">
                      <span class="bprop-label">Tiêu đề hiển thị:</span>
                      <strong class="bprop-val" style="color: var(--gold-primary);">{{ b.title }}</strong>
                    </div>
                    <div class="bprop-item">
                      <span class="bprop-label">Huy hiệu góc:</span>
                      <span class="bprop-val badge-chip"><i :class="['fa-solid', b.badgeIcon || 'fa-crown']"></i> {{ b.badge }}</span>
                    </div>
                    <div class="bprop-item">
                      <span class="bprop-label">Nút bấm chuyển:</span>
                      <span class="bprop-val">{{ b.btnText }}</span>
                    </div>
                    <div class="bprop-item">
                      <span class="bprop-label">Link chuyển hướng:</span>
                      <span class="bprop-val link-val" :title="b.linkUrl">{{ b.linkUrl }}</span>
                    </div>
                  </div>

                  <div class="banner-card-actions">
                    <button 
                      class="btn-admin-primary" 
                      style="font-size: 0.82rem; padding: 7px 14px; width: 100%; justify-content: center;"
                      @click="openEditBannerModal(b)"
                    >
                      <i class="fa-solid fa-pen-to-square"></i>
                      <span>Chỉnh Sửa Banner & Thay Ảnh</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ==================== TAB CHẤM CÔNG WIFI CÁ NHÂN ==================== -->
          <div v-if="activeTab === 'checkin'" class="tab-pane">
            <AdminCheckinTab :current-user="currentUser" @navigate-tab="switchTab" />
          </div>

          <!-- ==================== TAB THỐNG KÊ ĐIỂM DANH (TÁCH RIÊNG) ==================== -->
          <div v-if="activeTab === 'attendance'" class="tab-pane">
            <AdminAttendanceTab />
          </div>

          <!-- ==================== TAB 7: ĐƠN NGHỈ & CÔNG TÁC ==================== -->
          <div v-if="activeTab === 'leaves'" class="tab-pane">
            <AdminLeavesTab />
          </div>

          <!-- ==================== TAB 8: BẢNG LƯƠNG 4 KHOẢN ==================== -->
          <div v-if="activeTab === 'payroll'" class="tab-pane">
            <AdminPayrollTab :current-user="currentUser" />
          </div>

          <!-- ==================== TAB 9: CÀI ĐẶT LƯƠNG & KHUNG GIỜ ==================== -->
          <div v-if="activeTab === 'salary_settings'" class="tab-pane">
            <AdminSalarySettingsTab />
          </div>

          <!-- ==================== TAB 10: CẤU HÌNH VĂN PHÒNG & WIFI ==================== -->
          <div v-if="activeTab === 'offices'" class="tab-pane">
            <AdminOfficesTab />
          </div>
        </div>
      </main>
    </div>

    <!-- MODAL XEM ẢNH KÝ GỬI FULL SIZE -->
    <div v-if="previewingImage" class="modal-overlay" @click="previewingImage = null" style="z-index: 99999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.85); backdrop-filter: blur(4px);">
      <div style="position: relative; max-width: 90vw; max-height: 90vh; text-align: center;" @click.stop>
        <img :src="previewingImage" alt="Ảnh ký gửi chi tiết" style="max-width: 100%; max-height: 85vh; border-radius: 10px; border: 2px solid var(--border-gold); box-shadow: 0 10px 40px rgba(0,0,0,0.7); object-fit: contain;" />
        <button @click="previewingImage = null" style="position: absolute; top: -14px; right: -14px; width: 36px; height: 36px; border-radius: 50%; background: #dc2626; color: #fff; border: 2px solid #fff; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>

    <!-- ==================== MODAL THÊM / SỬA BĐS ==================== -->
    <div v-if="showPropModal" class="modal-overlay" @click.self="showPropModal = false">
      <div class="admin-modal-card">
        <div class="modal-header">
          <h3>
            <i class="fa-solid fa-building" style="color: var(--gold-primary);"></i>
            {{ propForm.isEdit ? 'Chỉnh Sửa Bất Động Sản' : 'Đăng Tin BĐS Mới' }}
          </h3>
          <button class="modal-close-icon" @click="showPropModal = false">&times;</button>
        </div>

        <form @submit.prevent="saveProperty" class="modal-form">
          <div class="form-grid">
            <div class="form-col-full">
              <label>Tiêu đề tin đăng *</label>
              <input v-model="propForm.title" type="text" class="admin-input" placeholder="VD: Mặt tiền Đường 3 Tháng 2, Phường 11, Quận 11" required>
            </div>

            <div>
              <label>Phân loại danh mục *</label>
              <select v-model="propForm.categoryId" class="admin-select">
                <option value="nha-pho">Nhà Phố</option>
                <option value="du-an">Dự Án</option>
              </select>
            </div>

            <div>
              <label>
                <i class="fa-solid fa-earth-asia" style="color: var(--gold-primary);"></i>
                Tỉnh / Thành Phố *
              </label>
              <select v-model="propForm.province" class="admin-select" @change="onProvinceChange">
                <option v-for="prov in PROVINCE_OPTIONS" :key="prov" :value="prov">{{ prov }}</option>
              </select>
              <input 
                v-if="propForm.province === 'Tỉnh thành khác'" 
                v-model="customProvince" 
                type="text" 
                class="admin-input" 
                style="margin-top: 6px;" 
                placeholder="Gõ tên Tỉnh / Thành Phố..." 
                required
              >
            </div>

            <div>
              <label>
                <i class="fa-solid fa-map-location-dot" style="color: var(--gold-primary);"></i>
                Quận / Huyện / Phường / Xã (Thông tin sáp nhập mới nhất) *
              </label>

              <!-- 1. Menu Sổ Xuống Chọn Trực Tiếp Toàn Bộ Phường / Xã -->
              <div style="margin-bottom: 6px;">
                <select 
                  v-model="propForm.ward" 
                  class="admin-select"
                  style="font-weight: 600;"
                >
                  <option value="">-- Bấm để SỔ XUỐNG CHỌN Phường/Xã ({{ currentDistricts.length }} đơn vị) --</option>
                  <option v-for="w in currentDistricts" :key="w" :value="w">{{ w }}</option>
                </select>
              </div>

              <!-- 2. Ô Gõ Tìm Kiếm Hoặc Nhập Tay Tự Do -->
              <div style="position: relative;">
                <input 
                  v-model="propForm.ward" 
                  list="districtSuggestions" 
                  class="admin-input" 
                  placeholder="Hoặc gõ tìm kiếm / nhập tay tự do (VD: P. Bến Thành, Xã An Thạnh...)" 
                  required
                >
                <datalist id="districtSuggestions">
                  <option v-for="item in currentDistricts" :key="item" :value="item">{{ item }}</option>
                </datalist>
              </div>

              <!-- 3. Các Nút Chọn Nhanh Phường / Xã Tiêu Biểu -->
              <div v-if="currentDistricts.length > 0" class="quick-ward-pills" style="margin-top: 6px;">
                <span class="quick-pill-label">Gợi ý nhanh:</span>
                <button 
                  v-for="d in currentDistricts.slice(0, 8)" 
                  :key="d" 
                  type="button" 
                  class="quick-pill" 
                  @click="propForm.ward = d"
                >
                  {{ d.split(',')[0] }}
                </button>
              </div>
            </div>

            <div>
              <label>Giá hiển thị (VD: 38.5 Tỷ) *</label>
              <input v-model="propForm.price" type="text" class="admin-input" placeholder="38.5 Tỷ" required>
            </div>

            <div>
              <label>Giá số (Tỷ) để sắp xếp & tính đơn giá *</label>
              <input v-model="propForm.priceRaw" type="number" step="0.1" class="admin-input" placeholder="38.5" required>
            </div>

            <div>
              <label>Diện tích (VD: 112 m² hoặc 140 m²) *</label>
              <input v-model="propForm.area" type="text" class="admin-input" placeholder="112 m²" required>
            </div>

            <div>
              <label>
                <i class="fa-solid fa-arrows-left-right-to-line" style="color: var(--gold-primary);"></i>
                Kích thước Dài x Rộng (VD: 6m x 23.5m)
              </label>
              <input v-model="propForm.dimensions" type="text" class="admin-input" placeholder="VD: 6m x 23.5m hoặc 5m x 20m">
            </div>

            <div class="form-col-full" v-if="liveCalculatedPricePerM2">
              <div style="background: rgba(16, 185, 129, 0.12); border: 1px dashed rgba(16, 185, 129, 0.45); border-radius: 6px; padding: 9px 14px; display: flex; align-items: center; justify-content: space-between; font-size: 0.88rem; color: #10b981;">
                <span style="display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-calculator"></i>
                  <span>Đơn giá tự động tính trên m²:</span>
                </span>
                <strong style="font-size: 1.05rem;">{{ liveCalculatedPricePerM2 }}</strong>
              </div>
            </div>

            <div class="form-col-full">
              <label>Vị trí địa chỉ</label>
              <input v-model="propForm.location" type="text" class="admin-input" placeholder="Mặt tiền CMT8, P. Bến Thành, Q.1" required>
            </div>

            <div class="form-col-full">
              <label>Kết cấu căn nhà (VD: 1 Hầm 5 Tầng Thang máy)</label>
              <input v-model="propForm.structure" type="text" class="admin-input" placeholder="1 Hầm 5 Tầng Thang máy">
            </div>

            <!-- UPLOAD ẢNH ĐẠI DIỆN CHÍNH (HỖ TRỢ TRỰC TIẾP TỪ ĐIỆN THOẠI & MÁY TÍNH) -->
            <div class="form-col-full upload-section-box">
              <div class="upload-header-row">
                <label class="upload-title">
                  <i class="fa-solid fa-camera" style="color: var(--gold-primary);"></i>
                  Ảnh Đại Diện Chính BĐS *
                </label>
                <span class="upload-device-tip">
                  <i class="fa-solid fa-mobile-screen-button"></i> Hỗ trợ chụp trực tiếp từ Camera điện thoại hoặc thư viện ảnh
                </span>
              </div>

              <div class="upload-controls-row">
                <div class="upload-preview-box">
                  <img v-if="propForm.image" :src="propForm.image" alt="Preview">
                  <div v-else class="no-preview-text">Chưa có ảnh</div>
                </div>

                <div class="upload-action-inputs">
                  <div class="upload-buttons-group">
                    <label class="btn-upload-file" :class="{ disabled: uploadingMainImage }">
                      <i class="fa-solid fa-cloud-arrow-up"></i>
                      <span>{{ uploadingMainImage ? 'Đang Tải Lên...' : '📸 Tải Ảnh / Chụp Từ Điện Thoại & Máy Tính' }}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        style="display: none;" 
                        :disabled="uploadingMainImage" 
                        @change="handleUploadMainImage"
                      >
                    </label>
                  </div>
                  <input 
                    v-model="propForm.image" 
                    type="text" 
                    class="admin-input" 
                    placeholder="Hoặc dán đường dẫn ảnh URL (https://...)" 
                    required
                  >
                </div>
              </div>
            </div>

            <!-- UPLOAD ALBUM NHIỀU ẢNH (GALLERY) -->
            <div class="form-col-full upload-section-box">
              <div class="upload-header-row">
                <label class="upload-title">
                  <i class="fa-solid fa-images" style="color: var(--gold-primary);"></i>
                  Album Ảnh Chi Tiết Gallery ({{ propForm.images?.length || 0 }} ảnh)
                </label>
                
                <label class="btn-upload-file outline" :class="{ disabled: uploadingGallery }">
                  <i class="fa-solid fa-plus"></i>
                  <span>{{ uploadingGallery ? 'Đang tải lên...' : '📸 + Thêm Ảnh Vào Album (Chọn Nhiều Ảnh)' }}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    style="display: none;" 
                    :disabled="uploadingGallery" 
                    @change="handleUploadGalleryImages"
                  >
                </label>
              </div>

              <div v-if="propForm.images && propForm.images.length > 0" class="gallery-preview-grid">
                <div 
                  v-for="(imgUrl, gIdx) in propForm.images" 
                  :key="gIdx" 
                  class="gallery-preview-item"
                >
                  <img :src="imgUrl" alt="">
                  <button type="button" class="remove-gallery-btn" @click="removeGalleryImage(gIdx)" title="Xóa ảnh này">
                    &times;
                  </button>
                </div>
              </div>
              <p v-else class="upload-hint-note">
                <i class="fa-solid fa-circle-info"></i> Bạn có thể tải lên 3-6 ảnh (mặt tiền, hẻm, nội thất, sổ hồng). Trên điện thoại, bạn có thể chọn cùng lúc nhiều ảnh từ thư viện.
              </p>
            </div>

            <!-- Vị Trí Google Maps -->
            <div class="form-col-full">
              <label><i class="fa-solid fa-map-location-dot" style="color: var(--gold-primary);"></i> Link Vị Trí Google Maps (Tùy chọn)</label>
              <input v-model="propForm.mapUrl" type="text" class="admin-input" placeholder="Để trống hệ thống sẽ tự động ghim vị trí theo địa chỉ và phường">
            </div>

            <div>
              <label>Chuyên viên phụ trách</label>
              <select v-model="propForm.agentId" class="admin-select">
                <option value="">-- Chưa gán (Chung) --</option>
                <option v-for="a in agents" :key="a.id" :value="a.id">{{ a.name }} ({{ a.role }})</option>
              </select>
            </div>

            <div>
              <label>Pháp lý</label>
              <input v-model="propForm.legal" type="text" class="admin-input" placeholder="Sổ hồng hoàn công đầy đủ">
            </div>

            <div class="form-col-full">
              <label>Dòng tiền khai thác / HĐ thuê</label>
              <input v-model="propForm.rentIncome" type="text" class="admin-input" placeholder="Đang có HĐ thuê 85 Triệu/tháng">
            </div>

            <div class="form-col-full">
              <label>Mô tả chi tiết</label>
              <textarea v-model="propForm.description" rows="3" class="admin-textarea" placeholder="Vị trí đắc địa gần Chợ Bến Thành, tiện kinh doanh..."></textarea>
            </div>
          </div>

          <div class="modal-actions-footer">
            <button type="button" class="btn-admin-cancel" @click="showPropModal = false">Hủy</button>
            <button type="submit" class="btn-admin-primary">
              <i class="fa-solid fa-check"></i> Lưu Bất Động Sản
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ==================== MODAL THÊM / SỬA NHÂN VIÊN ==================== -->
    <div v-if="showAgentModal" class="modal-overlay" @click.self="showAgentModal = false">
      <div class="admin-modal-card">
        <div class="modal-header">
          <h3>
            <i class="fa-solid fa-user-plus" style="color: var(--gold-primary);"></i>
            {{ agentForm.isEdit ? 'Chỉnh Sửa Thông Tin Nhân Viên' : 'Thêm Chuyên Viên Mới' }}
          </h3>
          <button class="modal-close-icon" @click="showAgentModal = false">&times;</button>
        </div>

        <form @submit.prevent="saveAgent" class="modal-form">
          <div class="form-grid">
            <!-- TÍCH SAO HIỂN THỊ WEB BĐS -->
            <div class="form-col-full" style="background: rgba(212, 175, 55, 0.1); border: 1.5px dashed var(--border-gold); padding: 12px 16px; border-radius: 8px;">
              <label style="display: flex; align-items: center; gap: 12px; cursor: pointer; margin: 0;">
                <input type="checkbox" v-model="agentForm.isStarred" style="width: 22px; height: 22px; accent-color: var(--gold-primary);">
                <div>
                  <strong style="color: var(--gold-primary); font-size: 0.95rem; display: block;">
                    ⭐ Tích sao để đưa nhân viên này lên hiển thị ngoài Website BĐS
                  </strong>
                  <span style="color: var(--text-muted); font-size: 0.75rem;">
                    Chỉ nhân sự được tích sao mới xuất hiện ở mục "Đội ngũ chuyên viên tư vấn" ngoài trang chủ và trang chi tiết căn.
                  </span>
                </div>
              </label>
            </div>

            <div class="form-col-full">
              <label>Họ và tên chuyên viên / Nhân viên *</label>
              <input v-model="agentForm.name" type="text" class="admin-input" placeholder="Ví dụ: Ngô Tuấn Kiệt" required>
            </div>

            <div>
              <label>Mã nhân viên</label>
              <input v-model="agentForm.code" type="text" class="admin-input" placeholder="Tự sinh nếu để trống (VD: NV001)">
            </div>

            <div>
              <label>Phân quyền hệ thống *</label>
              <select v-model="agentForm.userRole" class="admin-select" required>
                <option value="user">👤 Nhân viên (Chấm công cá nhân)</option>
                <option value="manager">👔 Quản lý (Duyệt đơn, chấm công nhóm)</option>
                <option value="admin">👑 Ban Điều Hành (Toàn quyền)</option>
              </select>
            </div>

            <div>
              <label>Tài khoản đăng nhập (Username) *</label>
              <input v-model="agentForm.username" type="text" class="admin-input" placeholder="VD: kiettuan" required>
            </div>

            <div>
              <label>Mật khẩu {{ agentForm.isEdit ? '(Để trống nếu không đổi)' : '*' }}</label>
              <input v-model="agentForm.password" type="text" class="admin-input" :placeholder="agentForm.isEdit ? 'Để trống nếu giữ nguyên...' : 'Mặc định: 123456'" :required="!agentForm.isEdit">
            </div>

            <div>
              <label>Trạng thái tài khoản *</label>
              <select v-model="agentForm.status" class="admin-select" required>
                <option value="active">🟢 Đang hoạt động (Bình thường)</option>
                <option value="locked">🔒 Khóa tài khoản (Chặn đăng nhập)</option>
              </select>
            </div>

            <div>
              <label>Văn phòng làm việc *</label>
              <select v-model="agentForm.officeId" class="admin-select" required>
                <option v-for="o in officesList" :key="o.id" :value="o.id">
                  {{ o.name }} ({{ o.id }})
                </option>
              </select>
            </div>

            <div>
              <label>Phòng ban trực thuộc</label>
              <select v-model="agentForm.departmentId" class="admin-select">
                <option value="">-- Chưa gán phòng ban --</option>
                <option v-for="d in filteredDepartmentsForAgent" :key="d.id" :value="d.id">
                  {{ d.name }}
                </option>
              </select>
            </div>

            <div class="form-col-full">
              <label>Chức danh / Phân khúc phụ trách *</label>
              <input v-model="agentForm.role" type="text" class="admin-input" placeholder="Chuyên Viên Nhà Phố & Tòa Nhà Q.1" required>
            </div>

            <div>
              <label>Số điện thoại (Hotline) *</label>
              <input v-model="agentForm.phone" type="tel" class="admin-input" placeholder="0901234567" required>
            </div>

            <div>
              <label>Link Zalo</label>
              <input v-model="agentForm.zalo" type="url" class="admin-input" placeholder="https://zalo.me/0901234567">
            </div>

            <div>
              <label>Kinh nghiệm</label>
              <input v-model="agentForm.exp" type="text" class="admin-input" placeholder="6+ Năm">
            </div>

            <div>
              <label>Đã giao dịch</label>
              <input v-model="agentForm.deals" type="text" class="admin-input" placeholder="135+ Căn">
            </div>

            <div class="form-col-full">
              <label>Ảnh Avatar (URL ảnh chân dung)</label>
              <input v-model="agentForm.avatar" type="url" class="admin-input" placeholder="https://images.unsplash.com/...">
            </div>

            <div class="form-col-full">
              <label>Slogan cá nhân</label>
              <input v-model="agentForm.slogan" type="text" class="admin-input" placeholder="Tận Tâm - Minh Bạch - Đầu Tư Hiệu Quả">
            </div>

            <div class="form-col-full">
              <label>Tag danh hiệu</label>
              <input v-model="agentForm.tag" type="text" class="admin-input" placeholder="Top Producer">
            </div>
          </div>

          <div class="modal-actions-footer">
            <button type="button" class="btn-admin-cancel" @click="showAgentModal = false">Hủy</button>
            <button type="submit" class="btn-admin-primary">
              <i class="fa-solid fa-check"></i> Lưu Thông Tin Nhân Viên
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ==================== MODAL KHÔI PHỤC / RESET MẬT KHẨU NHÂN VIÊN ==================== -->
    <div v-if="showResetPasswordModal" class="modal-overlay" @click.self="showResetPasswordModal = false">
      <div class="admin-modal-card" style="max-width: 480px;">
        <div class="modal-header">
          <h3>
            <i class="fa-solid fa-key" style="color: #d97706;"></i>
            Khôi Phục / Reset Mật Khẩu
          </h3>
          <button class="modal-close-icon" @click="showResetPasswordModal = false">&times;</button>
        </div>

        <div style="padding: 18px 20px;">
          <div v-if="resettingAgent" style="display: flex; align-items: center; gap: 14px; margin-bottom: 18px; padding: 12px 14px; background: var(--bg-secondary, #f8fafc); border-radius: 8px; border: 1px solid var(--border-color, #e2e8f0);">
            <img :src="resettingAgent.avatar" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--gold-primary, #dfb76c);" alt="" />
            <div>
              <strong style="color: var(--text-main, #0f172a); display: block; font-size: 0.96rem;">{{ resettingAgent.name }}</strong>
              <div style="color: var(--text-muted); font-size: 0.78rem; margin-top: 2px;">
                Mã NV: <span class="user-code-pill">{{ resettingAgent.code || resettingAgent.id }}</span> • User: <code>{{ resettingAgent.username }}</code>
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 12px;">
            <label style="font-weight: 700; color: var(--text-main, #0f172a); display: block; margin-bottom: 6px;">
              Mật khẩu mới cấp lại:
            </label>
            <div style="display: flex; gap: 8px;">
              <input 
                v-model="newPasswordInput" 
                type="text" 
                class="admin-input" 
                placeholder="Nhập mật khẩu mới..." 
                required
                style="flex: 1; font-weight: 700; letter-spacing: 1px; color: #b45309;"
              />
              <button 
                type="button" 
                class="btn-admin-cancel" 
                @click="newPasswordInput = '123456'" 
                title="Đặt về mật khẩu mặc định 123456"
                style="font-size: 0.8rem; white-space: nowrap; padding: 0 12px;"
              >
                Về 123456
              </button>
            </div>
            <small style="color: var(--text-muted); font-size: 0.74rem; display: block; margin-top: 6px;">
              💡 Nhân viên có thể dùng mật khẩu này kèm Mã NV (hoặc Username) để đăng nhập ngay lập tức.
            </small>
          </div>
        </div>

        <div class="modal-actions-footer" style="padding: 14px 20px; border-top: 1px solid var(--border-color, #e2e8f0); display: flex; justify-content: flex-end; gap: 10px;">
          <button type="button" class="btn-admin-cancel" @click="showResetPasswordModal = false">Hủy</button>
          <button type="button" class="btn-admin-primary" @click="executeResetPassword" :disabled="savingResetPassword">
            <i class="fa-solid fa-check"></i>
            {{ savingResetPassword ? 'Đang cập nhật...' : 'Xác Nhận Đổi Mật Khẩu' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL THÊM / SỬA BÀI VIẾT ==================== -->
    <div v-if="showArticleModal" class="modal-overlay" @click.self="showArticleModal = false">
      <div class="admin-modal-card">
        <div class="modal-header">
          <h3>
            <i class="fa-solid fa-newspaper" style="color: var(--gold-primary);"></i>
            {{ articleForm.isEdit ? 'Chỉnh Sửa Bài Viết' : 'Viết Bài Mới' }}
          </h3>
          <button class="modal-close-icon" @click="showArticleModal = false">&times;</button>
        </div>

        <form @submit.prevent="saveArticle" class="modal-form">
          <div class="form-grid">
            <div class="form-col-full">
              <label>Tiêu đề bài viết *</label>
              <input v-model="articleForm.title" type="text" class="admin-input" placeholder="VD: Chiến Lược Dùng Đòn Bẩy Tài Chính 30-70..." required>
            </div>

            <div>
              <label>Chủ đề bài viết *</label>
              <select v-model="articleForm.category" class="admin-select">
                <option value="Kinh nghiệm thực chiến">Kinh nghiệm thực chiến</option>
                <option value="Pháp lý an toàn">Pháp lý an toàn</option>
                <option value="Đòn bẩy tài chính">Đòn bẩy tài chính</option>
                <option value="Phân tích chu kỳ">Phân tích chu kỳ</option>
                <option value="Bài học đắt giá">Bài học đắt giá</option>
              </select>
            </div>

            <div>
              <label>Thời gian đọc (ước tính)</label>
              <input v-model="articleForm.readTime" type="text" class="admin-input" placeholder="VD: 6 phút đọc">
            </div>

            <div>
              <label>Tác giả / Ban cố vấn</label>
              <input v-model="articleForm.author" type="text" class="admin-input" placeholder="VD: Ngô Tuấn Kiệt - Trưởng Ban Tư Vấn">
            </div>

            <div>
              <label>Nguồn tin (nếu có)</label>
              <input v-model="articleForm.source" type="text" class="admin-input" placeholder="VD: BĐS Bến Thành / VnExpress / CafeF">
            </div>

            <!-- Upload Ảnh Bìa Bài Viết -->
            <div class="form-col-full upload-section-box">
              <div class="upload-header-row">
                <label class="upload-title">
                  <i class="fa-solid fa-image" style="color: var(--gold-primary);"></i>
                  Ảnh Bìa Bài Viết *
                </label>
                <span class="upload-device-tip">
                  <i class="fa-solid fa-camera"></i> Hỗ trợ chọn từ điện thoại & máy tính
                </span>
              </div>

              <div class="upload-controls-row">
                <div class="upload-preview-box">
                  <img v-if="articleForm.image" :src="articleForm.image" alt="Preview">
                  <div v-else class="no-preview-text">Chưa có ảnh</div>
                </div>

                <div class="upload-action-inputs">
                  <label class="btn-upload-file" :class="{ disabled: uploadingArticleCover }">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    <span>{{ uploadingArticleCover ? 'Đang Tải...' : '📸 Tải Ảnh Bìa Lên' }}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style="display: none;" 
                      :disabled="uploadingArticleCover" 
                      @change="handleUploadArticleCover"
                    >
                  </label>
                  <input 
                    v-model="articleForm.image" 
                    type="text" 
                    class="admin-input" 
                    placeholder="Hoặc dán link ảnh URL (https://...)" 
                    required
                  >
                </div>
              </div>
            </div>

            <div class="form-col-full">
              <label>Tóm tắt ngắn (Excerpt) *</label>
              <textarea v-model="articleForm.excerpt" rows="2" class="admin-textarea" placeholder="Đoạn tóm tắt nổi bật để khách đọc trước khi vào chi tiết..." required></textarea>
            </div>

            <div class="form-col-full">
              <div style="display: flex; gap: 24px; margin-bottom: 8px;">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                  <input type="checkbox" v-model="articleForm.isFeatured" style="width: 18px; height: 18px; accent-color: var(--gold-primary);">
                  <span style="font-weight: 700; color: var(--gold-primary);">⭐ Đặt làm bài viết tiêu điểm nổi bật</span>
                </label>

                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                  <input type="checkbox" v-model="articleForm.isPublished" style="width: 18px; height: 18px; accent-color: #10b981;">
                  <span style="font-weight: 700; color: #10b981;">✓ Xuất bản ngay ngoài trang web</span>
                </label>
              </div>
            </div>

            <div class="form-col-full">
              <label>Nội dung chi tiết bài viết (Hỗ trợ đoạn văn hoặc HTML)</label>
              <textarea v-model="articleForm.content" rows="8" class="admin-textarea" placeholder="Nhập nội dung bài viết, phân tích kinh nghiệm..."></textarea>
            </div>
          </div>

          <div class="modal-actions-footer">
            <button type="button" class="btn-admin-cancel" @click="showArticleModal = false">Hủy</button>
            <button type="submit" class="btn-admin-primary">
              <i class="fa-solid fa-check"></i> Lưu Bài Viết
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ==================== MODAL PHÂN CÔNG DỰ ÁN CHO SALES ==================== -->
    <div v-if="showAssignModal" class="modal-overlay" @click.self="showAssignModal = false">
      <div class="admin-modal-card">
        <div class="modal-header">
          <h3>
            <i class="fa-solid fa-house-chimney-user" style="color: var(--gold-primary);"></i>
            Phân Công Dự Án / Quỹ Căn
          </h3>
          <button class="modal-close-icon" @click="showAssignModal = false">&times;</button>
        </div>

        <div class="modal-body-padded">
          <p class="assign-desc">
            Chọn các bất động sản giao cho chuyên viên: 
            <strong style="color: var(--gold-primary); font-size: 1.05rem;">{{ selectedAgentToAssign?.name }}</strong>
          </p>

          <div class="assign-list-box">
            <label 
              v-for="p in properties" 
              :key="p.id"
              class="assign-item-row"
            >
              <div class="assign-item-left">
                <input 
                  type="checkbox" 
                  :value="p.id" 
                  v-model="assignedPropertyIds"
                  class="assign-checkbox"
                >
                <div>
                  <div class="assign-prop-title">[{{ p.id }}] {{ p.title }}</div>
                  <div class="assign-prop-sub">{{ p.location }} • <span style="color: var(--gold-primary); font-weight:600;">{{ p.price }}</span></div>
                </div>
              </div>
              <span v-if="assignedPropertyIds.includes(p.id)" class="assign-status-active">
                ✓ Phụ trách
              </span>
            </label>
          </div>

          <div class="modal-actions-footer">
            <button type="button" class="btn-admin-cancel" @click="showAssignModal = false">Hủy</button>
            <button type="button" class="btn-admin-primary" @click="saveAssignment">
              <i class="fa-solid fa-check"></i> Lưu Phân Công
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL XÁC NHẬN XÓA (IN-APP DIALOG) ==================== -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="admin-modal-card" style="max-width: 460px; text-align: center; padding: 28px;">
        <div style="width: 58px; height: 58px; border-radius: 50%; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.35); color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin: 0 auto 16px;">
          <i class="fa-solid fa-trash-can"></i>
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">
          Xác Nhận Xóa {{ deleteTarget?.type === 'article' ? 'Bài Viết' : deleteTarget?.type === 'property' ? 'Bất Động Sản' : 'Nhân Viên' }}?
        </h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 24px;">
          Bạn có chắc chắn muốn xóa: <br>
          <strong style="color: var(--gold-primary); font-size: 0.95rem; word-break: break-word;">"{{ deleteTarget?.title }}"</strong>?
          <br><span style="font-size: 0.8rem; color: #ef4444; margin-top: 6px; display: inline-block;">⚠️ Thao tác này sẽ xóa vĩnh viễn khỏi cơ sở dữ liệu.</span>
        </p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button type="button" class="btn-admin-cancel" style="flex: 1; padding: 11px; font-weight: 600;" @click="showDeleteModal = false" :disabled="deletingLoading">
            Hủy Bỏ
          </button>
          <button type="button" style="flex: 1; padding: 11px; background: #ef4444; color: #fff; border: none; border-radius: var(--radius-sm); font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);" @click="executeDeleteItem" :disabled="deletingLoading">
            <i class="fa-solid fa-trash"></i> {{ deletingLoading ? 'Đang Xóa...' : 'Xóa Ngay' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL CHỈNH SỬA / THÊM BANNER ==================== -->
    <div v-if="showBannerModal" class="modal-overlay" @click.self="showBannerModal = false">
      <div class="admin-modal-card" style="max-width: 680px;">
        <div class="modal-header">
          <h3>
            <i class="fa-solid fa-rectangle-ad" style="color: var(--gold-primary);"></i>
            {{ bannerForm.isEdit ? 'Chỉnh Sửa Banner Quảng Cáo' : 'Thêm Banner Mới' }}
          </h3>
          <button class="modal-close-icon" @click="showBannerModal = false">&times;</button>
        </div>

        <form @submit.prevent="saveBanner" class="modal-form">
          <div class="form-grid">
            <div class="form-col-full">
              <label>Tên gợi nhớ (cho quản trị) *</label>
              <input v-model="bannerForm.name" type="text" class="admin-input" placeholder="VD: Banner Phải - Trần Văn Giáp" required>
            </div>

            <!-- CHỌN VỊ TRÍ BANNER: TRÁI HOẶC PHẢI (ĐÁNH DẤU RIÊNG CHO ADMIN DỄ QUẢN LÝ) -->
            <div class="form-col-full">
              <label style="font-weight: 700; margin-bottom: 8px; display: block;">
                <i class="fa-solid fa-arrows-left-right" style="color: var(--gold-primary);"></i>
                Vị trí hiển thị trên website (Đánh dấu riêng để quản trị) *
              </label>
              <div class="pos-selector-grid">
                <div 
                  class="pos-card"
                  :class="{ active: (!bannerForm.position || bannerForm.position === 'left') }"
                  @click="bannerForm.position = 'left'"
                >
                  <span class="pos-card-icon">👈</span>
                  <div class="pos-card-content">
                    <strong class="pos-card-title">Banner Bên Trái</strong>
                    <span class="pos-card-sub">Cố định sườn trái màn hình</span>
                  </div>
                  <i v-if="!bannerForm.position || bannerForm.position === 'left'" class="fa-solid fa-circle-check pos-card-check"></i>
                </div>

                <div 
                  class="pos-card"
                  :class="{ active: bannerForm.position === 'right' }"
                  @click="bannerForm.position = 'right'"
                >
                  <span class="pos-card-icon">👉</span>
                  <div class="pos-card-content">
                    <strong class="pos-card-title">Banner Bên Phải</strong>
                    <span class="pos-card-sub">Cố định sườn phải màn hình</span>
                  </div>
                  <i v-if="bannerForm.position === 'right'" class="fa-solid fa-circle-check pos-card-check"></i>
                </div>
              </div>
            </div>

            <div>
              <label>Trang hiển thị *</label>
              <select v-model="bannerForm.page" class="admin-select">
                <option value="home">Trang Chủ (/)</option>
                <option value="nha-pho">Trang Nhà Phố (/nha-pho)</option>
                <option value="du-an">Trang Dự Án (/du-an)</option>
                <option value="all">Tất cả trang</option>
              </select>
            </div>

            <div>
              <label>Tiêu đề trên banner *</label>
              <input v-model="bannerForm.title" type="text" class="admin-input" placeholder="VD: NHÀ PHỐ QUẬN 11" required>
            </div>

            <div>
              <label>Huy hiệu góc trên</label>
              <input v-model="bannerForm.badge" type="text" class="admin-input" placeholder="VD: TIÊU BIỂU, HÀNG HIỆU...">
            </div>

            <div>
              <label>Icon huy hiệu</label>
              <select v-model="bannerForm.badgeIcon" class="admin-select">
                <option value="fa-crown">👑 Vương miện (fa-crown)</option>
                <option value="fa-gem">💎 Kim cương (fa-gem)</option>
                <option value="fa-fire">🔥 Hot (fa-fire)</option>
                <option value="fa-star">⭐ Ngôi sao (fa-star)</option>
                <option value="fa-award">🏆 Giải thưởng (fa-award)</option>
              </select>
            </div>

            <div class="form-col-full">
              <label>Ảnh Banner Dọc (Khuyên dùng tỷ lệ dọc ~9:16) *</label>
              
              <!-- Khu vực Upload File từ máy tính -->
              <div class="upload-dropzone" style="margin-bottom: 10px; padding: 16px; border: 2px dashed var(--border-gold, #dfb76c); border-radius: 8px; text-align: center; background: rgba(223, 183, 108, 0.04);">
                <input 
                  type="file" 
                  accept="image/*" 
                  id="bannerImageUploadInput" 
                  style="display: none;" 
                  @change="handleBannerFileUpload"
                />
                <button 
                  type="button" 
                  class="btn-admin-primary" 
                  style="font-size: 0.85rem; padding: 8px 16px; margin-bottom: 6px;"
                  :disabled="uploadingBanner"
                  @click="triggerBannerFileInput"
                >
                  <i class="fa-solid fa-cloud-arrow-up"></i>
                  <span>{{ uploadingBanner ? 'Đang tải ảnh lên...' : 'Chọn ảnh từ máy tính tải lên' }}</span>
                </button>
                <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">
                  Hỗ trợ JPG, PNG, WEBP. Ảnh tự động tải lên và lưu vào hệ thống.
                </p>
              </div>

              <!-- Nhập link ảnh -->
              <div style="display: flex; gap: 8px; align-items: center;">
                <input 
                  v-model="bannerForm.imageUrl" 
                  type="text" 
                  class="admin-input" 
                  placeholder="Hoặc dán đường dẫn ảnh (VD: /images/... hoặc https://...)" 
                  required
                />
              </div>

              <!-- Xem trước ảnh banner -->
              <div v-if="bannerForm.imageUrl" style="margin-top: 12px; display: flex; align-items: center; gap: 14px; background: rgba(0,0,0,0.06); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color, rgba(0,0,0,0.1));">
                <img :src="bannerForm.imageUrl" alt="Preview Banner" style="width: 75px; height: 120px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-gold, #dfb76c);" />
                <div>
                  <strong style="color: var(--text-main, #0f172a); font-size: 0.88rem; display: block; margin-bottom: 4px;">Xem Trước Ảnh Poster</strong>
                  <span style="color: var(--text-muted); font-size: 0.76rem; word-break: break-all; display: block;">{{ bannerForm.imageUrl }}</span>
                  <span style="color: #10b981; font-size: 0.76rem; margin-top: 4px; display: inline-block;"><i class="fa-solid fa-circle-check"></i> Ảnh đã sẵn sàng</span>
                </div>
              </div>
            </div>

            <div>
              <label>Chữ trên nút bấm</label>
              <input v-model="bannerForm.btnText" type="text" class="admin-input" placeholder="VD: Xem Quỹ Căn">
            </div>

            <div>
              <label>Link đích khi click</label>
              <input v-model="bannerForm.linkUrl" type="text" class="admin-input" placeholder="VD: /nha-pho#properties-list-top">
            </div>

            <div class="form-col-full">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; background: var(--bg-card, #ffffff); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color, #e2e8f0);">
                <input type="checkbox" v-model="bannerForm.isActive" style="width: 20px; height: 20px; accent-color: #10b981;">
                <div>
                  <strong style="color: var(--text-main, #0f172a); font-size: 0.9rem; display: block;">Bật hiển thị banner này</strong>
                  <span style="color: var(--text-muted); font-size: 0.78rem;">Khi tắt, banner sẽ tự động ẩn đi trên website khách</span>
                </div>
              </label>
            </div>
          </div>

          <div class="modal-footer" style="margin-top: 24px; display: flex; justify-content: flex-end; gap: 12px;">
            <button type="button" class="btn-admin-cancel" @click="showBannerModal = false">Hủy Bỏ</button>
            <button type="submit" class="btn-admin-primary" :disabled="savingBanner">
              <i class="fa-solid fa-floppy-disk"></i>
              <span>{{ savingBanner ? 'Đang Lưu...' : 'Lưu Thay Đổi' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const { showToast, toastMsg } = useToast();
const { theme, toggleTheme } = useTheme();

const isLoggedIn = ref(false);
const loginUsername = ref('');
const password = ref('');
const showPassword = ref(false);
const loginLoading = ref(false);
const loginError = ref('');
const currentUser = ref<any>(null);

// Chế độ đăng nhập hoặc đăng ký tài khoản mới
const authMode = ref<'login' | 'register'>('login');
const registerLoading = ref(false);
const registerError = ref('');
const registerForm = reactive({
  name: '',
  phone: '',
  username: '',
  password: '',
  officeId: 'VP1',
  departmentId: 'PB01',
  role: 'Chuyên Viên Tư Vấn BĐS',
});

// Reset password modal state
const showResetPasswordModal = ref(false);
const resettingAgent = ref<any>(null);
const newPasswordInput = ref('123456');
const savingResetPassword = ref(false);

const activeTab = ref<'properties' | 'agents' | 'articles' | 'leads' | 'banners' | 'checkin' | 'attendance' | 'leaves' | 'payroll' | 'salary_settings' | 'offices'>('properties');
const mobileSidebarOpen = ref(false);
const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
  if (process.client && window.innerWidth <= 900) {
    mobileSidebarOpen.value = !mobileSidebarOpen.value;
  } else {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
    if (process.client) {
      localStorage.setItem('bds_admin_sidebar_collapsed', isSidebarCollapsed.value ? 'true' : 'false');
    }
  }
};

// Modals State
const showPropModal = ref(false);
const showAgentModal = ref(false);
const showArticleModal = ref(false);
const showAssignModal = ref(false);
const showDeleteModal = ref(false);
const showBannerModal = ref(false);
const savingBanner = ref(false);
const uploadingBanner = ref(false);
const bannerFilterPage = ref('all');
const bannerFilterPosition = ref('all');

const bannerForm = reactive({
  isEdit: false,
  id: '',
  name: '',
  page: 'home',
  position: 'left',
  title: '',
  badge: 'TIÊU BIỂU',
  badgeIcon: 'fa-crown',
  imageUrl: '',
  linkUrl: '',
  btnText: 'Xem Chi Tiết',
  isActive: true,
});

const deletingLoading = ref(false);
const deleteTarget = ref<{ type: 'article' | 'property' | 'agent'; id: string; title: string } | null>(null);

const confirmDeleteItem = (type: 'article' | 'property' | 'agent', id: string, title: string) => {
  deleteTarget.value = { type, id, title };
  showDeleteModal.value = true;
};
const selectedAgentToAssign = ref<any>(null);
const assignedPropertyIds = ref<string[]>([]);
const crawlingNews = ref(false);

// Danh mục Tỉnh / Thành Phố và Quận Huyện phân cấp chuẩn theo sáp nhập mới nhất
import { PROVINCE_OPTIONS, PROVINCE_DISTRICTS } from '~/composables/useAdministrativeUnits';
import { calculatePricePerM2 } from '~/composables/usePropertyUtils';

// Admin filters
const adminPropFilter = reactive({
  category: 'all',
  province: 'all',
  ward: 'all',
});

const adminArticleFilter = reactive({
  category: 'all',
  status: 'all',
});

// Forms State
const customProvince = ref('');
const propForm = reactive({
  isEdit: false,
  id: '',
  title: '',
  categoryId: 'nha-pho',
  province: 'TP. Hồ Chí Minh',
  ward: 'Phường 11, Quận 11',
  price: '',
  priceRaw: 0,
  area: '',
  dimensions: '',
  location: '',
  structure: '',
  image: '',
  images: [] as string[],
  mapUrl: '',
  agentId: '',
  legal: '',
  rentIncome: '',
  description: '',
});

const liveCalculatedPricePerM2 = computed(() => {
  return calculatePricePerM2(propForm.priceRaw, propForm.area, propForm.price);
});

const currentDistricts = computed(() => {
  return PROVINCE_DISTRICTS[propForm.province] || [];
});

const onProvinceChange = () => {
  if (currentDistricts.value.length > 0) {
    propForm.ward = currentDistricts.value[0];
  } else {
    propForm.ward = '';
  }
};

const articleForm = reactive({
  isEdit: false,
  id: '',
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  image: '',
  category: 'Kinh nghiệm thực chiến',
  author: 'Ban Chuyên Gia Bến Thành',
  readTime: '6 phút đọc',
  isPublished: true,
  isFeatured: false,
  source: 'BĐS Bến Thành',
});

// Upload state & methods
const uploadingMainImage = ref(false);
const uploadingGallery = ref(false);
const uploadingArticleCover = ref(false);

const handleUploadMainImage = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  uploadingMainImage.value = true;
  try {
    const formData = new FormData();
    formData.append('file', target.files[0]);
    const res: any = await $fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (res.url) {
      propForm.image = res.url;
      showToast('Tải ảnh đại diện thành công!');
    }
  } catch (err) {
    showToast('Lỗi khi tải ảnh lên.');
  } finally {
    uploadingMainImage.value = false;
    target.value = '';
  }
};

const handleUploadGalleryImages = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  uploadingGallery.value = true;
  try {
    const formData = new FormData();
    for (let i = 0; i < target.files.length; i++) {
      formData.append(`file_${i}`, target.files[i]);
    }
    const res: any = await $fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (res.urls && res.urls.length > 0) {
      propForm.images = [...(propForm.images || []), ...res.urls];
      showToast(`Đã thêm ${res.urls.length} ảnh vào Album!`);
    }
  } catch (err) {
    showToast('Lỗi khi tải album ảnh.');
  } finally {
    uploadingGallery.value = false;
    target.value = '';
  }
};

const handleUploadArticleCover = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  uploadingArticleCover.value = true;
  try {
    const formData = new FormData();
    formData.append('file', target.files[0]);
    const res: any = await $fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (res.url) {
      articleForm.image = res.url;
      showToast('Tải ảnh bìa bài viết thành công!');
    }
  } catch (err) {
    showToast('Lỗi khi tải ảnh bìa.');
  } finally {
    uploadingArticleCover.value = false;
    target.value = '';
  }
};

const removeGalleryImage = (index: number) => {
  propForm.images.splice(index, 1);
};

const getGalleryCount = (p: any) => {
  if (!p.images) return 0;
  if (Array.isArray(p.images)) return p.images.length;
  try {
    const parsed = JSON.parse(p.images);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch (e) {
    return 0;
  }
};

const agentForm = reactive({
  isEdit: false,
  id: '',
  code: '',
  username: '',
  password: '',
  userRole: 'user',
  officeId: 'VP1',
  departmentId: '',
  isStarred: false,
  status: 'active',
  name: '',
  role: 'Chuyên Viên Hỗ Trợ Tư Vấn BĐS',
  phone: '',
  zalo: '',
  exp: '5+ Năm',
  deals: '50+ Căn',
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
  slogan: 'Tận Tâm - Uy Tín - Đầu Tư Hiệu Quả',
  tag: 'Chuyên Viên',
});

const agentFilterStarred = ref('all');
const agentFilterRole = ref('all');

const adminTokenCookie = useCookie<string | null>('bds_admin_token');

// Fetch Data từ Backend SQLite
const { data: propertiesData, refresh: refreshProps } = await useFetch('/api/properties');
const { data: agentsData, refresh: refreshAgents } = await useFetch('/api/agents?all=true');
const { data: articlesData, refresh: refreshArticles } = await useFetch('/api/articles');
const { data: leadsData, refresh: refreshLeads } = await useFetch('/api/leads', {
  headers: computed(() => {
    const token = adminTokenCookie.value || (process.client ? localStorage.getItem('bds_admin_session') : '');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }),
});
const { data: bannersData, refresh: refreshBanners } = await useFetch('/api/banners');
const { data: officesData } = await useFetch<any[]>('/api/cham-cong/offices');
const { data: departmentsData } = await useFetch<any[]>('/api/cham-cong/departments');

const defaultOffices = [
  { id: 'VP1', name: 'Văn phòng 12 Đường số 2' },
  { id: 'VP2', name: 'Văn phòng Số 6 Đường 5A' },
  { id: 'VP3', name: 'Văn phòng 70D Phú Thọ' },
];

const defaultDepartments = [
  { id: 'PB01', name: 'Ban Xây Dựng', officeId: 'VP1' },
  { id: 'PB02', name: 'Ban Bất Động Sản 1', officeId: 'VP1' },
  { id: 'PB03', name: 'Ban Chứng Khoán', officeId: 'VP2' },
  { id: 'PB04', name: 'Ban Bất Động Sản 2', officeId: 'VP2' },
  { id: 'PB05', name: 'Ban Marketing & Training Chứng Khoán', officeId: 'VP3' },
  { id: 'PB06', name: 'Ban Quản Lý', officeId: null },
];

const officesList = computed(() => {
  if (Array.isArray(officesData.value) && officesData.value.length > 0) {
    return officesData.value;
  }
  return defaultOffices;
});

const departmentsList = computed(() => {
  if (Array.isArray(departmentsData.value) && departmentsData.value.length > 0) {
    return departmentsData.value;
  }
  return defaultDepartments;
});

const filteredDepartmentsForRegister = computed(() => {
  const offId = registerForm.officeId;
  if (!offId) return departmentsList.value;
  return departmentsList.value.filter(
    (d: any) => !d.officeId || d.officeId === offId
  );
});

const filteredDepartmentsForAgent = computed(() => {
  const offId = agentForm.officeId;
  if (!offId) return departmentsList.value;
  return departmentsList.value.filter(
    (d: any) => !d.officeId || d.officeId === offId
  );
});

watch(() => registerForm.officeId, () => {
  const list = filteredDepartmentsForRegister.value;
  if (list.length > 0 && !list.some((d: any) => d.id === registerForm.departmentId)) {
    registerForm.departmentId = list[0].id;
  }
});

const properties = computed(() => propertiesData.value || []);
const agents = computed(() => agentsData.value || []);
const articles = computed(() => articlesData.value || []);
const leads = computed(() => leadsData.value || []);
const banners = computed(() => bannersData.value || []);

const filteredAgents = computed(() => {
  let list = agents.value;
  if (agentFilterStarred.value === 'starred') {
    list = list.filter((a: any) => a.isStarred);
  } else if (agentFilterStarred.value === 'unstarred') {
    list = list.filter((a: any) => !a.isStarred);
  }
  if (agentFilterRole.value !== 'all') {
    list = list.filter((a: any) => (a.userRole || 'user') === agentFilterRole.value);
  }
  return list;
});

const filteredBanners = computed(() => {
  let list = banners.value;
  if (bannerFilterPage.value !== 'all') {
    list = list.filter((b: any) => b.page === bannerFilterPage.value || b.page === 'all');
  }
  if (bannerFilterPosition.value !== 'all') {
    list = list.filter((b: any) => (b.position || 'left') === bannerFilterPosition.value);
  }
  return list;
});

// Xem ảnh ký gửi
const previewingImage = ref<string | null>(null);
const viewLeadImage = (url: string) => {
  previewingImage.value = url;
};
const parseLeadImages = (raw: any): string[] => {
  if (!raw) return [];
  let list: string[] = [];
  if (Array.isArray(raw)) list = raw;
  else {
    try {
      const parsed = JSON.parse(raw);
      list = Array.isArray(parsed) ? parsed : [raw];
    } catch {
      list = [raw];
    }
  }
  return list.map(img => {
    if (typeof img === 'string' && img.startsWith('/uploads/') && !img.includes('?')) {
      return `${img}?v=2`;
    }
    return img;
  });
};

// Danh sách Tỉnh thành thực tế có trong BĐS
const distinctProvinces = computed(() => {
  const set = new Set<string>();
  properties.value.forEach((p: any) => {
    if (p.province && p.province.trim()) {
      set.add(p.province.trim());
    }
  });
  // Luôn có ít nhất các tỉnh phổ biến nếu chưa có dữ liệu
  if (set.size === 0) {
    set.add('TP. Hồ Chí Minh');
    set.add('Đồng Nai');
    set.add('Bình Dương');
    set.add('Long An');
  }
  return Array.from(set);
});

// Danh sách Quận / Huyện / Phường (lọc theo Tỉnh nếu đã chọn Tỉnh)
const distinctFilteredWards = computed(() => {
  const set = new Set<string>();
  properties.value.forEach((p: any) => {
    if (adminPropFilter.province !== 'all' && p.province !== adminPropFilter.province) {
      return;
    }
    if (p.ward && p.ward.trim()) {
      set.add(p.ward.trim());
    }
  });
  return Array.from(set);
});

const filteredAdminProperties = computed(() => {
  return properties.value.filter((p: any) => {
    if (adminPropFilter.category !== 'all' && p.categoryId !== adminPropFilter.category) {
      return false;
    }
    if (adminPropFilter.province !== 'all' && p.province !== adminPropFilter.province) {
      return false;
    }
    if (adminPropFilter.ward !== 'all' && p.ward !== adminPropFilter.ward) {
      return false;
    }
    return true;
  });
});

const filteredAdminArticles = computed(() => {
  return articles.value.filter((a: any) => {
    if (adminArticleFilter.category !== 'all' && a.category !== adminArticleFilter.category) {
      return false;
    }
    if (adminArticleFilter.status === 'published' && !a.isPublished) {
      return false;
    }
    if (adminArticleFilter.status === 'draft' && a.isPublished) {
      return false;
    }
    return true;
  });
});

onMounted(() => {
  if (process.client) {
    const savedCollapsed = localStorage.getItem('bds_admin_sidebar_collapsed');
    if (savedCollapsed === 'true' && window.innerWidth > 900) {
      isSidebarCollapsed.value = true;
    }

    // Phím tắt Ctrl+B / Cmd+B để co hẹp / mở rộng sidebar
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    });

    const saved = localStorage.getItem('bds_admin_session');
    const savedUser = localStorage.getItem('bds_user_info');
    if (saved) {
      isLoggedIn.value = true;
      if (savedUser) {
        try {
          currentUser.value = JSON.parse(savedUser);
        } catch (e) {}
      }
      if (!adminTokenCookie.value) {
        adminTokenCookie.value = saved;
      }
    }
  }
});

const switchTab = (tab: 'properties' | 'agents' | 'articles' | 'leads' | 'banners' | 'checkin' | 'attendance' | 'leaves' | 'payroll' | 'salary_settings' | 'offices') => {
  activeTab.value = tab;
  mobileSidebarOpen.value = false;
};

const handleLogin = async () => {
  loginLoading.value = true;
  loginError.value = '';
  try {
    const res: any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { 
        username: loginUsername.value, 
        password: password.value 
      },
    });
    if (res.success) {
      isLoggedIn.value = true;
      currentUser.value = res.user;
      localStorage.setItem('bds_admin_session', res.token);
      localStorage.setItem('bds_user_info', JSON.stringify(res.user));
      adminTokenCookie.value = res.token;
      showToast(`Xin chào ${res.user.name || res.user.username}!`);
      
      // Nếu là nhân viên thường, đưa vào Chấm Công WiFi mặc định
      if (res.user.role === 'user') {
        activeTab.value = 'checkin';
      }
      
      await refreshLeads();
      await refreshAgents();
    }
  } catch (err: any) {
    loginError.value = err?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác!';
  } finally {
    loginLoading.value = false;
  }
};

const handleRegister = async () => {
  registerLoading.value = true;
  registerError.value = '';
  try {
    const res: any = await $fetch('/api/auth/register', {
      method: 'POST',
      body: registerForm,
    });
    if (res?.success) {
      showToast(res.message);
      // Tự động điền thông tin vừa tạo vào ô đăng nhập và chuyển tab Đăng Nhập
      loginUsername.value = res.agent?.code || registerForm.username || registerForm.phone;
      password.value = registerForm.password || '123456';
      authMode.value = 'login';
      loginError.value = '';
      await refreshAgents();
    }
  } catch (err: any) {
    registerError.value = err?.data?.statusMessage || err?.data?.message || 'Lỗi khi đăng ký tài khoản!';
  } finally {
    registerLoading.value = false;
  }
};

const handleLogout = () => {
  isLoggedIn.value = false;
  currentUser.value = null;
  localStorage.removeItem('bds_admin_session');
  localStorage.removeItem('bds_user_info');
  adminTokenCookie.value = null;
  loginUsername.value = '';
  password.value = '';
  loginError.value = '';
  showToast('Đã đăng xuất khỏi hệ thống.');
};

// HÀNH ĐỘNG KHÓA / MỞ KHÓA TÀI KHOẢN NHÂN VIÊN
const toggleLockAgent = async (agent: any) => {
  const isLocking = agent.status !== 'locked';
  const confirmMsg = isLocking
    ? `Bạn có chắc muốn KHÓA tài khoản của "${agent.name}" (${agent.code || agent.username})?\nNhân viên này sẽ bị chặn không thể đăng nhập vào hệ thống!`
    : `Mở khóa tài khoản cho "${agent.name}" (${agent.code || agent.username})?`;
  if (!confirm(confirmMsg)) return;

  try {
    const res: any = await $fetch(`/api/agents/${agent.id}/toggle-lock`, { method: 'POST' });
    if (res?.success) {
      agent.status = res.status;
      showToast(res.message);
      await refreshAgents();
    }
  } catch (err: any) {
    alert(err?.data?.message || 'Lỗi khi cập nhật trạng thái khóa tài khoản!');
  }
};

// HÀNH ĐỘNG KHÔI PHỤC / RESET MẬT KHẨU NHÂN VIÊN
const openResetPasswordModal = (agent: any) => {
  resettingAgent.value = agent;
  newPasswordInput.value = '123456';
  showResetPasswordModal.value = true;
};

const executeResetPassword = async () => {
  if (!resettingAgent.value) return;
  if (!newPasswordInput.value.trim()) {
    alert('Vui lòng nhập mật khẩu mới!');
    return;
  }
  savingResetPassword.value = true;
  try {
    const res: any = await $fetch(`/api/agents/${resettingAgent.value.id}/reset-password`, {
      method: 'POST',
      body: { password: newPasswordInput.value.trim() },
    });
    if (res?.success) {
      showToast(res.message);
      showResetPasswordModal.value = false;
      await refreshAgents();
    }
  } catch (err: any) {
    alert(err?.data?.message || 'Lỗi khi reset mật khẩu!');
  } finally {
    savingResetPassword.value = false;
  }
};

// CRUD Properties
const openNewPropertyModal = () => {
  propForm.isEdit = false;
  propForm.id = '';
  propForm.title = '';
  propForm.categoryId = 'nha-pho';
  propForm.province = 'TP. Hồ Chí Minh';
  propForm.ward = 'Phường 11, Quận 11';
  customProvince.value = '';
  propForm.price = '';
  propForm.priceRaw = 0;
  propForm.area = '';
  propForm.dimensions = '';
  propForm.location = '';
  propForm.structure = '';
  propForm.image = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
  propForm.images = [];
  propForm.mapUrl = '';
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
  propForm.province = p.province || 'TP. Hồ Chí Minh';
  propForm.ward = p.ward || '';
  if (!PROVINCE_OPTIONS.includes(propForm.province)) {
    customProvince.value = propForm.province;
    propForm.province = 'Tỉnh thành khác';
  } else {
    customProvince.value = '';
  }
  propForm.price = p.price;
  propForm.priceRaw = p.priceRaw;
  propForm.area = p.area;
  propForm.dimensions = p.dimensions || '';
  propForm.location = p.location;
  propForm.structure = p.structure;
  propForm.image = p.image;
  if (p.images) {
    try {
      propForm.images = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
      if (!Array.isArray(propForm.images)) propForm.images = [];
    } catch (e) {
      propForm.images = [];
    }
  } else {
    propForm.images = [];
  }
  propForm.mapUrl = p.mapUrl || '';
  propForm.agentId = p.agentId || '';
  propForm.legal = p.legal;
  propForm.rentIncome = p.rentIncome;
  propForm.description = p.description;
  showPropModal.value = true;
};

const saveProperty = async () => {
  try {
    const finalProvince = propForm.province === 'Tỉnh thành khác' 
      ? (customProvince.value.trim() || 'Khác') 
      : propForm.province;

    const payload = {
      ...propForm,
      province: finalProvince,
    };

    if (propForm.isEdit) {
      await $fetch(`/api/properties/${propForm.id}`, {
        method: 'PUT',
        body: payload,
      });
      showToast('Đã cập nhật bất động sản!');
    } else {
      await $fetch('/api/properties', {
        method: 'POST',
        body: payload,
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

// Xử lý Xóa Dữ Liệu (In-App Confirm Modal & Optimistic State)
const executeDeleteItem = async () => {
  if (!deleteTarget.value) return;
  deletingLoading.value = true;
  const { type, id } = deleteTarget.value;
  try {
    if (type === 'article') {
      await $fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (articlesData.value) {
        articlesData.value = articlesData.value.filter((a: any) => a.id !== id && a.slug !== id);
      }
      showToast('Đã xóa bài viết thành công!');
      await refreshArticles();
    } else if (type === 'property') {
      await $fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (propertiesData.value) {
        propertiesData.value = propertiesData.value.filter((p: any) => p.id !== id);
      }
      showToast('Đã xóa bất động sản thành công!');
      await refreshProps();
      await refreshAgents();
    } else if (type === 'agent') {
      await $fetch(`/api/agents/${id}`, { method: 'DELETE' });
      if (agentsData.value) {
        agentsData.value = agentsData.value.filter((a: any) => a.id !== id);
      }
      showToast('Đã xóa nhân viên thành công!');
      await refreshAgents();
      await refreshProps();
    }
  } catch (err: any) {
    showToast('Lỗi khi xóa: ' + (err?.data?.statusMessage || err?.message || 'Thất bại'));
  } finally {
    deletingLoading.value = false;
    showDeleteModal.value = false;
    deleteTarget.value = null;
  }
};

const deleteProperty = (id: string, title?: string) => {
  confirmDeleteItem('property', id, title || id);
};

// Cấu hình Căn Nhà Phố Tiêu Biểu hiển thị trên Banner trang Nhà Phố
const isFeaturedTownhouse = (p: any) => {
  return p.categoryId === 'nha-pho' && p.badge && (p.badge.toLowerCase().includes('tiêu biểu') || p.badge.toLowerCase().includes('độc quyền'));
};

const toggleFeaturedTownhouse = async (prop: any) => {
  try {
    const isCurrently = isFeaturedTownhouse(prop);
    const newBadge = isCurrently ? 'Đang Bán' : 'Căn Tiêu Biểu';

    // Nếu kích hoạt thành Tiêu Biểu, gỡ Tiêu Biểu ở các căn nhà phố khác để đảm bảo duy nhất
    if (!isCurrently && propertiesData.value) {
      for (const p of propertiesData.value) {
        if (p.id !== prop.id && p.categoryId === 'nha-pho' && isFeaturedTownhouse(p)) {
          await $fetch(`/api/properties/${p.id}`, {
            method: 'PUT',
            body: { ...p, badge: 'Đang Bán' },
          });
          p.badge = 'Đang Bán';
        }
      }
    }

    await $fetch(`/api/properties/${prop.id}`, {
      method: 'PUT',
      body: { ...prop, badge: newBadge },
    });
    prop.badge = newBadge;

    if (!isCurrently) {
      showToast(`Đã chọn [${prop.title}] làm Banner Nhà Phố Tiêu Biểu!`);
    } else {
      showToast(`Đã gỡ trạng thái Banner Tiêu Biểu của [${prop.title}].`);
    }
    await refreshProps();
  } catch (err: any) {
    showToast('Lỗi khi cập nhật banner tiêu biểu: ' + (err?.data?.message || err?.message || 'Lỗi server'));
  }
};

// CRUD Agents & Nhân Sự
const openNewAgentModal = () => {
  agentForm.isEdit = false;
  agentForm.id = '';
  agentForm.code = '';
  agentForm.username = '';
  agentForm.password = '';
  agentForm.userRole = 'user';
  agentForm.officeId = 'VP1';
  agentForm.departmentId = 'PB01';
  agentForm.isStarred = true;
  agentForm.status = 'active';
  agentForm.name = '';
  agentForm.role = 'Chuyên Viên Hỗ Trợ Tư Vấn BĐS';
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
  agentForm.code = a.code || '';
  agentForm.username = a.username || '';
  agentForm.password = ''; // Để trống nếu không đổi mật khẩu
  agentForm.userRole = a.userRole || 'user';
  agentForm.officeId = a.officeId || 'VP1';
  agentForm.departmentId = a.departmentId || '';
  agentForm.isStarred = Boolean(a.isStarred);
  agentForm.status = a.status || 'active';
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

const toggleStarAgent = async (agent: any) => {
  try {
    const updatedStarred = !agent.isStarred;
    await $fetch(`/api/agents/${agent.id}`, {
      method: 'PUT',
      body: { isStarred: updatedStarred },
    });
    agent.isStarred = updatedStarred;
    showToast(updatedStarred ? `⭐ Đã đưa "${agent.name}" lên hiển thị ngoài Website BĐS!` : `Đã gỡ "${agent.name}" khỏi web ngoài (vẫn giữ chấm công & nội bộ).`);
    await refreshAgents();
  } catch (err: any) {
    showToast('Lỗi khi đổi trạng thái hiển thị: ' + (err?.data?.message || err?.message || ''));
  }
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
  } catch (e: any) {
    showToast('Lỗi khi lưu nhân viên: ' + (e?.data?.message || e?.message || ''));
  }
};

const deleteAgent = (id: string, name?: string) => {
  confirmDeleteItem('agent', id, name || id);
};

// CRUD Articles (Tin Tức)
const openNewArticleModal = () => {
  articleForm.isEdit = false;
  articleForm.id = '';
  articleForm.title = '';
  articleForm.slug = '';
  articleForm.excerpt = '';
  articleForm.content = '';
  articleForm.image = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80';
  articleForm.category = 'Kinh nghiệm thực chiến';
  articleForm.author = 'Ban Chuyên Gia Bến Thành';
  articleForm.readTime = '6 phút đọc';
  articleForm.isPublished = true;
  articleForm.isFeatured = false;
  articleForm.source = 'BĐS Bến Thành Thực Chiến';
  showArticleModal.value = true;
};

const openEditArticleModal = (item: any) => {
  articleForm.isEdit = true;
  articleForm.id = item.id;
  articleForm.title = item.title;
  articleForm.slug = item.slug;
  articleForm.excerpt = item.excerpt;
  articleForm.content = item.content;
  articleForm.image = item.image;
  articleForm.category = item.category;
  articleForm.author = item.author;
  articleForm.readTime = item.readTime;
  articleForm.isPublished = item.isPublished;
  articleForm.isFeatured = item.isFeatured;
  articleForm.source = item.source || 'BĐS Bến Thành';
  showArticleModal.value = true;
};

const saveArticle = async () => {
  try {
    if (articleForm.isEdit) {
      await $fetch(`/api/articles/${articleForm.id}`, {
        method: 'PUT',
        body: articleForm,
      });
      showToast('Đã cập nhật bài viết thành công!');
    } else {
      await $fetch('/api/articles', {
        method: 'POST',
        body: articleForm,
      });
      showToast('Đã thêm bài viết mới thành công!');
    }
    showArticleModal.value = false;
    await refreshArticles();
  } catch (e) {
    showToast('Lỗi khi lưu bài viết!');
  }
};

const deleteArticle = (id: string, title?: string) => {
  confirmDeleteItem('article', id, title || id);
};

const togglePublishArticle = async (item: any) => {
  try {
    const updatedState = !item.isPublished;
    await $fetch(`/api/articles/${item.id}`, {
      method: 'PUT',
      body: {
        ...item,
        isPublished: updatedState,
      },
    });
    showToast(updatedState ? `Đã xuất bản bài viết lên web!` : `Đã chuyển bài viết về bản nháp.`);
    await refreshArticles();
  } catch (e) {
    showToast('Lỗi khi đổi trạng thái bài viết!');
  }
};

// Cào tin nhanh từ RSS
const handleCrawlNews = async () => {
  crawlingNews.value = true;
  try {
    const res: any = await $fetch('/api/articles/crawl', {
      method: 'POST',
    });
    showToast(res.message || 'Đã cào các tin mới về danh sách bản nháp!');
    await refreshArticles();
  } catch (e) {
    showToast('Lỗi khi cào tin thị trường!');
  } finally {
    crawlingNews.value = false;
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
    showToast(`Đã phân công ${assignedPropertyIds.value.length} BĐS cho ${selectedAgentToAssign.value.name}!`);
    showAssignModal.value = false;
    await refreshAgents();
    await refreshProps();
  } catch (e) {
    showToast('Lỗi khi phân công dự án!');
  }
};

// ==================== QUẢN LÝ BANNER QUẢNG CÁO ====================
const openNewBannerModal = (pos: 'left' | 'right' = 'left') => {
  bannerForm.isEdit = false;
  bannerForm.id = `banner_${Date.now()}`;
  bannerForm.name = pos === 'right' ? 'Banner Bên Phải Mới' : 'Banner Bên Trái Mới';
  bannerForm.page = 'home';
  bannerForm.position = pos;
  bannerForm.title = '';
  bannerForm.badge = 'TIÊU BIỂU';
  bannerForm.badgeIcon = 'fa-crown';
  bannerForm.imageUrl = '/images/banner-poster-nhapho.jpg';
  bannerForm.linkUrl = '/#properties';
  bannerForm.btnText = 'Xem Chi Tiết';
  bannerForm.isActive = true;
  showBannerModal.value = true;
};

const openEditBannerModal = (b: any) => {
  bannerForm.isEdit = true;
  bannerForm.id = b.id;
  bannerForm.name = b.name || '';
  bannerForm.page = b.page || 'home';
  bannerForm.position = b.position || 'left';
  bannerForm.title = b.title || '';
  bannerForm.badge = b.badge || 'TIÊU BIỂU';
  bannerForm.badgeIcon = b.badgeIcon || 'fa-crown';
  bannerForm.imageUrl = b.imageUrl || '';
  bannerForm.linkUrl = b.linkUrl || '';
  bannerForm.btnText = b.btnText || 'Xem Chi Tiết';
  bannerForm.isActive = b.isActive !== false;
  showBannerModal.value = true;
};

const triggerBannerFileInput = () => {
  const el = document.getElementById('bannerImageUploadInput');
  if (el) el.click();
};

const handleBannerFileUpload = async (event: any) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  uploadingBanner.value = true;
  try {
    const res: any = await $fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (res?.url) {
      bannerForm.imageUrl = res.url;
      showToast('Tải ảnh banner lên thành công!');
    }
  } catch (err: any) {
    alert(err?.data?.message || 'Lỗi khi tải ảnh lên máy chủ!');
  } finally {
    uploadingBanner.value = false;
  }
};

const saveBanner = async () => {
  savingBanner.value = true;
  try {
    const res: any = await $fetch(`/api/banners/${bannerForm.id}`, {
      method: 'PUT',
      body: {
        name: bannerForm.name,
        page: bannerForm.page,
        position: bannerForm.position || 'left',
        title: bannerForm.title,
        badge: bannerForm.badge,
        badgeIcon: bannerForm.badgeIcon,
        imageUrl: bannerForm.imageUrl,
        linkUrl: bannerForm.linkUrl,
        btnText: bannerForm.btnText,
        isActive: bannerForm.isActive,
      },
    });

    if (res?.success) {
      showToast('Đã lưu cấu hình banner thành công!');
      showBannerModal.value = false;
      await refreshBanners();
    }
  } catch (err: any) {
    alert(err?.data?.message || 'Lỗi khi lưu banner!');
  } finally {
    savingBanner.value = false;
  }
};

const toggleBannerStatus = async (b: any) => {
  const nextStatus = !b.isActive;
  b.isActive = nextStatus; // optimistic update
  try {
    await $fetch(`/api/banners/${b.id}`, {
      method: 'PUT',
      body: {
        ...b,
        isActive: nextStatus,
      },
    });
    showToast(`Đã ${nextStatus ? 'BẬT' : 'TẮT'} hiển thị banner "${b.name}"!`);
    await refreshBanners();
  } catch (e) {
    b.isActive = !nextStatus;
    showToast('Lỗi khi cập nhật trạng thái banner!');
  }
};

useHead({
  title: 'Trung Tâm Điều Hành - Bến Thành Land',
});
</script>

<style scoped>
/* ===================================================================
   TRUNG TÂM ĐIỀU HÀNH DOANH NGHIỆP - BẤT ĐỘNG SẢN BẾN THÀNH
   =================================================================== */
.admin-root,
.admin-root button,
.admin-root input,
.admin-root select,
.admin-root textarea {
  font-family: 'Plus Jakarta Sans', 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.admin-root {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-main);
  display: flex;
  flex-direction: column;
}

/* Toast Thông Báo Góc Phải */
.admin-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  background: #10b981;
  color: #fff;
  padding: 12px 20px;
  border-radius: var(--radius-sm);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 9999;
  animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
  from { transform: translateX(50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* 1. Màn hình Login */
.admin-login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: radial-gradient(circle at top center, rgba(212, 175, 55, 0.12) 0%, var(--bg-primary) 70%);
}

.admin-login-box {
  width: 100%;
  max-width: 440px;
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  border-radius: var(--radius-lg);
  padding: 40px 32px;
  box-shadow: var(--shadow-md);
  text-align: center;
}

.admin-logo-badge {
  width: 56px;
  height: 56px;
  background: var(--gold-gradient);
  color: #000;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.5rem;
  margin: 0 auto 16px;
  box-shadow: var(--shadow-gold);
}

.login-header h2 {
  font-size: 1.35rem;
  font-family: var(--font-heading);
  color: var(--text-main);
  margin-bottom: 6px;
}

.login-header p {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.login-form .form-group {
  text-align: left;
  margin-bottom: 20px;
}

.login-form label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-main);
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon i {
  position: absolute;
  left: 14px;
  color: var(--gold-primary);
  font-size: 0.9rem;
}

.input-with-icon input {
  width: 100%;
  padding: 12px 14px 12px 40px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-main);
  font-size: 0.9rem;
  outline: none;
  transition: var(--transition);
}

.input-with-icon input:focus {
  border-color: var(--gold-primary);
  box-shadow: 0 0 0 3px var(--gold-glow);
}

.hint-text {
  display: block;
  font-size: 0.78rem;
  color: var(--gold-primary);
  margin-top: 6px;
}

.login-btn {
  width: 100%;
  padding: 13px;
  font-size: 0.95rem;
  margin-top: 8px;
}

.login-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.back-home-link {
  color: var(--text-muted);
  font-size: 0.85rem;
  text-decoration: none;
  transition: var(--transition);
}

.back-home-link:hover {
  color: var(--gold-primary);
}

/* 2. DASHBOARD BỐ CỤC EXECUTIVE LUXURY TEMPLATE */
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  position: relative;
  background: var(--bg-primary);
}

/* BACKDROP CHO MOBILE KHI MỞ MENU */
.admin-sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 999;
}

/* THANH BÊN BÊN TRÁI (LEFT SIDEBAR) */
.admin-sidebar {
  width: 270px;
  background: var(--bg-card);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 1000;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 16px rgba(0, 0, 0, 0.04);
}

.admin-sidebar.sidebar-collapsed {
  width: 74px !important;
}

.admin-sidebar.sidebar-collapsed .brand-info,
.admin-sidebar.sidebar-collapsed .user-meta-info,
.admin-sidebar.sidebar-collapsed .nav-label,
.admin-sidebar.sidebar-collapsed .nav-count-badge,
.admin-sidebar.sidebar-collapsed .menu-group-title,
.admin-sidebar.sidebar-collapsed .sidebar-home-btn span,
.admin-sidebar.sidebar-collapsed .sidebar-home-btn .external-icon,
.admin-sidebar.sidebar-collapsed .logout-btn span {
  display: none !important;
}

/* Header Brand */
.sidebar-brand {
  padding: 18px 18px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
}

.admin-brand-logo-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  border: 1.5px solid var(--border-gold);
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.2);
}

.admin-sidebar-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-info {
  min-width: 0;
  flex: 1;
}

.brand-title {
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin: 0;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brand-badge {
  font-size: 0.7rem;
  color: var(--gold-primary);
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  margin-top: 2px;
}

.sidebar-close-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 4px;
}

/* Thẻ Thông Tin User Đang Đăng Nhập */
.admin-user-card {
  margin: 12px 14px 6px;
  padding: 10px 12px;
  background: var(--bg-secondary, rgba(0, 0, 0, 0.02));
  border: 1px solid var(--border-color);
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar-wrap {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 1.5px solid var(--border-gold);
  background: rgba(212, 175, 55, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar-placeholder {
  color: var(--gold-primary);
  font-size: 1rem;
}

.user-online-dot {
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 9px;
  height: 9px;
  background: #10b981;
  border-radius: 50%;
  border: 2px solid var(--bg-card);
}

.user-meta-info {
  min-width: 0;
  flex: 1;
}

.user-display-name {
  display: block;
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role-line {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}

.user-role-badge {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  display: inline-block;
}

.user-role-badge.admin {
  background: rgba(212, 175, 55, 0.18);
  color: var(--gold-primary);
}

.user-role-badge.manager {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.user-role-badge.user {
  background: rgba(148, 163, 184, 0.15);
  color: var(--text-muted);
}

.user-code-pill {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--text-muted);
}

/* Danh Sách Menu Cuộn Được */
.sidebar-scrollable-menu {
  flex: 1;
  overflow-y: auto;
  padding: 10px 12px 16px;
}

.sidebar-scrollable-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-scrollable-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.menu-group {
  margin-bottom: 16px;
}

.menu-group-title {
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.8px;
  color: var(--text-muted);
  padding: 4px 8px 6px;
  text-transform: uppercase;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.18s ease;
  text-align: left;
}

.nav-item-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.nav-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.nav-icon.gold {
  background: rgba(212, 175, 55, 0.12);
  color: var(--gold-primary);
}

.nav-icon.green {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.nav-icon.amber {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.nav-icon.purple {
  background: rgba(168, 85, 247, 0.12);
  color: #a855f7;
}

.nav-icon.emerald {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
}

.nav-icon.blue {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.nav-icon.orange {
  background: rgba(249, 115, 22, 0.12);
  color: #ea580c;
}

.nav-icon.cyan {
  background: rgba(6, 182, 212, 0.12);
  color: #0891b2;
}

.nav-icon.gray {
  background: rgba(148, 163, 184, 0.12);
  color: var(--text-muted);
}

.nav-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-item:hover {
  background: rgba(212, 175, 55, 0.08);
  color: var(--text-main);
}

.nav-item:hover .nav-icon {
  transform: scale(1.08);
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(212, 175, 55, 0.16) 0%, rgba(212, 175, 55, 0.04) 100%);
  border-color: rgba(212, 175, 55, 0.4);
  color: var(--gold-primary);
  font-weight: 700;
}

.nav-item.active .nav-icon {
  background: var(--gold-gradient);
  color: #000;
  box-shadow: 0 2px 6px rgba(212, 175, 55, 0.3);
}

.nav-count-badge {
  padding: 2px 7px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.nav-count-badge.gold {
  background: rgba(212, 175, 55, 0.18);
  color: var(--gold-primary);
}

.nav-count-badge.green {
  background: rgba(16, 185, 129, 0.18);
  color: #10b981;
}

.nav-count-badge.amber {
  background: rgba(245, 158, 11, 0.18);
  color: #f59e0b;
}

.nav-count-badge.purple {
  background: rgba(168, 85, 247, 0.18);
  color: #a855f7;
}

.nav-count-badge.blue {
  background: rgba(59, 130, 246, 0.18);
  color: #3b82f6;
}

.theme-toggle-badge {
  font-size: 0.7rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  color: var(--text-muted);
}

.external-link-icon {
  font-size: 0.75rem;
  opacity: 0.6;
}

/* Chân Sidebar: Đăng Xuất */
.sidebar-footer {
  padding: 12px 14px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-card);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 12px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #ef4444;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

/* KHU VỰC NỘI DUNG CHÍNH (MAIN BODY) */
.admin-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  overflow-x: hidden;
}

/* TOPBAR ĐIỀU KHIỂN */
.admin-topbar {
  padding: 14px 28px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 900;
  backdrop-filter: blur(12px);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.mobile-toggle-btn {
  display: none;
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 7px 11px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.breadcrumb {
  font-size: 0.74rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}

.breadcrumb i {
  font-size: 0.62rem;
}

.breadcrumb .active-crumb {
  color: var(--gold-primary);
  font-weight: 600;
}

.page-heading {
  font-size: 1.25rem;
  font-family: var(--font-heading);
  color: var(--text-main);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}


.admin-select,
.admin-input,
.admin-textarea {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  font-size: 0.85rem;
  outline: none;
  transition: var(--transition);
  width: 100%;
}

.admin-select {
  cursor: pointer;
  width: auto;
}

.admin-select:focus,
.admin-input:focus,
.admin-textarea:focus {
  border-color: var(--gold-primary);
  box-shadow: 0 0 0 2px var(--gold-glow);
}

/* BẢNG DỮ LIỆU ADMIN */
.admin-table-container {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow-x: auto;
  box-shadow: var(--shadow-sm);
}

.admin-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  text-align: left;
}

.admin-data-table th {
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-muted);
  font-weight: 700;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.admin-data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.admin-data-table tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

.empty-table {
  text-align: center;
  padding: 40px !important;
  color: var(--text-muted);
}

.empty-table i {
  font-size: 2.2rem;
  margin-bottom: 8px;
  display: block;
  opacity: 0.5;
}

/* Cells styling */
.prop-thumb {
  position: relative;
  width: 60px;
  height: 44px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: #000;
}

.prop-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 9px;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: 600;
}

.thumb-badge.gold {
  background: var(--gold-gradient);
  color: #000;
}

.prop-code {
  font-weight: 800;
  color: var(--gold-primary);
  font-size: 0.85rem;
}

.prop-title-cell {
  max-width: 320px;
}

.prop-name-link {
  color: var(--text-main);
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  line-height: 1.35;
  transition: var(--transition);
}

.prop-name-link:hover {
  color: var(--gold-primary);
}

.prop-name-link i {
  font-size: 0.75rem;
  opacity: 0.6;
}

.prop-loc-text {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-top: 3px;
}

.prop-meta-inline {
  display: flex;
  gap: 10px;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.prop-price-text {
  color: var(--gold-primary);
  font-size: 0.95rem;
}

.cat-pill {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.78rem;
  font-weight: 600;
}

.cat-pill.nha-pho {
  background: rgba(212, 175, 55, 0.15);
  border: 1px solid var(--border-gold);
  color: var(--gold-primary);
}

.cat-pill.du-an {
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: #60a5fa;
}

.cat-pill.other {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-muted);
}

.ward-text {
  display: block;
  font-size: 0.72rem;
  margin-top: 2px;
}

.agent-chip {
  display: flex;
  align-items: center;
  gap: 8px;
}

.agent-mini-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border-gold);
}

.agent-chip strong {
  display: block;
  font-size: 0.82rem;
  color: var(--text-main);
}

.agent-chip small {
  font-size: 0.72rem;
  color: var(--gold-primary);
}

.unassigned-text {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-style: italic;
}

.table-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.action-btn {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  border: 1px solid transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  transition: var(--transition);
}

.action-btn.featured-btn {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(212, 175, 55, 0.3);
  color: var(--text-muted);
}

.action-btn.featured-btn:hover {
  background: rgba(212, 175, 55, 0.25);
  color: var(--gold-primary);
  border-color: var(--gold-primary);
}

.action-btn.featured-btn.featured-active {
  background: var(--gold-gradient);
  color: #070e1b;
  font-weight: 800;
  border-color: transparent;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
}

.badge-featured-banner {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--gold-gradient);
  color: #070e1b;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 4px;
  margin-bottom: 4px;
  letter-spacing: 0.4px;
}

.admin-brand-logo-wrap {
  width: 44px;
  height: 44px;
  background: #ffffff;
  border-radius: var(--radius-sm, 8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  box-shadow: var(--shadow-gold);
  border: 1px solid rgba(212, 175, 55, 0.5);
  flex-shrink: 0;
}

.admin-sidebar-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.action-btn.view-btn {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-main);
}

.action-btn.view-btn:hover {
  background: rgba(255, 255, 255, 0.18);
}

.action-btn.edit-btn {
  background: rgba(212, 175, 55, 0.15);
  border-color: var(--border-gold);
  color: var(--gold-primary);
}

.action-btn.edit-btn:hover {
  background: var(--gold-primary);
  color: #000;
}

.action-btn.delete-btn {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.action-btn.delete-btn:hover {
  background: #ef4444;
  color: #fff;
}

.action-btn.assign-btn {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.4);
  color: #60a5fa;
}

.action-btn.assign-btn:hover {
  background: #3b82f6;
  color: #fff;
}

/* Status Pills for Articles */
.status-published-pill {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}

.btn-toggle-status {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.72rem;
  cursor: pointer;
  text-decoration: underline;
}

.btn-toggle-status:hover {
  color: #ef4444;
}

.status-draft-pill {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #fbbf24;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}

.btn-approve-publish {
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
}

.btn-approve-publish:hover {
  background: #059669;
}

/* Agent Styles */
.agent-avatar-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-gold);
}

.agent-info-cell strong {
  display: block;
  font-size: 0.95rem;
  color: var(--text-main);
}

.agent-role-pill {
  font-size: 0.78rem;
  color: var(--gold-primary);
  margin-top: 2px;
  display: inline-block;
}

.agent-tag {
  display: inline-block;
  margin-left: 6px;
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 1px 6px;
  border-radius: 4px;
}

.agent-contact-cell a {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  text-decoration: none;
  margin-bottom: 2px;
}

.agent-contact-cell .phone-link {
  color: var(--text-main);
  font-weight: 600;
}

.agent-contact-cell .zalo-link {
  color: #0068ff;
  font-weight: 500;
}

.assigned-header {
  font-size: 0.82rem;
  margin-bottom: 4px;
}

.assigned-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.prop-id-badge {
  background: rgba(212, 175, 55, 0.15);
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--gold-primary);
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.deals-badge {
  font-weight: 700;
  color: #10b981;
}

/* Leads Styles */
.lead-time {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.lead-name {
  font-size: 0.9rem;
  color: var(--text-main);
}

.lead-phone-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--gold-primary);
  font-weight: 700;
  text-decoration: none;
}

.demand-pill {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.lead-details {
  font-size: 0.82rem;
  color: var(--text-muted);
  max-width: 320px;
}

/* MODALS */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.admin-modal-card {
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  border-radius: var(--radius-md);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalScale 0.25s ease;
}

@keyframes modalScale {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-header {
  padding: 18px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  font-size: 1.2rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-main);
}

.modal-close-icon {
  background: none;
  border: none;
  font-size: 1.6rem;
  color: var(--text-muted);
  cursor: pointer;
  line-height: 1;
}

.modal-form {
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
}

.modal-body-padded {
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 20px;
}

.form-col-full {
  grid-column: span 2;
}

.modal-form label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text-main);
}

/* UPLOAD BOXES TRONG MODAL */
.upload-section-box {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
}

.upload-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 8px;
}

.upload-title {
  font-weight: 700 !important;
  color: var(--gold-primary) !important;
  margin: 0 !important;
  font-size: 0.88rem !important;
}

.upload-device-tip {
  font-size: 0.75rem;
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 5px;
}

.upload-controls-row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.upload-preview-box {
  width: 90px;
  height: 68px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border-gold);
  background: #000;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-preview-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-preview-text {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.upload-action-inputs {
  flex: 1;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-upload-file {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--gold-gradient);
  color: #000;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  width: fit-content;
  transition: var(--transition);
}

.btn-upload-file.outline {
  background: transparent;
  border: 1px solid var(--border-gold);
  color: var(--gold-primary);
}

.btn-upload-file:hover {
  filter: brightness(1.1);
}

.btn-upload-file.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.gallery-preview-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.gallery-preview-item {
  position: relative;
  width: 70px;
  height: 52px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.gallery-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-gallery-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(239, 68, 68, 0.9);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-hint-note {
  font-size: 0.76rem;
  color: var(--text-muted);
  margin: 6px 0 0;
}

.modal-actions-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

/* Modal Phân Công */
.assign-desc {
  font-size: 0.88rem;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.assign-list-box {
  max-height: 360px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  padding-right: 6px;
}

.assign-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.assign-item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.assign-checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--gold-primary);
  cursor: pointer;
}

.assign-prop-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-main);
}

.assign-prop-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.assign-status-active {
  font-size: 0.75rem;
  font-weight: 700;
  color: #10b981;
}

/* RESPONSIVE CHO ĐIỆN THOẠI & TABLET */
@media (max-width: 992px) {
  .admin-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.7);
  }

  .admin-sidebar.sidebar-open {
    transform: translateX(0);
  }

  .admin-sidebar-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
    z-index: 999;
  }

  .sidebar-close-btn {
    display: block;
  }

  .mobile-toggle-btn {
    display: block;
  }

  .admin-topbar {
    padding: 14px 18px;
  }

  .admin-kpi-grid {
    padding: 16px 18px 0;
    grid-template-columns: 1fr;
  }

  .admin-content-box {
    padding: 16px 18px 40px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-col-full {
    grid-column: span 1;
  }
}

/* Gợi ý khu vực nhanh */
.quick-ward-pills {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}

.quick-pill-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
}

.quick-pill {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 0.72rem;
  cursor: pointer;
  transition: var(--transition);
}

.quick-pill:hover {
  background: rgba(212, 175, 55, 0.15);
  border-color: var(--border-gold);
  color: var(--gold-primary);
}

/* ==================== QUẢN LÝ BANNER CSS ==================== */
.admin-banners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(460px, 1fr));
  gap: 24px;
}

.admin-banner-card {
  display: flex;
  background: var(--bg-card, #0f1c30);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  border-radius: var(--radius-md, 12px);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  transition: var(--transition, all 0.25s ease);
}

.admin-banner-card:hover {
  border-color: var(--gold-primary, #dfb76c);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.admin-banner-card.inactive {
  opacity: 0.65;
  filter: grayscale(0.4);
}

.banner-card-preview {
  position: relative;
  width: 170px;
  min-height: 280px;
  flex-shrink: 0;
  background: #070e1b;
}

.banner-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
}

.banner-preview-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 3px 7px;
  border-radius: 4px;
  background: rgba(239, 68, 68, 0.9);
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 4px;
}

.banner-preview-badge.active {
  background: rgba(16, 185, 129, 0.9);
}

.banner-card-info {
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.banner-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}

.banner-page-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--gold-primary, #dfb76c);
  background: rgba(223, 183, 108, 0.12);
  padding: 3px 8px;
  border-radius: 6px;
}

.banner-pos-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 3px 9px;
  border-radius: 6px;
  letter-spacing: 0.3px;
}

.banner-pos-tag.pos-left {
  color: #60a5fa;
  background: rgba(37, 99, 235, 0.18);
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.banner-pos-tag.pos-right {
  color: #c084fc;
  background: rgba(147, 51, 234, 0.18);
  border: 1px solid rgba(168, 85, 247, 0.4);
}

.admin-banner-card.is-right {
  border-left: 3px solid #a855f7;
}

.pos-selector-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.pos-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.pos-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(212, 175, 55, 0.4);
}

.pos-card.active {
  background: rgba(212, 175, 55, 0.1);
  border-color: var(--gold-primary, #dfb76c);
  box-shadow: 0 0 16px rgba(212, 175, 55, 0.2);
}

.pos-card-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.pos-card-content {
  display: flex;
  flex-direction: column;
}

.pos-card-title {
  font-size: 0.9rem;
  color: var(--text-main, #0f172a);
  font-weight: 700;
}

.pos-card.active .pos-card-title {
  color: var(--gold-primary, #dfb76c);
}

.pos-card-sub {
  font-size: 0.75rem;
  color: var(--text-muted, #94a3b8);
}

.pos-card-check {
  margin-left: auto;
  color: var(--gold-primary, #dfb76c);
  font-size: 1.1rem;
}

.banner-card-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
  margin: 0;
}

.banner-toggle-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-text {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-muted, #94a3b8);
}

.banner-props-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.82rem;
  margin-bottom: 18px;
}

.bprop-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  border-bottom: 1px dashed var(--border-color, rgba(0, 0, 0, 0.08));
  padding-bottom: 5px;
}

.bprop-label {
  color: var(--text-muted, #94a3b8);
  font-size: 0.78rem;
}

.bprop-val {
  color: var(--text-main, #0f172a);
  font-weight: 600;
  text-align: right;
}

.badge-chip {
  background: rgba(223, 183, 108, 0.15);
  color: var(--gold-primary, #dfb76c);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 800;
}

.link-val {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.banner-card-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-admin-preview {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-secondary, rgba(0, 0, 0, 0.04));
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.12));
  color: var(--text-main, #0f172a);
  padding: 7px 12px;
  border-radius: var(--radius-sm, 6px);
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition, all 0.2s ease);
}

.btn-admin-preview:hover {
  background: var(--gold-primary, #dfb76c);
  color: #fff;
  border-color: var(--gold-primary, #dfb76c);
}

/* SWITCH TOGGLE */
.switch-toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #475569;
  transition: 0.3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #10b981;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

/* QUICK WARD PILLS */
.quick-ward-pills {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
.quick-pill-label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}
.quick-pill {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  font-size: 0.72rem;
  padding: 3px 9px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.quick-pill:hover {
  background: rgba(212, 163, 89, 0.2);
  border-color: var(--gold-primary, #d4a359);
  color: #fef08a;
  transform: translateY(-1px);
}

/* USER & STAR TOGGLE CSS */
.btn-star-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-muted);
}

.btn-star-toggle:hover {
  transform: translateY(-1px);
  border-color: var(--gold-primary);
  color: #fff;
}

.btn-star-toggle.is-starred {
  background: rgba(212, 175, 55, 0.18);
  border-color: var(--border-gold);
  color: #fef08a;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.25);
}

.btn-star-toggle.is-starred i {
  color: var(--gold-primary);
  filter: drop-shadow(0 0 4px rgba(212, 175, 55, 0.6));
}

.user-code-pill {
  font-family: 'Consolas', monospace;
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--gold-primary);
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.25);
  padding: 2px 7px;
  border-radius: 4px;
}

.role-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
}

.role-badge-pill.admin {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.role-badge-pill.manager {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.role-badge-pill.user {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.office-badge-chip {
  font-size: 0.74rem;
  font-weight: 700;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
}
</style>
