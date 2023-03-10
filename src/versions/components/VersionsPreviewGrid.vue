<template>
    <ContentPreviewGrid :show-favorite="false" :show-tags="false" :content="loadedVersions" :button-title="'View Version'"
        @click:button="onVersionCardClicked">
    </ContentPreviewGrid>
    <div v-if="props.paginationControls"></div>
    <div v-if="props.appendContent">
        <div v-if="loading" class="flex justify-center">
            <Spinner color="slate-800"></Spinner>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ContentPreview } from '../../components/molecules/ContentPreviewCard.vue';
import ContentPreviewGrid from '../../components/molecules/ContentPreviewGrid.vue'
import { Pagination } from '../../core/Pagination';
import { Version } from '../Version';
import Spinner from '../../components/atoms/Spinner.vue';
import { getSearch } from '../../search/services/SearchServicess'

export interface VersionsPreviewGridProps {
    queryParams?: any
    page?: number
    perPage?: number
    link?: string
    paginationControls?: boolean
    appendContent?: boolean
}

const props = withDefaults(defineProps<VersionsPreviewGridProps>(), {
    page: 1,
    perPage: 8
})

const loading = ref<boolean>(false)
const loadedVersions = ref<ContentPreview[]>([])
const router = useRouter()
const emit = defineEmits([
    'click:button', // TODO: better name?
    'click:author',
    'page:change',
    'page:next',
    'page:previous',
    'data:loaded'
])

const pagination = ref<Pagination | null>(null)

const loadSearchedVersions = async (forceReset = false) => {
    if (pagination.value && pagination.value.totalPages === pagination.value.page && !forceReset) {
        loading.value = false
        return
    }
    loading.value = true
    try {
        var { items, ...paginationData } = await getSearch('versions', undefined, props.page, props.perPage, [""], props.queryParams, false)
        for(var item of items){
            item.description = item.description.replaceAll('<li>', "").replaceAll("</li>", "")
        }
        if (props.appendContent && !forceReset) {
            loadedVersions.value = loadedVersions.value.concat(await addVersionToTitle(items as ContentPreview[]))
        }
        else
            loadedVersions.value = items as ContentPreview[]
        pagination.value = paginationData
        emit('data:loaded', { items, ...paginationData })
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    loadSearchedVersions()

    // Initialize watch after initial load
    watch(() => props.page, (currentPage, prevPage) => {
        loading.value = true
        setTimeout(() => {

            loadSearchedVersions()

            if (currentPage > prevPage)
                emit('page:next')
            else if (currentPage < prevPage)
                emit('page:previous')
        }, 800)
    })
    watch(() => props.perPage, () => loadSearchedVersions())
    watch(() => props.queryParams, () => loadSearchedVersions())
})

const onVersionCardClicked = (version: Version) => {
    router.push(`/versions/${version.version?.toString().replace(".", "-")}`)
    emit('click:button')
}

function addVersionToTitle(versions: any[]) {
    return versions.map(obj => {
        return {
            ...obj,
            title: `${obj.version} - ${obj.title}`
        }
    });
}
</script>
  
<style></style>