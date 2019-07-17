<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-button @click="add" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
        <el-button @click="deleteBatch" :disabled="selectedRows.length===0" icon="el-icon-delete" size="medium">删除</el-button>
      </div>
      <!-- 这一部分是赛事列表 -->
      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%" v-loading="$store.state.loading">
        <el-table-column align="center" prop="competitionId" type="selection" width="40"></el-table-column>
        <el-table-column align="center" label="描述" prop="name" width="180"></el-table-column>
        <el-table-column align="center" label="简称" prop="shortname" width="120"></el-table-column>
        <el-table-column align="center" label="性别" prop="gender" width="120">
          <template slot-scope="scope">
            {{ scope.row.gender==="male" ? '男性':(scope.row.gender==="female"? '女性':'混合' )}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="年龄" prop="ageId" width="120">
          <template slot-scope="scope">
            {{ scope.row.ageId===1 ? '职业':'U梯队'}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型" prop="type" width="120">
          <template slot-scope="scope">
            {{ scope.row.type === "club" ? '俱乐部': '国际' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="国家/地区" prop="countryId" width="120"></el-table-column>
        <el-table-column align="center" label="联盟" prop="federationId" width="120"></el-table-column>
        <el-table-column align="center" label="开始日期" prop="starttime" width="140">
          <template slot-scope="scope">
            {{ scope.row.starttime | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="130">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small" title="编辑"></el-button>
            <router-link :to="{path: '/system/season',query: {id: scope.row.id}}">
              <el-button circle icon="el-icon-news" size="small" style="width: 32px" title="赛季"></el-button>
            </router-link>
            <el-button @click="remove(scope.row.id)" circle icon="el-icon-delete" size="small" title="删除"></el-button>
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
          <el-form-item label="描述">
            <!-- name -->
            <el-input placeholder="请输入赛事全称" v-model="competitionForm.name"></el-input>
          </el-form-item>
          <el-form-item label="简称">
            <!-- shortname/microName -->
            <el-input placeholder="请输入赛事简称" v-model="competitionForm.shortname"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select placeholder="请选择性别" style="width:100%" v-model="competitionForm.gender">
              <el-option :label=item.label :value=item.value v-for="item in genderOptions"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄">
            <el-select placeholder="请选择年龄段" style="width:100%" v-model="competitionForm.ageId">
              <el-option :label="'--'" :value="0"></el-option>
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
            <el-select placeholder="请输入类型" style="width:100%" v-model="competitionForm.type">
              <el-option :label="'俱乐部'" :value="'club'"></el-option>
              <el-option :label="'国内'" :value="'national'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="国家" prop="country">
            <el-select placeholder="请输入国家" style="width:100%" v-model="competitionForm.countryId">
              <el-option :label="'--'" :value="0"></el-option>
              <el-option :label="'中国'" :value="40"></el-option>
              <el-option :label="'韩国'" :value="41"></el-option>
              <el-option :label="'新加坡'" :value="42"></el-option>
            </el-select>
          </el-form-item>
          <!-- 地区列表，从后台查出来 -->
          <el-form-item label="联盟" prop="federation">
            <el-select placeholder="请输选择联盟" style="width:100%" v-model="competitionForm.federationId">
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
                    name: null,
                    shortname: null,
                    type: null,
                    gender: null,
                    ageId: null,
                    countryId: null,
                    federationId: null,
                    starttime: null,
                },
                genderOptions: [{label: "男性", value: "male"}, {label: "女性", value: "female"}],
                dialogVisible: false,
                selectedRows: [],
                pager: {current: 1, size: 10, total: 0, records: []},
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
        },
        methods: {
            // 基本增删改查
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.$http.post('http://192.168.0.253:8090/club', {
                            data: this.competitionForm
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            add() {
                this.dialogVisible = true;
                this.competitionForm = {}
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
            edit(competition) {
                this.dialogVisible = true;
                this.competitionForm = competition
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
