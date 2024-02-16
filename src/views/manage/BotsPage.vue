<template>
  <div v-loading="!botsData">
    <h2>实例管理</h2>
    <el-card>
      <el-table :data="botsData" style="width: 100">
        <el-table-column prop="identity" label="ID" />
        <el-table-column prop="platform" label="聊天平台" />
        <el-table-column prop="id" label="平台ID" />
        <el-table-column prop="receivedMsg" label="接收消息数" />
        <el-table-column prop="sentMsg" label="发送消息数" />
        <el-table-column prop="offlineTimes" label="下线次数" />
        <el-table-column prop="lang" label="使用语言" />
        <el-table-column prop="value" label="在线状态" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button link v-loading="false" type="primary" size="small" @click="viewConfig(scope.$index)"
              >查看配置</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
  <div>
    <el-dialog v-model="dialogViewCode" v-loading="dialogViewCodeState" title="查看内容">
      <div>
        <codemirror
          aria-readonly
          v-model="code"
          :style="{ maxHeight: '600px', height: '500px' }"
          :autofocus="true"
          :indent-with-tab="true"
          :tabSize="2"
          :extensions="extensions"
        /><br />
      </div>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogViewCode = false"> 确认 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { getBots, getConfig } from '@/http';

type Bot = Record<string, string>;

const botsData = ref<Bot[]>([]),
  code = ref(''),
  dialogViewCode = ref(false),
  dialogViewCodeState = ref(true);
const extensions = [javascript(), oneDark];

getBots().then((res) => {
  res!.data.forEach((bot: Bot) => {
    bot.value = bot.value === 'online' ? '在线' : '离线';
  });
  botsData.value = res!.data;
});

const viewConfig = async (index: number) => {
  const id = botsData.value[index].identity;
  code.value = JSON.stringify((await getConfig('adapter', id))!.data, undefined, 2);
  dialogViewCode.value = true;
  dialogViewCodeState.value = true;
};
</script>
