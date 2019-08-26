<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="个人信息" name="first">
        <el-form :label-position="labelPosition" label-width="80px" :model="personForm">
           <el-form-item label="头像">
            <el-upload
              action=" 123"
              v-loading="loading"
              class="avatar-uploader"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="personForm.avatar" :src="personForm.avatar" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="personForm.nickName"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="personForm.username" :disabled="true"></el-input>
          </el-form-item>
        
          <el-form-item label="手机号">
            <el-input v-model="personForm.phone" :disabled="true"></el-input>
          </el-form-item>
           <el-form-item label="邮箱">
            <el-input v-model="personForm.email" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="所属部门">
            <el-input v-model="personForm.phone" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="userInfoSubmit">确定</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="second">
        <el-form :label-position="labelPosition" label-width="80px" :model="passWordForm" :rules="passWodRules" ref="passWordForm">
          <el-form-item label="原密码" prop="oldPass">
            <el-input v-model="passWordForm.oldPass" ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="newPass">
            <el-input v-model="passWordForm.newPass" ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="newPassCheck">
            <el-input v-model="passWordForm.newPassCheck" ></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="passWordSubmit">确定</el-button>
              <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改邮箱" name="third">
        <el-form :label-position="labelPosition" label-width="80px" :model="emailForm"  ref="emailForm">
          <el-form-item 
          label="邮箱"  
          prop="email"
          :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
                       { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
              <el-input v-model="emailForm.email" style="width: 250px;" />
              <el-button :loading="codeLoading"  @click="sendCode">发送验证码</el-button>
          </el-form-item>
          <el-form-item  
          label="验证码"
          prop="code"
          :rules="[{ required: true, message: '验证码不能为空'}]"
          >
            <el-input v-model="emailForm.code" ></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="emailSubmit">确定</el-button>
              <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import store from '@/store';
import {
   updatePass, sendMailCode, updateEmail,  uploadAvatar, editUserInfo
} from "@/api/user";
import { getUserInfo } from '@/api/login'

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value !== this.passWordForm.newPass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      //上传loading
      loading: false,
      //活动的tab页
      activeName: "first",
      //表单对齐方式
      labelPosition: "right",
      //验证码发送loading
      codeLoading:false,
      personForm: {
        nickName: "",
        username: "",
        phone: "",
        deptName: "",
        email: "",
        avatar:"https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
      },
      passWordForm: {
        oldPass:"",
        newPass:"",
        newPassCheck:""
      },
      emailForm:{
        email:"",
        code:""
      },
      passWodRules:{
        oldPass:[
          {required: true, message: '请输入原密码', trigger: 'blur'}
        ],
        newPass:[
          {required: true, message: '请输入新密码', trigger: 'blur'},
          { min: 6, message: '长度在6个字符以上', trigger: 'blur' }
        ],
        newPassCheck:[
          {required: true, message: '请输入确认密码', trigger: 'blur'},
          { min: 6, message: '长度在6个字符以上', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    //上面tab点击事件
    handleClick:function(){},
    //得到用户详情
    getUserInfo: function(){
      getUserInfo().then((response)=>{
        this.personForm.nickName = response.data.data.nickName;
        this.personForm.username = response.data.data.name;
        this.personForm.phone = response.data.data.phone;
        this.personForm.deptName = response.data.data.deptName;
        this.personForm.email = response.data.data.email;
        this.personForm.avatar = response.data.data.avatar;
      });
    },
    //头像上传处理
    beforeAvatarUpload(file) {
      this.loading = true;
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      if (isJPG && isLt2M) {
        let data = new FormData();
        data.append("file", file);
        uploadAvatar(data).then(response => {
          this.personForm.avatar = response.data.data;
          this.loading = false;
        }).catch(()=>{
          this.$message({
            type:"error",
            message:"上传头像失败"
          })
          this.loading = false;
        });
 
      }
      return isJPG && isLt2M;
    },
    //更新用户详情
    userInfoSubmit:function(){
      const data = {}
      data["avatar"] = this.personForm.avatar
      data["nickName"] = this.personForm.nickName
      //更新用户
      editUserInfo(data).then((response)=>{
        this.$message({
            type:"success",
            message:"更新用户信息成功"
          })
        //更新成功的话  重新获取缓存和重新获取用户信息
        this.getUserInfo();
        store.dispatch('GetUserInfo');
      })
    },
    passWordSubmit:function(){
      //更新用户
      updatePass(this.passWordForm).then((response)=>{
        this.$message({
            type:"success",
            message:"修改密码成功"
        })
        this.$refs["passWordForm"].resetFields();
      })
    },
    //发送验证码
    sendCode:function(){
      sendMailCode(this.emailForm.email).then((response)=>{
        this.$message({
            type:"success",
            message:"发送验证码成功"
        })
      })
    },
    //更新邮箱
    emailSubmit:function(){
      updateEmail(this.emailForm).then((response)=>{
        this.$message({
            type:"success",
            message:"更新邮箱成功"
        })
        this.personForm.email = this.emailForm.email
        this.$refs["emailForm"].resetFields();
      })
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>