import { ref } from "vue"

let currentTop = 0

export const disablePageScrolling = () => {
  currentTop = window.scrollY
  document.body.style.position = "fixed"
  document.body.style.overflow = "hidden"
  document.body.style.top = `-${currentTop}px`
}

export const enablePageScrolling = () => {
  document.body.style.position = ''
  document.body.style.overflow = ''
}

const scrollTop = ref(0)

window.addEventListener('scroll', () => {
  scrollTop.value = window.scrollY
})

export const useScroll = () => {
  return {
    scrollTop
  }
}

