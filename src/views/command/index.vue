<template>
  <k-container v-resize-ob="screenResize">
    <k-aside v-show="isShowAside">
      <header class="cmd-search">
        <div class="cmd-search-input">
          <div class="cmd-search-icon icon-btn" @click="triggerPageFn" v-if="isSmall">
            <pps-icon icon="pps-icon-side-hide"></pps-icon>
          </div>
          <pps-form @submit="searchFn()">
            <pps-input
              style="position: relative"
              :content.sync="searchOption.searchWord"
              :after-clear="resetMenusFn"
            >
              <template v-slot:prepend>
                <div class="cmd-search-select" @click="isShowSelect = !isShowSelect">
                  <input class="select-label" type="text" readonly :value="searchOption.category" />
                  <div class="icon">
                    <i class="el-icon-arrow-down"></i>
                  </div>
                </div>
                <div class="select-dropdown" v-show="isShowSelect">
                  <div
                    class="select-item"
                    v-for="(item, index) in [
                      '指令名称',
                      '快捷方式',
                      '指令别称',
                      '使用场景',
                      '权限等级'
                    ]"
                    :key="index"
                    @click="selectCategroyFn(item)"
                  >
                    {{ item }}
                  </div>
                </div>
              </template>
              <template v-slot:append>
                <pps-button type="submit">
                  <pps-icon icon="pps-icon-search"></pps-icon>
                </pps-button>
              </template>
            </pps-input>
          </pps-form>
        </div>
      </header>

      <template #inner>
        <k-menu
          :default-active="getCurrent?.name"
          active-color="#752bec"
          :active-shape="['background']"
          text-color="#061e26"
          background-color="#f0e8fd"
          mode="column"
        >
          <k-menu-item
            v-for="(menu, index) in getCmds"
            :key="index"
            :index="menu.name"
            @click="selectCmdFn(menu)"
            width="200"
            height="40"
          >
            <p>{{ menu.name }}</p>
          </k-menu-item>
        </k-menu>
      </template>

      <div class="fill-empty"></div>
    </k-aside>
    <main class="" v-show="isShowMain" v-loading="isLoading">
      <div class="cmd-config-wrapper">
        <div class="cmd-config">
          <div class="cmd-title">
            <span class="icon-btn" @click="triggerPageFn" v-if="isSmall">
              <i class="el-icon-back"></i>
              <span>&nbsp;列表</span>
            </span>
            指令：{{ getCurrent?.name }}
          </div>
          <div class="form-wrapper">
            <div v-if="true">
              <div class="config-item cmd-access" :inert="false">
                <div class="config-label">权限等级</div>
                <el-radio v-model="config.access" :label="0">成员</el-radio>
                <el-radio v-model="config.access" :label="1">管理员</el-radio>
                <el-radio v-model="config.access" :label="2">最高管理员</el-radio>
              </div>
              <div class="config-item cmd-scope" :inert="false">
                <div class="config-label">使用场景</div>
                <el-radio v-model="config.scope" label="all">所有场景</el-radio>
                <el-radio v-model="config.scope" :label="0">仅私聊</el-radio>
                <el-radio v-model="config.scope" :label="1">仅群聊</el-radio>
                <el-radio v-model="config.scope" :label="2">仅频道</el-radio>
              </div>
              <div class="config-item cmd-hide">
                <div class="config-label">是否隐藏</div>
                <el-switch v-model="config.hide" active-color="#00aeed"></el-switch>
              </div>
              <!-- 快捷方式 -->
              <div class="config-item cmd-shortcut">
                <div class="config-label">快捷方式</div>
                <div class="shortcut-wrapper">
                  <div class="tags-wrapper" :key="tag" v-for="tag in config.shortcut">
                    <el-tag closable :disable-transitions="false" @close="deleteShortcutTagFn(tag)">
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
                <div class="shortcut-form">
                  <pps-form @submit="saveShortcutInputFn" v-if="shortcutInputVisible">
                    <pps-input
                      class="input-new-tag"
                      :content.sync="tagInput.shortcut"
                      ref="shortcutInput"
                      @keyup.enter.native="saveShortcutInputFn"
                      @blur="saveShortcutInputFn"
                    ></pps-input>
                    <input type="submit" style="width: 0px; height: 0px" />
                  </pps-form>
                  <pps-button
                    style="boder-radius: 4px"
                    v-else
                    class="button-new-tag"
                    @click="showShortcutInputFn"
                  >
                    + 新增选项
                  </pps-button>
                </div>
              </div>
              <div class="config-item cmd-shortcut">
                <div class="config-label">别称</div>
                <div class="shortcut-wrapper">
                  <div class="tags-wrapper" :key="tag" v-for="tag in config.alias">
                    <el-tag closable :disable-transitions="false" @close="deleteAliasTagFn(tag)">
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
                <div class="shortcut-form">
                  <pps-form @submit="saveAliasInputFn" v-if="aliasInputVisible">
                    <pps-input
                      class="input-new-tag"
                      :content.sync="tagInput.alias"
                      ref="aliasInput"
                    ></pps-input>
                    <input type="submit" style="width: 0px; height: 0px" />
                  </pps-form>
                  <pps-button
                    style="boder-radius: 4px"
                    v-else
                    class="button-new-tag"
                    @click="showAliasInputFn"
                  >
                    + 新增选项
                  </pps-button>
                </div>
              </div>
              <!-- 提交修改 -->
              <pps-form @submit="submitConfigFn" @reset="updateCurrentFn" class="cmd-config-submit">
                <pps-button theme="confirm">提交</pps-button>
                <pps-button type="reset">重置</pps-button>
              </pps-form>
            </div>
            <el-empty v-else description="暂无指令" style=""></el-empty>
          </div>
        </div>
      </div>
    </main>
  </k-container>
