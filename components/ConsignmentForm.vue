<template>
  <section id="consignment" class="properties-section" style="padding-top: 20px;">
    <div class="container">
      <div style="max-width: 860px; margin: 0 auto; background: var(--bg-card); border: 1px solid var(--border-gold); border-radius: var(--radius-lg); padding: 40px 32px; box-shadow: var(--shadow-md);">
        <div class="section-header" style="margin-bottom: 28px;">
          <p class="section-subtitle">DÀNH CHO CHỦ NHÀ & NHÀ ĐẦU TƯ</p>
          <h2 class="section-title" style="font-size: 1.85rem;">Ký Gửi Mua Bán - Cho Thuê BĐS</h2>
          <p class="section-desc">Chúng tôi có sẵn tệp khách VIP sẵn sàng giải ngân trong 7 ngày cho các BĐS định giá hợp lý.</p>
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

const form = reactive({
  name: '',
  phone: '',
  propertyInterest: '',
  budget: '',
  demand: 'Nhà phố mặt tiền'
});

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFiles = (files: FileList | null) => {
  if (!files || files.length === 0) return;
  const remainingSlots = 10 - selectedImages.value.length;
  if (remainingSlots <= 0) {
    showToast('Tối đa 10 ảnh cho mỗi hồ sơ ký gửi.');
    return;
  }

  const validFiles = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, remainingSlots);
  for (const file of validFiles) {
    selectedImages.value.push({
      file,
      previewUrl: URL.createObjectURL(file)
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
  loading.value = true;
  try {
    // 1. Upload ảnh nếu có
    let uploadedImageUrls: string[] = [];
    if (selectedImages.value.length > 0) {
      uploadedImageUrls = await uploadSelectedImages();
    }

    // 2. Gửi dữ liệu lead kèm danh sách ảnh
    await $fetch('/api/leads', {
      method: 'POST',
      body: {
        ...form,
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : null,
      },
    });

    showToast('Đã gửi hồ sơ ký gửi thành công! Ban Quản Lý Bến Thành Land sẽ liên hệ thẩm định trong 2 giờ.');
    form.name = '';
    form.phone = '';
    form.propertyInterest = '';
    form.budget = '';
    // Xóa danh sách ảnh preview
    selectedImages.value.forEach(img => URL.revokeObjectURL(img.previewUrl));
    selectedImages.value = [];
  } catch (err) {
    showToast('Có lỗi xảy ra khi gửi hồ sơ, vui lòng thử lại!');
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
</style>
