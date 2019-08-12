<template>
  <div class="app-container">
    <div class="filter-container" style="margin:10px 0px 10px 0px">
      <el-input v-model="filterText" clearable class="filter-item" 
      style="width:200px" size="small" placeholder="请输入岗位名称" @keyup.enter.native="handleSearch"></el-input>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleSearch">查找</el-button>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
    </div>

    <el-table v-loading="loading" :data="tableData" style="width: 100%" size="mini">
      <el-table-column type="selection" />
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="岗位名称" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jobName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="所属部门" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="排序" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="160" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" min-width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="block">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>

    <!--修改或编辑框-->
    <el-dialog :title="!dataForm.id ? '新增岗位' : '修改岗位'" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px"  size="small"  style="text-align:left;">
        <el-form-item label="岗位名称"  prop="jobName">
          <el-input v-model="dataForm.jobName" auto-complete="off" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="所属部门" >
          <popup-tree-input
            :data="deptData"
            :props="deptTreeProps"
            :prop="dataForm.deptName"
            :node-key="''+dataForm.deptId"
            :current-change-handle="deptTreeCurrentChangeHandle"
          />
        </el-form-item>
        <el-form-item label="排序" >
          <el-input-number
            v-model="dataForm.sort"
            controls-position="right"
            :min="0"
            label="排序编号"
          />
        </el-form-item>

      </el-form>
      <div slot="footer"  class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getJobList, addJob, updateJob, deleteJob } from '@/api/job'
import PopupTreeInput from '@/components/PopupTreeInput'
import { parseTime } from '@/utils/index'
import { getDept } from '@/api/dept'

export default {
  components: {
    PopupTreeInput
  },
  data() {
    return {
      filterText:'',
      loading:false,
      tableData:[],
      currentPage: 1,
      pageSize: 10,
      total: 0, // 总数量
      // 分类菜单列表
      deptData: [],
      // tree配置项
      deptTreeProps: {
        label: 'name',
        children: 'children'
      },
      dialogFormVisible:false,
      dataForm:{
        id:null,
        jobName:'',
        deptId:null,
        sort:0,
        deptName: ''
      },
      dataRule:{
        jobName: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }]
      },

    }
  },
  created() {
    this.getJobList()
    this.findDeptTree()
  },
  methods: {
    parseTime,
    // 换页
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.getJobList()
    },
    handleSearch:function(){
      this.getJobList()
    },
    handleAdd:function(){
      this.dialogFormVisible = true
      this.dataForm.id = null
      this.dataForm.jobName = ''
      this.dataForm.deptId = null
      this.dataForm.sort = 0,
      this.dataForm.deptName = ''
    },
    handleEdit:function(row){
      this.dialogFormVisible = true
      this.dataForm.id = row.id
      this.dataForm.jobName = row.jobName
      this.dataForm.deptId = row.deptId
      this.dataForm.sort = row.sort
      this.dataForm.deptName = row.deptName
    },
    handleDelete:function(row){
        this.$confirm('此操作将把岗位删除, 是否继续？', '提示', {}).then(() => {
          deleteJob(row.id).then(res=>{
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.getJobList()
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
        });
    },
    //得到岗位列表
    getJobList:function(){
      this.loading = true
      const params = new URLSearchParams()
      params.append('page', this.currentPage)
      params.append('pageSize', this.pageSize)
      params.append('jobName', this.filterText)
      getJobList(params).then(response => {
        this.loading = false
        this.tableData = response.data.data.records
        this.total = response.data.data.total
      })
    },
    // 加载部门列表
    findDeptTree:function(){
      getDept().then((res) => {
        this.deptData = res.data.data
      })
    },
    //选择树形下拉框
    deptTreeCurrentChangeHandle:function(data){
      this.dataForm.deptId = data.id
      this.dataForm.deptName = data.name
    },
    //提交表单
    submitForm:function(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              //有id就是新增
              this.editLoading = true;
              debugger;
              if(this.dataForm.id){
                  updateJob(this.dataForm).then((res)=>{
                    if (res.data.code === 200) {
                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({ message: res.data.msg, type: 'error' })
                    }
                    this.editLoading = false;
                    this.$refs['dataForm'].resetFields();
                    this.dialogFormVisible = false;
                    this.getJobList();
                  });    
              }else{
                  addJob(this.dataForm).then((res)=>{
                    if (res.data.code === 200) {
                      this.$message({ message: '操作成功', type: 'success' })
                    } else {
                      this.$message({ message: res.data.msg, type: 'error' })
                    }
                    this.editLoading = false;
                    this.$refs['dataForm'].resetFields();
                    this.dialogFormVisible = false;
                    this.getJobList();
                  });    
              }
            })
        }
      })
    },
  }
}
</script>
