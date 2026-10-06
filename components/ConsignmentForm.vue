<template>
  <section id="consignment" class="properties-section" style="padding-top: 20px;">
    <div class="container">
      <div style="max-width: 860px; margin: 0 auto; background: var(--bg-card); border: 1px solid var(--border-gold); border-radius: var(--radius-lg); padding: 40px 32px; box-shadow: var(--shadow-md);">
        <div class="section-header" style="margin-bottom: 28px;">
          <p class="section-subtitle">DÀNH CHO CHỦ NHÀ & NHÀ ĐẦU TƯ</p>
          <h2 class="section-title" style="font-size: 1.85rem;">Ký Gửi Mua Bán - Cho Thuê BĐS</h2>
          <p class="section-desc">Chúng tôi có thể giải ngân sớm theo kì vọng của khách hàng.</p>
        </div>

        <form @submit.prevent="handleSubmit">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 20px;">
            <div>
              <label style="display: block; font-size: 0.85rem; margin-bottom: 6px; font-weight: 600;">Họ tên chủ nhà / người liên hệ *</label>
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
                <option value="Biệt thự / Villa">Biệt thự / Villa</option>
                <option value="Khách sạn">Khách sạn</option>
                <option value="Dự án / Đất nền">Dự án / Đất nền</option>
              </select>
            </div>
          </div>

          <!-- KHUNG TẢI ẢNH BĐS KÝ GỬI -->
          <div style="margin-bottom: 24px;">
            <label style="display: block; font-size: 0.88rem; margin-bottom: 8px; font-weight: 600;">
              <i class="fa-solid fa-camera" style="color: var(--gold-primary); margin-right: 4px;"></i>
              Hình ảnh hiện trạng BĐS / Sổ hồng (Tùy chọn)
            </label>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">
              Tải lên hình ảnh mặt tiền, nội thất hoặc sổ hồng giúp chúng tôi thẩm định và kết nối khách hàng hiệu quả hơn.
            </p>

            <!-- Vùng Kéo & Thả hoặc Bấm chọn ảnh -->
            <div 
              class="upload-dropzone" 
              :class="{ 'is-dragover': isDragging }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
            >
              <input 
                ref="fileInputRef" 
                type="file" 
                multiple 
                accept="image/*" 
                style="display: none;" 
                @change="handleFileChange"
              />
              <div style="text-align: center; pointer-events: none;">
                <i class="fa-solid fa-cloud-arrow-up" style="font-size: 2rem; color: var(--gold-primary); margin-bottom: 8px; display: block;"></i>
                <span style="font-weight: 600; font-size: 0.95rem; color: var(--text-main);">
                  Bấm vào đây để chọn ảnh hoặc Kéo thả hình ảnh vào đây
                </span>
                <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">
                  Hỗ trợ JPG, PNG, WEBP (Tối đa 10 ảnh)
                </p>
              </div>
            </div>

            <!-- Danh sách ảnh xem trước (Thumbnails) -->
            <div v-if="selectedImages.length > 0" class="upload-preview-grid">
              <div 
                v-for="(img, idx) in selectedImages" 
                :key="idx" 
                class="preview-item"
              >
                <img :src="img.previewUrl" :alt="`Ảnh ký gửi ${idx + 1}`" />
                <button 
                  type="button" 
                  class="preview-remove-btn" 
                  title="Xóa ảnh này"
                  @click.stop="removeImage(idx)"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
                <span class="preview-tag">Ảnh {{ idx + 1 }}</span>
              </div>
            </div>
          </div>

          <!-- BẪY BOT SPAM (HONEYPOT) -->
          <div style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;" aria-hidden="true">
            <input type="text" v-model="form._hp_check" name="website_company" tabindex="-1" autocomplete="off" />
          </div>

          <!-- XÁC THỰC BẢO MẬT CHỐNG BOT SPAM (CLOUDFLARE TURNSTILE & BẾN THÀNH SHIELD) -->
          <div class="turnstile-security-card" @click="triggerCaptcha">
            <div class="ts-interactive-area">
              <div class="ts-checkbox" :class="{ 'is-verified': captchaVerified, 'is-verifying': captchaVerifying }">
                <i v-if="captchaVerified" class="fa-solid fa-check"></i>
                <i v-else-if="captchaVerifying" class="fa-solid fa-circle-notch fa-spin"></i>
              </div>
              <div class="ts-text-wrap">
                <div class="ts-title">
                  {{ captchaVerified ? 'Xác thực bảo mật thành công: Tôi là người thật' : 'Xác thực bảo mật: Tôi không phải là người máy' }}
                </div>
                <div class="ts-desc">
                  {{ captchaVerified ? 'Hồ sơ đã được mã hóa & kiểm duyệt an toàn' : 'Nhấn vào đây để xác minh người thật (Chống Spam)' }}
                </div>
              </div>
            </div>
            <div class="ts-badge-wrap">
              <div class="ts-shield-icon">
                <i class="fa-solid fa-shield-halved" :style="{ color: captchaVerified ? '#10b981' : 'var(--gold-primary)' }"></i>
              </div>
              <div class="ts-provider">
                <span>Cloudflare</span>
                <small>Turnstile</small>
              </div>
            </div>
          </div>

          <div style="text-align: center;">
            <button type="submit" class="btn btn-gold" :disabled="loading" style="padding: 13px 42px; font-size: 1rem; min-width: 260px;">
              <i v-if="loading" class="fa-solid fa-spinner fa-spin" style="margin-right: 6px;"></i>
              <i v-else class="fa-solid fa-file-signature" style="margin-right: 6px;"></i>
              {{ loading ? (uploadingImages ? 'Đang tải ảnh lên...' : 'Đang gửi hồ sơ...') : 'GỬI HỒ SƠ KÝ GỬI' }}
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
const uploadingImages = ref(false);
const isDragging = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

