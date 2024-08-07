<template>
  <div class="pps-card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ppsCard',
  data() {
    return {
      // styleObj: {
      //   position: "relative",
      //   width: "auto",
      //   height: "fit-content",
      //   padding: "5px",
      //   boxShadow: "0 0 0 rgba(0, 0, 0, 0.144)",
      //   borderRadius: "8px",
      //   background: "#fff",
      //   paddingBottom: "10px"
      // }
    };
  }
};
</script>

<style>
.pps-card {
  position: relative;
  width: auto;
  height: fit-content;
  padding: 5px;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.144);
  border-radius: 8px;
  background: #fff;
  /* padding-bottom: 10px; */
}
</style>
