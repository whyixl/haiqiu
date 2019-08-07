<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <!-- 人员列表 -->
      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%" v-loading="$store.state.loading">
        <el-table-column align="center" label="姓名" prop="name" width="150"></el-table-column>
        <!--<template slot-scope="scope">-->
          <!--{{ scope.row.personId | idFormatter(personList)}}-->
        <!--</template>-->
        <el-table-column align="center" label="球队" prop="teamId" width="150"></el-table-column>
        <!--<template slot-scope="scope">-->
          <!--{{ scope.row.teamId | idFormatter(teamList)}}-->
        <!--</template>-->
        <el-table-column align="center" label="角色" prop="roleId" width="150"></el-table-column>
        <!--<template slot-scope="scope">-->
          <!--{{ scope.row.roleId | idFormatter(roleList)}}-->
        <!--</template>-->
        <el-table-column align="center" label="球衣号" prop="shirtnumber" width="150"></el-table-column>
        <!--<template slot-scope="scope">-->
          <!--{{ scope.row.shirtnumber | teamPersonList.shirtnumber}}-->
        <!--</template>-->
        <el-table-column align="center" label="生效日期" prop="start"  width="190">
          <template slot-scope="scope">
            {{ scope.row.start ? (scope.row.start | moment('YYYY-MM-DD')) : scope.row.start }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="到期日期" prop="end" width="190" >
          <template slot-scope="scope">
            {{ scope.row.end ? (scope.row.end | moment('YYYY-MM-DD')) : scope.row.end}}
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
  </div>
</template>

<script>
    export default {
        name: "personRole",
        data() {
            return {
                    name:'',
                    teamId: '',
                    roleId: '',
                    shirtnumber: '',
                    start: '',
                    end: '',
                selectedRows: [],
                bucketName: "public",
                pager: {current: 1, size: 10, total: 0, records: []}
            }
        },

        mounted() {
            this.queryTeam();
            this.queryPerson();
            this.queryRole();
            this.queryTeamByPerson();
        },
        methods: {
            queryTeam() {
                this.$http.get("/team", {params: {current: 1, size: 100}}).then(res => {
                    this.teamList = res.data.records;
                })
            },
            queryPerson() {
                this.$http.get("/person", {params: {current: 1, size: 10000}}).then(res => {
                    this.personList = res.data.records;
                })
            },
            // queryRole(){
            //     this.$http.get("/role", {params: {current: 1, size: 100}}).then(res => {
            //         this.roleList = res.data.records;
            //     })
            // },
            // queryTeamByPerson(val) {
            //     this.$http.get('/team/selectByPerson', {params: {personId: val}})
            //         .then(res => {
            //             this.teamPersonList = res.data;
            //         })
            // },
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
