<template>
    <div>
        <el-card :body-style="{ padding: '0px' }" shadow="never">
            <div slot="header">
                <!--<el-row :gutter="10">
                    <el-col :span="3">
                        <el-input placeholder="姓名"></el-input>
                    </el-col>
                    <el-col :span="3">
                        &lt;!&ndash; 这里点击事件，去查后台所有球队 &ndash;&gt;
                        <el-select placeholder="位置" v-model="position">
                            <el-option :label="'前锋'" :value="1"></el-option>
                            <el-option :label="'中场'" :value="2"></el-option>
                            <el-option :label="'后卫'" :value="3"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        &lt;!&ndash; 这里点击事件，去查后台所有球队 &ndash;&gt;
                        <el-select placeholder="球队" v-loading="getTeamList()" v-model="team">
                            <el-option :label="'呼和浩特'" :value="1"></el-option>
                            <el-option :label="'北体大'" :value="2"></el-option>
                        </el-select>
                    </el-col>
                    &lt;!&ndash;<el-col :span="6">
                      <el-date-picker type="daterange" v-model="dateRange" align="right" unlink-panels range-separator="至" start-placeholder="注册开始日期" end-placeholder="注册结束日期" :picker-options="$store.state.dateRangePickerOptions">
                      </el-date-picker>
                    </el-col>&ndash;&gt;
                    <el-col :span="9">
                        <el-button icon="el-icon-search" type="primary">查询</el-button>
                    </el-col>
                </el-row>
                <br>-->
                <el-button @click="dialogVisible = true" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
                <el-button :disabled="selectedRows.length===0" icon="el-icon-delete" size="medium">删除</el-button>
            </div>
            <!-- 这一部分是赛事列表 -->
            <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                      style="width: 100%" v-loading="$store.state.loading">
                <el-table-column align="center" prop="competitionId" type="selection" width="55"></el-table-column>
                <el-table-column label="赛事简称" prop="name" width="140"></el-table-column>
                <el-table-column label="国家/地区" prop="name" width="140"></el-table-column>
                <el-table-column label="年龄" prop="name" width="140"></el-table-column>
                
                <!--<el-table-column label="手机号码" width="150">
                    <template slot-scope="scope">
                        {{ '+' + scope.row.nation + ' ' + scope.row.phone }}
                    </template>
                </el-table-column>-->
                
                <el-table-column label="有效期自" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.createDate | moment('YYYY-MM-DD hh:mm') }}
                    </template>
                </el-table-column>
                <el-table-column label="有效期至" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.signInDate | moment('YYYY-MM-DD hh:mm') }}
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
        <el-dialog :visible.sync="dialogVisible" title="添加赛事">
            <el-form :label-position="'right'" label-width="80px">
                <el-tabs>
                    <el-tab-pane label="常规信息">
                        <el-form :model="competitionForm" :rules="competitionRule" label-width="80px" ref="competitionForm">
                            <el-form-item label="全称(描述)" prop="name">
                                <!-- name -->
                                <el-input style="width: 350px" v-model="competitionForm.name"></el-input>
                            </el-form-item>
                             <!--运动类型不要了，目前都写足球
                            <el-form-item label="运动类型">
                                <el-select placeholder="国家" v-model="sport">
                                    <el-option :label="'男性'" :value="1"></el-option>
                                    <el-option :label="'女性'" :value="2"></el-option>
                                    <el-option :label="'混合'" :value="3"></el-option>
                                </el-select>
                            </el-form-item>-->
                            <!-- country -->
                            <el-form-item label="国家" prop="country">
                                <el-select placeholder="国家" v-model="competitionForm.country">
                                    <el-option :label="'男性-待修改'" :value="1"></el-option>
                                    <el-option :label="'女性'" :value="2"></el-option>
                                    <el-option :label="'混合'" :value="3"></el-option>
                                </el-select>
                            </el-form-item>
                            <!-- 地区列表，从后台查出来 -->
                            <el-form-item label="地区" prop="federation">
                                <el-select placeholder="地区" v-model="competitionForm.federation">
                                    <el-option :label="'男性—待修改'" :value="1"></el-option>
                                    <el-option :label="'女性'" :value="2"></el-option>
                                    <el-option :label="'混合'" :value="3"></el-option>
                                </el-select>
                            </el-form-item>
                            <!-- 这个直接存的属性，页面写死算了 -->
                            <el-form-item label="类型" prop="type">
                                <el-select placeholder="类型" v-model="competitionForm.type">
                                    <el-option :label="'俱乐部'" :value="club"></el-option>
                                    <el-option :label="'国际'" :value="national"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="有效期" prop="dateRange">
                                <el-col :span="6">
                                    <el-date-picker :picker-options="$store.state.dateRangePickerOptions"
                                                    align="right" end-placeholder="注册结束日期" range-separator="至"
                                                    start-placeholder="注册开始日期" type="daterange"
                                                    unlink-panels
                                                    v-model="competitionForm.dateRange">
                                    </el-date-picker>
                                </el-col>
                                <!--<el-date-picker align="right" type="date" placeholder="选择出生日期" :picker-options="$store.state.datePickerOptions" style="width: 100%;"></el-date-picker>-->
                            </el-form-item>
                            <el-form-item>
                                <!-- 点击更新把当前填的信息保存到临时变量里，点击确定提交到后台 -->
                                <el-button type="primary">更新</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <!-- 详细信息 -->
                    <el-tab-pane label="详细信息">
                        <el-form :model="competitionForm" label-width="80px" ref="form">
                            <el-form-item label="简称">
                                <!-- shortName/microName -->
                                <el-input style="width: 220px" v-model="shortName"></el-input>
                            </el-form-item>
                            <el-form-item label="性别">
                                <el-select placeholder="性别" v-model="gender">
                                    <el-option :label="'男性'" :value="1"></el-option>
                                    <el-option :label="'女性'" :value="2"></el-option>
                                    <el-option :label="'混合'" :value="3"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="年龄">
                                <el-select placeholder="年龄" v-model="age">
                                    <el-option :label="'男性'" :value="1"></el-option>
                                    <el-option :label="'女性'" :value="2"></el-option>
                                    <el-option :label="'混合'" :value="3"></el-option>
                                </el-select>
                            </el-form-item>
                            
                            <el-form-item>
                                <el-button type="primary">更新</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <!-- 赛季管理 -->
                    <el-tab-pane label="赛季管理">
                        <el-form :model="competitionForm" label-width="80px" ref="form">
                            <el-form-item label="赛季时间" prop="seasonDateRange">
                                <el-date-picker :picker-options="$store.state.dateRangePickerOptions" align="right"
                                                end-placeholder="结束日期" range-separator="至"
                                                start-placeholder="开始日期" type="daterange"
                                                unlink-panels
                                                v-model="competitionForm.seasonDateRange">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="名称" prop="seasonName">
                                <el-input style="width: 350px" type="text" v-model="competitionForm.seasonName"></el-input>
                            </el-form-item>
                        </el-form>
                        <el-form-item>
                            <el-button type="primary">更新</el-button>
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
                <!--<el-form-item label="用户名">
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
                    <el-date-picker :picker-options="$store.state.datePickerOptions" align="right" placeholder="选择日期"
                                    style="width: 100%;"
                                    type="date"
                                    v-model="test"></el-date-picker>
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
        name: "user",
        formData: {
            competitionForm: {
                name: '',
                country: '',
                federation: ''
            }
        },
        data() {
            const name = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('不能为空'));
                } else {
                    return callback() // 一些同学的问题可能就出在这里
                }
            };
            const country = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('不能为空'));
                } else {
                    return callback() // 一些同学的问题可能就出在这里
                }
            };
            const federation = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('不能为空'));
                } else {
                    return callback() // 一些同学的问题可能就出在这里
                }
            };
            return {
                competitionForm: {
                    name: '',
                    country: '',
                    federation: ''
                },
                seasonDateRange: null,
                club: null,
                national: null,
                shortName: null,
                seasonName: null,
                dialogVisible: false,
                sport: null,
                type: null,
                age: null,
                team: null,
                position: null,
                gender: null,
                dateRange: null,
                selectedRows: [],
                pager: {current: 1, size: 10, total: 0, records: []},
                competitionRule: {
                    name: [{
                        validator: name,
                        trigger: 'blur'
                    }]
                }
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
                            data: this.competitionForm
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
