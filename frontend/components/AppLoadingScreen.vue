<template>
  <div class="splash">
    <!-- Decorative background paws -->
    <span class="bg-paw bg-paw--1 material-symbols-outlined">pets</span>
    <span class="bg-paw bg-paw--2 material-symbols-outlined">pets</span>
    <span class="bg-paw bg-paw--3 material-symbols-outlined">pets</span>
    <span class="bg-paw bg-paw--4 material-symbols-outlined">pets</span>
    <span class="bg-paw bg-paw--5 material-symbols-outlined">pets</span>
    <span class="bg-paw bg-paw--6 material-symbols-outlined">pets</span>

    <!-- Center content -->
    <div class="splash__content">
      <div class="splash__logo">
        <img
          src="/images/logo-horizontal.webp"
          alt="WeraWoof"
          class="hidden md:block h-16 lg:h-20 w-auto"
        />
        <img src="/images/logo-icon.webp" alt="WeraWoof" class="md:hidden h-20 w-auto" />
      </div>

      <p class="splash__tagline">Conectá patitas, creá recuerdos.</p>

      <div class="splash__paws">
        <span class="material-symbols-outlined paw paw--1" style="transform: rotate(-20deg)"
          >pets</span
        >
        <span class="material-symbols-outlined paw paw--2" style="transform: rotate(18deg)"
          >pets</span
        >
        <span class="material-symbols-outlined paw paw--3" style="transform: rotate(-12deg)"
          >pets</span
        >
        <span class="material-symbols-outlined paw paw--4" style="transform: rotate(22deg)"
          >pets</span
        >
        <span class="material-symbols-outlined paw paw--5" style="transform: rotate(-16deg)"
          >pets</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Layout ─────────────────────────────────────────── */
.splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #382615;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* ── Decorative background paws ─────────────────────── */
.bg-paw {
  position: absolute;
  color: #f4c07d;
  opacity: 0.04;
  pointer-events: none;
  animation: bgDrift 8s ease-in-out infinite alternate;
}

.bg-paw--1 {
  font-size: 9rem;
  top: 8%;
  left: 6%;
  transform: rotate(-30deg);
  animation-delay: 0s;
  animation-duration: 9s;
}
.bg-paw--2 {
  font-size: 5rem;
  top: 15%;
  right: 10%;
  transform: rotate(20deg);
  animation-delay: 1.5s;
  animation-duration: 7s;
}
.bg-paw--3 {
  font-size: 11rem;
  bottom: 12%;
  left: 15%;
  transform: rotate(50deg);
  animation-delay: 0.8s;
  animation-duration: 10s;
}
.bg-paw--4 {
  font-size: 6rem;
  bottom: 20%;
  right: 6%;
  transform: rotate(-15deg);
  animation-delay: 2s;
  animation-duration: 8s;
}
.bg-paw--5 {
  font-size: 7rem;
  top: 45%;
  left: 3%;
  transform: rotate(170deg);
  animation-delay: 0.3s;
  animation-duration: 11s;
}
.bg-paw--6 {
  font-size: 4rem;
  top: 60%;
  right: 18%;
  transform: rotate(-40deg);
  animation-delay: 1s;
  animation-duration: 6s;
}

@keyframes bgDrift {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-14px);
  }
}

/* ── Content ────────────────────────────────────────── */
.splash__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}

/* ── Logo ───────────────────────────────────────────── */
.splash__logo {
  animation: logoSpring 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes logoSpring {
  0% {
    opacity: 0;
    transform: scale(0.6) translateY(24px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* ── Tagline ────────────────────────────────────────── */
.splash__tagline {
  color: rgba(244, 192, 125, 0.7);
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: clamp(0.8rem, 2.5vw, 1rem);
  letter-spacing: 0.08em;
  text-align: center;
  padding: 0 1rem;
  opacity: 0;
  animation: fadeUp 0.5s ease 0.65s forwards;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Paw trail ──────────────────────────────────────── */
.splash__paws {
  display: flex;
  align-items: center;
  gap: clamp(10px, 3vw, 18px);
  margin-top: 0.5rem;
}

.paw {
  color: #f4c07d;
  font-size: clamp(1.1rem, 4vw, 1.5rem);
  opacity: 0;
  display: inline-block;
}

.paw--1 {
  animation:
    pawIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 1s forwards,
    pawPulse 1.6s ease 1.45s infinite;
}
.paw--2 {
  animation:
    pawIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s forwards,
    pawPulse 1.6s ease 1.85s infinite;
}
.paw--3 {
  animation:
    pawIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 1.4s forwards,
    pawPulse 1.6s ease 2.25s infinite;
}
.paw--4 {
  animation:
    pawIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 1.6s forwards,
    pawPulse 1.6s ease 2.65s infinite;
}
.paw--5 {
  animation:
    pawIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 1.8s forwards,
    pawPulse 1.6s ease 3.05s infinite;
}

@keyframes pawIn {
  0% {
    opacity: 0;
    transform: translateY(12px) scale(0.4);
  }
  60% {
    opacity: 1;
    transform: translateY(-5px) scale(1.2);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pawPulse {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}
</style>
