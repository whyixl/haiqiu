<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-button @click="add" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
        <el-button @click="deleteBatch" :disabled="selectedRows.length===0" icon="el-icon-delete" size="medium">删除</el-button>
        <span  style="text-align:center;display:block;color:#409EFF">{{matchName}}</span>
      </div>

      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%" v-loading="$store.state.loading">
        <el-table-column align="center" prop="lineupId" type="selection" width="55"></el-table-column>
        <!--<el-table-column align="center" label="比赛名称" width="220">
          <template slot-scope="scope">
            {{matchName}}
          </template>
        </el-table-column>-->
        <el-table-column align="center" label="球队" prop="teamId" width="120">
          <template slot-scope="scope">
            {{ scope.row.teamId | idFormatter(teamList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="阵型名" prop="lineupName"></el-table-column>
        <el-table-column align="center" label="球员" prop="playerId">
          <template slot-scope="scope">
            {{ scope.row.playerId | idFormatter(allPersonList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="球衣号" prop="playerNum"></el-table-column>
        <el-table-column align="center" label="球员类型" prop="playerType">
          <template slot-scope="scope">
            {{scope.row.playerType ? (scope.row.playerType == 1 ? "首发" : "替补") : scope.row.gender}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="球员位置" prop="position" width="90"></el-table-column>
        <el-table-column align="center" label="场上位置X" prop="xposition" width="100"></el-table-column>
        <el-table-column align="center" label="场上位置Y" prop="yposition" width="100"></el-table-column>
        <el-table-column align="center" label="操作人员" prop="creator" width="100"></el-table-column>
        <el-table-column align="center" label="数据来源" prop="datasource" width="100"></el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small" title="编辑"></el-button>
            <el-button @click="remove(scope.row.id, scope.$index)" circle icon="el-icon-delete" size="small"
                       title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination :current-page="pager.current" :layout="$store.state.paginationLayout" :page-size="pager.size"
                     :page-sizes="$store.state.paginationPageSizes"
                     :pager-count="5" :total="pager.total"
                     @current-change="pageChange" @next-click="pageChange" @prev-click="pageChange"
                     @size-change="sizeChange"
                     class="pagination text-right">
      </el-pagination>
    </el-card>

    <!-- 编辑页面 -->
    <el-dialog :visible.sync="dialogVisible" title="添加阵型">
      <el-form :label-position="'right'" label-width="80px">
        <el-form :model="lineupForm" :rules="lineupRule" label-width="160px" ref="lineupForm">
          <el-form-item label="id" prop="id" style="display:none">
            <el-input v-model="lineupForm.id"></el-input>
          </el-form-item>
          <el-form-item label="球队" prop="teamId">
            <el-select clearable @change="queryPersonByTeam" filterable placeholder="请选择球队" style="width:100%"
                       v-model="lineupForm.teamId">
              <el-option :label="item.name" :value="item.id" v-for="item in teamList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="阵型名" prop="lineupname">
            <el-input placeholder="请输入阵型名" v-model="lineupForm.lineupName"></el-input>
          </el-form-item>
          <el-form-item label="球员" prop="playerId">
            <el-select clearable filterable placeholder="请选择球员" style="width:100%" v-model="lineupForm.playerId">
              <el-option :label="item.name" :value="item.id" v-for="item in personList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="球员号码" prop="position">
            <el-input placeholder="请输入球员号码" v-model="lineupForm.playerNum"></el-input>
          </el-form-item>
          <el-form-item label="球员类型" prop="playerType">
            <el-select clearable filterable placeholder="请选择球员类型" style="width:100%" v-model="lineupForm.playerType">
              <el-option :label="'首发'" :value="1"></el-option>
              <el-option :label="'替补'" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="球员位置" prop="position">
            <el-input placeholder="请输入球员位置" v-model="lineupForm.position"></el-input>
          </el-form-item>
          <el-form-item label="场上位置X" prop="xposition">
            <el-input placeholder="请输入场上位置X" v-model="lineupForm.xposition"></el-input>
          </el-form-item>
          <el-form-item label="场上位置Y" prop="yposition">
            <el-input placeholder="请输入场上位置Y" v-model="lineupForm.yposition"></el-input>
          </el-form-item>
        </el-form>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="submit('lineupForm')" type="primary">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import filters from "../../util/filters";
    export default {
        name: "matchLineUp",
        created() {
            this.homeId = parseInt(this.$route.query.homeId);
            this.awayId = parseInt(this.$route.query.awayId);
            this.lineupForm.matchId = this.$route.query.maId;
            this.queryAllPerson();
            this.queryTeam();
        },
        data() {
            return {
                selectedRows: [],
                lineupRule: null,
                teamList: [],
                allTeamList: [],
                personList: [],
                matchName: '',
                allPersonList: '',
                lineupForm: {
                    id: '',
                    matchId: '',
                    teamId: '',
                    lineupName: '',
                    playerId: '',
                    playerType: '',
                    playerNum: '',
                    position: '',
                    xposition: '',
                    yposition: '',
                },
                dialogVisible: false,
                pager: {current: 1, size: 10, total: 0, records: []}
            };
        },
        mounted() {
            this.query();
        },
        methods: {
            add() {
                this.dialogVisible = true;
                this.lineupForm = {
                    matchId: this.$route.query.maId,
                    datasource: 'HiQiuData',
                    creator: window.localStorage.getItem('userName'),
                };
                document.getElementsByClassName("el-dialog__title")[0].innerText = "添加阵型";
            },
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if (!this.lineupForm.id) {
                            // 新增
                            this.$http.post('/matchLineUp',
                                this.lineupForm
                            ).then(res => {
                                if (res.data.status == 'SUCCESS') {
                                    this.query();
                                    this.$notify.success({
                                        title: '成功',
                                        duration: 1800,
                                        message: res.data.data
                                    });
                                } else if (res.data.status == 'FAILED' || !res.data.data) {
                                    this.$notify.error({
                                        title: '错误',
                                        duration: 1800,
                                        message: res.data.data
                                    });                                }
                            }).finally(() => {
                                this.dialogVisible = false;
                            })
                        } else {
                            // 修改
                            this.$http.put('/matchLineUp',
                                this.lineupForm
                            ).then(res => {
                                if (res.data.status == 'SUCCESS') {
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
                                    });                                }
                            }).finally(() => {
                                this.dialogVisible = false;
                            })
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            remove(id, rowNum) {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http.delete('/matchLineUp', {
                        params: {
                            id: id
                        }
                    }).then(this.query)
                });
            },
            deleteBatch() {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let temp = 1;
                    for (let i = 0; i < this.selectedRows.length; i++) {
                        this.$http.delete("/matchLineUp", {
                            params: {
                                id: this.selectedRows[i]
                            },
                        }).then(res => {
                            if (res.status != 200) {
                                alert("批量删除遇到问题，请重试");
                            }
                            if (temp++ == this.selectedRows.length) {
                                this.query();
                            }
                        });
                    }
                });
            },
            edit(rowEntity) {
                this.dialogVisible = true;
                this.lineupForm = rowEntity;
                console.log(rowEntity);
                this.queryPersonByTeam(rowEntity.teamId);
                document.getElementsByClassName("el-dialog__title")[0].innerText = "修改阵型";
            },
            query() {
                this.$http.get('/matchLineUp', {
                    params: {
                        size: this.pager.size,
                        current: this.pager.current,
                        matchId: this.lineupForm.matchId,
                    },
                }).then(res => {
                    this.pager = res.data;
                });
            },
            queryTeam() {
                this.$http.get('/team', {
                    params: {size: 1000, current: 1},
                }).then(res => {
                    this.allTeamList = res.data.records;
                    this.getTeamList();
                });
            },
            getTeamList() {
                const aid = this.awayId;
                const hid = this.homeId;
                const all = this.allTeamList;
                this.teamList.push({'id': aid, 'name': filters.idFormatter(aid, all)},
                    {'id': hid, 'name': filters.idFormatter(hid, all)});
                this.matchName = filters.matchNameFmt(this.homeId,this.awayId,this.allTeamList);

            },
            queryAllPerson() {
                this.$http.get('/person', {params: {size: 10000,current:1},
                }).then(res => {
                    this.allPersonList = res.data.records;
                })
            },
            queryPersonByTeam(val) {
                this.$http.get('/person/selectByTeam', {params: {teamId: val}})
                    .then(res => {
                        this.personList = res.data;
                    })
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
