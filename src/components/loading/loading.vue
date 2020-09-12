<template>
  <div class="loading" id="loading" v-show="isShow">
    <i class="el-icon-loading" style="font-size:70px"></i>
  </div>
</template>

<script>
export default {
  name: "Loading",
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    show () {
      this.isShow = true;
    },
    hide () {
      return new Promise(resolve => {
        setTimeout(() => {
          this.isShow = false;
          resolve();
        }, 200);
      });
    }
  }
}
</script>

<style scoped>
.loading {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 300;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(10, 10, 10, 0.86);
}
</style>