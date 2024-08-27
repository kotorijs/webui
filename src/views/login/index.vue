<template>
  <div
    class="bg"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(256, 256, 256, 0.8)"
  >
    <div class="login-container">
      <div class="logo">
        <div class="login-header">
          <img src="@/assets/favicon.svg" alt="" />
          <div>Kotori</div>
        </div>
        <div class="login-desc">kams 是一个专为Kotori打造的后台管理界面</div>
      </div>

      <div class="tab">
        <div @click="changeTab('login')" :class="{ current: whichTab }" class="btn tab-login">
          登录
        </div>
        <div
          @click="changeTab('register')"
          :class="{ current: !whichTab }"
          class="btn tab-register"
        >
          注册
        </div>
        <div :class="{ 'line-right': !whichTab }" class="bottom-line"></div>
      </div>

      <div class="border" v-show="whichTab">
        <pps-form @submit="loginFn()">
          <pps-input
            :content.sync="loginForm.username"
            icon="pps-icon-admin"
            placeholder="用户名"
          ></pps-input>
          <pps-input
            :content.sync="loginForm.password"
            icon="pps-icon-lock"
            type="password"
            placeholder="密码"
          ></pps-input>
          <div><a @click="showDialog('forget')" class="forget">忘记密码？</a></div>
          <pps-button theme="confirm">登录</pps-button>
        </pps-form>
      </div>

      <div class="border" v-show="!whichTab">暂未开放</div>
    </div>

    <div class="foot">
      <div class="list"></div>
      <div class="copylist">
        <copy-icon></copy-icon>
        Powered by kotori
      </div>
    </div>

    <pps-dialog
      :content="dialogData.message"
      :title="dialogData.title"
      :show.sync="isShowDialog"
      @confirmed="loading = false"
      @canceled="loading = false"
    ></pps-dialog>
  </div>
</template>

<script>
import copyIcon from './copyIcon.vue';
import { loginAPI } from '@/api';
import { mapMutations } from 'vuex';

export default {
  name: 'myLogin',
  components: { copyIcon },
  data() {
    return {
      tabsFlag: 'login',
      isShowDialog: false,
      loading: false,
      dialogData: {},
      loginForm: {
        username: 'nagisa',
        password: '0517'
      }
    };
  },
  methods: {
    ...mapMutations('layoutOption', ['updateToken']),
    changeTab(flag) {
      this.tabsFlag = flag;
    },
    async loginFn() {
      this.loading = true;
      try {
        const { data: res } = await loginAPI(this.loginForm);
        if (res.token) {
          this.updateToken(res.token);
          this.loading = false;
          this.$router.push('/');
        }
      } catch (error) {
        console.log(error);
        this.loading = false;
        if (error) return this.showDialog('loginError');
        this.showDialog('', error.message);
      }
    },
    showDialog(name, msg) {
      if (name && name === 'forget') {
        this.dialogData = {
          title: '提示',
          message: '暂未开放！'
        };
      } else if (name && name === 'loginError') {
        this.dialogData = {
          title: '警告',
          message: '账号或密码不正确！'
        };
      } else {
        this.dialogData = {
          title: '警告',
          message: msg
        };
      }
      this.isShowDialog = true;
    }
  },
  computed: {
    whichTab() {
      return this.tabsFlag === 'login';
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.bg {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-image: url('../../assets/bg-login.png');
  background-size: 100% 100%;

  .login-container {
    flex: 1 1 0%;
  }
  .border {
    padding: 15px;
    margin-top: 10px;
    text-align: center;

    .pps-button {
      width: 360px;
      margin: 20px auto 0;
      font-weight: 400;
      font-size: 14px;
      color: #fff;
      height: 40px;
    }

    & ::v-deep .pps-input-inner {
      width: 360px;
      height: 38px;
      margin: 0 auto 20px;
      background: #fff;
    }

    a {
      float: right;
      color: #00aeed;
      cursor: pointer;

      &:hover {
        color: #46c6f0;
      }
    }
  }
  .tab {
    position: relative;
    display: flex;
    width: 150px;
    height: 35px;
    margin: 0 auto;

    .btn {
      width: 50%;
      text-align: center;
      cursor: pointer;

      &:hover {
        color: #00aeed;
      }
    }
    .current {
      color: #00aeed;
    }
    .bottom-line {
      position: absolute;
      bottom: 0;
      background: #00aeed;
      width: 50%;
      height: 3px;
      transition: all 0.6s ease;
    }
    .line-right {
      right: 0;
    }
  }
  .logo {
    display: flex;
    width: 100%;
    margin-bottom: 60px;
    margin-top: 50px;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .login-header {
      display: flex;
      align-items: center;
      font-size: 30px;
      font-weight: 600;

      img {
        height: 50px;
        margin-right: 20px;
      }
    }

    .login-desc {
      margin-top: 10px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .foot {
    margin-block-start: 48px;
    margin-block-end: 24px;
    font-size: 14px;
    color: #000000b5;
  }
}

/* 进入的起点、离开的终点 */
.hello-enter,
.hello-leave-to {
  transform: translateY(-10%);
}
.hello-enter-active,
.hello-leave-active {
  transition: 0.15s linear;
}
/* 进入的终点、离开的起点 */
.hello-enter-to,
.hello-leave {
  transform: translateY(0);
}
</style>
