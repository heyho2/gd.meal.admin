<template>
  <div :class="`gd-img ${preview?'shoushi':''}`" :style="style1">
    <img
      v-lazy="src||require('@/assets/图片加载失败2.png')"
      :preview="preview"
      :alt="title"
      :key="src"
      :title="title"
      :preview-text="title"
      :onerror="errorImg01"
      :class="preview?'shoushi':''"
      :style="style1"
    >
  </div>
</template>
<script>
export default {
  props: {
    src: { type: String, default: null },
    title: { type: String },
    preview: { type: String },
    imgWidth: { type: String, default: "auto" },
    imgHeight: { type: String, default: "auto" }
  },
  //   watch: {
  //     src(val) {
  //       this.$previewRefresh();
  //     }
  //   },
  created() {
    this.$previewRefresh();
    this.style1 = {
      width: this.imgWidth ? `${this.imgWidth}` : "auto",
      height: this.imgHeight ? `${this.imgHeight}` : "auto"
    };
  },
  data() {
    return {
      errorImg01: 'this.src="' + require("@/assets/图片加载失败2.png") + '"',
      style1: {}
    };
  }
};
</script>
<style scoped>
.shoushi {
  cursor: pointer;
}
img[lazy="loading"] {
  width: auto !important;
  height: auto !important;
  display: table;
}
.gd-img {
  text-align: center;
  font-size: 18px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.pswp--open {
  z-index: 99999;
}
</style>