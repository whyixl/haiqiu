<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-button size="medium" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button @click="deleteBatch" size="medium" icon="el-icon-delete" :disabled="selectedRows.length==0">删除
        </el-button>
      </div>

      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%" v-loading="$store.state.loading">
        <el-table-column align="center" prop="match_eventId" type="selection" width="55"></el-table-column>
        <el-table-column label="球队" align="center" prop="teamId">
          <template slot-scope="scope">
            {{ scope.row.teamId | idFormatter(allTeamList) }}
          </template>
        </el-table-column>
        <el-table-column label="球员" align="center" prop="personId">
          <template slot-scope="scope">
            {{ scope.row.personId | idFormatter(allPersonList) }}
          </template>
        </el-table-column>
        <el-table-column label="分钟" align="center" prop="minute"></el-table-column>
        <el-table-column label="事件" align="center" prop="action">
          <template slot-scope="scope">
            {{ scope.row.action=='goal' ? '进球' : scope.row.action=='playing' ? '比赛中' : scope.row.action=='card' ? '红黄牌':'点球决胜'}}
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="kind">
          <template slot-scope="scope">
            {{ scope.row.kind=='yellow' ? '黄牌' : scope.row.kind=='red' ? '红牌' :scope.row.kind=='yellow-red' ? '第二张黄牌' : scope.row.kind=='substitute-in' ? '换人'
            :scope.row.kind=='lineup' ? '先发' : scope.row.kind=='bench' ? '替补' :scope.row.kind=='left-foot' ? '左脚' : scope.row.kind=='right-foot' ? '右脚'  :scope.row.kind=='head' ? '头球'
            : scope.row.kind=='free-kick' ? '任意球' :scope.row.kind=='direct-free-kick' ? '直接任意球' : scope.row.kind=='penalty' ? '点球' : scope.row.kind=='back-heel' ? '足跟踢球'
            : scope.row.kind=='overhead-kick' ? '倒钩球' : scope.row.kind=='own-goal' ? '乌龙球' : scope.row.kind=='goal' ? '命中':'未命中'}}
          </template>
        </el-table-column>
        <el-table-column label="相关球员" align="center" prop="additionalPersonId">
          <template slot-scope="scope">
            {{ scope.row.additionalPersonId | idFormatter(allPersonList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.created | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small" title="编辑"></el-button>
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
    <el-dialog :visible.sync="dialogVisible" title="添加比赛统计">
      <el-form :label-position="'right'" label-width="80px">
        <el-form :model="match_eventForm" :rules="match_eventRule" label-width="160px" ref="match_eventForm">
          <el-form-item label="id" prop="id" style="display:none">
            <el-input v-model="match_eventForm.id"></el-input>
          </el-form-item>
          <el-form-item label="球队" prop="teamId">
            <el-select clearable @change="queryPersonByTeam" filterable placeholder="请选择球队"
                       v-model="match_eventForm.teamId" style="width:100%">
              <el-option v-bind:key="item.id" v-bind:label="item.name" v-bind:value="item.id"
                         v-for="item in teamList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="球员" prop="personId">
            <el-select clearable filterable placeholder="请选择球员" v-model="match_eventForm.personId" style="width:100%">
              <el-option :label="item.name" :value="item.id" v-for="item in personList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="相关球员" prop="additional_personId">
            <el-select clearable filterable placeholder="进球加助攻球员/替换加替下球员"
                       v-model="match_eventForm.additionalPersonId" style="width:100%">
              <el-option :label="item.name" :value="item.id" v-for="item in personList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分钟" prop="minute">
            <el-input placeholder="请输入分钟" v-model="match_eventForm.minute"></el-input>
          </el-form-item>
          <el-form-item label="事件及类型" prop="action">
            <el-select clearable filterable @change="getPosition"
                       v-model="match_eventForm.action" placeholder="请选择事件" style="width:50%;">
              <el-option :label="item.name " :value="item.id" v-for="item in actions"></el-option>
            </el-select>
            <el-select clearable filterable placeholder="请选择类型" name="" id="" v-model="match_eventForm.kind"
                       style="width:50%;">
              <el-option :label="kind.name " v-for="kind in kinds" :value="kind.id">{{kind.name}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间" prop="created">
            <el-date-picker v-model="match_eventForm.created" align="right" type="date" placeholder="选择日期"
                            style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-form>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="submit('match_eventForm')" type="primary">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import filters from "../../util/filters";

    export default {
        name: "matchEvent",
        data() {
            return {

                selectedRows: [],
                match_eventRule: null,
                match_eventForm: {
                    id: "",
                    created: "",
                    matchId: "",
                    teamId: "",
                    lineupname: "",
                    personId: "",
                    additionalPersonId: "",
                    action: "",
                    kind: "",
                    minute: ""
                },
                personList: [{'id': '', 'name': ''}],
                allPersonList: [],
                allTeamList: [],
                teamList: [],
                actions: [],
                kinds: [],
                areas: [],
                dialogVisible: false,
                pager: {current: 1, size: 10, total: 0, records: []}
            };
        },
        created: function () {
            this.areas = [
                {name: "进球", id: 'goal', pid: 0},
                {name: "比赛中", id: 'playing', pid: 0},
                {name: "红黄牌", id: 'card', pid: 0},
                {name: "特殊事件", id: 'special', pid: 0},
                {name: "黄牌", id: 'yellow', pid: 'card'},
                {name: "红牌", id: 'red', pid: 'card'},
                {name: "第二张黄牌", id: 'yellow-red', pid: 'card'},
                {name: "换人", id: 'substitute-in', pid: 'playing'},
                {name: "先发", id: 'lineup', pid: 'playing'},
                {name: "替补", id: 'bench', pid: 'playing'},
                {name: "点球决胜", id: 'pso', pid: 0},
                {name: "左脚", id: 'left-foot', pid: 'goal'},
                {name: "右脚", id: 'right-foot', pid: 'goal'},
                {name: "头球", id: 'head', pid: 'goal'},
                {name: "任意球", id: 'free-kick', pid: 'goal'},
                {name: "直接任意球", id: 'direct-free-kick', pid: 'goal'},
                {name: "点球", id: 'penalty', pid: 'goal'},
                {name: "足跟踢球", id: 'back-heel', pid: 'goal'},
                {name: "倒钩球", id: 'overhead-kick', pid: 'goal'},
                {name: "乌龙球", id: 'own-goal', pid: 'goal'},
                {name: "其它", id: 'goal', pid: 'goal'},
                {name: "点球未进", id: 'missed-penalty', pid: 'special'},
                {name: "命中", id: 'goal', pid: 'pso'},
                {name: "未命中", id: 'miss', pid: 'pso'}
            ];
            var actions = this.areas.filter(function (area) {
                return area.pid == 0;
            });
            this.actions = actions;
            this.homeId = this.$route.query.homeId;
            this.awayId = this.$route.query.awayId;
            this.match_eventForm.matchId = this.$route.query.maId;
        },
        mounted() {
            this.queryTeam();
            this.queryAllPerson();
        },
        methods: {
            getPosition: function (id) {
                var kinds = this.areas.filter(function (kind) {
                    return kind.pid == id;
                });
                this.kinds = kinds;
            },
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if (!this.match_eventForm.id) {
                            // 新增
                            this.$http.post('/matchEvent',
                                this.match_eventForm
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
                                    });
                                }
                            }).finally(() => {
                                this.dialogVisible = false;
                            })
                        } else {
                            // 修改
                            this.$http.put('/matchEvent',
                                this.match_eventForm
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
            add() {
                document.getElementsByClassName("el-dialog__title")[0].innerText = "添加事件";
                this.dialogVisible = true;
                this.match_eventForm = {matchId: this.$route.query.maId};
            },
            remove(id, rowNum) {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http
                        .delete("/matchEvent", {
                            params: {
                                id: id
                            }
                        }).then(this.query);
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
                        this.$http.delete("/matchEvent", {
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
                document.getElementsByClassName("el-dialog__title")[0].innerText =
                    "修改事件";
                this.dialogVisible = true;
                this.queryPersonByTeam(rowEntity.matchId);
                this.match_eventForm = rowEntity;
            },
            query() {
                this.$http
                    .get("/matchEvent", {
                        params: {
                            matchId: this.match_eventForm.matchId,
                            size: this.pager.size,
                            current: this.pager.current
                        }
                    })
                    .then(res => {
                        this.pager = res.data;
                    });
            },
            queryTeam() {
                this.$http.get('/team', {
                    params: {size: 10000, current: 1},
                }).then(res => {
                    this.allTeamList = res.data.records;
                    this.getTeamList();
                });
                this.query();
            },
            getTeamList() {
                const aid = this.awayId;
                const hid = this.homeId;
                const all = this.allTeamList;
                this.teamList.push({'id': aid, 'name': filters.idFormatter(aid, all)},
                    {'id': hid, 'name': filters.idFormatter(hid, all)});
            },
            queryAllPerson() {
                this.$http.get('/person', {params: {size: 10000,current:1},
                }).then(res => {
                    this.allPersonList = res.data.records;
                })

                /*then(res => {
                    if (this.allPersonList.length == 0) {
                        this.allPersonList = res.data
                    } else {
                        this.allPersonList.concat(res.data)
                    }
                });
                this.$http.get('/person/selectByTeam', {
                    params: {teamId: this.homeId},
                }).then(res => {
                    if (this.allPersonList.length == 0) {
                        this.allPersonList = res.data
                    } else {
                        this.allPersonList.concat(res.data)
                    }
                });*/
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
