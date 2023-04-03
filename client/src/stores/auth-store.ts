import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { IUser } from '../models/IUser';
import AuthService from '../services/auth-service';

export const authStore = defineStore('counter', () => {
  const user = ref({} as IUser);
  const isAuth = ref(false);

  async function login(email: string, password: string): Promise<void> {
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem('token', response.data.accessToken);
      isAuth.value = true;
      user.value = response.data.user;
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  }

  async function registration(email: string, password: string): Promise<void> {
    try {
      const response = await AuthService.registration(email, password);
      localStorage.setItem('token', response.data.accessToken);
      isAuth.value = true;
      user.value = response.data.user;
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  }

  async function logout(): Promise<void> {
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
      isAuth.value = false;
      user.value = {} as IUser;
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  }

  return { login, registration, logout };
});
