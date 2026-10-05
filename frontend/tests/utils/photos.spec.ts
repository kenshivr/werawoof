import { describe, expect, it } from 'vitest'
import { MAX_PHOTOS, emptyPhotoSlots } from '~/utils/photos'

/* Cuadros vacíos que quedan por llenar en la grilla de fotos de un perro.
   Crear y editar comparten el mismo tope: cuando no coincidían (6 al
   crear, 5 al editar) un perro con 6 fotos daba `5 - 6 = -1` y Vue
   reventaba el render con `new Array(-1)`, dejando la página en blanco. */
describe('emptyPhotoSlots', () => {
  it('sin fotos deja todos los cuadros libres', () => {
    expect(emptyPhotoSlots(0)).toBe(MAX_PHOTOS)
  })

  it('resta las fotos que ya hay', () => {
    expect(emptyPhotoSlots(2)).toBe(MAX_PHOTOS - 2)
  })

  it('con el tope alcanzado no queda ninguno', () => {
    expect(emptyPhotoSlots(MAX_PHOTOS)).toBe(0)
  })

  it('nunca es negativo aunque haya más fotos que el tope', () => {
    expect(emptyPhotoSlots(MAX_PHOTOS + 3)).toBe(0)
  })
})

describe('MAX_PHOTOS', () => {
  it('el tope es 6', () => {
    expect(MAX_PHOTOS).toBe(6)
  })
})
