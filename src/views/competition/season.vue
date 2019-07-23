<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-button @click="add" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
        <el-button :disabled="selectedRows.length===0" icon="el-icon-delete" size="medium">删除</el-button>
      </div>
      <!-- 这一部分是赛季列表 -->
      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%" v-loading="$store.state.loading">
        <el-table-column align="center" prop="seasonId" type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="赛季名称" prop="name" width="370"></el-table-column>
        <el-table-column align="center" label="相关赛事名称" prop="competitionId" width="370"></el-table-column>
        <el-table-column align="center" label="赛季开始日期" prop="start" width="200">
          <template slot-scope="scope">
            {{ scope.row.start | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="赛季结束日期" prop="end" width="200">
          <template slot-scope="scope">
            {{ scope.row.end | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small" title="编辑"></el-button>
            <router-link :to="{path: '/competition/team',query: {id: scope.row.name}}">
              <el-button circle icon="el-icon-menu" size="small" style="width: 32px" title="球队"></el-button>
            </router-link>
            <router-link :to="{path: '/competition/round',query: {id: scope.row.id}}">
              <el-button circle icon="el-icon-news" size="small" style="width: 32px" title="轮次"></el-button>
            </router-link>
            <el-button @click="remove(scope.row.id)" circle icon="el-icon-delete" size="small" title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 赛季列表结束 -->
  
      <!-- 分页组件 -->
      <el-pagination :current-page="pager.current" :layout="$store.state.paginationLayout" :page-size="pager.size"
                     :page-sizes="$store.state.paginationPageSizes"
                     :pager-count="7" :total="pager.total"
                     @current-change="pageChange" @next-click="pageChange" @prev-click="pageChange"
                     @size-change="sizeChange"
                     class="pagination text-right">
      </el-pagination>
      
    </el-card>
    
    <!-- 编辑页面 -->
    <el-dialog :visible.sync="dialogVisible" title="添加赛季">
      <el-form :label-position="'right'" label-width="80px">
        <el-form :model="seasonForm" :rules="seasonRule" label-width="160px" ref="seasonForm">
          <el-form-item label="id" prop="id" style="display:none">
            <el-input v-model="seasonForm.id"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <!-- name -->
            <el-input placeholder="请输入赛季名称" v-model="seasonForm.name"></el-input>
          </el-form-item>
          <el-form-item label="相关赛事">
            <el-select placeholder="请选择相关赛事" style="width:100%" v-model="seasonForm.competitionId">
              <el-option :label="item.name" :value="item.id" v-for="item in competitionList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间" prop="roundForm.dateRange">
            <el-col :span="6">
              <el-date-picker :picker-options="$store.state.dateRangePickerOptions"
                              align="right" end-placeholder="赛季开始时间" range-separator="至"
                              start-placeholder="赛季结束时间" style="width: 400%"
                              type="daterange"
                              unlink-panels v-model="seasonForm.dateRange">
              </el-date-picker>
            </el-col>
          </el-form-item>
        </el-form>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="submit('competitionForm')" type="primary">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {$route} from "vue-router";
    export default {
        name: "season",
        data() {
            return {
                seasonForm:
                    {
                        id: '',
                        name: '',
                        dateRange: '',
                        competitionId: ''
                    },
                competitionId : '',
                competitionList: [],
                selectedRows: [],
                seasonRule: null,
                dialogVisible: false,
                pager: {current: 1, size: 10, total: 0, records: []}
            };
        },
        created() {
            this.competitionId = this.$route.query.coId;
        },
        mounted() {
            this.query(this.competitionId);
        },
        methods: {
            submit(seasonForm) {
                this.$refs[seasonForm].validate((valid) => {
                    if (valid) {
                        this.$http.post('/season', {
                            data: this.seasonForm
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            add() {
                this.dialogVisible = true;
                this.queryCompetition();
                this.$refs['seasonForm'].resetFields()
                //this.seasonForm = {}
            },
            remove() {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then()
            },
            deleteBatch() {
                this.$http.delete('', {
                    data: {
                        coIds: this.selectedRows
                    }
                })
            },
            edit(season) {
                this.dialogVisible = true;
                this.seasonForm = season
            },
            query() {
                this.$http.get('/season', {
                    params: {
                        competitionId: this.competitionId,
                        size: this.pager.size,
                        current: this.pager.current
                    },
                }).then(res => {
                    this.pager = res.data
                });
            },
            queryCompetition() {
                this.$http.get('/competition', {params: {size: 10000, current: 1},
                }).then(res => {
                    this.pager = res.data
                });
            },
            // 分页组件点击事件
            pageChange(val) {
                this.pager.current = val;
                this.query()
            },
            sizeChange(val) {
                this.pager.size = val;
                this.query()
            },
            onSelectionChange(rows) {
                this.selectedRows = rows.map(item => item.id);
            }

        }
    };
</script>
