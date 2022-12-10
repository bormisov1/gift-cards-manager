<template>
  <router-view/>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

* {
  font-family: Inter;
}

.v-text-field .v-label--active {
  font-size: 14px !important;
  transform: translateY(-18px) !important;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.submit-btn {
  color: #46c513 !important;
  border-radius: 30px !important;
}
</style>
