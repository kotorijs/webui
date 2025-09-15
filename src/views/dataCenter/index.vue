<template>
  <div class="root" v-resize-ob:200="resizeHandler">
    <el-card class="banner-card">
      <el-row type="flex" justify="left">
        <el-col style="margin-left: 10px">
          <h1 style="font-size: 25px">欢迎使用 kotori！</h1>
          <p style="margin-top: 30px; font-size: 18px">快速开始，使用 kotori 快速搭建你的机器人</p>
        </el-col>
      </el-row>
      <div style="display: flex">
        <div class="card-row">
          <div class="col-box" v-for="(item, index) in cardRowData" :key="index">
            <h1 v-text="item.title"></h1>
            <p v-text="item.content"></p>
          </div>
        </div>
        <div class="image">
          <div class="image-bg"></div>
          <img src="@/assets/favicon.svg" alt="" />
          <!-- <div class="earth" id="earth"></div> -->
        </div>
      </div>
    </el-card>
    <el-row :gutter="20" class="club">
      <el-col
        v-for="(item, index) in infoData"
        :span="Math.floor(24 / infoData.length)"
        :xs="12"
        :key="index"
      >
        <el-card>
          <h1 v-text="item.name"></h1>
          <p v-text="item.value"></p>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" type="flex" class="echarts-part">
      <el-col>
        <el-card>
          <div class="gragh_pannel" id="column_show"></div>
        </el-card>
      </el-col>
      <el-col>
        <el-card>
          <div class="gragh_pannel" id="curve_show"></div>
        </el-card>
      </el-col>
      <el-col>
        <el-card class="table">
          <table class="layui-table">
            <colgroup>
              <col width="150" />
              <col width="200" />
              <col />
            </colgroup>
            <tbody>
              <tr v-for="(item, index) in systemData" :key="index">
                <td v-text="item.name"></td>
                <td v-text="item.value"></td>
              </tr>
            </tbody>
          </table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getStatsAPI } from '@/api';
import { systemRF, countRF, clubRF } from '@/utils/zh-CN';
export default {
  name: 'dataCenter',
  data() {
    return {
      chatsNum: {
        sent: [],
        received: []
      },
      infoData: [],
      systemData: [],
      test: [],
      countData: {},
      curveChart: null,
      columnChart: null,
      cardRowData: [
        {
          title: '跨平台',
          content: '得益于模块化支持，通过编写各种模块实现不同的功能与聊天平台接入'
        },
        {
          title: '解耦合',
          content: '基于控制反转与面向切面编程思想，减少代码冗余与复杂度'
        },
        {
          title: '现代化',
          content: '使用现代化的 ECMAScript 语法规范与强大的 TypeScript 类型支持'
        }
      ],
      dataCenter: { node: null, pkg: { version: null } },
      botsList: []
    };
  },
  methods: {
    setColumnChartFn() {
      if (this.columnChart) {
        this.columnChart.dispose();
      }
      const chartDom = document.getElementById('column_show');
      if (!chartDom) return;
      this.columnChart = this.$echarts.init(chartDom);
      const color = [
        '#5470c6',
        '#91cc75',
        '#fac858',
        '#ee6666',
        '#3ba272',
        '#fc8452',
        '#9a60b4',
        '#ea7ccc'
      ];
      const name = this.countData.map((item) => {
        return item.name;
      });

      const data = this.countData.map((item, index) => {
        return {
          value: item.value,
          name: item.name,
          itemStyle: {
            color: color[index]
          }
        };
      });

      const option = {
        title: {
          text: '数据统计'
        },
        xAxis: {
          axisLabel: { fontSize: 10, interval: 0 },
          type: 'category',
          data: name
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data,
            type: 'bar'
          }
        ]
      };

      option && this.columnChart.setOption(option);
    },
    setCurvetChartFn() {
      if (this.curveChart) {
        this.curveChart.dispose();
      }
      const chartDom = document.getElementById('curve_show');
      if (!chartDom) return;
      this.curveChart = this.$echarts.init(chartDom);

      const date = new Date();
      const dateList = [];
      dateList[0] = '今天';
      for (let i = 1; i < 7; i++) {
        date.setDate(date.getDate() - 1);
        dateList[i] = `${date.getMonth() + 1}月${date.getDate()}日`;
      }

      const option = {
        title: {
          text: '七日内消息收发量',
          top: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['接收量', '发送量'],
          top: '25'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          scale: true,
          data: dateList
        },
        yAxis: {
          type: 'value',
          scale: true,
          min: 'dataMin',
          max: 'dataMax'
        },
        series: [
          {
            name: '发送量',
            type: 'line',
            stack: 'Total',
            data: this.chatsNum.sent
            // data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '接收量',
            type: 'line',
            stack: 'Total',
            data: this.chatsNum.received
            // data: [843, 1140, 673, 906, 861, 246, 494]
          }
        ]
      };

      option && this.curveChart.setOption(option);
    },
    resizeHandler() {
      if (this.curveChart && this.columnChart) {
        this.curveChart.resize();
        this.columnChart.resize();
      }
    },
    async getStatsFn() {
      const { data: res } = await getStatsAPI();

      this.chatsNum.sent = res.chats.sent;
      this.chatsNum.received = res.chats.received;
      this.infoData = clubRF(res.info);
      this.countData = countRF(res.count);
      this.systemData = systemRF(this.processUptime(res.system));
    },
    processUptime(data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key) && key === 'uptime') {
          const days = Math.floor(data[key] / 86400);
          const hours = Math.floor(data[key] / 3600) % 24;
          const seconds = Math.floor(data[key] / 60) % 60;
          data[key] = `${days > 1 ? days : 0}天${hours > 1 ? hours : 0}小时${
            seconds > 1 ? seconds : 0
          }秒`;
        }
      }
      return data;
    }
  },
  computed: {},
  async mounted() {
    await this.getStatsFn();
    this.processUptime();
    this.setColumnChartFn();
    this.setCurvetChartFn();
  },
  beforeDestroy() {
    if (this.curveChart) {
      this.curveChart.dispose();
    }
    if (this.columnChart) {
      this.columnChart.dispose();
    }
  }
};
</script>

<style lang="scss" scoped>
.card-row {
  display: flex;
  flex-direction: row;
  gap: 20px;
  min-height: 105px;
  margin-top: 30px;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }

  .col-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 275px;
    height: 100px;
    border: 1px solid #e3e3e5;
    padding: 20px;
    border-radius: 5px;
    transition: 0.2s linear;
    box-sizing: border-box;

    p {
      margin-top: 5px;
    }
  }
}

.image {
  position: relative;
  width: fit-content;
  height: auto;
  flex-grow: 1;
  text-align: center;
  transition: 0.2s linear;
  transform: translateY(calc(-50%));
  @media screen and (max-width: 1230px) {
    display: none;
  }
  .image-bg {
    background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
    filter: blur(72px);
  }
  .image-bg,
  img {
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 200px;
    height: 200px;
  }
}

.club {
  margin-top: 20px;

  h1 {
    font-size: 14px;
  }
  p {
    margin-top: 5px;
  }
  .el-col {
    margin-bottom: 20px;
  }
  .el-card {
    height: 80px;
  }
}

.echarts-part {
  .el-card {
    height: 100%;
  }
  .gragh_pannel {
    min-height: 300px;
  }
  @media screen and (max-width: 1080px) {
    flex-wrap: wrap;
    row-gap: 20px;
    .el-card {
      width: 100%;
    }
  }
}

.banner-card {
  margin-top: 10px;
}
</style>
