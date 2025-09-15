<template>
  <div class="k-chat-main chat-empty">
    <template v-if="getCurrentMsg">
      <!-- 聊天内容 -->
      <div ref="chatBox" class="k-chat-box pps-scrollbar">
        <el-alert v-if="isTalkWithBot" title="温馨提示！" center show-icon close-text="知道了">
          输入
          <strong class="danger-text">/help</strong>
          查看所有bot指令
        </el-alert>
        <k-sb-message
          v-for="item in messageList"
          :message="item"
          :chatTarget="chatTarget"
          :isSelf="isSelfFn(item.role)"
          :key="item.id"
          :memberList="memberList"
          @replyMsg="replyMsgFn"
          @handleMenuAction="handleMenuAction"
        ></k-sb-message>
      </div>
      <!-- 输入框 -->
      <div class="k-chat-input-box">
        <div
          ref="input"
          class="k-chat-input"
          @input="inputFn"
          @click="saveRange"
          @keyup="saveRange"
          @keypress.enter="sendMessageFn"
          @blur="lastRange = null"
          @paste="handlePaste"
          :contenteditable="messagingEnabled"
          :placeholder="messagingPlaceholder"
        ></div>
        <div class="operation">
          <div v-show="replyMsg.name" class="reply-chat-wrapper">
            <span class="content">{{ replyMsg.name }}：{{ replyMsg.content }}</span>
            <i @click="cancelReplyMsgFn" class="el-icon-circle-close"></i>
          </div>
          <pps-button
            :disabled="!messagingEnabled"
            @click="sendMessageFn"
            theme="confirm"
            class="k-chat-send-btn"
          >
            发送
          </pps-button>
        </div>
      </div>
    </template>
    <el-empty v-else description="" style="height: 100%" :image="LOGO"></el-empty>
  </div>
</template>

<script>
import LOGO from '@/assets/favicon-gray.svg';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import User from '@/utils/sandBox/user';
import Administrators from '@/utils/sandBox/administrators';
import kSbMessage from './message.vue';

