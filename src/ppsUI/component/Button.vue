<template>
  <button
    v-bind="$attrs"
    v-on="$listeners"
    class="pps-button"
    :class="[theme ? `pps-button-${theme}` : `pps-button-default`]"
    @click="handle"
  >
    <slot>pps-button</slot>
  </button>
</template>

<script>
export default {
  name: 'ppsButton',
  inheritAttrs: false,
  props: {
    theme: {
      type: String,
      default() {
        return '';
      }
    },
    content: {
      type: String,
      default() {
        return 'pps-button';
      }
    },
    handleClick: {
      type: Function,
      default: () => {
        console.warn('[pps-ui] 未定义点击');
      }
    },
    handleData: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {
    handle(e) {
      this.$emit('click', e);
    }
  }
};
</script>

<style>
/*================ pps-button ================*/
.pps-button + .pps-button {
  margin-left: 10px;
}

.pps-button {
  cursor: pointer;
  user-select: none;
  padding: 8px 15px;
  white-space: nowrap;
  color: #2e2e2e;
  font-weight: 500;
  font-size: 12px;
  text-align: center;
  border: none;
  border-radius: 9px;
  outline: none;
}
/* =================  end  =================== */

/*================ default ================*/

.pps-button-default {
  background-color: #fff;
  border: 1px solid #c3c5c7;
}
.pps-button-default:hover {
  color: rgb(50, 188, 242);
  border: 1px solid rgb(50, 188, 242);
}
.pps-button-default:active {
  box-shadow: inset 3px 3px 5px 0px #c3c5c7;
}
/*================ end ================*/

/*================ primary ================*/
.pps-button-primary {
  color: #fff;
  background: #e6a23c;
  box-shadow: inset 0px 0px 1px 1px #cb9e0a;
}
.pps-button-primary:hover {
  background: #ffc312;
}
.pps-button-primary:active {
  box-shadow: inset 3px 3px 3px 2px #cb9e0a;
}
/*================= end ===================*/

/*============ confirm ===============*/
.pps-button-confirm {
  color: #fff;
  background-color: #00aeed;
  box-shadow: inset 0px 0px 1px 1px rgb(50, 152, 242);
}
.pps-button-confirm:active {
  box-shadow: inset 3px 3px 3px 2px rgb(50, 176, 225);
}
.pps-button-confirm:hover {
  background-color: #40c5f1;
}
/*================ end ================*/

/*============== warn ===============*/
.pps-button-warn {
  color: #fff;
  background-color: rgb(252, 40, 40);
  box-shadow: inset -0px 0px 1px 1px rgb(148, 5, 5);
}
.pps-button-warn:hover {
  background-color: rgb(251, 88, 88);
}
.pps-button-warn:active {
  box-shadow: inset 3px 3px 3px 2px rgb(198, 6, 6);
}
/*=============== end =================*/
</style>
