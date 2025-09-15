<template>
  <k-container direction="horizontal" class="left-aside">
    <!-- 切换用户导航栏 -->
    <k-sb-aside class="aside-users">
      <header class="k-chat-header">
        <el-tooltip effect="dark" content="添加用户" placement="bottom">
          <div class="add-user-avatar" @click="show.createUser = true">
            <img class="add-user" :src="ADD_USER_IMG" alt="添加用户" />
          </div>
        </el-tooltip>
      </header>
      <template #inner>
        <k-menu
          v-if="getAllUser.length"
          :default-active="getCurrentUser?.id"
          active-color="#752bec"
          :active-shape="['circle']"
          text-color="#061e26"
          background-color="#f2f2f2"
          mode="column"
        >
          <k-menu-item
            v-for="(user, index) in getAllUser"
            :key="index"
            :index="user.id"
            width="60"
            height="60"
            @click="switchUserFn(user.id)"
          >
            <pps-context-menu
              :menus="user.isSuper ? [] : [{ label: '发起群聊', uid: `${user.id}`, task: 1 }]"
              @select="contextMenuFn"
            >
              <template slot="prepend">
                <el-tooltip class="item" effect="dark" content="账户信息" placement="top">
                  <pps-icon icon="pps-icon-account" @click="showUserDetailFn(user)"></pps-icon>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="好友" placement="top">
                  <pps-icon icon="pps-icon-contact" @click="showFriendListFn(user)"></pps-icon>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="群聊" placement="top">
                  <pps-icon icon="pps-icon-group" @click="showGroupListFn(user)"></pps-icon>
                </el-tooltip>
              </template>
              <div v-if="!user.isSuper" class="delete-user" slot="append">
                <div @click="contextMenuFn({ uid: `${user.id}`, task: 2 })">
                  {{ `移除 ${user.name}` }}
                </div>
              </div>
              <template v-slot:item="{ menu }">
                <div
                  class="menu-item"
                  v-for="(item, index) in menu"
                  :key="index"
                  @click="contextMenuFn(item)"
                >
                  {{ item.label }}
                </div>
              </template>
              <div class="user-avatar" slot="content">
                <el-tooltip class="item" effect="dark" :content="user.name" placement="right">
                  <pps-avatar :src="user.avatar" size="40"></pps-avatar>
                </el-tooltip>
              </div>
            </pps-context-menu>
          </k-menu-item>
        </k-menu>
      </template>
      <div class="fill-empty"></div>
      <el-tooltip v-if="0" effect="dark" content="移除用户" placement="right">
        <div class="remove-user-button" @click="removeUserFn">
          <img :src="REMOVE_USER" alt="移除用户" />
        </div>
      </el-tooltip>
    </k-sb-aside>

    <!-- 好友群聊 列表 -->
    <transition>
      <k-sb-aside class="aside-list" v-show="show.isCollapseMsg">
        <header class="k-chat-header" v-show="show.isCollapseMsg">
          <k-tab
            :tabs="['私聊', '群聊']"
            @changeTab="toggleMsgTabFn"
            :class="{ isTransparent: !show.isCollapseMsg }"
          ></k-tab>
          <el-tooltip effect="dark" content="加好友/群" placement="bottom">
            <gray-button class="icon-btn" @click.native="show.addFriend = true">
              <svg
                t="1723230695956"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="34315"
                width="16"
                height="16"
                data-spm-anchor-id="a313x.search_index.0.i6.27883a81IeQ0Uy"
              >
                <path
                  d="M914.618182 477.090909H546.909091V109.381818c0-18.618182-16.290909-34.909091-34.909091-34.909091s-34.909091 16.290909-34.909091 34.909091v367.709091H109.381818c-18.618182 0-34.909091 16.290909-34.909091 34.909091s16.290909 34.909091 34.909091 34.909091h367.709091v367.709091c0 18.618182 16.290909 34.909091 34.909091 34.909091s34.909091-16.290909 34.909091-34.909091V546.909091h367.709091c18.618182 0 34.909091-16.290909 34.909091-34.909091s-16.290909-34.909091-34.909091-34.909091z"
                  fill="#7a7a7a"
                  p-id="34316"
                ></path>
              </svg>
            </gray-button>
          </el-tooltip>
          <!-- 收起消息列表 -->
          <el-tooltip effect="dark" content="收起消息列表" placement="right">
            <gray-button class="icon-btn" @click.native="collapseMsghandler(false)">
              <pps-icon icon="pps-icon-side-show"></pps-icon>
            </gray-button>
          </el-tooltip>
        </header>
        <template #inner>
          <k-menu
            class="list"
            ref="msgMenuRef"
            :default-active="null"
            :key="messageList[0]?.id"
            @select="selectMsgFn"
            active-color="#fff"
            :active-shape="['background']"
            text-color="#061e26"
            background-color="#a07fff"
            mode="column"
          >
            <k-menu-item
              v-for="item in showMessageList"
              :key="item.id"
              :index="item.id"
              height="60"
            >
              <div class="list-item">
                <pps-avatar :src="item.avatar" size="40" :title="item.name"></pps-avatar>
                <div class="name" :title="item.name">
                  <span class="name-text">{{ item.name }}</span>
                  <p class="name__message">{{ item.message }}</p>
                </div>
                <span class="closeBtn">
                  {{ item.date }}
                </span>
              </div>
            </k-menu-item>
          </k-menu>
        </template>
      </k-sb-aside>
    </transition>

    <!-- 遮罩层 -->
    <div
      class="mask"
      v-show="show.isCollapseMsg"
      v-if="getIsNarrowScreen"
      @click="collapseMsghandler(false)"
    ></div>

    <!-- 创建用户 对话框 -->
    <pps-dialog
      :show.sync="show.createUser"
      @canceled="cancelCreateUserFn"
      @confirmed="createUserFn"
      class="create-user-dialog"
      title="创建用户"
    >
      <template v-slot:content>
        <pps-form>
          <!-- <div class="user-input-label">名称</div> -->
          <pps-input label="昵称" :content.sync="createUser.name" placeholder="请输入昵称" />
          <!-- <div class="user-input-label">账号</div> -->
          <pps-input label="账号" :content.sync="createUser.id" placeholder="请输入账号" />
          <!-- <div class="user-input-label">年龄</div> -->
          <pps-input
            label="年龄"
            :content.sync="createUser.age"
            type="number"
            placeholder="请输入年龄"
          />
          <div class="user-sex-wrapper">
            <label class="sex-text-label" for="t">性别:</label>
            <el-radio v-model="createUser.sex" label="男">男</el-radio>
            <el-radio v-model="createUser.sex" label="女">女</el-radio>
          </div>
          <!-- <div class="user-input-label">头像</div> -->
          <pps-input label="头像" :content.sync="createUser.avatar" placeholder="请输入https地址" />
        </pps-form>
        <hr />
        <div class="quick-wrapper">
          <span class="quick__text">快速创建10个用户</span>
          <pps-button class="quick__btn" theme="confirm" @click="bulkCreateUsers()">
            <i class="el-icon-plus"></i>
            快速创建
          </pps-button>
        </div>
      </template>
    </pps-dialog>

    <!-- 移除用户 对话框 -->
    <pps-dialog
      :show.sync="show.removeUser"
      @confirmed="removeUserFn(removeUser)"
      title="移除用户"
      :content="`确定要移除${removeUser}用户吗？`"
    ></pps-dialog>

    <!-- 添加对象 对话框 -->
    <pps-dialog
      class="add-friend-dialog"
      :after-show="emitTabUpdate"
      :show.sync="show.addFriend"
      :callback="closeAddObjDialogFn"
      title="全站搜索"
    >
      <template v-slot:content>
        <pps-input
          @change="searchFn()"
          clearable
          :content.sync="searchDialog.input"
          :placeholder="`请输入${searchDialog.tabs[searchDialog.index]} ID`"
        >
          <span slot="prepend" style="padding: 0 8px">
            {{ searchDialog.tabPrefix[searchDialog.index] }}-
          </span>
        </pps-input>
        <k-tab ref="k-tab" :tabs="searchDialog.tabs" @changeTab="switchSearchTabFn">
          <template v-slot:thumb>
            <div class="thumb"></div>
          </template>
        </k-tab>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column align="center" label="搜索结果">
            <template slot-scope="scope">
              <img class="avatar" :src="scope.row.avatar" alt="" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="昵称"></el-table-column>
          <el-table-column align="center" prop="id" label="id"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="{ row }">
              <pps-button @click="addFriendFn(row.id)" :disabled="row.isAdded">
                {{ row.isAdded ? '已添加' : '添加' }}
              </pps-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </pps-dialog>

    <!-- 创建群聊 对话框 -->
    <pps-dialog
      class="create-group-dialog"
      :show.sync="show.createGroup"
      @confirmed="createGroupFn"
      title="发起群聊"
    >
      <template v-slot:content>
        <div class="create-group-content">
          <div class="left" style="text-align: center">
            <h4>好友列表</h4>
            <el-table
              @selection-change="handleSelectionChange"
              :show-header="true"
              :data="getFriendListExceptSuper"
            >
              <el-table-column type="selection" align="center" label="选择"></el-table-column>
              <el-table-column align="center" label="头像">
                <template slot-scope="{ row }">
                  <pps-avatar :src="row.avatar" size="30" :title="row.name"></pps-avatar>
                </template>
              </el-table-column>
              <el-table-column prop="name" align="center" label="名称"></el-table-column>
            </el-table>
          </div>
          <div class="right">
            <pps-input label="群聊ID" :content.sync="createGroup.id" placeholder="请输入ID" />
            <pps-input label="群聊名称" :content.sync="createGroup.name" placeholder="请输入名称" />
            <pps-input
              label="群聊头像"
              :content.sync="createGroup.avatar"
              placeholder="请输入链接"
            />
          </div>
        </div>
      </template>
    </pps-dialog>

    <!-- 好友列表 -->
    <pps-dialog :show.sync="show.friendList" title="好友列表" :callback="closeUserInfoFn">
      <template v-slot:content>
        <el-table :show-header="true" :data="selectFreindLIst">
          <el-table-column align="center" label="头像">
            <template slot-scope="scope">
              <pps-avatar :src="scope.row.avatar" size="40"></pps-avatar>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="id" label="id"></el-table-column>
          <el-table-column align="center" prop="name" label="昵称"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="{ row }">
              <pps-button
                :disabled="row.id === 'user-super-admin'"
                theme="danger"
                @click="removeFriendFn(row.id)"
              >
                删除
              </pps-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </pps-dialog>

    <!-- 群聊列表 -->
    <pps-dialog :show.sync="show.groupList" title="群聊列表" :callback="closeUserInfoFn">
      <template v-slot:content>
        <el-table :data="selcetGroupList">
          <el-table-column align="center" label="群聊头像">
            <template slot-scope="scope">
              <pps-avatar :src="scope.row.avatar" size="40"></pps-avatar>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="id" label="群聊id"></el-table-column>
          <el-table-column align="center" prop="name" label="群聊名称"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="{ row }">
              <pps-button
                :disabled="row.lord !== userDetailDate.id"
                v-if="row.lord === userDetailDate.id"
                theme="danger"
                @click="removeGroupFn(row)"
              >
                解散
              </pps-button>
              <pps-button v-else theme="primary" @click="leaveGroupFn(row)">退出</pps-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </pps-dialog>

    <!-- 用户信息 -->
    <pps-dialog :show.sync="show.userInfo" title="用户信息" :callback="closeUserInfoFn">
      <template v-slot:content>
        <div class="user-info-wrapper">
          <img class="user-avatar" :src="userDetailDate.avatar" alt="" />
          <el-descriptions class="margin-top" :column="2" border>
            <el-descriptions-item>
              <template slot="label">昵称</template>
              {{ userDetailDate.name }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">ID</template>
              {{ userDetailDate.id }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">年龄</template>
              {{ userDetailDate.age }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">性别</template>
              {{ userDetailDate.sex }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </template>
    </pps-dialog>
  </k-container>
</template>

<script>
import { mapGetters } from 'vuex';
// import debounce from 'debounce';
import kContainer from '@/components/layout/container';
import kMenuItem from '@/components/menus/menu-item.vue';
import kMenu from '@/components/menus/index.vue';
import kSbAside from '@/components/layout/aside';
import kTab from './tab/tab.vue';
import User from '@/utils/sandBox/user';
import Administrators from '@/utils/sandBox/administrators';
import ADD_USER_IMG from '@/assets/addAvatar.svg';
import REMOVE_USER from '@/assets/removeAvatar.svg';
import grayButton from '../ui/grayButton.vue';
import { formatTimestamp } from '@/utils/formatTimeStamp';
export default {
  name: 'sb-left-aside',
  components: { kSbAside, kContainer, kMenu, kMenuItem, kTab, grayButton },
  data() {
    return {
      users: [],
      admin: new Administrators(),
      ADD_USER_IMG,
      REMOVE_USER,
      messageMode: 0,
      messageList: [],
      show: {
        createUser: false,
        createGroup: false,
        removeUser: false,
        addFriend: false,
        friendList: false,
        groupList: false,
        userInfo: false,
        isCollapseMsg: true
      },
      createUser: {
        name: null,
        avatar: null,
        id: null,
        age: null,
        sex: '男'
      },
      createGroup: {
        id: null,
        name: null,
        avatar: null,
        members: [],
        checkList: []
      },
      removeUser: null,
      searchDialog: {
        tabs: ['用户', '群聊', '机器人'],
        tabPrefix: ['user', 'group', 'user'],
        index: 0,
        input: ''
      },
      tableData: [],
      userDetailDate: {}
    };
  },
  props: {
    updateChatTarget: {
      type: Function,
      default() {
        return null;
      }
    },
    updateCollapseMsg: {
      type: Function,
      default() {
        return null;
      }
    }
  },
  methods: {
    collapseMsghandler(state) {
      this.show.isCollapseMsg = state;
      this.updateCollapseMsg(state);
    },
    switchUserFn(id) {
      if (this.getCurrentUser.id === id) return;
      this.$store.commit('sandBox/SWITCH_USER', id);
      this.$refs.msgMenuRef.activeIndex = null;
      this.$store.commit('sandBox/SWITCH_CHAT');
      this.updateChatTarget(null, false, null);
      this.collapseMsghandler(true);
    },
    removeUserFn(id) {
      this.admin.removeUserById(id);
      this.$store.commit('sandBox/SWITCH_USER');
    },
    createUserFn() {
      const adder = this.createUser;
      const hasData = adder.id && adder.name && adder.age && adder.sex;
      if (!hasData) {
        this.$dialog({ title: '警告', content: '请填写完整信息' })
          .then((action) => {
            this.show.createUser = true;
          })
          .catch((error) => {
            console.log(error);
          });
        return;
      }
      // eslint-disable-next-line no-unused-vars
      const newUser = new User({
        numId: adder.id,
        name: adder.name,
        age: adder.age,
        sex: adder.sex,
        avatar: adder.avatar
      });
      const res = newUser.mount();
      if (!res) {
        this.$dialog({ title: '警告', content: '用户已存在' })
          .then((action) => {})
          .catch((error) => {
            console.log(error);
          });
      }
      this.cancelCreateUserFn();
    },
    createGroupFn() {
      const res = this.admin.createGroup({
        id: this.createGroup.id,
        name: this.createGroup.name,
        lord: this.userDetailDate.id,
        avatar: this.createGroup.avatar,
        members: this.createGroup.checkList
      });
      if (!res) {
        this.$dialog({ title: '警告', content: '群聊创建失败！信息不完整或已存在' })
          .then((action) => {
            this.show.createGroup = true;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    handleSelectionChange(val) {
      this.createGroup.checkList = val;
    },
    cancelCreateUserFn() {
      this.createUser = {
        name: null,
        avatar: null,
        id: null,
        age: null,
        sex: null
      };
    },
    contextMenuFn(menu) {
      this.removeUser = menu.uid;
      if (menu.task === 2) {
        this.show.removeUser = true;
      } else if (menu.task === 1) {
        this.userDetailDate = this.admin.getUserById(menu.uid);
        this.show.createGroup = true;
      }
    },
    toggleMsgTabFn(tab) {
      this.messageMode = tab;
    },
    switchSearchTabFn(tab) {
      this.searchDialog.index = tab;
      this.searchFn();
    },
    searchFn() {
      this.tableData = [];
      const id = this.searchDialog.input;
      if (!id) return;
      const self = new User(this.getCurrentUser);
      const admin = new Administrators();
      switch (this.searchDialog.index) {
        case 0: {
          const userListWithSuper = admin.getAllUser();
          userListWithSuper.forEach((user) => {
            if (user.isSuper) return;
            if (user.numId.includes(id)) {
              const isAdded = self.friends.some((friend) => friend.id === user.id);
              this.tableData.push({ ...user, isAdded });
            }
          });
          break;
        }
        case 1: {
          const groupList = admin.getAllGroup();
          groupList.forEach((group) => {
            if (group.id.includes(id)) {
              const isAdded = self.groups.some((g) => g.id === group.id);
              this.tableData.push({ ...group, isAdded });
            }
          });
          break;
        }
        case 2: {
          const userList = admin.getAllUser();
          userList.forEach((user) => {
            if (!user.isSuper) return;
            if (user.numId.includes(id)) {
              const isAdded = self.friends.some((f) => f.id === user.id);
              this.tableData.push({ ...user, isAdded });
            }
          });
          break;
        }
      }
    },
    closeAddObjDialogFn() {
      this.tableData = [];
      this.searchDialog.input = '';
    },
    addFriendFn(id) {
      const user = new User(this.getCurrentUser);
      switch (this.searchDialog.index) {
        case 0: {
          const targetUser = this.admin.getUserById(id);
          this.$emit('handleMenuAction', {
            targetUser,
            actionType: 'ADD_FRIEND'
          });
          break;
        }
        case 1:
          user.addGroupById(id);
          break;
        case 2:
          // this.tableData = admin.getAllRobots();
          break;
      }
    },
    removeFriendFn(fid) {
      const targetUser = this.admin.getUserById(fid);
      this.$emit('handleMenuAction', {
        targetUser,
        actionType: 'REMOVE_FRIEND',
        currentUser: this.userDetailDate
      });
    },
    emitTabUpdate() {
      this.$refs['k-tab'].changeTabFn();
    },
    deleteFriendMsgFn(friend) {
      const curUser = new User(this.getCurrentUser);
      const res = curUser.deleteFriendMessage(friend.id);
      console.log('删除消息', res);
    },
    removeGroupFn(group) {
      const targetUser = new User(this.userDetailDate);
      this.$emit('handleMenuAction', {
        targetUser,
        groupId: group.id,
        actionType: 'REMOVE_GROUP'
      });
    },
    leaveGroupFn(group) {
      const targetUser = new User(this.userDetailDate);
      this.$emit('handleMenuAction', {
        targetUser,
        groupId: group.id,
        actionType: 'LEAVE_GROUP'
      });
    },
    selectMsgFn({ index }) {
      const user = new User(this.getCurrentUser);
      let chat;
      if (this.messageMode) {
        chat = user.getGroupMessageById(index);
        this.$store.commit('sandBox/SWITCH_CHAT', chat);
        this.updateChatTarget(index, true, chat.name);
      } else {
        chat = user.getFriendMessageById(index);
        this.$store.commit('sandBox/SWITCH_CHAT', chat);
        const friend = this.admin.getUserById(index);
        this.updateChatTarget(index, false, friend.name);
      }
      this.$emit('switchMsg', chat);
      this.collapseMsghandler(!this.getIsNarrowScreen);
    },
    selectNewMsgFn(msg) {
      console.log(msg);
      return 'test';
    },
    showUserDetailFn(userInfo) {
      Object.assign(this.userDetailDate, userInfo);
      this.show.userInfo = true;
    },
    closeUserInfoFn() {
      this.userDetailDate = {};
    },
    showFriendListFn(user) {
      this.userDetailDate = user;
      this.show.friendList = true;
    },
    showGroupListFn(user) {
      this.userDetailDate = user;
      this.show.groupList = true;
    },
    bulkCreateUsers() {
      const userList = [
        { numId: '1', name: 'u1', age: 18, sex: '男' },
        { numId: '2', name: 'u2', age: 18, sex: '男' },
        { numId: '3', name: 'u3', age: 18, sex: '男' },
        { numId: '4', name: 'u4', age: 20, sex: '女' },
        { numId: '5', name: 'u5', age: 18, sex: '女' },
        { numId: '6', name: 'u6', age: 18, sex: '女' },
        { numId: '7', name: 'u7', age: 18, sex: '女' },
        { numId: '8', name: 'u8', age: 18, sex: '女' }
      ];

      userList.forEach((user) => {
        const u = new User(user).mount();
        console.log(u);
      });
    }
  },
  computed: {
    ...mapGetters('sandBox', ['getCurrentUser', 'getAllUser', 'getCurrentMsg']),
    ...mapGetters('layoutOption', ['getIsNarrowScreen']),
    showMessageList() {
      const user = new User(this.getCurrentUser);
      let chatList = [];
      if (this.messageMode) {
        chatList = user.groups.map(({ id }) => {
          let message, date;
          const group = user.getGroupById(id);
          const lastMessage = user.getGroupMessageById(id).messages.at(-1);
          if (lastMessage === undefined) {
            message = '\u00A0';
            date = '';
          } else {
            const sender = this.admin.getUserById(lastMessage.role);
            message = `${sender.name}: ${lastMessage.content}`;
            date = formatTimestamp(lastMessage.date);
          }
          return { ...group, message, date };
        });
      } else {
        // 获取好友列表和最新信息
        chatList = user.friends.map((friend) => {
          let message, date;
          const lastMessage = user.getFriendMessageById(friend.id).at(-1);
          if (lastMessage === undefined) {
            message = '\u00A0';
            date = '';
          } else {
            message = lastMessage.content;
            date = formatTimestamp(lastMessage.date);
          }
          return { ...friend, message, date };
        });
      }
      return chatList;
    },
    getFriendListExceptSuper() {
      const targetUser = this.admin.getUserById(this.userDetailDate.id);
      const list = targetUser.friends.filter((friend) => friend.id !== 'user-super-admin');
      return list;
    },
    selectFreindLIst() {
      const user = new User(this.userDetailDate);
      const friend_list = user.friends;
      return friend_list;
    },
    selcetGroupList() {
      const user = new User(this.userDetailDate);
      const group_list = user.getAllGroups();
      return group_list;
    }
  },
  watch: {
    getIsNarrowScreen(val) {
      if (val) {
        this.show.isCollapseMsg = false;
      } else {
        this.show.isCollapseMsg = true;
      }
    }
  },
  created() {},
  mounted() {
    this.collapseMsghandler(true);
  }
};
</script>

<style lang="scss" scoped>
.left-aside {
  height: var(--k-main);
  position: relative;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100dvw;
    height: 100%;
    background: #000;
    opacity: 0.5;
    z-index: 3;
  }

  .aside-users {
    width: 60px;
    background-color: #f2f2f2;
    border-bottom: 2px solid #e9e9e9;
    border-right: 2px solid #e9e9e9;
    z-index: 5;

    .k-chat-header {
      position: sticky;
      top: 0;
      min-height: 60px;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      // background-color: #e9e9e9;
      border-bottom: 2px solid #e9e9e9;

      & ::v-deep .add-user-avatar {
        width: 45px;
        height: 45px;

        &:hover {
          transform: scale(1.1);
          transition: all 0.3s ease;
        }

        img {
          width: 100%;
          height: 100%;
          vertical-align: bottom;
          border-radius: 50%;
          cursor: pointer;
          &:hover {
            background-color: #fff;
          }
        }
      }
    }
    .user-avatar {
      width: 40px;
      height: 40px;
      transition: transform 0.15s ease;

      &:hover {
        transform: scale(1.1);
      }
      &:active {
        transform: scale(0.9);
      }
      .user-avatar-img {
        width: 100%;
        height: 100%;
        vertical-align: bottom;
        border-radius: 50%;
      }
    }
    & ::v-deep .pps-context-menu_wrapper {
      width: 150px;
      .pps-context-menu_prepend {
        div {
          height: 100%;
          padding: 4px;
          &:hover {
            background: #f5f5f5;
          }
        }
      }
      .delete-user {
        width: 100%;
        padding: 5px;
        border-radius: inherit;
        color: red;
        &:hover {
          background: #f5f5f5;
        }
      }
      .menu-item {
        padding: 5px;
        cursor: pointer;
        border-radius: inherit;
        &:hover {
          background: #f5f5f5;
        }
      }
    }
    .remove-user-button {
      position: sticky;
      bottom: 0;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      border-top: 2px solid #e9e9e9;
      box-sizing: border-box;
      cursor: pointer;

      img {
        width: 45px;
        border-radius: 50%;
        &:hover {
          background-color: #fff;
        }
      }
    }
    & ::v-deep .k-aside-inner {
      &::-webkit-scrollbar {
        width: 0px;
      }
    }
    .fill-empty {
      height: 0;
      flex-grow: 1;
    }
  }
  .aside-list {
    flex-grow: 1;
    max-width: 241px;
    background-color: #fff;
    border-bottom: 2px solid #e9e9e9;
    border-right: 2px solid #e9e9e9;

    @media screen and (max-width: 528px) {
      position: fixed;
      left: 60px;
      // min-width: calc(100dvw - 60px); // 无法触发过渡效果
      z-index: 4;
    }

    .k-chat-header {
      display: flex;
      align-items: center;
      border-bottom: 2px solid #e9e9e9;

      .icon-btn {
        margin-left: 10px;
      }
      .k-tab-wrapper {
        margin-left: 15px;
      }
      &:last-child {
        margin-right: 10px;
      }
    }

    .list {
      .k-menu-item {
        border-radius: initial;
        margin-block-start: 0;
        .list-item {
          display: inline-flex;
          align-items: center;
          width: 100%;
          padding: 0 10px;
          .name {
            margin-inline-start: 10px;
            flex: 1;
            min-width: 0;
            .name__message {
              font-size: 12px;
              color: var(--sb-reply-color);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .closeBtn {
            margin-left: auto;
            font-size: 12px;
            color: var(--sb-reply-color);
          }
        }
      }
      .k-menu-item.active {
        .name__message {
          color: #fff !important;
        }
        .closeBtn {
          color: #fff !important;
        }
      }
    }
  }
  .create-user-dialog {
    .pps-form {
      box-sizing: border-box;
      .user-sex-wrapper {
        display: flex;
        align-items: center;
        height: 38px;
        line-height: 38px;
        margin: 20px 0;

        .sex-text-label {
          width: 4rem;
          text-align: right;
          margin-right: 15px;
        }
      }
    }
    .quick-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 10px;
      background: #f5f7fa;
      border-radius: 8px;
      .quick__btn {
        border-radius: 6px;
        padding: 6px 12px;

        i{ margin-right: 2px;}
      }
    }
  }
  .add-friend-dialog {
    height: 100%;
    width: fit-content;
    @media screen and (max-width: 700px) {
      width: 100%;
    }
    .pps-dialog-window {
      .pps-input {
        width: 100%;
      }
      .k-tab-wrapper {
        margin-top: 20px;
        background: #fff;
        margin-bottom: 20px;
        .thumb {
          position: absolute;
          bottom: 0;
          height: 3px;
          width: 60px;
          background-color: blueviolet;
        }
      }
      .el-table__body {
        width: auto !important;
      }
    }
    .avatar {
      border-radius: 50%;
      width: 35px;
    }
  }
  .create-group-dialog {
    height: 100%;
    .create-group-content {
      display: flex;
      flex-direction: column-reverse;
      gap: 20px;
      width: 100%;
      img {
        width: 30px;
        border-radius: 50%;
      }
    }
    .pps-input-label {
      width: 60px;
      text-align: right;
    }
    @media screen and (max-width: 700px) {
      width: 100%;
    }
  }
  .user-info-wrapper {
    display: flex;
    justify-content: center;
    height: 100px;

    .el-descriptions {
      &::v-deep .el-descriptions__body {
        table {
          height: 100px;
        }
      }
    }

    .user-avatar {
      border: 1px solid #ebeef5;
      box-sizing: border-box;
      height: 100px;
      width: 100px;
    }
  }
}

.empty {
  height: calc(var(--k-main-height) - var(--k-footer-height));
}
.avatar-img {
  border-radius: 50%;
}

// 过渡
.v-enter,
.v-leave-to {
  width: 0;
  // transform: translateX(-241px);
  // left: 0px;
}
.v-enter-active,
.v-leave-active {
  transition: 0.3s ease-in-out;
}
.v-enter-to,
.v-leave {
  width: 241px;
  // transform: translateX(0);
  // left: 60px;
}
.isTransparent {
  z-index: -111;
}
</style>
