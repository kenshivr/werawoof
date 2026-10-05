/* Tope de fotos por perro. Lo comparten crear y editar: cuando cada
   página tenía el suyo (6 y 5) un perro con 6 fotos hacía que la grilla
   de editar pidiera `5 - 6 = -1` cuadros vacíos y Vue reventaba el render
   con `new Array(-1)`, dejando la página en blanco. */
export const MAX_PHOTOS = 6

/* Cuadros vacíos que quedan por llenar; nunca negativo. */
export const emptyPhotoSlots = (count: number): number => Math.max(0, MAX_PHOTOS - count)
