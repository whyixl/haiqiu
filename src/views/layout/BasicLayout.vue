<template>
    <el-container>
        <el-aside class="sidebar" v-bind:class="{'sidebar-collapse':isCollapse}">
            <el-header class="logo">
                <img src="@/assets/logo.png">
                <h1>Hiqiu Admin</h1>
            </el-header>
            <el-menu :collapse="isCollapse" :default-active="$route.path" :router="true">
                <!-- 如果没有子级就这样 -->
                <el-menu-item :index="menu.link" :key="menu.menuId" v-for="menu in this.$store.state.menuTree"
                              v-if="menu.children.length===0">
                    <i :class="menu.icon"></i>
                    <span slot="title">{{menu.menuName}}</span>
                </el-menu-item>
                <!-- 如果有子级，继续循环 -->
                <el-submenu :index="menu.link" v-else>
                    <template slot="title">
                        <i :class="menu.icon"></i>
                        <span slot="title">{{menu.menuName}}</span>
                    </template>
                    <el-menu-item :index="child.link" :key="child.menuId" v-for="child in menu.children">
                        <i :class="menu.icon"></i>
                        <span slot="title">{{child.menuName}}</span>
                    </el-menu-item>
                </el-submenu>

            </el-menu>
        </el-aside>
        <el-container>
            <el-header class="header">
                <i @click="isCollapse=!isCollapse" class="el-icon-menu sidebarToggle"></i>
                <div class="float-right">
                    <el-dropdown @command="handleCommand" class="header-action" trigger="click">
                        <span>{{name}}<i class="el-icon-arrow-down el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="Competition"><i class="el-icon-setting"></i> 个人设定
                            </el-dropdown-item>
                            <el-dropdown-item command="SignOut"><i class="el-icon-refresh"></i> 安全退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-main>
                <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :key="item.meta.menuName" v-for="(item,index) in $route.matched" v-if="index!=0"
                                        :to="{path: item.path, query: {coId: coId}}" >
                        {{ item.meta.menuName}}
                    </el-breadcrumb-item>
                </el-breadcrumb>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    export default {
        name: "App",
        data() {
            return {
                isCollapse: false,
                name: window.localStorage.getItem('userName'),
                coId: window.localStorage.getItem('coId')
            };
        },
        methods: {
            handleCommand(command) {
                switch (command) {
                    case "Competition":
                        this.$router.push({path: "/system/competition"});
                        break;
                    case "SignOut":
                        this.signOut();
                        break;
                }
            },
            signOut() {
                this.$store.dispatch("signOut").then(() => {
                    this.$router.push({path: "/"});
                });
            }
        }
    };
</script>
