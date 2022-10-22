<template>
  <RouterLink :to="'/authors/' + props.author?.id">
    <span>{{ formatName(props.author) }}</span>
  </RouterLink>
</template>

<script setup lang="ts">
import { Author } from '../../authors/Author';
import { formatName } from '../../core/services/FormatService';


interface AuthorPageNameLinkProps {
  author?: Author
}

const props = defineProps<AuthorPageNameLinkProps>()

</script>