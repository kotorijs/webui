<template>
  <component :is="iconName" v-on="$listeners"></component>
</template>

<script>
import ppsAdmin from '../icons/admin';
import ppsClose from '../icons/close';
import ppsLock from '../icons/lock';
import ppsOffline from '../icons/offline';
import ppsOnline from '../icons/online';
import ppsSearch from '../icons/search';
import ppsGithub from '../icons/github';
import ppsHelp from '../icons/help';
import ppsQq from '../icons/qq';
import ppsSideHide from '../icons/side-hide';
import ppsSideShow from '../icons/side-show';
import ppsHost from '../icons/host';
import ppsPort from '../icons/port';
import ppsAccount from '../icons/account';
import ppsContact from '../icons/contact';
import ppsGroup from '../icons/group';

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
        'pps-icon-side-show': ppsSideShow,
        'pps-icon-host': ppsHost,
        'pps-icon-port': ppsPort,
        'pps-icon-account': ppsAccount,
        'pps-icon-contact': ppsContact,
        'pps-icon-group': ppsGroup
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
    ppsSideShow,
    ppsHost,
    ppsPort,
    ppsAccount,
    ppsContact,
    ppsGroup
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
