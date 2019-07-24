<template>
    <div>
        <el-card :body-style="{ padding: '0px' }" shadow="never">
            <div slot="header">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-select filterable v-model="seasonSearch" placeholder="赛季">
                            <el-option :label="'中国足球协会甲级联赛2019'" :value="1"></el-option>
                            <el-option :label="'内蒙古中优'" :value="2"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-search">查询</el-button>
                    </el-col>
                </el-row>
                <br>
                <el-button size="medium" type="primary" icon="el-icon-plus" @click="dialogVisible = true">新增</el-button>
                <el-button size="medium" icon="el-icon-delete" :disabled="selectedRows.length==0">删除</el-button>
            </div>


            <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                      style="width: 100%" v-loading="$store.state.loading">
                <el-table-column align="center" prop="roundId" type="selection" width="55"></el-table-column>
                <el-table-column label="赛季名称" align="center" prop="seasonId" width="500"></el-table-column>
                <el-table-column label="轮次名称" align="center" prop="name" width="500"></el-table-column>
                <el-table-column label="轮次顺序" align="center" prop="round_order" width="500"></el-table-column>
                <el-table-column label="开始日期" prop="start" align="center" width="200">
                    <template slot-scope="scope">
                        {{ scope.row.start | moment('YYYY-MM-DD') }}
                    </template>
                </el-table-column>
                <el-table-column label="结束日期" prop="end" align="center" width="200">
                    <template slot-scope="scope">
                        {{ scope.row.end | moment('YYYY-MM-DD') }}
                    </template>
                </el-table-column>
                <el-table-column align="center" fixed="right" label="操作" width="350">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small" title="编辑"></el-button>
                        <el-button @click="remove(scope.row.id)" circle icon="el-icon-delete" size="small" title="删除"></el-button>
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
                        <el-select filterable  placeholder="请选择相关赛季" v-model="roundForm.seasonId" style="width:100%" >
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

<style>
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
</style>
<script>

    export default {
        name: "season",

        data() {
            return {
                selectedRows: [],
                roundRule:null,
                seasonSearch:null,
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
            this.competitionId = this.$route.query.id;
        },
        mounted() {
            this.query(this.competitionId);
        },

        methods: {
            submit(se_teForm) {
                this.$refs[se_teForm].validate((valid) => {
                    if (valid) {
                        this.$http.post('/club', {
                            data: this.se_teForm
                        })
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
            edit(se_te) {
                this.dialogVisible = true;
                this.se_teForm = se_te
            },
            query() {
                this.$http.get('/club/co', {
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
