// Apple-Style Smooth Animation on Scroll (AOS) for Nuxt 3
// Chuẩn phong cách Apple: Mượt mà, chống giật, tự động bắt tất cả dữ liệu tải động (useFetch)

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window === 'undefined') return;

  const SELECTORS = [
    '[data-aos]',
    '.prop-card',
    '.agent-card',
    '.member-card',
    '.home-art-card',
    '.team-member-card',
    '.detail-section-card',
    '.stat-card',
    '.feature-box',
    '.section-header',
  ].join(', ');

  let observer: IntersectionObserver | null = null;
  let mutationObserver: MutationObserver | null = null;

  // Hàm kiểm tra xem phần tử có đang nằm trong tầm nhìn màn hình không
  const isElementInView = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top <= windowHeight * 0.95 && rect.bottom >= -50;
  };

  const processElement = (el: HTMLElement) => {
    if (el.classList.contains('aos-animate')) return;

    // Nếu phần tử đã nằm trong màn hình ngay lúc load -> hiển thị ngay lập tức
    if (isElementInView(el)) {
      requestAnimationFrame(() => {
        el.classList.add('aos-animate');
      });
      return;
    }

    // Nếu chưa vào màn hình, gán vào IntersectionObserver
    observer?.observe(el);
  };

  const scanAndObserve = () => {
    const elements = document.querySelectorAll(SELECTORS);
    elements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      // Stagger delay nhẹ kiểu Apple
      if (!htmlEl.dataset.aosDelay && htmlEl.parentElement) {
        const parent = htmlEl.parentElement;
        if (
          parent.classList.contains('properties-grid') ||
          parent.classList.contains('properties-grid-full') ||
          parent.classList.contains('agents-grid') ||
          parent.classList.contains('home-insights-grid') ||
          parent.classList.contains('team-grid')
        ) {
          const idx = Array.from(parent.children).indexOf(htmlEl);
          if (idx >= 0) {
            htmlEl.style.transitionDelay = `${(idx % 4) * 70}ms`;
          }
        }
      }
      processElement(htmlEl);
    });
  };

  const initAOS = () => {
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLElement;
              target.classList.add('aos-animate');
              observer?.unobserve(target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -30px 0px', // Nhận diện sớm trước khi cuộn hẳn vào
          threshold: 0.05,
        }
      );
    }

    // Quét lần đầu
    scanAndObserve();

    // Dùng MutationObserver để TỰ ĐỘNG nhận diện khi Vue render thêm nhà đất sau khi tải API
    if ('MutationObserver' in window && !mutationObserver) {
      mutationObserver = new MutationObserver(() => {
        scanAndObserve();
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    // Dự phòng khi người dùng cuộn nhanh (Fallback Scroll Listener)
    let scrollTicking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (!scrollTicking) {
          requestAnimationFrame(() => {
            const unrevealed = document.querySelectorAll(
              '.prop-card:not(.aos-animate), .agent-card:not(.aos-animate), .home-art-card:not(.aos-animate)'
            );
            unrevealed.forEach((el) => {
              if (isElementInView(el as HTMLElement)) {
                (el as HTMLElement).classList.add('aos-animate');
              }
            });
            scrollTicking = false;
          });
          scrollTicking = true;
        }
      },
      { passive: true }
    );

    // Safeguard timeout: Sau 800ms, nếu có phần tử nào chưa kịp animate, tự động bật hiện để không bao giờ bị mất nội dung
    setTimeout(() => {
      document.querySelectorAll(SELECTORS).forEach((el) => {
        if (isElementInView(el as HTMLElement)) {
          (el as HTMLElement).classList.add('aos-animate');
        }
      });
    }, 800);
  };

  nuxtApp.hook('app:mounted', () => {
    setTimeout(initAOS, 50);
  });

  nuxtApp.hook('page:finish', () => {
    setTimeout(scanAndObserve, 80);
  });
});
