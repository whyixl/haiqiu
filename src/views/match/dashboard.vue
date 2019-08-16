<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-row :gutter="10">

          <el-col :span="5">
            <el-select clearable @change="querySeason" filterable placeholder="赛事" v-model="competitionId">
              <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in competitionList">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="4">
            <el-select clearable @change="query" filterable placeholder="赛季" v-model="seasonId">
              <el-option :key="item.id" :label="item.name" :value='item.id' v-for="item in seasonList">
              </el-option>
            </el-select>
          </el-col>

          <!--<el-col :span="3">-->
          <!--<el-button @click="query(this.seasonId)" icon="el-icon-search" type="primary">查询</el-button>-->
          <!--</el-col>-->

        </el-row>
        <br>
        <el-button @click="add" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
        <el-button @click="deleteBatch" icon="el-icon-delete" size="medium">删除</el-button>
      </div>

      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%" v-loading="$store.state.loading">
        <el-table-column align="center" prop="matchId" type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="轮次" prop="roundId" width="55"></el-table-column>
        <el-table-column align="center" label="日期" prop="matchDate">
          <template slot-scope="scope">
            {{ scope.row.matchDate | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="时间" prop="matchTime">
          <template slot-scope="scope">
            {{ scope.row.matchTime | timeFormatter(8) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="主队" prop="homeId">
          <template slot-scope="scope">
            {{ scope.row.homeId | idFormatter(teamList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="客队" prop="awayId">
          <template slot-scope="scope">
            {{ scope.row.awayId | idFormatter(teamList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="比分" prop="matchResult"></el-table-column>
        <el-table-column align="center" label="是否结束" prop="finished">
          <template slot-scope="scope">
            {{ scope.row.finished == "yes" ? '是': '否' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small" title="编辑"></el-button>
            <router-link
                :to="{path: '/match/dashboard/lineup',query: {homeId: scope.row.homeId, maId: scope.row.id, awayId: scope.row.awayId}}">
              <el-button circle icon="el-icon-menu" size="small" style="width: 32px" title="阵容"></el-button>
            </router-link>
            <router-link
                :to="{path: '/match/dashboard/matchStatistics',query: {homeId: scope.row.homeId, maId: scope.row.id, awayId: scope.row.awayId}}">
              <el-button circle icon="el-icon-news" size="small" style="width: 32px" title="统计"></el-button>
            </router-link>
            <el-button @click="remove(scope.row.id)" circle icon="el-icon-delete" size="small"
                       title="删除"></el-button>
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
      <el-form :label-position="'right'" label-width="80px">
        <el-form :model="matchForm" :rules="matchRule" label-width="160px" ref="matchForm">
          <el-form-item label="id" prop="id" style="display:none">
            <el-input v-model="matchForm.id"></el-input>
          </el-form-item>
          <el-form-item label="赛季名称" prop="seasonId">
            <el-select clearable @change="competitionChange" filterable placeholder="请选择赛事" style="width:50%"
                       v-model="matchForm.competitionId">
              <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in competitionList"></el-option>
            </el-select>
            <el-select clearable @change="saveSeasonId" filterable placeholder="请选择赛季" style="width:50%"
                       v-model="matchForm.seasonId">
              <el-option v-bind:key="item.id" v-bind:label="item.name" v-bind:value='item.id'
                         v-for="item in seasonList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="比赛时间" prop="datetime">
            <el-date-picker align="right" placeholder="选择日期" style="width: 50%;"
                            type="date" v-model="matchForm.matchDate" format="yyyy年MM月dd日"></el-date-picker>
            <el-time-picker editable align="right" placeholder="选择时间" style="width: 50%;"
                            type="time" v-model="matchForm.matchTime" value-format="HH:mm"
                            format="HH:mm"></el-time-picker>
          </el-form-item>
          <el-form-item label="轮次" prop="datetime" placeholder="轮次">
            <el-input type="text" v-model="matchForm.roundId"></el-input>
          </el-form-item>
          <el-form-item label="主队" prop="homeId">
            <el-select clearable filterable placeholder="请选择主场球队" style="width:100%" v-model="matchForm.homeId">
              <el-option :key="item.teamId" v-bind:label="item.name" v-bind:value="item.teamId"
                         v-for="item in seTeamList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客队" prop="awayId">
            <el-select clearable filterable placeholder="请选择客场球队" style="width:100%" v-model="matchForm.awayId">
              <el-option :key="item.teamId" v-bind:label="item.name" v-bind:value="item.teamId"
                         v-for="item in seTeamList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="比分" prop="matchResults">
            <el-input placeholder="主队得分" v-model="matchResults[0].matchResult" style="width: 47.8%"></el-input>
            :
            <el-input placeholder="客队得分" v-model="matchResults[1].matchResult" style="width: 47.8%"></el-input>
          </el-form-item>
          <el-form-item label="结束" prop="finished">
            <!--<el-select  clearable filterable placeholder="比赛是否结束" v-model="matchForm.finished" style="width:100%">
              <el-option :label="'是'" :value="'yes'"></el-option>
              <el-option :label="'否'" :value="'no'"></el-option>
            </el-select>-->
            <el-switch
                v-model="matchForm.finished"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否"
                active-value="yes"
                inactive-value="no">
            </el-switch>
          </el-form-item>
        </el-form>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="submit('matchForm')" type="primary">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import filters from "../../util/filters";

    export default {
        name: "match",
        data() {
            return {
                selectedRows: [],
                teamList: [],
                competitionList: [],
                seasonList: [],
                seTeamList: [],
                seasonId: 20192,
                competitionId: 2,
                teamId: '',
                matchRule: null,
                seasonSearch: null,
                teamSearch: null,
                matchForm: {
                    id: "",
                    seasonId: "",
                    competitionId: "",
                    roundId: "",
                    matchDate: "",
                    matchTime: "",
                    homeId: "",
                    awayId: "",
                    finished: ""
                },
                matchResults: [
                    {matchId: '', matchResult: '', matchResultAt: '0', place: 'home'},
                    {matchId: '', matchResult: '', matchResultAt: '0', place: 'away'}
                ],
                datetime: "",
                dialogVisible: false,
                pager: {current: 1, size: 8, total: 0, records: []}
            };
        },
        mounted() {
            this.query();
            this.queryCompetition();
            this.queryTeam();
        },
        created() {
            this.seasonId = 20192;
        },
        methods: {
            add() {
                document.getElementsByClassName("el-dialog__title")[0].innerText =
                    "添加比赛";
                this.dialogVisible = true;
                this.matchForm = {};
                this.matchResults = [
                    {matchId: '', matchResult: null, matchResultAt: '0', place: 'home'},
                    {matchId: '', matchResult: null, matchResultAt: '0', place: 'away'}
                ];
            },
            submit(form) {
                this.$refs[form].validate(valid => {
                    if (valid) {
                        if (!this.matchForm.id) {
                            this.$http
                                .post("/match", {
                                    match: this.matchForm,
                                    matchResults: this.matchResults
                                })
                                .then(res => {
                                    if (res.status == 200 && res.data.status == "SUCCESS") {
                                        this.query();
                                        this.$notify.success({
                                            title: '成功',
                                            duration: 1800,
                                            message: res.data.data
                                        });
                                        this.dialogVisible = false;
                                    } else if (res.status != 200 || res.data.status == "FAILED") {
                                        this.$notify.error({
                                            title: '错误',
                                            duration: 1800,
                                            message: res.data.data
                                        });
                                    }
                                });
                        } else {
                            this.$http
                                .put("/match", {
                                    match: this.matchForm,
                                    matchResults: this.matchResults
                                })
                                .then(res => {
                                    if (res.data.status == "SUCCESS") {
                                        this.query();
                                        this.$notify.success({
                                            title: '成功',
                                            duration: 1800,
                                            message: res.data.data
                                        });
                                    } else {
                                        this.$notify.error({
                                            title: '错误',
                                            duration: 1800,
                                            message: res.data.data
                                        });
                                    }
                                })
                                .finally(() => {
                                    this.dialogVisible = false;
                                });
                        }
                    } else {

                        return false;
                    }
                });
            },
            remove(id) {
                this.$prompt("永久删除该比赛及首发阵容和比赛事件，输入 <span style='color:red'>yes</span> 确认", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    inputPattern: /^yes$/,
                    inputErrorMessage: "不能删除",
                    dangerouslyUseHTMLString: true
                }).then(({value}) => {
                    this.$http
                        .delete("/match", {
                            params: {id: id}
                        }).then(res => {
                        if (res.data && res.data.status == "SUCCESS") {
                            this.query();
                            this.$notify.success({
                                title: '成功',
                                duration: 1800,
                                message: res.data.data
                            });
                        } else {
                            this.$notify.error({
                                title: '错误',
                                duration: 1800,
                                message: res.data.data
                            });
                        }
                    });
                }).catch(() => {
                    this.$message({
                        message: "取消删除",
                        showClose: true,
                        type: 'error'
                    })
                });
            },
            deleteBatch() {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let j = 1;
                    for (let i = 0; i < this.selectedRows.length; i++) {
                        this.$http.delete("/match", {
                            params: {
                                id: this.selectedRows[i]
                            },
                        }).then(res => {
                            if (res.status != 200) {
                                alert("批量删除遇到问题，请重试");
                            }
                            if (j++ == this.selectedRows.length) {
                                this.query();
                            }
                        });
                    }
                });
            },
            edit(rowEntity) {
                this.dialogVisible = true;
                document.getElementsByClassName("el-dialog__title")[0].innerText = "修改比赛";
                this.matchForm = rowEntity;
                this.matchForm.competitionId = this.competitionId;
                this.matchResults = [
                    {
                        id: rowEntity.matchResults[0].id,
                        matchId: rowEntity.id,
                        matchResult: rowEntity.matchResults[0].matchResult,
                        matchResultAt: '0',
                        place: 'home'
                    },
                    {
                        id: rowEntity.matchResults[1].id,
                        matchId: rowEntity.id,
                        matchResult: rowEntity.matchResults[1].matchResult,
                        matchResultAt: '0',
                        place: 'away'
                    }];
            },
            query(val) {
                if (!val) {
                    this.querySeason(this.competitionId)
                }
                this.$http
                    .get("/match", {
                        params: {
                            seasonId: this.seasonId,
                            size: this.pager.size,
                            current: this.pager.current
                        }
                    }).then(res => {
                    this.getResultStr(res.data)
                });
            },
            getResultStr(val) {
                var hr = '';
                var ar = '';
                for (const record of val.records) {
                    if (!record.matchResults) {
                        record.matchResult = '';
                        record.matchResults = ['', ''];
                        continue;
                    }
                    for (const item of record.matchResults) {
                        if (item.place == 'home') {
                            hr = item.matchResult;
                        }
                        if (item.place == 'away') {
                            ar = item.matchResult;
                        }
                    }
                    record.matchResult = hr + ':' + ar;
                }
                this.pager = val
            },
            queryCompetition() {
                this.$http
                    .get("/competition", {
                        params: {size: 100, current: 1}
                    })
                    .then(res => {
                        this.competitionList = res.data.records;
                    });
            },
            competitionChange(val) {
                this.querySeason(val);
                this.matchForm.seasonId = '';
            },
            querySeason(coId) {
                this.$http.get("/season", {
                    params: {
                        competitionId: coId,
                        size: this.pager.size,
                        current: this.pager.current
                    }
                }).then(res => {
                    this.seasonList = res.data.records;
                });
            },
            queryTeam() {
                this.$http
                    .get("/team", {
                        params: {
                            size: 100,
                            current: 1
                        }
                    }).then(res => {
                    this.teamList = res.data.records;
                }).finally(res => {
                        this.queryTeamBySeason();
                    }
                )
            },
            queryTeamBySeason() {
                this.$http.get("/sete", {
                    params: {
                        size: 100,
                        current: 1,
                        seasonId: this.seasonId,
                    }
                }).then(res => {
                    this.seTeamList = res.data.records;
                    for (const item of this.seTeamList) {
                        item.name = filters.idFormatter(item.teamId, this.teamList)
                    }
                })
            },
            saveSeasonId(val) {
                this.seasonId = val;
                this.queryTeamBySeason()
            },
            // 分页组件点击事件
            pageChange(val) {
                this.pager.current = val;
                this.query();
            },
            sizeChange(val) {
                this.pager.size = val;
                this.query();
            },
            onSelectionChange(rows) {
                this.selectedRows = rows.map(item => item.id);
            }
        }
    };
</script>