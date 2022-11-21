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
            Truth Resources is the best place to gather essential information to guide new converts as well as believers in the truth of God's Word. Read articles and watch videos to teach you the history of the manuscripts and the logical reasoning behind why we believe what we believe.
          </p>
          <template v-slot:actions>
            
          </template>
        </PageHero>
        <h2 class="text-2xl font-bold mb-2 text-slate-900">Series:</h2>
        <ContentCarousel :slides="Series" base-url="truth-resources"></ContentCarousel>
        <div class="flex justify-center mb-4 mt-4">
          <RouterLink to="/truth-resources/series">View More ></RouterLink>
        </div>
        <Divider></Divider>

        <TruthResourcesList :resources="NonSeries" base-url="truth-resources"></TruthResourcesList>
        <div class="flex justify-center mb-4">
          <RouterLink to="/truth-resources/text-materials">View More ></RouterLink>
        </div>
  
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
import UserRecommendationFooter from "../../components/organisms/UserRecommendationFooter.vue"
import Divider from '../../components/atoms/Divider.vue'

import TruthResourcesList from '../components/TruthResourcesList.vue'

import { getSearch } from '../../search/services/searchService'

const Series = ref();
const NonSeries = ref();
  
const router = useRouter();

onMounted(async () => {
  const recentTruthResourcesSeriesPromise = await getSearch("truthResources", "", 1, 6, { filter: "isSeries = true" });
  const recentTruthResourcesNonSeriesPromise = await getSearch("truthResources", "", 1, 6, { filter: "isSeries = false" });
  const [recentTruthResourcesSeries, recentTruthResourcesNonSeries] = await Promise.all([recentTruthResourcesSeriesPromise, recentTruthResourcesNonSeriesPromise]);
  
  Series.value = recentTruthResourcesSeries.items
  NonSeries.value = recentTruthResourcesNonSeries.items
})
</script>
  