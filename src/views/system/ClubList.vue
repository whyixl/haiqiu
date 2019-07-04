<template>
    <div>
        <el-card :body-style="{ padding: '0px' }" shadow="never">
            <div slot="header">
                <el-button @click="dialogVisible = true" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
                <el-button :disabled="selectedRows.length==0" icon="el-icon-delete" size="medium">删除</el-button>
            </div>

            <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                      style="width: 100%" v-loading="$store.state.loading">
                <el-table-column align="center" type="selection" width="55">
                </el-table-column>
                <el-table-column label="用户名" prop="userName"></el-table-column>
                <el-table-column label="手机号码" width="150">
                    <template slot-scope="scope">
                        {{ '+' + scope.row.nation + ' ' + scope.row.phone }}
                    </template>
                </el-table-column>
                <el-table-column label="电子邮件" prop="email" width="200"></el-table-column>
                <el-table-column label="性别" prop="gender" width="100"></el-table-column>
                <el-table-column label="出生日期" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.birthday | moment('YYYY-MM-DD hh:mm') }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="120">
                    <template slot-scope="scope">
                        <el-tag :type="'success'" v-if="scope.row.enabled">已启用</el-tag>
                        <el-tag :type="'danger'" v-if="!scope.row.enabled">已禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建日期" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.createDate | moment('YYYY-MM-DD hh:mm') }}
                    </template>
                </el-table-column>
                <el-table-column label="最后登陆日期" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.signInDate | moment('YYYY-MM-DD hh:mm') }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button @click="edit()" size="small" type="text" onclick="changeTitle()">编辑</el-button>
                        <el-button @click="remove()" size="small" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :current-page="pager.current" :layout="$store.state.paginationLayout" :page-size="pager.size"
                           :page-sizes="$store.state.paginationPageSizes" :total="pager.total"
                           class="pagination text-right"></el-pagination>
        </el-card>

        <el-dialog :visible.sync="dialogVisible" title="新增用户">
            <el-form :label-position="'right'" label-width="80px">
                <el-form-item label="用户名">
                    <el-input placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input placeholder="请输入密码" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input placeholder="再次确认密码" type="password"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input class="input-with-select" placeholder="请输入手机号码" v-model="test">
                        <el-select placeholder="国际码" slot="prepend" style="width:90px;" v-model="test1">
                            <el-option label="+86" value="86"></el-option>
                            <el-option label="+80" value="80"></el-option>
                            <el-option label="+88" value="88"></el-option>
                            <el-option label="+202" value="202"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="电子邮件">
                    <el-input placeholder="请输入电子邮件"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select placeholder="请选择性别" style="width:100%" v-model="test1">
                        <el-option label="男" value="true"></el-option>
                        <el-option label="女" value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出生日期">
                    <el-date-picker :picker-options="$store.state.datePickerOptions" align="right" placeholder="选择日期" style="width: 100%;"
                                    type="date"
                                    v-model="test"></el-date-picker>
                </el-form-item>
                <el-form-item label="图片">
                    <el-upload :action="this.$http.defaults.baseURL+'/oss/upload'" :data="{bucketName:bucketName}"
                               :headers="{Authorization:'Bearer '+$store.state.token}" :on-remove="onRemoveFile"
                               list-type="picture-card"><i class="el-icon-plus"></i></el-upload>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style>
    .input-with-select /*.el-input-group__prepend*/ {
        background-color: #fff;
    }
</style>
<script>
    export default {
        name: "user",
        data() {
            return {
                dialogVisible: false,
                state: null,
                test: null,
                test1: null,
                selectedRows: [],
                bucketName: "public",
                pager: {current: 1, size: 10, total: 0, records: []},
                teamList :[]
            };
        },
        mounted() {
            this.query();
        },
        methods: {
            changeTitle() {

            },
            query() {
                this.$http.get("/user").then(res => {
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
                this.$http.delete(`/oss/remove/${this.bucketName}/${file.response}`);
            }
        }
    };
</script>
