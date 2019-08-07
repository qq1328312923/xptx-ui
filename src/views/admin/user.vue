<template>
  <div class="app-container">
    <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4"> 
          <div class="">
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
                @node-click="handleNodeClick"></el-tree>

          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20"> 

        </el-col>
    </el-row>
  </div>
</template>
<script>
  import { getDept } from '@/api/dept'
  export default {
     data() {
        return {
          deptData: [],
          deptTreeProps: {
            label: 'name',
            children: 'children'
          },
        }
     },
     created() {
        this.findDeptTree()
     },
     methods: {
        // 加载部门列表
        findDeptTree: function() {
          getDept().then((res) => {
            this.deptData = res.data.data
          })
        },
     }
  }
</script>