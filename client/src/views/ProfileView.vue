<template>
  <div class="d-flex fill-height justify-center align-center text-white">
    <div class="mr-4">
      <div class="text-h4 mb-4">Пользователь {{ user.email }}</div>
      <v-btn class="d-block mb-4" size="large" @click="getUsers">Список пользователей</v-btn>
      <v-btn class="d-block mb-4" size="large" @click="logoutProfile">Выйти из ЛК</v-btn>
    </div>
    <v-card>
      <v-list :items="usersList" />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { authStore } from '../stores/auth-store';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useLoader } from '../composition/loader';
import UserService from '../services/user-service';

const router = useRouter();
const store = authStore();
const { logout } = store;
const { user } = storeToRefs(store);
const { loaderOpen, loaderClose } = useLoader();
const usersList = ref<Array<string>>([]);

async function logoutProfile() {
  loaderOpen();
  await logout();
  await router.push({
    name: 'auth'
  });
  loaderClose();
}

async function getUsers() {
  usersList.value = [];
  const list = await UserService.fetchUsers();
  list.data.forEach(({ email }) => {
    usersList.value.push(email);
  });
}
</script>

<style scoped></style>
