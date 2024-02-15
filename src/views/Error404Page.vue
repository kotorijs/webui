<template>
  <div class="error-page">
    <el-result title="404" sub-title="走丢了啦，都你害得啦">
      <template #icon>
        <el-image src="https://kotori.js.org/favicon.svg" />
      </template>
      <template #extra>
        <el-button type="primary" @click="back">返回</el-button>
        <router-link style="margin-left: 10px" to="/">
          <el-button>主页</el-button>
        </router-link>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
const back = () => window.history.back();
</script>
