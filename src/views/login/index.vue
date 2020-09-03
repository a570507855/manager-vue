<template>
  <div class="login-container">
    <el-form
      :model="loginForm"
      :rules="loginRules"
      auto-complete="on"
      class="login-form"
      label-position="left"
      ref="loginForm"
    >
      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>

      <el-form-item prop="account">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          auto-complete="on"
          name="account"
          placeholder="账号"
          ref="account"
          tabindex="1"
          type="text"
          v-model="loginForm.account"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          :type="passwordType"
          @keyup.enter.native="handleLogin"
          auto-complete="on"
          name="password"
          placeholder="密码"
          ref="password"
          tabindex="2"
          v-model="loginForm.password"
        />
        <span @click="showPwd" class="show-pwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        @click.native.prevent="handleLogin"
        style="width:100%;margin-bottom:30px;"
        type="primary"
      >登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import menu from '@/api/menu'
import login from '@/api/login'
import Router from 'vue-router'
import { setToken } from '@/sessionStorage/token'

export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('账号不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少六位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        account: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (!valid)
          return false;

        this.loading = true
        // this.$store.dispatch('user/login', this.loginForm)
        this.$async.waterfall([
          fn => {
            login.isLogin(this.loginForm).then(res => {
              res.isExist ? fn(null, res.token) : fn('账号或密码错误');
            }, fn);
          },
          (token, fn) => {
            setToken(token);
            menu.getMenuTree().then(res => {
              this.$store.dispatch('permission/generateRoutes', {
                routes: res,
                roles: ['admin']
              });
              this.$router.addRoutes(res);
              this.$router.push({ path: this.redirect || '/' });
              fn();
            }, fn);
          }
        ], err => {
          this.loading = false;
          if (err)
            this.$message.error(err);
        })

      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
