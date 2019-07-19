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
            menuId: 9,
            menuName: "赛事赛季",
            menuCode: "competition",
            link: "/competition",
            icon: "el-icon-menu",
            lft: 11,
            rgt: 13,
            depth: 1
        },

        {
            menuId: 10,
            menuName: "赛季",
            menuCode: "season",
            link: "/competition/season",
            icon: "el-icon-menu",
            lft: 12,
            rgt: 13,
            depth: 2
        },
        {
            menuId: 11,
            menuName: "球队",
            menuCode: "team",
            link: "/competition/team",
            icon: "el-icon-menu",
            lft: 13,
            rgt: 14,
            depth: 2
        },
        {
            menuId: 12,
            menuName: "轮次",
            menuCode: "round",
            link: "/competition/round",
            icon: "el-icon-menu",
            lft: 14,
            rgt: 15,
            depth: 3
        },
        {
            menuId: 12,
            menuName: "比赛信息",
            menuCode: "match",
            link: "/match",
            icon: "el-icon-menu",
            lft: 18,
            rgt: 25,
            depth: 1
        },

       {
            menuId: 14,
            menuName: "首发阵容",
            menuCode: "lineup",
            link: "/match/lineup",
            icon: "el-icon-menu",
            lft: 19,
            rgt: 20,
            depth: 3
        },
        {
            menuId: 15,
            menuName: "比赛统计",
            menuCode: "matchStatistics",
            link: "/match/matchStatistics",
            icon: "el-icon-menu",
            lft: 19,
            rgt: 19,
            depth: 3
        }
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

Mock.mock("http://192.168.79.1/passport/signIn", "post", signIn);
Mock.mock("http://192.168.79.1/user/queryUserAuthority", "get", queryUserAuthority);
Mock.mock("http://192.168.79.1/user", "get", queryUser);
