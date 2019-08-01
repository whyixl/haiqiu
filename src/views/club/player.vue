<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-row style="float: left; width: 750px" :gutter="10">
          <el-col :span="3">
            <el-select filterable placeholder="球队" v-model="teamSearch">
              <el-option v-bind:label="item.name" v-bind:value="item.id" v-for="item in teamList"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="姓名" v-model="nameSearch"></el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="英文名" v-model="surnameSearch"></el-input>
          </el-col>
          <el-col :span="3">
            <el-date-picker align="left" end-placeholder="查询结束日期" range-separator="至" start-placeholder="查询开始日期"
                            type="daterange" v-model="dateRange">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-col :span="2">
          <el-button icon="el-icon-search" type="primary">查询</el-button>
        </el-col>
        <br>
        <br>
        <br>
        <el-button @click="dialogVisible = true" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
        <el-button :disabled="selectedRows.length==0" icon="el-icon-delete" size="medium">删除</el-button>
      </div>
      
      <!-- 球员列表 -->
      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%" v-loading="$store.state.loading">
        <el-table-column align="center" prop="personId" type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="姓名" prop="name"></el-table-column>
        <el-table-column align="center" label="英文名" prop="surname" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column align="center" label="性别" prop="gender">
          <template slot-scope="scope">
            {{scope.row.gender ? (scope.row.gender == "male" ? "男" : "女") : scope.row.gender}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="出生日期" prop="birthday" width="100">
          <template slot-scope="scope">
            {{scope.row.birthday | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="身高/CM" prop="height"></el-table-column>
        <el-table-column align="center" label="体重/KG" prop="weight"></el-table-column>
        <el-table-column align="center" label="所属球队" prop="teamId"></el-table-column>
        <el-table-column align="center" label="国籍" prop="countryId">
          <template slot-scope="scope">
            {{scope.row.countryId | idFormatter(countryList)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="位置组" prop="roleId"></el-table-column>
        <el-table-column align="center" label="确切位置" prop="position1"></el-table-column>
        <el-table-column align="center" label="球衣号" prop="shirtnumber"></el-table-column>
        <el-table-column align="center" label="出生国家" prop="birth_countryId"></el-table-column>
        <el-table-column align="center" label="出生地" prop="birth_place"></el-table-column>
        <el-table-column align="center" label="惯用脚" prop="preferred_side"></el-table-column>
        <el-table-column align="center" label="站立脚" prop="foot"></el-table-column>
        <el-table-column align="center" label="球鞋尺寸" prop="shoesize"></el-table-column>
        <el-table-column align="center" label="球衣尺寸" prop="jerseysize"></el-table-column>
        <el-table-column align="center" label="短裤尺寸" prop="shortssize"></el-table-column>
        <el-table-column align="center" label="第二国籍" prop="nationality2"></el-table-column>
        <el-table-column align="center" label="生效日期" prop="start" width="100">
          <template slot-scope="scope">
            {{ scope.row.start ? (scope.row.start | moment('YYYY-MM-DD')) : scope.row.start }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="到期日期" prop="end" width="100">
          <template slot-scope="scope">
            {{ scope.row.end ? (scope.row.end | moment('YYYY-MM-DD')) : scope.row.end}}
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
        <el-tabs>
          <el-tab-pane label="常规信息">
            <el-form :model="form" label-width="80px" ref="form">
              <el-form-item label="id" prop="id" style="display:none">
                <el-input v-model="form.id"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="form.name">
                <el-input placeholder="请输入姓名" v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="英文名" prop="form.surname">
                <el-input placeholder="请输入英文名" v-model="form.surname"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="form.gender">
                <el-select filterable placeholder="请选择性别" style="width:100%" v-model="form.gender">
                  <el-option label="男" value="male"></el-option>
                  <el-option label="女" value="female"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="身高/cm" prop="form.height">
                <el-input placeholder="请输入身高" v-model="form.height"></el-input>
              </el-form-item>
              <el-form-item label="体重/kg" prop="form.weight">
                <el-input placeholder="请输入体重" v-model="form.weight"></el-input>
              </el-form-item>
              <el-form-item label="出生日期" prop="form.birthday">
                <el-date-picker :picker-options="$store.state.datePickerOptions" align="right" placeholder="选择日期"
                                style="width: 100%;"
                                type="date" v-model="form.birthday"></el-date-picker>
              </el-form-item>
              <el-form-item label="国籍" prop="form.country">
                <el-select filterable placeholder="请输入国籍" style="width:100%" v-model="form.countryId">
                  <el-option :label="item.name" :value="item.id" v-for="item in countryList"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          
          <el-tab-pane label="详细信息">
            <el-form :model="detail" label-width="80px" ref="detail">
              <el-form-item label="出生国家" prop="detail.birth_country">
                <el-select filterable placeholder="请输入出生国家" style="width:100%" v-model="detail.birth_countryId">
                  <el-option :label="item.name" :value="item.id" v-for="item in countryList"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="出生地" prop="detail.birth_place">
                <el-input placeholder="请输入出生地" v-model="detail.birth_place"></el-input>
              </el-form-item>
              <el-form-item label="第二国籍" prop="form.nationality2">
                <el-input placeholder="请输入第二国籍" v-model="detail.nationality2"></el-input>
              </el-form-item>
              <el-form-item label="惯用脚" prop="detail.preferred_side">
                <el-select filterable placeholder="请选择惯用脚" style="width:100%" v-model="detail.preferred_side">
                  <el-option label="--" value="null_foot"></el-option>
                  <el-option label="左脚" value="left_foot"></el-option>
                  <el-option label="右脚" value="right_foot"></el-option>
                  <el-option label="双脚" value="double_foot"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="站立脚" prop="detail.foot">
                <el-select filterable placeholder="请选择站立脚" style="width:100%" v-model="detail.foot">
                  <el-option label="--" value="null_foot"></el-option>
                  <el-option label="左" value="left_foot"></el-option>
                  <el-option label="右" value="right_foot"></el-option>
                  <el-option label="二者" value="double_foot"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="球鞋尺寸" prop="detail.shoesize">
                <el-input placeholder="请输入球鞋尺寸" v-model="detail.shoesize"></el-input>
              </el-form-item>
              <el-form-item label="球衣尺寸" prop="detail.jerseysize">
                <el-input placeholder="请输入球衣号" v-model="detail.jerseysize"></el-input>
              </el-form-item>
              <el-form-item label="短裤尺寸" prop="detail.shortssize">
                <el-input placeholder="请输入短裤号" v-model="detail.shortssize"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="submit('form')" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "player",
        data() {
            return {
                form: {
                    id: '',
                    name: '',
                    surname: '',
                    gender: '',
                    birthday: '',
                    height: '',
                    weight: '',
                    countryId: ''
                },
                detail: {
                    birth_countryId: '',
                    birth_place: '',
                    nationality2: '',
                    preferred_side: '',
                    foot: '',
                    shoesize: '',
                    jerseysize: '',
                    shortssize: ''
                },
                distribution: {
                    teamId: '',
                    roleId: '',
                    position1: '',
                    shirtnumber: '',
                    start: '',
                    end: ''
                },
                dialogVisible: false,
                state: null,
                dateRange: null,
                surnameSearch: null,
                nameSearch: null,
                teamSearch: null,
                teamList: [],
                countryList: [],
                roles: [],
                positions: [],
                areas: [],
                selectedRows: [],
                bucketName: "public",
                pager: {current: 1, size: 10, total: 0, records: []}
            }
        },
        created: function () {
            this.areas = [
                {text: '守门员', id: 1, pid: 0},
                {text: '后卫', id: 2, pid: 0},
                {text: '中场', id: 3, pid: 0},
                {text: '前锋', id: 4, pid: 0},
                {text: '无位置', id: 5, pid: 0},
                {text: '守门员', id: 11, pid: 1},
                {text: '左后卫', id: 21, pid: 2},
                {text: '右后卫', id: 22, pid: 2},
                {text: '中后卫', id: 23, pid: 2},
                {text: '左中后卫', id: 24, pid: 2},
                {text: '右中后卫', id: 25, pid: 2},
                {text: '拖后中卫', id: 26, pid: 2},
                {text: '自由中卫', id: 27, pid: 2},
                {text: '防守型中场', id: 31, pid: 3},
                {text: '左防守型中场', id: 32, pid: 3},
                {text: '右防守型中场', id: 33, pid: 3},
                {text: '左中场', id: 34, pid: 3},
                {text: '左前卫', id: 35, pid: 3},
                {text: '中前卫', id: 36, pid: 3},
                {text: '右前卫', id: 37, pid: 3},
                {text: '右中场', id: 38, pid: 3},
                {text: '攻击型中场', id: 39, pid: 3},
                {text: '左攻击型中场', id: 310, pid: 3},
                {text: '中攻击型中场', id: 311, pid: 3},
                {text: '右攻击型中场', id: 312, pid: 3},
                {text: '中锋', id: 41, pid: 4},
                {text: '左边锋', id: 42, pid: 4},
                {text: '右边锋', id: 43, pid: 4},
                {text: '左前锋', id: 44, pid: 4},
                {text: '右前锋', id: 45, pid: 4},
                {text: '第二前锋', id: 46, pid: 4},
                {text: '--', id: 51, pid: 5}
            ];

            var roles = this.areas.filter(function (area) {
                return area.pid == 0;
            });
            this.roles = roles;

        },
        mounted() {
            this.query();
            this.queryTeam();
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
                        if(!this.form.id) {
                            // 新增
                            this.$http.post('/person',
                                this.form
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
                            this.$http.put('/person',
                                this.form
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
                document.getElementsByClassName("el-dialog__title")[0].innerText = "添加球员";
                this.dialogVisible = true;
                this.form = {};
            },
            remove(id, rowNum) {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http.delete('/person', {
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
                this.$http.delete('', {
                    data: {
                        coIds: this.selectedRows
                    }
                })
            },
            edit(player) {
                document.getElementsByClassName("el-dialog__title")[0].innerText = "编辑球员";
                this.dialogVisible = true;
                this.form = player
            },
            query() {
                this.$http.get('/person', {
                    params: {
                        size: this.pager.size,
                        current: this.pager.current
                    },
                }).then(res => {
                    this.pager = res.data
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
