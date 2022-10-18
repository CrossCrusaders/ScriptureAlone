<template>
  <div class="flex flex-col md:flex-row gap-4 md:items-center items-start flex-wrap">

    <a class="py-1 px-2 border-b-[3px] border-solid bg-transparent border-slate-400 w-full md:w-auto"
      @click="onCountryClick()">USA</a>

    <USStateSelect class="w-full md:w-auto" v-model="currentState" placeholder="Select State"></USStateSelect>

    <AppSelect class="w-full md:w-auto" placeholder="Select City" v-model="currentCity" v-if="currentState">
      <option v-for="city of citiesInSelectedState">
        {{ city.name }}
      </option>
    </AppSelect>

    <AppSelect class="w-full md:w-auto" v-if="currentCity" placeholder="Select Church" v-model="currentChurch">
      <option v-for="church of churchesInSelectedCity" :value="church.id">
        {{ church.name }}
      </option>
    </AppSelect>

    <AppButton @click="onApplyClick()" class="w-full md:w-auto" v-if="currentChurch" variant="accent">
      Apply
    </AppButton>


    <AppButton @click="onResetClick()" class="w-full md:w-auto" v-if="currentState" variant="primary-minimal">
      Reset
    </AppButton>

  </div>

  <AppModal v-model="showCountrySelectionModal" v-slot="{ close }">
    <div class="p4">
      <p class="max-w-prose mb-4">We are currently working hard to add international content. We appreciate your
        patience!</p>
      <AppButton @click="close">Okay</AppButton>
    </div>
  </AppModal>
</template>

<script setup lang="ts">

import { ref, watch } from 'vue';
import USStateSelect from '../../components/molecules/USStateSelect.vue'
import AppModal from '../../components/templates/AppModal.vue'
import AppButton from '../../components/atoms/form-controls/AppButton.vue'
import { getChurchesByState } from '../../church/services/ChurchService'
import { Church } from '../../church/Church';
import AppSelect from '../atoms/form-controls/AppSelect.vue';
import { computed } from '@vue/reactivity';

const emit = defineEmits(['update:church'])

// Country
const showCountrySelectionModal = ref(false)
const onCountryClick = () => {
  showCountrySelectionModal.value = true
}


// City
const currentCity = ref('')
const churchesInSelectedCity = computed(() => {
  if (!churchesInSelectedState.value)
    return []
  return churchesInSelectedState.value.filter(church => church.city?.toLowerCase().trim() === currentCity.value.toLowerCase().trim())
})

// Church
const currentChurch = ref<string>('')
const selectedChurchObject = computed(() => churchesInSelectedState.value.find(option => option.id === currentChurch.value))

// State
const currentState = ref('')
const churchesInSelectedState = ref<Church[]>([])
const citiesInSelectedState = computed(() => {
  if (!churchesInSelectedState.value)
    return []
  return churchesInSelectedState.value.reduce((agg: any, church, index) => {
    if (!church.city) return agg

    const cityKey = church.city.toLowerCase().trim()
    if (!agg[cityKey]) {
      agg[cityKey] = {
        key: cityKey,
        name: church.city
      }
    }
    return agg
  }, {})
})

watch(currentState, async (val) => {

  currentCity.value = ''
  currentChurch.value = ''
  churchesInSelectedState.value = await getChurchesByState(val)

})


const onApplyClick = () => {
  emit('update:church', selectedChurchObject.value)
}

const onResetClick = () => {
  currentState.value = ''
}

</script>