<template>
  <div>
    <el-dialog
      title="导入视频"
      :visible.sync="showBox"
      class="upload_video_box"
    >
      <div class="main pt10 pl10 pr10 pb10 fs12">
        <el-row>
          <el-col :span="17" class="main_in">
            <img
              src="../assets/images/clueManage/clue_details_img.jpg"
              alt=""
              class="w100"
              style="height:366px;"
            />
          </el-col>
          <el-col :span="7" class="fs14 pl10 main_word">
            <el-form
              :inline="true"
              :model="fromObj.formType"
              class="demo-form-inline"
            >
              <el-row>
                <el-col :span="24" class="mb10">
                  <p class="fs12">抓拍时间</p>
                  <Date-picker
                    @on-change="changeCaptureTime"
                    type="datetime"
                    format="yyyy/MM/dd HH:mm:ss"
                    placeholder="请选择时间"
                    style="width: 100%"
                    placement="bottom-end"
                  >
                  </Date-picker>
                </el-col>
                <el-col :span="24" class="mb10">
                  <p class="fs12">抓拍地点</p>
                  <el-input
                    placeholder="请输入内容"
                    v-model="fromObj.formType.capturePlace"
                    clearable
                  >
                  </el-input>
                </el-col>
                <el-col :span="24" class="mb10 latitudeLongitude">
                  <p class="fs12">经纬度</p>
                  <el-row>
                    <el-col :span="12">
                      <el-input
                        placeholder="请输入"
                        v-model="fromObj.formType.longitude"
                        clearable
                      >
                      </el-input>
                      <span class="color_999"> —</span>
                    </el-col>
                    <el-col :span="12">
                      <el-input
                        placeholder="请输入"
                        v-model="fromObj.formType.latitude"
                        clearable
                      >
                      </el-input>
                      <i class="h-icon-location fs20 por" style="top:5px;"></i>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24" class="mb10">
                  <p class="fs12">备注</p>
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="fromObj.formType.remarks"
                  >
                  </el-input>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
        <div class="mt10 upload">
          <h3 class="fs14 fw_n mb5">共 6 个视频</h3>
          <div class="clearfix">
            <div class="upload_Box fl">
              <div class="por upload_in">
                <input type="file" id="photoFile" @change="upload()" />
                <div class="inputCover txt_c pt10">
                  <i class="h-icon-add fs20"></i>
                  <p class="fs12">上传图片</p>
                </div>
              </div>
            </div>
            <h-album :data="rotationList" class="rotation" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showBox = false">上传</el-button>
        <el-button @click="showBox = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import hepler from "@/helper.js";
export default {
  data() {
    return {
      showBox: false,
      fromObj: {
        // 搜素条件
        formType: {
          captureTime: [], // 抓拍时间
          capturePlace: "", // 抓拍地点
          longitude: "", // 经度
          latitude: "", // 纬度
          remarks: "" // 备注
        }
      },
      rotationList: [
        // 轮播图片数组
        {
          title: "标题1",
          url:
            "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2242212773,2792770847&fm=26&gp=0.jpg",
          key: 1
        },
        {
          title: "标题2",
          url:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590643774516&di=86c572662a6a68d2fd091238a74014fc&imgtype=0&src=http%3A%2F%2Ffile02.16sucai.com%2Fd%2Ffile%2F2014%2F1006%2Fe94e4f70870be76a018dff428306c5a3.jpg",
          key: 2
        },
        {
          title: "标题1",
          url:
            "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2242212773,2792770847&fm=26&gp=0.jpg",
          key: 3
        },
        {
          title: "标题2",
          url:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590643774516&di=86c572662a6a68d2fd091238a74014fc&imgtype=0&src=http%3A%2F%2Ffile02.16sucai.com%2Fd%2Ffile%2F2014%2F1006%2Fe94e4f70870be76a018dff428306c5a3.jpg",
          key: 4
        },
        {
          title: "标题1",
          url:
            "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2242212773,2792770847&fm=26&gp=0.jpg",
          key: 5
        },
        {
          title: "标题2",
          url:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590643774516&di=86c572662a6a68d2fd091238a74014fc&imgtype=0&src=http%3A%2F%2Ffile02.16sucai.com%2Fd%2Ffile%2F2014%2F1006%2Fe94e4f70870be76a018dff428306c5a3.jpg",
          key: 6
        }
      ]
    };
  },
  watch: {
    "fromObj.formType.longitude"(val) {
      if (val && typeof val === 'string') {
        this.fromObj.formType.longitude = val.replace(
          new RegExp(helper.lngLatReplace, "g"),
          ""
        );
      }
    },
    "fromObj.formType.latitude"(val) {
      if (val && typeof val === 'string') {
        this.fromObj.formType.latitude = val.replace(
          new RegExp(helper.lngLatReplace, "g"),
          ""
        );
      }
    }
  },
  mounted() {},
  methods: {
    init() {
      this.showBox = true;
    },
    changeCaptureTime(time) {
      // 选择画面时间
      this.fromObj.formType.captureTime = time;
    }
  }
};
</script>

<style lang="scss" scoped>
.upload_video_box {
  ::v-deep .el-dialog--small {
    margin-left: 0% !important;
    width: 60%;
    top: 10% !important;
    left: 50%;
    transform: translateX(-50%);
  }
  ::v-deep .el-dialog__header {
    border: 1px solid #ddd;
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
  ::v-deep .el-textarea__inner {
    font-size: 12px;
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
        .el-input {
          width: 75%;
          font-size: 12px;
        }
      }
    }
    .upload {
      .upload_Box {
        padding: 8px 0 0 8px;
        .upload_in {
          height: 72px;
          width: 72px;
          border: 1px dashed #ccc;
          input {
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            cursor: pointer;
          }
          .inputCover {
            position: absolute;
            background: #fff;
            height: 100%;
            width: 100%;
            pointer-events: none;
          }
          .close {
            position: absolute;
            top: -12px;
            right: -8px;
          }
          img {
            height: 100%;
          }
        }
      }
      .rotation {
        margin-left: 90px;
        ::v-deep .h-album__btn {
          display: flex;
          align-items: center;
          button {
            height: 60%;
            width: 20px;
            border-radius: 10px;
            i {
              font-size: 18px;
            }
          }
        }
      }
    }
  }
}
</style>
