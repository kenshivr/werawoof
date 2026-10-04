<script setup lang="ts">
import { guias } from '~/content/guias'

definePageMeta({ layout: false })
useCanonical()

const SITE_URL = 'https://werawoof.com'
const pageUrl = `${SITE_URL}/guias`
const title = 'Guías para dueños de perros · WeraWoof'
const description =
  'Guías prácticas para dueños de perros en México: playdates seguros, parques pet friendly en CDMX, cómo socializar a un perro tímido y más.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterTitle: title,
  twitterDescription: description,
})

useJsonLd({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${pageUrl}#collection`,
      url: pageUrl,
      name: title,
      description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      inLanguage: 'es-MX',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: guias.map((g, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${pageUrl}/${g.slug}`,
          name: g.title,
        })),
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Guías', item: pageUrl },
      ],
    },
  ],
})
</script>

<template>
  <div class="bg-[#DBD8D0] min-h-screen flex flex-col font-vietnam">
    <LayoutPublicHeader />

    <main class="flex-1">
      <section class="bg-[#382615] pt-28 pb-16 px-6 text-center">
        <span
          class="inline-block px-4 py-1 bg-white/10 text-[#F4C07D] text-sm font-medium rounded-full mb-5 border border-white/10 font-jakarta"
        >
          Guías WeraWoof
        </span>
        <h1 class="text-4xl md:text-5xl font-extrabold text-white font-jakarta leading-tight mb-4">
          Guías para dueños de perros
        </h1>
        <p class="text-white/70 text-lg max-w-xl mx-auto">
          Consejos prácticos para que tu perro conozca amigos, pasee con tranquilidad y se sienta
          seguro en cada encuentro.
        </p>
      </section>

      <div class="max-w-5xl mx-auto w-full px-6 py-14">
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <li v-for="guia in guias" :key="guia.slug">
            <NuxtLink
              :to="`/guias/${guia.slug}`"
              class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] p-6 flex flex-col gap-3 h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
            >
              <span class="text-sm text-[#7d571e] font-medium font-jakarta">
                {{ guia.readingMinutes }} min de lectura
              </span>
              <h2 class="text-xl font-bold text-[#382615] font-jakarta leading-snug">
                {{ guia.title }}
              </h2>
              <p class="text-[#4f4539] leading-relaxed">{{ guia.description }}</p>
              <span class="mt-auto inline-flex items-center gap-1 text-[#7d571e] font-semibold">
                Leer guía
                <span class="material-symbols-outlined text-base">arrow_forward</span>
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </main>

    <LayoutPublicFooter />
    <LayoutPublicBottomNav />
  </div>
</template>
