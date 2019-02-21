<template>
    <el-card class="box">
    <!-- 面包屑 --> 
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

    <!-- 搜索+添加 -->
        <el-row class="seartBox">
            <el-col>
                <!-- 搜索框 -->
                <el-input @clear="getAllUsers()" clearable class="seartInput" placeholder="请输入内容" v-model="query">
                    <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
                </el-input>
                <!-- 添加按钮 -->
                <el-button type="success" plain @click="showDiaAddUser()">添加用户</el-button>
            </el-col>
        </el-row>

    <!-- 表格 -->
        <el-table height="250px" :data="list" style="width: 100%">
        <!--
            id: 500
            username: "admin"
            email: "adsfad@qq.com"
            mobile: "12345678"
            create_time: 1486720211
            mg_state: true
            role_name: "主管"
        -->
            <el-table-column prop="id" label="#" width="80"></el-table-column>
            <el-table-column prop="username" label="姓名" width="120"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
            <el-table-column prop="mobile" label="电话" width="140"></el-table-column>

            <!--日期格式要处理->过滤器->2类+3步
                fmtdate的使用
                1. v-bind:
                2. {{msg | fmdate}}
            -->
            <el-table-column prop="create_time" label="创建日期" width="140">
                <template slot-scope="scope">
                    {{scope.row.create_time | fmtdate}}
                </template>
            </el-table-column>
            
            <el-table-column label="用户状态" width="140">
                <template slot-scope="scope"> 
                    <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click="showDiaEditUser(scope.row)" type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
                    <el-button @click="showMsgBoxDele(scope.row)" type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
                    <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
                </template>
            </el-table-column>
        </el-table>

    <!-- 分页
        @size-change 每页条数改变时
        @current-change 页码改变时（当前1页  点击2页）
        current-page 当前显示第几页  页码
        page-sizes 每页条数的不同情况的数组
        layout 附加功能
        total 一共数据的条数
     -->
     
        <el-pagination
            class="page"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[2, 4, 6, 8]"
            :page-size="2"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"> 
        </el-pagination>
        <!-- 添加用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
            <!-- 表单 -->
            <el-form label-position="left" label-width="80px" :model="formdata">
                <el-form-item label="用户名">
                    <el-input v-model="formdata.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="formdata.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="formdata.email"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="formdata.mobile"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
                <el-button type="primary" @click="addUser()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 对话框-编辑用户对话框 -->
        <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
            <!-- 表单 -->
            <el-form label-position="left" label-width="80px" :model="formdata">
                <el-form-item label="用户名">
                    <el-input disabled v-model="formdata.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="formdata.email"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="formdata.mobile"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
                <el-button type="primary" @click="editUser()">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
    export default{
        data(){
            return {
                query:"",
                pagenum: 1,
                pagesize: 2,
                total: -1,
                // 表格数据
                list: [],
                // 对话框
                dialogFormVisibleAdd: false,
                dialogFormVisibleEdit: false,
                // 表单数据 -> 发送post请求
                formdata: {
                    username: "",
                    password: "",
                    email: "",
                    mobile: ""
                }
            };
        },
        created(){
            this.getTableData()
        },
        methods: {
            // 编辑 - 发送请求
            async editUser() {
                // id -> user.id -> user -> 1data(没有)  2方法实参(没有)
                // this.formdata上一步已经是user
                const res = await this.$http.put(`users/${this.formdata.id}`,this.formdata);
                console.log(res);
                const{
                    meta: {msg, status}
                    } = res.data;
                    if (status === 200) {
                        // 关闭表格
                        this.dialogFormVisibleEdit = false;
                        // 更新表格
                        this.getTableData();
                    }
            },
            // 编辑 - 展示对话框
            showDiaEditUser(user){
                // 获取当前用户的数据 <- 
                this.formdata = user;
                this.dialogFormVisibleEdit = true;
            },
            // 删除 - 展示确认框
            showMsgBoxDele(user){
                // console.log(user);
                this.$confirm('是否删除用户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    // id -> 用户id数据 -> user.id
                    const res = await this.$http.delete(`users/${user.id}`);
                    // console.log(res);
                    const {
                        meta: { msg, status }
                    } = res.data;
                    if (status === 200) {
                        this.$message.success(msg);
                        this.pagenum = 1;
                        this.getTableData();
                    }
                    this.$message.success("删除成功");
                }).catch(() => {
                    this.$message.info("已取消删除");
                    });
            },
            // 添加 -   发送请求
            async addUser(){
            // 发送请求
                const res = await this.$http.post(`users`,this.formdata);
                console.log(res);
                const {meta:{msg,status}} = res.data;
                if(status === 201) {
                //     关闭对话框
                this.dialogFormVisibleAdd = false;
                // 更新表格
                this.getTableData();
                }
            },
            // 添加用户-打开对话框
            showDiaAddUser(){
                this.dialogFormVisibleAdd = true;
                this.formdata = {};
            },
            // 清空时获取所有用户
            getAllUsers(){
                this.getTableData();
            },
            // 搜索用户
            searchUser(){
                // 按照query关键字搜索
                // query=""
                this.pagenum = 1;
                this.getTableData()
            },
            // 分页相关的方法
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pagenum = 1;
                this.pagesize = val;
                this.getTableData()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.pagenum = val;
                this.getTableData()
            },
            // 获取表格数据
            async getTableData(){
                // 除了登录请求，其他所有请求都需要授权->
                // 在发送请求之前先设置请求头{Authorization:token值}
                // 设置请求头 -> 
                const AUTH_TOKEN = localStorage.getItem("token");
                this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN;

                const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
                // console.log(res)
                const {data,meta:{msg,status}} = res.data;
                if (status === 200) {
                    this.list = data.users;
                    this.total = data.total;
                    // console.log(this.list);
                }
            }
        }
    };
</script>

<style>
    .box {
        height: 100%;
    }
    .seartBox {
        margin-top: 20px; 
    }
    .seartInput {
        width: 350px;
    }
    .page {
        margin-top: 20px;
    }
</style>