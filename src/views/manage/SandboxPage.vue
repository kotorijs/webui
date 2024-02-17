<template>
  <div>
    <h2>
      沙盒测试<small>Ws 状态：<span v-html="status"></span></small>
    </h2>
    <el-card style="background-color: rgb(242, 242, 242)">
      <div>
        <h3 v-html="title"></h3>
        <hr />
      </div>
      <el-scrollbar style="min-height: 450px; height: 70vh">
        <div v-for="(msg, index) in messageList" :key="msg.id">
          <div v-html="viewDate(msg.date, index)"></div>
          <el-row v-if="msg.user === store.sand.current" style="margin-bottom: 5px">
            <el-col :offset="3" :span="20">
              <div style="text-align: right">
                <span v-html="viewRole(msg.user)"></span
                >{{ store.getUser(msg.user) ? store.getUser(msg.user)!.name : 'unknown' }}
              </div>
              <div style="text-align: right; margin-top: 4px">
                <span
                  style="border-radius: 6px; background-color: rgb(0, 153, 255); color: white; padding: 3px"
                  v-html="msg.message"
                >
                </span>
              </div>
            </el-col>
            <el-col :span="1" style="margin-top: 10px"
              ><el-avatar
                :src="
                  store.getUser(msg.user)?.qq
                    ? `https://q.qlogo.cn/headimg_dl?spec=640&dst_uin=${store.getUser(msg.user)!.qq}`
                    : ''
                "
              >
                {{ store.getUser(msg.user)?.name }}
              </el-avatar></el-col
            >
          </el-row>
          <el-row v-else>
            <el-col :span="1" style="margin-top: 10px"
              ><el-avatar
                :src="
                  store.getUser(msg.user)?.qq
                    ? `https://q.qlogo.cn/headimg_dl?spec=640&dst_uin=${store.getUser(msg.user)!.qq}`
                    : ''
                "
              >
                {{ store.getUser(msg.user)?.name }}
              </el-avatar></el-col
            >
            <el-col :span="20">
              <div>
                {{ store.getUser(msg.user) ? store.getUser(msg.user)!.name : 'unknown'
                }}<span v-html="viewRole(msg.user)"></span>
              </div>
              <span
                style="border-radius: 6px; background-color: white; margin-top: 4px; padding: 3px"
                v-html="msg.message"
              >
              </span>
            </el-col>
          </el-row>
        </div>
      </el-scrollbar>
      <el-row>
        <el-col :span="22">
          <el-input
            aligen="center"
            v-model="message"
            :autosize="{ minRows: 3, maxRows: 5 }"
            type="textarea"
            placeholder="请输入发送内容"
        /></el-col>
        <el-col style="margin-left: 1vw" :span="1">
          <el-row>
            <el-col>
              <el-button type="primary" @click="() => sendMsg()">发送</el-button>
            </el-col>
            <el-col style="margin-top: 5px">
              <el-button type="info" @click="dialogView = true">设置</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <div>
      <el-dialog v-model="dialogView" title="设置">
        <div>
          <h3>用户选择</h3>
          <el-select v-model="store.sand.current" class="m-2" placeholder="Select" size="large" style="width: 240px">
            <el-option
              v-for="user in store.sand.users"
              :key="user.id"
              :label="`${user.name}（${user.id}）`"
              :value="user.id"
            />
          </el-select>
          <h3>场景选择</h3>
          <el-select
            v-model="store.sand.currentScopeId"
            class="m-2"
            placeholder="Select"
            size="large"
            style="width: 240px"
          >
            <el-option
              v-for="id in [
                ...store.getUser(store.sand.current)!.users,
                ...store.getUser(store.sand.current)!.groups.map((el) => el[0])
              ]"
              :key="id"
              :label="`${store.getUser(id) ? `好友：${store.getUser(id)!.name}（${store.getUser(id)!.id}）` : `群聊：${store.getGroup(id)!.name}（${store.getGroup(id)!.id}）`}`"
              :value="id"
            />
          </el-select>
          <h3>连接设置</h3>
          <span>WebSocket 服务器地址</span><br />
          <el-input v-model="store.sand.address" style="width: 240px" /><br />
          <span>绑定 Bot</span><br />
          <el-select v-model="store.sand.bot" class="m-2" placeholder="Select" size="large" style="width: 240px">
            <el-option
              v-for="user in store.sand.users"
              :key="user.id"
              :label="`${user.name}（${user.id}）`"
              :value="user.id"
            />
          </el-select>
        </div>
        <span class="dialog-footer">
          <br />
          <el-button type="primary" @click="() => Ws.create()">连接服务器</el-button>
          <el-button type="info" @click="() => store.createGroup()">创建群聊</el-button>
          <el-button type="info" @click="() => store.createUser()">创建用户</el-button>
          <!--           <el-button type="warning" @click="() => store.removeUser(store.sand.current)">删除当前用户</el-button>
          <el-button
            type="warning"
            @click="() => store.sand.currentScopeId && store.removeGroup(store.sand.currentScopeId)"
            >删除当前群聊</el-button
          > -->
          <el-button type="danger" @click="store.sand.message = []">删除聊天记录</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<style>
