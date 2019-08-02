<template>
    <div>
        <el-card :body-style="{ padding: '0px' }" shadow="never">
            <div slot="header">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-select clearable  filterable placeholder="父级菜单" v-model="menusByLink">
                            <el-option :label=item :value=item v-for="item in linkList"></el-option>
                        </el-select>
                    </el-col>
                <el-col :span="6">
                <el-button @click="queryByLink" icon="el-icon-search" type="primary">查询</el-button>
                </el-col>
                </el-row>
                <br>
                <el-button @click="add" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
                <el-button @click="deleteBatch" :disabled="selectedRows.length===0" icon="el-icon-delete" size="medium">
                    删除
                </el-button>
            </div>

            <div style="width: 100%">
                <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                          style="width: 100%" v-loading="$store.state.loading">
                    <el-table-column align="center" prop="menuId" type="selection"></el-table-column>
                    <el-table-column align="center" label="menuName" prop="menuName"></el-table-column>
                    <el-table-column align="center" label="menuCode" prop="menuCode"></el-table-column>
                    <el-table-column align="center" label="parentLink" prop="parentLink"></el-table-column>
                    <el-table-column align="center" label="link" prop="link"></el-table-column>
                    <el-table-column align="center" label="icon" prop="icon"></el-table-column>
                    <el-table-column align="center" label="lft" prop="lft"></el-table-column>
                    <el-table-column align="center" label="rgt" prop="rgt"></el-table-column>
                    <el-table-column align="center" label="depth" prop="depth"></el-table-column>
                    <el-table-column align="center" label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small"
                                       title="编辑"></el-button>
                            <el-button @click="remove(scope.row.id,scope.$index)" circle icon="el-icon-delete"
                                       size="small" title="删除"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 赛季列表结束 -->

            <!-- 分页组件 -->
            <el-pagination :current-page="pager.current" :layout="$store.state.paginationLayout" :page-size="pager.size"
                           :page-sizes="$store.state.paginationPageSizes"
                           :pager-count="5" :total="pager.total"
                           @current-change="pageChange" @next-click="pageChange" @prev-click="pageChange"
                           @size-change="sizeChange"
                           class="pagination text-right">
            </el-pagination>
        </el-card>

        <!-- 编辑页面 -->
        <el-dialog id="dialog" :visible.sync="dialogVisible" title="添加菜单">
            <el-form :label-position="'right'" label-width="80px">
                <el-form :model="menusForm" :rules="menusRule" label-width="160px" ref="menusForm">
                    <el-form-item style="display: none;" label="menuId" prop="menuId">
                        <el-input v-model="menusForm.id"></el-input>
                    </el-form-item>
                    <el-form-item label="menuName" prop="menuName">
                        <el-input placeholder="请输入menuName " v-model="menusForm.menuName"></el-input>
                    </el-form-item>
                    <el-form-item label="menuCode" prop="menuCode">
                        <el-input placeholder="请输入menuCode " v-model="menusForm.menuCode"></el-input>
                    </el-form-item>
                    <el-form-item label="parentLink" prop="parentLink">
                        <el-input placeholder="请输入parentLink " v-model="menusForm.parentLink"></el-input>
                    </el-form-item>
                    <el-form-item label="link" prop="link">
                        <el-input placeholder="请输入link " v-model="menusForm.link"></el-input>
                    </el-form-item>
                    <el-form-item label="icon" prop="icon">
                        <el-input placeholder="请输入icon " v-model="menusForm.icon"></el-input>
                    </el-form-item>
                    <el-form-item label="lft" prop="lft">
                        <el-input placeholder="请输入lft " v-model="menusForm.lft"></el-input>
                    </el-form-item>
                    <el-form-item label="rgt" prop="rgt">
                        <el-input placeholder="请输入rgt " v-model="menusForm.rgt"></el-input>
                    </el-form-item>
                    <el-form-item label="depth" prop="depth">
                        <el-input placeholder="请输入depth " v-model="menusForm.depth"></el-input>
                    </el-form-item>
                </el-form>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button @click="submit('menusForm')" type="primary">提 交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "menusPO",
        data() {
            return {
                menusForm: {
                    id: '',
                    menuName: '',
                    menuCode: '',
                    parentLink:'',
                    link: '',
                    icon: '',
                    lft: '',
                    rgt: '',
                    depth: ''
                },
                menusByLink:null,
                linkList: [],
                menusRule: null,
                selectedRows: [],
                dialogVisible: false,
                pager: {current: 1, size: 10, total: 0, records: []}
            };
        },
        mounted() {
            this.query();
            this.selectMenusByLink();
        },
        methods: {
            add() {
                document.getElementById('dialog').getElementsByClassName("el-dialog__title")[0].innerText = "新增菜单";
                this.dialogVisible = true;
                this.menusForm = {}
            },
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if (this.menusForm.id) {
                            this.$http.post('/menus',
                                this.menusForm
                            ).then(res => {
                                if (res.data.status == 'SUCCESS') {
                                    this.query();
                                } else if (res.data.status == 'FAILED') {
                                    alert(res.data.data);
                                }
                            }).finally(() => {
                                this.dialogVisible = false;
                            })
                        } else {
                            this.$http.put('/menus',
                                this.menusForm
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
            deleteBatch() {
                this.$http.delete('', {
                    data: {
                        menusID: this.selectedRows
                    }
                })
            },
            edit(rowEntity) {
                document.getElementById('dialog').getElementsByClassName("el-dialog__title")[0].innerText = "编辑菜单";
                this.dialogVisible = true;
                this.menusForm = rowEntity
            },
            query() {
                this.$http.get('/menus', {
                    params: {
                        size: this.pager.size,
                        current: this.pager.current
                    },
                }).then(res => {
                    this.pager = res.data;
                });
            },
            queryByLink() {
                this.$http.get('/menus/parentLinks', {
                    params: {
                        size: this.pager.size,
                        current: this.pager.current,
                        parentLink:this.menusByLink
                    },
                }).then(res => {
                    this.pager = res.data;
                });
            },
            onSelectionChange(rows) {
                this.selectedRows = rows.map(item => item.userId);
            },
            remove(id, rowNUm) {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http.delete('/menus', {
                        params: {
                            id: id
                        }
                    }).then(res => {
                        if (res.status === 200 && res.data.status === 'SUCCESS') {
                            this.pager.records.splice(rowNUm, 1)
                        }
                    })
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
            selectMenusByLink() {
                this.$http.get("/menus/link", {params: {current: 1, size: 100}}).then(res => {
                    this.linkList = res.data.records;
                })
            },
        }
    };
</script>
