<template>
    <div>
        <el-card :body-style="{ padding: '0px' }" shadow="never">
            <div slot="header">
                <!--<el-row :gutter="10">
                    <el-col :span="4">
                        <el-select v-model="season" placeholder="赛季">
                            <el-option :label="'中国足球协会甲级联赛2019'" :value="1"></el-option>
                            <el-option :label="'内蒙古中优'" :value="2"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="team" placeholder="球队">
                            <el-option :label="'北京北体大'" :value="1"></el-option>
                            <el-option :label="'内蒙古中优'" :value="2"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-search">查询</el-button>
                    </el-col>
                </el-row>
                <br>-->
                <el-button size="medium" type="primary" icon="el-icon-plus" @click="dialogVisible = true">新增</el-button>
                <el-button size="medium" icon="el-icon-delete" :disabled="selectedRows.length==0">删除</el-button>
            </div>


            <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                      style="width: 100%" v-loading="$store.state.loading">
                <el-table-column align="center" prop="match_eventId" type="selection" width="55"></el-table-column>
                <el-table-column label="比赛名称" align="center" prop="matchId" width="180"></el-table-column>
                <el-table-column label="球队" align="center" prop="teamId" width="180"></el-table-column>
                <el-table-column label="球员" align="center" prop="personId" width="160"></el-table-column>
                <el-table-column label="球衣号" align="center" prop="shirtnumber" width="110"></el-table-column>
                <el-table-column label="分钟" align="center" prop="minute" width="110"></el-table-column>
                <el-table-column label="事件" align="center" prop="action" width="150"></el-table-column>
                <el-table-column label="类型" align="center" prop="kind" width="150"></el-table-column>
                <el-table-column label="相关球员" align="center" prop="additional_personId" width="160"></el-table-column>
                <el-table-column align="center" prop="created" label="创建时间" width="150">
                    <template slot-scope="scope">
                        {{ scope.row.created | moment('YYYY-MM-DD hh:mm') }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click="edit()" size="small" type="text">编辑</el-button>
                        <el-button @click="remove()" size="small" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>


            <!-- 分页组件 -->
            <el-pagination :current-page="pager.current" :layout="$store.state.paginationLayout" :page-size="pager.size"
                           :page-sizes="$store.state.paginationPageSizes" :total="pager.total"
                           class="pagination text-right"></el-pagination>
        </el-card>

        <!-- 编辑页面 -->
        <el-dialog :visible.sync="dialogVisible" title="添加比赛统计">
            <el-form :label-position="'right'" label-width="80px">
                <el-form :model="match_eventForm" :rules="match_eventRule" label-width="160px" ref="seasonForm">
                    <el-form-item label="id" prop="id" style="display:none" >
                        <el-input  v-model="match_eventForm.id"></el-input>
                    </el-form-item>
                    <el-form-item label="比赛名称" prop="match_eventForm.matchId" >
                        <el-select  placeholder="请选择比赛名称" v-model="match_eventForm.matchId" style="width:100%" >
                            <el-option :label="'北体大VS中优'" :value="1"></el-option>
                            <el-option :label="'北体大VS上海申鑫'" :value="2"></el-option>
                            <el-option :label="'北体大VS四川FC'" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="球队"  prop="match_eventForm.matchId">
                        <el-select  placeholder="请选择球队" v-model="match_eventForm.teamId" style="width:100%" >
                            <el-option :label="'北体大'" :value="1"></el-option>
                            <el-option :label="'中优'" :value="2"></el-option>
                            <el-option :label="'上海申鑫'" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="球员"  prop="match_eventForm.personId">
                        <el-select  placeholder="请选择球员" v-model="match_eventForm.personId" style="width:100%" >
                            <el-option :label="'王军'" :value="1"></el-option>
                            <el-option :label="'中优'" :value="2"></el-option>
                            <el-option :label="'上海申鑫'" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="相关球员"  prop="match_eventForm.additional_personId">
                        <el-select  placeholder="进球加助攻球员/替换加替下球员" v-model="match_eventForm.additional_personId" style="width:100%" >
                            <el-option :label="'王军'" :value="1"></el-option>
                            <el-option :label="'中优'" :value="2"></el-option>
                            <el-option :label="'上海申鑫'" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分钟"  prop="match_eventForm.minute">
                        <el-input placeholder="请输入分钟" v-model="match_eventForm.minute" ></el-input>
                    </el-form-item>
                    <el-form-item label="事件及类型"  prop="match_eventForm.action">
                        <el-select name="" id="" @change="getPosition(action)" v-model="match_eventForm.action" placeholder="请选择事件" style="width:50%;">
                            <!--<el-option label="">请选择事件</el-option>-->
                            <el-option :label="action.text " v-for="action in actions" :value="action.id">{{action.text}}</el-option>
                        </el-select>
                        <el-select name="" id="" v-model="match_eventForm.kind" placeholder="请选择类型" style="width:50%;">
                           <!-- <el-option value="">请选择类型</el-option>-->
                            <el-option :label="kind.text "  v-for="kind in kinds":value="kind.id">{{kind.text}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间"  prop="match_eventForm.created">
                        <el-date-picker v-model="match_eventForm.created" align="right" type="date" placeholder="选择日期" :picker-options="$store.state.datePickerOptions" style="width: 100%;"></el-date-picker>
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
                match_eventRule:null,
                match_eventForm:{
                    id:'',
                    created:'',
                    matchId:'',
                    teamId:'',
                    lineupname:'',
                    personId:'',
                    additional_personId:'',
                    action:'',
                    kind:'',
                    minute:''

                },
                actions:[],
                kinds:[],
                areas:null,
                dialogVisible: false,
                pager: {current: 1, size: 10, total: 0, records: []}
            };
        },
        created:function() {
            this.areas = [
                {text:'进球',id:1,pid:0},
                {text:'黄牌',id:2,pid:0},
                {text:'红牌',id:3,pid:0},
                {text:'第二张黄牌',id:4,pid:0},
                {text:'替补',id:5,pid:0},
                {text:'点球决胜',id:6,pid:0},
                {text:'左脚',id:11,pid:1},
                {text:'右脚',id:12,pid:1},
                {text:'头球',id:13,pid:1},
                {text:'任意球',id:14,pid:1},
                {text:'直接任意球',id:15,pid:1},
                {text:'点球',id:16,pid:1},
                {text:'足跟踢球',id:17,pid:1},
                {text:'倒钩球',id:18,pid:1},
                {text:'乌龙球',id:19,pid:1},
                {text:'其他',id:120,pid:1},
                {text:null,id:21,pid:2},
                {text:null,id:31,pid:3},
                {text:null,id:41,pid:4},
                {text:null,id:51,pid:5},
                {text:'命中',id:61,pid:6}
            ];

            var actions=this.areas.filter(function (area) {
                return area.pid == 0;
            });
            this.actions = actions;

        },
        mounted() {
            this.query();
        },
        methods: {
            getPosition:function (id) {
                var kinds=this.areas.filter(function (kind) {
                    return kind.pid == id;
                })
                this.kinds = kinds;
            },
            submit(match_eventForm) {
                this.$refs[match_eventForm].validate((valid) => {
                    if (valid) {
                        this.$http.post('http://192.168.0.253:8090/club', {
                            data: this.match_eventForm
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            add() {
                this.dialogVisible = true;
                this.match_eventForm = {}
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
            edit(match_event) {
                this.dialogVisible = true;
                this.match_eventForm = match_event
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
