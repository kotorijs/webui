<template>
  <div>
    <h2>关于信息</h2>
    <div>
      <p>
        这是专为<a href="https://github.com/biyuehu/kotori-bot" target="_blank"><strong>kotori-bot</strong></a
        >项目提供的一个<i>网站管理系统</i>，它依赖于<strong>kotori-bot</strong>之下的<a
          href="https://github.com/BIYUEHU/kotori-bot/tree/plugins/kotori-bot-admin-server"
          target="_blank"
          >kotori-bot-admin-server</a
        >插件，或者说<strong>kotori-bot-admin-server</strong>是后端部分，而本项目这是它的前端部分
      </p>
      <p>前端部分基于<i>Vue+Pinia+Element-Plus+TypeScript+Vite</i>，后端使用<i>Express</i>框架+<i>TypeScript</i></p>
      <hr />
      <li v-for="item in packageList">
        <a :href="'https://www.npmjs.com/package/' + item" target="_blank">{{ item }}</a>
      </li>
    </div>
    <div style="margin-top: 20px">
      <el-button type="success" size="large" @click="dialog = true">打赏作者</el-button>
      <a style="margin-left: 10px" href="https://github.com/biyuehu/kotori-bot-admin-web" target="_blank"
        ><el-button type="primary" size="large">点个star</el-button></a
      >
      <div>
        <el-image style="width: 200px" src="https://biyuehu.github.io/images/avatar.png" />
      </div>
      <el-dialog v-model="dialog" title="赞助" class="login-item">
        <div>
          作者的BTC地址<el-tooltip class="box-item" effect="dark" content="手动复制" placement="bottom"
            ><mark>{{ BTC }}</mark></el-tooltip
          >
        </div>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialog = false"> 确认 </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
  color: rgb(3, 131, 250);
}

mark {
  background-color: rgb(240, 91, 215);
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { BTC, packageList } from '@/func';
const dialog = ref<boolean>(false);
</script>
