export const userFullScreen = {
  methods: {
    toggleFullscreen() {
      this.isFullscreen() ? this.exit() : this.enter(document.documentElement);
    },
    isFullscreen() {
      return (
        !!document.fullscreenElement ||
        !!document.webkitFullscreenElement ||
        !!document.mozFullScreenElement ||
        !!document.msFullscreenElement ||
        null
      );
    },
    enter(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        // Safari
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        // Firefox
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        // IE/Edge
        element.msRequestFullscreen();
      }
    },
    exit() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        // Safari
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
    }
  }
};

export const tranRoleMixin = {
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
  methods: {
    tranRoleFn(role) {
      const roleMap = {
        lord: '群主',
        admin: '管理员',
        'super-admin': 'bot',
        expellee: '已退群'
      };
      return roleMap[role] || '';
    },
    avatarContextMenuFn(menu) {
      const { uid, task, key } = menu;
      if (task) {
        const user = this.admin.getUserById(uid);
        this.$emit('handleMenuAction', {
          targetUser: user,
          actionType: key,
          groupId: this.chatTarget.id
        });
      }
    }
  }
};

// const permissionList = {}
