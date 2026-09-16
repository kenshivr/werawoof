import { describe, expect, it } from 'vitest'
import { shareOf } from '~/utils/percent'

/* Porcentaje de una parte sobre un total. El dashboard admin lo usa para
   likes/dislikes y mobile/desktop: sin datos, ambos lados deben dar 0, no
   100 (bug del 16-sep: "100.0% de dislikes" con la BD vacía). */
describe('shareOf', () => {
  it('devuelve 0 cuando el total es 0', () => {
    expect(shareOf(0, 0)).toBe(0)
  })

  it('devuelve 0 para la parte complementaria cuando el total es 0', () => {
    const likes = 0
    const dislikes = 0
    expect(shareOf(dislikes, likes + dislikes)).toBe(0)
  })

  it('calcula el porcentaje de la parte sobre el total', () => {
    expect(shareOf(3, 4)).toBe(75)
    expect(shareOf(1, 4)).toBe(25)
  })

  it('suma 100 entre las dos partes cuando hay datos', () => {
    const likes = 7
    const dislikes = 3
    expect(shareOf(likes, 10) + shareOf(dislikes, 10)).toBe(100)
  })

  it('devuelve 0 con un total negativo o no numérico', () => {
    expect(shareOf(1, -5)).toBe(0)
    expect(shareOf(1, Number.NaN)).toBe(0)
  })
})
