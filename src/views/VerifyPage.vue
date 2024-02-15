<template>
  <div
    v-loading.fullscreen.lock="true"
    element-loading-background="rgba(122, 122, 122, 0.8)"
    element-loading-text="我知道你很急，但你先别急...."
  >
    <HeaderCom />
    <AsideCom :style="{ width: '200px' }" />
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus';
import { useRoute } from 'vue-router';
// import { verifyToken } from '@/func';
import { useMainStore } from '@/store';
import HeaderCom from '@/components/HeaderCom.vue';
import AsideCom from '@/components/AsideCom.vue';
import { decode } from 'js-base64';

/* verifyToken();
useMainStore().token = decode(<string>useRoute().params.pathMatch);

setTimeout(
  () =>
    verifyToken(() =>
      ElMessageBox.alert('错误', '无效的登录地址或已过期！', {
        confirmButtonText: '确认'
      })
    ),
  1000
); */
</script>
