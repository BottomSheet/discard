import { describe, expect, it } from 'vitest'
import { SLIDE_FILL_OVERSHOOT, SLIDE_THUMB_INSET, clampSlideOffset, getSlideFillOpacity, getSlideFillWidth, getSlideTravel } from '../src/utils/slideGeometry'

describe('геометрия слайдера', () => {
  const track = 320
  const thumb = 80
  const travel = getSlideTravel(track, thumb)

  it('при отсутствии жеста заливка полностью скрыта', () => {
    expect(travel).toBe(234)
    expect(getSlideFillWidth(0, travel, thumb)).toBe(0)
    expect(getSlideFillOpacity(0, travel)).toBe(0)
  })

  it('идёт на 5px правее ползунка, но не выходит за трек', () => {
    for (const offset of [1, 38, 145, 200]) {
      const expected = offset + SLIDE_THUMB_INSET + thumb + SLIDE_FILL_OVERSHOOT
      expect(getSlideFillWidth(offset, travel, thumb)).toBe(expected)
    }
    expect(getSlideFillWidth(38, travel, thumb)).toBe(126)
    expect(getSlideFillOpacity(38, travel)).toBe(1)
  })

  it('в конце ограничена шириной дорожки', () => {
    expect(getSlideFillWidth(travel, travel, thumb)).toBe(track)
    expect(getSlideFillWidth(500, travel, thumb)).toBe(track)
    expect(clampSlideOffset(-22, travel)).toBe(0)
  })

  it('остаётся корректной на очень узких экранах', () => {
    expect(getSlideTravel(50, thumb)).toBe(0)
    expect(getSlideFillWidth(12, 0, thumb)).toBe(0)
    expect(getSlideFillOpacity(12, 0)).toBe(0)
  })
})
