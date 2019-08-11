<template>
  <div class="app-container">
     <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4"> 
          <div class="head-container">
                <el-input
                  v-model="filterText"
                  placeholder="输入部门名称搜索"
                  size="small"
                  prefix-icon="el-icon-search"
                  class="filter-item"
                  style="margin-bottom: 20px"
                />
                <el-tree :data="deptData" :props="deptTreeProps" 
                :expand-on-click-node="false"
                :default-expand-all="true"
                @node-click="handleNodeClick"
                ></el-tree>

          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20"> 
            <!-- 查询和其他操作 -->
            <div class="filter-container" style="margin: 10px 0 10px 0;">
              <el-input
                v-model="keyword"
                clearable
                class="filter-item"
                style="width: 200px;"
                size="small"
                placeholder="请输入角色名称"
                @keyup.enter.native="handleSearch"
              />
              <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleSearch">查找
              </el-button>
              <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="handleAdd">添加角色</el-button>
            </div>

            <el-table v-loading="loading" :data="tableData" style="width: 100%" size="mini">

              <!-- <el-table-column type="selection" /> -->
              <el-table-column label="序号" width="60" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column label="角色名称" width="200" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.roleName }}</span>
                </template>
              </el-table-column>

              <el-table-column label="角色标识" width="200" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.roleCode }}</span>
                </template>
              </el-table-column>

              <el-table-column label="角色介绍" width="200" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.roleDesc }}</span>
                </template>
              </el-table-column>

              <el-table-column label="创建时间" width="160" align="center" prop="createTime">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
              </el-table-column>

              <el-table-column label="操作" fixed="right" min-width="150" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" icon="el-icon-edit"  @click="handleEdit(scope.row)"  >编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" >删除</el-button>
                </template>
              </el-table-column>
            </el-table>

        </el-col>
     </el-row>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="!dataForm.id?'新增角色':'编辑角色'" :visible.sync="dialogFormVisible"  :close-on-click-modal="false">
        <el-form :model="dataForm"  ref="dataForm" :rules="dataRule" label-width="80px" size="small"  style="text-align:left;"> 
          <el-form-item label="部门名称" >
            <el-input v-model="dataForm.deptName"  :disabled="true" />
          </el-form-item>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="dataForm.roleName" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="角色标识" prop="roleCode">
            <el-input v-model="dataForm.roleCode" placeholder="请输入角色标识" />
          </el-form-item>
          <el-form-item label="角色介绍" prop="roleDesc">
            <el-input v-model="dataForm.roleDesc" placeholder="请输入角色介绍" />
          </el-form-item>
          <el-form-item label="数据范围" prop="roleDesc">
            <el-select v-model="dataForm.dsType" placeholder="请选择数据范围" style="width: 100%" @change="changeScope">
              <el-option
                v-for="item in dsTypes"
                :key="item.id"
                :label="item.desc"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-if="dataForm.dsType === 4" label="数据权限">
            <treeselect v-model="deptIds"  :options="dialogDeptData" :multiple="true"  placeholder="请选择" />
          </el-form-item>

          <el-form-item label="访问菜单"  >
            <el-tree
              ref="menuTree"
              v-loading="menuLoading"
              :data="menuData"
              size="mini"
              show-checkbox
              node-key="id"
              :props="deptTreeProps"
              element-loading-text="拼命加载中"
              :check-strictly="true"
              @check-change="handleMenuCheckChange"
            />

            <div style="padding-left:24px;padding-top:12px;">
              <el-checkbox v-model="checkAll" :disabled="false" @change="handleCheckAll"><b>全选</b></el-checkbox>
            </div>
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
import { getRoleList, addRole, updateRole, deleteRole, findRoleMenus,getDsTypes } from '@/api/roles'
import { getMenus } from '@/api/menu'
import { parseTime } from '@/utils/index'
import { getDeptTree,getDept } from '@/api/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: {
    Treeselect
  },
  data() {
    return {
      //树形的过滤
      filterText:'',
      //搜索关键词
      keyword:'',
      //表格属性
      tableData:[],
      //左侧属性下拉框的值
      deptData:[],
      //编辑框树形的值
      dialogDeptData:[],
      loading:true,
      dialogFormVisible:false,
      dataForm:{
        id : null,
        deptId:null,
        deptName:'',
        roleName:'',
        roleCode:'',
        roleDesc:'',
        dsType:null,
        dsScope:null
      },
      // 表单校验
      dataRule: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '角色介绍不能为空', trigger: 'blur' }],
        roleCode: [{ required: true, message: '角色标识不能为空', trigger: 'blur' }],
        roleCode: [{ required: true, message: '角色标识不能为空', trigger: 'blur' }]
      },
      dsTypes:[
        
      ],
      //角色可以选择的部门
      deptIds:[],
      //树形组件label
      deptTreeProps: {
        label: 'name',
        children: 'children'
      },
      
      editLoading:false,
      //菜单加载
      menuLoading:false,
      menuData:[],
      checkAll:false
    }
  },
  created() {
    this.getOutDeptTree()
    this.findTreeData()
  },
  methods: {
    parseTime,
    handleNodeClick:function(data){
      this.dataForm.deptId = data.id === 0 ? 0 : data.id
      this.dataForm.deptName = data.name;
      this.roleList()
    },
    // 获取菜单树
    findTreeData: function() {
      this.menuLoading = true
      getMenus().then((res) => {
        this.menuData = res.data.data
        this.menuLoading = false
      })
    },
    // 树节点选择监听
    handleMenuCheckChange(data, check) {
      if (check) {
        // 节点选中时同步选中父节点
        const parentId = data.parentId
        this.$refs.menuTree.setChecked(parentId, true, false)
      } else {
        // 节点取消选中时同步取消选中子节点
        if (data.children != null) {
          data.children.forEach(element => {
            this.$refs.menuTree.setChecked(element.id, false, false)
          })
        }
      }
    },
    // 全选操作
    handleCheckAll() {
      if (this.checkAll) {
        const allMenus = []
        this.checkAllMenu(this.menuData, allMenus)
        this.$refs.menuTree.setCheckedNodes(allMenus)
      } else {
        this.$refs.menuTree.setCheckedNodes([])
      }
    },
    // 递归全选
    checkAllMenu(menuData, allMenus) {
      menuData.forEach(menu => {
        allMenus.push(menu)
        if (menu.children) {
          this.checkAllMenu(menu.children, allMenus)
        }
      })
    },
    // 获取角色
    roleList: function() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('roleName', this.keyword)
      params.append('deptId', this.dataForm.deptId)
      getRoleList(params).then(response => {
        this.tableData = response.data.data
        this.loading = false
      })
    },
    //搜索
    handleSearch:function(){
      this.roleList()
    },
    //新增
    handleAdd:function(){
      this.dialogFormVisible = true
      this.resetForm()
      this.getDsTypes()
      this.handleCheckAll()
    },
    //编辑
    handleEdit:function(row){
      this.dataForm.id = row.id
      this.dataForm.roleName = row.roleName
      this.dataForm.roleCode = row.roleCode
      this.dataForm.roleDesc = row.roleDesc
      this.dataForm.dsType = row.dsType
      this.dataForm.dsScope = row.dsScope
      this.getDsTypes()
      this.dialogFormVisible = true
      this.handleRoleSelectChange(row.id)
    },
    // 角色选择改变监听
    handleRoleSelectChange(id) {
      findRoleMenus(id).then((res) => {
        this.$refs.menuTree.setCheckedNodes(res.data.data)
      })
    },
    //删除
    handleDelete:function(row){
      let that = this;
      this.$confirm('此操作将把部门删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
          deleteRole(row.id).then(res=>{
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              that.roleList()
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
    //重置表单
    resetForm:function(){
      this.dataForm.id = null
      this.dataForm.roleName = ''
      this.dataForm.roleCode = ''
      this.dataForm.roleDesc = ''
      this.dataForm.dsType = null
      this.dataForm.dsScope = null
       this.dataForm.roleMenus = []
    },
    //更改数据范围类型
    changeScope:function(data){
      this.deptIds = []
      if (this.dataForm.dsType === 4) {
        this.getInDeptTree()
      }    
    },
    //得到外层点击
    getOutDeptTree:function(){
      getDept().then((res) => {
        this.deptData = res.data.data
        if(res.data.data!=null && res.data.data[0]!=null){
          this.dataForm.deptId = res.data.data[0].id
          this.dataForm.deptName = res.data.data[0].name
          this.roleList()
        }
      })
    },
    //得到内层编辑
    getInDeptTree: function() {
       getDeptTree(this.dataForm.deptId).then((res) => {
        this.dialogDeptData = res.data.data
      })
    },
    //得到数据类型
    getDsTypes:function(){
      getDsTypes(this.dataForm.deptId).then((res) =>{
        this.dsTypes = res.data.data
      });
    },
    //提交表单
    submitForm:function(){
        const checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true)
        const roleMenus = []
        for (let i = 0, len = checkedNodes.length; i < len; i++) {
          const roleMenu = { roleId: null, menuId: checkedNodes[i].id }
          roleMenus.push(roleMenu)
        }
        this.dataForm.roleMenus = roleMenus 

       this.$refs['dataForm'].validate((valid) => {
          if (valid) {
              this.$confirm('确认提交吗？', '提示', {}).then(() => {
                //有id就是新增
                this.editLoading = true;
                if(this.dataForm.id){
                  updateRole(this.dataForm).then(res => {
                    if (res.data.code === 200) {
                      this.$message({
                        type: 'success',
                        message: '操作成功'
                      })
                      this.dialogFormVisible = false
                      this.roleList()
                    } else {
                      this.$message({
                        type: 'error',
                        message: response.data.msg
                      })
                    }               
                    this.editLoading = false;     
                  })
                }else{
                  addRole(this.dataForm).then(res => {
                      if (res.data.code === 200) {
                        this.$message({
                          type: 'success',
                          message: '操作成功'
                        })
                        this.dialogFormVisible = false
                        this.roleList()
                      } else {
                        this.$message({
                          type: 'error',
                          message: response.data.msg
                        })
                      }
                      this.editLoading = false;
                  })
                }
              })
          }
       });
    }
  }
}
</script>
