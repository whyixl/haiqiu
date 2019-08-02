<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-select clearable filterable placeholder="国家" style="width:100%" v-model="countrySearch">
              <el-option v-bind:label="item.name" v-bind:value="item.id" v-for="item in countryList"></el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button @click="query" icon="el-icon-search" type="primary">查询</el-button>
          </el-col>
        </el-row>
        <br>
        <el-button @click="add" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
        <el-button @click="deleteBatch" :disabled="selectedRows.length===0" icon="el-icon-delete" size="medium">删除</el-button>
      </div>
      
      <div style="width: 100%">
        <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                  style="width: 100%" v-loading="$store.state.loading">
          <el-table-column align="center" prop="clubId" type="selection"></el-table-column>
          <el-table-column align="center" label="俱乐部名称" prop="name"></el-table-column>
          <el-table-column align="center" label="简称" prop="shortname">
            <template slot-scope="scope">
              {{ scope.row.shortname == null ? scope.row.name : scope.row.shortname}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="国家/地区" prop="countryId">
            <template slot-scope="scope">
              {{ scope.row.countryId | idFormatter(countryList)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small" title="编辑"></el-button>
              <el-button @click="remove(scope.row.id,scope.$index)" circle icon="el-icon-delete" size="small" title="删除"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 赛季列表结束 -->
      
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
    <el-dialog :visible.sync="dialogVisible" title="编辑页面">
      <el-form :label-position="'right'" label-width="80px">
        <el-form :model="clubForm" :rules="clubRule" label-width="160px" ref="clubForm">
          <el-form-item style="display: none;" label="id" prop="id">
            <el-input v-model="clubForm.id"></el-input>
          </el-form-item>
          <el-form-item label="俱乐部名称" prop="name">
            <el-input placeholder="请输入俱乐部名称 " v-model="clubForm.name"></el-input>
          </el-form-item>
          <el-form-item label="简称" prop="name">
            <el-input placeholder="请输入俱乐部简称 " v-model="clubForm.shortname"></el-input>
          </el-form-item>
          <el-form-item label="国家" prop="countryId" clearable>
            <el-select clearable filterable placeholder="请选择国家" style="width:100%" v-model="clubForm.countryId">
              <el-option v-bind:label="item.name" v-bind:value="item.id" v-for="item in countryList"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="submit('clubForm')" type="primary">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "club",
        data() {
            return {
                clubForm: {
                    id: '',
                    name: '',
                    shortname: '',
                    countryName: '',
                    countryId: ''
                },
                countrySearch: null,
                countryList: [],
                clubRule: null,
                selectedRows: [],
                dialogVisible: false,
                pager: {current: 1, size: 10, total: 0, records: []}
            };
        },
        mounted() {
            this.queryCountry();
            this.query();
        },
        methods: {
            add() {
                this.dialogVisible = true;
                this.clubForm = {};
                document.getElementsByClassName("el-dialog__title")[0].innerText = "添加俱乐部";
            },
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if(!this.clubForm.id) {
                            // 新增
                            this.$http.post('/club',
                                this.clubForm
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
                            this.$http.put('/club',
                                this.clubForm
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
            remove(id,rowNum) {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http.delete('/club', {
                        params: {
                            id: id
                        }
                    }).then(res=>{
                        if (res.status === 200 && res.data.status === 'SUCCESS') {
                            this.pager.records.splice(rowNum,1);
                            this.pager.total--;
                        }
                    })
                });
            },
            deleteBatch() {
                for (const id of this.selectedRows) {
                    this.$http.delete("/club", {
                        params: {
                            id: id
                        }
                    }).then(res => {
                        if (res.status != 200) {
                            alert("批量删除遇到问题，请重试")
                        }
                    });
                }
                this.query();
            },
            edit(rowEntity) {
                this.dialogVisible = true;
                this.clubForm = rowEntity;
                document.getElementsByClassName("el-dialog__title")[0].innerText = "修改俱乐部";
            },
            query() {
                this.$http.get('/club', {
                    params : {
                        size: this.pager.size,
                        current: this.pager.current,
                        country: this.countrySearch
                    },
                }).then(res => {
                    this.pager = res.data;
                });
            },
            onSelectionChange(rows) {
                this.selectedRows = rows.map(item => item.id);
            },
            queryCountry() {
                this.$http.get("/country",).then(res => {
                    this.countryList = res.data;
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
        }
    };
</script>