<template>
  <div class="wrapper" v-resize-ob="cardResize">
    <div class="k-detail-list">
      <div class="items">
        <k-detail-item
          :key="index"
          class="k-detail-item"
          @detail="handleClick(index)"
          v-for="(item, index) in currentDetails"
          :avatar="`http://k.hotaru.icu/api/data/avatar/${item.name}`"
        >
          <template v-slot:title>{{ item?.name }}</template>
          <template v-slot:des>{{ item?.description }}</template>
          <template v-slot:author>V{{ item?.version }} {{ item?.author?.name }}</template>
        </k-detail-item>
      </div>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="detailsLen"
          :page-size="itemNum"
          :pager-count="5"
          :current-page.sync="pageIndex"
          @current-change="changeCurrentPage"
        ></el-pagination>
      </div>
      <pps-dialog :title="getCurrent?.name" :show.sync="isShowDialog">
        <template v-slot:content>
          <k-des>
            <template v-slot:title><div></div></template>
          </k-des>
        </template>
      </pps-dialog>
    </div>
    <div class="k-description">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import kDetailItem from '@/views/modules/itemDetails.vue';
import kDes from '@/views/modules/description';
import { mapGetters } from 'vuex';

export default {
  name: 'modulesCenter',
  components: { kDetailItem, kDes },
  data() {
    return {
      currentDetails: null,
      itemNum: 16,
      detailsLen: 0,
      pageSize: [],
      pageIndex: 1,
      isNarrow: false,
      isShowDialog: false
    };
  },
  methods: {
    cardResize(x, _) {
      const xx = Math.floor(x);
      if (xx <= 425) this.isNarrow = true;
      else this.isNarrow = false;
      if (xx <= 1819 && xx > 820) this.itemNum = 9;
      else if (xx <= 820 && xx > 632) this.itemNum = 6;
      else if (xx <= 632 && xx > 425) this.itemNum = 3;
      else this.itemNum = 16;
    },
    sliceData(start, end) {
      this.currentDetails = this.getData.slice(start, end);
      this.$store.commit('modulesDetail/updateCurrent', start);
    },
    calcPage(num) {
      this.pageSize = [];
      const row = Math.ceil(num / this.itemNum);
      for (let i = 1; i <= row; i++) {
        const start = i * this.itemNum - this.itemNum;
        const end = i * this.itemNum;
        if (i < row) {
          this.pageSize.push({ start, end });
          continue;
        }
        this.pageSize.push({ start, end: num });
      }
      try {
        this.sliceData(this.pageSize[0].start, this.pageSize[0].end);
      } catch (error) {}
      this.pageIndex = 1;
    },
    handleClick(index) {
      this.$store.commit('modulesDetail/updateCurrent', index + this.itemId);
      if (this.isNarrow) this.isShowDialog = true;
    },
    changeCurrentPage(num) {
      const index = num - 1;
      this.sliceData(this.pageSize[index].start, this.pageSize[index].end);
    }
  },
  computed: {
    ...mapGetters('modulesDetail', ['getData', 'getCurrent']),
    itemId() {
      return (this.pageIndex - 1) * this.itemNum;
    }
  },
  watch: {
    itemNum: {
      immediate: false,
      handler() {
        this.calcPage(this.detailsLen);
      }
    },
    getData: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.length) {
          this.detailsLen = newVal.length;
          this.calcPage(this.detailsLen);
        } else {
          this.currentDetails = [];
        }
      }
    }
  },
  created() {},
  mounted() {
    this.detailsLen = this.getData.length;
    this.calcPage(this.detailsLen);
  }
};
</script>

<style lang="less">
.wrapper {
  display: flex;
  width: 100%;
  flex-direction: row-reverse;
  justify-content: space-around;
}
.k-detail-list {
  margin-block-start: 10px;
  .items {
    display: flex;
    height: fit-content;
    flex-flow: row wrap;
    width: 100%;
  }
  .pagination {
    width: 100%;
    .el-pagination {
      width: fit-content;
      margin: 0 auto;
    }
  }
}

.k-description {
  margin-block-start: 10px;
  margin-inline-end: 10px;
  flex: 1;
  * {
    box-sizing: border-box;
  }
}

.k-detail-item {
  width: 25%;
}

@media screen and (min-width: 1920px) {
  .k-detail-list {
    width: 75%;
  }
  .k-detail-item {
    width: 25%;
  }
}
@media screen and (max-width: 1919px) and (min-width: 920px) {
  .k-detail-list {
    width: 75%;
  }
  .k-detail-item {
    width: 33.3%;
  }
}
@media screen and (max-width: 919px) and (min-width: 732px) {
  .k-detail-list {
    width: 66.6%;
  }
  .k-detail-item {
    width: 50%;
  }
}
@media screen and (max-width: 731px) and (min-width: 526px) {
  .k-detail-list {
    width: 50%;
  }
  .k-detail-item {
    width: 100%;
  }
}
@media screen and (max-width: 525px) {
  .k-detail-list {
    width: 100%;
  }
  .k-detail-item {
    width: 100%;
  }
  .k-description {
    display: none;
  }
}
</style>
