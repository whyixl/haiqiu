import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

let idFormatter = (id,entityList) => {
    const tempMap = new Map();
    for (const entity of entityList) {
        if (entity.name.toLowerCase() == "china") {
            tempMap.set(entity.id, "中国")
        } else if (entity.name.toLowerCase() == "Hongkong") {
            tempMap.set(entity.id, "中国(香港)")
        } else if (entity.name.toLowerCase() == "Chinesisch Taipeh") {
            tempMap.set(entity.id, "中国(台湾)")
        } else {
            tempMap.set(entity.id, entity.name)
        }
    }
    return tempMap.get(id);
};

export default {idFormatter}