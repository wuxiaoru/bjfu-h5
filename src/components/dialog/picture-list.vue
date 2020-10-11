<template>
  <div class="picture-list">
    <div v-for="(item, index) in list" @click="changeImg(item, index)" :class="{'active' : index === active}">
      <img :src="item">
    </div>
  </div>
</template>

<script>
export default {
  name: 'PictureList',
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      active: 0
    };
  },
  methods: {
    changeImg(item, index) {
      this.active = index;
      this.$emit('click', item);
    }
  }
};
</script>

<style scoped lang="less">
.picture-list {
  width: 100px;
  height: 500px;
  border-style:solid;
  border-color:#98bf21;
  border-width:3px;
  margin-top:20px;
  overflow-y: auto;
  > div {
    width: 96px;
    height: 96px;
    border: 2px solid white;
    margin-bottom: 10px;
    > img {
      width: 100%;
      height: 96px;
    }
    &.active {
      border: 2px solid #409eff;
    }
  }
}
</style>