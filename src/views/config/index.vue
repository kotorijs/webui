<template>
  <!-- <table class="layui-table">
    <colgroup>
      <col width="150" />
      <col width="200" />
      <col />
    </colgroup>
    <tbody>
      <tr>
        <td>贤心</td>
        <td>2016-11-29</td>
        <td>人生就像是一场修行</td>
      </tr>
      <tr>
        <td>许闲心</td>
        <td>2016-11-28</td>
        <td>于千万人之中遇见你所遇见的人，于千万年之中，时间的无涯的荒野里…</td>
      </tr>
    </tbody>
  </table> -->
  <!-- <pps-button theme="text">按钮</pps-button> -->
  <div>
    <el-tag
      size="small"
      v-for="(item, index) in ['kotori', 'kams', 'ppshme', 'gpt']"
      :key="index"
      :type="tagsType[index]"
    >
      {{ item }}
    </el-tag>
    <el-tag>标签一</el-tag>
    <el-tag type="success">标签二</el-tag>
    <el-tag type="info">标签三</el-tag>
    <el-tag type="warning">标签四</el-tag>
    <el-tag type="danger">标签五</el-tag>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tagsType: ['', 'success', 'info', 'danger', 'warning']
    };
  }
};
</script>

<style scoped lang="less">
div {
  width: 100%;
}
</style>
