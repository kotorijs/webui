<template>
  <div class="sidebar-header" :style="{ left: asideWidth }">
    <div>
      <el-button style="margin-right: 5px" :icon="Menu" @click="store.changeStateAside()" />
      <span>{{ screenWidthType ? 'Kotori Webui' : 'Kotori' }}</span>
    </div>

    <div>
      <small v-html="topTips"></small>
      <el-button class="bottom" :icon="FullScreen" @click="changeScreen" />
      <span style="width: 40px; height: 40px">
        <el-dropdown class="dropdown">
          <el-avatar shape="square" :size="45" src="https://kotori.js.org/favicon.svg" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="exitLogin">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </span>
    </div>
  </div>
</template>

<style scoped>
.dropdown:hover {
  border-color: blue !important;
}
</style>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useMainStore } from '@/store';
import router from '@/router';
import { Menu, FullScreen } from '@element-plus/icons-vue';
import screenfull from 'screenfull';
import { getInfo } from '@/http';

const store = useMainStore();
const screenWidthType = document.body.clientWidth > 630;
const infoData = ref<Record<string, number>>({});

/* 第一次进入网站根据设备宽带设置Aside默认值 */
if (store.state.aside === null) {
  store.state.aside = !screenWidthType;
}

const topTips = computed(() => {
  if (Object.keys(infoData.value).length <= 0) return '';
  return screenWidthType
    ? `CPU: ${infoData.value.cpu.toFixed(2)}% 内存: ${infoData.value.ram.toFixed(2)}% 版本: v${infoData.value.version} `
    : `CPU: ${infoData.value.cpu.toFixed(2)}% 内存: ${infoData.value.ram.toFixed(2)}% `;
});

const asideWidth = computed(() => {
  return store.state.aside ? '70px' : '200px';
});

const updateInfo = async () => {
  const res = await getInfo();
  if (!res || !res.data.cpu) {
    exitLogin();
    return;
  }
  infoData.value = res.data;
};

const exitLogin = () => {
  store.token = '';
  router.push('/login');
};

const changeScreen = () => (screenfull.isFullscreen ? screenfull.exit() : screenfull.request());

updateInfo();
setInterval(() => updateInfo(), 3000);
</script>
