<script lang="ts" setup>
defineProps<{
  contentData: any
}>()

const { t } = useI18n()
</script>

<template>
  <div class="w-full flex flex-col gap-4 md:gap-8">
    <p class="text-xs md:text-sm leading-normal!">
      {{ t('policies.last-updated') }}: {{ contentData.updatedAt }}
    </p>

    <div
      v-if="contentData.items && contentData.items.length"
      class="flex flex-col gap-2 md:gap-4 leading-normal"
    >
      <div
        v-for="(item, i) in contentData.items"
        :key="`privacy-${i}`"
        class="flex flex-col gap-2 md:gap-4 leading-normal!"
      >
        <h2
          v-if="item.title"
          class="text-lg md:text-xl font-bold text-white leading-normal!"
        >
          {{ item.title }}
        </h2>

        <p
          v-if="item.description"
          class="text-xs md:text-sm leading-normal!"
          v-html="item.description"
        />

        <div
          v-if="item.subItems"
          class="flex flex-col gap-2 leading-normal"
        >
          <div
            v-for="(sItem, sI) in item.subItems"
            :key="`privacy-sub-${i}-${sI}`"
            class="flex flex-col leading-normal! gap-2"
          >
            <h3
              v-if="sItem.title"
              :class="{
                'text-base md:text-lg font-bold': (sItem.description || sItem.subDesc || sItem.subItems),
                'text-xs md:text-sm': !(sItem.description || sItem.subDesc || sItem.subItems),
              }"
              class="text-paragraph leading-normal!"
            >
              {{ sItem.title }}
            </h3>

            <p
              v-if="sItem.description"
              class="text-xs md:text-sm leading-normal!"
              v-html="sItem.description"
            />

            <template v-if="sItem.subDesc">
              <ul
                v-if="sItem.subType === 'ul'"
                class="list-disc text-xs md:text-sm leading-normal! pl-3 md:pl-6"
              >
                <li
                  v-for="(sDe, sDI) in sItem.subDesc"
                  :key="`privacy-des-${i}-${sI}-${sDI}`"
                  class="text-xs md:text-sm leading-normal!"
                  v-html="sDe"
                />
              </ul>
              <template v-else>
                <p
                  v-for="(sDe, sDI) in sItem.subDesc"
                  :key="`privacy-des-${i}-${sI}-${sDI}`"
                  class="text-xs md:text-sm leading-normal!"
                  v-html="sDe"
                />
              </template>
            </template>

            <template v-else-if="sItem.subItems">
              <div
                v-for="(sIt, sII) in sItem.subItems"
                :key="`privacy-item-${i}-${sI}-${sII}`"
                class="flex flex-col gap-2 leading-normal"
              >
                <h4
                  v-if="sIt.title"
                  class="text-sm md:text-base font-bold text-paragraph leading-normal!"
                >
                  {{ sIt.title }}
                </h4>

                <p
                  v-if="sIt.description"
                  class="text-xs md:text-sm leading-normal!"
                  v-html="sIt.description"
                />

                <template v-if="sIt.subDesc">
                  <ul
                    v-if="sIt.subType === 'ul'"
                    class="list-disc text-xs md:text-sm leading-normal! pl-3 md:pl-6"
                  >
                    <li
                      v-for="(sDe, sDI) in sIt.subDesc"
                      :key="`privacy-des-${i}-${sI}-${sII}-${sDI}`"
                      class="text-xs md:text-sm leading-normal!"
                      v-html="sDe"
                    />
                  </ul>
                  <template v-else>
                    <p
                      v-for="(sDe, sDI) in sIt.subDesc"
                      :key="`privacy-des-${i}-${sI}-${sII}-${sDI}`"
                      class="text-xs md:text-sm leading-normal!"
                      v-html="sDe"
                    />
                  </template>
                </template>
              </div>
            </template>
          </div>
        </div>

        <template v-else-if="item.subDesc">
          <ul
            v-if="item.subType === 'ul'"
            class="list-disc text-xs md:text-sm leading-normal! pl-3 md:pl-6"
          >
            <li
              v-for="(sDe, sDI) in item.subDesc"
              :key="`privacy-s-des-${i}-${sDI}`"
              class="text-xs md:text-sm leading-normal!"
              v-html="sDe"
            />
          </ul>
          <template v-else>
            <p
              v-for="(sDe, sDI) in item.subDesc"
              :key="`privacy-s-des-${i}-${sDI}`"
              class="text-xs md:text-sm leading-normal!"
              v-html="sDe"
            />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
