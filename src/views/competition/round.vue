<template>
    <div>
        <el-card :body-style="{ padding: '0px' }" shadow="never">
            <div slot="header">
                <el-button size="medium" type="primary" icon="el-icon-plus" @click="dialogVisible = true">新增</el-button>
                <el-button size="medium" icon="el-icon-delete" :disabled="selectedRows.length==0">删除</el-button>
            </div>

            <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                      style="width: 100%" v-loading="$store.state.loading">
                <el-table-column align="center" prop="roundId" type="selection" width="55"></el-table-column>
                <el-table-column label="赛季名称" align="center" prop="seasonId">
                    <template slot-scope="scope">
                        {{scope.row.seasonId | seasonNameFmt(start,competitionId,competitionList)}}
                    </template>
                </el-table-column>
                <el-table-column label="轮次名称" align="center" prop="name"></el-table-column>
                <el-table-column label="轮次顺序" align="center" prop="round_order"></el-table-column>
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
                        <el-button @click="remove(scope.row.id,scope.$index)" circle icon="el-icon-delete" size="small" title="删除"></el-button>
                    </template>
                </el-table-column>
            </el-table>


            <!-- 分页组件 -->
            <el-pagination :current-page="pager.current" :layout="$store.state.paginationLayout" :page-size="pager.size"
                           :page-sizes="$store.state.paginationPageSizes" :total="pager.total"
                           class="pagination text-right"></el-pagination>
        </el-card>

        <!-- 编辑页面 -->
        <el-dialog :visible.sync="dialogVisible" title="添加球队">
            <el-form :label-position="'right'" label-width="80px">
                <el-form :model="roundForm" :rules="roundRule" label-width="160px" ref="seasonForm">
                    <el-form-item label="id" prop="id" style="display:none" >
                        <el-input  v-model="roundForm.id"></el-input>
                    </el-form-item>
                    <el-form-item label="赛季名称" prop="roundForm.seasonId" >
                        <el-select clearable filterable  placeholder="请选择相关赛季" v-model="roundForm.seasonId" style="width:100%" >
                            <el-option :label="'男性'" :value="1"></el-option>
                            <el-option :label="'女性'" :value="2"></el-option>
                            <el-option :label="'混合'" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                        <el-form-item label="轮次" prop="roundForm.name">
                            <el-input placeholder="请输入轮次 " v-model="roundForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="轮次顺序" prop="roundForm.round_order">
                            <el-input placeholder="请输入俱乐部简称 " v-model="roundForm.round_order"></el-input>
                        </el-form-item>
                        <el-form-item label="时间" prop="roundForm.dateRange" >
                            <el-col :span="6" >
                                <el-date-picker :picker-options="$store.state.dateRangePickerOptions"
                                                align="right" end-placeholder="赛季开始时间" range-separator="至"
                                                start-placeholder="赛季结束时间" type="daterange"
                                                unlink-panels
                                                v-model="roundForm.dateRange" style="width: 400%">

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
        name: "round",
        data() {
            return {
                selectedRows: [],
                competitionList: [],
                roundRule:null,
                seasonSearch:null,
                start: null,
                roundForm:{
                    id:'',
                    seasonId:'',
                    name:'',
                    round_order:'',
                    start:'',
                    end:''
                },
                dialogVisible: false,
                pager: {current: 1, size: 10, total: 0, records: []}
            };
        },
        created() {
            this.roundForm.seasonId = this.$route.query.seId;
            this.competitionId = this.$route.query.coId;
            this.start = this.$route.query.start;
        },
        mounted() {
            this.query(this.seasonId);
            this.queryCompetition();
        },

        methods: {
            submit(form) {
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
                this.dialogVisible = true;
                this.se_teForm = {}
            },
            remove(id,rowNum) {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http.delete('/round', {
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
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let temp = 0;
                    for (let i = 0; i < this.selectedRows.length; i++) {
                        temp++;
                        this.$http.delete("/round", {
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
            edit(se_te) {
                this.dialogVisible = true;
                this.se_teForm = se_te
            },
            query() {
                this.$http.get('/round', {
                    params: {
                        size: this.pager.size,
                        current: this.pager.current
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
