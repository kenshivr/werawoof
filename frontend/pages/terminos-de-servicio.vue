<script setup lang="ts">
definePageMeta({ layout: false })
</script>

<template>
  <div
    class="bg-[#DBD8D0] text-on-background font-vietnam overflow-x-hidden min-h-screen flex flex-col"
  >
    <LayoutSimpleHeader />

    <!-- Paw decorations -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <span
        class="material-symbols-outlined absolute text-[#382615] opacity-[0.05] text-8xl top-40 left-[10%]"
        style="transform: rotate(-25deg)"
        >pets</span
      >
      <span
        class="material-symbols-outlined absolute text-[#382615] opacity-[0.05] text-5xl top-64 right-[15%]"
        style="transform: rotate(15deg)"
        >pets</span
      >
      <span
        class="material-symbols-outlined absolute text-[#382615] opacity-[0.05] text-9xl bottom-48 left-[20%]"
        style="transform: rotate(45deg)"
        >pets</span
      >
      <span
        class="material-symbols-outlined absolute text-[#382615] opacity-[0.05] text-6xl bottom-28 right-[5%]"
        style="transform: rotate(-10deg)"
        >pets</span
      >
      <span
        class="material-symbols-outlined absolute text-[#382615] opacity-[0.05] text-7xl top-1/2 left-[5%]"
        style="transform: rotate(180deg)"
        >pets</span
      >
    </div>

    <!-- Content -->
    <main class="flex-1 pt-28 pb-16 px-6 relative z-10">
      <div class="max-w-3xl mx-auto">
        <!-- Page title -->
        <div class="mb-12">
          <span
            class="inline-flex items-center gap-2 text-[#7d571e] text-sm font-medium uppercase tracking-widest mb-4"
          >
            <span class="material-symbols-outlined text-base">description</span>
            Legal
          </span>
          <h1
            class="text-[36px] md:text-[48px] font-extrabold text-[#382615] font-jakarta leading-tight"
          >
            Términos de Servicio
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
              Aceptación de los términos
            </h2>
            <p class="text-[#5a3e28] leading-relaxed">
              Al acceder o usar WeraWoof (el "Servicio"), aceptas quedar vinculado por estos
              Términos de Servicio. Si no estás de acuerdo con alguna parte de estos términos, no
              debes usar el Servicio. El uso continuado de la plataforma implica la aceptación plena
              de estos términos en su versión vigente.
            </p>
          </section>

          <!-- 2 -->
          <section class="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(113,62,24,0.06)]">
            <h2 class="text-xl font-bold text-[#382615] font-jakarta mb-4 flex items-center gap-3">
              <span
                class="w-8 h-8 bg-[#F4C07D] rounded-xl flex items-center justify-center text-[#382615] font-black text-sm shrink-0"
                >2</span
              >
              Descripción del Servicio
            </h2>
            <p class="text-[#5a3e28] leading-relaxed">
              WeraWoof es una plataforma digital
              <strong class="text-[#382615]">completamente gratuita</strong> que permite a dueños de
              canes crear perfiles para sus mascotas, conectarse con otros dueños y organizar
              encuentros. No cobramos ninguna tarifa por el uso del Servicio y no procesamos pagos
              de ningún tipo.
            </p>
            <p class="text-[#5a3e28] leading-relaxed mt-4">
              Nos reservamos el derecho de modificar, suspender o discontinuar el Servicio —total o
              parcialmente— en cualquier momento y sin previo aviso ni responsabilidad hacia los
              usuarios.
            </p>
          </section>

          <!-- 3 -->
          <section class="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(113,62,24,0.06)]">
            <h2 class="text-xl font-bold text-[#382615] font-jakarta mb-4 flex items-center gap-3">
              <span
                class="w-8 h-8 bg-[#F4C07D] rounded-xl flex items-center justify-center text-[#382615] font-black text-sm shrink-0"
                >3</span
              >
              Registro y cuenta de usuario
            </h2>
            <ul class="space-y-3 text-[#5a3e28]">
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
                  >check_circle</span
                >
                Debes tener al menos <strong class="text-[#382615]">18 años</strong> para crear una
                cuenta.
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
                  >check_circle</span
                >
                Eres responsable de mantener la confidencialidad de tu contraseña y de toda
                actividad que ocurra bajo tu cuenta.
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
                  >check_circle</span
                >
                Debes proporcionar información verídica al registrarte. No puedes crear cuentas
                falsas ni hacerse pasar por otra persona.
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
                  >check_circle</span
                >
                Puedes eliminar tu cuenta en cualquier momento desde la configuración de tu perfil.
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
              Conducta del usuario
            </h2>
            <p class="text-[#5a3e28] leading-relaxed mb-4">
              Al usar WeraWoof, aceptas <strong class="text-[#382615]">no</strong>:
            </p>
            <ul class="space-y-3 text-[#5a3e28]">
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-red-400 text-lg mt-0.5 shrink-0"
                  >cancel</span
                >
                Publicar contenido falso, engañoso, ofensivo, obsceno o que viole derechos de
                terceros.
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-red-400 text-lg mt-0.5 shrink-0"
                  >cancel</span
                >
                Acosar, amenazar o intimidar a otros usuarios.
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-red-400 text-lg mt-0.5 shrink-0"
                  >cancel</span
                >
                Usar el Servicio para fines comerciales no autorizados, spam o publicidad no
                solicitada.
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-red-400 text-lg mt-0.5 shrink-0"
                  >cancel</span
                >
                Intentar acceder a cuentas de otros usuarios o a sistemas internos de la plataforma.
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-red-400 text-lg mt-0.5 shrink-0"
                  >cancel</span
                >
                Usar bots, scrapers u otros medios automatizados para interactuar con el Servicio.
              </li>
            </ul>
            <p class="text-[#5a3e28] leading-relaxed mt-4">
              Nos reservamos el derecho de suspender o eliminar cuentas que infrinjan estas reglas,
              sin previo aviso y sin responsabilidad.
            </p>
          </section>

          <!-- 5 -->
          <section class="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(113,62,24,0.06)]">
            <h2 class="text-xl font-bold text-[#382615] font-jakarta mb-4 flex items-center gap-3">
              <span
                class="w-8 h-8 bg-[#F4C07D] rounded-xl flex items-center justify-center text-[#382615] font-black text-sm shrink-0"
                >5</span
              >
              Contenido generado por usuarios
            </h2>
            <p class="text-[#5a3e28] leading-relaxed mb-4">
              Al publicar fotos, descripciones u otro contenido en WeraWoof, declaras que:
            </p>
            <ul class="space-y-3 text-[#5a3e28]">
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
                  >check_circle</span
                >
                Tienes los derechos necesarios para publicar dicho contenido.
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
                  >check_circle</span
                >
                Le otorgas a WeraWoof una licencia no exclusiva, gratuita y mundial para mostrar ese
                contenido dentro de la plataforma.
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-[#F4C07D] text-lg mt-0.5 shrink-0"
                  >check_circle</span
                >
                Eres el único responsable del contenido que publicas y de sus consecuencias.
              </li>
            </ul>
          </section>

          <!-- 6 — DISCLAIMER -->
          <section class="bg-[#382615] rounded-2xl p-8 shadow-[0_4px_20px_rgba(56,38,21,0.2)]">
            <h2 class="text-xl font-bold text-[#F4C07D] font-jakarta mb-4 flex items-center gap-3">
              <span class="material-symbols-outlined text-[#F4C07D]">warning</span>
              Exclusión de garantías y limitación de responsabilidad
            </h2>
            <div class="space-y-4 text-white/80 leading-relaxed">
              <p>
                El Servicio se proporciona
                <strong class="text-white">"tal como está" y "según disponibilidad"</strong>, sin
                garantías de ningún tipo, ya sean expresas o implícitas. WeraWoof no garantiza que
                el Servicio sea ininterrumpido, libre de errores, seguro o que los resultados
                obtenidos sean precisos o confiables.
              </p>
              <p>
                <strong class="text-white"
                  >WeraWoof no verifica la identidad de sus usuarios ni la exactitud de la
                  información publicada.</strong
                >
                Los perfiles, fotografías y descripciones son responsabilidad exclusiva de quien los
                publica. La plataforma actúa únicamente como intermediario tecnológico.
              </p>
              <p>
                WeraWoof <strong class="text-white">no es responsable</strong> de los encuentros
                físicos entre usuarios, ni de cualquier daño, lesión, pérdida o perjuicio —directo o
                indirecto— que pueda derivarse del uso del Servicio o de los contactos establecidos
                a través de él.
              </p>
              <p>
                En ningún caso la responsabilidad total de WeraWoof hacia un usuario excederá la
                cantidad de <strong class="text-white">$0.00 MXN</strong>, dado que el Servicio es
                completamente gratuito.
              </p>
            </div>
          </section>

          <!-- 7 -->
          <section class="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(113,62,24,0.06)]">
            <h2 class="text-xl font-bold text-[#382615] font-jakarta mb-4 flex items-center gap-3">
              <span
                class="w-8 h-8 bg-[#F4C07D] rounded-xl flex items-center justify-center text-[#382615] font-black text-sm shrink-0"
                >7</span
              >
              Propiedad intelectual
            </h2>
            <p class="text-[#5a3e28] leading-relaxed">
              El nombre "WeraWoof", el logotipo, el diseño de la plataforma y todo el contenido
              original son propiedad de WeraWoof y están protegidos por las leyes de propiedad
              intelectual aplicables en México. No puedes reproducir, distribuir ni crear obras
              derivadas sin autorización expresa por escrito.
            </p>
          </section>

          <!-- 8 -->
          <section class="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(113,62,24,0.06)]">
            <h2 class="text-xl font-bold text-[#382615] font-jakarta mb-4 flex items-center gap-3">
              <span
                class="w-8 h-8 bg-[#F4C07D] rounded-xl flex items-center justify-center text-[#382615] font-black text-sm shrink-0"
                >8</span
              >
              Ley aplicable y jurisdicción
            </h2>
            <p class="text-[#5a3e28] leading-relaxed">
              Estos Términos se rigen por las leyes de los
              <strong class="text-[#382615]">Estados Unidos Mexicanos</strong>. Cualquier
              controversia derivada de su interpretación o cumplimiento será sometida a la
              jurisdicción de los tribunales competentes de la Ciudad de México, renunciando a
              cualquier otro fuero que pudiera corresponder.
            </p>
          </section>

          <!-- 9 -->
          <section class="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(113,62,24,0.06)]">
            <h2 class="text-xl font-bold text-[#382615] font-jakarta mb-4 flex items-center gap-3">
              <span
                class="w-8 h-8 bg-[#F4C07D] rounded-xl flex items-center justify-center text-[#382615] font-black text-sm shrink-0"
                >9</span
              >
              Modificaciones
            </h2>
            <p class="text-[#5a3e28] leading-relaxed">
              Podemos actualizar estos Términos en cualquier momento. Los cambios entran en vigor al
              publicarse en esta página con la nueva fecha de actualización. El uso continuado del
              Servicio tras la publicación implica la aceptación de los nuevos términos.
            </p>
          </section>

          <!-- 10 -->
          <section class="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(113,62,24,0.06)]">
            <h2 class="text-xl font-bold text-[#382615] font-jakarta mb-4 flex items-center gap-3">
              <span
                class="w-8 h-8 bg-[#F4C07D] rounded-xl flex items-center justify-center text-[#382615] font-black text-sm shrink-0"
                >10</span
              >
              Contacto
            </h2>
            <p class="text-[#5a3e28] leading-relaxed">
              Para cualquier duda o aclaración sobre estos Términos, escríbenos a
              <strong class="text-[#382615]">vidal.fullstack@gmail.com</strong>.
            </p>
          </section>
        </div>

        <!-- Back button -->
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
    </main>

    <!-- Footer -->
    <LayoutSimpleFooter />
    <LayoutPublicBottomNav />
  </div>
</template>
