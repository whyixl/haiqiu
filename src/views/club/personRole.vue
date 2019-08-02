<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <!-- 人员列表 -->
      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                style="width: 100%" v-loading="$store.state.loading">
        <el-table-column align="center" label="姓名" prop="name"></el-table-column>
        <el-table-column align="center" label="领域" prop="roleId"></el-table-column>
        <el-table-column align="center" label="角色" prop="position1"></el-table-column>
        <el-table-column align="center" label="球衣号" prop="shirtnumber"></el-table-column>
        <el-table-column align="center" label="生效日期" prop="start" >
          <template slot-scope="scope">
            {{ scope.row.start ? (scope.row.start | moment('YYYY-MM-DD')) : scope.row.start }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="到期日期" prop="end" >
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
                id:'',
                name:'',
                    teamId: '',
                    roleId: '',
                    position1: '',
                    shirtnumber: '',
                    start: '',
                    end: '',
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
