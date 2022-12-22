<template>
  <div>
    <v-card class="auth-card" elevation="0" flat outlined>
      <v-text-field
        :label="'Логин'"
        outlined
        v-model="username"
        style="min-width: 300px">
      </v-text-field>
      <v-text-field
        :label="'Пароль'"
        outlined
        v-model="password"
        style="min-width: 300px">
      </v-text-field>
      <v-btn @click="request(false)" class="login-btn">Войти</v-btn>
      <!-- <v-btn @click="request(true)">Регистрация</v-btn> -->
    </v-card>
  </div>
</template>

<script>
import {fetchRequest} from '@/scripts/index'
export default {
  name: 'AuthView',
  data: () => ({
    username: '',
    password: ''
  }),
  components: {},
  methods: {
    async request(register) {
      const url = register ? '/auth/register' : '/auth/login'
      const {headers} = await fetchRequest(url, 'POST', {username: this.username, password: this.password})
      if (headers['authorization']) {console.log('ebatn pizd');return this.$router.go('cardsList')}
    },
  }
}
</script>
<style>
@media (max-width: 800px) {
  .auth-card {
    top: 30%;
    left: 5% !important;
    position: absolute !important;
    width: 90% !important;
  }
}
.auth-card {
  width: 50%;
  position: absolute !important;
  top: 30%;
  left: 25%;
  border: 0 !important;
}
.login-btn {
  margin-right: 3%;
}
</style>
