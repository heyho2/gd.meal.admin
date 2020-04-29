<template>
  <el-row>
    <el-card :body-style="{ padding: '0px' }" :style="{display: 'inline-block'}">
      <gd-img
        :src="c_url"
        :title="'附件Guid：'+(c_value||'无')"
        preview="__9999999"
        :imgWidth="imgWidth"
        :imgHeight="imgHeight"
      />
      <div style="padding: 5px;text-align: center;">
        <upload-img-button
          ref="imgbutton"
          :autoCropWidth="autoCropWidth"
          :autoCropHeight="autoCropHeight"
          :url="curl2"
          :afterSuccess="afterSuccess"
          :hidden="hidden"
          :size="size"
          :notCutting="notCutting"
        />
      </div>
    </el-card>
  </el-row>
</template>
<script>
import GdImg from "../GdImg";
import uploadImgButton from "./Button";

export default {
  components: { GdImg, uploadImgButton },
  props: {
    value: { type: [String, Array], default: null },
    imgWidth: { type: String, default: 'auto' },
    imgHeight: { type: String, default: 'auto' },
    url: { type: [String, Array], default: null },
    autoCropWidth: { type: [Number, String], default: 100 },
    autoCropHeight: { type: [Number, String], default: 100 },
    hidden: { type: Boolean, default: false },
    size: { type: Number, default: 1024 }, //图片大小
    notCutting: { type: Boolean, default: false } //不裁剪
  },
  computed: {
    c_value: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      }
    },
    c_url: {
      get() {
        return this.url;
      },
      set(val) {
        this.$emit("update:url", val);
      }
    }
  },
  watch: {},
  data() {
    return {
      dialogVisible: false,
      curl2: this.url
    };
  },
  methods: {
    afterSuccess(url, value) {
      this.c_value = value;
      this.c_url = url;
    },
    beforeClick() {
      this.$refs.imgbutton.selectFile();
    }
  }
};
</script>


