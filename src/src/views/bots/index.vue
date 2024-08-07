<template>
  <el-card v-loading="isEmpty" v-resize-ob="cardResize">
    <el-table
      stripe
      fit
      :data="bots"
      v-loading="isLoading"
      v-resize-ob="handleSizeChange"
      style="width: 100%; font-size: 13px"
      border
      :height="tableHeight"
    >
      <el-table-column prop="identity" label="ID" sortable align="center"></el-table-column>
      <el-table-column prop="platform" label="聊天平台" align="center"></el-table-column>
      <el-table-column prop="id" label="平台ID" align="center"></el-table-column>
      <template v-if="!isChangeTable">
        <el-table-column prop="id" label="连接时间" min-width="90" align="center">
          <template slot-scope="scope">
            <span v-trans-time="scope.row.status.createTime"></span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="上次发送消息时间" min-width="90" align="center">
          <template slot-scope="scope">
            <span v-trans-time="scope.row.status.lastMsgTime"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status.receivedMsg"
          label="接收信息数"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          prop="status.sentMsg"
          label="发送信息数"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          prop="status.offlineTimes"
          label="下线次数"
          align="center"
        ></el-table-column>
        <el-table-column label="在线状态" align="center">
          <template slot-scope="scope">
            <!-- <pps-icon icon="pps-icon-online" v-if="scope.row.status.value === 'online'" /> -->
            <pps-icon :icon="`pps-icon-${scope.row.status.value}`" />
          </template>
        </el-table-column>
      </template>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <pps-button @click="handleViewDetails(scope.row)" theme="text">详情</pps-button>
          <pps-button theme="text" @click="handleEdit(scope.row)">编辑</pps-button>
        </template>
      </el-table-column>
      <el-table-column prop="lang" label="使用语言" align="center"></el-table-column>
    </el-table>
    <pps-dialog :show.sync="isShowDetailsDialog" :title="viewDetailsData.title">
      <template slot="content">
        <el-descriptions direction="vertical" :column="4" border>
          <el-descriptions-item label="上次发送消息时间">
            <span v-trans-time="viewDetailsData.content.status.lastMsgTime"></span>
          </el-descriptions-item>
          <el-descriptions-item label="接收信息数" :span="2">
            {{ viewDetailsData.content.status.receivedMsg }}
          </el-descriptions-item>
          <el-descriptions-item label="发送信息数">
            {{ viewDetailsData.content.status.sentMsg }}
          </el-descriptions-item>
          <el-descriptions-item label="连接时间">
            <span v-trans-time="viewDetailsData.content.status.createTime"></span>
          </el-descriptions-item>
          <el-descriptions-item label="在线状态">
            <span v-if="viewDetailsData.content.status.value === 'online'">
              <pps-icon icon="pps-icon-online" />
              在线
            </span>
            <span v-else>
              <pps-icon icon="pps-icon-offline" />
              离线
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="下线次数">
            {{ viewDetailsData.content.status.offlineTimes }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </pps-dialog>
    <pps-dialog :show.sync="isShowEditDialog" :title="editDialogData.id">
      <template slot="content">
        <vue-form
          v-model="editDialogData.origin"
          :ui-schema="uiSchema"
          :schema="editDialogData.schema"
        >
          <template slot=""><span></span></template>
        </vue-form>
      </template>
      <template slot="footer"></template>
    </pps-dialog>
  </el-card>
</template>

<script>
import { getBotsDataAPI, getBotsConfigAPI } from '@/api/index';
export default {
  name: 'botsPage',
  data() {
    return {
      bots: [],
      isEmpty: true,
      isChangeTable: false,
      isShowDetailsDialog: false,
      isShowEditDialog: false,
      isLoading: false,
      tableHeight: 0,
      viewDetailsData: {
        title: '提示',
        content: {
          identity: '',
          platform: '',
          id: '',
          lang: '',
          status: {
            createTime: '',
            lastMsgTime: '',
            receivedMsg: '',
            sentMsg: '',
            offlineTimes: '',
            value: ''
          }
        }
      },
      editDialogData: {
        id: '',
        origin: {
          'command-prefix': '',
          extends: '',
          lang: '',
          master: '',
          mode: ''
        },
        schema: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          title: 'WebSocket Configuration',
          description: 'Configuration for WebSocket connection',
          oneOf: [
            {
              type: 'object',
              properties: {
                mode: {
                  type: 'string',
                  enum: ['ws'],
                  description: 'WebSocket client mode'
                },
                port: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 65535,
                  description: 'Port number for the WebSocket connection'
                },
                address: {
                  type: 'string',
                  pattern: '^ws(s)?:\\/\\/(([\\w-]+\\.)+[\\w-]+(\\/[\\w-.\\/?%&=]*)?)?$',
                  default: 'ws://127.0.0.1',
                  description: 'WebSocket server address'
                },
                retry: {
                  type: 'integer',
                  minimum: 1,
                  default: 10,
                  description: 'Number of retry attempts for connection'
                }
              },
              required: ['mode', 'port', 'address', 'retry']
            },
            {
              type: 'object',
              properties: {
                mode: {
                  type: 'string',
                  enum: ['ws-reverse'],
                  description: 'WebSocket reverse proxy mode'
                }
              },
              required: ['mode']
            }
          ]
        }
      },
      schema: {
        type: 'object',
        required: ['userName', 'age'],
        properties: {
          userName: {
            type: 'string',
            title: '用户名',
            default: 'Liu.Jun'
          },
          age: {
            type: 'number',
            title: '年龄'
          },
          bio: {
            type: 'string',
            title: '签名',
            minLength: 10,
            default: '知道的越多、就知道的越少'
          }
        }
      },
      uiSchema: {
        bio: {
          'ui:options': {
            placeholder: '请输入你的签名',
            type: 'textarea',
            rows: 1
          }
        }
      }
    };
  },
  methods: {
    handleViewDetails(row) {
      this.handleDialogMask(() => {
        // const { data: res } = await getBotsDataAPI(row.identity);
        this.viewDetailsData.content = row;
        this.viewDetailsData.title = row.identity;
      });
    },
    handleEdit(row) {
      this.handleDialogMask(async () => {
        const { data: res } = await getBotsConfigAPI(row.identity);
        this.editDialogData.id = res.id;
        this.editDialogData.origin = res.origin;
      }, true);
    },
    async handleDialogMask(task, isEdit = false) {
      this.isLoading = true;
      await task();
      this.isLoading = false;
      isEdit ? (this.isShowEditDialog = true) : (this.isShowDetailsDialog = true);
    },
    handleSizeChange(width, _) {
      if (width < 450) {
        this.isChangeTable = true;
        return;
      }
      this.isChangeTable = false;
    },
    cardResize(_, h) {
      this.tableHeight = Math.floor(h) - 40;
    }
  },
  computed: {},
  mounted() {
    getBotsDataAPI().then((res) => {
      this.isEmpty = false;
      this.bots = res.data;
    });
  }
};
</script>

<style scoped>
.el-card {
  margin-top: 10px;
  height: var(--el-card-height);
}
</style>
