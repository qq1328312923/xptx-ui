<template>
  <div class="app-container">
    <div class="filter-container" style="margin:10px 0px 10px 0px">

      <!-- 搜索 -->
      <el-input
        v-model="query.value"
        clearable
        placeholder="输入搜索内容"
        style="width: 200px;"
        class="filter-item"
      />
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="handleAdd"
      >新增
      </el-button>
    </div>

    <!--表格渲染-->
    <el-table v-loading="loading" :data="tableData" size="small" style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" prop="name" label="名称" />
      <el-table-column :show-overflow-tooltip="true" prop="description" label="描述" />
      <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注" />
      <el-table-column label="创建时间"  prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button slot="reference" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popover
            :ref="scope.row.name"
            placement="top"
            width="180"
          >
            <p>此操作将删除字典与对应的字典详情，确定要删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.name].doClose()">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDelete(scope.row.id,'1')">确定
              </el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popover>
          <el-button slot="reference" type="primary" size="mini" @click="handleChange(scope.row.name)">字典值</el-button>
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

    <!-- 详情页-->
    <el-dialog :append-to-body="true" :visible.sync="detailDialog" title="字典详情" width="800px">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleDetailAdd"
        >新增
        </el-button>
        <div>
          <!--表格渲染-->
          <el-table v-loading="dictDetailLoading" :data="dictDetailData" size="small" style="width: 100%;">
              <el-table-column prop="label" label="字典标签" />
              <el-table-column prop="value" label="字典值" />
              <el-table-column prop="sort" label="排序" />
              <el-table-column label="操作" width="140px" align="center">

                <template slot-scope="scope">
                  <el-button slot="reference" size="mini" @click="handleDetailEdit(scope.row)">编辑</el-button>
                  <el-popover
                    :ref="scope.row.id"
                    placement="top"
                    width="120"
                  >
                    <p>确定删除本条数据吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                      <el-button type="primary" size="mini" @click="handleDelete(scope.row.id,'2')">确定
                      </el-button>
                    </div>
                    <el-button slot="reference" type="danger" size="mini">删除</el-button>
                  </el-popover>
                </template>
              </el-table-column>  
          </el-table>
        </div>
    </el-dialog>

    <!--修改或编辑框-->
    <el-dialog :title="!dataForm.id ? '新增字典' : '编辑字典'" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="80px"  size="small"  style="text-align:left;">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="dataForm.name" style="width: 370px;" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="dataForm.description" style="width: 370px;" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dataForm.remark" style="width: 370px;" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogFormVisible = false">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submitForm('1')">确认</el-button>
      </div>
    </el-dialog>


    <!--修改或编辑框-->
    <el-dialog :title="!dataForm.id ? '新增字典详情' : '编辑字典详情'" :visible.sync="dialogDetailFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="dataForm" :rules="drules" label-width="80px"  size="small"  style="text-align:left;">
        <el-form-item label="字典标签" prop="label">
          <el-input v-model="dataForm.label" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="字典值" prop="value">
          <el-input v-model="dataForm.value" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model.number="dataForm.sort" :min="0" :max="999" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogFormVisible = false">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submitForm('2')">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveDict, getDict, updateDict, deleteDict, getDictDetail, deleteDictByName } from '@/api/dict'
import { deepClone, parseTime } from '@/utils/index'

