<template>
  <div v-loading="content === ''">
    <h2>配置查看</h2>
    <div>
      <codemirror
        aria-readonly
        v-model="content"
        :autofocus="true"
        :indent-with-tab="true"
        :tabSize="4"
        :extensions="extensions"
      /><br />
    </div>
  </div>
</template>

<style></style>
<script setup lang="ts">
import { ref } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { getConfig } from '@/http';

const content = ref(''),
  extensions = [json(), oneDark];

getConfig().then((res) => {
  content.value = JSON.stringify(res!.data, undefined, 2);
});
</script>
