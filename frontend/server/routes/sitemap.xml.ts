import { guias } from '../../content/guias'

const SITE_URL = 'https://werawoof.com'

/* lastmod is updated by hand, only when that page's content changes. A build date would mark
   every page as changed on each deploy, and Google ignores lastmod once it proves inaccurate. */
const pages = [
  { path: '/', lastmod: '2026-10-02', changefreq: 'weekly', priority: '1.0' },
  { path: '/quienes-somos', lastmod: '2026-10-02', changefreq: 'monthly', priority: '0.7' },
  { path: '/comunidad', lastmod: '2026-10-02', changefreq: 'weekly', priority: '0.7' },
  { path: '/guias', lastmod: '2026-10-04', changefreq: 'weekly', priority: '0.8' },
  ...guias.map((g) => ({
    path: `/guias/${g.slug}`,
    lastmod: g.dateModified,
    changefreq: 'monthly',
    priority: '0.7',
  })),
  { path: '/contacto', lastmod: '2026-10-02', changefreq: 'yearly', priority: '0.5' },
  {
    path: '/politica-de-privacidad',
    lastmod: '2026-10-02',
    changefreq: 'yearly',
    priority: '0.3',
  },
  { path: '/terminos-de-servicio', lastmod: '2026-10-02', changefreq: 'yearly', priority: '0.3' },
]

export default defineEventHandler((event) => {
  const urls = pages
    .map(
      (p) =>
        `  <url>\n    <loc>${SITE_URL}${p.path === '/' ? '' : p.path}</loc>\n` +
        `    <lastmod>${p.lastmod}</lastmod>\n` +
        `    <changefreq>${p.changefreq}</changefreq>\n` +
        `    <priority>${p.priority}</priority>\n  </url>`
    )
    .join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `${urls}\n</urlset>\n`
  )
})
