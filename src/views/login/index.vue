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
          配置
        </div>
        <div :class="{ 'line-right': !whichTab }" class="bottom-line"></div>
      </div>

      <div class="border" v-show="whichTab">
        <pps-form @submit="loginFn()">
          <pps-input
            clearable
            :content.sync="loginForm.username"
            icon="pps-icon-admin"
            placeholder="用户名"
          ></pps-input>
          <pps-input
            clearable
            viewPassword
            :content.sync="loginForm.password"
            icon="pps-icon-lock"
            type="password"
            placeholder="密码"
          ></pps-input>
          <div><a @click="showDialog('forget')" class="forget">忘记密码？</a></div>
          <pps-button theme="confirm" class="login">登录</pps-button>
        </pps-form>
      </div>

      <div class="border config" v-show="!whichTab">
        <pps-form @submit="submitConfigFn()" @reset="resetConfigFn()">
          <pps-input
            clearable
            :content.sync="configForm.host"
            icon="pps-icon-host"
            placeholder="无前缀后端IP地址"
            style="position: relative"
          >
            <template v-slot:prepend>
              <dp
                @select="selectSslFn"
                :current="http_or_https"
                :menu="['https://', 'http://']"
              ></dp>
            </template>
          </pps-input>
          <pps-input
            clearable
            :content.sync="configForm.port"
            icon="pps-icon-port"
            placeholder="后端端口号"
          ></pps-input>
          <div><p>警告！若无需分离前后端请谨慎修改！</p></div>
          <div class="submit">
            <pps-button theme="confirm">提交</pps-button>
            <pps-button theme="" type="reset">重置</pps-button>
          </div>
        </pps-form>
      </div>
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
import { mapMutations, mapState } from 'vuex';
import { configureAxiosInstance } from '@/utils/request';
import dp from '@/components/dropdown';

export default {
  name: 'myLogin',
  components: { copyIcon, dp },
  data() {
    return {
      t: '',
      tabsFlag: 'login',
      isShowDialog: false,
      loading: false,
      isShowSelect: false,
      http_or_https: 'https:',
      dialogData: {},
      loginForm: {
        username: '',
        password: ''
      },
      configForm: {
        host: '',
        port: ''
      }
    };
  },
  methods: {
    ...mapMutations('layoutOption', [
      'updateToken',
      'updateHost',
      'updatePort',
      'updateProtocol',
      'updateUsername',
      'updatePassword'
    ]),
    changeTab(flag) {
      this.tabsFlag = flag;
    },
    selectSslFn(ssl) {
      // this.isShowSelect = false;
      this.http_or_https = ssl;
    },
    updataBackendConfigFn() {
      const ssl = this.http_or_https === 'https://';
      const port = this.configForm.port || (ssl ? 443 : 80);
      const host = this.configForm.host.replace(/^(https?:\/\/)/, '');
      this.updateHost(host);
      this.updatePort(port);
      this.updateProtocol(this.http_or_https);
      configureAxiosInstance(this.$store);
      this.mountBackendConfigFn();
      this.$message.success('修改成功！');
    },
    submitConfigFn() {
      const currSsl = window.location.protocol;
      console.log(currSsl);
      const isConsistent = currSsl === 'https:' && currSsl !== this.http_or_https;
      if (isConsistent) {
        return this.$dialog({
          title: '提示',
          content: '配置与当前页面协议不一致, 是否继续?'
        })
          .then(() => {
            this.updataBackendConfigFn();
          })
          .catch((e) => {
            console.log(e);
          });
      }
      this.updataBackendConfigFn();
    },
    resetConfigFn() {
      this.configForm = {
        host: this.host,
        port: this.port
      };
      this.$message.info('已重置！');
    },
    async loginFn() {
      this.loading = true;
      try {
        const { data: res } = await loginAPI(this.loginForm);
        if (res.token) {
          this.updateToken(res.token);
          this.updateUsername(this.loginForm.username);
          this.updatePassword(this.loginForm.password);
          this.loading = false;
          this.$router.push('/');
        }
      } catch (error) {
        this.loading = false;
        if (error.response.status === 404) return this.showDialog('404');
        if (error.response.status === 401) return this.showDialog('401');
        console.log(error);
        this.$dialog({ title: '错误', content: error.message }).catch((action) => {});
      }
    },
    showDialog(name, msg) {
      if (name && name === 'forget') {
        this.dialogData = {
          title: '提示',
          message: '暂未开放！'
        };
      } else if (name && name === '401') {
        this.dialogData = {
          title: '警告',
          message: '账号或密码不正确！'
        };
      } else if (name && name === '404') {
        this.dialogData = {
          title: '警告',
          message: '请求资源不存在！检查后端服务是否正常！'
        };
      } else {
        this.dialogData = {
          title: '警告',
          message: msg
        };
      }
      this.isShowDialog = true;
    },
    mountBackendConfigFn() {
      this.configForm.host = this.host;
      this.configForm.port = this.port;
    }
  },
  computed: {
    ...mapState('layoutOption', [
      'host',
      'port',
      'protocol',
      'username',
      'password',
      'sandBoxPort'
    ]),
    whichTab() {
      return this.tabsFlag === 'login';
    }
  },
  mounted() {
    this.mountBackendConfigFn();
  },
  created() {
    this.loginForm.username = this.username;
    this.loginForm.password = this.password;
    this.configForm.host = this.host;
    this.configForm.port = this.port;
    this.http_or_https = this.protocol || 'https://';
  }
};
</script>

<style lang="scss" scoped>
.cmd-search-select {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  padding: 0 5px;
  width: auto;
  border-radius: inherit;
  background: #f5f7fa;
  cursor: pointer;

  .select-label {
    width: 3.8rem;
    text-align: center;
    // padding: 0 10px;
    background: transparent;
    height: 100%;
    outline: none;
    border: none;
    box-sizing: border-box;
    cursor: pointer;
  }

  .icon {
    margin-left: -5px;
  }
}

.select-dropdown {
  position: absolute;
  left: 0;
  top: calc(100% + 5px);
  padding: 10px 0;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 2;

  .select-item {
    min-width: fit-content;
    padding: 5px 15px;
    cursor: pointer;

    &:hover {
      background: #f0f0f0;
    }
  }
}

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
      margin: 20px auto 0;
      font-weight: 400;
      font-size: 14px;
      height: 40px;
    }
    .login {
      width: 100%;
    }

    & ::v-deep .pps-input-wrapper {
      width: 360px;
      height: 38px;
      margin: 0 auto 20px;
      // background: #fff;
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
  .config {
    .submit {
      display: flex;
      gap: 10px;

      .pps-button {
        flex-grow: 1;
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
