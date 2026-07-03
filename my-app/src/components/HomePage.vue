<template>
  <div class="home">
    <!-- Cursor Glow Effect -->
    <div class="cursor-glow" ref="glow"></div>
    <!-- Background -->
    <div class="bg-circle circle1"></div>
    <div class="bg-circle circle2"></div>
    <div class="bg-circle circle3"></div>

    <!-- Navbar -->
    <nav class="navbar">
      <div class="logo">
        <i class="fas fa-music"></i>
        <span>ClipForge</span>
      </div>

      <div class="nav-buttons">
        <router-link to="/login">
          <button class="login-btn">Login</button>
        </router-link>

        <router-link to="/register">
          <button class="register-btn">Register</button>
        </router-link>
      </div>
    </nav>

    <!-- Hero -->

    <section class="hero">
      <div class="hero-left">
        <span class="badge">Welcome Ji</span>

        <h1>
          Create Amazing

          <span class="gradient-text"> Music Clips </span>

          In Seconds
        </h1>

        <p>
          Import songs directly from YouTube, trim audio visually, loop your
          favorite sections, and download professional-quality clips
          effortlessly.
        </p>

        <div class="hero-buttons">
          <router-link to="/register">
            <button class="primary-btn">Get Started</button>
          </router-link>

          <router-link to="/login">
            <button class="secondary-btn">Login</button>
          </router-link>
        </div>

        <div class="hero-stats">
          <div>
            <h2 ref="count1">0+</h2>
            <p>Music Imports</p>
          </div>
          <div>
            <h2 ref="count2">0+</h2>
            <p>Audio Clips</p>
          </div>
          <div>
            <h2 ref="count3">0%</h2>
            <p>User Satisfaction</p>
          </div>
        </div>
      </div>

      <!-- Right Side -->

      <div class="hero-right">
        <div class="glass-card" ref="tiltCard">
          <div class="player-top">
            <img
              src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500"
              alt=""
            />

            <div>
              <h3>Believer</h3>

              <p>Imagine Dragons</p>
            </div>
          </div>

          <div class="fake-wave">
            <span v-for="i in 45" :key="i"></span>
          </div>

          <div class="clip-box">
            <div class="clip-region"></div>
          </div>

          <button class="download-demo">
            <i class="fas fa-download"></i>

            Download Clip
          </button>
        </div>
      </div>
    </section>

    <!-- Features -->

    <section class="features">
      <h2>Why Choose ClipForge?</h2>

      <div class="feature-grid">
        <div class="feature-card reveal">
          <i class="fab fa-youtube"></i>

          <h3>Import from YouTube</h3>

          <p>Download high-quality audio instantly.</p>
        </div>

        <div class="feature-card">
          <i class="fas fa-wave-square"></i>

          <h3>Visual Waveform</h3>

          <p>Trim audio with precision.</p>
        </div>

        <div class="feature-card">
          <i class="fas fa-sync"></i>

          <h3>Loop Playback</h3>

          <p>Perfect your clip before exporting.</p>
        </div>

        <div class="feature-card">
          <i class="fas fa-file-export"></i>

          <h3>Export MP3</h3>

          <p>Save full songs or selected clips.</p>
        </div>
      </div>
    </section>

    <!-- CTA -->

    <section class="cta">
      <h2>Ready to Build Your Perfect Music Clip?</h2>

      <p>Join thousands of creators editing audio effortlessly.</p>

      <router-link to="/register">
        <button class="cta-btn">Start For Free</button>
      </router-link>
    </section>

    <!-- Footer -->

    <footer>© 2026 ClipForge • Built with ❤️ by Akshit Gupta</footer>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  mounted() {
    document.title = "ClipForge | Home";

    // 1. MOUSE CURSOR GLOW
    const glow = this.$refs.glow;
    window.addEventListener("mousemove", (e) => {
      if (glow) {
        glow.style.top = e.clientY + "px";
        glow.style.left = e.clientX + "px";
      }
    });

    // 2. HERO IMAGE TILT (3D Effect)
    const card = this.$refs.tiltCard;
    if (card) {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Tilt calculation
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
      });

      card.addEventListener("mouseleave", () => {
        // Wapas normal position par
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      });
    }

    // 3. ANIMATED COUNTERS & 4. SCROLL REVEAL (Intersection Observer)
    const animateValue = (obj, start, end, duration, isPercent) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML =
          Math.floor(progress * (end - start) + start) +
          (isPercent ? "%" : "+");
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Scroll Reveal active karo
            if (entry.target.classList.contains("reveal")) {
              entry.target.classList.add("active");
            }
            // Counters active karo
            if (entry.target.classList.contains("hero-stats")) {
              animateValue(this.$refs.count1, 0, 500, 2000, false);
              animateValue(this.$refs.count2, 0, 1200, 2500, false);
              animateValue(this.$refs.count3, 0, 99, 3000, true);
              observer.unobserve(entry.target); // Ek baar count karke band
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    // Elements ko observe karna shuru karo
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    const statsSection = document.querySelector(".hero-stats");
    if (statsSection) observer.observe(statsSection);
  },
};
</script>

