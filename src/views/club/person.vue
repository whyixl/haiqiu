<template>
    <div>
        <el-card :body-style="{ padding: '0px' }" shadow="never">
            <div slot="header">
                <!-- 查询功能暂时屏蔽 -->
                <!--<el-row :gutter="10">-->
                    <!--<el-col :span="3">-->
                        <!--<el-input placeholder="姓名" v-model="nameSearch"></el-input>-->
                    <!--</el-col>-->
                    <!--<el-col :span="3">-->
                        <!--<el-input placeholder="英文名" v-model="surnameSearch"></el-input>-->
                    <!--</el-col>-->
                    <!--<el-col :span="2">-->
                        <!--<el-button @click="query" icon="el-icon-search" type="primary">查询</el-button>-->
                    <!--</el-col>-->
                <!--</el-row>-->
                <!--<br>-->
                <el-button @click="add" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
                <el-button @click="deleteBatch" :disabled="selectedRows.length==0" icon="el-icon-delete" size="medium">
                    删除
                </el-button>
            </div>

            <!-- 人员列表 -->
            <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                      style="width: 100%" v-loading="$store.state.loading">
                <el-table-column align="center" prop="personId" type="selection" width="55"></el-table-column>
                <el-table-column align="center" label="姓名" prop="name"></el-table-column>
                <el-table-column align="center" label="英文名" prop="surname" show-overflow-tooltip
                                 width="100"></el-table-column>
                <el-table-column align="center" label="性别" prop="gender">
                    <template slot-scope="scope">
                        {{scope.row.gender ? (scope.row.gender == "male" ? "男" : "女") : scope.row.gender}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="出生日期" prop="birthday" width="100">
                    <template slot-scope="scope">
                        {{scope.row.birthday | moment('YYYY-MM-DD') }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="身高/CM" prop="height"></el-table-column>
                <el-table-column align="center" label="体重/KG" prop="weight"></el-table-column>
                <el-table-column align="center" label="国籍" prop="countryId">
                    <template slot-scope="scope">
                        {{scope.row.countryId | idFormatter(countryList)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="出生国家" prop="personDetail.birthCountryId">
                    <template slot-scope="scope">
                        {{scope.row.personDetail.birthCountryId | idFormatter(countryList)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="出生地" prop="personDetail.birthPlace"></el-table-column>
                <el-table-column align="center" label="惯用脚" prop="personDetail.preferredSide">
                    <template slot-scope="scope">
                    {{scope.row.personDetail.preferredSide=="left_foot" ? '左脚' : scope.row.personDetail.preferredSide=="right_foot" ?  '右脚' :scope.row.personDetail.preferredSide=="double_foot" ?  '双脚'  :'--'}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="球鞋尺寸" prop="personDetail.shoesize"></el-table-column>
               <!-- <el-table-column align="center" label="第二国籍" prop="personDetail.nationality2">
                    <template slot-scope="scope">
                        {{scope.row.personDetail.nationality2 | idFormatter(countryList)}}
                    </template>
                </el-table-column>-->
                <el-table-column align="center" fixed="right" label="操作" width="140">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small"
                                   title="编辑"></el-button>
                        <router-link :to="{path: '/club/player/personRole', query: {personId: scope.row.id}}">
                            <el-button circle icon="el-icon-menu" size="small" style="width: 32px"
                                       title="分配信息查看"></el-button>
                        </router-link>
                        <el-button @click="remove(scope.row.id, scope.$index)" circle icon="el-icon-delete" size="small"
                                   title="删除"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页组件 -->
            <el-pagination :current-page="pager.current" :layout="$store.state.paginationLayout" :page-size="pager.size"
                           :page-sizes="$store.state.paginationPageSizes"
                           :pager-count="7" :total="pager.total"
                           @current-change="pageChange" @next-click="pageChange" @prev-click="pageChange"
                           @size-change="sizeChange"
                           class="pagination text-right">
            </el-pagination>
        </el-card>

        <el-dialog :visible.sync="dialogVisible" title="新增人员">
            <el-form :label-position="'right'" label-width="80px">
                <el-tabs>
                    <el-tab-pane label="常规信息">
                        <el-form :model="person" label-width="80px" ref="person">
                            <el-form-item label="id" prop="id" style="display:none">
                                <el-input v-model="person.id"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名" prop="name">
                                <el-input placeholder="请输入姓名" v-model="person.name"></el-input>
                            </el-form-item>
                            <el-form-item label="英文名" prop="surname">
                                <el-input placeholder="请输入英文名" v-model="person.surname"></el-input>
                            </el-form-item>
                            <el-form-item label="性别" prop="gender">
                                <el-select clearable filterable placeholder="请选择性别" style="width:100%"
                                           v-model="person.gender">
                                    <el-option label="男" value="male"></el-option>
                                    <el-option label="女" value="female"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="身高/cm" prop="height">
                                <el-input placeholder="请输入身高" v-model="person.height"></el-input>
                            </el-form-item>
                            <el-form-item label="体重/kg" prop="weight">
                                <el-input placeholder="请输入体重" v-model="person.weight"></el-input>
                            </el-form-item>
                            <el-form-item label="出生日期" prop="birthday">
                                <el-date-picker align="right"
                                                placeholder="选择日期"
                                                style="width: 100%;"
                                                type="date" v-model="person.birthday"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="国籍" prop="country">
                                <el-select filterable placeholder="请输入国籍" style="width:100%" v-model="person.countryId">
                                    <el-option :label="item.name" :value="item.id"
                                               v-for="item in countryList"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>

                    <el-tab-pane label="详细信息">
                        <el-form :model="personDetail" label-width="80px" ref="personDetail">
                            <el-form-item label="出生国家" prop="birth_country">
                                <el-select filterable placeholder="请输入出生国家" style="width:100%"
                                           v-model="personDetail.birthCountryId">
                                    <el-option :label="item.name" :value="item.id"
                                               v-for="item in countryList"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="出生地" prop="birth_place">
                                <el-input placeholder="请输入出生地" v-model="personDetail.birthPlace"></el-input>
                            </el-form-item>
                            <el-form-item label="第二国籍" prop="nationality2">
                                <el-input placeholder="请输入第二国籍" v-model="personDetail.nationality2"></el-input>
                            </el-form-item>
                            <el-form-item label="惯用脚" prop="preferred_side">
                                <el-select filterable placeholder="请选择惯用脚" style="width:100%"
                                           v-model="personDetail.preferredSide">
                                    <el-option label="--" value="null_foot"></el-option>
                                    <el-option label="左脚" value="left_foot"></el-option>
                                    <el-option label="右脚" value="right_foot"></el-option>
                                    <el-option label="双脚" value="double_foot"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="站立脚" prop="foot">
                                <el-select filterable placeholder="请选择站立脚" style="width:100%"
                                           v-model="personDetail.foot">
                                    <el-option label="--" value="null_foot"></el-option>
                                    <el-option label="左" value="left_foot"></el-option>
                                    <el-option label="右" value="right_foot"></el-option>
                                    <el-option label="二者" value="double_foot"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="球鞋尺寸" prop="shoesize">
                                <el-input placeholder="请输入球鞋尺寸" v-model="personDetail.shoesize"></el-input>
                            </el-form-item>
                            <el-form-item label="球衣尺寸" prop="jerseysize">
                                <el-input placeholder="请输入球衣号" v-model="personDetail.jerseysize"></el-input>
                            </el-form-item>
                            <el-form-item label="短裤尺寸" prop="shortssize">
                                <el-input placeholder="请输入短裤号" v-model="personDetail.shortssize"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button @click="submit('person')" type="primary">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "player",
        data() {
            return {
                person: {
                    id: '',
                    name: '',
                    surname: '',
                    gender: '',
                    birthday: '',
                    height: '',
                    weight: '',
                    countryId: ''
                },
                personDetail: {
                    birthCountryId: '',
                    birthPlace: '',
                    preferredSide: '',
                    foot: '',
                    shoesize: '',
                    jerseysize: '',
                    shortssize: ''
                },
                dialogVisible: false,
                state: null,
                dateRange: null,
                surnameSearch: null,
                nameSearch: null,
                teamSearch: null,
                teamList: [],
                countryList: [],
                selectedRows: [],
                bucketName: "public",
                pager: {current: 1, size: 10, total: 0, records: []}
            }
        },
        mounted() {
            this.query();
            this.queryTeam();
            this.queryCountry();
        },
        methods: {
            getPosition: function (id) {
                const positions = this.areas.filter(function (position) {
                    return position.pid == id;
                });
                this.positions = positions;
            },
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if (!this.person.id) {
                            // 新增
                            this.$http.post('/person',
                                {person: this.person, personDetail: this.personDetail}
                            ).then(res => {
                                if (res.data.status == 'SUCCESS') {
                                    this.query();
                                } else if (res.data.status == 'FAILED' && !res.data.data) {
                                    alert(res.data.data);
                                }
                            }).finally(() => {
                                this.dialogVisible = false;
                            })
                        } else {
                            // 修改
                            this.$http.put('/person',
                                {person: this.person, personDetail: this.personDetail}
                            ).then(res => {
                                if (res.data.status == 'SUCCESS') {
                                    this.query();
                                } else {
                                    alert("修改失败")
                                }
                            }).finally(() => {
                                this.dialogVisible = false;
                            })
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            add() {
                document.getElementsByClassName("el-dialog__title")[0].innerText = "添加人员";
                this.dialogVisible = true;
                this.person = {};
                this.personDetail = {};
            },
            remove(id, rowNum) {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http.delete('/person', {
                        params: {
                            id: id
                        }
                    }).then(this.query);
                });
            },
            deleteBatch() {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let temp = 1;
                    for (let i = 0; i < this.selectedRows.length; i++) {
                        this.$http.delete("/person", {
                            params: {
                                id: this.selectedRows[i]
                            },
                        }).then(res => {
                            if (res.status != 200) {
                                alert("批量删除遇到问题，请重试");
                            }
                            if (temp++ == this.selectedRows.length) {
                                this.query();
                            }
                        });
                    }
                });
            },
            edit(person) {
                document.getElementsByClassName("el-dialog__title")[0].innerText = "编辑人员";
                this.dialogVisible = true;
                this.person = person;
                this.personDetail = person.personDetail
            },
            query() {
                this.$http.get('/person', {
                    data: {
                        surnameSearch: this.surnameSearch,
                        nameSearch: this.nameSearch,
                        teamSearch: this.teamSearch,
                        dateRange: this.dateRange
                    },
                    headers: {
                        /*Content-Type: application/json*/
                    },
                    params: {
                        size: this.pager.size,
                        current: this.pager.current
                    },
                }).then(res => {
                    this.pager = res.data
                });
            },
            queryTeam() {
                this.$http.get("/team", {params: {current: 1, size: 100}}).then(res => {
                    this.teamList = res.data.records;
                })
            },
            queryCountry() {
                this.$http.get("/country",).then(res => {
                    this.countryList = res.data;
                    return res.data;
                })
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
