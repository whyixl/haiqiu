<template>
  <div>

    <el-card :body-style="{ padding: '0px' }" shadow="never">
      <div slot="header">
        <el-button @click="dialogVisible=true" size="medium" type="primary">上传文件</el-button>
        <el-button @click="deleteBatch" :disabled="selectedRows.length===0" icon="el-icon-delete" size="medium">删除
        </el-button>
      </div>

      <div style="width: 100%">
        <el-table :data="pager.records" @selection-change="onSelectionChange" highlight-current-row stripe
                  style="width: 100%" v-loading="$store.state.loading">
          <el-table-column align="center" prop="clubId" type="selection"></el-table-column>
          <el-table-column align="center" label="文件名称" prop="name"></el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" circle icon="el-icon-edit" size="small" title="预览"></el-button>
              <el-button @click="remove(scope.row.id)" circle icon="el-icon-delete" size="small"
                         title="删除"></el-button>
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
    <el-dialog :visible.sync="dialogVisible" title="上传PDF" style="width: 1000px; position: center">

      <el-upload
          class="upload-demo inline-block"
          style="left: 20px;"
          action="http://183.84.17.233:8090/xmlparse/fileHandle/pdfB"
          :on-error="error"
          :http-request="uploadPdf"
          :before-upload="beforeUploadMatchBefore">
        <el-button size="medium" type="primary">赛前报告</el-button>
      </el-upload>
      <span style="position: center; color: red;margin-left: 50px">确认上传的文件是否正确</span>
      <el-upload
          class="upload-demo inline-block "
          style="float:right"
          action="http://183.84.17.233:8090/xmlparse/fileHandle/pdfA"
          :on-error="error"
          :http-request="uploadPdf"
          :before-upload="beforeUploadMatchAfter">
        <el-button size="medium" type="primary">赛后报告</el-button>
      </el-upload>
      <br/>
      <br/>
      <span style="position: center; color: red;margin-left: 83px">注意：此功能仅限于创冰赛前与赛后报告的修改</span>

    </el-dialog>

  </div>
</template>

<script>
    export default {
        name: "PdfEditor",
        data() {
            return {
                fileList: [],
                selectedRows: [],
                dialogVisible: false,
                pager: {current: 1, size: 10, total: 0, records: []}
            }
        },
        methods: {
            handleChange() {

            },
            beforeUploadMatchAfter(file) {
                let type = file.type;
                let name = file.name.toString();
                let reg = /体能|赛前/;
                if (type !== "application/pdf") {
                    this.$notify.error({
                        title: '文件类型错误',
                        duration: 1800,
                        message: "提示:只能上传PDF文件"
                    });
                    return false;
                }
                if (name.match(reg)) {
                    this.$notify.error({
                        title: '文件内容错误',
                        duration: 5000,
                        message: "提示:" + name
                    });
                    return false;
                }

            },
            beforeUploadMatchBefore(file) {
                let type = file.type;
                let name = file.name.toString();
                if (type !== "application/pdf") {
                    this.$notify.error({
                        title: '文件类型错误',
                        duration: 5000,
                        message: "提示:只能上传PDF文件"
                    });
                    return false;
                }
                if (name.includes("体能") || name.includes("VS") || name.includes("vs")) {
                    this.$notify.error({
                        title: '文件内容错误',
                        duration: 5000,
                        message: "提示:" + name
                    });
                    return false;
                }
            },
            error(err) {
                this.$notify.error({
                    title: '上传过程错误',
                    duration: 5000,
                    message: err
                });
            },
            uploadPdf(param) {
                let url = param.action;
                let formData = new FormData();
                formData.append("file",param.file);
                this.$message({
                    message:"文件上传中，请稍后",
                    showClose:true,
                    type:'success'
                });
                this.$http.post(url,formData, {
                    headers: {'Content-Type':'multipart/form-data'},
                    responseType: 'blob'
                }).then(res => {
                    const blob = new Blob([res.data], {type: 'application/octet-stream;charset=utf-8'});
                    if ('download' in document.createElement('a')) { // 非IE下载
                        const link = document.createElement('a');
                        link.download = param.file.name;
                        link.style.display = 'none';
                        link.href = URL.createObjectURL(blob);
                        document.body.appendChild(link);
                        link.click();
                        URL.revokeObjectURL(link.href);// 释放URL 对象
                        document.body.removeChild(link)
                    } else { // IE10+下载
                        navigator.msSaveBlob(blob, param.file.name)
                    }
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
            },
            remove(id, flag) {
                if (flag) {
                    this.$http.delete('/fileHandle', {
                        params: {
                            id: id
                        }
                    }).then(this.query);
                }
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http.delete('/pdf', {
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
                        this.$http.delete("/club", {
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
        }
    }
</script>

<style scoped>

</style>