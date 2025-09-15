<template>
  <div class="create-user-modal">
    <h3 class="modal-title">创建用户</h3>
    <div class="form-group">
      <label>昵称:</label>
      <b-input type="text" placeholder="请输入昵称" v-model="value" />
      <span>{{ value }}</span>
    </div>
    <div class="form-group">
      <label>账号:</label>
      <input type="text" placeholder="请输入账号" />
    </div>
    <div class="form-group">
      <label>年龄:</label>
      <input type="number" placeholder="请输入年龄" />
    </div>
    <div class="form-group gender">
      <label>性别:</label>
      <label>
        <input type="radio" name="gender" value="男" checked />
        男
      </label>
      <label>
        <input type="radio" name="gender" value="女" />
        女
      </label>
    </div>
    <div class="form-group">
      <label>头像:</label>
      <input type="text" placeholder="请输入 https 地址" />
    </div>

    <!-- 快速创建 -->
    <div class="quick-create">
      <span>快速创建10个用户</span>
      <button class="quick-btn">
        <i class="icon">⚡</i>
        快速创建
      </button>
    </div>

    <!-- 底部按钮 -->
    <div class="modal-footer">
      <button class="cancel-btn">取消</button>
      <button @click="testAsync()" class="confirm-btn">确认</button>
    </div>
  </div>
</template>

<script>
import bInput from './bindInput.vue';
import { getVersionAPI } from '../../api/index';

const withAsyncCache = (fn) => {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key); // 返回缓存的值
    }
    try {
      const result = fn(...args);
      cache.set(key, result);
      return result;
    } catch (promise) {
      promise.then((value) => {
        cache.set(key, value); // 缓存异步结果
        // 重新执行函数（实际实现更复杂）
        withAsyncCache();
      });
      throw promise; // 继续向上传播异步
    }
  };
};

export default {
  components: { bInput },
  data() {
    return {
      value: 'abc'
    };
  },
  methods: {
    testAsync() {
      const getAPIWithCache = withAsyncCache(getVersionAPI);
      console.log('开始请求');
      this.main(getAPIWithCache);
      console.log('结束请求');
    },
    main(fn) {}
  }
};
</script>

<style>
.create-user-modal {
  width: 360px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: 'Microsoft YaHei', sans-serif;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
}

.form-group label {
  width: 70px;
  color: #333;
  font-size: 14px;
}

.form-group input[type='text'],
.form-group input[type='number'] {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-group input:focus {
  border-color: #409eff;
  box-shadow: 0 0 4px rgba(64, 158, 255, 0.4);
}

.gender label {
  margin-right: 10px;
}

.quick-create {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f7fa;
  padding: 8px 10px;
  border-radius: 8px;
  margin: 12px 0 16px;
}

.quick-btn {
  background: #409eff;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s;
}

.quick-btn:hover {
  background: #66b1ff;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn,
.confirm-btn {
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.cancel-btn {
  background: #f2f3f5;
  color: #606266;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.confirm-btn {
  background: #409eff;
  color: #fff;
}

.confirm-btn:hover {
  background: #66b1ff;
}
</style>