.sand-label-owner {
  border-radius: 4px;
  margin-left: 0.3vw;
  padding: 0.1vw;
  color: rgb(255, 141, 64);
  background-color: rgb(245, 222, 207);
}

.sand-label-admin {
  border-radius: 4px;
  margin-left: 0.3vw;
  padding: 0.1vw;
  color: rgb(0, 153, 255);
  background-color: rgb(194, 225, 245);
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMainStore } from '@/store';
import { ElMessage } from 'element-plus';
import Ws from '@/func/ws';

const message = ref('');
const dialogView = ref(false);
const store = useMainStore();
const messageList = computed(() => store.getMsg(store.sand.currentScopeId ?? 0));
const title = computed(() => {
  if (!store.sand.currentScopeId) return undefined;
  const user = store.getUser(store.sand.currentScopeId);
  if (user) return /* html */ `${user.name} <small>${user.id}</small>`;
  const group = store.getGroup(store.sand.currentScopeId);
  if (group)
    return /* html */ `${group.name}（${store.sand.users.filter((user) => user.groups.map((el) => el[0]).includes(group.id)).length}） <small>${group.id}</small>`;
  return undefined;
});
const status = computed(() => {
  const isOnline = Ws.status.value === 'online';
  return /* html */ `<span style="color: ${isOnline ? 'lightgreen' : 'red'}">${isOnline ? '已连接' : '未连接'}</span>`;
});

const sendMsg = () => {
  if (!message.value.trim()) return;
  if (!store.sand.currentScopeId) {
    ElMessage.error(`发送失败，无有效会话场景`);
    return;
  }
  store.sendMsg(message.value, store.sand.currentScopeId);
  message.value = '';
};

const viewDate = (date: number, index: number) => {
  if (index > 0 && date - messageList.value[index - 1].date <= 1000 * 60 * 10) return '';
  const time = new Date(date);
  return /* html */ `<div style="text-align: center">
    <small style="color: rgb(153, 153, 153)">
      ${time.getFullYear()}/${time.getMonth() + 1}/${time.getDay()} ${time.getHours()}.${time.getMinutes()}
    </small>
</div>`;
};

const viewRole = (userId: number) => {
  if (!store.sand.currentScopeId || !store.getGroup(store.sand.currentScopeId)) return '';
  const user = store.getUser(userId);
  if (!user) return '';
  const group = user.groups.find((el) => el[0] === store.sand.currentScopeId);
  if (!group || group[1] === 'member') return '';
  return /* html */ `<span class="sand-label-${group[1]}">${group[1] === 'admin' ? '管理员' : '群主'}</span>`;
};
</script>
