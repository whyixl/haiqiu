<template>
    <div>
        <el-card :body-style="{ padding: '0px' }" shadow="never">
            <div slot="header">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-select v-model="seasonSearch" placeholder="赛季">
                            <el-option :label="'中国足球协会甲级联赛2019'" :value="1"></el-option>
                            <el-option :label="'内蒙古中优'" :value="2"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="teamSearch" placeholder="球队">
                            <el-option :label="'北京北体大'" :value="1"></el-option>
                            <el-option :label="'内蒙古中优'" :value="2"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-search">查询</el-button>
                    </el-col>
                </el-row>
                <br>
                <el-button size="medium" type="primary" icon="el-icon-plus" @click="dialogVisible = true">新增</el-button>
                <el-button size="medium" icon="el-icon-delete" :disabled="selectedRows.length===0">删除</el-button>
            </div>
          
            <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                      style="width: 100%" v-loading="$store.state.loading">
                <el-table-column align="center" prop="matchId" type="selection" width="55"></el-table-column>
                <el-table-column label="赛事赛季名称" align="center" prop="seasonId" width="200"></el-table-column>
                <el-table-column align="center" prop="match_date" label="日期" width="150">
                    <template slot-scope="scope">
                        {{ scope.row.time | moment('YYYY-MM-DD hh:mm') }}
                    </template>
                </el-table-column>
                <el-table-column label="时间" align="center" prop="match_time" width="200"></el-table-column>
                <el-table-column label="主队" align="center" prop="homeId" width="150"></el-table-column>
                <el-table-column label="客队" align="center" prop="awayId" width="150"></el-table-column>
                <el-table-column label="比分" align="center" prop="match_result" width="100"></el-table-column>
                <el-table-column label="地点" align="center" prop="venueId" width="250"></el-table-column>
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
                           :page-sizes="$store.state.paginationPageSizes" :total="pager.total"
                           class="pagination text-right"></el-pagination>
        </el-card>

        <!-- 编辑页面 -->
        <el-dialog :visible.sync="dialogVisible" title="添加比赛">
            <el-form :label-position="left" label-width="80px">
                <el-form :model="matchForm" :rules="matchRule" label-width="160px" ref="seasonForm">
                    <el-form-item label="赛季名称" prop="matchForm.seasonId" >
                        <el-select  placeholder="请选择赛事赛季" v-model="matchForm.seasonId" style="width:100%" >
                            <el-option :label="'男性'" :value="1"></el-option>
                            <el-option :label="'女性'" :value="2"></el-option>
                            <el-option :label="'混合'" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日期" prop="matchForm.datetime">
                        <el-date-picker v-model="matchForm.datatime" align="right" type="date" placeholder="选择日期" :picker-options="$store.state.datePickerOptions" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="主队" prop="matchForm.homeId" >
                        <el-select  placeholder="请选择主场球队" v-model="matchForm.homeId" style="width:100%" >
                            <el-option :label="'男性'" :value="1"></el-option>
                            <el-option :label="'女性'" :value="2"></el-option>
                            <el-option :label="'混合'" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="客队"  prop="matchForm.awayId">
                        <el-select  placeholder="请选择客场球队" v-model="matchForm.awayId" style="width:100%" >
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
                matchForm: {},
                selectedRows: [],
                matchRule:null,
                seasonSearch:null,
                teamSearch:null,
               matchForm:{
                  seasonId: '',
                   datetime:'',
                   homeId:'',
                   awayId:'',
                   match_result:'',
                   venueId:''
               },
                dialogVisible: false,
                pager: {current: 1, size: 10, total: 0, records: []}
            };
        },
        mounted() {
            this.query();
        },
        methods: {
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.$http.post('http://192.168.0.253:8090/club', {
                            data: this.matchForm
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            add() {
                this.dialogVisible = true;
                this.matchForm = {}
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
            edit(match) {
                this.dialogVisible = true;
                this.matchForm = match
            },
            query() {
                this.$http.get('http://192.168.0.253:8090/club/co', {
                    params: this.pager,
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
