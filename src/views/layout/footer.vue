<template>
  <el-footer height="30px">
    <div class="status">
      <div>内存:{{ roundedRam.rate + '%' }}</div>
      &nbsp;
      <div>CPU:{{ roundedCpu.rate }}</div>
    </div>
  </el-footer>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'k-footer',
  mounted() {},
  computed: {
    ...mapGetters('webSocketOption', ['roundedRam', 'roundedCpu'])
  }
};
</script>

<style scoped lang="less">
.el-footer {
  justify-content: right !important;
  height: var(--k-footer-height) !important;
  .status {
    display: table;
    height: 100%;
    div {
      vertical-align: middle;
      display: table-cell;
      height: 100%;
      margin: 0 auto;
      padding: 0 5px;
      &:hover {
        cursor: pointer;
        background: #ffffff;
      }
    }
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
