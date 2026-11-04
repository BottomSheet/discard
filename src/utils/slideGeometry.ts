/** Единая система координат для дорожки, заливки и ползунка. */
export const SLIDE_THUMB_INSET = 3
export const SLIDE_FILL_OVERSHOOT = 5

export function getSlideTravel(trackWidth: number, thumbWidth: number, inset = SLIDE_THUMB_INSET): number {
  return Math.max(0, trackWidth - thumbWidth - inset * 2)
}

export function clampSlideOffset(value: number, travel: number): number {
  return Math.max(0, Math.min(value, travel))
}

/**
 * В начале заливки нет вовсе. Когда ползунок движется, заливка проходит
 * под ним и выглядывает на 5px правее его видимой границы.
 * В конце дорожки не допускаем переполнения за скругления.
 */
export function getSlideFillWidth(
  offset: number,
  travel: number,
  thumbWidth: number,
  inset = SLIDE_THUMB_INSET,
  overshoot = SLIDE_FILL_OVERSHOOT,
): number {
  const clamped = clampSlideOffset(offset, travel)
  if (clamped <= 0 || travel <= 0) return 0
  const trackWidth = travel + thumbWidth + inset * 2
  return Math.min(trackWidth, clamped + inset + thumbWidth + overshoot)
}

export function getSlideFillOpacity(offset: number, travel: number): number {
  if (travel <= 0) return 0
  return Math.min(1, Math.max(0, offset / travel) / 0.06)
}
