<template>
    <div class="test">
      {{ modules }}
    </div>
</template>

<script>
import { getModules1API } from '@/api/index'
export default {
  name: 'modulesPage',
  data() {
    return {
      modules: []
    };
  },
  mounted() {
    getModules1API().then(res => {
      this.modules = res.data;
    });
  }
};
</script>

<style>
</style>
