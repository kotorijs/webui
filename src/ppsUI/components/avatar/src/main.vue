<template>
  <div class="pps-avatar" v-on="$listeners">
    <a v-if="href" class="pps-avatar-link" :href="href" title="" :target="href ? '_blank' : ''">
      <img :src="src" alt="" class="pps-avatar-img" :width="`${size}px`" />
    </a>
    <img
      v-else
      :src="src"
      alt=""
      class="pps-avatar-img"
      :width="`${size}px`"
      :height="`${size}px`"
    />
  </div>
</template>

<script>
export default {
  name: 'ppsAvatar',
  props: {
    src: {
      type: String,
      default() {
        return 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png';
      }
    },
    href: {
      type: String,
      default() {
        return '';
      }
    },
    size: {
      type: [Number, String],
      default() {
        return 100;
      }
    }
  }
};
</script>
