<template>
  <div class="demo-page-root" :data-theme="currentTheme">
    <!-- Background Animated Canvas -->
    <canvas ref="particleCanvas" class="particle-canvas"></canvas>
    <div class="ambient-glow" :style="ambientGlowStyle"></div>

    <!-- Custom Cursor -->
    <div class="cursor-dot" :style="{ left: mouseX + 'px', top: mouseY + 'px' }"></div>
    <div 
      class="cursor-ring" 
      :class="{ active: isHoveringInteractive }"
      :style="{ left: ringX + 'px', top: ringY + 'px' }"
    ></div>

    <div class="wrapper">
      <!-- Navbar Header -->
      <header class="nav-header">
        <div class="brand-pill" @click="triggerShockwave" title="Click để kích hoạt sóng xung kích">
          <span class="brand-badge"></span>
          <span>KINETIC MOTION LAB (DEMO)</span>
        </div>

        <div class="nav-actions">
          <button class="glass-btn" @click="toggleSound">
            <span>{{ soundEnabled ? '🔊' : '🔇' }}</span>
            <span>Âm thanh: {{ soundEnabled ? 'Bật' : 'Tắt' }}</span>
          </button>
          <NuxtLink to="/" class="glass-btn">
            <span>🏠 Về Web BĐS Gốc</span>
          </NuxtLink>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="hero-section">
        <div class="tag-bubble">
          <span>✨ BẢN DEMO HOẠT ẢNH & KINETIC UI RIÊNG BIỆT</span>
        </div>

        <h1 class="hero-title">
          Khám Phá Trải Nghiệm Giao Diện <br />
          <span class="gradient-text">Cực Kỳ Thú Vị</span> &amp;
          <span class="kinetic-typing">{{ typedText }}</span>
        </h1>

        <p class="hero-desc">
          Bản demo này tập trung vào sự sinh động: <strong>Hạt tương tác theo chuột</strong>, <strong>Thẻ 3D nghiêng đa chiều (Holographic Tilt)</strong>, <strong>Kinetic Typography</strong> và <strong>Trung tâm điều khiển hoạt ảnh tương tác</strong> — giữ nguyên 100% web BĐS của bạn!
        </p>

        <!-- Interactive Playground Bar -->
        <div class="playground-bar">
          <div class="playground-label">🎮 Bấm Để Thử Hiệu Ứng:</div>

          <button class="interactive-btn btn-blast" @click="fireConfetti">
            <span>🎉 Bắn Pháo Hoa</span>
          </button>

          <button 
            class="interactive-btn" 
            :style="warpSpeed ? { borderColor: 'var(--accent-pink)', color: 'var(--accent-pink)' } : {}"
            @click="toggleWarp"
          >
            <span>⚡ Tốc Độ Siêu Không Gian</span>
          </button>

          <button class="interactive-btn" @click="nextTheme">
            <span>🌌 Đổi Vibe Vũ Trụ</span>
          </button>

          <button class="interactive-btn" @click="triggerShockwave">
            <span>🌀 Sóng Trọng Lực</span>
          </button>
        </div>
      </section>

      <!-- 3D Holographic Parallax Cards -->
      <section>
        <h2 class="section-title">Thẻ 3D Holographic Parallax</h2>
        <p class="section-subtitle">Rê chuột qua từng thẻ để cảm nhận chiều sâu 3D, ánh sáng phản chiếu (Glare) và các lớp Z-axis</p>

        <div class="cards-grid">
          <div 
            v-for="(card, idx) in cards" 
            :key="idx"
            class="tilt-card"
            @mousemove="handleCardMove($event, idx)"
            @mouseleave="handleCardLeave(idx)"
            @click="handleCardClick(card)"
            :style="cardStyles[idx]"
          >
            <div class="card-glare" :style="cardGlareStyles[idx]"></div>
            <div class="card-inner">
              <div class="card-icon-wrap">{{ card.icon }}</div>
              <span class="card-badge" :style="card.badgeStyle">{{ card.badge }}</span>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.desc }}</p>
              <div class="card-action">
                <div>
                  <div class="metric-value">{{ card.price }}</div>
                  <div class="metric-sub">{{ card.sub }}</div>
                </div>
                <div class="action-arrow">→</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Kinetic Cube Section -->
      <section class="showcase-box">
        <div class="showcase-grid">
          <div>
            <span class="card-badge">Công Nghệ Tương Tác 4.0</span>
            <h2 style="font-family: var(--font-title); font-size: 2.2rem; margin: 12px 0 18px; font-weight: 800;">
              Không Gian Ảo Hoá Đa Chiều
            </h2>
            <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
              Trải nghiệm xoay khối không gian 3D mượt mà không dùng thư viện nặng nề. Thuật toán CSS 3D Engine và requestAnimationFrame mang lại 60FPS ổn định trên mọi thiết bị.
            </p>
            <button class="interactive-btn btn-blast" @click="reverseCube">
              <span>🔄 Đổi Chiều Xoay Khối</span>
            </button>

            <div class="stats-row">
              <div class="stat-pill">
                <div class="stat-num">99.9</div>
                <div class="stat-label">Độ Mượt (FPS)</div>
              </div>
              <div class="stat-pill">
                <div class="stat-num">100%</div>
                <div class="stat-label">Responsive</div>
              </div>
              <div class="stat-pill">
                <div class="stat-num">0%</div>
                <div class="stat-label">Ảnh Hưởng Web Gốc</div>
              </div>
            </div>
          </div>

          <div class="cube-stage">
            <div class="animated-cube" :style="{ animationDirection: cubeReversed ? 'reverse' : 'normal' }">
              <div class="cube-face face-front">VR 360</div>
              <div class="cube-face face-back">3D TILT</div>
              <div class="cube-face face-right">LUXURY</div>
              <div class="cube-face face-left">KINETIC</div>
              <div class="cube-face face-top">MOTION</div>
              <div class="cube-face face-bottom">SMART</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="demo-footer">
        <p>💡 Đây là trang <strong>Demo Hoạt Ảnh Độc Lập</strong> được thiết kế riêng để bạn trải nghiệm các hiệu ứng sinh động.</p>
        <p style="margin-top: 8px;">
          Website BĐS chính tại 
          <NuxtLink to="/" class="back-tag">Trang Chủ Bến Thành Land</NuxtLink> 
          vẫn được giữ nguyên 100% không hề bị thay đổi.
        </p>
      </footer>
    </div>

    <!-- Toast Notification -->
    <div class="toast-popup" :class="{ show: toastVisible }">
      <span>✨</span>
      <span>{{ toastMessage }}</span>
    </div>

    <!-- Confetti Canvas -->
    <canvas ref="confettiCanvas" class="confetti-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'

