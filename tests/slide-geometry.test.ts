import { describe, expect, it } from 'vitest'
import { clampSlideOffset, getSlideFillOpacity, getSlideFillWidth, getSlideTravel } from '../src/utils/slideGeometry'

describe('геометрия слайдера по примеру Flutter', () => {
  const track = 320
  const thumb = 80
  const travel = getSlideTravel(track, thumb)

  it('в покое не показывает заливку, включая под ползунком', () => {
    expect(travel).toBe(234)
    expect(getSlideFillWidth(0, travel, thumb)).toBe(0)
    expect(getSlideFillOpacity(0, travel)).toBe(0)
  })

  it('во время жеста заливка доходит до правого края ползунка', () => {
    expect(getSlideFillWidth(38, travel, thumb)).toBe(124)
    expect(getSlideFillWidth(145, travel, thumb)).toBe(231)
    expect(getSlideFillOpacity(38, travel)).toBe(1)
  })

  it('при полном свайпе заполняет трек без перелива за его границы', () => {
    expect(getSlideFillWidth(travel, travel, thumb)).toBe(track)
    expect(getSlideFillWidth(500, travel, thumb)).toBe(track)
    expect(clampSlideOffset(-22, travel)).toBe(0)
  })

  it('не ломается на очень узком треке', () => {
    expect(getSlideTravel(50, thumb)).toBe(0)
    expect(getSlideFillWidth(12, 0, thumb)).toBe(0)
    expect(getSlideFillOpacity(12, 0)).toBe(0)
  })
})
