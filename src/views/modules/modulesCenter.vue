<template>
  <el-row :gutter="20">
    <el-col :xs="12" :sm="16" :md="16" :xl="15" class="module_card">
      <div class="top">
        <k-detail-item
          v-for="(item, index) in currentDetails"
          :key="index"
          width="260"
          :widths="[250, 300, 500]"
          :avatar="`http://k.hotaru.icu/api/data/avatar/${item.name}`"
        >
          <template v-slot:title>{{ item.name }}</template>
          <template v-slot:des>{{ item.description }}</template>
          <template v-slot:author>
            V{{ item.version }} {{ item.author.name }}
          </template>
          <template v-slot:action>
            <pps-button theme="confirm" @click="handleClick(index)">详情</pps-button>
          </template>
        </k-detail-item>
      </div>
      <div class="bottom">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="detailsLen"
          :page-size="9"
          @current-change="changeCurrentPage"
        ></el-pagination>
      </div>
    </el-col>
    <el-col :xs="12" :sm="8" :md="8" :xl="9" class="itemDetails">
      <router-view></router-view>
    </el-col>
    <el-dialog
      title="提示"
      :visible.sync="$store.state.modulesDetail.dialog"
      width="30%"
    >
      <el-link
        class="downloadLink"
        type="primary"
        @click.prevent="handleDialog"
        :href="`${getCurrent.dist.tarball}`"
      >
        直接下载
      </el-link>
      <el-link
        class="downloadLink"
        type="primary"
        :href="`https://www.npmjs.com/package/${getCurrent.name}`"
        target="_blank"
      >
        npm下载
      </el-link>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialog">取 消</el-button>
        <el-button type="primary" @click="handleDialog">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import { getAllModulesAPI } from '@/api';
import kDetailItem from './itemDetails.vue';
import { mapGetters } from 'vuex';
import currentDetails from '@/utils/moduleCenter';
export default {
  name: 'modulesCenter',
  components: { kDetailItem },
  data() {
    return {
      currentDetails,
      detailsLen: 0,
      pageSize: [],
      details: []
    };
  },
  methods: {
    async getModules() {
      const { data: res } = await getAllModulesAPI();
      this.detailsLen = res.list.length;
      this.details = res.list;
      this.calcPage(res.list.length);
      this.sliceData(0, 9, res.list);
    },
    sliceData(start, end, data) {
      this.currentDetails = data.slice(start, end);
      this.$store.commit('modulesDetail/updateData', this.currentDetails);
    },
    handleClick(index) {
      this.$store.commit('modulesDetail/updateCurrent', index);
    },
    calcPage(num) {
      const row = Math.ceil(num / 9);
      for (let i = 1; i <= row; i++) {
        const start = i * 9 - 9;
        const end = i * 9;
        if (i < row) {
          this.pageSize.push({ start, end });
          continue;
        }
        this.pageSize.push({ start, end: num });
      }
    },
    changeCurrentPage(num) {
      const index = num - 1;
      this.sliceData(
        this.pageSize[index].start,
        this.pageSize[index].end,
        this.details
      );
    },
    handleDialog() {
      this.$store.commit('modulesDetail/updateDialog');
    }
  },
  computed: {
    ...mapGetters('modulesDetail', ['getDialog', 'getCurrent'])
  },
  created() {
    this.getModules();
    this.handleDialog();
  },
  mounted() {
    this.$router.push('/modulesCenter/modulesItem');
    console.log('data里的currentDetails要改成mixin');
  }
};
</script>

<style scoped lang="less">
.el-card__body {
  height: 139px;
}
.module_card {
  @media screen and (max-width: 830px) {
    display: block;
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: 0 !important;
  min-height: calc(100vh - 70px);
}

.top {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
  min-height: 539px;
}

.bottom {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.itemDetails {
  height: calc(100vh - 100px);
  position: fixed;
  top: 50px;
  padding: 0px 20px !important;
  right: 0;
}
img {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #f7b9b9;
}
.downloadLink + .downloadLink {
  margin-left: 20px;
}
</style>
