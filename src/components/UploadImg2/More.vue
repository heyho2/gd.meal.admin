<template>
  <el-row>
    <div
      v-for="(item,i) in cValues"
      :key="i"
      :style="{'position':'relative','display': 'inline-block'}"
    >
      <el-button
        icon="el-icon-close"
        size="mini"
        circle
        style="position: absolute;right: 5px;top: 0px;"
        @click="close(i)"
      ></el-button>
      <el-card
        :body-style="{ padding: '0px' }"
        :style="{display: 'inline-block','margin-right': '12px','margin-top': '12px'}"
      >
        <gd-img
          :src="item.url"
          :title="'附件Guid：'+(item.value||'无')"
          preview="__9999999"
          :imgWidth="imgWidth"
          :imgHeight="imgHeight"
        />
        <div style="padding: 5px;text-align: center;">
          <upload-img-button
            :autoCropWidth="autoCropWidth"
            :autoCropHeight="autoCropHeight"
            :url.sync="item.url"
            :value.sync="item.value"
            :size="size"
            :notCutting="notCutting"
          />
        </div>
      </el-card>
    </div>
    <el-card :body-style="{ padding: '0px' }" :style="{display: 'inline-block'}">
      <gd-img
        :src="null"
        :title="'附件Guid：'+(null||'无')"
        :imgWidth="imgWidth"
        :imgHeight="imgHeight"
      />
      <div style="padding: 5px;text-align: center;">
        <upload-img-button
          :autoCropWidth="autoCropWidth"
          :autoCropHeight="autoCropHeight"
          :buttontext="'新增图片'"
          :afterSuccess="afterSuccess"
          :size="size"
          :notCutting="notCutting"
        />
      </div>
    </el-card>
  </el-row>
</template>
<script>
import uploadImgButton from "./Button";
import GdImg from "@/views/commons/GdImg";
export default {
  name: "UploadImg2More",
  components: { uploadImgButton, GdImg },
  props: {
    values: {
      type: Array,
      default: () => {
        return [];
      }
    },
    imgWidth: { type: String, default: "auto" },
    imgHeight: { type: String, default: "auto" },
    autoCropWidth: { type: [Number, String], default: 100 },
    autoCropHeight: { type: [Number, String], default: 100 },
    size: { type: Number, default: 1024 }, //图片大小
    notCutting: { type: Boolean, default: false } //不裁剪
  },
  computed: {
    cValues: {
      get() {
        return this.values;
      },
      set(val) {
        this.$emit("update:values", val);
      }
    }
  },
  data() {
    return {
      valIndex: 0,
      curl2: "",
      dialogVisible: false
    };
  },
  watch: {
    valIndex(val) {
      var t = this;
      t.curl2 = t.cValues[t.valIndex - 1].url;
    }
  },
  created() {},
  methods: {
    afterSuccess(url, value) {
      var t = this;
      t.cValues.push({
        value: value,
        url: url
      });
    },
    close(index) {
      var t = this;
      t.cValues.splice(index, 1);
    }
  }
};
</script>

