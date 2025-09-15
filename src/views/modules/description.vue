<template>
  <el-card class="modules-item">
    <slot name="title">
      <div slot="header" class="clearfix">
        <span>{{ getCurrent?.description }}</span>
        <el-link
          style="float: right; padding: 3px 0"
          type="primary"
          target="_blank"
          :href="`https://kotori.js.org/modules/#${getCurrent?.name}`"
          title="官方文档"
        >
          文档
        </el-link>
      </div>
    </slot>
    <template v-if="isLoading">
      <div class="avatar list">
        <img
          :src="`http://k.hotaru.icu/api/data/avatar/${getCurrent.name}`"
          :title="getCurrent.name"
        />
      </div>
      <div class="title list">
        <h3>{{ getCurrent.name }}</h3>
      </div>
      <div class="download list">
        <pps-button theme="confirm" @click.native="dialog = true">下载</pps-button>
      </div>
      <div class="author list">
        <h3 class="mb10">开发信息</h3>
        <ul>
          <li>
            <strong>类别 :</strong>
            &nbsp;
            {{ category }}
          </li>
          <li>
            <strong>作者 :</strong>
            &nbsp;
            <el-link type="primary" :href="`mailto://${getCurrent.author?.email}`">
              {{ getCurrent.author?.name }}
            </el-link>
          </li>
          <li>
            <strong>描述 :</strong>
            &nbsp;
            {{ getCurrent.description }}
          </li>
        </ul>
      </div>
      <div class="version list">
        <h3 class="mb10">版本信息</h3>
        <ul>
          <li>
            <strong>最新版本 :&nbsp;</strong>
            v{{ getCurrent.version }}
          </li>
          <li>
            <strong>创建日期 :&nbsp;</strong>
            <span v-trans-time="getCurrent.time.created"></span>
          </li>
          <li>
            <strong>更新日期 :&nbsp;</strong>
            <span v-trans-time="getCurrent.time.modified"></span>
          </li>
        </ul>
      </div>
      <div class="file list">
        <h3 class="mb10">文件信息</h3>
        <ul>
          <li>
            <strong>依赖数 :&nbsp;</strong>
            {{ getCurrent.dist.dependencies }}
          </li>
          <li>
            <strong>文件数 :&nbsp;</strong>
            {{ getCurrent.dist.fileCount }}
          </li>
          <li>
            <strong>大&emsp;小 :&nbsp;</strong>
            {{ unpackSize }}
          </li>
        </ul>
      </div>
    </template>
    <el-empty v-else description="描述文字"></el-empty>
    <pps-dialog title="提示" :show.sync="dialog">
      <template v-slot:content>
        <el-link type="primary" class="downloadLink" :href="`${getCurrent.dist.tarball}`">
          直接下载
        </el-link>
        <el-link
          target="_blank"
          type="primary"
          class="downloadLink"
          :href="`https://www.npmjs.com/package/${getCurrent.name}`"
        >
          npm下载
        </el-link>
      </template>
    </pps-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'description',
  data() {
    return {
      detail: {},
      dialog: false
    };
  },
  methods: {
    downloadFn() {
      console.log(this.getCurrent.dist.tarball);
    },
    transTime(time) {
      const date = new Date(time);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 月份是从0开始的，所以需要+1
      const day = date.getDate();
      const hours = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
      const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
      const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  },
  computed: {
    ...mapGetters('modulesDetail', ['getCurrent']),
    category() {
      const categoryMap = {
        official: '官方',
        plugin: '插件',
        adapter: '适配器',
        database: '数据库',
        service: '服务'
      };
      const enArr = this.getCurrent.category || [];
      const chArr = enArr.map((item) => categoryMap[item]);
      return chArr.join('、');
    },
    modifiedTime() {
      return this.transTime();
    },
    createdTime() {
      return this.transTime();
    },
    unpackSize() {
      const size = this.getCurrent.dist.unpackedSize;
      let tranSize = '';
      if (size) {
        if (size > 1024 * 1024) {
          tranSize = `${(size / 1024 / 1024).toFixed(2)}MB`;
        } else if (size > 1024) {
          tranSize = `${(size / 1024).toFixed(2)}KB`;
        } else {
          tranSize = `${size}B`;
        }
      }
      return tranSize;
    },
    isLoading() {
      if (this.getCurrent) {
        return true;
      }
      return false;
    }
  },
  created() {
    this.detail = this.$store.state.modulesDetail.current;
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.modules-item {
  height: 100%;
  .title {
    text-align: center;
  }
  .list + .list {
    margin-top: 20px;
  }
  .avatar {
    text-align: center;
    & img {
      width: 100px;
    }
  }
  .download {
    text-align: center;
    & button {
      width: 60%;
      border-radius: 5px;
    }
  }
  ul {
    margin-left: 20px;
    li + li {
      margin-top: 5px;
    }
  }
}
.mb10 {
  margin-bottom: 10px;
}
.downloadLink + .downloadLink {
  margin-left: 20px;
}
</style>
