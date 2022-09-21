import { Ref, ref } from "vue"


const getCurrentBreakpoint: any = () => {
  if (window.innerWidth >= 1280)
    return 'lg'
  if (window.innerWidth >= 1024)
    return 'md'
  return 'sm'
}

let breakpoint: Ref<any> = ref(getCurrentBreakpoint())

window.addEventListener('resize', () => {
  breakpoint.value = getCurrentBreakpoint()
})

export function useBreakpoint() {
  return { breakpoint }
}