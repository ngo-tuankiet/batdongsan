// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  telemetry: false,
  ssr: false,

  app: {
    head: {
      htmlAttrs: {
        lang: 'vi',
        'data-theme': 'light'
      },
      title: 'Bến Thành Land | Hệ Thống Môi Giới BĐS Hàng Đầu Quận 11 & Dự Án Vinhomes',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Bến Thành Land - Nắm giữ quỹ căn độc quyền nhà phố mặt tiền Quận 11, các dự án Vinhomes Cần Giờ & Vinhomes Hóc Môn. Pháp lý hoàn công chuẩn 100%, kết nối trực tiếp chủ nhà. Hotline: 0912.131.329.' },
        { name: 'keywords', content: 'bến thành land, benthanhland, benthanhland.com, bất động sản quận 11, nhà phố quận 11, vinhome cần giờ, vinhome hóc môn, ký gửi nhà đất, mua bán nhà đất quận 11' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'author', content: 'Bến Thành Land' },
        { name: 'google-site-verification', content: 'diejq2SNMsrvRmK-_2-v35plw7oRcg9okECJwaZD0zI' },

        // OpenGraph / Facebook / Zalo
        { property: 'og:site_name', content: 'Bến Thành Land' },
        { property: 'og:title', content: 'Bến Thành Land | Hệ Thống Môi Giới BĐS Hàng Đầu Quận 11 & Dự Án Vinhomes' },
        { property: 'og:description', content: 'Nắm giữ quỹ căn độc quyền nhà phố mặt tiền Quận 11, các dự án Vinhomes Cần Giờ & Vinhomes Hóc Môn. Hotline: 0912.131.329.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://benthanhland.com/' },
        { property: 'og:image', content: 'https://benthanhland.com/images/hero-vinhome-cangio.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'vi_VN' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Bến Thành Land | Môi Giới BĐS Hàng Đầu Quận 11 & Dự Án Vinhomes' },
        { name: 'twitter:description', content: 'Quỹ căn độc quyền nhà phố mặt tiền Quận 11, các dự án Vinhomes Cần Giờ & Vinhomes Hóc Môn. Hotline: 0912.131.329.' },
        { name: 'twitter:image', content: 'https://benthanhland.com/images/hero-vinhome-cangio.jpg' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'canonical', href: 'https://benthanhland.com/' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' }
      ],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateAgent',
            name: 'Bến Thành Land',
            image: 'https://benthanhland.com/images/hero-vinhome-cangio.jpg',
            '@id': 'https://benthanhland.com/#organization',
            url: 'https://benthanhland.com',
            telephone: '0912131329',
            priceRange: '$$$$',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Số 6 Đường số 5A, Phường Bình Thới',
              addressLocality: 'Thành phố Hồ Chí Minh',
              addressRegion: 'Thành phố Hồ Chí Minh',
              addressCountry: 'VN'
            },
            areaServed: ['Quận 11', 'Quận 1', 'Cần Giờ', 'Hóc Môn', 'Thành phố Hồ Chí Minh'],
            description: 'Hệ thống môi giới bất động sản hàng đầu Quận 11 và các dự án Vinhomes Cần Giờ, Vinhomes Hóc Môn.'
          })
        }
      ]
    }
  },

  css: ['~/assets/css/main.css']
});
