<template>
  <div v-loading="!isShow">
    <h2>数据中心</h2>
    <el-col md="6" xs="12">
      <el-card>
        <h3>欢迎使用</h3>
        <div>
          <span>kotori 是一个跨平台、解耦合、现代化于一体的聊天机器人框架。</span><br />
          <span>协议：GPL-3.0</span><br />
          <a href="https://kotori.js.org" target="_blank"><el-button type="success">阅读文档</el-button></a>
        </div>
      </el-card> </el-col
    ><br />
    <el-col md="6" xs="12">
      <el-card>
        <h3>统计数据</h3>
        <div>
          <span>中间件数量：{{ data?.midwares }}</span>
          <span> 指令数量：{{ data?.commands }}</span>
          <span> 正则数量：{{ data?.regexps }}</span>
          <span> 实例数量：{{ data?.bots }}</span>
          <span> 适配器数量：{{ data?.adapters }}</span>
          <span> 模块数量：{{ data?.modules }}</span>
        </div>
        <div>
          <span>实例在线数：{{ botOnline }} / {{ data?.bots }}</span>
          <span> 接收消息总数：{{ receivedMsg }}</span>
          <span> 发送消息总数：{{ sentMsg }}</span>
        </div>
        <div>
          <span>Kotori 版本：v{{ data?.pkg.version }}</span>
          <span> Node.js 版本：{{ data?.node }}</span>
        </div>
      </el-card> </el-col
    ><br />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getData, getBots } from '@/http';

const data = ref();
const bots = ref();
const botOnline = computed(() => {
  if (!bots.value) return 0;
  let count = 0;
  bots.value.forEach((bot: Record<string, string>) => {
    if (bot.value === 'online') count += 1;
  });
  return count;
});
const receivedMsg = computed(() => {
  if (!bots.value) return 0;
  let count = 0;
  bots.value.forEach((bot: Record<string, number>) => {
    count += bot.receivedMsg;
  });
  return count;
});
const sentMsg = computed(() => {
  if (!bots.value) return 0;
  let count = 0;
  bots.value.forEach((bot: Record<string, number>) => {
    count += bot.sentMsg;
  });
  return count;
});
const isShow = ref<boolean>(false);

(async () => {
  data.value = (await getData())!.data;
  bots.value = (await getBots())!.data;
  isShow.value = true;
})();
</script>
