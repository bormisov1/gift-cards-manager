<template>
  <div>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'MainView',
  components: {},
  created() {
    if (this.$route.name == 'home') this.$router.push({name: 'cardsList'})
  },
}
</script>
