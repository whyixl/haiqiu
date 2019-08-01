<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-row :gutter="10">
          <!--<el-col :span="4">
            <el-select filterable placeholder="赛季" v-model="seasonSearch">
              <el-option :label="'中国足球协会甲级联赛2019'" :value="1"></el-option>
              <el-option :label="'内蒙古中优'" :value="2"></el-option>
            </el-select>
          </el-col>-->
          <el-col :span="4">
            <el-select filterable placeholder="球队" v-model="teamSearch">
              <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in teamList"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button icon="el-icon-search" type="primary">查询</el-button>
          </el-col>
        </el-row>
        <br>
        <el-button @click="edit(scope.row)" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
        <el-button @click="remove(scope.row.id,scope.$index)" icon="el-icon-delete" size="medium">删除</el-button>
      </div>
      
      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%" v-loading="$store.state.loading">
        <el-table-column align="center" prop="matchId" type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="轮次" prop="roundId" width="55"></el-table-column>
        <el-table-column align="center" label="日期" prop="matchDate">
          <template slot-scope="scope">
            {{ scope.row.matchDate | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="时间" prop="matchTime">
          <template slot-scope="scope">
            {{ scope.row.matchTime | timeFormatter(8) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="主队" prop="homeId">
          <template slot-scope="scope">
            {{ scope.row.homeId | idFormatter(teamList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="客队" prop="awayId">
          <template slot-scope="scope">
            {{ scope.row.awayId | idFormatter(teamList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="比分" prop="matchResult"></el-table-column>
        <el-table-column align="center" label="地点" prop="venueId"></el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small" title="编辑"></el-button>
            <router-link :to="{path: '/match/dashboard/lineup',query: {id: scope.row.name, }}">
              <el-button circle icon="el-icon-menu" size="small" style="width: 32px" title="阵容"></el-button>
            </router-link>
            <router-link :to="{path: '/match/dashboard/matchStatistics',query: {id: scope.row.name}}">
              <el-button circle icon="el-icon-news" size="small" style="width: 32px" title="统计"></el-button>
            </router-link>
            <el-button @click="remove(scope.row.id,scope.$index)" circle icon="el-icon-delete" size="small" title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页组件 -->
      <el-pagination :current-page="pager.current" :layout="$store.state.paginationLayout" :page-size="pager.size"
                     :page-sizes="[8, 10, 20, 40]"
                     :pager-count="7" :total="pager.total"
                     @current-change="pageChange" @next-click="pageChange" @prev-click="pageChange"
                     @size-change="sizeChange"
                     class="pagination text-right">
      </el-pagination>
    
    </el-card>
    
    <!-- 编辑页面 -->
    <el-dialog :visible.sync="dialogVisible" title="添加比赛">
      <el-form :label-position="'right'" label-width="80px">
        <el-form :model="matchForm" :rules="matchRule" label-width="160px" ref="matchForm">
          <el-form-item label="id" prop="id" style="display:none">
            <el-input v-model="matchForm.id"></el-input>
          </el-form-item>
          <el-form-item label="赛季名称" prop="seasonId">
            <el-select @change="querySeason" filterable placeholder="请选择赛事" style="width:50%"
                       v-model="matchForm.competitionId">
              <el-option :label="item.name" :value="item.id" v-for="item in competitionList"></el-option>
            </el-select>
            <el-select filterable placeholder="请选择赛季" style="width:50%" v-model="matchForm.seasonId">
              <el-option :label="item.name" :value="item.id" v-for="item in seasonList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="比赛时间" prop="datetime">
            <el-date-picker align="right" placeholder="选择日期" style="width: 50%;"
                            type="date" v-model="matchForm.matchDate" format="yyyy年MM月dd日"></el-date-picker>
            <el-time-picker editable align="right" placeholder="选择时间" style="width: 50%;"
                            type="time" v-model="matchForm.matchTime" value-format="HH:mm" format="HH:mm"></el-time-picker>
          </el-form-item>
          <el-form-item label="轮次ID" prop="datetime" >
            <el-input type="text" v-model="matchForm.roundId"></el-input>
          </el-form-item>
          <el-form-item label="主队" prop="homeId">
            <el-select filterable placeholder="请选择主场球队" style="width:100%" v-model="matchForm.homeId">
              <el-option v-bind:label="item.name" v-bind:value="item.id" v-for="item in teamList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客队" prop="awayId">
            <el-select filterable placeholder="请选择客场球队" style="width:100%" v-model="matchForm.awayId">
              <el-option v-bind:label="item.name" v-bind:value="item.id" v-for="item in teamList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结果" prop="matchResult">
            <el-input placeholder="请输入比赛结果" v-model="matchForm.matchResult"></el-input>
          </el-form-item>
          <el-form-item label="地点" prop="venueId">
            <el-input placeholder="请输入比赛地点" v-model="matchForm.venueId"></el-input>
          </el-form-item>
        
        </el-form>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="submit('matchForm')" type="primary">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "season",
  data() {
    return {
      selectedRows: [],
      teamList: [],
      competitionList: [],
      seasonList: [],
      matchRule: null,
      seasonSearch: null,
      teamSearch: null,
      matchForm: {
        id: "",
        seasonId: "",
        roundId: "",
        matchDate: "",
        matchTime: "",
        homeId: "",
        awayId: "",
        matchResult: "",
        venueId: ""
      },
      datetime: "",
      dialogVisible: false,
      pager: { current: 1, size: 8, total: 0, records: [] }
    };
  },
  mounted() {
    this.query();
    this.queryCompetition();
    this.queryTeam();
  },
  methods: {
    add() {
      document.getElementsByClassName("el-dialog__title")[0].innerText =
        "添加比赛";
      this.dialogVisible = true;
      this.$refs["from"].resetFields();
    },
    submit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (!this.matchForm.id) {
            this.$http
              .post("/match", this.matchForm)
              .then(res => {
                if (res.status == 200 && res.data.status == "SUCCESS") {
                  this.query();
                } else if (res.status != 200 || res.data.status == "FAILED") {
                  alert(res.data.data);
                }
              })
              .finally(() => {
                this.dialogVisible = false;
              });
          } else {
            this.$http
              .put("/match", this.matchForm)
              .then(res => {
                if (res.data.status == "SUCCESS") {
                  this.query();
                } else {
                  alert(res.data.data);
                }
              })
              .finally(() => {
                this.dialogVisible = false;
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    remove(id, rowNum) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http
          .delete("/match", {
            params: {
              id: id
            }
          })
          .then(res => {
            if (res.status === 200 && res.data.status === "SUCCESS") {
              this.pager.records.splice(rowNum, 1);
              this.pager.total--;
            }
          });
      });
    },
    deleteBatch() {
      this.$http.delete("", {
        data: {
          coIds: this.selectedRows
        }
      });
    },
    edit(rowEntity) {
      document.getElementsByClassName("el-dialog__title")[0].innerText =
        "编辑比赛";
      this.dialogVisible = true;
      this.matchForm = rowEntity;
    },
    query() {
      this.$http
        .get("/match", {
          params: {
            size: this.pager.size,
            current: this.pager.current
          }
        })
        .then(res => {
          this.pager = res.data;
        });
    },
    queryCompetition() {
      this.$http
        .get("/competition", {
          params: { size: 100, current: 1 }
        })
        .then(res => {
          this.competitionList = res.data.records;
        });
    },
    querySeason(coId) {
      this.seasonId = null;
      this.$http
        .get("/season", {
          params: {
            competitionId: coId,
            size: this.pager.size,
            current: this.pager.current
          }
        })
        .then(res => {
          this.seasonList = res.data.records;
        });
    },
    queryTeam() {
      this.$http
        .get("/team", {
          params: { size: 100, current: 1 }
        })
        .then(res => {
          this.teamList = res.data.records;
        });
    },

    // 分页组件点击事件
    pageChange(val) {
      this.pager.current = val;
      this.query();
    },
    sizeChange(val) {
      this.pager.size = val;
      this.query();
    },

    onSelectionChange(rows) {
      this.selectedRows = rows.map(item => item.id);
    }
  }
};
</script>
