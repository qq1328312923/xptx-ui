<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container" style="margin: 10px 0 10px 0;">
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="handleAdd">添加部门</el-button>
      <el-tag>{{ defaultExpandAll ? '折叠' : '展开' }}</el-tag>
      <el-switch
        v-model="defaultExpandAll"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-value="true"
        :inactive-value="false"
      />
    </div>
    <!--表格树内容栏-->
    <tree-table :key="key" v-loading="loading" :default-expand-all="defaultExpandAll" :data="tableTreeData" :columns="columns" size="small">

      <template slot="createTime" slot-scope="{scope}">
        <span>{{ parseTime(scope.row.createTime) }}</span>
      </template>
      <template slot="operation" slot-scope="{scope}">
        <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </tree-table>
 
    <!-- 添加或修改对话框 -->
    <el-dialog :title="!dataForm.id ? '新增部门' : '修改部门'" :visible.sync="dialogFormVisible"  :close-on-click-modal="false">
       <el-form :model="dataForm"  ref="dataForm" :rules="dataRule" label-width="80px" size="small"  style="text-align:left;"> 
          <el-form-item label="机构名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入机构名称" />
          </el-form-item>
          <el-form-item label="上级机构" prop="parentName">
              <popup-tree-input
                :data="popupTreeData"
                :props="popupTreeProps"
                :prop="dataForm.parentName == null?'顶级菜单':dataForm.parentName"
                :node-key="''+dataForm.parentId"
                :current-change-handle="handleTreeSelectChange"
              />
          </el-form-item>
          <el-form-item label="排序编号" >
              <el-input-number v-model="dataForm.sort" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
       </el-form>
       <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
          <el-button size="small" type="primary" :loading="editLoading" @click="submitForm">确定</el-button>
       </div>
    </el-dialog>
  </div>
</template>

<script>
import PopupTreeInput from '@/components/PopupTreeInput'
import treeTable from '@/components/TreeTable'
import { saveDept, getDept, updateDept, deleteDept } from '@/api/dept'
import { parseTime } from '@/utils/index'

export default {
  components: { PopupTreeInput, treeTable },
  data() {
    return {
      //默认展开
      defaultExpandAll: true,
      //表单是否加载
      loading:false,
      //第几个作为id
      key: 1,
      //树形
      columns: [
        {
          label: '机构名称',
          key: 'name',
          expand: true
        },
        {
          label: '上级机构',
          key: 'parentName',
          width: 200,
          align: 'center'
        },
        {
          label: '排序',
          key: 'sort',
          align: 'center'
        },
        {
          label: '创建时间',
          key: 'createTime',
          align: 'center'
        },
        {
          label: '操作',
          key: 'operation'
        }
      ],
      //值
      tableTreeData: [],
      //编辑框是否显示
      dialogFormVisible:false,
      //表单标签
      formLabelWidth: '120px',
      dataForm: {
        id:null,
        name:'',
        parentId:null,
        parentName:'',
        sort:0,
      },
      // 表单校验
      dataRule: {
        name: [
          { required: true, message: '机构名称不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级机构不能为空', trigger: 'change' }
        ]
      },
      //上级部门选择框
      popupTreeData: [],
      popupTreeProps: {
        label: 'name',
        children: 'children'
      },
      //确定按钮圆圈加载
      editLoading:false
    }
  },
  created() {
    this.getDeptTreeList()
  },
  methods: {
    parseTime,
    //重置表单内容
    resertForm:function(){
      this.dataForm = {
        id:null,
        name:'',
        parentId:null,
        parentName:'',
        sort:0,
      }
    },
    //增加部门
    handleAdd:function(){
      this.dialogFormVisible = true
      this.resertForm();
    },
    //编辑部门
    handleEdit:function(row){
      this.dialogFormVisible = true
      this.dataForm.id = row.id
      this.dataForm.name = row.name
      this.dataForm.parentId = row.parentId
      this.dataForm.sort = row.sort
      this.dataForm.parentName = row.parentName
      if(row.parentId==0){
        this.dataForm.parentName='顶级菜单'
      }
    },
    //删除部门
    handleDelete:function(row){
      let that = this;
       this.$confirm('此操作将把部门删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteDept(row.id).then(res=>{
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              that.getDeptTreeList()
            } else {
              this.$message({ message: res.data.msg, type: 'error' })
            }
          }).catch(function (error) {
              that.$message({
                type: 'error',
                message: '删除失败'
              })          
          });
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //得到编辑变的下拉树 加个顶级
    getParentTree:function(children){
      const parent = {
        id:0,
        name:'顶级菜单',
        sort:0,
        children:children
      }
      return [parent];
    },
    //得到部门树列表
    getDeptTreeList:function(){
      this.loading = true
      getDept().then(res => {
          this.tableTreeData = res.data.data
          this.popupTreeData = this.getParentTree(res.data.data)
          this.loading = false
      })
    },
    //得到编辑下拉框选择
    handleTreeSelectChange: function(data){
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.name
    },
    //提交表单
    submitForm:function(){
      this.$refs['dataForm'].validate((valid) => {
          if (valid) {
              this.$confirm('确认提交吗？', '提示', {}).then(() => {
                //有id就是新增
                this.editLoading = true;
                if(this.dataForm.id){
                     updateDept(this.dataForm).then((res)=>{
                      if (res.data.code === 200) {
                        this.$message({ message: '操作成功', type: 'success' })
                      } else {
                        this.$message({ message: res.data.msg, type: 'error' })
                      }
                      this.editLoading = false;
                      this.$refs['dataForm'].resetFields();
                      this.dialogFormVisible = false;
                      this.getDeptTreeList();
                    });
                }else{
                    saveDept(this.dataForm).then((res)=>{
                      if (res.data.code === 200) {
                        this.$message({ message: '操作成功', type: 'success' })
                      } else {
                        this.$message({ message: res.data.msg, type: 'error' })
                      }
                      this.editLoading = false;
                      this.$refs['dataForm'].resetFields();
                      this.dialogFormVisible = false;
                      this.getDeptTreeList();
                    });
                }
             });
          }
      });
    }
  }
}
</script>
<style>
</style>
