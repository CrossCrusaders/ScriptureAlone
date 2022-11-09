<template>
  <div class="relative">
    <swiper :modules="modules" :slides-per-view="slidesPerView" :space-between="50" navigation
      :pagination="{ clickable: true }" :scrollbar="{ draggable: true }">
      <swiper-slide v-for="slide of props.slides" :key="slide.title">
        <div class="h-56">
          <RouterLink :to="`/${props.baseUrl}/${slide.id}` || '/'">
            <img class="object-cover w-full h-full" :src="slide.coverImage || slide.author?.profileImage || '/logo-bible.png'" />
          </RouterLink>
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
import { Author } from '../../authors/Author';

export interface ContentSlide {
  coverImage?: string
  title?: string
  id?: string
  author?: Author
}

export interface ContentCarouselProps {
  slides: ContentSlide[]
  baseUrl: string
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