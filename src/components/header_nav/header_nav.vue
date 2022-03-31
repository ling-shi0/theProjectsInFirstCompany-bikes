<template>
  <div class="box">
    <p>{{ str1 }}{{ headerStr2 }}</p>
  </div>
</template>

<script>

export default {
  name: "headerNav",
  data () {
    return {
      str1: ""
    };
  },
  mounted () {},
  props: {
    headerStr2: {
      type: String,
      require: false
    }
  },
  methods: {
    init (headerStr1) {
      this.str1 = headerStr1;
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  border: 1px solid #000;
  p {
    color: #f00;
  }
  a {
    width: 100px;
    height: 50px;
    line-height: 50px;
    display: inline-block;
    text-align: center;
    border: 1px solid #ccc;
  }
  a.active {
    background: #ccc;
  }
}
</style>
