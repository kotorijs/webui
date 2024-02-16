<template>
  <div>
    <h2>沙盒测试</h2>
    <el-card style="background-color: rgb(242, 242, 242)">
      <div>
        <h3 v-html="title"></h3>
        <hr />
      </div>
      <el-scrollbar style="min-height: 450px; height: 70vh">
        <div v-for="msg in messageList" :key="msg.id">
          <el-row
            ><el-col style="text-align: center"
              ><small style="color: rgb(153, 153, 153)"
                >{{ new Date(msg.date).getFullYear() }}/{{ new Date(msg.date).getMonth() + 1 }}/{{
                  new Date(msg.date).getDay()
                }}
                {{ new Date(msg.date).getHours() }}.{{ new Date(msg.date).getMinutes() }}</small
              ></el-col
            ></el-row
          >
          <el-row style="margin-bottom: 5px">
            <div v-if="msg.user === store.sand.current">
              <el-col :offset="3" :span="20">
                <div style="text-align: right">
                  {{ store.getUser(msg.user) ? store.getUser(msg.user)!.name : 'unknown'
                  }}<span class="sand-label-admin">管理员</span>
                </div>
                <div style="border-radius: 6px; background-color: white; margin-top: 4px; padding: 3px">
                  {{ msg.message }}
                </div>
              </el-col>
              <el-col :span="1" style="margin-top: 10px"
                ><el-avatar> {{ store.getUser(msg.user)?.name }} </el-avatar></el-col
              >
            </div>
            <div v-else>
              <el-col :span="1" style="margin-top: 10px"
                ><el-avatar> {{ store.getUser(msg.user)?.name }} </el-avatar></el-col
              >
              <el-col :span="20">
                <div>
                  {{ store.getUser(msg.user) ? store.getUser(msg.user)!.name : 'unknown'
                  }}<span class="sand-label-admin">管理员</span>
                </div>
                <div style="border-radius: 6px; background-color: white; margin-top: 4px; padding: 3px">
                  {{ msg.message }}
                </div>
              </el-col>
            </div>
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
          <el-select v-model="currentScopeId" class="m-2" placeholder="Select" size="large" style="width: 240px">
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
        </div>
        <span class="dialog-footer">
          <br />
          <el-button type="success" @click="dialogView = false"> 确认 </el-button>
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

const message = ref('');
const dialogView = ref(false);
const store = useMainStore();
const currentScopeId = computed(() => {
  const user = store.getUser(store.sand.current);
  if (!user) return undefined;
  if (user.groups && user.groups[0]) return user.groups[0][0];
  if (user.users) return user.users[0];
  return undefined;
});
const messageList = computed(() => {
  if (!currentScopeId.value) return [];
  return store.getMsg(currentScopeId.value);
});
const title = computed(() => {
  if (!currentScopeId.value) return undefined;
  const user = store.getUser(currentScopeId.value);
  if (user) return /* html */ `${user.name} <small>${user.id}</small>`;
  const group = store.getGroup(currentScopeId.value);
  if (group)
    return /* html */ `${group.name}（${store.sand.users.filter((user) => user.groups.map((el) => el[0]).includes(group.id)).length}） <small>${group.id}</small>`;
  return undefined;
});

const sendMsg = () => {
  if (!message.value.trim()) return;
  if (!currentScopeId.value) {
    ElMessage.error(`发送失败，无有效会话场景`);
    return;
  }
  store.sendMsg(message.value, currentScopeId.value);
};
</script>
