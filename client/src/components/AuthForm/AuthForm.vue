<template>
  <v-form v-model="isFormValid" @submit.prevent="submitForm">
    <v-container class="w-33 w-md-50">
      <v-row class="mb-4">
        <v-text-field
          v-model="email"
          :rules="formRulesList.email"
          label="Email"
          required
          type="email"
          hint="example@email.com"
        />
      </v-row>
      <v-row class="mb-4">
        <v-text-field
          v-model="password"
          :rules="formRulesList.password"
          label="Password"
          required
          type="password"
          hint="Минимум 6 символов"
        />
      </v-row>
      <v-row class="mb-4">
        <v-text-field
          v-model="passwordConfirm"
          :rules="formRulesList.passwordConfirm"
          label="Repeat Password"
          required
          type="password"
          hint="Минимум 6 символов"
        />
      </v-row>
      <v-btn type="submit" class="w-50 ma-auto d-block">Submit</v-btn>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { authStore } from '../../stores/auth-store';

const { login, registration, logout } = authStore();

const isFormValid = ref(false);

const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

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
      return value === password.value || 'Пароли не совпадают';
    },
    (value: string): string | boolean => {
      return value.length >= 6 || 'Некорректный пароль';
    }
  ]
};

const isPasswordsMatched = computed(() => {
  return password.value === passwordConfirm.value;
});

const submitForm = () => {
  if (isFormValid.value && isPasswordsMatched.value) {
    registration(email.value, password.value);
  }
};
</script>

<style scoped></style>
