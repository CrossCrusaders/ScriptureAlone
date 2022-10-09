<template>
  <AppSelect v-bind="$attrs" :model-value="props.modelValue" @update:model-value="emit('update:modelValue', $event)">
    <option v-for="translation of availableTranslations" :value="translation.id">
      {{translation.abbreviation}}
    </option>
  </AppSelect>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { BibleTranslation } from '../../bible/BibleTranslation';
import { getTranslations } from '../../bible/services/BibleService';
import AppSelect from '../atoms/form-controls/AppSelect.vue'

const availableTranslations = ref<BibleTranslation[]>([])
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

onMounted(async () => {
  availableTranslations.value = await getTranslations()
})

</script>