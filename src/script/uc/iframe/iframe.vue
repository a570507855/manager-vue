<template>
  <div class="xIframe" id="xIframe" v-if="isShow">
    <div @click="isShow = false" class="xIframe-background"></div>
    <div class="xIframe-content">
      <component :is="component" :row="row" :style="style" class="content" v-if="isShow"></component>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Iframe',
  data () {
    return {
      isShow: false,
      component: '',
      row: '',
      style: {
        width: '560px',
        minHeight: '560px'
      },
      closeType: -1
    };
  },
  methods: {
    load (path, params) {
      return new Promise((resolve, reject) => {
        this.init();
        this.component = (res) => require([`@/views/${path}`], res);
        this.params = params;
        this.isShow = true;
        if (params.constructor === Object) {
          Object.keys(this.params).forEach(key => {
            this[key] = this.params[key];
          });
        }

        let interval = setInterval(() => {
          if (this.closeType === -1)
            return;

          if (this.closeType === 1)
            resolve();

          // if (this.closeType === 0)
          //   reject();

          clearInterval(interval);
        }, 200);
      });
    },
    hide (closeType) {
      this.isShow = false;
      this.component = '';
      this.closeType = closeType
    },
    init () {
      this.row = '';
      this.style = { width: '560px', minHeight: '560px' };
      this.closeType = -1;
    }
  }
};
</script>

<style scoped>
.xIframe,
.xIframe-background,
.xIframe-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.xIframe-background {
  background-color: rgba(10, 10, 10, 0.86);
  z-index: 100;
}
.xIframe-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.02);
  background-color: white;
  z-index: 200;
}
</style>