<style scoped>
/* ===========================
   GOOGLE FONT
=========================== */

@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

body {
  background: #070b18;
  overflow-x: hidden;
}

/* ===========================
   HOME
=========================== */

.home {
  position: relative;

  min-height: 100vh;

  background: linear-gradient(135deg, #050816, #0f172a, #111827);

  color: white;

  overflow: hidden;
}

/* ===========================
   BACKGROUND BLOBS
=========================== */

.bg-circle {
  position: absolute;

  border-radius: 50%;

  filter: blur(90px);

  opacity: 0.35;

  animation: floatBlob 12s ease-in-out infinite;

  z-index: 0;
}

.circle1 {
  width: 320px;
  height: 320px;

  background: #4f46e5;

  top: -80px;
  left: -80px;
}

.circle2 {
  width: 420px;
  height: 420px;

  background: #06b6d4;

  right: -120px;
  top: 150px;

  animation-delay: 2s;
}

.circle3 {
  width: 260px;
  height: 260px;

  background: #9333ea;

  bottom: -60px;
  left: 40%;

  animation-delay: 4s;
}

@keyframes floatBlob {
  0% {
    transform: translateY(0px) scale(1);
  }

  50% {
    transform: translateY(-40px) scale(1.1);
  }

  100% {
    transform: translateY(0px) scale(1);
  }
}

/* ===========================
   NAVBAR
=========================== */

.navbar {
  position: relative;

  z-index: 5;

  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 25px 8%;

  backdrop-filter: blur(20px);
}

.logo {
  display: flex;

  align-items: center;

  gap: 12px;

  font-size: 28px;

  font-weight: 700;
}

.logo i {
  font-size: 34px;

  color: #4f46e5;

  animation: rotateMusic 6s linear infinite;
}

@keyframes rotateMusic {
  100% {
    transform: rotate(360deg);
  }
}

.nav-buttons {
  display: flex;

  gap: 15px;
}

/* ===========================
   BUTTONS
=========================== */

.login-btn,
.register-btn,
.primary-btn,
.secondary-btn,
.cta-btn {
  border: none;

  cursor: pointer;

  padding: 14px 28px;

  border-radius: 40px;

  font-size: 15px;

  font-weight: 600;

  transition: 0.35s;
}

.login-btn {
  background: rgba(255, 255, 255, 0.08);

  color: white;

  backdrop-filter: blur(15px);
}

.login-btn:hover {
  transform: translateY(-3px);

  background: rgba(255, 255, 255, 0.15);
}

.register-btn,
.primary-btn,
.cta-btn {
  background: linear-gradient(90deg, #4f46e5, #7c3aed);

  color: white;

  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.45);
}

.register-btn:hover,
.primary-btn:hover,
.cta-btn:hover {
  transform: translateY(-4px);

  box-shadow: 0 15px 40px rgba(79, 70, 229, 0.55);
}

.secondary-btn {
  background: transparent;

  border: 2px solid rgba(255, 255, 255, 0.25);

  color: white;
}

.secondary-btn:hover {
  background: white;

  color: #111827;
}

/* ===========================
   HERO
=========================== */

.hero {
  position: relative;

  z-index: 2;

  display: grid;

  grid-template-columns: 1fr 1fr;

  align-items: center;

  gap: 70px;

  padding: 60px 8%;

  min-height: 85vh;
}

.hero-left {
  animation: slideUp 0.8s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;

    transform: translateY(40px);
  }

  to {
    opacity: 1;

    transform: translateY(0);
  }
}

