<script lang="ts" setup>
import BaseProvider from '~/services/providers/BaseProvider.vue'
import ThemeProvider from '~/services/providers/ThemeProvider.vue'
import LoadingProvider from '~/services/providers/LoadingProvider.vue'
import AuthProvider from '~/services/providers/AuthProvider.vue'
import PublicContext from '~/services/providers/PublicContext.vue'
import PrivateContext from '~/services/providers/PrivateContext.vue'
import GamesProvider from '~/services/providers/GamesProvider.vue'
import ModalsProvider from '~/services/providers/ModalsProvider.vue'
import ChatProvider from '~/services/providers/ChatProvider.vue'
import NotificationProvider from '~/services/providers/NotificationProvider.vue'
import GamePopupProvider from '~/services/providers/GamePopupProvider.vue'
import VipProvider from '~/services/providers/VipProvider.vue'
</script>

<template>
  <BaseProvider>
    <ThemeProvider>
      <LoadingProvider>
        <AuthProvider>
          <PublicContext>
            <PrivateContext>
              <VipProvider>
                <ModalsProvider>
                  <GamesProvider>
                    <GamePopupProvider>
                      <NotificationProvider>
                        <ChatProvider>
                          <NuxtLayout name="default">
                            <NuxtPage />
                          </NuxtLayout>
                        </ChatProvider>
                      </NotificationProvider>
                    </GamePopupProvider>
                  </GamesProvider>
                </ModalsProvider>
              </VipProvider>
            </PrivateContext>
          </PublicContext>
        </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  </BaseProvider>
</template>
