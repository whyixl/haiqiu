<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-select placeholder="赛季" v-model="seasonSearch">
              <el-option :label="'中国足球协会甲级联赛2019'" :value="1"></el-option>
              <el-option :label="'内蒙古中优'" :value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select placeholder="球队" v-model="teamSearch">
              <el-option :label="'北京北体大'" :value="1"></el-option>
              <el-option :label="'内蒙古中优'" :value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button icon="el-icon-search" type="primary">查询</el-button>
          </el-col>
        </el-row>
        <br>
        <el-button @click="dialogVisible = true" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
        <el-button :disabled="selectedRows.length===0" icon="el-icon-delete" size="medium">删除</el-button>
      </div>
      
      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%" v-loading="$store.state.loading">
        <el-table-column align="center" prop="matchId" type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="轮次" prop="roundId" width="55"></el-table-column>
        <el-table-column align="center" label="日期" prop="matchDate" width="100">
          <template slot-scope="scope">
            {{ scope.row.matchDate | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="时间" prop="matchTime" width="60"></el-table-column>
        <el-table-column align="center" label="主队" prop="homeId" width="150"></el-table-column>
        <el-table-column align="center" label="客队" prop="awayId" width="150"></el-table-column>
        <el-table-column align="center" label="比分" prop="matchResult" width="100"></el-table-column>
        <el-table-column align="center" label="地点" prop="venueId" width="150"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="edit(scope.$index)" circle icon="el-icon-edit" size="small" title="编辑"></el-button>
            <router-link :to="{path: '/match/lineup',query: {id: scope.row.name}}">
              <el-button circle icon="el-icon-menu" size="small" style="width: 32px" title="阵容"></el-button>
            </router-link>
            <router-link :to="{path: '/match/matchStatistics',query: {id: scope.row.name}}">
              <el-button circle icon="el-icon-news" size="small" style="width: 32px" title="统计"></el-button>
            </router-link>
            <el-button @click="remove(scope.$index)" circle icon="el-icon-delete" size="small" title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页组件 -->
      <el-pagination :current-page="pager.current" :layout="$store.state.paginationLayout" :page-size="pager.size"
                     :page-sizes="[8, 10, 20, 40]"
                     :pager-count="7" :total="pager.total"
                     @current-change="pageChange" @next-click="pageChange" @prev-click="pageChange"
                     @size-change="sizeChange"
                     class="pagination text-right">
      </el-pagination>
      
    </el-card>
    
    <!-- 编辑页面 -->
    <el-dialog :visible.sync="dialogVisible" title="添加比赛">
      <el-form :label-position="left" label-width="80px">
        <el-form :model="matchForm" :rules="matchRule" label-width="160px" ref="seasonForm">
          <el-form-item label="id" prop="id" style="display:none">
            <el-input v-model="matchForm.id"></el-input>
          </el-form-item>
          <el-form-item label="赛季名称" prop="matchForm.seasonId">
            <el-select placeholder="请选择赛事赛季" style="width:100%" v-model="matchForm.seasonId">
              <el-option :label="'男性'" :value="1"></el-option>
              <el-option :label="'女性'" :value="2"></el-option>
              <el-option :label="'混合'" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期" prop="matchForm.datetime">
            <el-date-picker :picker-options="$store.state.datePickerOptions" align="right" placeholder="选择日期" style="width: 100%;"
                            type="date" v-model="matchForm.datatime"></el-date-picker>
          </el-form-item>
          <el-form-item label="主队" prop="matchForm.homeId">
            <el-select placeholder="请选择主场球队" style="width:100%" v-model="matchForm.homeId">
              <el-option :label="'男性'" :value="1"></el-option>
              <el-option :label="'女性'" :value="2"></el-option>
              <el-option :label="'混合'" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客队" prop="matchForm.awayId">
            <el-select placeholder="请选择客场球队" style="width:100%" v-model="matchForm.awayId">
              <el-option :label="'男性'" :value="1"></el-option>
              <el-option :label="'女性'" :value="2"></el-option>
              <el-option :label="'混合'" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结果" prop="matchForm.match_result">
            <el-input placeholder="请输入比赛结果" v-model="matchForm.match_result"></el-input>
          </el-form-item>
          <el-form-item label="地点" prop="matchForm.venueId">
            <el-input placeholder="请输入比赛地点" v-model="matchForm.venueId"></el-input>
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

    export default {
        name: "season",

        data() {
            return {
                selectedRows: [],
                matchRule: null,
                seasonSearch: null,
                teamSearch: null,
                matchForm: {
                    id: '',
                    seasonId: '',
                    dateTime: '',
                    roundId: '',
                    matchDate: '',
                    homeId: '',
                    awayId: '',
                    matchResult: '',
                    venueId: ''
                },
                dialogVisible: false,
                pager: {current: 1, size: 8, total: 0, records: []}
            };
        },
        mounted() {
            this.query();
        },
        methods: {
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.$http.post('/club', {
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
                this.$refs['from'].resetFields();
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
            edit(rowEntity) {
                this.dialogVisible = true;
                this.matchForm = rowEntity
            },
            query() {
                this.$http.get('/match', {
                    params: {
                        size: this.pager.size,
                        current: this.pager.current
                    }
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
