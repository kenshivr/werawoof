/* Injects one JSON-LD block into the page head. The fixed key makes a page's
   call replace the previous one instead of adding a duplicate script. unhead
   escapes "<" in JSON-LD when it serializes the tag, so a "</script>" inside a
   string cannot close the element early. */
export const useJsonLd = (data: Record<string, unknown> | Record<string, unknown>[]) => {
  useHead({
    script: [{ key: 'json-ld', type: 'application/ld+json', innerHTML: JSON.stringify(data) }],
  })
}
