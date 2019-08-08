<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-button @click="add" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
        <el-button :disabled="selectedRows.length===0" @click="deleteBatch" icon="el-icon-delete" size="medium">删除
        </el-button>
      </div>
      <!-- 这一部分是赛事列表 -->
      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%" v-loading="$store.state.loading">
        <el-table-column align="center" prop="competitionId" type="selection" width="40"></el-table-column>
        <el-table-column align="center" label="描述" prop="name" width="200"></el-table-column>
        <el-table-column align="center" label="简称" prop="shortname" width="120"></el-table-column>
        <el-table-column align="center" label="性别" prop="gender" width="100">
          <template slot-scope="scope">
            {{ scope.row.gender==="male" ? '男性':(scope.row.gender==="female"? '女性':'混合' )}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="年龄" prop="ageId" width="100">
          <template slot-scope="scope">
            {{scope.row.ageId==1 ? '职业' : scope.row.ageId==2 ? 'U23' :scope.row.ageId==3 ? 'U21' :scope.row.ageId==4 ? 'U20'
            :scope.row.ageId==5 ? 'U19' :scope.row.ageId==6 ? 'U18' :scope.row.ageId==7 ? 'U17' :scope.row.ageId==8 ? 'U16'
            :scope.row.ageId==9 ? 'U15' :scope.row.ageId==10 ? 'U14' :scope.row.ageId==11 ? 'U13' :scope.row.ageId==12 ? 'U12'
            :scope.row.ageId==13 ? 'U11' :scope.row.ageId==14 ? 'U10' :scope.row.ageId==15 ? 'U9' :scope.row.ageId==16 ? 'U8' :'U7'}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型" prop="type" width="100">
          <template slot-scope="scope">
            {{ scope.row.type == "club" ? '俱乐部': '国际' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="开始日期" prop="starttime" width="140">
          <template slot-scope="scope">
            {{ scope.row.starttime | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="国家/地区" prop="countryId" width="140">
          <template slot-scope="scope">
            {{scope.row.countryId | idFormatter(countryList)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="联盟" prop="federationId" width="120">
          <template slot-scope="scope">
            {{scope.row.federationId | idFormatter(federationList)}}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small" title="编辑"></el-button>
            <router-link :to="{path: '/competition/dashboard/season',query: {coId: scope.row.id}}">
              <el-button circle icon="el-icon-news" size="small" style="width: 32px" title="赛季"></el-button>
            </router-link>
            <el-button @click="remove(scope.row.id,scope.$index)" circle icon="el-icon-delete" size="small"
                       title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 赛事列表结束 -->

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
    <el-dialog :visible.sync="dialogVisible" title="添加赛事">
      <el-form :label-position="'right'" label-width="80px">
        <el-form :model="competitionForm" :rules="competitionRule" label-width="80px" ref="competitionForm">
          <el-form-item label="id" prop="id" style="display:none">
            <el-input v-model="competitionForm.id"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <!-- name -->
            <el-input placeholder="请输入赛事全称" v-model="competitionForm.name"></el-input>
          </el-form-item>
          <el-form-item label="简称">
            <!-- shortname/microName -->
            <el-input placeholder="请输入赛事简称" v-model="competitionForm.shortname"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select clearable filterable placeholder="请选择性别" style="width:100%" v-model="competitionForm.gender">
              <el-option v-bind:label=item.label v-bind:value=item.value v-for="item in genderOptions"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄">
            <el-select clearable filterable placeholder="请选择年龄段" style="width:100%" v-model="competitionForm.ageId">
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
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select clearable filterable placeholder="请输入类型" style="width:100%" v-model="competitionForm.type">
              <el-option :label="'俱乐部'" :value="'club'"></el-option>
              <el-option :label="'国内'" :value="'national'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="国家" prop="country">
            <el-select clearable filterable placeholder="请选择国家" style="width:100%" v-model="competitionForm.countryId">
              <el-option v-bind:label="item.name" v-bind:value="item.id" v-for="item in countryList"></el-option>
            </el-select>
          </el-form-item>
          <!-- 地区列表，从后台查出来 -->
          <el-form-item label="联盟" prop="federation">
            <el-select clearable filterable placeholder="请输选择联盟" style="width:100%"
                       v-model="competitionForm.federationId">
              <el-option :label="'--'" :value="1"></el-option>
              <el-option :label="'世界'" :value="2"></el-option>
              <el-option :label="'欧洲'" :value="3"></el-option>
              <el-option :label="'南美洲'" :value="4"></el-option>
              <el-option :label="'北美洲/中美洲'" :value="5"></el-option>
              <el-option :label="'亚洲'" :value="6"></el-option>
              <el-option :label="'非洲'" :value="7"></el-option>
              <el-option :label="'大洋洲'" :value="8"></el-option>
            </el-select>
          </el-form-item>
          <!-- 这个直接存的属性，页面写死算了 -->
          <el-form-item label="开始日期" prop="starttime">
            <el-col :span="6">
              <el-date-picker
                  placeholder="选择日期"
                  type="date"
                  v-model="competitionForm.starttime">
              </el-date-picker>
            </el-col>
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
        name: "competitionList",
        data() {
            const name = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('不能为空'));
                } else {
                    return callback()
                }
            };
            return {
                competitionForm: {
                    id: '',
                    name: null,
                    shortname: null,
                    type: null,
                    gender: null,
                    ageId: null,
                    countryId: null,
                    federationId: null,
                    starttime: null,
                },
                federationList: [],
                countryList: [],
                genderOptions: [{label: "男性", value: "male"}, {label: "女性", value: "female"}],
                dialogVisible: false,
                selectedRows: [],
                pager: {current: 1, size: 5, total: 0, records: []},
                //表单过滤规则
                competitionRule: {
                    name: [{
                        validator: name,
                        trigger: 'blur'
                    }]
                }
            };
        },
        mounted() {
            this.query();
            this.queryCountry();
            this.queryFederationList();
        },
        methods: {
            // 基本增删改查
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if (!this.competitionForm.id) {
                            this.$http.post('/competition',
                                this.competitionForm
                            ).then(res => {
                                if (res.data.status == 'SUCCESS') {
                                    this.query();
                                } else if (res.data.status == 'FAILED') {
                                    alert(res.data.data);
                                }
                            }).finally(() => {
                                this.dialogVisible = false;
                            })
                        } else {
                            this.$http.put('/competition',
                                this.competitionForm
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
                this.dialogVisible = true;
                this.competitionForm = {
                    id: '',
                    name: null,
                    shortname: null,
                    type: null,
                    gender: null,
                    ageId: null,
                    countryId: null,
                    federationId: null,
                    starttime: null,
                }
            },
            remove(id, rowNum) {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http.delete('/competition', {
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
                        this.$http.delete("/competition", {
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
                this.competitionForm = rowEntity
            },
            query() {
                this.$http.get('/competition', {
                    params: {
                        size: this.pager.size,
                        current: this.pager.current
                    },
                }).then(res => {
                    this.pager = res.data
                });
            },
            queryCountry() {
                this.$http.get("/country",).then(res => {
                    this.countryList = res.data;
                })
            },
            queryFederationList() {
                this.$http.get('/federation').then(res => {
                    this.federationList = res.data;
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
