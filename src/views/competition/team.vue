<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-button @click="add" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
        <el-button @click="deleteBatch" :disabled="selectedRows.length==0" icon="el-icon-delete" size="medium">删除</el-button>
      </div>
      
      <!-- 这一部分是赛事赛季与球队的关系列表 -->
      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%" v-loading="$store.state.loading">
        <el-table-column align="center" prop="se_teId" type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="赛季名称" value="value">
          <template slot-scope="scope">
            {{scope.row.seasonId | seasonNameFmt(start,competitionId,competitionList)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="相关球队名称">
          <template slot-scope="scope">
            {{scope.row.teamId | idFormatter(teamList)}}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="350">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small" title="编辑"></el-button>
            <el-button @click="remove(scope.row.id)" circle icon="el-icon-delete" size="small" title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 赛事赛季与球队的关系列表结束 -->
      
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
    <el-dialog :visible.sync="dialogVisible" title="添加球队">
      <el-form :label-position="'right'" label-width="80px">
        <el-form :model="se_teForm" :rules="se_teRule" label-width="120px" ref="se_teForm">
          <el-form-item label="id" prop="id" style="display:none">
            <el-input v-model="se_teForm.id"></el-input>
          </el-form-item>
          <el-form-item label="赛季名称" prop="seasonId">
            <el-select disabled placeholder="请选择相关赛季" v-model="se_teForm.seasonId" style="width:100%">
              <el-option :label="season.name" :value="season.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="球队" prop="teamId">
            <el-select clearable filterable placeholder="请选择相关球队" style="width:100%" v-model="se_teForm.teamId">
              <el-option v-bind:label="item.name" v-bind:value="item.id" v-for="item in teamList"></el-option>
            </el-select>
          </el-form-item>
        
        </el-form>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="submit('se_teForm')" type="primary">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import filters from "../../util/filters";
    export default {
        name: "team",
        data() {
            return {
                selectedRows: [],
                competitionList: [],
                teamList: [],
                se_teRule: null,
                seasonSearch: null,
                teamSearch: null,
                start: null,
                se_teForm: {
                    id: '',
                    seasonId:'',
                    teamId: '',
                },
                season: {id:'',name:''},
                dialogVisible: false,
                pager: {current: 1, size: 10, total: 0, records: []}
            };
        },
        created() {
            this.se_teForm.seasonId = this.season.id = parseInt(this.$route.query.seId);
            this.competitionId = this.$route.query.coId;
            this.start = this.$route.query.start;
        },
        mounted() {
            this.query(this.se_teForm.seasonId);
            this.queryCompetition();
            this.queryTeam();
        },
        methods: {
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if(!this.se_teForm.id) {
                            // 新增
                            this.$http.post('/sete',
                                this.se_teForm
                            ).then(res => {
                                if (res.data.status == 'SUCCESS') {
                                    this.query();
                                    this.$notify.success({
                                        title: '成功',
                                        duration: 1800,
                                        message: res.data.data
                                    });
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
                            this.$http.put('/sete',
                                this.se_teForm
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
                                    });
                                }
                            }).finally(() => {
                                this.dialogVisible = false;
                            })
                        }
                    } else {
                        return false;
                    }
                });
            },
            add() {
                this.dialogVisible = true;
                this.se_teForm = {
                    id:'',
                    teamId:'',
                    seasonId: this.season.id

                };
                document.getElementsByClassName("el-dialog__title")[0].innerText = "添加球队";
            },
            remove(id, rowNum) {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http.delete('/sete', {
                        params: {
                            id: id
                        }
                    }).then(res => {
                        if (res.status == 200 && res.data.status == 'SUCCESS') {
                            this.query();
                            this.$notify.success({
                                title: '成功',
                                duration: 1800,
                                message: res.data.data
                            });
                        } else if (res.status != 200 || res.data.status == 'FAILED') {
                            this.$notify.error({
                                title: '错误',
                                duration: 1800,
                                message: res.data.data
                            })
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
                    let temp = 1;
                    for (let i = 0; i < this.selectedRows.length; i++) {
                        this.$http.delete("/sete", {
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
            edit(se_te) {
                this.dialogVisible = true;
                this.se_teForm = se_te;
                document.getElementsByClassName("el-dialog__title")[0].innerText = "编辑球队";
            },
            query() {
                this.$http.get('/sete', {
                    params: {
                        size: this.pager.size,
                        current: this.pager.current,
                        seasonId: this.season.id
                    },
                }).then(res => {
                    this.pager = res.data
                });
            },
            queryCompetition() {
                this.$http.get('/competition', {
                    params: {size: 100, current: 1},
                }).then(res => {
                    this.competitionList = res.data.records;
                    this.generateSeason();
                });
            },
            generateSeason() {
                this.season.name = filters.seasonNameFmt(this.seasonId,this.start,this.competitionId,this.competitionList)
            },
            queryTeam() {
                this.$http.get('/team', {
                    params: {size: 1000, current: 1},
                }).then(res => {
                    this.teamList = res.data.records;
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
