import Vue from "vue";
import _ from "lodash";
import Router from "vue-router";
import SignIn from "@/views/SignIn";
import store from "@/store";

Vue.use(Router);

const BasicLayout = () => import("@/views/layout/BasicLayout.vue");

export const constantRouter = [
  { path: "/", name: "signIn", component: SignIn, meta: { anonymous: true } }
];

export const asyncRouter = [
  {
    path: "/club",
    component: BasicLayout,
    children: [
      {
        path: "/club/dashboard",
        name: "dashboard",
        component: () => import("@/views/club/dashboard.vue")
      },
      {
        path: "/club/team",
        name: "team",
        component: () => import("@/views/club/team.vue")
      },
      {
        path: "/club/player",
        name: "player",
        component: () => import("@/views/club/player.vue")
      },
      {
        path: "/club/staff",
        name: "staff",
        component: () => import("@/views/club/staff.vue")
      }
    ]
  },
    {
        path: "/club",
        component: {
            render: c => c("router-view")
        },
        children: [
            {
                path: "/club/team",
                name: "team",
                component: BasicLayout,
                children:[
                    {
                        path: "/club/team/teamStaff",
                        name: "teamStaff",
                        component: () => import("@/views/club/teamStaff.vue")
                    },
                    {
                        path: "/club/team/teamPlayer",
                        name: "teamPlayer",
                        component: () => import("@/views/club/teamPlayer.vue")
                    }
                ]
            },

        ]
    },
  {
    path: "/competition",
    component: BasicLayout,
    children: [
      {
        path: "/competition/dashboard",
        name: "dashboard",
        component: () => import("@/views/competition/dashboard.vue")
      }
    ]
  },
  {
    path: "/competition",
    component: {
      render: c => c("router-view")
    },
    children: [
      {
        path: "/competition/dashboard",
        name: "dashboard",
        component: BasicLayout,
        children: [
          {
            path: "/competition/dashboard/season",
            name: "season",
            component: () => import("@/views/competition/season.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/competition",
    component: {
      render: c => c("router-view")
    },
    children: [
      {
        path: "/competition/dashboard",
        name: "dashboard",
        component: {
          render: c => c("router-view")
        },
        children: [
          {
            path: "/competition/dashboard/season",
            name: "season",
            component: BasicLayout,
            children: [
              {
                path: "/competition/dashboard/season/team",
                name: "team",
                component: () => import("@/views/competition/team.vue")
              },
              {
                path: "/competition/dashboard/season/round",
                name: "round",
                component: () => import("@/views/competition/round.vue")
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: "/match",
    component: BasicLayout,
    children: [
      {
        path: "/match/dashboard",
        name: "match_dashboard",
        component: () => import("@/views/match/dashboard.vue")
      }
    ]
  },
  {
    path: "/match",
    component: {
      render: c => c("router-view")
    },
    children: [
      {
        path: "/match/dashboard",
        name: "match_dashboard",
        component: BasicLayout,
        children: [
          {
            path: "/match/dashboard/lineup",
            name: "lineup",
            component: () => import("@/views/match/lineup.vue")
          },
          {
            path: "/match/dashboard/matchStatistics",
            name: "matchStatistics",
            component: () => import("@/views/match/matchStatistics.vue")
          }
        ]
      }
    ]
  }
];

const router = new Router({ mode: "history", routes: constantRouter });

// 是否有权限访问某个路径
const hasPermission = toPath => {
  const links = _.map(store.state.menus, "link");
  return _.indexOf(links, toPath) > 0;
};

// 根据菜单生成路由的菜单元数据
const generateMenuName = route => {
  const menu = _.find(store.state.menus, { link: route.path });
  if (!menu) {
    return;
  }
  const menuName = menu.menuName;
  if (route.meta) {
    route.meta.menuName = menuName;
  } else {
    route.meta = { menuName };
  }
  _.forEach(route.children, child => {
    generateMenuName(child);
  });
};

// 动态生成路由表
const generateRoutes = () =>
  _.filter(asyncRouter, route => {
    const flag = hasPermission(route.path);
    if (flag) {
      generateMenuName(route);
    }
    return flag;
  });

// 导航之前拦截器
router.beforeEach((to, from, next) => {
  if (to.meta.anonymous) {
    next();
    return;
  }

  // 没有Token，尝试从本地存储中重新加载Token
  if (store.state.token == null) {
    const token = localStorage.getItem("token");
    if (token != null && token.toUpperCase() !== "NULL") {
      store.commit("setToken", token);
    }
  }

  // 有Token
  if (store.state.token != null) {
    // 没有菜单信息，重新从服务器加载菜单
    if (store.state.menus.length === 0) {
      store
        .dispatch("reloadUserAuthority")
        .then(() => {
          const routes = generateRoutes();
          router.addRoutes(routes);
          next({ ...to, replace: true });
        })
        .catch(() => {
          next("/");
        });
    } else if (hasPermission(to.path)) {
      next();
    } else {
      // 无权限访问，返回到登陆页面
      next("/");
    }
  } else {
    // 本地没有Token，需要重新登陆
    next("/");
  }
});

export default router;