definePageMeta({
  layout: false
})

useHead({
  title: 'Demo Hoạt Ảnh Web Đỉnh Cao & Thú Vị | Bến Thành Land Animation Demo',
  meta: [
    { name: 'description', content: 'Bản demo thử nghiệm hiệu ứng hoạt ảnh và tương tác sinh động cho website.' }
  ]
})

// Themes
const themes = ['', 'gold', 'emerald']
const themeNames = ['Cyberpunk Neon 🌌', 'Royal Gold Hoàng Gia 👑', 'Emerald Aurora Cực Quang 🌿']
const currentThemeIdx = ref(0)
const currentTheme = computed(() => themes[currentThemeIdx.value])

// Mouse and Spotlight
const mouseX = ref(0)
const mouseY = ref(0)
const ringX = ref(0)
const ringY = ref(0)
const isHoveringInteractive = ref(false)

const ambientGlowStyle = computed(() => {
  const x = (mouseX.value / (typeof window !== 'undefined' ? window.innerWidth : 1000)) * 100
  const y = (mouseY.value / (typeof window !== 'undefined' ? window.innerHeight : 1000)) * 100
  return {
    '--mouse-x': `${x}%`,
    '--mouse-y': `${y}%`
  }
})

// Kinetic Typing
const phrases = [
  "Tràn Đầy Năng Lượng ⚡",
  "Sang Trọng & Đẳng Cấp 💎",
  "Tương Tác 3D Sống Động 🌌",
  "Tối Ưu 60FPS Siêu Mượt 🚀"
]
const typedText = ref('')
let phraseIdx = 0
let charIdx = 0
let isDeleting = false
let typingTimer = null