</template>

<script>
import kContainer from '@/components/layout/container';
import kAside from '@/components/layout/aside';
import kMenuItem from '@/components/menus/menu-item.vue';
import kMenu from '@/components/menus/';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { commandScopeMap, commandAccessMap } from '@/utils/zh-CN';
export default {
  name: 'kCommand',
  components: { kContainer, kAside, kMenu, kMenuItem },
  data() {
    return {
      isShowSelect: false,
      isShowAside: true,
      isShowMain: true,
      isSmall: false,
      isLoading: false,
      shortcutInputVisible: false,
      aliasInputVisible: false,
      menus: [],
      currentCommand: {},
      searchOption: {
        searchWord: '',
        category: '指令名称'
      },
      config: {},
      tagInput: {
        shortcut: '',
        alias: ''
      }
    };
  },
  methods: {
    ...mapMutations('command', { updateCurrent: 'UPDATE_CURRENT' }),
    ...mapActions('command', ['updateCommands']),
    selectCmdFn(menuItem) {
      // console.log(menuItem);
      this.updateCurrent(menuItem.name);
      this.updateCurrentFn();
    },
    searchFn() {
      const word = this.searchOption.searchWord;
      const category = this.searchOption.category;
      if (!word) return this.resetMenus();
      if (category === '指令名称') {
        this.menus = this.getCmdByName(word);
      } else if (category === '快捷方式') {
        this.menus = this.getCmdByShortcut(word);
      } else if (category === '指令别称') {
        this.menus = this.getCmdByAlias(word);
      } else if (category === '使用场景') {
        this.menus = this.getCmdByScope(commandScopeMap[word]);
      } else if (category === '权限等级') {
        this.menus = this.getCmdByAccess(commandAccessMap[word]);
      }
    },
    resetMenusFn() {
      this.menus = this.getCmds;
      this.updateCurrent();
    },
    selectCategroyFn(category) {
      this.isShowSelect = false;
      this.searchOption.category = category;
    },
    deleteShortcutTagFn(tag) {
      this.config.shortcut = this.config.shortcut.filter((item) => item !== tag);
    },
    showShortcutInputFn() {
      this.shortcutInputVisible = true;
      this.$nextTick(() => {
        this.$refs.shortcutInput.$refs.input.focus();
      });
    },
    saveShortcutInputFn() {
      console.log('emit');
      const inputValue = this.tagInput.shortcut;
      if (inputValue) {
        this.config.shortcut.push(inputValue);
      }
      this.shortcutInputVisible = false;
      this.tagInput.shortcut = '';
    },
    deleteAliasTagFn(tag) {
      this.config.alias = this.config.alias.filter((item) => item !== tag);
    },
    showAliasInputFn() {
      this.aliasInputVisible = true;
      this.$nextTick(() => {
        this.$refs.aliasInput.$refs.input.focus();
      });
    },
    saveAliasInputFn() {
      const inputValue = this.tagInput.alias;
      if (inputValue) {
        this.config.alias.push(inputValue);
      }
      this.aliasInputVisible = false;
      this.tagInput.alias = '';
    },
    submitConfigFn() {
      this.isLoading = true;
      this.updateCommands({ name: this.getCurrent.name, config: this.config }).then((res) => {
        this.isLoading = false;
      });
    },
    resetConfigFn() {
      this.config = this.getCurrent.data;
    },
    screenResize(x, y) {
      const width = Math.floor(x);
      if (width > 600) {
        this.isShowAside = true;
        this.isShowMain = true;
        this.isSmall = false;
        return;
      }
      if (!this.isSmall) {
        this.isShowAside = false;
        this.isShowMain = true;
      }
      this.isSmall = true;
    },
    triggerPageFn() {
      this.isShowAside = !this.isShowAside;
      this.isShowMain = !this.isShowMain;
    },
    updateCurrentFn() {
      if (!this.getCurrent) return;
      const d = {
        access: this.getCurrent.data.access,
        scope: this.getCurrent.data.scope,
        hide: this.getCurrent.data.hide,
        shortcut: this.getCurrent.data.shortcut,
        alias: this.getCurrent.data.alias
      };
      this.config = d;
    }
  },
  computed: {
    ...mapGetters('command', [
      'getCmds',
      'getCmdByName',
      'getCmdByShortcut',
      'getCurrent',
      'getCmdByAlias',
      'getCmdByScope',
      'getCmdByAccess'
    ])
  },
  watch: {
    getCurrent(val) {
      if (!val.name) return;
      const d = {
        access: val.data.access,
        scope: val.data.scope,
        hide: val.data.hide,
        shortcut: val.data.shortcut,
        alias: val.data.alias
      };
      this.config = d;
    }
  },
  created() {},
  mounted() {
    this.menus = this.getCmds;
    this.updateCurrentFn();
  }
};
</script>

