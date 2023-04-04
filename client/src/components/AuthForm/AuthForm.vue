<template>
  <div>
    <v-tabs class="mb-4" v-model="tabComponent" align-tabs="center">
      <v-tab value="sign-in">Вход</v-tab>
      <v-tab value="sign-up">Регистрация</v-tab>
    </v-tabs>
    <v-window v-model="tabComponent">
      <v-window-item value="sign-in">
        <v-form v-model="isFormSignInValid" @submit.prevent="signIn">
          <v-container class="w-33">
            <v-row class="mb-4">
              <v-text-field
                v-model="signInEmail"
                :rules="formRulesList.email"
                label="Email"
                required
                type="email"
                hint="example@email.com"
              />
            </v-row>
            <v-row class="mb-4">
              <v-text-field
                v-model="signInPassword"
                :rules="formRulesList.password"
                label="Password"
                required
                type="password"
                hint="Минимум 6 символов"
              />
            </v-row>
            <v-btn type="submit" class="w-50 ma-auto d-block">Войти</v-btn>
          </v-container>
        </v-form>
      </v-window-item>
      <v-window-item value="sign-up">
        <v-form v-model="isFormSignUpValid" @submit.prevent="signUp">
          <v-container class="w-33">
            <v-row class="mb-4">
              <v-text-field
                v-model="signUpEmail"
                :rules="formRulesList.email"
                label="Эл. почта"
                required
                type="email"
                hint="example@email.com"
              />
            </v-row>
            <v-row class="mb-4">
              <v-text-field
                v-model="signUpPassword"
                :rules="formRulesList.password"
                label="Пароль"
                required
                type="password"
                hint="Минимум 6 символов"
              />
            </v-row>
            <v-row class="mb-4">
              <v-text-field
                v-model="signUpPasswordConfirm"
                :rules="formRulesList.passwordConfirm"
                label="Повторить пароль"
                required
                type="password"
                hint="Минимум 6 символов"
              />
            </v-row>
            <v-btn type="submit" class="w-50 ma-auto d-block">Зарегистрироваться</v-btn>
          </v-container>
        </v-form>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { authStore } from '../../stores/auth-store';

const { login, registration } = authStore();

const isFormSignUpValid = ref(false);
const isFormSignInValid = ref(false);

const signUpEmail = ref('');
const signInEmail = ref('');

const signUpPassword = ref('');
const signInPassword = ref('');

const signUpPasswordConfirm = ref('');

const tabComponent = ref(null);

const formRulesList = {
  email: [
    (value: string): string | boolean => {
      return /.+@.+\..+/.test(value) || 'Некорректный email';
    }
  ],
  password: [
    (value: string): string | boolean => {
      return value.length >= 6 || 'Некорректный пароль';
    }
  ],
  passwordConfirm: [
    (value: string): string | boolean => {
      return value === signUpPassword.value || 'Пароли не совпадают';
    },
    (value: string): string | boolean => {
      return value.length >= 6 || 'Некорректный пароль';
    }
  ]
};

const isPasswordsMatched = computed(() => {
  return signUpPassword.value === signUpPasswordConfirm.value;
});

async function signUp() {
  if (isFormSignUpValid.value && isPasswordsMatched.value) {
    await registration(signUpEmail.value, signUpPassword.value);
  }
}

async function signIn() {
  if (isFormSignInValid.value) {
    await login(signInEmail.value, signInPassword.value);
  }
}
</script>

<style scoped></style>
