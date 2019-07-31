import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

/**
 *  id转name
 * @param id id
 * @param entityList 实体列表
 * @returns {string}
 */
let idFormatter = (id,entityList) => {
    id = parseInt(id);
    const tempMap = new Map();
    // console.log(entityList);
    for (const entity of entityList) {
        if (entity.name.toLowerCase() == "china") {
            tempMap.set(entity.id, "中国")
        } else if (entity.name.toLowerCase() == "hongkong") {
            tempMap.set(entity.id, "中国(香港)")
        } else if (entity.name.toLowerCase() == "chinesisch taipeh") {
            tempMap.set(entity.id, "中国(台湾)")
        } else {
            tempMap.set(entity.id, entity.name)
        }
    }
    //console.log(tempMap);
    if (!tempMap.get(id)) {
        return id;
    }
    return tempMap.get(id);
};
/**
 *  时区转换，当前传入U0时区时间，页面要显示U8区时间
 * @param U0Time
 * @param timeZone  时区 东区+，西区-
 * @param timeSeparator 时间分隔符 “:”
 * @returns {Date}
 */
let timeFormatter = (U0Time, timeZone, timeSeparator) => {
    if (!U0Time) {
        return U0Time;
    };
    if (!timeSeparator) {
        timeSeparator = ":"
    }
    const subTime =  U0Time.toString().split(timeSeparator);
    return parseInt(subTime[0]) + 8-timeZone + timeSeparator + subTime[1]
};
/**
 * 赛季名称转换
 * @param seId
 * @param time
 * @param coId
 * @param coList
 * @returns {string}
 */
let seasonNameFmt = (seId, time, coId, coList) => {
    const startYear = new Date(parseInt(time)).getFullYear();
    //const endYear = new Date(parseInt(time.end)).getFullYear();
    return idFormatter(coId, coList) + startYear+'/'+(startYear+1);
};

export default {idFormatter,timeFormatter,seasonNameFmt}