<template>
  <k-sb-aside class="aside-group">aside-right</k-sb-aside>
</template>

<script>
import kSbAside from '@/components/layout/aside';
export default {
  name: 'sb-right-aside',
  components: {
    kSbAside
  }
};
</script>

<style>
.empty {
  height: calc(var(--k-main-height) - var(--k-footer-height));
}
.aside-group {
  width: var(--sb-aside-width);
  background: #f2f2f2;
  border: 2px solid #e9e9e9;
  border-top: none;
}
</style>
