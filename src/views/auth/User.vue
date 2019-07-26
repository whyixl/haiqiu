<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">

        <br>
        <el-button @click="dialogVisible = true" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
        <el-button :disabled="selectedRows.length==0" icon="el-icon-delete" size="medium">删除</el-button>
      </div>

      <!-- 用户列表 -->
      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%"
                v-loading="$store.state.loading">
        <el-table-column align="center" prop="id" type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="姓名" prop="name"></el-table-column>
        <el-table-column align="center" label="手机" prop="phone" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column align="center" label="角色" prop="gender">
          <template slot-scope="scope">
            {{scope.row.roleId ? (scope.row.roleId == "1" ? "管理员" : "普通用户") : scope.row.roleId}}
          </template>
        </el-table-column>

        <el-table-column align="center" fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small" title="编辑"></el-button>
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

    <el-dialog id="dialog" :visible.sync="dialogVisible" title="新增用户">
      <el-form :label-position="'right'" label-width="80px">
            <el-form :model="form" label-width="80px" ref="form">
              <el-form-item label="id" prop="id" style="display:none">
                <el-input v-model="form.id"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="form.name">
                <el-input placeholder="请输入姓名" v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="form.phone">
                <el-input placeholder="请输入手机" v-model="form.phone"></el-input>
              </el-form-item>
              <el-form-item label="角色" prop="form.roleId">
                <el-select filterable placeholder="请选择角色" style="width:100%" v-model="form.roleId">
                  <el-option label="管理员" value="1"></el-option>
                  <el-option label="普通用户" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-form>

      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="submit('form')" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "player",
        data() {
            return {
                form: {
                    "id": '',
                    "name": '',
                    "password": '',
                    "phone": '',
                    "roleId": '',
                    "roleName": ''
                },
                detail: {
                    birth_countryId: '',
                    birth_place: '',
                    nationality2: '',
                    preferred_side: '',
                    foot: '',
                    shoesize: '',
                    jerseysize: '',
                    shortssize: ''
                },
                distribution: {
                    teamId: '',
                    roleId: '',
                    position1: '',
                    shirtnumber: '',
                    start: '',
                    end: ''
                },
                dialogVisible: false,
                state: null,
                dateRange: null,
                surnameSearch: null,
                nameSearch: null,
                teamSearch: null,
                teamList: [],
                countryList: [],
                roles: [],
                positions: [],
                areas: [],
                selectedRows: [],
                bucketName: "public",
                pager: {current: 1, size: 10, total: 0, records: []}
            }
        },
        mounted() {
            this.query();
        },
        methods: {
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if(!this.form.id) {
                            // 新增
                            this.$http.post('/user',
                                this.form
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
                            this.$http.put('/user',
                                this.form
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
                document.getElementById('dialog').getElementsByClassName("el-dialog__title")[0].innerText = "新增用户";
                this.dialogVisible = true;
                this.form = {};
                this.detail = {};
                this.distribution = {}
            },
            remove(id, rowNum) {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http.delete('/user', {
                        params: {
                            id: id
                        }
                    }).then(res => {
                        if (res.status === 200 && res.data.status === 'SUCCESS') {
                            this.pager.total--;
                            this.pager.records.splice(rowNum, 1)
                        }
                    })
                });
            },
            deleteBatch() {
                this.$http.delete('', {
                    data: {
                        coIds: this.selectedRows
                    }
                })
            },
            edit(player) {
                document.getElementById('dialog').getElementsByClassName("el-dialog__title")[0].innerText = "编辑用户";
                this.dialogVisible = true;
                this.form = player
            },
            query() {
                this.$http.get('/user', {
                    params: {
                        size: this.pager.size,
                        current: this.pager.current
                    },
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
