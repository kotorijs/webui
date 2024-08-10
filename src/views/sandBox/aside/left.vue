<template>
  <k-container direction="horizontal" class="left-aside">
    <k-sb-aside class="aside-users empty">
      <header class="k-chat-header">
        <div class="current-user-avatar">
          <img class="user-avatar-img" :src="getCurrentUser.avatar" alt="" />
        </div>
      </header>
      <k-menu
        :default-active="getCurrentUser.id"
        active-color="#752bec"
        active-shape="circle"
        text-color="#061e26"
        background-color="#00000017"
        mode="vertical"
      >
        <k-menu-item
          v-for="(user, index) in getAllUser"
          :key="index"
          :index="user.id"
          :title="user.name"
          width="60"
        >
          <div class="user-avatar">
            <img class="user-avatar-img" :src="user.avatar" alt="" />
          </div>
        </k-menu-item>
      </k-menu>
    </k-sb-aside>
    <k-sb-aside class="aside-list empty">
      <header class="k-chat-header">user</header>
    </k-sb-aside>
  </k-container>
</template>

<script>
import { mapGetters } from 'vuex';
import kContainer from '@/components/layout/container';
import kMenuItem from '@/components/menus/menu-item.vue';
import kMenu from '@/components/menus/';
import kSbAside from '@/components/layout/aside';
export default {
  name: 'sb-left-aside',
  components: { kSbAside, kContainer, kMenu, kMenuItem },
  data() {
    return {
      users: []
    };
  },
  computed: {
    ...mapGetters('sandBox', ['getCurrentUser', 'getAllUser'])
  },
  mounted() {
    console.log(this.getAllUser);
    console.log(this.getCurrentUser);
  }
};
</script>

<style lang="less">
.left-aside {
  width: var(--sb-aside-width);

  .aside-users {
    width: 60px;
    background-color: #f2f2f2;
    border-bottom: 2px solid #e9e9e9;

    .k-chat-header {
      position: sticky;
      top: 0;
      height: 65px !important;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #c5c5c7;
      border-bottom: 2px solid #e9e9e9;

      .current-user-avatar {
        width: 40px;
        height: 40px;
      }
    }

    .k-menu {
    //   margin-top: 5px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
    }

    .user-avatar-img {
      width: 100%;
      height: 100%;
      vertical-align: bottom;
      border-radius: 50%;
    }
  }
  .aside-list {
    flex-grow: 1;
    background-color: #fff;
    border: 2px solid #e9e9e9;
    border-top: none;

    .k-chat-header {
      border-bottom: 2px solid #e9e9e9;
    }
  }
}

.empty {
  height: calc(var(--k-main-height) - var(--k-footer-height));
}
</style>
