<template>
  <div>
    <div class="container-login" v-loading="isLoading">
      <div class="login-form login-item">
        <h1>Kotori Webui</h1>
        <el-form :model="form" label-position="top">
          <el-form-item label="用户名">
            <el-input v-model="form.user" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%" type="primary" @click="handleLogin">一键登录</el-button>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%" @click="dialogForget = true">忘记密码</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div>
      <el-dialog v-model="dialogForget" title="忘记密码" class="login-item">
        <div>你密码都忘了我还能咋办？</div>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogForget = false"> 确认 </el-button>
        </span>
      </el-dialog>
      <el-dialog v-model="dialogInput" title="提示" class="login-item">
        <div>用户名和密码为必填项！</div>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogInput = false"> 确认 </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import router from '@/router';
import { postLogin } from '@/http';
import { useMainStore } from '@/store';

const dialogForget = ref<boolean>(false),
  dialogInput = ref<boolean>(false),
  isLoading = ref<boolean>(false);

const form = reactive({
  user: '',
  password: ''
});

const handleLogin = async () => {
  isLoading.value = true;
  if (!form.user || !form.password) {
    dialogInput.value = true;
    return;
  }

  const res = await postLogin(form.user, form.password);
  if (res && res.data.token) {
    useMainStore().token = res.data.token;
    ElMessage.success('登录成功，跳转中...');
    isLoading.value = false;
    router.push('/index');
    if (res.data.default === true) ElMessage.info('当前为默认密码，请及时更改以防密码泄露');
  } else {
    isLoading.value = false;
    ElMessage.error('用户名或密码错误');
  }
};
</script>
