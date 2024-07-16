<template>
  <el-card
    class="container"
    :style="`--s: ${widths[0]}px; --m: ${widths[1]}px; --l: ${widths[2]}px`"
  >
    <div class="border">
      <div class="body">
        <div class="avatar">
          <slot name="avatar"><img :src="avatar" /></slot>
        </div>
        <div class="detail">
          <div class="title">
            <el-link :underline="false">
              <h3>
                <slot name="title">test</slot>
              </h3>
            </el-link>
          </div>
          <div class="des">
            <slot name="des">使用kotori插件更轻量更易用！</slot>
          </div>
          <div class="author">
            <slot name="author">v1.2.0 biyuehu</slot>
          </div>
        </div>
      </div>

      <div class="action">
        <slot name="action">
          <pps-button theme="confirm">详情</pps-button>
        </slot>
      </div>
    </div>
  </el-card>
</template>

<script>
import image from '@/assets/favicon.svg';
export default {
  name: 'k-detail-item',
  data() {
    return {
      image
    };
  },
  props: {
    width: {
      type: String,
      default: '300'
    },
    widths: {
      type: Array,
      default() {
        return [500, 300, 300];
      }
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  computed: {
    imageSrc() {
      return this.avatar || image;
    }
  }
};
</script>

<style scoped lang="less">
.container {
  width: var(--m);
  box-sizing: border-box;

  @media screen and (max-width: 1300px) and (min-width: 1228px) {
    width: var(--s);
  }
  @media screen and (max-width: 1228px) and (min-width: 980px) {
    width: var(--m);
  }
  @media screen and (max-width: 980px) and (min-width: 830px) {
    width: var(--s);
  }
  @media screen and (max-width: 830px) {
    width: var(--l);
  }
}

.border {
  padding-left: 8px;
  padding-right: 8px;
}

.body {
  display: flex;
  margin-top: 10px;

  .avatar {
    margin-right: 10px;
    img {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: #f7b9b9;
    }
  }

  .detail {
    width: 100%;
    .title {
      margin-bottom: 5px;
    }
    .des {
      margin-bottom: 10px;
    }
  }
}

.action {
  display: flex;
  justify-content: right;
}
</style>