<style lang="scss" scoped>
.k-container {
  height: var(--el-card-height);
  margin-top: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 13px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;

  .k-aside {
    padding: 0 10px 0;
    width: 300px;
    border-right: 1px solid #0505050f;

    .cmd-search {
      position: sticky;
      top: 0;
      margin-bottom: 10px;
      padding: 20px 0;
      border-bottom: 1px solid #0505050f;
      background: #fff;
      z-index: 1;

      .cmd-search-input {
        display: flex;
        .cmd-search-icon {
          width: 36px;
        }
      }
    }
    .k-menu-item {
      justify-content: flex-start;
      padding-left: 20px;
      box-sizing: border-box;
      font-size: 14px;
      margin-block-end: -6px;
    }
    @media screen and (max-width: 700px) {
      width: 100%;
    }
  }

  main {
    height: 100%;
    width: 100%;
  }

  .cmd-config-wrapper {
    padding-left: 20px;
    height: 100%;
    .cmd-config {
      height: 100%;
      display: flex;
      flex-direction: column;
      .cmd-title {
        display: flex;
        padding: 20px 0;
        color: #636c76;
        font-size: 20px;
        height: 36px;
        line-height: 36px;
        border-bottom: 1px solid #0505050f;

        .icon-btn {
          font-size: 14px;
          padding: 0 10px;
          border-radius: 5px;
          margin-right: 20px;
        }
      }
      .form-wrapper {
        height: 100%;
        overflow: auto;
        padding: 10px 0;
      }
      .el-radio {
        min-width: 100px;
        padding: 10px 0;
      }
      .config-item {
        margin-bottom: 20px;
        .config-label {
          font-size: 15px;
          margin-bottom: 10px;
        }
      }
      .cmd-shortcut {
        .shortcut-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .shortcut-form {
          margin-top: 10px;
        }
        .tags-wrapper {
          width: fit-content;
        }
      }
    }
  }
}

.icon-btn {
  height: 36px;
  line-height: 36px;
  border-radius: 8px;
  text-align: center;
  color: #636c76;
  margin-right: 5px;
  &:hover {
    background: #f1f1f1aa;
  }
  &:active {
    background: #efefef;
  }
}
.cmd-search-select {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  padding: 0 5px;
  width: auto;
  cursor: pointer;

  .select-label {
    width: 3.8rem;
    // padding: 0 10px;
    background: transparent;
    height: 100%;
    outline: none;
    border: none;
    box-sizing: border-box;
    cursor: pointer;
  }

  .icon {
    margin-left: -5px;
  }
}
.select-dropdown {
  position: absolute;
  left: 0;
  top: calc(100% + 5px);
  padding: 10px 0;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .select-item {
    width: fit-content;
    padding: 5px 15px;
    cursor: pointer;

    &:hover {
      background: #f0f0f0;
    }
  }
}
.fill-empty {
  height: 0;
  flex-grow: 1;
}
.pps-button {
  border-radius: 4px;
}
</style>
