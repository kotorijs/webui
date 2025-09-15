<template>
  <el-footer height="30px">
    <pps-context-menu :menus="menus" position="top">
      <div slot="content" class="version detail">
        <div class="kotori">kams v{{ version }}</div>
      </div>
    </pps-context-menu>
    <pps-context-menu
      :menus="[
        { label: '内存', rate: roundedRam.rate },
        { label: 'CPU', rate: roundedCpu.rate }
      ]"
      position="top"
    >
      <div slot="content" class="status detail">
        <span>内存:{{ fixedFn(roundedRam.rate) }} %</span>
        &nbsp;
        <span>CPU:{{ fixedFn(roundedCpu.rate) }} %</span>
      </div>
      <template v-slot:item="{ menu }">
        <div class="menu-item" v-for="(item, index) in menu" :key="index">
          <div class="rate">
            <span>{{ item.label }}</span>
            <el-progress :percentage="Number(item.rate)"></el-progress>
          </div>
        </div>
      </template>
    </pps-context-menu>
  </el-footer>
</template>

<script>
import { getStatusAPI } from '@/api/index';
import { mapGetters, mapMutations } from 'vuex';
import { version } from '@/../package.json';
export default {
  name: 'k-footer',
  data() {
    return {
      status: '',
      version
    };
  },
  methods: {
    ...mapMutations('webSocketOption', ['updateCpu', 'updateRam']),
    contextMenuFn() {},
    fixedFn(num) {
      return Number(num).toFixed(1);
    }
  },
  computed: {
    ...mapGetters('webSocketOption', ['roundedRam', 'roundedCpu']),
    menus() {
      return [
        { label: `主程序版本: v${this.status.main}` },
        { label: `核心版本: v${this.status.core}` },
        { label: `加载器版本: v${this.status.loader}` }
      ];
    }
  },
  created() {
    getStatusAPI().then(({ data: res }) => {
      this.status = res;
    });
  },
  mounted() {
    this.$ws.bus.$on('wsMessage', (msg) => {
      if (msg.type === 'stats') {
        this.updateCpu(msg.data.cpu);
        this.updateRam(msg.data.ram);
      }
    });
  },
  beforeDestroy() {
    this.$ws.bus.$off('wsMessage');
  }
};
</script>

<style scoped lang="scss">
.el-footer {
  height: var(--k-footer-height) !important;
  display: flex;
  justify-content: space-between !important;
  align-items: center;
  font-size: 12px;
  background-color: #eee;
  z-index: 5;

  .detail {
    height: 100%;
    display: inline-flex;
    align-items: center;
    user-select: none;
    &:hover {
      cursor: pointer;
      background: #ffffff;
    }
  }

  .menu-item {
    padding: 5px 10px;
    cursor: pointer;
    &:hover {
      background: #f5f5f5;
    }
  }

  & ::v-deep .rate {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    width: 160px;
    .el-progress {
      width: 80%;
      & ::v-deep .el-progress-bar {
        width: 90% !important;
      }
    }
  }

  .pps-context-menu-area {
    height: 100%;
  }
}
</style>
