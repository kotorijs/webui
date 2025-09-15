<template>
  <el-card v-resize-ob="cardResize">
    <k-container>
      <main>
        <pps-form @submit="submitFn" @reset="resetFn">
          <div class="k-list">
            <h3>全局配置</h3>
            <div class="k-list-item">
              <div class="k-list-main">
                <span>端口：</span>
                <el-input v-model="form.port" placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div class="k-list-item">
              <div class="k-list-main">
                <span>命令前缀 :</span>
                <el-input v-model="form['command-prefix']" placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div class="k-list-item">
              <div class="k-list-main">
                <span>自动加载模块目录 :</span>
                <el-input v-model="form.dirs[1]" placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div class="k-list-item">
              <div class="k-list-main">
                <span>是否使用彩色日志输出 :</span>
                <el-switch v-model="form.noColor" active-color="#00aeed"></el-switch>
              </div>
            </div>
            <div class="k-list-item">
              <div class="k-list-main">
                <span>日志等级 :</span>
                <el-select v-model="form.level" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in staticForm.level"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="k-list-item">
              <div class="k-list-main">
                <span>语言类型 :</span>
                <el-select v-model="form.lang" placeholder="请选择">
                  <el-option
                    v-for="item in staticForm.lang"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="k-list-item">
              <div class="k-list-main">
                <div></div>
                <div class="btn">
                  <pps-button theme="confirm">提交</pps-button>
                  <pps-button theme="default" type="reset">重置</pps-button>
                </div>
              </div>
            </div>
          </div>
        </pps-form>
        <pps-form @submit="submitBackendFn()" @reset="resetBackendFn()">
          <div class="k-list">
            <div>
              <h3>后端设置</h3>
              <p class="tip">警告！若无需分离前后端请谨慎修改！</p>
            </div>
            <div class="k-list-item">
              <div class="k-list-main">
                <span>后端IP地址</span>
                <pps-input
                  :content.sync="hostForm.host"
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
              </div>
            </div>
            <div class="k-list-item">
              <div class="k-list-main">
                <span>后端端口号</span>
                <pps-input :content.sync="hostForm.port" placeholder="后端端口号"></pps-input>
              </div>
            </div>
            <div class="k-list-item">
              <div class="k-list-main">
                <span>沙盒ws是否长连</span>
                <el-switch
                  @change="setSandboxWsAliveFn"
                  v-model="isKeepSandboxWsAlive"
                  active-color="#00aeed"
                ></el-switch>
              </div>
            </div>
            <div class="k-list-item">
              <div class="k-list-main">
                <div></div>
                <div class="btn">
                  <pps-button theme="confirm">提交</pps-button>
                  <pps-button theme="default" type="reset">重置</pps-button>
                </div>
              </div>
            </div>
          </div>
        </pps-form>
      </main>
      <k-aside></k-aside>
    </k-container>
  </el-card>
</template>

<script>
import { getGlobalConfigAPI, updateGlobalConfigAPI } from '@/api/index';
import kContainer from '@/components/layout/container.vue';
import { mapMutations, mapState } from 'vuex';
import { configureAxiosInstance } from '@/utils/request';
import kAside from '@/components/layout/aside.vue';
import dp from '@/components/dropdown';

