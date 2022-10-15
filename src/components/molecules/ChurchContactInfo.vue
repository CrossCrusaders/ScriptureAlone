<template>
  <div class="mb-8">
    <p class="text-slate-800 mb-2 font-bold">Church: {{ props.church.name }}</p>
    <p class="text-slate-800 mb-px" v-if="props.church?.streetAddress1">Address: {{ formatAddress(props.church) }}</p>
    <p class="text-slate-800 mb-px" v-if="props.church?.phone">Phone: {{ props.church.phone }}</p>
    <p class="text-slate-800 mb-px" v-if="props.church?.email">Email: {{ props?.church.email }}</p>
  </div>
</template>

<script setup lang="ts">
import { Church } from '../../church/Church';
import { formatAddress } from '../../core/services/FormatService'

interface ChurchContactInfoProps {
  church: Church
}

const props = defineProps<ChurchContactInfoProps>()

</script>