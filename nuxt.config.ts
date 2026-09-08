// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  ssr: false,

  app: {
    head: {
      htmlAttrs: {
        lang: 'vi',
      },
      title: 'Bất Động Sản Bến Thành - Phân Phối & Môi Giới Nhà Đất Cao Cấp Quận 1',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sàn giao dịch Bất Động Sản Bến Thành - Nhà phố mặt tiền, tòa nhà văn phòng, căn hộ siêu sang, khách sạn du lịch trung tâm Quận 1.' },
        { property: 'og:title', content: 'Bất Động Sản Bến Thành - Central District 1 Luxury Real Estate' },
        { property: 'og:description', content: 'Quỹ căn độc quyền, pháp lý chuẩn 100%, thương lượng giá trực tiếp chủ nhà.' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' }
      ]
    }
  },

  css: ['~/assets/css/main.css']
});
