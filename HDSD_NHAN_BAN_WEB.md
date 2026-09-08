# HƯỚNG DẪN NHÂN BẢN & TRIỂN KHAI WEB BÁN HÀNG CÁ NHÂN (BĐS BẾN THÀNH)

> **Mục tiêu:** Giúp bất kỳ anh em sales nào (kể cả không biết lập trình) cũng có thể tự tạo cho mình 1 website bán hàng cá nhân hóa chuẩn Luxury trong vòng **3 phút**, và cài đặt nhận tin nhắn khách hàng (Lead) đổ chuông ngay trên điện thoại qua Telegram.

---

## 🚀 BƯỚC 1: NHÂN BẢN THƯ MỤC TEMPLATE (1 PHÚT)

1. Mở thư mục dự án `WebBDS`.
2. Sao chép (Copy & Paste) thư mục `personal-template` và đổi tên thành tên của bạn:
   - *Ví dụ:* `web-tuankiet`, `web-vantam`, `web-minhduc`...
3. Mở file `config/profile.json` trong thư mục vừa tạo bằng bất kỳ phần mềm ghi chú nào (Notepad, VS Code, Cursor...).

---

## 📝 BƯỚC 2: THAY ĐỔI THÔNG TIN CỦA BẠN (1 PHÚT)

Chỉ cần sửa các dòng chữ trong dấu ngoặc kép `""` trong file `config/profile.json`:

```json
{
  "agent": {
    "name": "Ngô Tuấn Kiệt",                          // Họ tên của bạn
    "title": "Chuyên Viên Tư Vấn BĐS Bến Thành",      // Chức danh
    "agency": "Bất Động Sản Bến Thành",               // Đơn vị
    "phone": "0901234567",                            // SĐT để khách bấm gọi
    "phone_display": "0901.234.567",                  // SĐT hiển thị đẹp mắt
    "zalo": "https://zalo.me/0901234567",             // Link Zalo của bạn (thay số vào)
    "email": "tuankiet.bdsbenthanh@gmail.com",        // Email
    "avatar": "https://link-anh-cua-ban.jpg",         // Link ảnh chân dung vest
    "slogan": "Tận Tâm - Minh Bạch - Đầu Tư Hiệu Quả",// Slogan cá nhân
    "bio": "Đoạn văn ngắn giới thiệu kinh nghiệm..."
  },
  "properties": [
    // Danh sách các căn nhà/căn hộ bạn muốn bán (ảnh, giá, diện tích, vị trí)
  ]
}
```

---

## 🔔 BƯỚC 3: CẤU HÌNH BẮN TIN NHẮN LEAD VỀ TELEGRAM (1 PHÚT)
*(Khách vừa bấm "Gửi yêu cầu" trên web thì điện thoại bạn đổ chuông thông báo ngay lập tức!)*

1. Mở ứng dụng **Telegram** trên điện thoại:
   - Tìm kiếm bot: `@BotFather`
   - Nhắn tin: `/newbot`
   - Nhập tên Bot (Ví dụ: `Kiệt BĐS Bến Thành`)
   - Nhập username kết thúc bằng chữ `bot` (Ví dụ: `tuankiet_bds_bot`)
   - BotFather sẽ gửi cho bạn một đoạn **HTTP API Token** (Ví dụ: `7123456789:AAFxAbcDeFgHiJk...`).
2. Tìm bot thứ hai trên Telegram: `@userinfobot`
   - Bấm **Start**, bot sẽ trả về số **Id** của bạn (Ví dụ: `123456789`).
3. Mở lại file `profile.json`, dán vào mục `lead_config`:
   ```json
   "lead_config": {
     "telegram_enabled": true,
     "telegram_bot_token": "DÁN_TOKEN_VÀO_ĐÂY",
     "telegram_chat_id": "DÁN_ID_VÀO_ĐÂY"
   }
   ```
4. Bấm Start con bot vừa tạo trên Telegram của bạn một lần để kích hoạt. 👉 **Từ nay về sau, có khách điền form là điện thoại bạn rung chuông kèm SĐT khách ngay!**

---

## 🌐 BƯỚC 4: ĐƯA WEBSITE LÊN MẠNG (MIỄN PHÍ 100%)

Cách đơn giản và chuyên nghiệp nhất (giống như cách anh Tâm đang làm với Netlify):

1. Truy cập trang: [https://app.netlify.com/drop](https://app.netlify.com/drop) (hoặc đăng nhập Netlify).
2. Kéo toàn bộ thư mục web của bạn (thư mục chứa file `index.html`) thả thẳng vào vòng tròn trên trang web Netlify.
3. Chờ 5 - 10 giây, Netlify sẽ cấp cho bạn một đường link hoạt động toàn cầu, ví dụ: `tuankiet-bdsbenthanh.netlify.app`.
4. Bạn có thể bấm vào mục **Site settings $\rightarrow$ Change site name** để đổi link cho đẹp, hoặc gắn tên miền riêng nếu bạn có mua domain riêng.

---

## 🔗 BƯỚC 5: KẾT NỐI VÀO WEB TỔNG CỦA CÔNG TY

Để tên bạn và link web cá nhân xuất hiện trong mục **"Đội Ngũ Chuyên Viên"** trên Web Tổng:
1. Mở file `web-tong/js/main.js`.
2. Thêm thông tin của bạn vào danh sách `AGENTS_LIST`:
   ```javascript
   {
     id: "tuankiet",
     name: "Ngô Tuấn Kiệt",
     role: "Chuyên Viên Nhà Phố & Tòa Nhà Q.1",
     avatar: "https://link-anh-cua-ban.jpg",
     phone: "0901.234.567",
     exp: "6+ Năm",
     deals: "135+ Căn",
     landingUrl: "https://tuankiet-bdsbenthanh.netlify.app", // Link web cá nhân của bạn
     tag: "Top Producer"
   }
   ```

---

> 💡 **Chúc toàn thể anh em BĐS Bến Thành bùng nổ doanh số và chốt thật nhiều giao dịch triệu đô!**
