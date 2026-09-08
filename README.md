# HỆ THỐNG WEBSITE BẤT ĐỘNG SẢN BẾN THÀNH (BENTHANH REAL ESTATE PLATFORM)

> **Mô hình kiến trúc:** 1 Website Tổng Doanh Nghiệp + Trang Định Danh Cá Nhân Cho Từng Chuyên Viên (`/nhan-vien/[slug]`) + Bảng Điều Khiển Quản Trị Admin CMS (Phân công BĐS, Quản lý Tin Đăng & Khách Hàng Leads).

---

## 🛠️ CÔNG NGHỆ CHỐT TRIỂN KHAI (TECH STACK)

| Thành phần | Công nghệ lựa chọn | Lý do & Ưu điểm vượt trội |
| :--- | :--- | :--- |
| **Frontend (FE)** | **Nuxt.js (Nuxt 3 / Vue 3)** | Hỗ trợ **Server-Side Rendering (SSR)** cực mạnh, chuẩn SEO Google số 1 cho các bài đăng BĐS, tốc độ tải trang tức thì, cú pháp Vue 3 thanh thoát. |
| **Backend (BE)** | **Node.js (Nuxt Nitro Engine / Express API)** | Xử lý RESTful API siêu tốc, nhẹ, hỗ trợ Server Routes tích hợp sẵn không cần chạy riêng 2 server phức tạp. |
| **Database (DB)** | **SQLite (Kết hợp Prisma ORM)** | File-based Database: Nhẹ, tốc độ truy vấn cực nhanh, không tốn tài nguyên cài đặt server DB cồng kềnh, sao lưu dữ liệu chỉ bằng 1 file `.db`. |
| **Styling & Theme** | **Modern Luxury CSS (Dark / Light)** | Hỗ trợ chuyển đổi giao diện **Sáng thanh lịch / Tối sang trọng**, màu vàng kim (Gold Gradient) chuẩn đẳng cấp BĐS Quận 1. |
| **Automation** | **Telegram Bot API** | Bắn tin nhắn đổ chuông ngay trên điện thoại của Sales khi khách vừa bấm gửi form. |

---

## 🏛️ KIẾN TRÚC CƠ SỞ DỮ LIỆU (SQLITE SCHEMA)

```sql
-- 1. Bảng Nhân Viên (Agents)
CREATE TABLE agents (
    id TEXT PRIMARY KEY,               -- tuankiet, vantam, minhduc...
    name TEXT NOT NULL,                -- Ngô Tuấn Kiệt
    role TEXT NOT NULL,                -- Chuyên Viên Nhà Phố & Tòa Nhà Q.1
    phone TEXT NOT NULL,               -- 0901234567
    phone_display TEXT,                -- 0901.234.567
    zalo TEXT,                         -- https://zalo.me/0901234567
    avatar TEXT,                       -- URL ảnh chân dung vest
    exp TEXT,                          -- 6+ Năm
    deals TEXT,                        -- 135+ Căn
    slogan TEXT,                       -- Tận Tâm - Minh Bạch - Đầu Tư Triệu Đô
    bio TEXT,                          -- Giới thiệu kinh nghiệm
    tag TEXT DEFAULT 'Chuyên Viên',    -- Top Producer, Leader...
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Danh Mục BĐS (Categories)
CREATE TABLE categories (
    id TEXT PRIMARY KEY,               -- nha-pho, can-ho, mat-bang, khach-san
    name TEXT NOT NULL,                -- Nhà phố trung tâm, Căn hộ cao cấp...
    description TEXT
);

-- 3. Bảng Bất Động Sản (Properties)
CREATE TABLE properties (
    id TEXT PRIMARY KEY,               -- BT-01, BT-02...
    agent_id TEXT REFERENCES agents(id),-- Nhân viên được phân công bán
    category_id TEXT REFERENCES categories(id),
    title TEXT NOT NULL,               -- Mặt Tiền CMT8, P. Bến Thành...
    location TEXT NOT NULL,            -- Địa chỉ cụ thể
    price TEXT NOT NULL,               -- 38.5 Tỷ
    price_raw REAL NOT NULL,           -- 38.5 (để lọc theo số)
    area TEXT NOT NULL,                -- 112 m²
    dimensions TEXT,                   -- 4.8m x 23.5m
    structure TEXT,                    -- 1 Hầm 5 Tầng Thang máy
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    direction TEXT,                    -- Đông Nam
    legal TEXT,                        -- Sổ hồng hoàn công
    rent_income TEXT,                  -- Đang có HĐ thuê 85tr/tháng
    badge TEXT DEFAULT 'Đang Bán',     -- Hàng Hiếm, Giá Ngộp, Độc Quyền
    image TEXT NOT NULL,               -- URL ảnh đại diện
    features TEXT,                     -- JSON array các tiện ích
    description TEXT,                  -- Mô tả chi tiết
    status TEXT DEFAULT 'available',   -- available / deposited / sold
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bảng Khách Hàng Tiềm Năng (Leads)
CREATE TABLE leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT REFERENCES agents(id),-- Lead thuộc về nhân viên nào
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    demand TEXT,                       -- Mua ở, Đầu tư, Ký gửi
    budget TEXT,                       -- Dưới 20 Tỷ, 20-50 Tỷ...
    property_interest TEXT,            -- Căn quan tâm hoặc địa chỉ ký gửi
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bảng Quản Trị Viên (Users / Admins)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin'
);
```

---

## 💎 CÁC PHÂN HỆ TÍNH NĂNG CHÍNH

