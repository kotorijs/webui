<template>
  <div id="aside" class="sidebar-aside">
    <el-menu
      :default-active="defaultActive"
      :collapse="store.state.aside"
      background-color="#4082ac"
      text-color="#ffffff"
      style="height: 100%"
      @select="select"
    >
      <el-menu-item v-for="item in AsideData" :key="item.id" :index="item.id">
        <el-tooltip v-if="store.state.aside" class="box-item" effect="dark" :content="item.text" placement="right">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
        </el-tooltip>
        <el-icon v-else>
          <component :is="item.icon"></component>
        </el-icon>
        <span>{{ item.text }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scpoed>
a {
  text-decoration: none;
}
</style>

<script lang="ts" setup>
import { ref } from 'vue';
import { useMainStore } from '@/store';
import router from '@/router';
import { useRoute } from 'vue-router';
import { AsideData } from '@/func';

const store = useMainStore();

const route = useRoute();
const defaultActive = ref<string>(AsideData.find((item) => '/' + item.path == route.path)?.id ?? '1');

const select = (id: string) => {
  const data = AsideData.find((item) => id === item.id);
  router.push(data?.path ?? '');
};
</script>
