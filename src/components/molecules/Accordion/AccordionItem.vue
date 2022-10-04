<template>
  <div class="accordion-panel">
    <div class="title-wrap" @click="onTitleClick">
      <slot name="title"></slot>
    </div>
    <Transition @enter="onEnter" @leave="onLeave">
      <div class="content-wrap" v-if="state.isOpen">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, reactive, ref } from 'vue'
import { animationFramePromise, defaultAnimationBezier, timeoutPromise } from '../../../core/services/AnimationService';
import { AccordionService } from './AccordionService'


const contentHeight = ref(0)
const animationDurationMs = 150
const animationBezier = defaultAnimationBezier

const state = reactive({
  isOpen: false,
  index: null,
  isFirst: false,
  isLast: false
})

const emits = defineEmits([
  'titleClick',
  'onOpen',
  'onClose'
])

const accordionService: AccordionService | undefined = inject('accordionService')

if (!accordionService)
  throw new Error('AccordionItem must be a child of Accordion')

const onTitleClick = async () => {
  if (state.isOpen == true)
    state.isOpen = false
  else {
    accordionService.closeAll()
    state.isOpen = true
  }
}

onMounted(() => {
  accordionService.registerItemState(state)
})



// called one frame after the element is inserted.
// use this to start the entering animation.
async function onEnter(el: HTMLElement, done: Function) {
  // This animation is relatively complex 
  // but provides smooth transition when
  // showing the element

  // First we need the full rendered height of the content
  // so we will cache it.
  // By default this element has a css visibility of hidden so
  // it will fully render but not be visible to the user.
  if (!contentHeight.value)
    contentHeight.value = el.clientHeight

  // Once we have cached the client's height
  // we will reset it to 0 and set the opacity to 0
  el.style.height = '0px'
  el.style.opacity = '0'

  // We will pause one animation frame to give the renderer
  // time to adjust the values
  await animationFramePromise()

  // Then with the opacity and height artificially hiding
  // the now rendered component, we will set its visibility
  // to visible so when we actually animate it in,
  // it will appear
  el.style.visibility = "visible"

  // We will also set the transition 
  // property at this point, instead of in the CSS
  // because when we first set it to 0
  // we don't want it to be delayed
  el.style.transition = `all ${animationDurationMs}ms ${animationBezier}`

  // With everything set up in place we 
  // will pause one more animation frame to give
  // the browser time to apply all the css properties
  await animationFramePromise()

  // Then we will run the animation 
  // by setting the properties with the transition
  // available
  el.style.height = `${contentHeight.value}px`
  el.style.opacity = '1'

  // And wait for the animation to finish
  await timeoutPromise(animationDurationMs + 1)
  done()

}

// called when the leave transition starts.
// use this to start the leaving animation.
async function onLeave(el: HTMLElement, done: Function) {

  // Dirty hack to coordinate animation timing on same frame
  // If multiple items are closing and opening at the same time
  // we want them to start at the same time
  await animationFramePromise()
  await animationFramePromise()

  // When being shown all of the animation properties
  // should still be applied,so we can simply set 
  // this back to height and opacity 0
  el.style.height = '0px'
  el.style.opacity = '0'


  await timeoutPromise(animationDurationMs + 1)

  done()
}



</script>

<style scoped>
.content-wrap {
  visibility: hidden;
  position: relative;
  overflow: hidden;
}

.title-wrap {
  cursor: pointer;
  background-color: whitesmoke;
  padding: 0.8em;
  border-bottom: 1px solid lightgray;
}
</style>