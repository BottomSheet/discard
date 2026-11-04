/** Геометрия подтверждения жестом. Все величины относятся к одному треку.
 * inset — одинаковый отступ ползунка от левого и правого краёв.
 */
export const SLIDE_THUMB_INSET = 3

export function getSlideTravel(trackWidth: number, thumbWidth: number, inset = SLIDE_THUMB_INSET): number {
  return Math.max(0, trackWidth - thumbWidth - inset * 2)
}

export function clampSlideOffset(value: number, travel: number): number {
  return Math.max(0, Math.min(value, travel))
}

/**
 * По примеру Flutter-заполнения: до первого движения заливка скрыта.
 * Далее она идёт от начала трека до ПРАВОГО края ползунка и находится под ним.
 * Прозрачность начала управляется отдельно, чтобы не было розового пятна в покое.
 */
export function getSlideFillWidth(
  offset: number,
  travel: number,
  thumbWidth: number,
  inset = SLIDE_THUMB_INSET,
): number {
  const clamped = clampSlideOffset(offset, travel)
  return clamped <= 0 || travel <= 0 ? 0 : clamped + thumbWidth + inset * 2
}

export function getSlideFillOpacity(offset: number, travel: number): number {
  if (travel <= 0) return 0
  return Math.min(1, Math.max(0, offset / travel) / 0.06)
}
