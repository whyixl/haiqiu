import Vue from "vue";
import ElementUI from "element-ui";
import _ from "lodash";
import axios from "./util/http";
import "@/style/app.scss";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import filters from "./util/filters";
import '@/assets/font/iconfont.css';
import '@/assets/font/iconfont.js';

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

const moment = require("moment");
require("moment/locale/zh-cn");
Vue.config.productionTip = false;

Vue.use(require("vue-moment"), {moment});
Vue.use(ElementUI);

Vue.prototype.$http = axios;
Vue.prototype._ = _;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