.badge {
  display: inline-block;

  padding: 10px 18px;

  border-radius: 30px;

  background: rgba(255, 255, 255, 0.08);

  border: 1px solid rgba(255, 255, 255, 0.15);

  margin-bottom: 25px;

  font-size: 14px;

  backdrop-filter: blur(20px);
}

.hero h1 {
  font-size: 64px;

  font-weight: 800;

  line-height: 1.15;

  margin-bottom: 25px;
}

.gradient-text {
  background: linear-gradient(90deg, #60a5fa, #4f46e5, #9333ea);

  -webkit-background-clip: text;

  -webkit-text-fill-color: transparent;
}

.hero p {
  font-size: 18px;

  line-height: 1.8;

  color: #cbd5e1;

  max-width: 620px;

  margin-bottom: 35px;
}

.hero-buttons {
  display: flex;

  gap: 18px;

  margin-bottom: 45px;
}

/* ===========================
   STATS
=========================== */

.hero-stats {
  display: flex;

  gap: 55px;
}

.hero-stats h2 {
  font-size: 34px;

  margin-bottom: 6px;

  color: white;
}

.hero-stats p {
  font-size: 14px;

  color: #94a3b8;

  margin: 0;
}

/* ===========================
   RIGHT CARD
=========================== */

.hero-right {
  display: flex;

  justify-content: center;
}

.glass-card {
  width: 430px;

  padding: 28px;

  border-radius: 30px;

  background: rgba(255, 255, 255, 0.08);

  border: 1px solid rgba(255, 255, 255, 0.12);

  backdrop-filter: blur(25px);

  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);

  animation: floatCard 5s ease-in-out infinite;
}

@keyframes floatCard {
  50% {
    transform: translateY(-12px);
  }
}

.player-top {
  display: flex;

  align-items: center;

  gap: 18px;

  margin-bottom: 30px;
}

.player-top img {
  width: 80px;

  height: 80px;

  border-radius: 18px;

  object-fit: cover;
}

.player-top h3 {
  font-size: 22px;

  margin-bottom: 5px;
}

.player-top p {
  color: #94a3b8;

  font-size: 14px;
}

/* ===========================
   WAVEFORM
=========================== */

.fake-wave {
  display: flex;

  align-items: flex-end;

  gap: 4px;

  height: 90px;

  margin: 30px 0;
}

.fake-wave span {
  width: 5px;

  background: linear-gradient(180deg, #60a5fa, #4f46e5);

  border-radius: 20px;

  animation: wave 1s infinite ease-in-out;
}

.fake-wave span:nth-child(odd) {
  animation-duration: 1.2s;
}

.fake-wave span:nth-child(even) {
  animation-duration: 0.8s;
}

.fake-wave span:nth-child(3n) {
  animation-duration: 1.5s;
}
/* ===========================
   FEATURE SECTION
=========================== */

.features {
  position: relative;

  z-index: 2;

  padding: 110px 8%;

  text-align: center;
}

.features h2 {
  font-size: 42px;

  margin-bottom: 60px;
}

.feature-grid {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

  gap: 30px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.06);

  border: 1px solid rgba(255, 255, 255, 0.08);

  backdrop-filter: blur(20px);

  border-radius: 25px;

  padding: 40px 30px;

  transition: 0.4s;

  cursor: pointer;

  position: relative;

  overflow: hidden;
}

.feature-card::before {
  content: "";

  position: absolute;

  top: -100%;

  left: -100%;

  width: 220%;

  height: 220%;

  background: linear-gradient(
    135deg,
    transparent,
    rgba(255, 255, 255, 0.08),
    transparent
  );

  transform: rotate(25deg);

  transition: 0.7s;
}

.feature-card:hover::before {
  left: 100%;

  top: 100%;
}

.feature-card:hover {
  transform: translateY(-12px);

  box-shadow: 0 20px 50px rgba(79, 70, 229, 0.35);
}

