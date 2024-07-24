<template>
  <el-card v-loading="isEmpty" v-resize-ob="cardResize">
    <el-table
      stripe
      fit
      :data="bots"
      v-loading="isLoading"
      v-resize-ob="handleSizeChange"
      :height="tableHeight"
    >
      <el-table-column prop="name" label="包名" align="center" fixed="left"></el-table-column>
      <el-table-column prop="description" label="描述" align="center"></el-table-column>
      <el-table-column label="版本" align="center">
        <template slot-scope="scope">v{{ scope.row.version }}</template>
      </el-table-column>
      <el-table-column prop="author" label="作者" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <pps-button theme="text" @click="handleViewDetails(scope.row)">详情</pps-button>
          <pps-button theme="text" @click="handleEdit(scope.row)">编辑</pps-button>
        </template>
      </el-table-column>
    </el-table>
    <pps-dialog :show.sync="isShowDetailsDialog">
      <template slot="title">
        <span>{{ viewDetailsData.name }}</span>
        <el-select
          v-if="Object.hasOwn(viewDetailsData, 'dependencies')"
          v-model="formInline"
          placeholder="版本列表"
          :append-to-body="false"
        >
          <el-option
            v-for="(item, index) in obj2Arr(viewDetailsData.dependencies)"
            :label="item.value"
            :value="item.value"
            :key="index"
          ></el-option>
        </el-select>
      </template>
      <template slot="content">
        <el-descriptions direction="vertical" :column="2" border>
          <el-descriptions-item
            label="许可证"
            labelClassName="my-label"
            contentClassName="my-label"
          >
            {{ viewDetailsData.license }}
          </el-descriptions-item>
          <el-descriptions-item label="文件" labelClassName="my-label" contentClassName="my-label">
            {{ joinArr(viewDetailsData.files) }}
          </el-descriptions-item>
          <el-descriptions-item label="语言" labelClassName="my-label" contentClassName="my-label">
            {{ joinArr(viewDetailsData.kotori.meta.language) }}
          </el-descriptions-item>
          <el-descriptions-item label="标签" labelClassName="my-label" contentClassName="my-label">
            <el-tag
              size="small"
              v-for="(item, index) in viewDetailsData.keywords"
              :key="index"
              :type="tagsType[index]"
              effect="dark"
            >
              {{ item }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item :labelStyle="{ display: 'none' }" :span="2">
            <el-table :data="viewDetailsData.pluginDependencies" style="width: 100%">
              <el-table-column align="center" prop="key" label="依赖"></el-table-column>
              <el-table-column align="center" prop="value" label="版本"></el-table-column>
            </el-table>
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
    </pps-dialog>
  </el-card>
</template>

<script>
import { getUserModulesAPI, getPluginsConfigAPI } from '@/api/index';
export default {
  name: 'modulesPage',
  data() {
    return {
      bots: [],
      isEmpty: false,
      isChangeTable: false,
      isShowDetailsDialog: false,
      isShowEditDialog: false,
      isLoading: false,
      tableHeight: 0,
      pluginDetail: {},
      formInline: '',
      viewDetailsData: {
        name: '',
        version: '',
        description: '',
        main: 'lib/index.js',
        keywords: [],
        license: '',
        files: [],
        author: '',
        dependencies: {},
        peerDependencies: {
          'kotori-bot': ''
        },
        kotori: {
          meta: {
            language: []
          }
        },
        pluginDependencies: [
          {
            dependencies: '',
            version: ''
          },
          {
            dependencies: '',
            version: ''
          }
        ]
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
          type: 'object',
          title: 'Filter Configuration',
          description: 'Configuration for including or excluding items from a list',
          properties: {
            mode: {
              type: 'string',
              enum: ['include', 'exclude'],
              default: 'exclude',
              description: 'Determines whether to include or exclude items in the list'
            },
            list: {
              type: 'array',
              items: {
                type: 'string'
              },
              default: [],
              description: 'List of items to include or exclude'
            }
          },
          required: ['mode', 'list']
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
      },
      tagsType: ['', 'success', 'info', 'danger', 'warning']
    };
  },
  directives: {},
  methods: {
    handleViewDetails(row) {
      this.handleDialogMask(() => {
        this.viewDetailsData = { ...this.wiewDetailsData, ...row };
        if (row.peerDependencies) {
          this.viewDetailsData.pluginDependencies = this.obj2Arr(row.peerDependencies);
        }
        // console.log(this.viewDetailsData);
      });
    },
    handleEdit(row) {
      this.handleDialogMask(async () => {
        try {
          getPluginsConfigAPI(row.name).then(({ data: res }) => {
            // console.log(res);
          });
        } catch (err) {
          console.log(err);
        }
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
    },
    obj2Arr(obj) {
      console.log(Object.keys(obj).map((key) => ({ key, value: obj[key] })));
      return Object.keys(obj).map((key) => ({ key, value: obj[key] }));
    },
    joinArr(arr) {
      return arr.join('、');
    }
  },
  computed: {},
  async mounted() {
    const { data: res } = await getUserModulesAPI();
    console.log(res);
    this.bots = res;
    const { data: res1 } = await getPluginsConfigAPI();
    console.log(res1);
  }
};
</script>

<style scoped lang="less">
.el-card {
  margin-top: 10px;
  height: calc(100% - 25px);
}
.el-table {
  font-size: 14px;
}
.my-label {
  text-align: center !important;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
::v-deep .el-table__body-wrapper {
  &::-webkit-scrollbar {
    width: 5px; // 设置滚动条的宽度
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    position: absolute;
    right: -5px;
    width: 5px;
    background: #88888870;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #888888; // 鼠标悬停时滚动条的颜色
  }
}
</style>
