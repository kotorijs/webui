<template>
  <div class="item-detail-wrapper">
    <div class="item-detail-container">
      <div class="item-detail">
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
              <slot name="des">
                使用kotori插件更轻量更易用！使用kotori插件更轻量更易用！使用kotori插件更轻量更易用！使用kotori插件更轻量更易用！使用kotori插件更轻量更易用！
              </slot>
            </div>
            <div class="author">
              <slot name="author">v1.2.0 biyuehu</slot>
            </div>
          </div>
        </div>
        <div class="action">
          <slot name="action">
            <pps-button theme="confirm" @click="handleClick">详情</pps-button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import image from '@/assets/logo.png';
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
      default: '25%'
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick() {
      this.$emit('detail');
    }
  },
  computed: {}
};
</script>

<style scoped lang="less">
.item-detail-wrapper {
  padding-left: 8px;
  padding-right: 8px;
  box-sizing: border-box;

  .item-detail-container {
    margin-block-end: 16px;

    .item-detail {
      padding: 20px;
      background: #fff;
      border-radius: 4px;
      border: 1px solid #ebeef5;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .body {
        display: flex;
        flex-direction: row;
        .avatar {
          margin-right: 10px;
          img {
            width: 46px;
            height: 46px;
            border-radius: 50%;
            background: #cccccc;
          }
        }
        .detail {
          .title {
            margin-bottom: 5px;
            & h3 {
              display: -webkit-box;
              overflow: hidden;
              -webkit-line-clamp: 1;
              word-break: break-word;
              -webkit-box-orient: vertical;
            }
          }
          .des {
            height: 38px;
            display: -webkit-box;
            margin-bottom: 10px;
            overflow: hidden;
            -webkit-line-clamp: 2;
            word-break: break-word;
            -webkit-box-orient: vertical;
          }
          .author {
            display: -webkit-box;
            margin-bottom: 10px;
            overflow: hidden;
            -webkit-line-clamp: 1;
            word-break: break-word;
            -webkit-box-orient: vertical;
          }
        }
      }
      .action {
        text-align: right;
        // margin-top: 10px;
      }
    }
  }
}
</style>
