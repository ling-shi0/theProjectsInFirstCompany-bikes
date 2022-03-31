<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-09-09 13:55:13
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2022-02-09 11:46:43
-->
<template>
  <div class="feature-search-filter">
    <div>
      <div class="bord">车身颜色</div>
      <FilterCheckBox
        :checkBoxList="bikeColors"
        @checkedListChange="(data) => checkedListChange(data, 'vehicleColor')"
      ></FilterCheckBox>
    </div>
    <div>
      <div class="bord">前置物筐</div>
      <FilterCheckBox
        :checkBoxList="yesNoArr"
        @checkedListChange="
          (data) => checkedListChange(data, 'withFrontBasket')
        "
      ></FilterCheckBox>
    </div>
    <!-- <div>
      &nbsp;&nbsp;&nbsp;&nbsp;后备箱
      <FilterCheckBox
        :checkBoxList="yesNoArr"
        @checkedListChange="(data) => checkedListChange(data, 'withRearBox')"
      ></FilterCheckBox>
    </div> -->
  </div>
</template>

<script>
import FilterCheckBox from "./FilterCheckBox.vue";
import { bikeColors, yesNoArr, colorValMap } from "./Constant";
export default {
  name: "FeatureSearchFilter",
  components: {
    FilterCheckBox
  },
  data() {
    return {
      bikeColors,
      yesNoArr,
      featureSearch: {
        vehicleColor: "",
        withFrontBasket: ""
        // withRearBox: "",
      }
    };
  },
  methods: {
    checkedListChange(data, str) {
      this.featureSearch[str] = data.map((item) => colorValMap[item]).join(",");
      this.$emit("searchDataChange", this.featureSearch);
    },
  },
};
</script>

<style lang="scss" scoped>
.feature-search-filter {
  width: 100%;
  height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 24px 48px;
  > div {
    width: 100%;
    height: 24px;
    display: flex;
    font-size: 12px;
    line-height: 24px;
  }
  .bord{
    font-size: 13px;
  }
}
</style>