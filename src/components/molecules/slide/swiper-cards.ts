import { inject, ref, watch } from 'vue'
import { THEME } from '~/constants'

export default function useSwiperCards (cardBreakPoints: any) {
  const { breakpoints } = inject(THEME)!
  const container = ref()
  const swiper = ref()
  const slidesPerView = ref(0)
  const currentSlide = ref(0)
  const mo = ref()
  const containerW = ref(0)

  const onSwiper = (_swiper) => {
    swiper.value = _swiper
  }

  const onSlideChange = (_swiper) => {
    swiper.value = _swiper
    currentSlide.value = _swiper.activeIndex || 0
  }

  watch(container, (_container) => {
    if (!_container) {
      return
    }

    containerW.value = _container?.getBoundingClientRect()?.width
    mo.value?.observe(_container, {
      attributes: true,
      childList: true,
      subtree: true,
    })
  })

  const onResizeHandler = () => {
    const clientWidth = container.value?.clientWidth
    const windowWidth = window.innerWidth
    const spaceBetween = cardBreakPoints.spaceBetween || 8

    if (clientWidth) {
      if (cardBreakPoints.slidePerSmView !== undefined && windowWidth <= breakpoints.sm) {
        slidesPerView.value = cardBreakPoints.slidePerSmView
      } else if (cardBreakPoints.slidePerLgView !== undefined && windowWidth >= breakpoints.lg) {
        slidesPerView.value = cardBreakPoints.slidePerLgView
      } else if (cardBreakPoints.slidePerMdView !== undefined && windowWidth >= breakpoints.md) {
        slidesPerView.value = cardBreakPoints.slidePerMdView
      } else {
        let _cardSize = cardBreakPoints.default
        if (cardBreakPoints.lg && windowWidth >= breakpoints.lg) {
          _cardSize = cardBreakPoints.lg
        } else if (cardBreakPoints.md && windowWidth >= breakpoints.md) {
          _cardSize = cardBreakPoints.md
        } else if (cardBreakPoints.sm && windowWidth >= breakpoints.sm) {
          _cardSize = cardBreakPoints.sm
        }
        const perView = (clientWidth / (_cardSize + spaceBetween)).toFixed(1)
        slidesPerView.value = Number(perView)
      }
    }
  }

  const mutationHandler = () => {
    if (container.value?.clientWidth && containerW.value !== container.value?.clientWidth) {
      containerW.value = container.value.clientWidth

      onResizeHandler()
    }
  }

  const init = () => {
    onResizeHandler()
    mo.value = new MutationObserver(mutationHandler)
  }

  const destroy = () => mo.value?.disconnect()

  return {
    container,
    swiper,
    slidesPerView,
    currentSlide,
    onSwiper,
    onSlideChange,
    init,
    destroy
  }
}
