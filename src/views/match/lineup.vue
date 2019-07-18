<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-button @click="dialogVisible = true" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
        <el-button :disabled="selectedRows.length===0" icon="el-icon-delete" size="medium">删除</el-button>
      </div>
      
      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%" v-loading="$store.state.loading">
        <el-table-column align="center" prop="lineupId" type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="比赛名称" prop="matchId" width="180"></el-table-column>
        <el-table-column align="center" label="球队" prop="teamId" width="150"></el-table-column>
        <el-table-column align="center" label="阵型名" prop="lineupname" width="120"></el-table-column>
        <el-table-column align="center" label="球员" prop="playerId" width="100"></el-table-column>
        <el-table-column align="center" label="球衣号" prop="playerNum" width="100"></el-table-column>
        <el-table-column align="center" label="球员类型" prop="playerType" width="90"></el-table-column>
        <el-table-column align="center" label="球员位置" prop="position" width="90"></el-table-column>
        <el-table-column align="center" label="场上位置X" prop="xPosition" width="100"></el-table-column>
        <el-table-column align="center" label="场上位置Y" prop="yPosition" width="100"></el-table-column>
        <el-table-column align="center" label="操作人员" prop="person" width="100"></el-table-column>
        <el-table-column align="center" label="数据来源" prop="dataSource" width="100"></el-table-column>
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
    <el-dialog :visible.sync="dialogVisible" title="添加阵型">
      <el-form :label-position="'right'" label-width="80px">
        <el-form :model="lineupForm" :rules="lineupRule" label-width="160px" ref="seasonForm">
          <el-form-item label="比赛名称" prop="lineupForm.matchId">
            <el-select placeholder="请选择比赛名称" style="width:100%" v-model="lineupForm.matchId">
              <el-option :label="'北体大VS中优'" :value="1"></el-option>
              <el-option :label="'北体大VS上海申鑫'" :value="2"></el-option>
              <el-option :label="'北体大VS四川FC'" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="球队" prop="lineupForm.teamId">
            <el-select placeholder="请选择球队" style="width:100%" v-model="lineupForm.teamId">
              <el-option :label="'北体大'" :value="1"></el-option>
              <el-option :label="'中优'" :value="2"></el-option>
              <el-option :label="'上海申鑫'" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="阵型名" prop="lineupForm.lineupname">
            <el-select placeholder="请选择阵型名" style="width:100%" v-model="lineupForm.lineupname">
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
          <el-form-item label="球员" prop="lineupForm.playerId">
            <el-select placeholder="请选择球员" style="width:100%" v-model="lineupForm.playerId">
              <el-option :label="'王军'" :value="1"></el-option>
              <el-option :label="'中优'" :value="2"></el-option>
              <el-option :label="'上海申鑫'" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="球员类型" prop="lineupForm.playerType">
            <el-select placeholder="请选择球员类型" style="width:100%" v-model="lineupForm.playerType">
              <el-option :label="'首发'" :value="1"></el-option>
              <el-option :label="'替补'" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="球员位置" prop="lineupForm.position">
            <el-input placeholder="请输入球员位置" v-model="lineupForm.position"></el-input>
          </el-form-item>
          <el-form-item label="场上位置X" prop="lineupForm.xposition">>
            <el-input placeholder="请输入场上位置X" v-model="lineupForm.xposition"></el-input>
          </el-form-item>
          <el-form-item label="场上位置Y" prop="lineupForm.yposition">
            <el-input placeholder="请输入场上位置Y" v-model="lineupForm.yposition"></el-input>
          </el-form-item>
          <el-form-item label="操作人员" prop="lineupForm.person">
            <el-input placeholder="请输入操作人员" v-model="lineupForm.person" ></el-input>
          </el-form-item>
          <el-form-item label="数据来源" prop="lineupForm.dataSource">>
            <el-input placeholder="请输入数据来源" v-model="lineupForm.dataSource"></el-input>
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
                lineupRule: null,
                lineupForm:{
                    matchId: '',
                    teamId: '',
                    lineupname: '',
                    playerId: '',
                    playerType: '',
                    playerNum: '',
                    position: '',
                    xposition: '',
                    yposition: '',
                    dataSource:'',
                    person:''
                },
                dialogVisible: false,
                pager: {current: 1, size: 10, total: 0, records: []}
            };
        },
        mounted() {
            this.query();
        },
        methods: {
            submit(lineupForm) {
                this.$refs[lineupForm].validate((valid) => {
                    if (valid) {
                        this.$http.post('http://192.168.0.253:8090/club', {
                            data: this.lineupForm
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            add() {
                this.dialogVisible = true;
                this.lineupForm = {}
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
            edit(lineup) {
                this.dialogVisible = true;
                this.lineupForm = lineup
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
