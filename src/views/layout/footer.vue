<template>
  <el-footer height="30px">
    <div>
      内存使用率：
      <span>{{ roundedRam.total }}</span>
      cpu:
      <span>{{roundedCpu.rate}}</span>
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

<style></style>
