<template>
  <section id="consignment" class="properties-section" style="padding-top: 20px;">
    <div class="container">
      <div style="max-width: 820px; margin: 0 auto; background: var(--bg-card); border: 1px solid var(--border-gold); border-radius: var(--radius-lg); padding: 40px 30px; box-shadow: var(--shadow-md);">
        <div class="section-header" style="margin-bottom: 25px;">
          <p class="section-subtitle">DÀNH CHO CHỦ NHÀ</p>
          <h2 class="section-title" style="font-size: 1.8rem;">Ký Gửi Mua Bán - Cho Thuê Nhanh BĐS</h2>
          <p class="section-desc">Chúng tôi có sẵn tệp khách VIP sẵn sàng giải ngân trong 7 ngày cho các BĐS định giá hợp lý.</p>
        </div>

        <form @submit.prevent="handleSubmit">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 20px;">
            <div>
              <label style="display: block; font-size: 0.85rem; margin-bottom: 6px; font-weight: 600;">Họ tên chủ nhà *</label>
              <input v-model="form.name" type="text" class="filter-input" placeholder="Ví dụ: Anh Nguyễn Văn Tâm" required>
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; margin-bottom: 6px; font-weight: 600;">Số điện thoại liên hệ *</label>
              <input v-model="form.phone" type="tel" class="filter-input" placeholder="Ví dụ: 0938 888 999" required>
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 0.85rem; margin-bottom: 6px; font-weight: 600;">Địa chỉ Bất Động Sản cần ký gửi *</label>
              <input v-model="form.propertyInterest" type="text" class="filter-input" placeholder="Ví dụ: Số 88 Lý Tự Trọng, P. Bến Thành, Q.1" required>
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; margin-bottom: 6px; font-weight: 600;">Mức giá mong muốn</label>
              <input v-model="form.budget" type="text" class="filter-input" placeholder="Ví dụ: 35 Tỷ hoặc 70tr/tháng">
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; margin-bottom: 6px; font-weight: 600;">Loại hình BĐS</label>
              <select v-model="form.demand" class="filter-select">
                <option value="Nhà phố mặt tiền">Nhà phố mặt tiền</option>
                <option value="Nhà hẻm xe hơi">Nhà hẻm xe hơi</option>
                <option value="Căn hộ cao cấp">Căn hộ cao cấp</option>
                <option value="Tòa nhà văn phòng">Tòa nhà văn phòng</option>
                <option value="Khách sạn">Khách sạn</option>
              </select>
            </div>
          </div>

          <div style="text-align: center;">
            <button type="submit" class="btn btn-gold" :disabled="loading" style="padding: 13px 40px; font-size: 1rem;">
              <i class="fa-solid fa-file-signature"></i> {{ loading ? 'Đang gửi...' : 'GỬI HỒ SƠ KÝ GỬI' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { showToast } = useToast();
const loading = ref(false);

const form = reactive({
  name: '',
  phone: '',
  propertyInterest: '',
  budget: '',
  demand: 'Nhà phố mặt tiền'
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    await $fetch('/api/leads', {
      method: 'POST',
      body: form,
    });
    showToast('Đã gửi hồ sơ ký gửi thành công! Ban Quản Lý Sàn Bến Thành sẽ liên hệ thẩm định trong 2 giờ.');
    form.name = '';
    form.phone = '';
    form.propertyInterest = '';
    form.budget = '';
  } catch (err) {
    showToast('Có lỗi xảy ra, vui lòng thử lại!');
  } finally {
    loading.value = false;
  }
};
</script>