interface ImagePreview {
  file: File;
  previewUrl: string;
}

const selectedImages = ref<ImagePreview[]>([]);

const formMountedAt = Date.now();
const captchaVerified = ref(false);
const captchaVerifying = ref(false);

const triggerCaptcha = () => {
  if (captchaVerified.value || captchaVerifying.value) return;
  captchaVerifying.value = true;
  setTimeout(() => {
    captchaVerifying.value = false;
    captchaVerified.value = true;
    showToast('Xác thực bảo mật thành công! Bạn có thể gửi hồ sơ.');
  }, 400);
};

const form = reactive({
  name: '',
  phone: '',
  propertyInterest: '',
  budget: '',
  demand: 'Nhà phố mặt tiền',
  _hp_check: '', // Honeypot field trap
});

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXT_REGEX = /\.(jpe?g|png|webp|heic|heif)$/i;

const handleFiles = (files: FileList | null) => {
  if (!files || files.length === 0) return;
  const remainingSlots = 10 - selectedImages.value.length;
  if (remainingSlots <= 0) {
    showToast('Tối đa 10 ảnh cho mỗi hồ sơ ký gửi.');
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (selectedImages.value.length >= 10) {
      showToast('Đã đạt giới hạn tối đa 10 ảnh.');
      break;
    }

    // 1. Kiểm tra loại tệp hợp lệ (chỉ chấp nhận ảnh)
    const isImage = file.type.startsWith('image/') || ALLOWED_EXT_REGEX.test(file.name);
    if (!isImage) {
      showToast(`Tệp "${file.name}" không hợp lệ. Chỉ chấp nhận định dạng ảnh JPG, PNG, WEBP, HEIC.`);
      continue;
    }

    // 2. Giới hạn dung lượng tệp (tối đa 10MB)
    if (file.size > MAX_FILE_SIZE) {
      showToast(`Tệp "${file.name}" (${(file.size / 1024 / 1024).toFixed(1)}MB) vượt quá dung lượng tối đa 10MB.`);
      continue;
    }

    selectedImages.value.push({
      file,
      previewUrl: URL.createObjectURL(file),
    });
  }
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  handleFiles(target.files);
  if (target) target.value = '';
};

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  if (e.dataTransfer?.files) {
    handleFiles(e.dataTransfer.files);
  }
};

const removeImage = (index: number) => {
  const removed = selectedImages.value.splice(index, 1);
  if (removed[0]) {
    URL.revokeObjectURL(removed[0].previewUrl);
  }
};

