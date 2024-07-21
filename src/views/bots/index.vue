<template>
  <el-card>
    <el-table :data="bots" border style="width: 100%">
      <el-table-column prop="identity" label="ID"></el-table-column>
      <el-table-column prop="platform" label="聊天平台"></el-table-column>
      <el-table-column prop="id" label="平台ID"></el-table-column>
      <el-table-column prop="id" label="连接时间">
        <template slot-scope="scope">
          {{ transTime(scope.row.status.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="上次发送消息时间">
        <template slot-scope="scope">
          {{ transTime(scope.row.status.lastMsgTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status.receivedMsg"
        label="接收信息数"
      ></el-table-column>
      <el-table-column prop="status.sentMsg" label="发送信息数"></el-table-column>
      <el-table-column prop="status.offlineTimes" label="下线次数"></el-table-column>
      <el-table-column prop="lang" label="使用语言"></el-table-column>
      <el-table-column prop="status.value" label="在线状态"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row.identity)"
            type="text"
            size="small"
          >
            查看
          </el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { getBotsDataAPI, getBotsConfigAPI } from '@/api/index';
export default {
  name: 'botsPage',
  data() {
    return {
      bots: []
    };
  },
  methods: {
    handleClick(row) {
      getBotsConfigAPI(row).then((res) => {
        console.log(res.data);
      });
    },
    transTime(time) {
      if (!time) return '未发送过信息';
      const date = new Date(time);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 月份是从0开始的，所以需要+1
      const day = date.getDate();
      const hours = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
      const minutes =
        date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
      const seconds =
        date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  },
  computed: {},
  mounted() {
    getBotsDataAPI().then((res) => {
      this.bots = res.data;
    });
  }
};
</script>

<style>
.el-card {
  margin-top: 10px;
  height: calc(100% - 25px);
}
</style>
