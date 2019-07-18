<template>
    <div>
        <el-card :body-style="{ padding: '0px' }" shadow="never">
            <div slot="header">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-select v-model="seasonSearch" placeholder="赛季">
                            <el-option :label="'中国足球协会甲级联赛2019'" :value="1"></el-option>
                            <el-option :label="'内蒙古中优'" :value="2"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="teamSearch" placeholder="球队">
                            <el-option :label="'北京北体大'" :value="1"></el-option>
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

            <!-- 这一部分是赛事赛季与球队的关系列表 -->
            <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                      style="width: 100%" v-loading="$store.state.loading">
                <el-table-column align="center" prop="se_teId" type="selection" width="55"></el-table-column>
                <el-table-column label="赛季名称" align="center" prop="seasonId" width="500"></el-table-column>
                <el-table-column label="相关球队名称" align="center" prop="teamId" width="500"></el-table-column>
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
                           :page-sizes="$store.state.paginationPageSizes" :total="pager.total"
                           class="pagination text-right"></el-pagination>
        </el-card>

        <!-- 编辑页面 -->
        <el-dialog :visible.sync="dialogVisible" title="添加球队">
            <el-form :label-position="'right'" label-width="80px">
                <el-form :model="se_teForm" :rules="se_teRule" label-width="160px" ref="seasonForm">
                    <el-form-item label="赛季名称" prop="seasonId" >
                        <el-select  placeholder="请选择相关赛季" v-model="se_teForm.seasonId" style="width:100%" >
                            <el-option :label="'男性'" :value="1"></el-option>
                            <el-option :label="'女性'" :value="2"></el-option>
                            <el-option :label="'混合'" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="球队" prop="teamId" >
                        <el-select  placeholder="请选择相关球队" v-model="se_teForm.teamId" style="width:100%" >
                            <el-option :label="'男性'" :value="1"></el-option>
                            <el-option :label="'女性'" :value="2"></el-option>
                            <el-option :label="'混合'" :value="3"></el-option>
                        </el-select>
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
                se_teRule:null,
                seasonSearch:null,
                teamSearch:null,
                se_teForm:{
                    seasonId:null,
                    teamId:null,
                },
                dialogVisible: false,
                pager: {current: 1, size: 10, total: 0, records: []}
            };
        },
        mounted() {
            this.query();
        },
        methods: {
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.$http.post('http://192.168.0.253:8090/club', {
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
