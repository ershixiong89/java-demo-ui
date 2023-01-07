<template>
  <el-drawer
    v-loading="loading"
    :visible.sync="showDrawer"
    :before-close="onDrawerClose"
    :element-loading-text="loadingText"
    class="qa-drawer qa-scroll-drawer user-create-drawer"
    @close="onDrawerClose"
  >
    <div slot="title" class="drawer-header-item">
      <h3>
        <svg-icon icon-class="create-simple" style="margin-right: 10px"/>
        {{ isCreate ? "Add A New User" : "Update User" }}
      </h3>
    </div>
    
    <div class="main-drawer-div">
      <div style="margin: 30px 20px">
        <el-form
          ref="userInfoFormRef"
          :model="userInfoForm"
          :rules="rules"
          label-width="150px"
          size="mini"
          label-position="left"
          class="qa-el-form"
        >
          <el-form-item label="Name:" prop="name">
            <el-input
              v-model="userInfoForm.name"
              placeholder="input user name"
              size="mini"
              clearable
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item label="Description:" prop="description">
            <el-input
              v-model="userInfoForm.description"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="input description for user"
              size="mini"
              clearable
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item>
            <div class="avatar-content">
              <el-avatar :src="getAvatar(userInfoForm.avatar)" :key="userInfoForm.avatar"></el-avatar>
              <el-upload
                  action="no"
                  :on-change="onFileChange"
                  :limit="1"
                  :auto-upload="false"
                >
                  <el-button size="mini" type="primary">点击上传</el-button>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="qa-commponent-footer">
      <el-button size="small" @click="showDrawer = false">Cancel</el-button>
      <el-button type="primary" size="small" @click="onSubmit">
        Submit
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
import { addUser, updateUser } from '@/api/java-demo/db'
import { uploadFile, getFile } from '@/api/java-demo/file'

export default {
  components: {
  },
  data() {
    return {
      showDrawer: false,
      isCreate: true,

      loading: false,
      loadingText: '',
      
      userInfoForm: {
        id: 0,
        name: '',
        description: '',
        avatar: 'avatar/avatar-3.png',
        createAt: ''
      },
      rules: {
        name: [{ required: true, message: "please input user name", trigger: "blur" }],
        description: [{ required: true, message: "please input description", trigger: "blur" }]
      },
      uploadFile: null,
      avatarImage: null
    }
  },
  computed: {},
  created() {
  },
  methods: {
    onDrawerInit(isCreate = true, originalData = {}) {
      this.onInitData()
      if (!isCreate) {
        this.userInfoForm = JSON.parse(JSON.stringify(originalData))
      }
      this.isCreate = isCreate
      this.showDrawer = true
    },
    onDrawerClose() {
      if (this.$refs["userInfoFormRef"]) {
        this.$refs["userInfoFormRef"].resetFields()
      }
      this.showDrawer = false
    },
    onInitData() {
      this.userInfoForm = {
        id: 0,
        name: '',
        description: '',
        avatar: 'avatar/avatar-3.png',
        createAt: ''
      }
    },
    getAvatar(fileName) {
      return `${process.env.VUE_APP_JAVA_DEMO_BASE_URL}/api/v1/file/get?fileName=${fileName}`
    },
    onFileChange(file, fileList) {
      // 判断文件名是否一致
      if (!file.name.endsWith('.png') && !file.name.endsWith('.jpeg')) {
        this.$message.error('please upload image')
        return false
      }
      this.uploadFile = file
      this.onUploadFile()
      return true
    },
    onUploadFile() {
      this.loading = true
      this.loadingText = 'uploading image...'
      // upload file first
      uploadFile(this.uploadFile.raw).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.$set(this.userInfoForm, 'avatar', res.data[0])
          this.$message.success('upload done')
        }
      }).catch(() => {
        this.loading = false
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    onSubmit() {
      this.$refs["userInfoFormRef"].validate(valid => {
        if (valid) {
          var tipTitle = `Are you sure to <span style="font-weight:bold">${this.isCreate ? 'CREATE' : 'UPDATE'}</span> this user ?`
          this.$confirm(tipTitle, 'Warning', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
            dangerouslyUseHTMLString: true
          }).then(() => {
            // update/create user
            this.loading = true
            this.loadingText = `${this.isCreate ? 'Creating' : 'Updating'} user...`
            const methodName = this.isCreate ? addUser : updateUser
            methodName(this.userInfoForm).then(res => {
              this.loading = false
              if (res.code === 200) {
                this.$message.success('Succeed')
                this.$emit('update')
                this.onDrawerClose()
              }
              else {
                this.$message.warning(res.message)
              }
            }).catch(() => {
              this.loading = false
            })
          })
        }
      })   
    }
  }
};
</script>

<style lang="scss">
@import "@/styles/el-dialog.scss";
@import "@/styles/qa-collapse.scss";
@import "@/styles/qa-form.scss";
@import "@/styles/el-drawer.scss";
@import "@/styles/extend.scss";

.user-create-drawer .el-drawer {
  width: 800px !important;

  .avatar-content {
    @include flexStyle(flex-start, center);
    .el-avatar  {
      margin-right: 50px;
    }
    .el-upload__text {
      font-size: 13px;
      color: $placheholderText;
    }
  }
}
</style>
