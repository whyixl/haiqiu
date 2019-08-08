<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-button size="medium" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button @click="deleteBatch" size="medium" icon="el-icon-delete" :disabled="selectedRows.length==0">删除</el-button>
      </div>

      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%" v-loading="$store.state.loading">
        <el-table-column align="center" prop="seasonId" type="selection" width="55"></el-table-column>
        <el-table-column label="赛季名称" align="center" prop="d" width="240px">
          <template slot-scope="scope">
            {{scope.row.seasonId | seasonNameFmt(start,competitionId,competitionList)}}
          </template>
        </el-table-column>
        <el-table-column label="轮次名称" align="center" prop="name"></el-table-column>
        <el-table-column label="轮次顺序" align="center" prop="roundOrder"></el-table-column>
        <el-table-column label="开始日期" prop="start" align="center">
          <template slot-scope="scope">
            {{ scope.row.start | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column label="结束日期" prop="end" align="center">
          <template slot-scope="scope">
            {{ scope.row.end | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small" title="编辑"></el-button>
            <el-button @click="remove(scope.row.id,scope.$index)" circle icon="el-icon-delete" size="small"
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

    <!-- 编辑页面 -->
    <el-dialog :visible.sync="dialogVisible" title="添加球队">
      <el-form :label-position="'right'" label-width="80px">
        <el-form :model="roundForm" :rules="roundRule" label-width="160px" ref="roundForm">
          <el-form-item label="id" prop="id" style="display:none">
            <el-input v-model="roundForm.id"></el-input>
          </el-form-item>
          <el-form-item label="赛季名称" prop="seasonId">
            <el-select disabled placeholder="请选择相关赛季" v-model="roundForm.seasonId" style="width:100%">
              <el-option :label="season.name" :value="season.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="轮次" prop="name">
            <el-input placeholder="请输入轮次 " v-model="roundForm.name"></el-input>
          </el-form-item>
          <el-form-item label="轮次顺序" prop="roundOrder">
            <el-input placeholder="请输入轮次顺序 " v-model="roundForm.roundOrder"></el-input>
          </el-form-item>
          <el-form-item label="时间" prop="dateRange">
            <el-col :span="6">
              <el-date-picker align="right" end-placeholder="赛季开始时间" range-separator="至"
                              start-placeholder="赛季结束时间" type="daterange"
                              unlink-panels
                              v-model="dateRange" style="width: 400%">
              </el-date-picker>
            </el-col>
          </el-form-item>
        </el-form>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="submit('roundForm')" type="primary">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import filters from "../../util/filters";

  export default {
        name: "round",
        data() {
            return {
                selectedRows: [],
                competitionList: [],
                roundRule: null,
                seasonSearch: null,
                dateRange:[],
                roundForm: {
                    id: '',
                    seasonId: '',
                    name: '',
                    roundOrder: '',
                    start: '',
                    end: ''
                },
                season: {id:'',name:''},
                dialogVisible: false,
                pager: {current: 1, size: 10, total: 0, records: []}
            };
        },
        created() {
            this.roundForm.seasonId = this.season.id = parseInt(this.$route.query.seId);
            this.competitionId = this.$route.query.coId;
            this.start = this.$route.query.start;
        },
        mounted() {
            this.query(this.seasonId);
            this.queryCompetition();
        },

        methods: {
            submit(form) {
                this.roundForm.start = this.dateRange[0];
                this.roundForm.end = this.dateRange[1];
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if (!this.roundForm.id) {
                            this.$http.post('/round',
                                this.roundForm
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
                            this.$http.put('/round',
                                this.roundForm
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
                document.getElementsByClassName("el-dialog__title")[0].innerText = "添加轮次";
                this.dialogVisible = true;
                this.dateRange = '';
                this.roundForm = {
                    id: '',
                    seasonId: this.season.id,
                    name: '',
                    roundOrder: '',
                    start: '',
                    end:''
                }
            },
            remove(id, rowNum) {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http.delete('/round', {
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
                        this.$http.delete("/round", {
                            params: {
                                id: this.selectedRows[i]
                            },
                        }).then(res => {
                            if (res.status != 200) {
                                alert("批量删除遇到问题，请重试");
                            }
                            if (temp++ == this.selectedRows.length) {
                                console.log('query执行')
                                this.query();
                            }
                        });
                    }
                });
            },
            edit(rowEntity) {
                document.getElementsByClassName("el-dialog__title")[0].innerText = "修改轮次";
                this.dialogVisible = true;
                this.dateRange = [rowEntity.start, rowEntity.end];
                this.roundForm = rowEntity;
                console.log(rowEntity)
            },
            query() {
                this.$http.get('/round', {
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
