<template>
  <div class="app-container">
   <div class="filter-container" style="margin:10px 0px 10px 0px">
      <!-- 搜索 -->
      <el-input
        v-model="userName"
        clearable
        placeholder="输入操作人"
        style="width: 200px;"
        class="filter-item"
      />
       <!-- 搜索 -->
      <el-input
        v-model="description"
        clearable
        placeholder="输入描述"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="handleBatchDelete"
      >批量删除
      </el-button>
   </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="tableData" style="width: 100%" size="mini" @selection-change="handleSelectionChange">
      <el-table-column type="selection"  />

      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作人" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="描述" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column label="IP" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.requestIp }}</span>
        </template>
      </el-table-column>

      <el-table-column label="请求方式" width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.requestMethod }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求URL" width="160" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.actionUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求时间(毫秒)" width="80" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.consumingTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" header-align="center" width="185" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
     <!--分页-->
    <div class="block">
      <el-pagination
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, prev, pager, next,sizes, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

  </div>
</template>

<script>
import { getLogList, deleteLog } from '@/api/log'
import { parseTime } from '@/utils/index'

export default {

  data() {
    return {
      //搜索的用户名
      userName:'',
      //搜索的描述
      description:'',
      // 日志列表
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0, // 总数量
      keyword: '',
      loading: false,
      multipleSelection:[],//表格选中的值
    }
  },
  created() {
    this.logList()
  },
  methods: {
    parseTime,
    logList: function() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('page', this.currentPage)
      params.append('pageSize', this.pageSize)
      params.append('type', 1)

      params.append('userName', this.userName)
      params.append('description', this.description)

      getLogList(params).then(response => {
        this.loading = false
        this.tableData = response.data.data.records
        this.total = response.data.data.total
      })
    },
    // 搜索
    handleSearch: function() {
      this.logList()
    },

    // 查看
    handleView: function(row) {
      this.errorInfo = row.exDetail
      this.dialog = true
    },
    deleteLog(datas){
        deleteLog(datas).then(response => {
        if (response.data.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.logList()
        } else {
          this.$message({
            type: 'error',
            message: response.data.msg
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 批量删除日志
     */
    handleBatchDelete:function(){
      let datas = [];
      this.multipleSelection.forEach(n=>{
        if(n!=null){
          datas.push(n.id);
        }
      })
      this.deleteLog(datas);
    },
    /**
     * 删除日志
     * @param row
     */
    handleDelete: function(row) {
      const that = this
      this.$confirm('此操作将该日志删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var attr = [];
          attr.push(row.id);
          this.deleteLog(attr);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 换页
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.logList()
    },
    // 换页数
    handleSizeChange(val) {
      this.pageSize = val
      this.logList()
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
  .uploadImgBody :hover {
    border: dashed 1px #00ccff;
  }
  img {
    width: 100px;
    height: 100px;
  }
</style>
