<template>
  <div class="relative">
    <swiper :modules="modules" :slides-per-view="slidesPerView" :space-between="50" navigation
      :pagination="{ clickable: true }" :scrollbar="{ draggable: true }">
      <swiper-slide v-for="slide of props.slides" :key="slide.title">
        <div class="h-48 bg-gray-200 flex justify-center items-center">
          {{ slide.title }}
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { useBreakpoint } from '../../services/ViewportService';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { computed } from 'vue'

export interface ContentSlide {
  imgSrc?: string
  title?: string
  href?: string
}

export interface ContentCarouselProps {
  slides: ContentSlide[]

}

const modules = [Navigation, Pagination, Scrollbar, A11y]
const props = defineProps<ContentCarouselProps>()

const { breakpoint } = useBreakpoint()

const slidesPerView = computed(() => {
  switch (breakpoint.value) {
    case 'sm':
      return 1
    case 'md':
      return 3
    case 'lg':
      return 4
  }
})
</script>