.feature-card i {
  font-size: 55px;

  margin-bottom: 25px;

  background: linear-gradient(90deg, #60a5fa, #7c3aed);

  -webkit-background-clip: text;

  -webkit-text-fill-color: transparent;
}

.feature-card h3 {
  font-size: 22px;

  margin-bottom: 12px;
}

.feature-card p {
  color: #94a3b8;

  line-height: 1.7;
}

/* ===========================
   CTA
=========================== */

.cta {
  padding: 120px 8%;

  text-align: center;

  position: relative;

  z-index: 2;
}

.cta h2 {
  font-size: 50px;

  margin-bottom: 20px;
}

.cta p {
  font-size: 18px;

  color: #94a3b8;

  margin-bottom: 40px;
}

.cta-btn {
  padding: 18px 45px;

  font-size: 18px;
}

/* ===========================
   DEMO PLAYER
=========================== */

.clip-box {
  height: 16px;

  background: rgba(255, 255, 255, 0.1);

  border-radius: 40px;

  overflow: hidden;

  margin-bottom: 35px;
}

.clip-region {
  height: 100%;

  width: 38%;

  background: linear-gradient(90deg, #10b981, #22c55e);

  border-radius: 40px;

  animation: clipMove 5s ease-in-out infinite;
}

@keyframes clipMove {
  0% {
    margin-left: 0;
  }

  50% {
    margin-left: 50%;
  }

  100% {
    margin-left: 0;
  }
}

.download-demo {
  width: 100%;

  padding: 16px;

  border: none;

  border-radius: 14px;

  cursor: pointer;

  background: linear-gradient(90deg, #4f46e5, #9333ea);

  color: white;

  font-size: 16px;

  font-weight: 600;

  transition: 0.35s;
}

.download-demo:hover {
  transform: translateY(-3px);
}

/* ===========================
   FOOTER
=========================== */

footer {
  padding: 35px;

  text-align: center;

  color: #94a3b8;

  border-top: 1px solid rgba(255, 255, 255, 0.08);

  margin-top: 80px;
}

/* ===========================
   RESPONSIVE
=========================== */

@media (max-width: 1100px) {
  .hero {
    grid-template-columns: 1fr;

    text-align: center;
  }

  .hero-left {
    order: 2;
  }

  .hero-right {
    order: 1;

    margin-bottom: 40px;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-stats {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 46px;
  }

  .features h2 {
    font-size: 34px;
  }

  .cta h2 {
    font-size: 38px;
  }

  .navbar {
    flex-direction: column;

    gap: 20px;
  }

  .glass-card {
    width: 100%;
  }

  .hero {
    padding: 40px 6%;
  }
}

@media (max-width: 520px) {
  .hero h1 {
    font-size: 38px;
  }

  .hero p {
    font-size: 16px;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .hero-stats {
    flex-direction: column;

    gap: 25px;
  }

  .login-btn,
  .register-btn,
  .primary-btn,
  .secondary-btn,
  .cta-btn {
    width: 100%;
  }
}

/* ===========================
   SCROLLBAR
=========================== */

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  background: #4f46e5;

  border-radius: 20px;
}

::-webkit-scrollbar-track {
  background: #0f172a;
}

/* ===========================
   SELECTION
=========================== */

::selection {
  background: #4f46e5;

  color: white;
}
@keyframes wave {
  0% {
    height: 18px;
  }

  50% {
    height: 85px;
  }

  100% {
    height: 20px;
  }
}

/* =========================================
   ADVANCED FEATURES CSS
========================================= */

/* 1. MOUSE CURSOR GLOW */
.cursor-glow {
  position: fixed;
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(79, 70, 229, 0.15) 0%,
    transparent 70%
  );
  pointer-events: none; /* Taaki buttons click ho sakein */
  transform: translate(-50%, -50%);
  z-index: 1; /* Background blobs ke upar par content ke neeche */
  transition: transform 0.1s ease-out;
  border-radius: 50%;
}

/* 2. 3D TILT EFFECT SMOOTHNESS */
.glass-card {
  /* Purana wala animation: floatCard 5s... hata dena agar conflict kare */
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-style: preserve-3d;
}

/* 3. SCROLL REVEAL ANIMATIONS */
.reveal {
  opacity: 0;
  transform: translateY(60px) scale(0.95);
  transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
}

.reveal.active {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Alag-alag cards ko thoda delay dene ke liye (Waterfall effect) */
.feature-card:nth-child(1) {
  transition-delay: 0.1s;
}
.feature-card:nth-child(2) {
  transition-delay: 0.2s;
}
.feature-card:nth-child(3) {
  transition-delay: 0.3s;
}
.feature-card:nth-child(4) {
  transition-delay: 0.4s;
}
</style>
