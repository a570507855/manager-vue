<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import menu from '@/api/menu'
export default {
  name: 'App',
  mounted () {
    if (!this.$store.getters.permission_routes.length) {
      menu.getMenuTree().then(res => {
        this.$store.dispatch('permission/generateRoutes', {
          routes: res,
          roles: ['admin']
        })
        this.$router.addRoutes(res)
        this.$router.options.routes = res;
      })
    }
  }
}
</script>
