<template>
    <div>
        <el-card :body-style="{ padding: '0px' }" shadow="never">
            <!-- 人员列表 -->
            <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                      style="width: 100%" v-loading="$store.state.loading">
                <el-table-column align="center" label="姓名" prop="name">
                    <template slot-scope="scope">
                        {{ scope.row.personId | idFormatter(personList)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="球队" prop="teamId">
                    <template slot-scope="scope">
                        {{ scope.row.teamId | idFormatter(teamList)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="角色" prop="roleId">
                    <template slot-scope="scope">
                        {{scope.row.roleId==1 ? '守门员' : scope.row.roleId==2 ? '后卫' :scope.row.roleId==3 ? '中场' :scope.row.roleId==4 ? '前锋'
                        :scope.row.roleId==5 ? '主教练' :scope.row.roleId==6 ? '助力教练' :scope.row.roleId==7 ? '守门员教练' :scope.row.roleId==56 ? '运动教练'
                        :scope.row.roleId==59 ? '随队医生' :scope.row.roleId==60 ? '俱乐部支持' :scope.row.roleId==61 ? '理疗师' :'无位置'}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="球衣号" prop="shirtnumber"></el-table-column>
                <el-table-column align="center" label="生效日期" prop="start">
                    <template slot-scope="scope">
                        {{ scope.row.start | moment('YYYY-MM-DD') }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="到期日期" prop="end">
                    <template slot-scope="scope">
                        {{ scope.row.end | moment('YYYY-MM-DD') }}
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
                name: '',
                teamId: '',
                roleId: '',
                shirtnumber: '',
                start: '',
                end: '',
                selectedRows: [],
                teamList: [],
                personList: [],
                bucketName: "public",
                pager: {current: 1, size: 10, total: 0, records: []}
            }
        },
        created() {
            this.peId = this.$route.query.personId;
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
            queryRole() {
                this.$http.get("/role", {params: {current: 1, size: 100}}).then(res => {
                    this.roleList = res.data.records;
                })
            },
            queryTeamByPerson() {
                this.$http.get('/teamPerson/selectByPerson', {
                    params: {
                        size: this.pager.size,
                        current: this.pager.current,
                        peId: this.peId,
                    }
                }).then(res => {
                    this.pager = res.data;
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
