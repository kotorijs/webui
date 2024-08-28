<template>
  <el-footer height="30px">
    <pps-context-menu :menus="menus" position="top">
      <div slot="content" class="version detail">
        <div class="kotori">kotori v{{ status.core }}</div>
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
      <template v-slot:item="{ scope }">
        <div class="rate">
          <span>{{ scope.label }}</span>
          <el-progress :percentage="Number(scope.rate)"></el-progress>
        </div>
      </template>
    </pps-context-menu>
  </el-footer>
</template>

<script>
import { getStatusAPI } from '@/api/index';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'k-footer',
  data() {
    return {
      status: ''
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
  mounted() {
    this.$ws.bus.$on('wsMessage', (msg) => {
      if (msg.type === 'stats') {
        this.updateCpu(msg.data.cpu);
        this.updateRam(msg.data.ram);
      }
    });
    getStatusAPI().then(({ data: res }) => {
      this.status = res;
    });
  },
  beforeDestroy() {
    this.$ws.bus.$off('wsMessage');
  }
};
</script>

<style scoped lang="less">
.el-footer {
  height: var(--k-footer-height) !important;
  display: flex;
  justify-content: space-between !important;
  align-items: center;

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

  .rate {
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

  .pps-context-menu-wrapper {
    height: 100%;
  }
}
.el-footer {
  background-color: #eee;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
