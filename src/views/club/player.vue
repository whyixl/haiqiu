<template>
    <div>
        <el-card shadow="never" :body-style="{ padding: '0px' }">
            <div slot="header">
                <el-row :gutter="10">
                    <el-col :span="3">
                        <el-select v-model="team" placeholder="球队">
                            <el-option :label="'北京北体大'" :value="1"></el-option>
                            <el-option :label="'内蒙古中优'" :value="2"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <el-input placeholder="姓名"></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-input placeholder="英文名"></el-input>
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
                <el-button size="medium" icon="el-icon-upload2">导入</el-button>
                <el-button size="medium" icon="el-icon-download">导出</el-button>
                <el-button size="medium" icon="el-icon-delete" :disabled="selectedRows.length==0">删除</el-button>
            </div>

            <el-table :data="pager.records" style="width: 100%" stripe highlight-current-row v-loading="$store.state.loading" @selection-change="onSelectionChange">

                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column align="center" prop="name" label="姓名"></el-table-column>
                <el-table-column align="center" prop="surname" label="英文名"></el-table-column>
                <el-table-column align="center" prop="gender" label="性别"></el-table-column>
                <el-table-column align="center" prop="birthday" label="出生日期" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.birthday | moment('YYYY-MM-DD') }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="height" label="身高"></el-table-column>
                <el-table-column align="center" prop="weight" label="体重"></el-table-column>
                <el-table-column align="center" prop="country" label="出生国家/地区"></el-table-column>
                <el-table-column align="center" prop="place" label="出生地"></el-table-column>
                <el-table-column align="center" prop="shoesize" label="鞋子尺寸"></el-table-column>
                <el-table-column  align="center" prop="preferred_side" label="惯用脚"></el-table-column>
                <el-table-column  align="center" prop="team" label="所属球队"></el-table-column>
                <el-table-column  align="center" prop="role" label="位置组"></el-table-column>
                <el-table-column  align="center" prop="position" label="确切位置"></el-table-column>
                <el-table-column  align="center" prop="shirtnumber" label="球衣号"></el-table-column>
                <el-table-column align="center" prop="start" label="开始时间" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.start | moment('YYYY-MM-DD') }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="end" label="结束时间" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.end | moment('YYYY-MM-DD') }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="edit()">编辑</el-button>
                        <el-button type="text" size="small" @click="remove()">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :current-page="pager.current" :page-size="pager.size" :total="pager.total" class="pagination text-right" :page-sizes="$store.state.paginationPageSizes" :layout="$store.state.paginationLayout"></el-pagination>
        </el-card>


        <el-dialog title="新增球员" :visible.sync="dialogVisible">
            <el-form :label-position="'right'" label-width="80px">
                <el-form-item label="姓名">
                    <el-input placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="英文名">
                    <el-input placeholder="请输入英文名"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="test1" placeholder="请选择性别" style="width:100%">
                        <el-option label="男" value="true"></el-option>
                        <el-option label="女" value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="身高/m">
                    <el-input placeholder="请输入身高"></el-input>
                </el-form-item>
                <el-form-item label="体重/kg">
                    <el-input placeholder="请输入体重"></el-input>
                </el-form-item>
                <el-form-item label="国家/地区">
                    <el-input placeholder="请输入出生国家/地区"></el-input>
                </el-form-item>
                <el-form-item label="出生地">
                    <el-input placeholder="请输入出生地"></el-input>
                </el-form-item>
                <el-form-item label="鞋子尺寸">
                    <el-input placeholder="请输入鞋子尺寸"></el-input>
                </el-form-item>
                <el-form-item label="惯用脚">
                    <el-select v-model="foot" placeholder="请选择惯用脚" style="width:100%">
                        <el-option label=" " value="null_foot"></el-option>
                        <el-option label="左脚" value="left_foot"></el-option>
                        <el-option label="右脚" value="right_foot"></el-option>
                        <el-option label="双脚" value="double_foot"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属球队">
                    <el-input placeholder="请输入所属球队"></el-input>
                </el-form-item>
                <el-form-item label="球衣号">
                    <el-input placeholder="请输入球衣号"></el-input>
                </el-form-item>
                <el-form-item label="位置" >
                    <el-select name="" id="" @change="getPosition(roleName)" v-model="roleName"  style="width:50%;">
                        <el-option label="">请选择</el-option>
                        <el-option :label="role.text " v-for="role in roles" :value="role.id">{{role.text}}</el-option>
                    </el-select>
                    <el-select name="" id="" v-model="positionName" style="width:50%;">
                        <el-option value="">请选择</el-option>
                        <el-option :label="position.text "  v-for="position in positions":value="position.id">{{position.text}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker v-model="start" align="right" type="date" placeholder="选择日期" :picker-options="$store.state.datePickerOptions" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker v-model="end" align="right" type="date" placeholder="选择日期" :picker-options="$store.state.datePickerOptions" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="出生日期">
                    <el-date-picker v-model="test" align="right" type="date" placeholder="选择日期" :picker-options="$store.state.datePickerOptions" style="width: 100%;"></el-date-picker>
                </el-form-item>
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
                test: null,
                test1: null,
                foot: null,
                start: null,
                end: null,
                roles:[],
                roleName:'',
                positions:[],
                daterange:null,
                areas:[],
                positionName:'',
                selectedRows: [],
                bucketName: "public",
                pager: {current: 1, size: 10, total: 0, records: []}
            }
        },
        created:function() {
            this.areas = [
                {text:'守门员',id:1,pid:0},
                {text:'后卫',id:2,pid:0},
                {text:'中场',id:3,pid:0},
                {text:'前锋',id:4,pid:0},
                {text:'无位置',id:5,pid:0},
                {text:'守门员',id:11,pid:1},
                {text:'左后卫',id:21,pid:2},
                {text:'右后卫',id:22,pid:2},
                {text:'中后卫',id:23,pid:2},
                {text:'左中后卫',id:24,pid:2},
                {text:'右中后卫',id:25,pid:2},
                {text:'拖后中卫',id:26,pid:2},
                {text:'自由中卫',id:27,pid:2},
                {text:'防守型中场',id:31,pid:3},
                {text:'左防守型中场',id:32,pid:3},
                {text:'右防守型中场',id:33,pid:3},
                {text:'左中场',id:34,pid:3},
                {text:'左前卫',id:35,pid:3},
                {text:'中前卫',id:36,pid:3},
                {text:'右前卫',id:37,pid:3},
                {text:'右中场',id:38,pid:3},
                {text:'攻击型中场',id:39,pid:3},
                {text:'左攻击型中场',id:310,pid:3},
                {text:'中攻击型中场',id:311,pid:3},
                {text:'右攻击型中场',id:312,pid:3},
                {text:'中锋',id:41,pid:4},
                {text:'左边锋',id:42,pid:4},
                {text:'右边锋',id:43,pid:4},
                {text:'左前锋',id:44,pid:4},
                {text:'右前锋',id:45,pid:4},
                {text:'第二前锋',id:46,pid:4},
                {text:'--',id:51,pid:5}
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
            /* query() {
                 this.$http.get('http://192.168.0.250:8090/club', {
                     params: {
                         id: 1,
                         name: '1'
                     }
                 }).then(res => {
                     this.pager = res.data;
             });
             },*/
            query() {
                this.$http.get("http://183.84.17.229/sap/en/person/pe1098").then(res => {
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