function runTyping() {
  const current = phrases[phraseIdx]
  if (isDeleting) {
    typedText.value = current.substring(0, charIdx - 1)
    charIdx--
  } else {
    typedText.value = current.substring(0, charIdx + 1)
    charIdx++
  }

  let speed = isDeleting ? 35 : 75
  if (!isDeleting && charIdx === current.length) {
    speed = 2000
    isDeleting = true
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false
    phraseIdx = (phraseIdx + 1) % phrases.length
    speed = 500
  }
  typingTimer = setTimeout(runTyping, speed)
}

// 3D Tilt Cards Data
const cards = [
  {
    icon: '🏙️',
    badge: 'Vinhomes Horizon',
    badgeStyle: {},
    title: 'Penthouse Đỉnh Cao',
    desc: 'Tầm nhìn panorama 360 độ ôm trọn sông Sài Gòn, tích hợp công nghệ Smart Home điều khiển theo cử chỉ không chạm.',
    price: '68.5 Tỷ',
    sub: 'Bàn giao Full Nội Thất Ý'
  },
  {
    icon: '🌊',
    badge: 'Biệt Thự Đảo',
    badgeStyle: { background: 'rgba(236,72,153,0.15)', color: '#ec4899' },
    title: 'Dinh Thự Biển Cần Giờ',
    desc: 'Kiến trúc nhiệt đới đương đại với bến du thuyền riêng, bể bơi vô cực nước mặn và công viên sinh thái bảo tồn.',
    price: '125 Tỷ',
    sub: 'Sở hữu vĩnh viễn'
  },
  {
    icon: '💎',
    badge: 'Nhà Phố Trung Tâm',
    badgeStyle: { background: 'rgba(16,185,129,0.15)', color: '#10b981' },
    title: 'Mặt Tiền Quận 11',
    desc: 'Vị trí kinh doanh vàng, pháp lý chuẩn hoàn công 100%, vỉa hè rộng 6m thuận tiện showroom cao cấp hoặc toà nhà văn phòng.',
    price: '32.8 Tỷ',
    sub: 'Dòng tiền thuê 80tr/tháng'
  }
]

const cardStyles = reactive([{}, {}, {}])
const cardGlareStyles = reactive([{}, {}, {}])

