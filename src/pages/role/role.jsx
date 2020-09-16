import React from 'react'
import {Button,Table,Card,Modal, Result, message} from 'antd'
import {PAGE_SIZE} from '../../utils/constants'
import {reqRoles,reqAddRole} from '../../api'
import AddForm from './add-form'
export default class Role extends React.Component{
    state={
        roles:[],//所有角色的列表
        role:{},//选中的role
        isShowAdd:false//是否显示添加界面
    }
    initColumn=()=>{
        this.columns=[
            {
                title:'角色名称',
                dataIndex:'name'
            },
            {
                title:'创建时间',
                dataIndex:'create_time'
            },
            {
                title:'授权时间',
                dataIndex:'auth_time'
            },
            {
                title:'授权人',
                dataIndex:'auth_name'
            }
        ]
    }

    getRoles= async()=>{
        const result =await reqRoles()
        if(result.status===0){
            const roles = result.data
            this.setState({
                roles
            })
        }
    }

    onRow=(role)=>{
        return{
            onClick:Event=>{
                console.log(role);
                this.setState({
                    role
                })
            }
        }
    }
    //添加角色
    addRole=()=>{
        //进行表单验证，只有通过了才能向下处理
        this.form.validateFields(async(error,values)=>{
            if(!error){
                //隐藏确认框
                this.setState({
                    isShowAdd:false
                })
                //收集角色数据
                const {roleName} = values
                //清除输入的缓存数据
                this.form.resetFields();
                // 请求添加
                const result = await reqAddRole(roleName)
                
                if(result.status===0){
                    //根据结果提示/更新列表显示
                    message.success('添加角色成功')
                    //this.getRoles()
                    //产生的新角色
                    const role =result.data
                    //更新roles的状态是基于原本的状态数据更新的
                    this.setState(state=>({
                        roles:[...state.roles,role]
                    }))

                    /*
                    react不推荐这么写
                    const roles = this.state.roles
                    roles.push(role)
                    this.setState({
                        roles
                    })*/
                }else{
                    message.error('添加角色失败')
                }
            }
        })
        
    }
    componentWillMount(){
        this.initColumn()
    }
    componentDidMount(){
        this.getRoles()
    }


    render(){
        const {roles,role,isShowAdd} = this.state
        const title = (
            <span>
                <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' disabled={!role._id}>设置角色权限</Button>
            </span>
        )
        return(
            <Card title={title}>
                <Table onRow={this.onRow} bordered rowKey='_id' rowSelection={{type:'radio',selectedRowKeys:[role._id]}} dataSource={roles} columns={this.columns} pagination={{defaultPageSize:PAGE_SIZE}}/>
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={()=>{
                        this.setState({isShowAdd:false})
                        this.form.resetFields() 
                    }}>
                    <AddForm setForm={(form)=>this.form=form}/>
                </Modal>
            </Card>
        )
    }
}