<template>
  <img :src="imgURL" class="object-cover max-h-40 w-full md:max-h-64 rounded-lg mb-4" />
  <div class="mb-8">
    <p class="font-bold text-slate-800 mb-2">Speaker: {{ props.devoObject?.author?.firstName + ' ' +
    props.devoObject?.author?.lastName }}</p>
    <p class="font-bold text-slate-800">Church: {{ props.devoObject?.author?.church.name }}</p>
  </div>
  <!-- Church Contact info-->
  <div class="mb-8">
    <p class="text-slate-800 mb-2">Address: {{ props.devoObject?.author?.church ?
    formatAddress(props.devoObject?.author.church) : null }}</p>
    <p class="text-slate-800">Email: {{ props.devoObject?.author?.church.email }}</p>

  </div>
</template>

<script setup lang="ts">
import PocketBaseClient from '../../api/PocketBaseClient'
import { Author } from '../../authors/Author'
import { formatAddress } from '../../core/services/FormatService'
import { Devotional } from '../Devotional';

export interface AuthorPreviewColumnProps {
  devoObject?: Devotional
}
const props = defineProps<AuthorPreviewColumnProps>()

  console.log(props)

var imgURL = PocketBaseClient.records.getFileUrl(props.devoObject, props.devoObject?.coverImage, {});


console.log(imgURL)

</script>