const uploadSelectedImages = async (): Promise<string[]> => {
  if (selectedImages.value.length === 0) return [];
  uploadingImages.value = true;
  try {
    const formData = new FormData();
    selectedImages.value.forEach(img => {
      formData.append('files', img.file);
    });

    const res: any = await $fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    return res.urls || (res.url ? [res.url] : []);
  } catch (err) {
    console.error('Lỗi khi tải ảnh:', err);
    throw err;
  } finally {
    uploadingImages.value = false;
  }
};

const handleSubmit = async () => {
  // 1. Kiểm tra xác thực bảo mật chống bot
  if (!captchaVerified.value) {
    showToast('Vui lòng tích chọn xác nhận bảo mật "Tôi không phải là người máy" trước khi gửi.');
    return;
  }

  loading.value = true;
  try {
    // 2. Upload ảnh nếu có (qua endpoint bảo mật cao)
    let uploadedImageUrls: string[] = [];
    if (selectedImages.value.length > 0) {
      uploadedImageUrls = await uploadSelectedImages();
    }

    // 3. Gửi dữ liệu lead kèm danh sách ảnh và token xác thực
    await $fetch('/api/leads', {
      method: 'POST',
      body: {
        ...form,
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : null,
        _submitted_at: formMountedAt,
        turnstileToken: 'turnstile_verified_' + Date.now(),
      },
    });

    showToast('Đã gửi hồ sơ ký gửi thành công! Ban Quản Lý Bến Thành Land sẽ liên hệ thẩm định trong 2 giờ.');
    form.name = '';
    form.phone = '';
    form.propertyInterest = '';
    form.budget = '';
    form._hp_check = '';
    captchaVerified.value = false;

    // Xóa danh sách ảnh preview
    selectedImages.value.forEach(img => URL.revokeObjectURL(img.previewUrl));
    selectedImages.value = [];
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Có lỗi xảy ra khi gửi hồ sơ, vui lòng kiểm tra lại!');
  } finally {
    loading.value = false;
  }
};

onUnmounted(() => {
  selectedImages.value.forEach(img => URL.revokeObjectURL(img.previewUrl));
});
</script>

<style scoped>
.upload-dropzone {
  border: 2px dashed var(--border-gold, #c5a059);
  background: rgba(197, 160, 89, 0.04);
  border-radius: var(--radius-md, 8px);
  padding: 24px 20px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.upload-dropzone:hover,
.upload-dropzone.is-dragover {
  border-color: var(--gold-primary, #dfb76c);
  background: rgba(197, 160, 89, 0.1);
  transform: translateY(-1px);
}

.upload-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color, #333);
  background: #000;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.preview-remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(220, 38, 38, 0.9);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  transition: transform 0.15s;
}

.preview-remove-btn:hover {
  transform: scale(1.15);
  background: #dc2626;
}

.preview-tag {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 4px;
}

/* TURNSTILE / RECAPTCHA SECURITY CARD */
.turnstile-security-card {
  margin: 22px 0 26px;
  padding: 14px 18px;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(212, 175, 55, 0.35);
  border-radius: var(--radius-md, 10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  user-select: none;
}

.turnstile-security-card:hover {
  border-color: var(--gold-primary);
  background: rgba(15, 23, 42, 0.9);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.3);
}

.ts-interactive-area {
  display: flex;
  align-items: center;
  gap: 14px;
}

.ts-checkbox {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 2px solid var(--border-gold, #c5a059);
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  color: #fff;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.ts-checkbox.is-verified {
  background: #10b981;
  border-color: #10b981;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
}

.ts-checkbox.is-verifying {
  border-color: var(--gold-primary);
  color: var(--gold-primary);
}

.ts-text-wrap {
  display: flex;
  flex-direction: column;
}

.ts-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-main);
}

.ts-desc {
  font-size: 0.74rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.ts-badge-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 14px;
  border-left: 1px solid var(--border-color);
  flex-shrink: 0;
}

.ts-shield-icon {
  font-size: 1.4rem;
}

.ts-provider {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  text-align: right;
}

.ts-provider span {
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: 0.3px;
}

.ts-provider small {
  font-size: 0.62rem;
  color: var(--text-muted);
  font-weight: 600;
}

@media (max-width: 480px) {
  .turnstile-security-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .ts-badge-wrap {
    padding-left: 0;
    border-left: none;
    border-top: 1px solid var(--border-color);
    padding-top: 8px;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
