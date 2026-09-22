/* Porcentaje que representa `part` sobre `total` (0-100). Sin total válido
   devuelve 0: cada lado de un par (likes/dislikes, mobile/desktop) se
   calcula por separado, nunca como `100 - otro`, porque con la BD vacía
   eso mostraba 100% en el lado restado. */
export const shareOf = (part: number, total: number): number =>
  Number.isFinite(total) && total > 0 ? (part / total) * 100 : 0
