const Mock = require("mockjs");

const signIn = () => ({
    token: "12321"});

const queryUserAuthority = () => ({
    menus: [
        {
            menuId: 1,
            menuName: "根节点",
            menuCode: "root",
            link: "/root",
            icon: "el-icon-menu",
            lft: 1,
            rgt: 30,
            depth: 0
        },
        {
            menuId: 2,
            menuName: "俱乐部",
            menuCode: "club",
            link: "/club",
            icon: "el-icon-menu",
            lft: 4,
            rgt: 9,
            depth: 1
        },
        {
            menuId: 3,
            menuName: "首页",
            menuCode: "dashboard",
            link: "/club/dashboard",
            icon: "el-icon-menu",
            lft: 5,
            rgt: 6,
            depth: 2
        },
        {
            menuId: 4,
            menuName: "球队",
            menuCode: "team",
            link: "/club/team",
            icon: "el-icon-menu",
            lft: 5,
            rgt: 6,
            depth: 2
        },
        {
            menuId: 5,
            menuName: "球员",
            menuCode: "player",
            link: "/club/player",
            icon: "el-icon-menu",
            lft: 7,
            rgt: 8,
            depth: 2
        },
        {
            menuId: 6,
            menuName: "职员",
            menuCode: "staff",
            link: "/club/staff",
            icon: "el-icon-menu",
            lft: 7,
            rgt: 8,
            depth: 2
        },

        {
            menuId: 7,
            menuName: "数据管理",
            menuCode: "system",
            link: "/system",
            icon: "el-icon-menu",
            lft: 14,
            rgt: 19,
            depth: 1
        },
        {
            menuId: 9,
            menuName: "赛事赛季",
            menuCode: "competition",
            link: "/system/competition",
            icon: "el-icon-menu",
            lft: 15,
            rgt: 16,
            depth: 2
        },
        {
            menuId: 10,
            menuName: "人员管理",
            menuCode: "person",
            link: "/system/person",
            icon: "el-icon-menu",
            lft: 15,
            rgt: 16,
            depth: 3
        },
        {
            menuId: 11,
            menuName: "比赛信息",
            menuCode: "match",
            link: "/system/match",
            icon: "el-icon-menu",
            lft: 15,
            rgt: 18,
            depth: 2
        }/*,

       {
            menuId: 13,
            menuName: "主数据管理",
            menuCode: "mdm",
            link: "/mdm",
            icon: "el-icon-menu",
            lft: 10,
            rgt: 13,
            depth: 1
        },
        {
            menuId: 14,
            menuName: "业务字典",
            menuCode: "dict",
            link: "/mdm/dict",
            icon: "el-icon-menu",
            lft: 11,
            rgt: 12,
            depth: 2
        }*/
    ],
    authorities: [
        {
            authority_id: 1,
            authority_code: "AddUser",
            authority_name: "新增用户"
        },
        {
            authority_id: 2,
            authority_code: "EditUser",
            authority_name: "修改用户"
        },
        {
            authority_id: 3,
            authority_code: "DeleteUser",
            authority_name: "删除用户"
        },
        {
            authority_id: 4,
            authority_code: "QueryUser",
            authority_name: "查询用户"
        },
        {
            authority_id: 5,
            authority_code: "QueryReport",
            authority_name: "查询报告"
        }
    ]
});

const queryUser = () => ({
    total: 10,
    size: 4,
    current: 1,
    records: [
        {
            userId: 1,
            userName: "guest",
            password: "$2a$10$llOd5/mvInD.OTVkPr/hqeFaa6wX4DCbtKIJwRq5vhKLd3mJNtLqi",
            nation: 86,
            phone: 15985859933,
            avatar: null,
            email: "test@test.com",
            gender: null,
            birthday: "2018-07-16T00:50:31.000+0000",
            enabled: false,
            type: 1,
            createDate: "2018-07-16T00:50:31.000+0000",
            lastDate: "2018-07-16T00:50:31.000+0000",
            signInDate: "2018-07-16T00:50:31.000+0000"
        },
        {
            userId: 2,
            userName: "user",
            password: "$2a$10$llOd5/mvInD.OTVkPr/hqeFaa6wX4DCbtKIJwRq5vhKLd3mJNtLqi",
            nation: 86,
            phone: 15985859933,
            avatar: null,
            email: "test@test.com",
            gender: null,
            birthday: "2018-07-16T00:50:31.000+0000",
            enabled: true,
            type: 1,
            createDate: "2018-07-16T00:50:31.000+0000",
            lastDate: "2018-07-16T00:50:31.000+0000",
            signInDate: "2018-07-16T00:50:31.000+0000"
        },
        {
            userId: 3,
            userName: "user",
            password: "$2a$10$llOd5/mvInD.OTVkPr/hqeFaa6wX4DCbtKIJwRq5vhKLd3mJNtLqi",
            nation: 86,
            phone: 15985859933,
            avatar: null,
            email: "test@test.com",
            gender: null,
            birthday: "2018-07-16T00:50:31.000+0000",
            enabled: true,
            type: 1,
            createDate: "2018-07-16T00:50:31.000+0000",
            lastDate: "2018-07-16T00:50:31.000+0000",
            signInDate: "2018-07-16T00:50:31.000+0000"
        },
        {
            userId: 4,
            userName: "user",
            password: "$2a$10$llOd5/mvInD.OTVkPr/hqeFaa6wX4DCbtKIJwRq5vhKLd3mJNtLqi",
            nation: 86,
            phone: 15985859933,
            avatar: null,
            email: "test@test.com",
            gender: null,
            birthday: "2018-07-16T00:50:31.000+0000",
            enabled: true,
            type: 1,
            createDate: "2018-07-16T00:50:31.000+0000",
            lastDate: "2018-07-16T00:50:31.000+0000",
            signInDate: "2018-07-16T00:50:31.000+0000"
        }
    ],
    pages: 2
});

Mock.mock("/passport/signIn", "post", signIn);
Mock.mock("/user/queryUserAuthority", "get", queryUserAuthority);
Mock.mock("/user", "get", queryUser);
