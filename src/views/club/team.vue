<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-select clearable filterable placeholder="国家/地区" v-model="countrySearch">
              <el-option v-bind:label="item.name" v-bind:value="item.id" v-for="item in countryList"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select clearable filterable placeholder="俱乐部名称" v-model="clubSearch">
              <el-option v-bind:label="item.name" v-bind:value="item.id" v-for="item in clubList"></el-option>
            </el-select>
          </el-col>

          <el-col :span="6">
            <el-button @click="query" icon="el-icon-search" type="primary">查询</el-button>
          </el-col>
        </el-row>
        <br>
        <el-button @click="add" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
        <el-button :disabled="selectedRows.length==0" @click="deleteBatch" icon="el-icon-delete" size="medium">删除
        </el-button>
      </div>
      <!-- 球队列表 -->
      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%" v-loading="$store.state.loading">
        <el-table-column align="center" prop="teamId" type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="球队名称" prop="name" width="200"></el-table-column>
        <el-table-column align="center" label="简称" prop="shortname" width="150">
          <template slot-scope="scope">
            {{!scope.row.shortname ? scope.row.name : scope.row.shortname}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="性别" prop="gender" width="150">
          <template slot-scope="scope">
            {{scope.row.gender=="male" ? '男性':(scope.row.gender==="female"? '女性':'混合' )}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="年龄" prop="ageId" width="150">
          <template slot-scope="scope">
            {{scope.row.ageId==1 ? '职业' : scope.row.ageId==2 ? 'U23' :scope.row.ageId==3 ? 'U21' :scope.row.ageId==4 ? 'U20'
            :scope.row.ageId==5 ? 'U19' :scope.row.ageId==6 ? 'U18' :scope.row.ageId==7 ? 'U17' :scope.row.ageId==8 ? 'U16'
            :scope.row.ageId==9 ? 'U15' :scope.row.ageId==10 ? 'U14' :scope.row.ageId==11 ? 'U13' :scope.row.ageId==12 ? 'U12'
            :scope.row.ageId==13 ? 'U11' :scope.row.ageId==14 ? 'U10' :scope.row.ageId==15 ? 'U9' :scope.row.ageId==16 ? 'U8' :'U7'}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="俱乐部名称" prop="clubId" width="180">
          <template slot-scope="scope">
            {{scope.row.clubId | idFormatter(clubList)}}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small" title="编辑"></el-button>
            <router-link :to="{path: '/club/team/teamPlayer', query: {teamId: scope.row.id}}">
              <el-button circle icon="el-icon-menu" size="small" style="width: 32px" title="添加球员"></el-button>
            </router-link>
            <router-link :to="{path: '/club/team/teamStaff', query: {teamId: scope.row.id}}">
              <el-button circle icon="el-icon-news" size="small" style="width: 32px" title="添加职员"></el-button>
            </router-link>
            <el-button @click="remove(scope.row.id, scope.$index)" circle icon="el-icon-delete" size="small"
                       title="删除"></el-button>
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
    <el-dialog :visible.sync="dialogVisible" id="dialog" title="添加球队">
      <el-form :label-position="'right'" label-width="80px">
        <el-form :model="teamForm" :rules="teamRule" label-width="160px" ref="teamForm">
          <el-form-item label="id" prop="id" style="display:none">
            <el-input v-model="teamForm.id"></el-input>
          </el-form-item>
          <el-form-item label="球队名称" prop="name">
            <el-input placeholder="请输入球队名称 " v-model="teamForm.name"></el-input>
          </el-form-item>
          <el-form-item label="简称" prop="shortname">
            <el-input placeholder="请输入球队简称 " v-model="teamForm.shortname"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select clearable filterable placeholder="请选择性别" style="width:100%" v-model="teamForm.gender">
              <el-option :label="'男性'" :value="'male'"></el-option>
              <el-option :label="'女性'" :value="'female'"></el-option>
              <el-option :label="'混合'" :value="'mix'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-select clearable filterable placeholder="请选择年龄段" style="width:100%" v-model="teamForm.ageId">
              <el-option :label="'职业'" :value="1"></el-option>
              <el-option :label="'U23'" :value="2"></el-option>
              <el-option :label="'U21'" :value="3"></el-option>
              <el-option :label="'U20'" :value="4"></el-option>
              <el-option :label="'U19'" :value="5"></el-option>
              <el-option :label="'U18'" :value="6"></el-option>
              <el-option :label="'U17'" :value="7"></el-option>
              <el-option :label="'U16'" :value="8"></el-option>
              <el-option :label="'U15'" :value="9"></el-option>
              <el-option :label="'U14'" :value="10"></el-option>
              <el-option :label="'U13'" :value="11"></el-option>
              <el-option :label="'U12'" :value="12"></el-option>
              <el-option :label="'U11'" :value="13"></el-option>
              <el-option :label="'U10'" :value="14"></el-option>
              <el-option :label="'U9'" :value="15"></el-option>
              <el-option :label="'U8'" :value="16"></el-option>
              <el-option :label="'U7'" :value="17"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="俱乐部名称" prop="clubId">
            <el-select clearable filterable placeholder="请选择俱乐部" style="width:100%" v-model="teamForm.clubId">
              <el-option v-bind:label="item.name" v-bind:value="item.id" v-for="item in clubList"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="submit('teamForm')" type="primary">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import * as qs from "qs";

    export default {
        name: "team",
        data() {
            return {
                teamForm: {
                    id: "",
                    name: "",
                    shortname: "",
                    ageId: "",
                    clubId: "",
                    gender: ""
                },
                teamRule: null,
                clubSearch: null,
                clubList: [],
                countrySearch: null,
                countryList: [],
                selectedRows: [],
                dialogVisible: false,
                pager: {current: 1, size: 10, total: 0, records: []}
            };
        },
        mounted() {
            this.query();
            this.queryClub();
            this.queryCountry();
        },
        methods: {
            submit(form) {
                this.$refs[form].validate(valid => {
                    if (valid) {
                        if (!this.teamForm.id) {
                            this.$http
                                .post("/team", this.teamForm)
                                .then(res => {
                                    if (res.data.status == "SUCCESS") {
                                        this.query();
                                    } else if (res.data.status == "FAILED") {
                                        alert(res.data.data);
                                    }
                                })
                                .finally(() => {
                                    this.dialogVisible = false;
                                });
                        } else {
                            this.$http
                                .put("/team", this.teamForm)
                                .then(res => {
                                    if (res.data.status == "SUCCESS") {
                                        this.query();
                                    } else {
                                        alert("修改失败");
                                    }
                                })
                                .finally(() => {
                                    this.dialogVisible = false;
                                });
                        }
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            add() {
                document
                    .getElementById("dialog")
                    .getElementsByClassName("el-dialog__title")[0].innerText =
                    "添加球队";
                this.dialogVisible = true;
                this.teamForm = {
                    id: "",
                    name: "",
                    shortname: "",
                    ageId: "",
                    clubId: "",
                    gender: ""
                };
            },
            remove(id, rowNum) {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http
                        .delete("/team", {
                            params: {
                                id: id
                            }
                        })
                        .then(res => {
                            if (res.status === 200 && res.data.status === "SUCCESS") {
                                this.pager.total--;
                                this.pager.records.splice(rowNum, 1);
                            }
                        });
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
                        this.$http.delete("/team", {
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
            edit(team) {
                this.dialogVisible = true;
                this.teamForm = team;
                document
                    .getElementById("dialog")
                    .getElementsByClassName("el-dialog__title")[0].innerText =
                    "修改球队";
            },
            query() {
                this.$http
                    .get("/team", {
                        params: {
                            size: this.pager.size,
                            current: this.pager.current,
                            clubSearch: this.clubSearch,
                            countrySearch: this.countrySearch
                        }
                    })
                    .then(res => {
                        this.pager = res.data;
                    });
            },
            queryClub() {
                this.$http
                    .get("/club", {params: {current: 1, size: 100}})
                    .then(res => {
                        this.clubList = res.data.records;
                    });
            },
            queryCountry() {
                this.$http.get("/country").then(res => {
                    this.countryList = res.data;
                });
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
