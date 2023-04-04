import { ref } from 'vue';

const isLoaderActive = ref(false);

function loaderOpen() {
  isLoaderActive.value = true;
}

function loaderClose() {
  isLoaderActive.value = false;
}

export function useLoader() {
  return { loaderOpen, loaderClose, isLoaderActive };
}
