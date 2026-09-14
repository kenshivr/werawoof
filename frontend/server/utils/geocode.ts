/* Arma la etiqueta legible de una respuesta de Nominatim (OpenStreetMap).
   Nominatim reparte colonia y municipio en claves distintas según la zona
   (en CDMX la colonia suele venir como `neighbourhood` o `suburb` y la
   alcaldía como `city_district` o `borough`): se toma la primera que exista. */

export type NominatimAddress = Record<string, string | undefined>

export interface NominatimReverse {
  address?: NominatimAddress
  error?: string
}

export interface GeocodeResult {
  /** "Roma Norte, Cuauhtémoc, Ciudad de México" */
  label: string
  /** "Cuauhtémoc, Ciudad de México": lo que va en el campo Ciudad del perfil */
  city: string
}

const COLONIA = ['neighbourhood', 'suburb', 'quarter', 'residential', 'hamlet']
const MUNICIPIO = ['city_district', 'borough', 'municipality', 'city', 'town', 'village', 'county']
const ESTADO = ['state', 'region']

const pick = (address: NominatimAddress, keys: string[]) =>
  keys.map((k) => address[k]?.trim()).find((v) => v)

/* Sin repetidos: en Ciudad de México el municipio y el estado se llaman igual */
const joinUnique = (parts: (string | undefined)[]) =>
  parts.filter((v, i): v is string => !!v && parts.indexOf(v) === i).join(', ')

export const buildLabel = (address: NominatimAddress): GeocodeResult => {
  const colonia = pick(address, COLONIA)
  const municipio = pick(address, MUNICIPIO)
  const estado = pick(address, ESTADO)
  return {
    label: joinUnique([colonia, municipio, estado]),
    city: joinUnique([municipio, estado]),
  }
}
