<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <!-- 查询功能暂时屏蔽 -->
        <!--<el-row :gutter="10">-->
          <!--<el-col :span="3">-->
            <!--<el-input placeholder="姓名" v-model="nameSearch"></el-input>-->
          <!--</el-col>-->
          <!--<el-col :span="3">-->
            <!--<el-input placeholder="英文名" v-model="surnameSearch"></el-input>-->
          <!--</el-col>-->
          <!--<el-col :span="2">-->
            <!--<el-button icon="el-icon-search" type="primary">查询</el-button>-->
          <!--</el-col>-->
        <!--</el-row>-->

        <!--<br>-->
        <el-button @click="add" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
        <el-button @click="deleteBatch":disabled="selectedRows.length===0" icon="el-icon-delete" size="medium">删除</el-button>
      </div>

      <!-- 球员列表 -->
      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%" v-loading="$store.state.loading">
        <el-table-column align="center" prop="personId" type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="姓名" prop="personId">
          <template slot-scope="scope">
            {{scope.row.personId | idFormatter(personList)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属球队" prop="teamId">
          <template slot-scope="scope">
            {{scope.row.teamId | idFormatter(teamList)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色" prop="roleId">
          <template slot-scope="scope">
            {{scope.row.roleId==1 ? '守门员' : scope.row.roleId==2 ? '后卫' :scope.row.roleId==3 ? '中场' :scope.row.roleId==4 ? '前锋'
            :scope.row.roleId==5 ? '主教练' :scope.row.roleId==6 ? '助力教练' :scope.row.roleId==7 ? '守门员教练' :scope.row.roleId==56 ? '运动教练'
            :scope.row.roleId==59 ? '随队医生' :scope.row.roleId==60 ? '俱乐部支持' :scope.row.roleId==61 ? '理疗师' :'无位置'}}
          </template>
        </el-table-column>

        <el-table-column align="center" label="球衣号" prop="shirtnumber"></el-table-column>
        <el-table-column align="center" label="生效日期" prop="start" width="120">
          <template slot-scope="scope">
            {{scope.row.start | moment('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="到期日期" prop="end" width="120">
          <template slot-scope="scope">
            {{ scope.row.end | moment('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="100">
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
                     :pager-count="7" :total="pager.total"
                     @current-change="pageChange" @next-click="pageChange" @prev-click="pageChange"
                     @size-change="sizeChange"
                     class="pagination text-right">
      </el-pagination>
    </el-card>

    <el-dialog :visible.sync="dialogVisible" title="新增人员">
      <el-form :label-position="'right'" label-width="80px">
        <el-form :model="distributionForm" label-width="80px" ref="distributionForm">
          <el-form-item label="所属球队" prop="teamId">
            <el-select  disabled filterable placeholder="请选择球队" style="width:100%" v-model="distributionForm.teamId">
              <el-option :label="item.name" :value="item.id" v-for="item in teamList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="添加球员" prop="personId">
            <el-select clearable filterable placeholder="请选择球员" style="width:100%" v-model="distributionForm.personId">
              <el-option :label="item.name" :value="item.id" v-for="item in personList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="球衣号" prop="shirtnumber">
            <el-input clearable  placeholder="请输入球衣号" v-model="distributionForm.shirtnumber"></el-input>
          </el-form-item>
          <el-form-item label="人员属性" prop="position">
            <el-select @change="getPosition(distributionForm.position)" filterable placeholder="请选择人员属性" style="width:50%" v-model="distributionForm.position">
              <el-option :label="position.name " :value="position.id" v-for="position in positions">{{position.name}}</el-option>
            </el-select>
            <el-select filterable placeholder="请选择角色" style="width:50%" v-model="distributionForm.roleId">
              <el-option :label="role.name " :value="role.id" v-for="role in roles">{{role.name}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生效日期" prop="start">
            <el-date-picker align="right" placeholder="选择成员生效日期"
                            style="width: 100%;" type="date" v-model="distributionForm.start"></el-date-picker>
          </el-form-item>
          <el-form-item label="到期日期" prop="end">
            <el-date-picker align="right" placeholder="选择成员到期日期"
                            style="width: 100%;" type="date" v-model="distributionForm.end"></el-date-picker>
          </el-form-item>
        </el-form>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="submit('distributionForm')" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "player",
        data() {
            return {
                distributionForm: {
                    id:'',
                    teamId: '',
                    roleId: '',
                    person:'',
                    personId: '',
                    shirtnumber: '',
                    start: '',
                    end: ''
                },
                dateRangeSearch: '',
                dialogVisible: false,
                nameSearch: null,
                surnameSearch: '',
                teamSearch: null,
                teamList: [],
                personList: [],
                countryList: [],
                roles: [],
                areas:[],
                persons:[],
                selectedRows: [],
                bucketName: "public",
                pager: {current: 1, size: 10, total: 0, records: []}
            }
        },
        created: function () {
            this.areas = [
                {name: '守门员', id: 1, pid: 11},
                {name: '后卫', id: 2, pid: 11},
                {name: '中场', id: 3, pid: 11},
                {name: '前锋', id: 4, pid: 11},
                {name: '无位置', id: 0, pid: 11},
                {name: '球员', id: 11, pid: 0},
                {name: '职员', id: 21, pid: 0},
                {name: '主教练', id: 5, pid: 21},
                {name: '助力教练', id: 6, pid: 21},
                {name: '守门员教练', id: 7, pid: 21},
                {name: '运动教练', id: 8, pid: 21},
                {name: '随队医生', id: 59, pid: 21},
                {name: '俱乐部支持', id: 60, pid: 21},
                {name: '理疗师', id: 61, pid: 21}
            ];
            var positions = this.areas.filter(function (area) {
                return area.pid == 0;
            });
            this.positions = positions;
            this.teamId = this.$route.query.teamId;

        },
        mounted() {
            this.query(this.teamId);
            this.queryTeam();
            this.queryPerson();
        },
        methods: {
            getPosition: function (id) {
                const roles = this.areas.filter(function (role) {
                    return role.pid == id;
                });
                this.roles = roles;
            },
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if(!this.distributionForm.id) {
                            // 新增
                            this.$http.post('/teamPerson',
                                this.distributionForm
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
                            this.$http.put('/teamPerson',
                                this.distributionForm
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
            add() {
                document.getElementsByClassName("el-dialog__title")[0].innername = "添加球员";
                this.dialogVisible = true;
                this.distributionForm = {
                        id:'',
                        teamId: parseInt(this.teamId),
                        roleId: '',
                        person:'',
                        personId: '',
                        shirtnumber: '',
                        start: '',
                        end: ''
                };
            },
            remove(id, rowNum) {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonname: "确定",
                    cancelButtonname: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http.delete('/teamPerson', {
                        params: {
                            id: id
                        }
                    }).then(res => {
                        if (res.status === 200 && res.data.status === 'SUCCESS') {
                            this.pager.total--;
                            this.pager.records.splice(rowNum, 1)
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
                        this.$http.delete("/teamPerson", {
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
            edit(player) {
                document.getElementsByClassName("el-dialog__title")[0].innername = "编辑球员";
                this.dialogVisible = true;
                this.distributionForm = player
            },
            query() {
                this.$http.get('/teamPerson/selectByTeam', {
                    params: {
                        size: this.pager.size,
                        current: this.pager.current,
                        teamId:this.teamId
                    },
                }).then(res => {
                    this.pager = res.data;
                });
            },
            queryTeam() {
                this.$http.get("/team", {params: {current: 1, size: 100}}).then(res => {
                    this.teamList = res.data.records;
                });
            },

            queryCountry() {
                this.$http.get("/country",).then(res => {
                    this.countryList = res.data;
                    return res.data;
                })
            },
            queryPerson() {
                this.$http.get("/person", {params: {current: 1, size: 10000}}).then(res => {
                    this.personList = res.data.records;
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