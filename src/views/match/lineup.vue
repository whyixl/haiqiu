<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-button @click="dialogVisible = true" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
        <el-button @click="deleteBatch" :disabled="selectedRows.length===0" icon="el-icon-delete" size="medium">删除</el-button>
      </div>

      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%" v-loading="$store.state.loading">
        <el-table-column align="center" prop="lineupId" type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="比赛名称" prop="matchId" width="180"></el-table-column>
        <el-table-column align="center" label="球队" prop="teamId" width="150"></el-table-column>
        <el-table-column align="center" label="阵型名" prop="lineupname" width="120"></el-table-column>
        <el-table-column align="center" label="球员" prop="playerId" width="100"></el-table-column>
        <el-table-column align="center" label="球衣号" prop="playerNum" width="100"></el-table-column>
        <el-table-column align="center" label="球员类型" prop="playerType" width="90"></el-table-column>
        <el-table-column align="center" label="球员位置" prop="position" width="90"></el-table-column>
        <el-table-column align="center" label="场上位置X" prop="xPosition" width="100"></el-table-column>
        <el-table-column align="center" label="场上位置Y" prop="yPosition" width="100"></el-table-column>
        <el-table-column align="center" label="操作人员" prop="person" width="100"></el-table-column>
        <el-table-column align="center" label="数据来源" prop="dataSource" width="100"></el-table-column>
        <el-table-column align="center" label="操作" width="120">
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
            <el-input placeholder="请输入阵型名" v-model="lineupForm.lineupname"></el-input>
          </el-form-item>
          <el-form-item label="球员" prop="playerId">
            <el-select clearable filterable placeholder="请选择球员" style="width:100%" v-model="lineupForm.playerId">
              <el-option :label="item.name" :value="item.id" v-for="item in personList"></el-option>
            </el-select>
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
          <el-form-item label="操作人员" prop="person">
            <el-input placeholder="请输入操作人员" v-model="lineupForm.person"></el-input>
          </el-form-item>
          <el-form-item label="数据来源" prop="dataSource">
            <el-input placeholder="请输入数据来源" v-model="lineupForm.dataSource"></el-input>
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
            this.homeId = this.$route.query.homeId;
            this.awayId = this.$route.query.awayId;
        },
        data() {
            return {
                selectedRows: [],
                lineupRule: null,
                teamList: [],
                allTeamList: [],
                personList: [],
                lineupForm: {
                    id: '',
                    matchId: '',
                    teamId: '',
                    lineupname: '',
                    playerId: '',
                    playerType: '',
                    playerNum: '',
                    position: '',
                    xposition: '',
                    yposition: '',
                    dataSource: '',
                    person: ''
                },
                dialogVisible: false,
                pager: {current: 1, size: 10, total: 0, records: []}
            };
        },
        mounted() {
            this.query();
            this.queryTeam();
        },
        methods: {
            add() {
                this.dialogVisible = true;
                this.clubForm = {};
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
                                } else if (res.data.status == 'FAILED' && !res.data.data) {
                                    alert(res.data.data);
                                }
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
                                } else {
                                    alert("修改失败")
                                }
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
                    }).then(res => {
                        if (res.status === 200 && res.data.status === 'SUCCESS') {
                            this.pager.records.splice(rowNum, 1);
                            this.pager.total--;
                        }
                    })
                });
            },
            deleteBatch() {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let temp = 0;
                    for (let i = 0; i < this.selectedRows.length; i++) {
                        temp++;
                        this.$http.delete("/matchLineUp", {
                            params: {
                                id: this.selectedRows[i]
                            },
                        }).then(res => {
                            if (res.status != 200) {
                                alert("批量删除遇到问题，请重试");
                            }
                            if (temp == this.selectedRows.length) {
                                this.query();
                            }
                        });
                    }
                });
            },
            edit(rowEntity) {
                this.dialogVisible = true;
                this.clubForm = rowEntity;
                document.getElementsByClassName("el-dialog__title")[0].innerText = "修改阵型";
            },
            query() {
                this.$http.get('/matchLineUp', {
                    params: {
                        size: this.pager.size,
                        current: this.pager.current
                    },
                }).then(res => {
                    this.pager = res.data;
                });
            },
            queryTeam() {
                this.$http.get('/team', {
                    params: {size: 100, current: 1},
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
