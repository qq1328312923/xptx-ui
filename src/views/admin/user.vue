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
          <div class="filter-container">
               <el-input
                  v-model="keyword"
                  clearable
                  placeholder="请输入用户名"
                  size="small"
                  prefix-icon="el-icon-search"
                  class="filter-item"
                  style=" width: 200px;"
                />
                <el-button class="filter-item" type="primary" icon="el-icon-search" size="mini" @click="handleSearch">查找
                </el-button>
                <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleAdd">添加
                </el-button>
          </div>
          <el-table  v-loading="loading" :data="tableData" style="width: 100%" size="mini">
              <el-table-column label="序号" width="60" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

               <el-table-column label="用户名" width="80" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>

          <el-table-column label="手机号" width="100" align="center" sortable>
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>

          <el-table-column label="邮箱" width="160" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.email }}</span>
            </template>
          </el-table-column>

          <el-table-column label="部门 / 岗位" width="130" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.deptName }} / {{ scope.row.jobName }}</div>
            </template>
          </el-table-column>

          <el-table-column label="拥有角色" width="200" align="center">
            <template slot-scope="scope">
              <el-tag v-for="item in scope.row.roleList" :key="item.roleId" type="success" style="margin-right: 5px;">
                {{ item.roleName }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="状态" width="70" align="center">
            <template slot-scope="scope">
              <div v-for="item in dicts" :key="item.id">
                <el-tag v-if="scope.row.status.toString() === item.value" :type="scope.row.status ? '' : 'info'">
                  {{item.label }}
                </el-tag>
              </div>
            </template>

          </el-table-column>

          <el-table-column label="操作" fixed="right" min-width="120" align="center">
            <template slot-scope="scope">
              <!--<el-button @click="handRest(scope.row)" type="warning" size="small">重置密码</el-button>-->
              <el-button size="mini" icon="el-icon-edit"  >编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete"  >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 添加或修改对话框 -->
        <el-dialog :title="operation?'新增用户':'编辑用户'" :visible.sync="dialogFormVisible" center>
             <el-form :model="dataForm" label-width="80px" size="small" label-position="right">
                <el-form-item label="用户名" :label-width="formLabelWidth" required>
                  <el-input v-model="dataForm.username" auto-complete="off" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                  <el-input v-model="dataForm.email" auto-complete="off" placeholder="请输入邮箱" />
                </el-form-item>

                <el-form-item label="手机" :label-width="formLabelWidth">
                  <el-input v-model="dataForm.phone" auto-complete="off" placeholder="请输入手机" />
                </el-form-item>
                

                <el-form-item label="部门" :label-width="formLabelWidth">
                  <popup-tree-input
                    :data="deptData"
                    :props="deptTreeProps"
                    :prop="dataForm.deptName"
                    :node-key="''+dataForm.deptId"
                    :current-change-handle="deptTreeCurrentChangeHandle"
                  />
                </el-form-item>

             </el-form>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { getUserList } from '@/api/user'
  import { getRoleList } from '@/api/roles'
  import { getDept } from '@/api/dept'
  import initDict from '@/mixins/initDict'
  import PopupTreeInput from '@/components/PopupTreeInput'

  export default {
     //注册组件
     components: {
       PopupTreeInput
     },
     mixins: [initDict],
     data() {
        return {
          deptData: [],
          deptTreeProps: {
            label: 'name',
            children: 'children'
          },
          //搜索数据
          filterText:'',
          //加载图表
          loading: false,
          //用户列表
          tableData:[],
          roles: [], // 角色列表
          currentPage: 1,
          pageSize: 10,
          total: 0, // 总数量
          deptId: 0,
          keyword: '',
          //弹框显示的标题
          operation: false, // true:新增, false:编辑
          dialogFormVisible: false, // 控制弹出框
          //表单标签
          formLabelWidth: '120px',
          dataForm: {
            username: '',
            avatar: '',
            deptId: 1,
            deptName: '',
            jobId: 0,
            email: 'qq1328312923@163.com',
            phone: '15728046328',
            lockFlag: '' + 0,
            roleList: []
          },
        }
     },
     created() {
        this.findDeptTree()
        this.adminList()
        this.findUserRoles()
        // 加载数据字典
        this.getDict('user_status')
     },
     methods: {
        // 加载用户角色信息
        findUserRoles: function() {
          const params = new URLSearchParams()
          params.append('roleName', '')
          getRoleList(params).then((res) => {
            this.roles = res.data.data
          })
        },
        // 加载部门列表
        findDeptTree: function() {
          getDept().then((res) => {
            this.deptData = res.data.data
          })
        },
         // 加载用户列表
        adminList: function() {
          this.loading = true
          const params = new URLSearchParams()
          params.append('current', this.currentPage)
          params.append('size', this.pageSize)
          params.append('deptId', this.deptId)
          params.append('username', this.keyword)
          getUserList(params).then(response => {
            this.loading = false
            this.tableData = response.data.data.records
            this.total = response.data.data.total
          })
        },
        //部门树点击事件
        handleNodeClick:function(data){
          this.deptId = data.id === 0 ? 0 : data.id
          this.adminList()
        },
        //处理搜索
        handleSearch:function(){
          this.adminList()
        },
        //处理添加
        handleAdd:function(){
          this.dialogFormVisible = true
        },
         // 部门菜单树选中
        deptTreeCurrentChangeHandle(data) {
          this.dataForm.deptId = data.deptId
          this.dataForm.deptName = data.name
          // this.getJobs(data.deptId)
        },
     }
  }
</script>