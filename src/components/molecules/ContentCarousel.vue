<template>
  <div class="relative">
    <swiper :modules="modules" :slides-per-view="slidesPerView" :space-between="50" navigation
      :pagination="{ clickable: true }" :scrollbar="{ draggable: true }">
      <swiper-slide v-for="slide of props.slides" :key="slide.title">
        <div class="h-48 bg-gray-200 flex justify-center items-center overflow-hidden">
          <a :href="slide.link" class="flex justify-center items-center overflow-hidden">
            <img style="object-fit: cover;" :src="slide.image" />
          </a>
        </div>
        <p class="z-10 font-bold mb-8">{{ slide.title }}</p>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { useBreakpoint } from '../../browser/ViewportService';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { computed } from 'vue'

export interface ContentSlide {
  image?: string
  title?: string
  link?: string
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