### 1. Phân Hệ Người Dùng (Khách Hàng)
* **Web Tổng Sàn Bến Thành (`/`):**
  * **Master Hero:** Nổi bật thương hiệu sàn BĐS Quận 1, nền ảnh sắc nét không bị đổi màu khi chuyển theme.
  * **Bộ Lọc Tìm Kiếm:** Tìm kiếm tức thì theo từ khóa tên đường, phân loại BĐS và khoảng giá.
  * **Kho Giỏ Hàng Tổng Hợp:** Phân loại theo tab (Nhà phố, Căn hộ, Tòa nhà/Mặt bằng, Khách sạn).
  * **Xem Chi Tiết Căn Hộ:** Xem pháp lý, dòng tiền cho thuê, kích thước, ảnh thực tế.
  * **Ký Gửi Nhà Đất:** Form dành cho chủ nhà gửi thông tin bán nhanh.
* **Trang Cá Nhân Chuyên Viên (`/nhan-vien/[id]`):**
  * Hiển thị nhận diện thương hiệu cá nhân của sales (Avatar, Slogan, Hotline, Zalo).
  * **Chỉ hiển thị những BĐS do chuyên viên này được phân công phụ trách.**
  * Nút gọi trực tiếp & nút chat Zalo của riêng chuyên viên đó.
  * Nút sao chép link trang cá nhân để sales gửi đi chạy ads hoặc tư vấn khách.
* **Tính Năng Trải Nghiệm:**
  * Chuyển đổi giao diện **Sáng / Tối (Dark & Light Theme)** lưu trạng thái người dùng.
  * Nút gọi Hotline & Zalo luôn ghim góc màn hình.

### 2. Phân Hệ Quản Trị (Admin CMS)
* **Đăng Nhập Quản Trị:** Đăng nhập an toàn bằng tài khoản Admin.
* **Quản Lý Bất Động Sản (CRUD):**
  * Đăng tin BĐS mới với đầy đủ thông số kỹ thuật, giá, ảnh và pháp lý.
  * Sửa thông tin, cập nhật trạng thái (Còn hàng / Đã cọc / Đã bán).
  * Xóa tin đăng BĐS.
* **Quản Lý Nhân Viên & Phân Công Dự Án:**
  * Thêm/Sửa/Xóa thông tin nhân viên (Tên, SĐT, Zalo, Avatar, Slogan, Chức vụ).
  * **Tính năng Giao Căn (Phân công dự án):** Bật bảng danh sách chọn checkbox những căn nhà giao cho nhân viên đó phụ trách.
* **Quản Lý Khách Hàng (Leads):**
  * Quản lý danh sách khách hàng để lại SĐT trên web hoặc đăng ký ký gửi.
  * Tự động gửi thông báo về Telegram của sales khi có khách gửi yêu cầu.

---

## 📂 CẤU TRÚC THƯ MỤC DỰ ÁN (NUXT 3 + SQLITE)

```
WebBDS/
├── .nuxt/                        # Nuxt build cache
├── assets/                       # Ảnh, fonts, icon
│   └── css/
│       └── main.css              # Theme CSS (Dark / Light & Gold Luxury)
├── components/                   # Vue Components dùng chung
│   ├── HeaderNav.vue             # Thanh điều hướng & Theme Toggle & Admin Btn
│   ├── HeroSearch.vue            # Hero banner & Bộ lọc tìm kiếm
│   ├── PropertyCard.vue          # Thẻ bất động sản
│   ├── AgentCard.vue             # Thẻ chuyên viên tư vấn
│   ├── PropertyModal.vue         # Modal chi tiết nhà đất
│   ├── ConsignmentForm.vue       # Form ký gửi nhà đất
│   └── AdminDashboardModal.vue   # Bảng điều khiển CMS quản trị
├── composables/                  # Shared state & logic (useTheme, useAuth)
├── layouts/                      # Layout khung (default.vue)
├── pages/                        # File-based Routing của Nuxt
│   ├── index.vue                 # Trang Web Tổng Sàn Bến Thành
│   ├── nhan-vien/
│   │   └── [id].vue              # Trang thương hiệu cá nhân của từng chuyên viên
│   └── admin/                    # Trang CMS quản trị chuyên dụng
│       └── index.vue
├── prisma/                       # Cấu hình SQLite & Schema
│   ├── schema.prisma             # Định nghĩa bảng SQLite
│   └── dev.db                    # File cơ sở dữ liệu SQLite
├── server/                       # Backend Server Routes (Nuxt Nitro Engine)
│   └── api/
│       ├── properties/           # CRUD API cho Bất Động Sản
│       ├── agents/               # CRUD API & phân công cho Nhân Viên
│       ├── leads/                # API tiếp nhận và lưu thông tin khách
│       └── auth/                 # API đăng nhập admin
├── nuxt.config.ts                # Cấu hình Nuxt 3 (SSR, Modules, Meta SEO)
├── package.json                  # Dependencies
└── README.md                     # Tài liệu dự án
```

---

## 🚀 QUY TRÌNH CHUẨN BỊ TRIỂN KHAI CODE

1. **Bước 1:** Khởi tạo project Nuxt 3 sạch với TypeScript và Prisma (SQLite).
2. **Bước 2:** Cài đặt Prisma schema, migrate tạo file cơ sở dữ liệu `prisma/dev.db` và seed dữ liệu mẫu Bến Thành ban đầu.
3. **Bước 3:** Xây dựng Server API (Properties, Agents, Leads, Auth).
4. **Bước 4:** Xây dựng giao diện Nuxt 3 (Trang chủ Web Tổng, Bộ lọc, Trang cá nhân chuyên viên `[id].vue`, Chế độ Sáng/Tối).
5. **Bước 5:** Xây dựng Dashboard Quản trị Admin (Thêm/Sửa/Xóa BĐS, Nhân viên và Phân công dự án).
6. **Bước 6:** Kiểm thử tương tác và hoàn thiện tài liệu bàn giao.