function handleCardMove(e, idx) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateX = ((y - centerY) / centerY) * -14
  const rotateY = ((x - centerX) / centerX) * 14

  cardStyles[idx] = {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`
  }
  cardGlareStyles[idx] = {
    background: `radial-gradient(circle 280px at ${x}px ${y}px, rgba(255, 255, 255, 0.14), transparent 70%)`
  }
}

function handleCardLeave(idx) {
  cardStyles[idx] = {
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  }
}

function handleCardClick(card) {
  playTone(520, 'sine', 0.2)
  showToast(`✨ Bạn đã chọn: ${card.title}`)
}

// Sound Synthesizer via Web Audio API
const soundEnabled = ref(true)
let audioCtx = null

function initAudio() {
  if (!audioCtx && typeof window !== 'undefined') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
}

function playTone(freq = 440, type = 'sine', duration = 0.15) {
  if (!soundEnabled.value) return
  try {
    initAudio()
    if (audioCtx.state === 'suspended') audioCtx.resume()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + duration)
  } catch(e) {}
}

function toggleSound() {
  soundEnabled.value = !soundEnabled.value
  if (soundEnabled.value) playTone(600, 'triangle', 0.2)
}

// Cube Controls
const cubeReversed = ref(false)
function reverseCube() {
  cubeReversed.value = !cubeReversed.value
  playTone(550, 'square', 0.15)
  showToast(cubeReversed.value ? '🔄 Đã đảo chiều xoay khối 3D!' : '🔄 Khối 3D quay chiều thuận')
}

// Toast
const toastVisible = ref(false)
const toastMessage = ref('')
let toastTimer = null
function showToast(msg) {
  toastMessage.value = msg
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 2600)
}

// Themes Switcher
function nextTheme() {
  currentThemeIdx.value = (currentThemeIdx.value + 1) % themes.length
  playTone(720, 'triangle', 0.2)
  showToast(`Đã chuyển Vibe: ${themeNames[currentThemeIdx.value]}`)
}

// Particles Canvas System
const particleCanvas = ref(null)
const warpSpeed = ref(false)
let particles = []
let particleAnimFrame = null

function toggleWarp() {
  warpSpeed.value = !warpSpeed.value
  playTone(warpSpeed.value ? 950 : 350, 'sawtooth', 0.3)
  showToast(warpSpeed.value ? '🚀 Kích hoạt Tốc Độ Warp!' : '⏹️ Đã trở về tốc độ thường')
}

function triggerShockwave() {
  playTone(220, 'sine', 0.4)
  particles.forEach(p => {
    const dx = p.x - mouseX.value
    const dy = p.y - mouseY.value
    const angle = Math.atan2(dy, dx)
    p.vx += Math.cos(angle) * 12
    p.vy += Math.sin(angle) * 12
  })
  showToast('🌀 Sóng trọng lực đã đẩy toàn bộ hạt ra xa!')
}

// Confetti System
const confettiCanvas = ref(null)
let confettis = []
let confettiAnimFrame = null

function fireConfetti() {
  playTone(880, 'sine', 0.25)
  showToast('🎉 Bắn pháo hoa rực rỡ!')
  const colors = ['#6366f1', '#ec4899', '#06b6d4', '#eab308', '#10b981', '#f43f5e']
  const cx = mouseX.value || window.innerWidth / 2
  const cy = mouseY.value || window.innerHeight * 0.4
  for (let i = 0; i < 120; i++) {
    confettis.push({
      x: cx,
      y: cy,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1
    })
  }
}

// Lifecycle Hooks
onMounted(() => {
  if (typeof window === 'undefined') return

  mouseX.value = window.innerWidth / 2
  mouseY.value = window.innerHeight / 2
  ringX.value = mouseX.value
  ringY.value = mouseY.value

  const handleMouseMove = (e) => {
    mouseX.value = e.clientX
    mouseY.value = e.clientY
  }
  window.addEventListener('mousemove', handleMouseMove)

  // Cursor Lerp Loop
  let cursorAnimId
  const updateCursor = () => {
    ringX.value += (mouseX.value - ringX.value) * 0.18
    ringY.value += (mouseY.value - ringY.value) * 0.18
    cursorAnimId = requestAnimationFrame(updateCursor)
  }
  updateCursor()

  // Run Typing
  runTyping()

  // Particles Setup
  const pCanvas = particleCanvas.value
  if (pCanvas) {
    const pCtx = pCanvas.getContext('2d')
    const resizeP = () => {
      pCanvas.width = window.innerWidth
      pCanvas.height = window.innerHeight
    }
    window.addEventListener('resize', resizeP)
    resizeP()

    class Particle {
      constructor() {
        this.x = Math.random() * pCanvas.width
        this.y = Math.random() * pCanvas.height
        this.vx = (Math.random() - 0.5) * 0.8
        this.vy = (Math.random() - 0.5) * 0.8
        this.radius = Math.random() * 2 + 1
        this.alpha = Math.random() * 0.5 + 0.2
        this.color = Math.random() > 0.5 ? '#6366f1' : '#06b6d4'
      }
      update() {
        const mult = warpSpeed.value ? 12 : 1
        this.x += this.vx * mult
        this.y += this.vy * mult

        const dx = mouseX.value - this.x
        const dy = mouseY.value - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 140) {
          const force = (140 - dist) / 140
          this.x -= (dx / dist) * force * 5
          this.y -= (dy / dist) * force * 5
        }

        if (this.x < 0) this.x = pCanvas.width
        if (this.x > pCanvas.width) this.x = 0
        if (this.y < 0) this.y = pCanvas.height
        if (this.y > pCanvas.height) this.y = 0
      }
      draw() {
        pCtx.beginPath()
        pCtx.arc(this.x, this.y, warpSpeed.value ? this.radius * 2 : this.radius, 0, Math.PI * 2)
        pCtx.fillStyle = this.color
        pCtx.globalAlpha = this.alpha
        pCtx.fill()
      }
    }

    particles = Array.from({ length: 70 }, () => new Particle())

    const renderParticles = () => {
      pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height)
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 110) {
            pCtx.beginPath()
            pCtx.moveTo(particles[i].x, particles[i].y)
            pCtx.lineTo(particles[j].x, particles[j].y)
            pCtx.strokeStyle = '#6366f1'
            pCtx.globalAlpha = (1 - dist / 110) * 0.15
            pCtx.stroke()
          }
        }
      }
      particleAnimFrame = requestAnimationFrame(renderParticles)
    }
    renderParticles()
  }

  // Confetti Loop
  const cCanvas = confettiCanvas.value
  if (cCanvas) {
    const cCtx = cCanvas.getContext('2d')
    const resizeC = () => {
      cCanvas.width = window.innerWidth
      cCanvas.height = window.innerHeight
    }
    window.addEventListener('resize', resizeC)
    resizeC()

    const renderConfetti = () => {
      cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height)
      for (let i = confettis.length - 1; i >= 0; i--) {
        const c = confettis[i]
        c.x += c.vx
        c.y += c.vy
        c.vy += 0.35
        c.rotation += c.rotationSpeed
        c.opacity -= 0.009

        if (c.opacity <= 0) {
          confettis.splice(i, 1)
          continue
        }

        cCtx.save()
        cCtx.translate(c.x, c.y)
        cCtx.rotate((c.rotation * Math.PI) / 180)
        cCtx.fillStyle = c.color
        cCtx.globalAlpha = c.opacity
        cCtx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size)
        cCtx.restore()
      }
      confettiAnimFrame = requestAnimationFrame(renderConfetti)
    }
    renderConfetti()
  }

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    if (typingTimer) clearTimeout(typingTimer)
    if (cursorAnimId) cancelAnimationFrame(cursorAnimId)
    if (particleAnimFrame) cancelAnimationFrame(particleAnimFrame)
    if (confettiAnimFrame) cancelAnimationFrame(confettiAnimFrame)
  })
})
</script>

<style scoped>
.demo-page-root {
  --bg-primary: #070913;
  --bg-surface: rgba(18, 22, 39, 0.7);
  --border-subtle: rgba(255, 255, 255, 0.1);
  --border-glow: rgba(99, 102, 241, 0.4);
  --accent-main: #6366f1;
  --accent-cyan: #06b6d4;
  --accent-pink: #ec4899;
  --accent-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --font-body: 'Plus Jakarta Sans', sans-serif;
  --font-title: 'Space Grotesk', sans-serif;

  background-color: var(--bg-primary);
  color: var(--text-main);
  font-family: var(--font-body);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  transition: background-color 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.demo-page-root[data-theme="gold"] {
  --bg-primary: #0b0c0e;
  --bg-surface: rgba(26, 23, 18, 0.7);
  --border-glow: rgba(234, 179, 8, 0.4);
  --accent-main: #eab308;
  --accent-cyan: #f59e0b;
  --accent-pink: #d97706;
  --accent-gradient: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #b45309 100%);
}

.demo-page-root[data-theme="emerald"] {
  --bg-primary: #04100e;
  --bg-surface: rgba(6, 30, 26, 0.7);
  --border-glow: rgba(16, 185, 129, 0.4);
  --accent-main: #10b981;
  --accent-cyan: #14b8a6;
  --accent-pink: #06b6d4;
  --accent-gradient: linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%);
}

.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}

.ambient-glow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
  background: 
    radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 30%), rgba(99, 102, 241, 0.15), transparent 70%),
    radial-gradient(circle 800px at 85% 10%, rgba(236, 72, 153, 0.08), transparent 70%),
    radial-gradient(circle 700px at 10% 80%, rgba(6, 182, 212, 0.08), transparent 70%);
}

.cursor-dot, .cursor-ring {
  pointer-events: none;
  position: fixed;
  border-radius: 50%;
  z-index: 9999;
  transform: translate(-50%, -50%);
}
.cursor-dot {
  width: 8px;
  height: 8px;
  background: #ffffff;
  box-shadow: 0 0 10px #ffffff;
}
.cursor-ring {
  width: 36px;
  height: 36px;
  border: 1.5px solid var(--accent-main);
  box-shadow: 0 0 15px var(--border-glow);
  transition: width 0.2s, height 0.2s, border-color 0.3s;
}
.cursor-ring.active {
  width: 54px;
  height: 54px;
  border-color: var(--accent-pink);
  background: rgba(236, 72, 153, 0.08);
}

.wrapper {
  position: relative;
  z-index: 10;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  margin-top: 12px;
}

.brand-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
  backdrop-filter: blur(16px);
  padding: 8px 18px;
  border-radius: 9999px;
  font-family: var(--font-title);
  font-weight: 700;
  font-size: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.brand-pill:hover {
  transform: translateY(-2px);
  border-color: var(--border-glow);
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.2);
}
.brand-badge {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 12px #10b981;
  animation: pulse-beacon 2s infinite;
}
@keyframes pulse-beacon {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.6); opacity: 0.6; }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.glass-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  color: var(--text-main);
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  backdrop-filter: blur(12px);
  transition: all 0.25s ease;
  text-decoration: none;
}
.glass-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.hero-section {
  padding: 70px 0 60px;
  text-align: center;
}

.tag-bubble {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid var(--border-glow);
  color: #c7d2fe;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 24px;
  animation: float-slow 4s ease-in-out infinite;
}
@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.hero-title {
  font-family: var(--font-title);
  font-size: clamp(2.4rem, 5.5vw, 4.4rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -1.5px;
  max-width: 960px;
  margin: 0 auto 24px;
}

.gradient-text {
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  position: relative;
}

.kinetic-typing {
  border-right: 3px solid var(--accent-cyan);
  padding-right: 4px;
  animation: blink 0.9s infinite;
}
@keyframes blink {
  0%, 100% { border-color: transparent; }
  50% { border-color: var(--accent-cyan); }
}

.hero-desc {
  font-size: clamp(1rem, 1.8vw, 1.25rem);
  color: var(--text-muted);
  max-width: 680px;
  margin: 0 auto 40px;
  line-height: 1.6;
}

.playground-bar {
  background: rgba(18, 22, 39, 0.75);
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  padding: 16px 24px;
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  margin-bottom: 70px;
}

.playground-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.interactive-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  color: #fff;
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  user-select: none;
}
.interactive-btn:hover {
  transform: translateY(-3px) scale(1.03);
  border-color: var(--border-glow);
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
}

.btn-blast {
  background: var(--accent-gradient);
  border: none;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

.section-title {
  font-family: var(--font-title);
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
}
.section-subtitle {
  text-align: center;
  color: var(--text-muted);
  margin-bottom: 48px;
  font-size: 15px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
  margin-bottom: 90px;
  perspective: 1200px;
}

.tilt-card {
  position: relative;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 24px;
  padding: 32px 28px;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transform-style: preserve-3d;
  transition: border-color 0.4s, box-shadow 0.4s, transform 0.15s ease-out;
  cursor: pointer;
  overflow: hidden;
}
.tilt-card:hover {
  border-color: var(--border-glow);
  box-shadow: 0 30px 60px rgba(99, 102, 241, 0.25);
}

.card-glare {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.card-inner {
  position: relative;
  z-index: 3;
  transform-style: preserve-3d;
}

.card-icon-wrap {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin-bottom: 24px;
  transform: translateZ(40px);
  transition: transform 0.3s ease;
}
.tilt-card:hover .card-icon-wrap {
  transform: translateZ(60px) scale(1.1);
  background: rgba(99, 102, 241, 0.2);
  border-color: var(--accent-main);
}

.card-badge {
  display: inline-block;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(6, 182, 212, 0.15);
  color: var(--accent-cyan);
  margin-bottom: 12px;
  transform: translateZ(30px);
}

.card-title {
  font-family: var(--font-title);
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 12px;
  transform: translateZ(35px);
  color: #fff;
}

.card-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
  margin-bottom: 24px;
  transform: translateZ(25px);
}

.card-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  transform: translateZ(30px);
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.metric-value {
  font-family: var(--font-title);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent-main);
}
.metric-sub {
  font-size: 12px;
  color: var(--text-muted);
}

.action-arrow {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}
.tilt-card:hover .action-arrow {
  background: var(--accent-main);
  transform: translateX(4px);
  color: #fff;
}

.showcase-box {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid var(--border-subtle);
  border-radius: 28px;
  padding: 44px;
  margin-bottom: 90px;
}

.showcase-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}
@media (max-width: 860px) {
  .showcase-grid { grid-template-columns: 1fr; }
}

.cube-stage {
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

.animated-cube {
  width: 140px;
  height: 140px;
  position: relative;
  transform-style: preserve-3d;
  animation: rotate-cube 16s linear infinite;
}
@keyframes rotate-cube {
  0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
}

.cube-face {
  position: absolute;
  width: 140px;
  height: 140px;
  border: 2px solid rgba(99, 102, 241, 0.5);
  background: rgba(99, 102, 241, 0.1);
  backdrop-filter: blur(8px);
  box-shadow: 0 0 25px rgba(99, 102, 241, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  font-family: var(--font-title);
}
.face-front  { transform: translateZ(70px); }
.face-back   { transform: rotateY(180deg) translateZ(70px); }
.face-right  { transform: rotateY(90deg) translateZ(70px); }
.face-left   { transform: rotateY(-90deg) translateZ(70px); }
.face-top    { transform: rotateX(90deg) translateZ(70px); }
.face-bottom { transform: rotateX(-90deg) translateZ(70px); }

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 32px;
}
.stat-pill {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
}
.stat-num {
  font-family: var(--font-title);
  font-size: 2rem;
  font-weight: 800;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.stat-label {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 4px;
}

.demo-footer {
  text-align: center;
  padding: 40px 0 60px;
  color: var(--text-muted);
  font-size: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.back-tag {
  color: var(--accent-main);
  text-decoration: none;
  font-weight: 600;
}
.back-tag:hover {
  text-decoration: underline;
}

.toast-popup {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  background: rgba(18, 22, 39, 0.9);
  border: 1px solid var(--border-glow);
  backdrop-filter: blur(20px);
  padding: 14px 22px;
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 12px;
  transform: translateY(120px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}
.toast-popup.show {
  transform: translateY(0);
  opacity: 1;
}

.confetti-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9998;
}
</style>
