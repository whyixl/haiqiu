<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-row :gutter="10">
          <el-col :span="3">
            <el-input placeholder="姓名" v-model="nameSearch"></el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="英文名" v-model="surnameSearch"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button icon="el-icon-search" type="primary">查询</el-button>
          </el-col>
        </el-row>

        <br>
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
        <el-table-column align="center" label="位置组" prop="roleId"></el-table-column>
        <el-table-column align="center" label="具体位置" prop="position1"></el-table-column>
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

    <el-dialog :visible.sync="dialogVisible" title="新增球员">
      <el-form :label-position="'right'" label-width="80px">
        <el-form :model="distributionForm" label-width="80px" ref="distributionForm">
          <el-form-item label="所属球队" prop="teamId">
            <el-select  filterable placeholder="请选择球队" style="width:100%" v-model="distributionForm.teamId">
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
          <el-form-item label="位置" prop="roleId">
            <el-select filterable @change="getPosition(distributionForm.roleId)" id="" name="" placeholder="请选择位置组"
                       style="width:50%;" v-model="distributionForm.roleId">
              <el-option :label="role.name " :value="role.id" v-for="role in roles">{{role.name}}</el-option>
            </el-select>
            <el-select filterable id="" name="" placeholder="请选择具体位置" style="width:50%;" v-model="distributionForm.position1">
              <el-option :label="position.name" :value=position.id v-for="position in positions">
                {{position.name}}
              </el-option>
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
                    teamId: '',
                    roleId: '',
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
                positions: [],
                countryList: [],
                roles: [],
                selectedRows: [],
                bucketName: "public",
                pager: {current: 1, size: 10, total: 0, records: []}
            }
        },
        created: function () {
            this.areas = [
                {name: '守门员', id: 1, pid: 0},
                {name: '后卫', id: 2, pid: 0},
                {name: '中场', id: 3, pid: 0},
                {name: '前锋', id: 4, pid: 0},
                {name: '无位置', id: 5, pid: 0},
                {name: '守门员', id: 11, pid: 1},
                {name: '左后卫', id: 21, pid: 2},
                {name: '右后卫', id: 22, pid: 2},
                {name: '中后卫', id: 23, pid: 2},
                {name: '左中后卫', id: 24, pid: 2},
                {name: '右中后卫', id: 25, pid: 2},
                {name: '拖后中卫', id: 26, pid: 2},
                {name: '自由中卫', id: 27, pid: 2},
                {name: '防守型中场', id: 31, pid: 3},
                {name: '左防守型中场', id: 32, pid: 3},
                {name: '右防守型中场', id: 33, pid: 3},
                {name: '左中场', id: 34, pid: 3},
                {name: '左前卫', id: 35, pid: 3},
                {name: '中前卫', id: 36, pid: 3},
                {name: '右前卫', id: 37, pid: 3},
                {name: '右中场', id: 38, pid: 3},
                {name: '攻击型中场', id: 39, pid: 3},
                {name: '左攻击型中场', id: 310, pid: 3},
                {name: '中攻击型中场', id: 311, pid: 3},
                {name: '右攻击型中场', id: 312, pid: 3},
                {name: '中锋', id: 41, pid: 4},
                {name: '左边锋', id: 42, pid: 4},
                {name: '右边锋', id: 43, pid: 4},
                {name: '左前锋', id: 44, pid: 4},
                {name: '右前锋', id: 45, pid: 4},
                {name: '第二前锋', id: 46, pid: 4},
                {name: '--', id: 51, pid: 5}
            ];
            var roles = this.areas.filter(function (area) {
                return area.pid == 0;
            });
            console.log(roles,'roles');
            this.roles = roles;

        },
        mounted() {
            this.query();
            this.queryTeam();
            this.queryPerson();
            this.queryCountry();
        },
        methods: {
            getPosition: function (id) {
                const positions = this.areas.filter(function (position) {
                    return position.pid == id;
                });
                this.positions = positions;
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
                this.distributionForm = {};
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
                        this.$http.delete("/teamPerson", {
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

            edit(player) {
                document.getElementsByClassName("el-dialog__title")[0].innername = "编辑球员";
                this.dialogVisible = true;
                this.distributionForm = player
            },
            query() {
                this.$http.get('/teamPerson', {
                    params: {
                        size: this.pager.size,
                        current: this.pager.current
                    },
                }).then(res => {
                    console.log(res.data);
                    this.pager = res.data;
                    console.log(this.pager)
                });
            },
            queryTeam() {
                this.$http.get("/team", {params: {current: 1, size: 100}}).then(res => {
                    this.teamList = res.data.records;
                })
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
