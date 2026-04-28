<script setup lang="ts">
definePageMeta({ layout: 'public' })
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <!-- Page title -->
    <div class="mb-12">
      <span
        class="inline-flex items-center gap-2 text-[#7d571e] text-sm font-medium uppercase tracking-widest mb-4"
      >
        <span class="material-symbols-outlined text-base">gavel</span>
        Legal
      </span>
      <h1
        class="text-[36px] md:text-[48px] font-extrabold text-[#382615] font-jakarta leading-tight"
      >
        Aviso de Privacidad
      </h1>
      <p class="text-[#7d571e] mt-3 text-base">Última actualización: abril de 2026</p>
    </div>

    <div class="space-y-10">
      <!-- 1 -->
      <section class="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(113,62,24,0.06)]">
        <h2 class="text-xl font-bold text-[#382615] font-jakarta mb-4 flex items-center gap-3">
          <span
            class="w-8 h-8 bg-[#F4C07D] rounded-xl flex items-center justify-center text-[#382615] font-black text-sm shrink-0"
            >1</span
          >
          ¿Quiénes somos?
        </h2>
        <p class="text-[#5a3e28] leading-relaxed">
          WeraWoof es una plataforma digital gratuita que conecta a dueños de perros para fomentar
          la socialización y el encuentro entre mascotas. Operamos en México y nuestros servicios no
          tienen ningún costo para el usuario. No procesamos ni almacenamos datos de pago de ningún
          tipo.
        </p>
      </section>

      <!-- 2 -->
      <section class="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(113,62,24,0.06)]">
        <h2 class="text-xl font-bold text-[#382615] font-jakarta mb-4 flex items-center gap-3">
          <span
            class="w-8 h-8 bg-[#F4C07D] rounded-xl flex items-center justify-center text-[#382615] font-black text-sm shrink-0"
            >2</span
          >
          Datos que recopilamos
        </h2>
        <p class="text-[#5a3e28] leading-relaxed mb-4">
          Al usar WeraWoof, podemos recopilar los siguientes datos:
        </p>
        <ul class="space-y-3">
          <li class="flex items-start gap-3 text-[#5a3e28]">
            <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
              >person</span
            >
            <span
              ><strong class="text-[#382615]">Datos de cuenta:</strong> nombre, correo electrónico,
              fotografía de perfil y contraseña (almacenada de forma cifrada).</span
            >
          </li>
          <li class="flex items-start gap-3 text-[#5a3e28]">
            <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
              >pets</span
            >
            <span
              ><strong class="text-[#382615]">Datos de tu perro:</strong> nombre, raza, edad,
              fotografías y descripción que tú mismo ingresas.</span
            >
          </li>
          <li class="flex items-start gap-3 text-[#5a3e28]">
            <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
              >chat</span
            >
            <span
              ><strong class="text-[#382615]">Mensajes:</strong> el contenido de los chats entre
              usuarios conectados a través de la plataforma.</span
            >
          </li>
          <li class="flex items-start gap-3 text-[#5a3e28]">
            <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
              >analytics</span
            >
            <span
              ><strong class="text-[#382615]">Datos de uso:</strong> páginas visitadas, acciones
              dentro de la app e información técnica del dispositivo (sistema operativo, tipo de
              navegador).</span
            >
          </li>
        </ul>
        <p class="text-[#5a3e28] leading-relaxed mt-4">
          <strong class="text-[#382615]">No recopilamos datos de pago.</strong> WeraWoof es
          completamente gratuito y no solicita ni almacena información bancaria, de tarjetas de
          crédito ni de ningún método de pago.
        </p>
      </section>

      <!-- 3 -->
      <section class="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(113,62,24,0.06)]">
        <h2 class="text-xl font-bold text-[#382615] font-jakarta mb-4 flex items-center gap-3">
          <span
            class="w-8 h-8 bg-[#F4C07D] rounded-xl flex items-center justify-center text-[#382615] font-black text-sm shrink-0"
            >3</span
          >
          ¿Para qué usamos tus datos?
        </h2>
        <ul class="space-y-3 text-[#5a3e28]">
          <li class="flex items-start gap-3">
            <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
              >check_circle</span
            >
            Crear y gestionar tu cuenta y la de tu perro.
          </li>
          <li class="flex items-start gap-3">
            <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
              >check_circle</span
            >
            Mostrarte perfiles de otros perros y facilitar conexiones entre usuarios.
          </li>
          <li class="flex items-start gap-3">
            <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
              >check_circle</span
            >
            Enviarte notificaciones relacionadas con la plataforma (nuevos matches, mensajes).
          </li>
          <li class="flex items-start gap-3">
            <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
              >check_circle</span
            >
            Mejorar el funcionamiento y la experiencia de la aplicación.
          </li>
          <li class="flex items-start gap-3">
            <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
              >check_circle</span
            >
            Prevenir usos fraudulentos o contrarios a nuestros términos de servicio.
          </li>
        </ul>
      </section>

      <!-- 4 -->
      <section class="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(113,62,24,0.06)]">
        <h2 class="text-xl font-bold text-[#382615] font-jakarta mb-4 flex items-center gap-3">
          <span
            class="w-8 h-8 bg-[#F4C07D] rounded-xl flex items-center justify-center text-[#382615] font-black text-sm shrink-0"
            >4</span
          >
          Terceros y servicios externos
        </h2>
        <p class="text-[#5a3e28] leading-relaxed mb-4">
          WeraWoof utiliza servicios de terceros para funcionar correctamente. Al usar nuestra
          plataforma, también estás sujeto a las políticas de privacidad de estos servicios:
        </p>
        <ul class="space-y-3 text-[#5a3e28]">
          <li class="flex items-start gap-3">
            <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
              >login</span
            >
            <span
              ><strong class="text-[#382615]">Google OAuth:</strong> si inicias sesión con Google,
              Google comparte con nosotros únicamente tu nombre, correo y foto de perfil. WeraWoof
              no accede a ningún otro dato de tu cuenta de Google.</span
            >
          </li>
          <li class="flex items-start gap-3">
            <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
              >storage</span
            >
            <span
              ><strong class="text-[#382615]">Infraestructura:</strong> nuestros servidores y base
              de datos están alojados en proveedores externos (Railway). Los datos se almacenan con
              medidas de seguridad estándar de la industria.</span
            >
          </li>
        </ul>
        <p class="text-[#5a3e28] leading-relaxed mt-4">
          No vendemos, alquilamos ni compartimos tus datos personales con terceros con fines
          comerciales o publicitarios.
        </p>
      </section>

      <!-- 5 — DISCLAIMER -->
      <section class="bg-[#382615] rounded-2xl p-8 shadow-[0_4px_20px_rgba(56,38,21,0.2)]">
        <h2 class="text-xl font-bold text-[#F4C07D] font-jakarta mb-4 flex items-center gap-3">
          <span class="material-symbols-outlined text-[#F4C07D]">warning</span>
          Exactitud de la información y limitación de responsabilidad
        </h2>
        <div class="space-y-4 text-white/80 leading-relaxed">
          <p>
            <strong class="text-white"
              >La información publicada en WeraWoof es generada por los propios usuarios.</strong
            >
            WeraWoof no verifica, valida ni garantiza la exactitud, veracidad o actualidad de los
            perfiles, fotografías, descripciones de perros u cualquier otro contenido publicado en
            la plataforma.
          </p>
          <p>
            WeraWoof actúa únicamente como intermediario tecnológico.
            <strong class="text-white"
              >No somos responsables de los encuentros, acuerdos, daños, pérdidas o cualquier
              consecuencia</strong
            >
            derivada del contacto entre usuarios organizado a través de la plataforma.
          </p>
          <p>
            El servicio se proporciona <strong class="text-white">"tal como está" (as-is)</strong>,
            sin garantías de disponibilidad continua, ausencia de errores o funcionamiento
            ininterrumpido. Podemos suspender, modificar o discontinuar el servicio en cualquier
            momento sin previo aviso.
          </p>
          <p>
            Al usar WeraWoof, el usuario acepta que la plataforma no se hace responsable por
            pérdidas directas, indirectas, incidentales o consecuentes derivadas del uso o la
            imposibilidad de uso del servicio.
          </p>
        </div>
      </section>

      <!-- 6 -->
      <section class="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(113,62,24,0.06)]">
        <h2 class="text-xl font-bold text-[#382615] font-jakarta mb-4 flex items-center gap-3">
          <span
            class="w-8 h-8 bg-[#F4C07D] rounded-xl flex items-center justify-center text-[#382615] font-black text-sm shrink-0"
            >6</span
          >
          Tus derechos (LFPDPPP)
        </h2>
        <p class="text-[#5a3e28] leading-relaxed mb-4">
          De conformidad con la
          <strong class="text-[#382615]"
            >Ley Federal de Protección de Datos Personales en Posesión de los Particulares</strong
          >
          (LFPDPPP), tienes derecho a:
        </p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-[#DBD8D0]/60 rounded-xl p-4 text-center">
            <span class="material-symbols-outlined text-[#382615] text-2xl mb-2 block">search</span>
            <p class="text-sm font-bold text-[#382615] font-jakarta">Acceso</p>
            <p class="text-xs text-[#7d571e] mt-1">Conocer qué datos tenemos de ti</p>
          </div>
          <div class="bg-[#DBD8D0]/60 rounded-xl p-4 text-center">
            <span class="material-symbols-outlined text-[#382615] text-2xl mb-2 block">edit</span>
            <p class="text-sm font-bold text-[#382615] font-jakarta">Rectificación</p>
            <p class="text-xs text-[#7d571e] mt-1">Corregir datos incorrectos</p>
          </div>
          <div class="bg-[#DBD8D0]/60 rounded-xl p-4 text-center">
            <span class="material-symbols-outlined text-[#382615] text-2xl mb-2 block">delete</span>
            <p class="text-sm font-bold text-[#382615] font-jakarta">Cancelación</p>
            <p class="text-xs text-[#7d571e] mt-1">Solicitar eliminar tu cuenta y datos</p>
          </div>
          <div class="bg-[#DBD8D0]/60 rounded-xl p-4 text-center">
            <span class="material-symbols-outlined text-[#382615] text-2xl mb-2 block">block</span>
            <p class="text-sm font-bold text-[#382615] font-jakarta">Oposición</p>
            <p class="text-xs text-[#7d571e] mt-1">Oponerte al tratamiento de tus datos</p>
          </div>
        </div>
        <p class="text-[#5a3e28] leading-relaxed mt-4">
          Para ejercer estos derechos (derechos ARCO), contáctanos en
          <strong class="text-[#382615]">vidal.fullstack@gmail.com</strong>. Responderemos en un
          plazo máximo de 20 días hábiles.
        </p>
      </section>

      <!-- 7 -->
      <section class="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(113,62,24,0.06)]">
        <h2 class="text-xl font-bold text-[#382615] font-jakarta mb-4 flex items-center gap-3">
          <span
            class="w-8 h-8 bg-[#F4C07D] rounded-xl flex items-center justify-center text-[#382615] font-black text-sm shrink-0"
            >7</span
          >
          Menores de edad
        </h2>
        <p class="text-[#5a3e28] leading-relaxed">
          WeraWoof está dirigido a personas mayores de 18 años. No recopilamos intencionalmente
          datos de menores de edad. Si eres padre o tutor y crees que tu hijo ha proporcionado datos
          personales, contáctanos de inmediato para eliminarlos.
        </p>
      </section>

      <!-- 8 -->
      <section class="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(113,62,24,0.06)]">
        <h2 class="text-xl font-bold text-[#382615] font-jakarta mb-4 flex items-center gap-3">
          <span
            class="w-8 h-8 bg-[#F4C07D] rounded-xl flex items-center justify-center text-[#382615] font-black text-sm shrink-0"
            >8</span
          >
          Cambios a este aviso
        </h2>
        <p class="text-[#5a3e28] leading-relaxed">
          Nos reservamos el derecho de modificar este Aviso de Privacidad en cualquier momento. Los
          cambios serán publicados en esta misma página con la fecha de actualización. El uso
          continuado de la plataforma después de dichos cambios implica la aceptación de los mismos.
        </p>
      </section>

      <!-- 9 -->
      <section class="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(113,62,24,0.06)]">
        <h2 class="text-xl font-bold text-[#382615] font-jakarta mb-4 flex items-center gap-3">
          <span
            class="w-8 h-8 bg-[#F4C07D] rounded-xl flex items-center justify-center text-[#382615] font-black text-sm shrink-0"
            >9</span
          >
          Contacto
        </h2>
        <p class="text-[#5a3e28] leading-relaxed">
          Si tienes dudas, comentarios o solicitudes relacionadas con este aviso, puedes escribirnos
          a <strong class="text-[#382615]">vidal.fullstack@gmail.com</strong>. Haremos nuestro mejor
          esfuerzo por responderte a la brevedad.
        </p>
      </section>
    </div>

    <div class="mt-12 text-center">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 bg-[#F4C07D] text-[#382615] px-8 py-4 rounded-2xl font-bold font-jakarta hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 active:scale-95"
      >
        <span class="material-symbols-outlined">home</span>
        Volver al inicio
      </NuxtLink>
    </div>
  </div>
</template>
