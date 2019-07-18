<template>
    <div>
        <el-card shadow="never" :body-style="{ padding: '0px' }">
            <div slot="header">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-select v-model="countrySearch" placeholder="国家/地区">
                            <el-option :label="'中华人民共和国'" :value="1"></el-option>
                            <el-option :label="'中国（台湾）'" :value="2"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="clubSearch" placeholder="俱乐部名称">
                            <el-option :label="'中华人民共和国'" :value="1"></el-option>
                            <el-option :label="'中国（台湾）'" :value="2"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-search">查询</el-button>
                    </el-col>
                </el-row>
                <br>
                <el-button size="medium" type="primary" icon="el-icon-plus" @click="dialogVisible = true">新增</el-button>
                <!--<el-button size="medium" icon="el-icon-upload2">导入</el-button>
                <el-button size="medium" icon="el-icon-download">导出</el-button>-->
                <el-button size="medium" icon="el-icon-delete" :disabled="selectedRows.length==0">删除</el-button>
            </div>
            <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                      style="width: 100%" v-loading="$store.state.loading">
                <el-table-column align="center" prop="teamId" type="selection" width="55"></el-table-column>
                <el-table-column label="球队名称" align="center" prop="name" width="280"></el-table-column>
                <el-table-column label="简称" align="center" prop="shortname" width="200"></el-table-column>
                <el-table-column label="性别" align="center" prop="gender" width="175"></el-table-column>
                <el-table-column label="年龄" align="center" prop="age" width="175"></el-table-column>
                <el-table-column label="俱乐部名称" align="center" prop="clubId" width="280"></el-table-column>
                <el-table-column align="center" fixed="right" label="操作" width="140">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small" title="编辑"></el-button>
                        <el-button @click="remove(scope.row.id)" circle icon="el-icon-delete" size="small" title="删除"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 赛季列表结束 -->

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
                <el-form :model="teamForm" :rules="teamRule" label-width="160px" ref="teamForm">
                    <el-form-item label="id" prop="id" style="display:none" >
                        <el-input  v-model="teamForm.id"></el-input>
                    </el-form-item>
                    <el-form-item label="球队名称" prop="name" >
                        <el-input  placeholder="请输入球队名称 " v-model="teamForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="简称" prop="shortname" >
                        <el-input  placeholder="请输入球队简称 " v-model="teamForm.shortname"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="gender">
                        <el-select  placeholder="请选择性别" v-model="teamForm.gender" style="width:100%" >
                            <el-option :label="'男性'" :value="1"></el-option>
                            <el-option :label="'女性'" :value="2"></el-option>
                            <el-option :label="'混合'" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年龄" prop="age">
                        <el-select placeholder="请选择年龄段" v-model="teamForm.age" style="width:100%">
                            <el-option :label="'--'" :value="1"></el-option>
                            <el-option :label="'职业'" :value="2"></el-option>
                            <el-option :label="'U23'" :value="4"></el-option>
                            <el-option :label="'U21'" :value="5"></el-option>
                            <el-option :label="'U20'" :value="6"></el-option>
                            <el-option :label="'U19'" :value="7"></el-option>
                            <el-option :label="'U18'" :value="8"></el-option>
                            <el-option :label="'U17'" :value="9"></el-option>
                            <el-option :label="'U16'" :value="10"></el-option>
                            <el-option :label="'U15'" :value="11"></el-option>
                            <el-option :label="'U14'" :value="12"></el-option>
                            <el-option :label="'U13'" :value="13"></el-option>
                            <el-option :label="'U12'" :value="14"></el-option>
                            <el-option :label="'U11'" :value="15"></el-option>
                            <el-option :label="'U10'" :value="16"></el-option>
                            <el-option :label="'U9'" :value="17"></el-option>
                            <el-option :label="'U8'" :value="18"></el-option>
                            <el-option :label="'U7'" :value="19"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="俱乐部名称" prop="clubId">
                        <el-select  placeholder="请选择俱乐部" v-model="teamForm.clubId" style="width:100%" >
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
                teamForm:
                    { id:'',
                        name:'',
                        shortname :'',
                        age :'',
                        clubId :'',
                        gender :''
                    },
                clubSearch:null,
                teamRule:null,
                countrySearch:null,
                selectedRows: [],
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
                            data: this.teamForm
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            add() {
                this.dialogVisible = true;
                this.teamForm = {}
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
            edit(team) {
                this.dialogVisible = true;
                this.teamForm = team
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