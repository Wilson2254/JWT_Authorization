<template>
  <v-form v-model="valid" @submit="submitForm">
    <v-container class="w-33">
      <v-row class="mb-4">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          required
          type="email"
          hint="example@email.com"
        />
      </v-row>
      <v-row class="mb-4">
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Password"
          required
          type="password"
          hint="Минимум 6 символов"
        />
      </v-row>
      <v-row class="mb-4">
        <v-text-field
          v-model="passwordConfirm"
          :rules="passwordConfirmRules"
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
import { ref } from 'vue';

const valid = ref(false);

const email = ref('');

const password = ref('');

const passwordConfirm = ref('');

const emailRules = [
  (value: string): string | boolean => {
    return /.+@.+\..+/.test(value) || 'Некорректный email';
  }
];

const passwordRules = [
  (value: string): string | boolean => {
    return value.length >= 6 || 'Некорректный пароль';
  }
];

const passwordConfirmRules = [
  (value: string): string | boolean => {
    return value === password.value || 'Пароли не совпадают';
  }
];

const submitForm = () => {
  console.log('TEST');
  if (valid.value) {
    console.log({
      email: email.value
    });
  }
};
</script>

<style scoped></style>
