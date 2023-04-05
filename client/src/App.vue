<template>
  <div
    v-if="isLoaderActive"
    class="d-flex align-center justify-center bg-grey-darken-1 position-absolute w-100 h-100"
  >
    <v-progress-circular color="black" indeterminate :size="80" />
  </div>

  <router-view v-else />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { authStore } from './stores/auth-store';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useLoader } from './composition/loader';

const router = useRouter();
const store = authStore();
const { checkAuth } = store;
const { isAuth } = storeToRefs(store);

const { isLoaderActive, loaderOpen, loaderClose } = useLoader();

async function init() {
  loaderOpen();
  await checkAuth();
  if (isAuth.value) {
    await router.push({
      name: 'profile'
    });
  } else {
    await router.push({
      name: 'auth'
    });
  }
  loaderClose();
}

init();
</script>
