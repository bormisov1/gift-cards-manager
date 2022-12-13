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

.v-dialog__container {
  display: unset !important;
}

.v-input label.v-label {
  font-size: 18px !important;
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
.diod-container,.back-btn-container {
  position: relative;
}
.diod {
  background-color: grey;
  position: absolute;
  top: 25px;
  right: 25px;
  height: 15px;
  width: 15px;
  border-radius: 50% !important;
}
.active.diod {
  background-color: #46c513 !important;
  box-shadow: 0 0 13px 8px #46c51394;
}

.back-btn {
  position: absolute;
  top: 15px;
  left: 5px;
}

.status {
  position: absolute;
  top: 25px;
  right: 50px;
  font-size: 20px;
  line-height: 15px;
}
</style>
