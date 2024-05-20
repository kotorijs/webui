<template>
  <div class="user-avatar">
    <a class="user-home" :href="userUrl" title="进入主页" :target="href ? '_blank' : ''">
      <img :src="avatar" alt="" class="avatar-img" :height="`${size}px`" :width="`${size}px`" />
    </a>
  </div>
</template>

<script>
export default {
  name: 'ppsAvatar',
  props: {
    src: {
      type: String,
      default() {
        return '';
      }
    },
    href: {
      type: String
    },
    defaultSrc: {
      type: String,
      default() {
        return 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png';
      }
    },
    size: {
      type: Number,
      default() {
        return 100;
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    avatar() {
      return this.src || this.defaultSrc;
    },
    userUrl() {
      return this.href || 'javascript:;';
    }
  }
};
</script>

<style>
.user-avatar {
  margin: auto;
  width: fit-content;
  height: fit-content;
}

.user-avatar a img {
  /* width: 100px;
  height: 100px; */
  border-radius: 50%;
}

.user-avatar a img:hover {
  filter: brightness(75%);
}
</style>
