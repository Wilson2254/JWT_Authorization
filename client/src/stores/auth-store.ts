import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { IUser } from '../models/IUser';
import AuthService from '../services/auth-service';
import { useRouter } from 'vue-router';
import { useLoader } from '../composition/loader';

export const authStore = defineStore('authStore', () => {
  const router = useRouter();
  const { loaderOpen, loaderClose } = useLoader();
  const user = ref({} as IUser);
  const isAuth = ref(false);

  async function login(email: string, password: string): Promise<void> {
    try {
      loaderOpen();
      const response = await AuthService.login(email, password);
      localStorage.setItem('accessToken', response.data.accessToken);
      isAuth.value = true;
      user.value = response.data.user;
      loaderClose();
      await router.push({
        name: 'profile'
      });
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  }

  async function registration(email: string, password: string): Promise<void> {
    try {
      loaderOpen();
      const response = await AuthService.registration(email, password);
      localStorage.setItem('accessToken', response.data.accessToken);
      isAuth.value = true;
      user.value = response.data.user;
      loaderClose();
      await router.push({
        name: 'profile'
      });
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  }

  async function logout(): Promise<void> {
    try {
      await AuthService.logout();
      localStorage.removeItem('accessToken');
      isAuth.value = false;
      user.value = {} as IUser;
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  }

  async function checkAuth(): Promise<void> {
    try {
      const response = await AuthService.refresh();
      localStorage.setItem('accessToken', response.data.accessToken);
      isAuth.value = true;
      user.value = response.data.user;
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  }

  return { login, registration, logout, checkAuth, user, isAuth };
});
