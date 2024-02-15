<template>
  <div v-loading="logData === ''">
    <h2>日志监控</h2>
    <span>选择日志文件</span>
    <hr />
    <el-select
      v-model="select"
      style="width: 100%"
      placeholder="Select"
      size="large"
      @change="updateContent(parseInt(select))"
    >
      <el-option v-for="item in logList" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-card style="margin-top: 10px">
      <el-input v-model="logData" rows="30" placeholder="Please input" show-word-limit type="textarea" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getLogList, getLogView } from '@/http';
import { optionType } from '@/func';
import { ref, reactive } from 'vue';

const logData = ref<string>(''),
  select = ref<string>('0'),
  logList = reactive<optionType[]>([]);

getLogList().then((res) => {
  const list = res.data.data;
  for (let init = 0; init < list.length; init++) {
    logList.push({
      value: init.toString(),
      label: list[init]
    });
  }
  updateContent();
});

const updateContent = (option: number = parseInt(select.value)) => {
  logData.value = '';
  getLogView(option).then((res) => {
    logData.value = res.data.data.content;
  });
};
</script>