export default {
  data() {
    return {
      isKeepSandboxWsAlive: false,
      form: {
        'command-prefix': '',
        port: null,
        lang: null,
        noColor: true,
        level: 10,
        dirs: []
      },
      staticForm: {
        lang: ['en_US', 'ja_JP', 'zh_TW', 'zh_CN'],
        level: [
          { label: 'TRACE', value: 10 },
          { label: 'DEBUG', value: 20 },
          { label: 'RECORD', value: 25 },
          { label: 'INFO', value: 30 },
          { label: 'WARN', value: 40 },
          { label: 'ERROR', value: 50 },
          { label: 'FATAL', value: 60 },
          { label: 'SILENT', value: 70 }
        ],
        dirs: []
      },
      hostForm: {
        host: '',
        port: '',
        wsHost: '',
        sandBoxPort: null
      },
      isLoading: false,
      isShowSelect: false,
      http_or_https: 'https:',
      listWidth: 0,
      isPadding: 1
    };
  },
  components: { kContainer, kAside, dp },

  methods: {
    ...mapMutations('layoutOption', ['updateHost', 'updatePort', 'updateSandBoxPort']),
    ...mapMutations('sandBox', ['SET_SANDBOX_WS_KEEPALIVE']),
    async getConfig() {
      const { data: res } = await getGlobalConfigAPI();
      this.form = { ...this.form, ...res };
    },
    async submitFn() {
      updateGlobalConfigAPI(this.form).then((res) => {
        if (res.status === 204) this.$message.success('修改成功！');
        else this.$message.error('修改失败！');
      });
    },
    resetFn() {
      this.getConfig();
      this.$message.info('已重置！');
    },
    updataBackendConfigFn() {
      const ssl = this.http_or_https === 'https://';
      const port = this.hostForm.port || (ssl ? 443 : 80);
      const host = this.hostForm.host;
      console.log('new', this.http_or_https);
      this.updateHost(host);
      this.updatePort(port);
      this.updateSandBoxPort(this.hostForm.sandBoxPort);
      configureAxiosInstance(this.$store);
      this.mountBackendConfigFn();
      this.$message.success('修改成功！');
    },
    mountBackendConfigFn() {
      this.hostForm.host = this.host.replace(/^(https?:\/\/)/, '');
      this.hostForm.port = this.port;
      this.hostForm.sandBoxPort = this.sandBoxPort;
    },
    submitBackendFn() {
      const currSsl = window.location.protocol;
      const isConsistent = currSsl === 'https:' && currSsl !== this.http_or_https;
      if (isConsistent) {
        return this.$confirm('配置与当前页面协议不一致, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.updataBackendConfigFn();
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消修改'
            });
          });
      }
      this.updataBackendConfigFn();
    },
    resetBackendFn() {
      this.configForm = {
        host: this.host,
        port: this.port,
        sandBoxPort: this.sandBoxPort
      };
      this.$message.info('已重置！');
    },
    selectSslFn(ssl) {
      this.http_or_https = ssl;
    },
    cardResize(w, _) {
      if (Math.floor(w) <= 700) {
        this.listWidth = 100;
        this.isPadding = 0;
      } else {
        this.listWidth = 90;
        this.isPadding = 1;
      }
    },
    initSandboxWsAliveFn() {
      this.isKeepSandboxWsAlive = this.store_keepSandboxWsAlive;
    },
    setSandboxWsAliveFn(status) {
      this.SET_SANDBOX_WS_KEEPALIVE(status);
    }
  },
  computed: {
    ...mapState('layoutOption', ['host', 'port', 'protocol', 'sandBoxPort']),
    ...mapState('sandBox', {
      store_keepSandboxWsAlive: 'isKeepSandboxWsAlive'
    })
  },
  mounted() {
    this.http_or_https = this.protocol || 'https://';
  },
  created() {
    this.getConfig();
    this.mountBackendConfigFn();
    this.initSandboxWsAliveFn();
  }
};
</script>

<style scoped lang="less">
.el-card {
  margin-top: 10px;
}
.k-container {
  justify-content: center;
  main {
    width: 60%;

    @media screen and (max-width: 700px) {
      width: 100%;
    }
  }
  // 预留广告位
  aside {
    display: none;
    width: 30%;
    @media screen and (max-width: 900px) {
      display: none;
    }
  }
  & ::v-deep .pps-input--prepend {
    width: 130px;
  }
}
.k-list {
  margin: 0 auto;
  padding: calc(v-bind(isPadding) * 3rem) calc(v-bind(isPadding) * 2rem);
  box-sizing: border-box;

  & > :nth-child(2) {
    border-top: 1px solid var(--normal-shadow);
  }
  .k-list-item {
    width: 100%;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid var(--normal-shadow);
    box-sizing: border-box;

    &:hover {
      background: var(--normal-color);
    }

    .k-list-main {
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }

  .tip {
    color: red;
  }

  h3 {
    margin: 1rem 0;
  }
}
.el-input {
  width: fit-content;
}
.pps-button {
  border-radius: 4px;
  max-width: 60px;
}

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
</style>
