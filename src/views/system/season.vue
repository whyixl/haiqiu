<template>
    <div>
        <el-card :body-style="{ padding: '0px' }" shadow="never">
            <div slot="header">
                <el-button @click="dialogVisible = true" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
                <el-button :disabled="selectedRows.length===0" icon="el-icon-delete" size="medium">删除</el-button>
            </div>
            <!-- 这一部分是赛事列表 -->
            <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                      style="width: 100%" v-loading="$store.state.loading">
                <el-table-column align="center" prop="competitionId" type="selection" width="55"></el-table-column>
                <el-table-column label="赛季名称" prop="name" width="140"></el-table-column>
                <el-table-column label="相关赛事名称" prop="competition" width="140"></el-table-column>
                <el-table-column label="赛季开始日期" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.start | moment('YYYY-MM-DD') }}
                    </template>
                </el-table-column>
                <el-table-column label="赛季结束日期" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.end | moment('YYYY-MM-DD') }}
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="140">
                    <template slot-scope="scope">
                        <el-button @click="edit()" size="small" type="text">编辑</el-button>
                        <el-button @click="remove()" size="small" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 赛事列表结束 -->

            <!-- 分页组件 -->
            <el-pagination :current-page="pager.current" :layout="$store.state.paginationLayout" :page-size="pager.size"
                           :page-sizes="$store.state.paginationPageSizes" :total="pager.total"
                           class="pagination text-right"></el-pagination>
        </el-card>

        <!-- 编辑页面 -->
        <el-dialog :visible.sync="dialogVisible" title="添加赛季">
            <el-form :label-position="'right'" label-width="80px">
                <el-form :model="seasonForm" :rules="seasonRule" label-width="80px" ref="seasonForm">
                    <el-form-item label="名称" prop="name" >
                        <!-- name -->
                        <el-input  placeholder="请输入赛季名称" v-model="seasonForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="相关赛事名称" >
                        <el-select  placeholder="请选择相关赛事" v-model="competition" style="width:100%" >
                            <el-option :label="'男性'" :value="1"></el-option>
                            <el-option :label="'女性'" :value="2"></el-option>
                            <el-option :label="'混合'" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="时间" prop="dateRange" >
                        <el-col :span="6" >
                            <el-date-picker :picker-options="$store.state.dateRangePickerOptions"
                                            align="right" end-placeholder="赛季开始时间" range-separator="至"
                                            start-placeholder="赛季结束时间" type="daterange"
                                            unlink-panels
                                            v-model="seasonForm.dateRange" style="width: 400%">

                            </el-date-picker>
                        </el-col>

                    </el-form-item>

                </el-form>



                <!-- 赛季管理 -->
                <!-- <el-tab-pane label="赛季管理">
                    <el-form :model="competitionForm" label-width="80px" ref="form">
                        <el-form-item label="赛季时间" prop="seasonDateRange">
                            <el-date-picker :picker-options="$store.state.dateRangePickerOptions" align="right"
                                            end-placeholder="结束日期" range-separator="至"
                                            start-placeholder="开始日期" type="daterange"
                                            unlink-panels
                                            v-model="competitionForm.seasonDateRange">
                            </el-date-picker>
                        </el-form-item>

            <el-form-item label="头像">
                <el-upload :action="this.$http.defaults.baseURL+'/oss/upload'" :data="{bucketName:bucketName}"
                           :headers="{Authorization:'Bearer '+$store.state.token}" :on-remove="onRemoveFile"
                           list-type="picture-card"><i class="el-icon-plus"></i></el-upload>
            </el-form-item>-->
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
                seasonForm:
                    { name:'',
                      dateRange :''
                    },
                seasonRule:null,
                competition:null
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
