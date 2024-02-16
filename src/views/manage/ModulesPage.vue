<template>
  <div v-loading="!modulesData">
    <h2>模块管理</h2>
    <el-card>
      <el-table :data="modulesData" style="width: 100">
        <el-table-column prop="[0].name" label="包名" />
        <el-table-column prop="[0].description" label="描述" />
        <el-table-column prop="[0].version" label="版本" width="100" />
        <el-table-column prop="[0].author" label="作者" />
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
          :tabSize="4"
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
import { ElMessage } from 'element-plus';
import { getConfig, getModules } from '@/http';

type Module = [Record<string, string>, Record<string, string>];

const modulesData = ref<Module[]>([]),
  code = ref(''),
  dialogViewCode = ref(false),
  dialogViewCodeState = ref(true);
const extensions = [javascript(), oneDark];

getModules().then((res) => {
  res!.data.forEach((module: Module) => {
    if (Array.isArray(module[0].author)) module[0].author = module[0].author.join(',');
  });
  modulesData.value = res!.data;
});

const viewConfig = async (index: number) => {
  const id = modulesData.value[index][0].name;
  const res = (await getConfig('module', id))!.data;
  if (Object.keys(res).length <= 0 || (Object.keys(res).length === 1 && Object.keys(res.filter).length <= 0)) {
    ElMessage.warning('该模块无配置内容');
  } else {
    code.value = JSON.stringify(res, undefined, 2);
    dialogViewCode.value = true;
    dialogViewCodeState.value = true;
  }
};
</script>
