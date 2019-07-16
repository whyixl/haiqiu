import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import _ from "lodash";

Vue.use(Vuex);

const subTree = (parentNode, allMenus) => {
  const children = _.sortBy(
    _.filter(
      allMenus,
      o =>
        o.depth === parentNode.depth + 1 &&
        o.lft > parentNode.lft &&
        o.rgt < parentNode.rgt
    ),
    ["lft"]
  );
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    const node = { ...child, children: [] };
    parentNode.children.push(node);
    subTree(node, allMenus);
  }
};

const store = new Vuex.Store({
  state: {
    token: null,
    // 菜单列表
    menus: [],
    // 菜单树
    menuTree: [],
    // 权限点列表
    authorities: [],
    loading: false,
    // 分页控件的每页显示条目个数
    paginationPageSizes: [5, 10, 20, 50],
    // 分页控件组件布局，子组件名用逗号分隔
    paginationLayout: "total, sizes, prev, pager, next, jumper"
  },
  mutations: {
    setToken(state, newToken) {
      localStorage.setItem("token", newToken);
      state.token = newToken;
    },
    setMenus(state, menus) {
      state.menus = menus;
    },
    setMenuTree(state, menuTree) {
      state.menuTree = menuTree;
    },
    setAuthorities(state, authorities) {
      state.authorities = authorities;
    }
  },
  actions: {
    // 重新从服务器读取用户信息
    reloadUserAuthority(context) {
      return axios.get("/user/queryUserAuthority").then(response => {
        const menus = response.data.menus;
        const rootMenu = _.find(menus, { menuCode: "root" });
        const rootMenuNode = { ...rootMenu, children: [] };

        subTree(rootMenuNode, menus);
        context.commit("setMenus", menus);
        context.commit("setMenuTree", rootMenuNode.children);
        context.commit("setAuthorities", response.data.authorities);

      });
    },
    signOut(context) {
      localStorage.removeItem("token");
      context.commit("setToken", null);
      context.commit("setMenus", []);
      context.commit("setAuthorities", []);
    }
  }
});

export default store;
