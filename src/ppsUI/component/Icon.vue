<template>
  <component :is="iconName" v-on="$listeners"></component>
</template>

<script>
import ppsAdmin from './icon/admin';
import ppsClose from './icon/close';
import ppsLock from './icon/lock';
import ppsOffline from './icon/offline';
import ppsOnline from './icon/online';
import ppsSearch from './icon/search';
import ppsGithub from './icon/github';
import ppsHelp from './icon/help';
import ppsQq from './icon/qq';
import ppsSideHide from './icon/side-hide';
import ppsSideShow from './icon/side-show';
export default {
  name: 'ppsIcon',
  data() {
    return {
      map: {
        'pps-icon-admin': ppsAdmin,
        'pps-icon-close': ppsClose,
        'pps-icon-lock': ppsLock,
        'pps-icon-offline': ppsOffline,
        'pps-icon-online': ppsOnline,
        'pps-icon-search': ppsSearch,
        'pps-icon-github': ppsGithub,
        'pps-icon-help': ppsHelp,
        'pps-icon-qq': ppsQq,
        'pps-icon-side-hide': ppsSideHide,
        'pps-icon-side-show': ppsSideShow
      }
    };
  },
  components: {
    ppsAdmin,
    ppsClose,
    ppsLock,
    ppsOffline,
    ppsOnline,
    ppsSearch,
    ppsGithub,
    ppsHelp,
    ppsQq,
    ppsSideHide,
    ppsSideShow
  },
  props: {
    icon: {
      type: String,
      default() {
        return '';
      }
    }
  },
  computed: {
    iconName() {
      if (this.map[this.icon]) {
        return this.map[this.icon];
      } else {
        return '';
      }
    }
  }
};
</script>
