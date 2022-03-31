<template>
  <div class="upload">
    <el-dialog title="预览图片" :visible.sync="showBox" class="export_box">
      <div class="upload_main">
        <div>
          <h-img-view
            class="demo-img"
            :src="imgSrc"
            mode="adjust"
            cursor="grab"
          ></h-img-view>
          <p class="txt_c mt10">
            抓拍时间：2020/04/09 12:23:10 抓拍地点：滨江区物联网街
          </p>
        </div>
        <div class="mt10">
          <h3 class="fs14 fw_n mb5">共 6 张照片</h3>
          <h-album :data="data" />
          <div class="pl30 pr30 swiper_box dn">
            <div class="swiper-container">
              <div class="swiper-wrapper">
                <div class="swiper-slide">
                  <img
                    src="../assets/images/clueManage/clue_details_img.jpg"
                    alt=""
                    class="w100"
                  />
                </div>
                <div class="swiper-slide">
                  <img
                    src="../assets/images/clueManage/clue_details_img.jpg"
                    alt=""
                    class="w100"
                  />
                </div>
                <div class="swiper-slide">
                  <img
                    src="../assets/images/clueManage/clue_details_img.jpg"
                    alt=""
                    class="w100"
                  />
                </div>
                <div class="swiper-slide">
                  <img
                    src="../assets/images/clueManage/clue_details_img.jpg"
                    alt=""
                    class="w100"
                  />
                </div>
                <div class="swiper-slide">
                  <img
                    src="../assets/images/clueManage/clue_details_img.jpg"
                    alt=""
                    class="w100"
                  />
                </div>
                <div class="swiper-slide">
                  <img
                    src="../assets/images/clueManage/clue_details_img.jpg"
                    alt=""
                    class="w100"
                  />
                </div>
              </div>
              <!-- 如果需要导航按钮 -->
              <div class="swiper-button-prev">
                <span class="iconfont arrow">&#xe629;</span>
              </div>
              <div class="swiper-button-next">
                <span class="iconfont arrow">&#xe629;</span>
              </div>
              <em class="cover1"></em>
              <em class="cover2"></em>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showBox = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data () {
    return {
      showBox: false,
      imgSrc:
        "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=186602880,1005592543&fm=26&gp=0.jpg",
      data: [
        {
          title: "标题1",
          url: "",
          key: 1
        },
        {
          title: "标题2",
          url: "",
          key: 2
        }
      ]
    };
  },
  mounted () {},
  methods: {
    init () {
      this.showBox = true;
    }
  }
};
</script>

<style lang="scss" scoped>

.upload {
  .export_box {
    ::v-deep .el-dialog__header {
      border: 1px solid #ddd;
      padding: 5px 10px;
      .el-dialog__title {
        font-size: 14px;
      }
      .el-dialog__headerbtn {
        font-size: 20px;
        top: 3px;
        color: #f00;
      }
    }
    ::v-deep .el-dialog__body {
      padding: 0;
    }
    ::v-deep .el-dialog__footer {
      border: 1px solid #ddd;
      padding-bottom: 10px;
      button {
        padding: 7px 25px;
      }
    }
    .main {
      ::v-deep .main_word {
        input {
          line-height: 32px;
          height: 32px;
          font-size: 12px;
          padding-left: 5px;
        }
        .latitudeLongitude {
          ::v-deep .el-input {
            width: 80%;
          }
        }
      }
      .swiper_box {
        overflow: hidden;
        position: relative;
        .swiper-container {
          overflow: visible;
          .swiper-slide {
            height: 120px;
            background: #ccc;
            z-index: 0;
          }
          .swiper-button-prev,
          .swiper-button-next {
            left: -30px;
            height: 60px;
            width: 20px;
            background: #ccc;
            opacity: 0.5;
            border-radius: 10px;
            line-height: 60px;
            text-align: center;
            z-index: 4;
            transform: translateY(-50%);
            top: 67%;
          }
          .swiper-button-next {
            left: auto;
            right: -30px;
          }
        }
        .cover1,
        .cover2 {
          content: "";
          width: 30px;
          height: 120px;
          background: #fff;
          position: absolute;
          top: 0;
          left: -30px;
          z-index: 1;
        }
        .cover2 {
          right: -30px;
          left: auto;
        }
      }
    }
  }
}

@import "~@hui-pro/theme/index.scss";
.upload_main {
  .demo-img {
    width: 100%;
    height: 320px;
  }
  .demo-img-wrapper {
    position: relative;
  }
  .demo-img-bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    padding: 0 8px;
    background: rgba(0, 0, 0, 0.4);
    color: $--color-white;
    line-height: 40px;
  }
}
</style>
