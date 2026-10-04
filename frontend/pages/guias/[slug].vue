<script setup lang="ts">
import { getGuia, guias } from '~/content/guias'

definePageMeta({ layout: false })

const route = useRoute()
const guia = getGuia(String(route.params.slug))
if (!guia) {
  throw createError({ statusCode: 404, statusMessage: 'Guía no encontrada', fatal: true })
}

useCanonical()

const SITE_URL = 'https://werawoof.com'
const pageUrl = `${SITE_URL}/guias/${guia.slug}`
const title = `${guia.metaTitle} · WeraWoof`

useSeoMeta({
  title,
  description: guia.description,
  ogTitle: title,
  ogDescription: guia.description,
  ogType: 'article',
  articlePublishedTime: guia.datePublished,
  articleModifiedTime: guia.dateModified,
  twitterTitle: title,
  twitterDescription: guia.description,
})

const organization = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'WeraWoof',
  url: SITE_URL,
}

useJsonLd({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': `${pageUrl}#article`,
      mainEntityOfPage: pageUrl,
      headline: guia.title,
      description: guia.description,
      image: `${SITE_URL}/og-werawoof.png`,
      datePublished: guia.datePublished,
      dateModified: guia.dateModified,
      inLanguage: 'es-MX',
      author: organization,
      publisher: {
        ...organization,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png` },
      },
      isPartOf: { '@id': `${SITE_URL}/#website` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Guías', item: `${SITE_URL}/guias` },
        { '@type': 'ListItem', position: 3, name: guia.title, item: pageUrl },
      ],
    },
  ],
})

const otherGuias = guias.filter((g) => g.slug !== guia.slug)

/* Fixed UTC formatting so the prerendered HTML and the client agree. */
const publishedLabel = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'long',
  timeZone: 'UTC',
}).format(new Date(guia.datePublished))
</script>

<template>
  <div class="bg-[#DBD8D0] min-h-screen flex flex-col font-vietnam">
    <LayoutPublicHeader />

    <main class="flex-1">
      <article>
        <header class="bg-[#382615] pt-28 pb-14 px-6">
          <div class="max-w-3xl mx-auto">
            <nav aria-label="Migas de pan" class="text-sm text-white/60 mb-6 font-jakarta">
              <NuxtLink to="/" class="hover:text-[#F4C07D] transition-colors">Inicio</NuxtLink>
              <span class="mx-2">/</span>
              <NuxtLink to="/guias" class="hover:text-[#F4C07D] transition-colors">Guías</NuxtLink>
            </nav>
            <h1
              class="text-3xl md:text-5xl font-extrabold text-white font-jakarta leading-tight mb-5"
            >
              {{ guia.title }}
            </h1>
            <p class="text-white/60 text-sm font-jakarta">
              Por WeraWoof · {{ publishedLabel }} · {{ guia.readingMinutes }} min de lectura
            </p>
          </div>
        </header>

        <div class="max-w-3xl mx-auto px-6 py-12">
          <p class="text-xl text-[#382615] leading-relaxed font-medium mb-10">
            {{ guia.intro }}
          </p>

          <section v-for="section in guia.sections" :key="section.heading" class="mb-10">
            <h2 class="text-2xl md:text-3xl font-bold text-[#7d571e] font-jakarta mb-4">
              {{ section.heading }}
            </h2>
            <template v-for="(block, i) in section.blocks" :key="i">
              <h3
                v-if="block.type === 'h3'"
                class="text-xl font-bold text-[#382615] font-jakarta mt-6 mb-3"
              >
                {{ block.text }}
              </h3>
              <p v-else-if="block.type === 'p'" class="text-[#4f4539] leading-relaxed mb-4">
                {{ block.text }}
              </p>
              <ul
                v-else-if="block.type === 'ul'"
                class="list-disc pl-6 mb-4 space-y-2 text-[#4f4539] leading-relaxed"
              >
                <li v-for="item in block.items" :key="item">{{ item }}</li>
              </ul>
              <ol v-else class="list-decimal pl-6 mb-4 space-y-2 text-[#4f4539] leading-relaxed">
                <li v-for="item in block.items" :key="item">{{ item }}</li>
              </ol>
            </template>
          </section>

          <!-- Soft CTA -->
          <aside class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] p-8 mt-12">
            <h2 class="text-2xl font-bold text-[#382615] font-jakarta mb-3">
              Encuentra amigos para tu perro en WeraWoof
            </h2>
            <p class="text-[#4f4539] leading-relaxed mb-6">
              Crea el perfil de tu perro gratis, haz swipe entre perros cercanos y chatea con sus
              dueños para organizar tu primer paseo o playdate.
            </p>
            <NuxtLink
              to="/auth/register"
              class="inline-flex items-center gap-2 bg-[#F4C07D] text-[#382615] font-medium px-8 py-4 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-200 font-jakarta"
            >
              Crear mi cuenta
              <span class="material-symbols-outlined">arrow_forward</span>
            </NuxtLink>
          </aside>

          <!-- Other guides -->
          <nav aria-label="Otras guías" class="mt-12">
            <h2 class="text-xl font-bold text-[#382615] font-jakarta mb-4">Sigue leyendo</h2>
            <ul class="space-y-3">
              <li v-for="other in otherGuias" :key="other.slug">
                <NuxtLink
                  :to="`/guias/${other.slug}`"
                  class="text-[#7d571e] font-semibold underline hover:text-[#382615] transition-colors"
                >
                  {{ other.title }}
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
      </article>
    </main>

    <LayoutPublicFooter />
    <LayoutPublicBottomNav />
  </div>
</template>
