/**
 * 能发送异步ajax请求的函数模块
 * 封装axios库
 * 
 * 1、优化：统一处理请求异常
 * 在外层包一个自己创建的promise对象
 * 在请求出错时，不去reject(error),而是显示错误提示。
 * 2、异步得到不是response，而是response.data
 * 请求成功resolve时：resolve(response.data)
 * 
 */
import axios from 'axios';
import { message } from 'antd';

export default function ajax(url,data={},type='GET'){
    return new Promise((resolve,reject)=>{
        let promise;
        //1、执行异步ajax请求
        if(type==='GET'){//发送get请求
            promise=axios.get(//配置对象
                url,{
                    params:data//指定请求参数
                }
            );
        }else{//发post请求
            promise=axios.post(url,data);
        }
        //2、如果成功，调用reslove(value)
        promise.then(response=>{
            resolve(response.data)
            //如果失败，不调用reject（reason）,而是提示异常信息
        }).catch(error=>{
            message.error('请求出错'+error.message);
        })
    })


    
}

//ajax('/login',{username:'admin',password:'admin'},'POST').then();