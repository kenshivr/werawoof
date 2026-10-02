const SITE_URL = 'https://werawoof.com'

/* Sets the canonical link and og:url for the current route, so every page
   declares its own URL instead of sharing the home one. */
export const useCanonical = () => {
  const path = useRoute().path
  const href = SITE_URL + (path.length > 1 ? path.replace(/\/+$/, '') : '')

  useHead({ link: [{ rel: 'canonical', href }] })
  useSeoMeta({ ogUrl: href })
}
