<template>
  <el-card v-resize-ob="cardResize">
    <pps-form @submit="submitFn" @reset="resetFn">
      <div class="k-list">
        <h2>全局配置</h2>
        <div class="k-list-item">
          <div class="k-list-main">
            <span>port端口：</span>
            <el-input v-model="form.port" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="k-list-item">
          <div class="k-list-main">
            <span>prefix命令前缀 :</span>
            <el-input v-model="form['command-prefix']" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="k-list-item">
          <div class="k-list-main">
            <span>dirs自动加载模块目录 :</span>
            <el-input v-model="form.dirs[1]" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="k-list-item">
          <div class="k-list-main">
            <span>noColor是否使用彩色日志输出 :</span>
            <el-switch v-model="form.noColor" active-color="#00aeed"></el-switch>
          </div>
        </div>
        <div class="k-list-item">
          <div class="k-list-main">
            <span>level日志等级 :</span>
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
            <span>lang语言类型 :</span>
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
          <pps-button theme="confirm">提交</pps-button>
          <pps-button theme="default" type="reset">重置</pps-button>
        </div>
      </div>
    </pps-form>
  </el-card>
</template>

<script>
import { getGlobalConfigAPI, updateGlobalConfigAPI } from '@/api/index';
export default {
  data() {
    return {
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
      isLoading: false,
      listWidth: 0,
      isPadding: 1
    };
  },
  methods: {
    async submitFn() {
      const { data: res } = await updateGlobalConfigAPI(this.form);
      console.log(res);
    },
    handleChange(value) {
      console.log(value);
    },
    async getConfig() {
      const { data: res } = await getGlobalConfigAPI();
      this.form = { ...this.form, ...res };
    },
    resetFn() {
      this.getConfig();
    },
    cardResize(w, _) {
      if (Math.floor(w) <= 700) {
        this.listWidth = 100;
        this.isPadding = 0;
      } else {
        this.listWidth = 90;
        this.isPadding = 1;
      }
    }
  },
  mounted() {
    this.getConfig();
  }
};
</script>

<style scoped lang="less">
.el-card {
  margin-top: 10px;
  height: var(--el-card-height);
}
.k-list {
  width: calc(v-bind(listWidth) * 1%);
  margin: 0 auto;
  // background: var(--normal-color);
  padding: calc(v-bind(isPadding) * 3rem) calc(v-bind(isPadding) * 2rem);
  box-sizing: border-box;

  .k-list-item {
    width: 100%;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid var(--normal-shadow);

    &:first-of-type {
      border-top: 1px solid var(--normal-shadow);
    }

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

  h2{
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
</style>