export default {
  name: 'k-chat-main',
  components: { kSbMessage },
  data() {
    return {
      muteStatusIntervalId: null,
      LOGO,
      message: '',
      lastRange: null,
      replyMsg: { name: null, content: null },
      admin: new Administrators(),
      isComposing: false, // 处理中文输入法
      cursorPosition: null, // 保存光标位置
      inputObserver: null // DOM变化观察器
    };
  },

  computed: {
    ...mapGetters('sandBox', [
      'getCurrentUser',
      'getAllUser',
      'getCurrentMsg',
      'getMemberMuteStatue'
    ]),
    messagingEnabled() {
      if (this.chatTarget.isGroup) {
        const curMember = new User(this.getCurrentUser);
        const isAdmin = curMember._isAdmin(this.chatTarget.id);
        if (isAdmin) return true;
        const isGroupMute = this.getCurrentMsg.isMute;
        const isMute = this.getMemberMuteStatue(this.chatTarget.id, curMember.id);
        if (isMute) this.checkMuteStatus();
        return !(isGroupMute || isMute);
      }
      return true;
    },
    messagingPlaceholder() {
      return this.messagingEnabled ? '请输入消息...' : '禁言中...';
    },
    messageList() {
      const cmsg = this.getCurrentMsg;
      if (!cmsg) return [];
      let messageList;
      if (Array.isArray(cmsg)) {
        messageList = cmsg;
      } else {
        messageList = cmsg.messages;
      }
      return messageList;
    },
    isTalkWithBot() {
      return true;
    }
  },

  methods: {
    ...mapActions('sandBox', ['send', 'updateMemberMuteStatue']),
    ...mapMutations('sandBox', { clearMuteExpire: 'UNMUTE_MEMBER' }),
    // 轮询群成员禁言状态
    checkMuteStatus() {
      const gid = this.getCurrentMsg.id;
      const mid = this.getCurrentUser.id;
      this.muteStatusIntervalId = setInterval(() => {
        const isMute = this.getMemberMuteStatue(gid, mid);
        if (!isMute) {
          this.clearMuteExpire({ gid, mid });
          clearInterval(this.muteStatusIntervalId);
        }
      }, 2000);
    },
    // 输入处理方法
    inputFn(e) {
      if (this.isComposing) return; // 中文输入法输入过程中不处理

      this.saveRange(); // 保存当前光标位置
      this.updateMessage();
    },
    // 更新消息内容
    updateMessage() {
      this.$nextTick(() => {
        const input = this.$refs.input;
        if (input) {
          this.message = this.getTextContent(input);
        }
      });
    },
    // 获取纯文本内容（保留mention标签）
    getTextContent(element) {
      let content = '';
      const childNodes = element.childNodes;

      for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
          content += node.textContent;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'BUTTON' && node.className.includes('pps-button')) {
            // mention标签
            content += node.textContent;
          } else if (node.tagName === 'BR') {
            content += '\n';
          } else {
            content += node.textContent;
          }
        }
      }

      return content;
    },
    // 设置输入框内容（不会影响光标位置）
    setInputContent(content, maintainCursor = true) {
      const input = this.$refs.input;
      if (!input) return;

      let savedRange = null;
      if (maintainCursor) {
        savedRange = this.saveCurrentRange();
      }

      // 直接设置innerHTML
      input.innerHTML = content;

      if (maintainCursor && savedRange) {
        this.$nextTick(() => {
          this.restoreRange(savedRange);
        });
      }
    },
    // 保存当前光标位置
    saveCurrentRange() {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const input = this.$refs.input;

        if (input && input.contains(range.commonAncestorContainer)) {
          return {
            startContainer: range.startContainer,
            startOffset: range.startOffset,
            endContainer: range.endContainer,
            endOffset: range.endOffset
          };
        }
      }
      return null;
    },
    // 恢复光标位置
    restoreRange(savedRange) {
      if (!savedRange) return;

      try {
        const selection = window.getSelection();
        const range = document.createRange();

        range.setStart(savedRange.startContainer, savedRange.startOffset);
        range.setEnd(savedRange.endContainer, savedRange.endOffset);

        selection.removeAllRanges();
        selection.addRange(range);

        this.lastRange = range;
      } catch (error) {
        console.warn('Failed to restore cursor position:', error);
        this.focusAtEnd();
      }
    },
    // 光标移到末尾
    focusAtEnd() {
      const input = this.$refs.input;
      if (!input) return;

      input.focus();
      const range = document.createRange();
      const selection = window.getSelection();

      range.selectNodeContents(input);
      range.collapse(false);

      selection.removeAllRanges();
      selection.addRange(range);

      this.lastRange = range;
    },
    // 改进的saveRange方法
    saveRange() {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const input = this.$refs.input;

        if (input && input.contains(range.commonAncestorContainer)) {
          this.lastRange = range.cloneRange();
        }
      }
    },
    // 处理粘贴事件
    handlePaste(e) {
      e.preventDefault();

      const text = (e.clipboardData || window.clipboardData).getData('text/plain');
      const cleanText = text.replace(/\r?\n/g, ' '); // 将换行替换为空格

      this.insertTextAtCursor(cleanText);
    },
    // 在光标位置插入文本
    insertTextAtCursor(text) {
      const selection = window.getSelection();
      const input = this.$refs.input;

      if (!input) return;

      input.focus();

      let range = null;
      if (this.lastRange && this.isRangeInNode(this.lastRange, input)) {
        range = this.lastRange;
      } else {
        range = document.createRange();
        range.selectNodeContents(input);
        range.collapse(false);
      }

      selection.removeAllRanges();
      selection.addRange(range);

      // 插入文本
      const textNode = document.createTextNode(text);
      range.deleteContents();
      range.insertNode(textNode);

      // 移动光标到插入文本后
      const newRange = document.createRange();
      newRange.setStartAfter(textNode);
      newRange.collapse(true);

      selection.removeAllRanges();
      selection.addRange(newRange);

      this.lastRange = newRange;
      this.updateMessage();
    },
    // 改进的mention功能
    mentionMember(username) {
      const input = this.$refs.input;
      if (!input) return;

      input.focus();

      const selection = window.getSelection();
      selection.removeAllRanges();

      let range = null;

      // 如果 lastRange 有效，就用它，否则插到末尾
      if (this.lastRange && this.isRangeInNode(this.lastRange, input)) {
        range = this.lastRange;
      } else {
        range = document.createRange();
        range.selectNodeContents(input);
        range.collapse(false);
      }

      selection.addRange(range);

      // 创建 mention 节点
      const mentionNode = document.createElement('button');
      mentionNode.textContent = `@${username}`;
      mentionNode.contentEditable = 'false';
      mentionNode.className = 'pps-button-text pps-button';
      mentionNode.style.cssText = 'margin: 0 2px; pointer-events: none;';

      range.deleteContents();
      range.insertNode(mentionNode);

      // 插入空格
      const space = document.createTextNode('\u00A0');
      mentionNode.parentNode.insertBefore(space, mentionNode.nextSibling);

      // 将光标移动到空格后
      const newRange = document.createRange();
      newRange.setStartAfter(space);
      newRange.collapse(true);

      selection.removeAllRanges();
      selection.addRange(newRange);

      this.lastRange = newRange;
      this.updateMessage();
    },
    // 清空输入框
    clearInput() {
      const input = this.$refs.input;
      if (input) {
        input.innerHTML = '';
        this.message = '';
        this.lastRange = null;
        input.focus();
      }
    },
    // 处理中文输入法
    handleCompositionStart() {
      this.isComposing = true;
    },
    handleCompositionEnd() {
      this.isComposing = false;
      this.updateMessage();
    },
    // 发送消息改进
    sendMessageFn(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (this.isComposing) return; // 中文输入法输入过程中不发送
      }

      if (!this.message.trim()) return;

      const u = new User(this.getCurrentUser);
      if (this.chatTarget.isGroup) {
        const res = u.sendMessageToGroup({
          id: this.chatTarget.id,
          content: this.message,
          replyMsg: this.replyMsg
        });

        const msg = res.data.message;
        const roleMap = {
          lord: 'owner',
          member: 'member',
          admin: 'admin',
          'super-admin': 'owner'
        };
        const role = u.groups.find((item) => item.id === res.data.gid).role;

        this.send({
          event: 'on_message',
          time: msg.date,
          type: 1,
          messageId: msg.id,
          message: msg.content,
          messageAlt: msg.content,
          userId: msg.role,
          groupId: res.data.gid,
          sender: {
            nickname: u.name,
            role: roleMap[role]
          }
        });
      } else {
        const res = u.sendMessageToFriend({
          id: this.chatTarget.id,
          content: this.message,
          replyMsg: this.replyMsg
        });
        if (this.chatTarget.id === 'user-super-admin') this.sendMsgToBot(res, u);
      }

      this.clearInput();
      this.cancelReplyMsgFn();
      this.scrollToBottom(true);
    },
    // 其他原有方法保持不变...
    sendMsgToBot(msg, sender) {
      const msg_data = msg.data.message;
      this.send({
        event: 'on_message',
        time: msg_data.date,
        type: 0,
        messageId: msg_data.id,
        message: msg_data.content,
        messageAlt: msg_data.content,
        userId: msg.data.sender,
        sender: {
          nickname: sender.name
        }
      });
    },
    async setGroupAdminFn() {
      const { value: mid } = await this.$prompt('请输入群成员id', '设置群管理员', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      const res = new User(this.getCurrentUser).setGroupAdmin({
        gid: this.chatTarget.id,
        mid
      });
      console.log(res);
    },
    isSelfFn(sender) {
      if (sender === 'self') {
        return true;
      } else if (sender === 'friend') {
        return false;
      } else {
        return sender === this.getCurrentUser.id;
      }
    },
    isRangeInNode(range, node) {
      if (!range || !node) return false;
      const container = range.commonAncestorContainer;
      return node.contains(container);
    },
    replyMsgFn(msg) {
      let name;
      if (this.chatTarget.isGroup) {
        name = this.admin.getUserById(msg.role).name;
      } else {
        name = this.admin.getUserById(msg.sender).name;
      }
      this.replyMsg = { name, content: msg.content };
      this.$refs.input.focus();
    },
    handleMenuAction(action) {
      this.$emit('handleMenuAction', action);
    },
    cancelReplyMsgFn() {
      this.replyMsg = { name: null, content: null };
    },
    scrollToBottom(smooth = false) {
      const container = this.$refs.chatBox;
      if (!container) return;
      this.$nextTick(() => {
        if (smooth) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        } else {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    // 更新占位符显示
    updatePlaceholder() {
      const input = this.$refs.input;
      if (!input) return;

      if (input.textContent.trim() === '') {
        input.setAttribute('data-placeholder', this.messagingPlaceholder);
      } else {
        input.removeAttribute('data-placeholder');
      }
    }
  },

  watch: {
    getCurrentMsg(val) {
      this.cancelReplyMsgFn();
      if (this.$refs.input) {
        this.clearInput();
      }
    },
    messagingEnabled(val) {
      if (!val) {
        this.clearInput();
      }
    }
  },

  props: {
    chatTarget: {
      type: Object,
      default() {
        return null;
      }
    },
    memberList: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  created() {},
  mounted() {
    const input = this.$refs.input;
    if (input) {
      input.focus();

      // 添加中文输入法事件监听
      input.addEventListener('compositionstart', this.handleCompositionStart);
      input.addEventListener('compositionend', this.handleCompositionEnd);

      // 添加占位符功能
      this.updatePlaceholder();
    }

    this.$nextTick(() => {
      this.scrollToBottom();
    });
  },

  beforeDestroy() {
    const input = this.$refs.input;
    if (input) {
      input.removeEventListener('compositionstart', this.handleCompositionStart);
      input.removeEventListener('compositionend', this.handleCompositionEnd);
    }
    if (this.muteStatusIntervalId) clearInterval(this.muteStatusIntervalId);
  },

  updated() {
    this.scrollToBottom();
    this.updatePlaceholder();
  }
};
</script>

<style lang="scss" scoped>
.k-chat-main {
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
  width: 100%;
  // min-width: 300px;
  height: 100%;

  .k-chat-box {
    position: relative;
    height: 100%;
    flex: 1;
    flex-basis: 0;
    overflow-y: auto;
    overflow-x: hidden;

    .el-alert {
      position: sticky;
      top: 8px;
      z-index: 2;
      background: #f0e8fd;
      color: var(--theme-color);
      border: 1px solid var(--theme-color);

      &::v-deep .el-alert__content {
        span,
        i,
        p {
          // color: #5d87ff;
          color: var(--theme-color);
        }
      }
    }
  }

  .k-chat-input-box {
    padding: 10px;
    position: relative;
    height: 150px;
    background: #f2f2f2;
    border-top: 2px solid #e9e9e9;
    border-bottom: 2px solid #e9e9e9;
    box-sizing: border-box;

    .k-chat-input {
      height: 70%;
      overflow: auto;
      outline: none;
      overflow-wrap: break-word;
      white-space: pre-wrap;
      word-break: break-all;
      font-weight: normal;
      font-style: normal;
      background: transparent;
      position: relative;

      &::-webkit-scrollbar {
        display: none;
      }

      // 占位符样式
      &[data-placeholder]:empty::before {
        content: attr(data-placeholder);
        color: #999;
        pointer-events: none;
        position: absolute;
      }

      // mention按钮样式
      .pps-button {
        display: inline-block;
        margin: 0 2px;
        padding: 2px 6px;
        border-radius: 3px;
        background: #e1f5fe;
        color: #0277bd;
        border: none;
        font-size: inherit;
        cursor: default;
        pointer-events: none;

        &:focus {
          outline: none;
        }
      }
    }

    .operation {
      display: flex;
      justify-content: space-between;

      .k-chat-send-btn {
        margin-left: auto;
      }

      .reply-chat-wrapper {
        display: flex;
        align-items: center;
        font-size: 12px;
        border-radius: 4px;
        padding: 6px 8px;
        background: var(--sb-reply-bg);
        color: var(--sb-reply-color);

        .content {
          max-width: 15em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .el-icon-circle-close {
          width: 1em;
          margin-left: 5px;
          cursor: pointer;
        }
      }
    }
  }
}

.chat-empty {
  height: 100%;
}
</style>
