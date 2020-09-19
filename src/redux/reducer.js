import storageUtils from "../utils/storageUtils"

/**
 * 用来根据老的state和指定的action生成并返回新的state的函数
 * 同步action：对象{type：'xxx',data:数据值}
 * 异步action：函数 dispatch => {}
 */
import {combineReducers} from 'redux'
import {SET_HEAD_TITLE} from './action-types'

const initHeadTitle = '首页'

 function headTitle(state=initHeadTitle,action){
    switch(action.type){
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
 }
//管理当前登陆用户的reducer函数
const initUser = storageUtils.getUser()
 function user(state=initUser,action){
    switch(action.type){
        default:
            return state
    }
 }/**
  * 向外默认暴露的是合并产生的总的reducer函数，管理的是总的state的结构
  */
 export default combineReducers({
     headTitle,
     user
 })