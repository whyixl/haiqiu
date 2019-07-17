<template>
    <div>
        <el-card shadow="never" :body-style="{ padding: '0px' }">
            <div slot="header">
                <el-row :gutter="10">
                    <el-col :span="3">
                        <el-select v-model="teamSearch" placeholder="球队">
                            <el-option :label="'北京北体大'" :value="1"></el-option>
                            <el-option :label="'内蒙古中优'" :value="2"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <el-input placeholder="姓名" v-model="nameSearch"></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-input placeholder="英文名" v-model="surnameSearch"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-date-picker type="daterange" v-model="dateRange" align="right" unlink-panels range-separator="至" start-placeholder="查询开始日期" end-placeholder="查询结束日期" :picker-options="$store.state.dateRangePickerOptions">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-search">查询</el-button>
                    </el-col>
                </el-row>
                <br>
                <el-button size="medium" type="primary" icon="el-icon-plus" @click="dialogVisible = true">新增</el-button>
                <el-button size="medium" icon="el-icon-delete" :disabled="selectedRows.length==0">删除</el-button>
            </div>

            <el-table :data="pager.records" style="width: 100%" stripe highlight-current-row v-loading="$store.state.loading" @selection-change="onSelectionChange">

                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column align="center" prop="name" label="姓名"></el-table-column>
                <el-table-column align="center" prop="surname" label="英文名"></el-table-column>
                <el-table-column align="center" prop="gender" label="性别"></el-table-column>
                <el-table-column align="center" prop="birthday" label="出生日期" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.birthday | moment('YYYY-MM-DD') }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="height" label="身高"></el-table-column>
                <el-table-column align="center" prop="weight" label="体重"></el-table-column>
                <el-table-column  align="center" prop="team" label="所属球队"></el-table-column>
                <el-table-column  align="center" prop="role" label="位置组"></el-table-column>
                <el-table-column  align="center" prop="position" label="确切位置"></el-table-column>
                <el-table-column  align="center" prop="shirtnumber" label="球衣号"></el-table-column>
                <el-table-column align="center" prop="country" label="出生国家"></el-table-column>
                <el-table-column align="center" prop="place" label="出生地"></el-table-column>
                <el-table-column  align="center" prop="preferred_side" label="惯用脚"></el-table-column>
                <el-table-column  align="center" prop="foot" label="站立脚"></el-table-column>
                <el-table-column align="center" prop="shoesize" label="球鞋尺寸"></el-table-column>
                <el-table-column align="center" prop="jerseysize" label="球衣尺寸"></el-table-column>
                <el-table-column align="center" prop="shortssize" label="短裤尺寸"></el-table-column>
                <el-table-column align="center" prop="nationality1" label="国籍"></el-table-column>
                <el-table-column  align="center" prop="nationality2" label="第二国籍"></el-table-column>
                <el-table-column align="center" prop="start" label="生效日期" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.start | moment('YYYY-MM-DD') }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="end" label="到期日期" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.end | moment('YYYY-MM-DD') }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="edit()">编辑</el-button>
                        <el-button type="text" size="small" @click="remove()">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
          
            <el-pagination :current-page="pager.current" :page-size="pager.size" :total="pager.total" class="pagination text-right" :page-sizes="$store.state.paginationPageSizes" :layout="$store.state.paginationLayout"></el-pagination>
        </el-card>


        <el-dialog title="新增球员" :visible.sync="dialogVisible">
            <el-form :label-position="'right'" label-width="80px">
              <el-tabs>
                  <el-tab-pane label="常规信息">
                      <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="姓名" prop="form.name">
                          <el-input placeholder="请输入姓名" v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="英文名" prop="form.surname">
                          <el-input placeholder="请输入英文名" v-model="form.surname"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="form.gender">
                          <el-select v-model="form.gender" placeholder="请选择性别" style="width:100%">
                            <el-option label="男" value="true"></el-option>
                            <el-option label="女" value="false"></el-option>
                         </el-select>
                        </el-form-item>
                       <el-form-item label="身高/m" prop="form.height">
                         <el-input placeholder="请输入身高" v-model="form.height"></el-input>
                       </el-form-item>
                       <el-form-item label="体重/kg" prop="form.weight">
                         <el-input placeholder="请输入体重" v-model="form.weight"></el-input>
                       </el-form-item>
                       <el-form-item label="出生日期" prop="form.birthday">
                         <el-date-picker v-model="form.birthday" align="right" type="date" placeholder="选择日期" :picker-options="$store.state.datePickerOptions" style="width: 100%;"></el-date-picker>
                       </el-form-item>
                       <el-form-item label="出生国家" prop="form.birth_country">
                         <el-select placeholder="请输入出生国家" v-model="form.birth_country" style="width:100%">
                           <el-option label="男" value=1></el-option>
                           <el-option label="女" value=2></el-option>
                         </el-select>
                       </el-form-item>
                       <el-form-item label="出生地" prop="form.birth_place">
                         <el-input placeholder="请输入出生地" v-model="form.birth_place"></el-input>
                       </el-form-item>
                       <el-form-item label="国籍" prop="form.country">
                         <el-select placeholder="请输入国籍" v-model="form.country" style="width:100%">
                            <el-option label="男" value=1></el-option>
                            <el-option label="女" value=2></el-option>
                         </el-select>
                      </el-form-item>
                      <el-form-item label="第二国籍" prop="form.nationality2">
                         <el-input placeholder="请输入第二国籍" v-model="form.nationality2"></el-input>
                       </el-form-item>
                      </el-form>
                  </el-tab-pane>

                  <el-tab-pane label="详细信息">
                      <el-form ref="detail" :model="detail" label-width="80px">
                       <el-form-item label="惯用脚" prop="detail.preferred_side">
                          <el-select v-model="detail.preferred_side" placeholder="请选择惯用脚" style="width:100%">
                            <el-option label=" " value="null_foot"></el-option>
                            <el-option label="左脚" value="left_foot"></el-option>
                            <el-option label="右脚" value="right_foot"></el-option>
                            <el-option label="双脚" value="double_foot"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="站立脚" prop="detail.foot">
                          <el-select v-model="detail.foot" placeholder="请选择站立脚" style="width:100%">
                             <el-option label=" " value="null_foot"></el-option>
                             <el-option label="左" value="left_foot"></el-option>
                             <el-option label="右" value="right_foot"></el-option>
                             <el-option label="二者" value="double_foot"></el-option>
                           </el-select>
                        </el-form-item>
                       <el-form-item label="球鞋尺寸" prop="detail.shoesize">
                         <el-input placeholder="请输入球鞋尺寸" v-model="detail.shoesize"></el-input>
                       </el-form-item>
                      <el-form-item label="球衣尺寸" prop="detail.jerseysize">
                        <el-input placeholder="请输入球衣号" v-model="detail.jerseysize"></el-input>
                      </el-form-item>
                      <el-form-item label="短裤尺寸" prop="detail.shortssize">
                         <el-input placeholder="请输入短裤号" v-model="detail.shortssize"></el-input>
                      </el-form-item>
                      </el-form>
                  </el-tab-pane>

                  <el-tab-pane label="分配信息">
                      <el-form ref="distribution" :model="distribution" label-width="80px">
                      <el-form-item label="所属球队" prop="distribution.team">
                        <el-select  placeholder="请选择球队" v-model="distribution.team" style="width:100%" >
                          <el-option :label="'男性'" :value="1"></el-option>
                          <el-option :label="'女性'" :value="2"></el-option>
                          <el-option :label="'混合'" :value="3"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="球衣号" prop="distribution.shirtnumber">
                        <el-input placeholder="请输入球衣号" v-model="distribution.shirtnumber"></el-input>
                      </el-form-item>
                      <el-form-item label="位置"  prop="distribution.role">
                         <el-select name="" id="" @change="getPosition(distribution.role)" v-model="distribution.role"  placeholder="请选择位置组" style="width:50%;">
                           <el-option :label="role.text " v-for="role in roles" :value="role.id">{{role.text}}</el-option>
                         </el-select>
                         <el-select name="" id="" v-model="distribution.position1" placeholder="请选择具体位置" style="width:50%;">
                          <el-option :label="position.text "  v-for="position in positions":value="position.id">{{position.text}}</el-option>
                        </el-select>
                     </el-form-item>
                     <el-form-item label="生效日期" prop="distribution.start">
                       <el-date-picker v-model="distribution.start" align="right" type="date" placeholder="选择成员生效日期" :picker-options="$store.state.datePickerOptions" style="width: 100%;"></el-date-picker>
                     </el-form-item>
                     <el-form-item label="到期日期" prop="distribution.end">
                       <el-date-picker v-model="distribution.end" align="right" type="date" placeholder="选择成员到期日期" :picker-options="$store.state.datePickerOptions" style="width: 100%;"></el-date-picker>
                     </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </div>
        </el-dialog>
    </div>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-row :gutter="10">
          <el-col :span="3">
            <el-select placeholder="球队" v-model="team">
              <el-option :label="'北京北体大'" :value="1"></el-option>
              <el-option :label="'内蒙古中优'" :value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="姓名"></el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="英文名"></el-input>
          </el-col>
          <el-col :span="6">
            <el-date-picker :picker-options="$store.state.dateRangePickerOptions" align="right" end-placeholder="查询结束日期" range-separator="至" start-placeholder="查询开始日期"
                            type="daterange" unlink-panels
                            v-model="dateRange">
            </el-date-picker>
          </el-col>
          <el-col :span="6">
            <el-button icon="el-icon-search" type="primary">查询</el-button>
          </el-col>
        </el-row>
        <br>
        <el-button @click="add" icon="el-icon-plus" size="medium" type="primary">新增</el-button>
        <el-button @click="deleteBatch" :disabled="selectedRows.length===0" icon="el-icon-delete" size="medium">删除</el-button>
      </div>
      
      <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe style="width: 100%"
                v-loading="$store.state.loading">
        
        <el-table-column align="center" type="selection" width="55">
        </el-table-column>
        <el-table-column align="center" label="姓名" prop="name"></el-table-column>
        <el-table-column align="center" label="英文名" prop="surname"></el-table-column>
        <el-table-column align="center" label="性别" prop="gender"></el-table-column>
        <el-table-column align="center" label="出生日期" prop="birthday" width="100">
          <template slot-scope="scope">
            {{ scope.row.birthday | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="身高" prop="height"></el-table-column>
        <el-table-column align="center" label="体重" prop="weight"></el-table-column>
        <el-table-column align="center" label="所属球队" prop="team"></el-table-column>
        <el-table-column align="center" label="位置组" prop="role"></el-table-column>
        <el-table-column align="center" label="确切位置" prop="position"></el-table-column>
        <el-table-column align="center" label="球衣号" prop="shirtnumber"></el-table-column>
        <el-table-column align="center" label="出生国家/地区" prop="country"></el-table-column>
        <el-table-column align="center" label="出生地" prop="place"></el-table-column>
        <el-table-column align="center" label="球鞋尺寸" prop="shoesize"></el-table-column>
        <el-table-column align="center" label="惯用脚" prop="preferred_side"></el-table-column>
        <el-table-column align="center" label="球衣尺寸" prop="country"></el-table-column>
        <el-table-column align="center" label="短裤尺寸" prop="place"></el-table-column>
        <el-table-column align="center" label="国籍" prop="shoesize"></el-table-column>
        <el-table-column align="center" label="第二国籍" prop="preferred_side"></el-table-column>
        <el-table-column align="center" label="开始时间" prop="start" width="100">
          <template slot-scope="scope">
            {{ scope.row.start | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="结束时间" prop="end" width="100">
          <template slot-scope="scope">
            {{ scope.row.end | moment('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <<el-table-column align="center" fixed="right" label="操作" width="130">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small" title="编辑"></el-button>
          <el-button @click="remove(scope.row.id)" circle icon="el-icon-delete" size="small" title="删除"></el-button>
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
    
    <el-dialog :visible.sync="dialogVisible" title="新增球员">
      <el-form :label-position="'right'" label-width="80px">
        <el-form-item label="姓名">
          <el-input placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="英文名">
          <el-input placeholder="请输入英文名"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select placeholder="请选择性别" style="width:100%" v-model="test1">
            <el-option label="男" value="true"></el-option>
            <el-option label="女" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身高/m">
          <el-input placeholder="请输入身高"></el-input>
        </el-form-item>
        <el-form-item label="体重/kg">
          <el-input placeholder="请输入体重"></el-input>
        </el-form-item>
        <el-form-item label="国家/地区">
          <el-input placeholder="请输入出生国家/地区"></el-input>
        </el-form-item>
        <el-form-item label="出生地">
          <el-input placeholder="请输入出生地"></el-input>
        </el-form-item>
        <el-form-item label="球鞋尺寸">
          <el-input placeholder="请输入球鞋尺寸"></el-input>
        </el-form-item>
        <el-form-item label="惯用脚">
          <el-select placeholder="请选择惯用脚" style="width:100%" v-model="foot">
            <el-option label=" " value="null_foot"></el-option>
            <el-option label="左脚" value="left_foot"></el-option>
            <el-option label="右脚" value="right_foot"></el-option>
            <el-option label="双脚" value="double_foot"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属球队">
          <el-select placeholder="请选择球队" style="width:100%" v-model="team3">
            <el-option :label="'男性'" :value="1"></el-option>
            <el-option :label="'女性'" :value="2"></el-option>
            <el-option :label="'混合'" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="球衣号">
          <el-input placeholder="请输入球衣号"></el-input>
        </el-form-item>
        <el-form-item label="位置">
          <el-select @change="getPosition(roleName)" id="" name="" style="width:50%;" v-model="roleName">
            <el-option label="">请选择</el-option>
            <el-option :label="role.text " :value="role.id" v-for="role in roles">{{role.text}}</el-option>
          </el-select>
          <el-select id="" name="" style="width:50%;" v-model="positionName">
            <el-option value="">请选择</el-option>
            <el-option :label="position.text " :value="position.id" v-for="position in positions">{{position.text}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成员生效日期">
          <el-date-picker :picker-options="$store.state.datePickerOptions" align="right" placeholder="选择日期" style="width: 100%;"
                          type="date" v-model="start"></el-date-picker>
        </el-form-item>
        <el-form-item label="成员生效日期">
          <el-date-picker :picker-options="$store.state.datePickerOptions" align="right" placeholder="选择日期" style="width: 100%;"
                          type="date" v-model="end"></el-date-picker>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker :picker-options="$store.state.datePickerOptions" align="right" placeholder="选择日期" style="width: 100%;"
                          type="date" v-model="test"></el-date-picker>
        </el-form-item>
      </el-form>
      
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
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
        name: "player",
        data() {
            return {
                dialogVisible: false,
                state: null,
                dateRange: null,
                surnameSearch:null,
                nameSearch:null,
                teamSearch:null,
                form:{
                    name:'',
                    surname:'',
                    gender:'',
                    birthday:'',
                    height:'',
                    weight:'',
                    birth_country:'',
                    birth_place:'',
                    nationality2:'',
                    country:''
                },
                detail:{
                    preferred_side:'',
                    foot:'',
                    shoesize:'',
                    jerseysize:'',
                    shortssize:''
                },
                distribution:{
                    team:'',
                    role:'',
                    position1:'',
                    shirtnumber:'',
                    start:'',
                    end:''
                },
                roles:[],
                positions:[],
                areas:[],
                selectedRows: [],
                bucketName: "public",
                pager: {current: 1, size: 10, total: 0, records: []}
            }
        },
        created:function() {
            this.areas = [
                {text:'守门员',id:1,pid:0},
                {text:'后卫',id:2,pid:0},
                {text:'中场',id:3,pid:0},
                {text:'前锋',id:4,pid:0},
                {text:'无位置',id:5,pid:0},
                {text:'守门员',id:11,pid:1},
                {text:'左后卫',id:21,pid:2},
                {text:'右后卫',id:22,pid:2},
                {text:'中后卫',id:23,pid:2},
                {text:'左中后卫',id:24,pid:2},
                {text:'右中后卫',id:25,pid:2},
                {text:'拖后中卫',id:26,pid:2},
                {text:'自由中卫',id:27,pid:2},
                {text:'防守型中场',id:31,pid:3},
                {text:'左防守型中场',id:32,pid:3},
                {text:'右防守型中场',id:33,pid:3},
                {text:'左中场',id:34,pid:3},
                {text:'左前卫',id:35,pid:3},
                {text:'中前卫',id:36,pid:3},
                {text:'右前卫',id:37,pid:3},
                {text:'右中场',id:38,pid:3},
                {text:'攻击型中场',id:39,pid:3},
                {text:'左攻击型中场',id:310,pid:3},
                {text:'中攻击型中场',id:311,pid:3},
                {text:'右攻击型中场',id:312,pid:3},
                {text:'中锋',id:41,pid:4},
                {text:'左边锋',id:42,pid:4},
                {text:'右边锋',id:43,pid:4},
                {text:'左前锋',id:44,pid:4},
                {text:'右前锋',id:45,pid:4},
                {text:'第二前锋',id:46,pid:4},
                {text:'--',id:51,pid:5}
            ];

            var roles=this.areas.filter(function (area) {
                return area.pid == 0;
            });
            this.roles = roles;

        },
        mounted() {
            this.query();
        },
        methods: {

            getPosition:function (id) {
                var positions=this.areas.filter(function (position) {
                    return position.pid == id;
                })
                this.positions = positions;
            },
            /* query() {
                 this.$http.get('http://192.168.0.250:8090/club', {
                     params: {
                         id: 1,
                         name: '1'
                     }
                 }).then(res => {
                     this.pager = res.data;
             });
             },*/
            query() {
                this.$http.get("http://183.84.17.229/sap/en/person/pe1098").then(res => {
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
                this.$http.delete(`/oss/remove/${this.bucketName}/${file.response}`);
            }

        }
    };
</script>
