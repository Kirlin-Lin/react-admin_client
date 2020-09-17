import React from 'react'
import {Button,Table,Card,Modal, Result, message} from 'antd'
import {PAGE_SIZE} from '../../utils/constants'
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/dateUtils'
import AddForm from './add-form'
import AuthForm from './auth-form'

export default class Role extends React.Component{
    state={
        roles:[],//所有角色的列表
        role:{},//选中的role
        isShowAdd:false,//是否显示添加界面
        isShowAuth:false//设置权限页面是否显示
    }

    //从子组件取数据
    constructor(props){
        super(props)
        this.auth=React.createRef();
    }
    


    initColumn=()=>{
        this.columns=[
            {
                title:'角色名称',
                dataIndex:'name'
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                render:formateDate
            },
            {
                title:'授权时间',
                dataIndex:'auth_time',
                render:formateDate
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

    //修改角色权限
    updateRole= async ()=>{
        //点击确认框隐藏
        this.setState({
            isShowAuth:false
        })
        const role = this.state.role
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        //请求更新
        const result = await reqUpdateRole(role)
        if(result.status===0){
            message.success('设置角色权限成功')
            this.getRoles()
        }else{
            message.error('设置角色权限失败')
        }
    }


    componentWillMount(){
        this.initColumn()
    }
    componentDidMount(){
        this.getRoles()
    }


    render(){
        const {roles,role,isShowAdd,isShowAuth} = this.state
        const title = (
            <span>
                <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' onClick={()=>this.setState({isShowAuth:true})} disabled={!role._id}>设置角色权限</Button>
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
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={()=>{
                        this.setState({isShowAuth:false})
                        
                    }}>
                    <AuthForm ref = {this.auth} role={role}/>
                </Modal>
            </Card>
        )
    }
}