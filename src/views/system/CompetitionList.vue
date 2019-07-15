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
                <el-table-column label="赛事简称" prop="name" width="140"></el-table-column>
                <el-table-column label="国家/地区" prop="country" width="140"></el-table-column>
                <el-table-column label="年龄" prop="age" width="140"></el-table-column>
   
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
                                <el-input style="width: 220px" v-model="competitionForm.shortName"></el-input>
                            </el-form-item>
                            <el-form-item label="性别">
                                <el-select placeholder="性别" v-model="competitionForm.gender">
                                    <el-option :label="'男性'" :value="1"></el-option>
                                    <el-option :label="'女性'" :value="2"></el-option>
                                    <el-option :label="'混合'" :value="3"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="年龄">
                                <el-select placeholder="年龄" v-model="competitionForm.age">
                                    <el-option :label="'男性'" :value="1"></el-option>
                                    <el-option :label="'女性'" :value="2"></el-option>
                                    <el-option :label="'混合'" :value="3"></el-option>
                                </el-select>
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
        data() {
            const name = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('不能为空'));
                } else {
                    return callback()
                }
            };
           
            return {
                competitionForm: {
                    name: '',
                    country: '',
                    federation: '',
                    seasonDateRange: null,
                    club: null,
                    national: null,
                    shortName: null,
                    seasonName: null,
                    type: null,
                    age: null,
                    team: null,
                    gender: null,
                    dateRange: null,
                },
                dialogVisible: false,
                position: null,
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
