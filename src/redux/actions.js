/**
 * 包含多个action creator函数的模块
 */
//设置头部标题的同步action

import {SET_HEAD_TITLE} from './action-types'
 export const setHeadTitle = (headTitle) =>({type:SET_HEAD_TITLE,data:headTitle})