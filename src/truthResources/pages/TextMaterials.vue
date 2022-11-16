<template>
    <AppLayout>
      <PageContent>
        <!-- Truth Resources Hero -->
        <PageHero>
          <template v-slot:image>
            <img src="/logo-bible.png" class="object-contain hidden md:block max-h-32" />
          </template>
          <h2 class="text-4xl font-bold mb-2 text-slate-900">Truth Resources</h2>
          <p class="text-slate-600 max-w-prose">
            Some text yeah. UHIFdjfrenkgtnjvgjgr5jgnj54rng j gnjg j4gnkjnmndkgflrefjk. hijkiefljefgklrjgkkgjk5gj 54jkg jctkc gjk45jkg5jk5jg4kjg5k45gk45ktl4ejgk5g. i ito545jjitjhufhrhj4iwrj iw4 r4utio4jr 89rui i4u999  9 i45ferk.
            Don't speak in tongues, kids.
          </p>
          <template v-slot:actions>
            
          </template>
        </PageHero>
        <Divider></Divider>

        <TruthResourcesList :resources="NonSeries" base-url="truth-resources"></TruthResourcesList>
  
        <!-- My Plans -->
        <UserRecommendationFooter></UserRecommendationFooter>
      </PageContent>
    </AppLayout>
</template>
  
<script setup lang="ts">
import AppLayout from "../../components/templates/AppLayout.vue"
import PageContent from "../../components/templates/PageContent.vue"
import AppButton from "../../components/atoms/form-controls/AppButton.vue"
import Icon from "../../components/atoms/Icon.vue"
import { onMounted, ref } from 'vue'
import ContentCarousel from '../../components/molecules/ContentCarousel.vue'
  
import PageHero from "../../components/molecules/PageHero.vue"
import { useRouter } from "vue-router"
import AppInput from "../../components/atoms/form-controls/AppInput.vue"
import DevotionalsPreviewGrid from "../components/DevotionalsPreviewGrid.vue"
import UserRecommendationFooter from "../../components/organisms/UserRecommendationFooter.vue"
import Divider from '../../components/atoms/Divider.vue'

import TruthResourcesList from '../components/TruthResourcesList.vue'

import { getSearch } from '../../search/services/searchService'

const Series = ref();
const NonSeries = ref();
  
const router = useRouter();

onMounted(async () => {
  const recentTruthResourcesNonSeriesPromise = await getSearch("truthResources", "", 0, 0, { filter: "isSeries = false" });
  const [recentTruthResourcesNonSeries] = await Promise.all([recentTruthResourcesNonSeriesPromise]);

  NonSeries.value = recentTruthResourcesNonSeries.items
})
</script>
  