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
                <el-table-column align="center" prop="competitionId" type="selection" width="55"></el-table-column>
                <el-table-column label="比赛名称" align="center" prop="name" width="180"></el-table-column>
                <el-table-column label="球队" align="center" prop="team" width="150"></el-table-column>
                <el-table-column label="阵型名" align="center" prop="lineupname" width="120"></el-table-column>
                <el-table-column label="球员" align="center" prop="playerName" width="100"></el-table-column>
                <el-table-column label="球衣号" align="center" prop="playerNum" width="100"></el-table-column>
                <el-table-column label="球员类型" align="center" prop="playerType" width="90"></el-table-column>
                <el-table-column label="球员位置" align="center" prop="position" width="90"></el-table-column>
                <el-table-column label="场上位置X" align="center" prop="xPosition" width="100"></el-table-column>
                <el-table-column label="场上位置Y" align="center" prop="yPosition" width="100"></el-table-column>
                <el-table-column label="操作人员" align="center" prop="person" width="100"></el-table-column>
                <el-table-column label="数据来源" align="center" prop="dataSource" width="100"></el-table-column>
                <el-table-column label="操作" align="center" width="120">
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
        <el-dialog :visible.sync="dialogVisible" title="添加阵型">
            <el-form :label-position="'right'" label-width="80px">
                <el-form :model="seasonForm" :rules="seasonRule" label-width="160px" ref="seasonForm">
                    <el-form-item label="比赛名称" prop="name" >
                        <el-select  placeholder="请选择比赛名称" v-model="match" style="width:100%" >
                            <el-option :label="'北体大VS中优'" :value="1"></el-option>
                            <el-option :label="'北体大VS上海申鑫'" :value="2"></el-option>
                            <el-option :label="'北体大VS四川FC'" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="球队" >
                        <el-select  placeholder="请选择球队" v-model="team6" style="width:100%" >
                            <el-option :label="'北体大'" :value="1"></el-option>
                            <el-option :label="'中优'" :value="2"></el-option>
                            <el-option :label="'上海申鑫'" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="阵型名" >
                        <el-select  placeholder="请选择阵型名" v-model="lineup" style="width:100%" >
                            <el-option :label="'3-1-2-1-3'" :value="1"></el-option>
                            <el-option :label="'3-1-4-2'" :value="2"></el-option>
                            <el-option :label="'3-2-4-1'" :value="3"></el-option>
                            <el-option :label="'3-3-3-1'" :value="4"></el-option>
                            <el-option :label="'3-4-1-2'" :value="5"></el-option>
                            <el-option :label="'3-4-2-1'" :value="6"></el-option>
                            <el-option :label="'3-4-3'" :value="7"></el-option>
                            <el-option :label="'3-5-1-1'" :value="8"></el-option>
                            <el-option :label="'3-5-2'" :value="9"></el-option>
                            <el-option :label="'4-1-2-1-2'" :value="10"></el-option>
                            <el-option :label="'4-1-3-2'" :value="11"></el-option>
                            <el-option :label="'4-1-4-1'" :value="12"></el-option>
                            <el-option :label="'4-2-2-2'" :value="13"></el-option>
                            <el-option :label="'4-2-3-1'" :value="14"></el-option>
                            <el-option :label="'4-2-4'" :value="15"></el-option>
                            <el-option :label="'4-3-1-2'" :value="16"></el-option>
                            <el-option :label="'4-3-2-1'" :value="17"></el-option>
                            <el-option :label="'4-3-3'" :value="18"></el-option>
                            <el-option :label="'4-4-1-1'" :value="19"></el-option>
                            <el-option :label="'4-4-2'" :value="20"></el-option>
                            <el-option :label="'4-5-1'" :value="21"></el-option>
                            <el-option :label="'5-3-2'" :value="22"></el-option>
                            <el-option :label="'5-4-1'" :value="23"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="球员" >
                        <el-select  placeholder="请选择球员" v-model="player1" style="width:100%" >
                            <el-option :label="'王军'" :value="1"></el-option>
                            <el-option :label="'中优'" :value="2"></el-option>
                            <el-option :label="'上海申鑫'" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="球员类型" >
                        <el-select  placeholder="请选择球员类型" v-model="playerType" style="width:100%" >
                            <el-option :label="'首发'" :value="1"></el-option>
                            <el-option :label="'替补'" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="球员位置">
                        <el-input placeholder="请输入球员位置"></el-input>
                    </el-form-item>
                    <el-form-item label="场上位置X">
                        <el-input placeholder="请输入场上位置X"></el-input>
                    </el-form-item>
                    <el-form-item label="场上位置Y">
                        <el-input placeholder="请输入场上位置Y"></el-input>
                    </el-form-item>
                    <el-form-item label="操作人员">
                        <el-input placeholder="请输入操作人员"></el-input>
                    </el-form-item>
                    <el-form-item label="数据来源">
                        <el-input placeholder="请输入数据来源"></el-input>
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
                seasonRule:null,
                match:null,
                team6:null,
                lineup:null,
                player1:null,
                playerType:null,
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
