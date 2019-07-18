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
                <el-table-column align="center" prop="competitionId" type="selection" width="55"></el-table-column>
                <el-table-column label="俱乐部名称" align="center" prop="name" width="370"></el-table-column>
                <el-table-column label="简称" align="center" prop="shortname" width="370"></el-table-column>
                <el-table-column label="国家/地区" align="center" prop="countryId" width="370"></el-table-column>
                <el-table-column label="操作" align="center" width="240">
                    <template slot-scope="scope">
                        <el-button @click="edit()" size="small" type="text">编辑</el-button>
                        <el-button @click="remove()" size="small" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 赛季列表结束 -->

            <!-- 分页组件 -->
            <el-pagination :current-page="pager.current" :layout="$store.state.paginationLayout" :page-size="pager.size"
                           :page-sizes="$store.state.paginationPageSizes" :total="pager.total"
                           class="pagination text-right"></el-pagination>
        </el-card>

        <!-- 编辑页面 -->
        <el-dialog :visible.sync="dialogVisible" title="添加俱乐部">
            <el-form :label-position="'right'" label-width="80px">
                <el-form :model="clubForm" :rules="clubRule" label-width="160px" ref="clubForm">
                    <el-form-item label="id" prop="id" style="display:none" >
                        <el-input  v-model="clubForm.id"></el-input>
                    </el-form-item>
                    <el-form-item label="俱乐部名称" prop="name" >
                        <el-input  placeholder="请输入俱乐部名称 " v-model="clubForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="简称" prop="shortname" >
                        <el-input  placeholder="请输入俱乐部简称 " v-model="clubForm.shortname"></el-input>
                    </el-form-item>
                    <el-form-item label="国家" prop="countryId">
                        <el-select  placeholder="请选择国家" v-model="clubForm.countryId" style="width:100%" >
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
                clubForm:
                    { id:'',
                        name:'',
                        shortname :'',
                        countryId :''
                    },
                clubSearch:null,
                countrySearch:null,
                clubRule:null,
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
                            data: this.seasonForm
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            query() {
                this.$http.get('http://192.168.0.253:8090/club', {
                    params: {
                        id: 1039,
                        name: "内蒙古中优"
                    },
                }).then(res => {
                    this.pager = res.data;
                });
            },
            edit() {
                this.dialogVisible = true;
            },
            onSelectionChange(rows) {
                this.selectedRows = rows.map(item => item.userId);
            },
            remove() {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                });
            },
            onRemoveFile(file) {
                this.$http.delete(
                    `/oss/remove/${this.bucketName}/${file.response}`
                );
            }
        }
    };
</script>