export default {
  data() {
    return {
      //搜索
      query: {
        type: '',
        value: ''
      },
      dictName:'',
      //表格数据
      tableData:[],
      //表格加载
      loading:true,
      currentPage: 1,
      pageSize: 10,
      total: 0, // 总数量
      //详情是否显示
      detailDialog:false,
      dialogFormVisible:false,
      dialogDetailFormVisible:false,
      dictDetailLoading:false,
      //数据字典详情数据
      dictDetailData:[],
      //搜索框类型选项
      queryTypeOptions: [
        { key: 'name', display_name: '字典名称' },
        { key: 'remark', display_name: '描述' }
      ],
      dataForm: {
        id: null,
        name: null,
        label: null,
        value: null,
        sort: 0,
        description: null,
        remark: null
      },
      rules: {
        name: [
          { required: true, message: '字典名称不为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '描述不为空', trigger: 'blur' }
        ]
      },
      drules: {
        label: [
          { required: true, message: '字典标签不为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '字典值不为空', trigger: 'blur' }
        ]
      },
    }
  },
  created() {
    this.getDictList()
  },
  methods: {
    parseTime,
    // 获取字典详情
    getDictList: function() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('page', this.currentPage)
      params.append('pageSize', this.pageSize)
      params.append('detailName', '')
      params.append('type', this.query.type)
      params.append('value', this.query.value)
      getDict(params).then(res => {
        this.tableData = res.data.data.records
        this.total = res.data.data.total
        this.loading = false
      })
    },
    //处理分页
    handleCurrentChange:function(val){
      this.currentPage = val
      this.getDictList()
    },
    //处理搜索
    handleSearch:function(){
      this.getDictList();
    },
    //处理编辑
    handleEdit:function(row){
      this.dialogFormVisible = true
      this.dataForm.id = row.id
      this.dataForm.name = row.name
      this.dataForm.label = row.label
      this.dataForm.value = row.value
      this.dataForm.sort = row.sort
      this.dataForm.description = row.description
      this.dataForm.remark = row.remark
    },
    //处理新增
    handleAdd:function(){
      this.dialogFormVisible = true
      this.dataForm.id = null
      this.dataForm.name = null
      this.dataForm.label = null
      this.dataForm.value = null
      this.dataForm.sort = 0
      this.dataForm.description = null
      this.dataForm.remark = null
    },
    //处理删除
    handleDelete:function(id,type){
      deleteDict(id).then(res=>{
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          if(type=='1'){
            this.getDictList()
          }else{
            this.getDictDetailList()
          }
        } else {
          this.$message({ message: res.data.msg, type: 'error' })
        }
      });
    },
    //处理字典详情新增
    handleDetailAdd:function(){
      this.dialogDetailFormVisible = true
      this.dataForm.id = null
      this.dataForm.name = this.dictName
      this.dataForm.label = null
      this.dataForm.value = null
      this.dataForm.sort = 0
      this.dataForm.description = null
      this.dataForm.remark = null
    },
    //处理字典详情编辑
    handleDetailEdit:function(row){
      this.dialogDetailFormVisible = true
      this.dataForm.id = row.id
      this.dataForm.name = this.dictName
      this.dataForm.label = row.label
      this.dataForm.value = row.value
      this.dataForm.sort = row.sort
      this.dataForm.description = row.description
      this.dataForm.remark = row.remark
    },
    //根据name得到字典子集
    handleChange:function(name){
      this.dictName = name
      this.detailDialog = true
      this.getDictDetailList()
    },
    // 获取字典详情List
    getDictDetailList: function() {
      this.dictDetailLoading = true
      const params = new URLSearchParams()
      params.append('page', 0)
      params.append('pageSize', 100)
      params.append('detailName', this.dictName)
      params.append('type', '')
      params.append('value', '')
      getDict(params).then(res => {
        this.dictDetailData = res.data.data.records
        this.dictDetailLoading = false
      })
    },
    //提交表单
    submitForm:function(type){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.id) {
            // 更新字典
            updateDict(this.dataForm).then((res) => {
              if (res.data.code === 200) {
                this.$message({ message: '操作成功', type: 'success' })
              } else {
                this.$message({ message: res.data.msg, type: 'error' })
              }
              if(type=='1'){
                this.dialogFormVisible = false
                this.getDictList()
              }else{
                this.dialogDetailFormVisible = false
                this.getDictDetailList()
              }
        
            })
          } else {
            // 新增字典
            saveDict(this.dataForm).then((res) => {
              if (res.data.code === 200) {
                this.$message({ message: '操作成功', type: 'success' })
              } else {
                this.$message({ message: res.data.msg, type: 'error' })
              }
              if(type=='1'){
                this.dialogFormVisible = false
                this.getDictList()
              }else{
                this.dialogDetailFormVisible = false
                this.getDictDetailList()
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
