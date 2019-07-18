<template>
    <div>
        <el-card shadow="never" :body-style="{ padding: '0px' }">
            <div slot="header">
                <el-row :gutter="10">
                    <el-col :span="3">
                        <el-select v-model="teamSearch" placeholder="球队">
                            <el-option :label="'北京北体大'" :value="1"></el-option>
                            <el-option :label="'内蒙古中优'" :value="2"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <el-input placeholder="姓名" v-model="nameSearch"></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-input placeholder="英文名" v-model="surnameSearch"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-date-picker type="daterange" v-model="dateRange" align="right" unlink-panels range-separator="至" start-placeholder="查询开始日期" end-placeholder="查询结束日期" :picker-options="$store.state.dateRangePickerOptions">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-search">查询</el-button>
                    </el-col>
                </el-row>
                <br>
                <el-button size="medium" type="primary" icon="el-icon-plus" @click="dialogVisible = true">新增</el-button>
                <el-button size="medium" icon="el-icon-delete" :disabled="selectedRows.length==0">删除</el-button>
            </div>

            <el-table :data="pager.records" style="width: 100%" stripe highlight-current-row v-loading="$store.state.loading" @selection-change="onSelectionChange">

                <el-table-column type="selection" width="55" prop="personId" align="center">
                </el-table-column>
                <el-table-column align="center" prop="name" label="姓名"></el-table-column>
                <el-table-column align="center" prop="surname" label="英文名"></el-table-column>
                <el-table-column align="center" prop="gender" label="性别"></el-table-column>
                <el-table-column align="center" prop="birthday" label="出生日期" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.birthday | moment('YYYY-MM-DD') }}
                    </template>
                </el-table-column>
                <el-table-column  align="center" prop="teamId" label="所属球队"></el-table-column>
                <el-table-column  align="center" prop="roleId" label="领域"></el-table-column>
                <el-table-column  align="center" prop="position1" label="角色"></el-table-column>
                <el-table-column align="center" prop="birth_countryId" label="出生国家"></el-table-column>
                <el-table-column align="center" prop="birth_place" label="出生地"></el-table-column>
                <el-table-column align="center" prop="shoesize" label="球鞋尺寸"></el-table-column>
                <el-table-column align="center" prop="jerseysize" label="球衣尺寸"></el-table-column>
                <el-table-column align="center" prop="shortssize" label="短裤尺寸"></el-table-column>
                <el-table-column align="center" prop="countryId" label="国籍"></el-table-column>
                <el-table-column  align="center" prop="nationality2" label="第二国籍"></el-table-column>
                <el-table-column align="center" prop="start" label="生效日期" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.start | moment('YYYY-MM-DD') }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="end" label="到期日期" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.end | moment('YYYY-MM-DD') }}
                    </template>
                </el-table-column>
                <el-table-column align="center" fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small" title="编辑"></el-button>
                        <el-button @click="remove(scope.row.id)" circle icon="el-icon-delete" size="small" title="删除"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :current-page="pager.current" :page-size="pager.size" :total="pager.total" class="pagination text-right" :page-sizes="$store.state.paginationPageSizes" :layout="$store.state.paginationLayout"></el-pagination>
        </el-card>


        <el-dialog title="新增球员" :visible.sync="dialogVisible">
            <el-form :label-position="'right'" label-width="80px">
                <el-tabs>
                    <el-tab-pane label="常规信息">
                        <el-form ref="form" :model="form" label-width="80px">
                            <el-form-item label="id" prop="id" style="display:none" >
                                <el-input  v-model="form.id"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名" prop="form.name">
                                <el-input placeholder="请输入姓名" v-model="form.name"></el-input>
                            </el-form-item>
                            <el-form-item label="英文名" prop="form.surname">
                                <el-input placeholder="请输入英文名" v-model="form.surname"></el-input>
                            </el-form-item>
                            <el-form-item label="性别" prop="form.gender">
                                <el-select v-model="form.gender" placeholder="请选择性别" style="width:100%">
                                    <el-option label="男" value="true"></el-option>
                                    <el-option label="女" value="false"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="出生日期" prop="form.birthday">
                                <el-date-picker v-model="form.birthday" align="right" type="date" placeholder="选择日期" :picker-options="$store.state.datePickerOptions" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="国籍" prop="form.countryId">
                                <el-select placeholder="请输入国籍" v-model="form.countryId" style="width:100%">
                                    <el-option label="男" value=1></el-option>
                                    <el-option label="女" value=2></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>

                    <el-tab-pane label="详细信息">
                        <el-form ref="detail" :model="detail" label-width="80px">
                            <el-form-item label="出生国家" prop="detail.birth_countryId">
                                <el-select placeholder="请输入出生国家" v-model="detail.birth_countryId" style="width:100%">
                                    <el-option label="男" value=1></el-option>
                                    <el-option label="女" value=2></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="出生地" prop="detail.birth_place">
                                <el-input placeholder="请输入出生地" v-model="detail.birth_place"></el-input>
                            </el-form-item>
                            <el-form-item label="第二国籍" prop="detail.nationality2">
                                <el-input placeholder="请输入第二国籍" v-model="detail.nationality2"></el-input>
                            </el-form-item>
                            <el-form-item label="球鞋尺寸" prop="detail.shoesize">
                                <el-input placeholder="请输入球鞋尺寸" v-model="detail.shoesize"></el-input>
                            </el-form-item>
                            <el-form-item label="球衣尺寸" prop="detail.jerseysize">
                                <el-input placeholder="请输入球衣号" v-model="detail.jerseysize"></el-input>
                            </el-form-item>
                            <el-form-item label="短裤尺寸" prop="detail.shortssize">
                                <el-input placeholder="请输入短裤号" v-model="detail.shortssize"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>

                    <el-tab-pane label="分配信息">
                        <el-form ref="distribution" :model="distribution" label-width="80px">
                            <el-form-item label="所属球队" prop="distribution.teamId">
                                <el-select  placeholder="请选择球队" v-model="distribution.teamId" style="width:100%" >
                                    <el-option :label="'男性'" :value="1"></el-option>
                                    <el-option :label="'女性'" :value="2"></el-option>
                                    <el-option :label="'混合'" :value="3"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="领域"  prop="distribution.role">
                                <el-select name="" id="" @change="getPosition(distribution.roleId)" v-model="distribution.roleId" placeholder="请选择领域" style="width:50%;">
                                    <el-option :label="role.text " v-for="role in roles" :value="role.id">{{role.text}}</el-option>
                                </el-select>
                                <el-select name="" id="" v-model="distribution.position1" placeholder="请选择角色" style="width:50%;">
                                    <el-option :label="position.text "  v-for="position in positions":value="position.id">{{position.text}}</el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="生效日期" prop="distribution.start">
                                <el-date-picker v-model="distribution.start" align="right" type="date" placeholder="选择成员生效日期" :picker-options="$store.state.datePickerOptions" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="到期日期" prop="distribution.end">
                                <el-date-picker v-model="distribution.end" align="right" type="date" placeholder="选择成员到期日期" :picker-options="$store.state.datePickerOptions" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary">确 定</el-button>
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
        name: "player",
        data() {
            return {
                dialogVisible: false,
                state: null,
                dateRange: null,
                surnameSearch:null,
                nameSearch:null,
                teamSearch:null,
                form:{
                    id:'',
                    name:'',
                    surname:'',
                    gender:'',
                    birthday:'',
                    height:'',
                    weight:'',
                    countryId:''
                },
                detail:{
                    birth_countryId:'',
                    birth_place:'',
                    nationality2:'',
                    preferred_side:'',
                    foot:'',
                    shoesize:'',
                    jerseysize:'',
                    shortssize:''
                },
                distribution:{
                    teamId:'',
                    roleId:'',
                    position1:'',
                    shirtnumber:'',
                    start:'',
                    end:''
                },
                roles:[],
                positions:[],
                areas:[],
                selectedRows: [],
                bucketName: "public",
                pager: {current: 1, size: 5, total: 0, records: []}
            }
        },
        created:function() {
            this.areas = [
                {text:'教练组',id:1,pid:0},
                {text:'医疗队',id:2,pid:0},
                {text:'俱乐部支持',id:3,pid:0},
                {text:'球探和比赛分析员',id:4,pid:0},
                {text:'主教练',id:11,pid:1},
                {text:'助理教练',id:12,pid:1},
                {text:'守门员教练',id:13,pid:1},
                {text:'运动教练',id:14,pid:1},
                {text:'伤病预防教练',id:15,pid:1},
                {text:'健康教练',id:16,pid:1},
                {text:'康复教练',id:17,pid:1},
                {text:'技术教练',id:18,pid:1},
                {text:'心理教练',id:19,pid:1},
                {text:'随队医生',id:21,pid:2},
                {text:'理疗医师',id:22,pid:2},
                {text:'伤病预防教练',id:23,pid:2},
                {text:'体能诊断专家',id:24,pid:2},
                {text:'医师',id:25,pid:2},
                {text:'整骨医生',id:26,pid:2},
                {text:'营养师',id:27,pid:2},
                {text:'心理学家',id:28,pid:2},
                {text:'球队经理',id:31,pid:3},
                {text:'设备管理员',id:32,pid:3},
                {text:'巴士司机',id:33,pid:3},
                {text:'反兴奋剂联系人',id:34,pid:3},
                {text:'青训营主管',id:35,pid:3},
                {text:'体育总监',id:36,pid:3},
                {text:'体育经理',id:37,pid:3},
                {text:'持牌球员部门主管',id:38,pid:3},
                {text:'青训营体育总监',id:39,pid:3},
                {text:'体能训练主管',id:310,pid:3},
                {text:'青训营协调员',id:311,pid:3},
                {text:'学院主管-初级',id:312,pid:3},
                {text:'学院主管-中级',id:313,pid:3},
                {text:'青训营体育援助',id:314,pid:3},
                {text:'体育援助',id:315,pid:3},
                {text:'教学主管',id:316,pid:3},
                {text:'教学督导协助',id:317,pid:3},
                {text:'招聘主管',id:318,pid:3},
                {text:'招聘协调员',id:319,pid:3},
                {text:'管理员',id:320,pid:3},
                {text:'球员联络官',id:321,pid:3},
                {text:'管理',id:322,pid:3},
                {text:'首席球探',id:41,pid:4},
                {text:'比赛分析员',id:42,pid:4},
                {text:'球探',id:43,pid:4},
                {text:'比赛分析主管-专家',id:44,pid:4},
                {text:'比赛分析主管-学院',id:45,pid:4},
                {text:'对手分析员',id:46,pid:4}
            ];

            var roles=this.areas.filter(function (area) {
                return area.pid == 0;
            });
            this.roles = roles;

        },
        mounted() {
            this.query();
        },
        methods: {

            getPosition:function (id) {
                var positions=this.areas.filter(function (position) {
                    return position.pid == id;
                })
                this.positions = positions;
            },
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.$http.post('http://192.168.0.253:8090/club', {
                            data: this.form
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            submit(detail) {
                this.$refs[detail].validate((valid) => {
                    if (valid) {
                        this.$http.post('http://192.168.0.253:8090/club', {
                            data: this.detail
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            submit(distribution) {
                this.$refs[distribution].validate((valid) => {
                    if (valid) {
                        this.$http.post('http://192.168.0.253:8090/club', {
                            data: this.distribution
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            add() {
                this.dialogVisible = true;
                this.form = {};
                this.detail = {};
                this.distribution = {}
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
            edit(player) {
                this.dialogVisible = true;
                this.form = player
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
