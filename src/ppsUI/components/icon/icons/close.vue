<template>
  <div class="pps-icon-close">
    <pps-button v-on="$listeners">
      <i>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
          <path
            fill="currentColor"
            d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
          ></path>
        </svg>
      </i>
    </pps-button>
  </div>
</template>

<script>
export default {
  name: 'pps-close'
};
</script>

<style lang="scss">
.pps-icon-close {
  i {
    display: block;
    width: 1em;
    height: 1em;
  }
  .pps-button {
    font-size: 1em;
    border: none;
    box-shadow: none;
    padding: 0;
    &:active,
    &:hover {
      background-color: initial;
      box-shadow: none;
      border: none;
    }
  }
}
</style>
