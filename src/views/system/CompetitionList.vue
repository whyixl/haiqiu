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
                <el-table-column label="描述" align="center" prop="name" width="140"></el-table-column>
                <el-table-column label="简称" align="center" prop="shortname" width="140"></el-table-column>
                <el-table-column label="性别" align="center" prop="gender" width="120"></el-table-column>
                <el-table-column label="年龄" align="center" prop="age" width="120"></el-table-column>
                <el-table-column label="类型" align="center" prop="type" width="130"></el-table-column>
                <el-table-column label="国家/地区" align="center" prop="country" width="140"></el-table-column>
                <el-table-column label="联盟" align="center" prop="federation" width="140"></el-table-column>
                <!--<el-table-column label="手机号码" width="150">
                    <template slot-scope="scope">
                        {{ '+' + scope.row.nation + ' ' + scope.row.phone }}
                    </template>
                </el-table-column>-->
                
                <el-table-column label="有效期自" align="center" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.createDate | moment('YYYY-MM-DD') }}
                    </template>
                </el-table-column>
                <el-table-column label="有效期至" align="center" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.signInDate | moment('YYYY-MM-DD') }}
                    </template>
                </el-table-column>
                
                <el-table-column label="操作" align="center" width="140">
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
                 <el-form :model="competitionForm" :rules="competitionRule" label-width="80px" ref="competitionForm">
                     <el-form-item label="描述" prop="name" >
                                 <!-- name -->
                         <el-input  placeholder="请输入赛事全称" v-model="competitionForm.name"></el-input>
                     </el-form-item>
                     <el-form-item label="简称">
                                <!-- shortName/microName -->
                         <el-input placeholder="请输入赛事简称" v-model="shortName"></el-input>
                     </el-form-item>
                     <el-form-item label="性别" >
                         <el-select  placeholder="请选择性别" v-model="gender" style="width:100%" >
                             <el-option :label="'男性'" :value="1"></el-option>
                             <el-option :label="'女性'" :value="2"></el-option>
                             <el-option :label="'混合'" :value="3"></el-option>
                         </el-select>
                     </el-form-item>
                     <el-form-item label="年龄">
                         <el-select placeholder="请选择年龄段" v-model="age" style="width:100%">
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
                     <el-form-item label="类型" prop="type">
                         <el-select placeholder="请输入类型" v-model="competitionForm.type" style="width:100%">
                             <el-option :label="'俱乐部'" :value="club"></el-option>
                             <el-option :label="'国内'" :value="national"></el-option>
                         </el-select>
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
                         <el-select placeholder="请输入国家" v-model="competitionForm.country" style="width:100%">
                             <el-option :label="'男性-待修改'" :value="1"></el-option>
                             <el-option :label="'女性'" :value="2"></el-option>
                             <el-option :label="'混合'" :value="3"></el-option>
                         </el-select>
                     </el-form-item>
                            <!-- 地区列表，从后台查出来 -->
                     <el-form-item label="联盟" prop="federation">
                         <el-select placeholder="请输选择联盟" v-model="competitionForm.federation" style="width:100%">
                             <el-option :label="'--'" :value="1"></el-option>
                             <el-option :label="'世界'" :value="2"></el-option>
                             <el-option :label="'欧洲'" :value="3"></el-option>
                             <el-option :label="'南美洲'" :value="4"></el-option>
                             <el-option :label="'北美洲/中美洲'" :value="5"></el-option>
                             <el-option :label="'亚洲'" :value="6"></el-option>
                             <el-option :label="'非洲'" :value="7"></el-option>
                             <el-option :label="'大洋洲'" :value="8"></el-option>
                         </el-select>
                     </el-form-item>
                            <!-- 这个直接存的属性，页面写死算了 -->
                     <el-form-item label="有效期" prop="dateRange" >
                         <el-col :span="6" >
                             <el-date-picker :picker-options="$store.state.dateRangePickerOptions"
                                             align="right" end-placeholder="注册结束日期" range-separator="至"
                                             start-placeholder="注册开始日期" type="daterange"
                                             unlink-panels
                                             v-model="competitionForm.dateRange" style="width: 400%">

                             </el-date-picker>
                         </el-col>

                     </el-form-item>

                 </el-form>

                <!--  <el-form-item label="头像">
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
