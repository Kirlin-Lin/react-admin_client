import React from 'react'
import {Card,Button,Table,Modal, message} from 'antd'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button/index'
import { PAGE_SIZE } from '../../utils/constants'
import { reqUsers,reqDeleteUser,reqAddOrUpdateUser } from '../../api'
import UserForm from './user-form'
export default class User extends React.Component{
    state={
        users:[],//用户列表
        isShow:false,
        roles:[]//所有角色的列表
    }
    initColumns=()=>{
        this.columns=[
            {
                title:'用户名',
                dataIndex:'username'
            },
            {
                title:'邮箱',
                dataIndex:'email'
            },
            {
                title:'电话',
                dataIndex:'phone'
            },
            {
                title:'注册时间',
                dataIndex:'create_time',
                render:formateDate
            },
            {
                title:'所属角色',
                dataIndex:'role_id',
               // render: (role_id) => this.roleNames[role_id]  //根据ID获取角色名称  //this.state.roles.find(role=>role._id).name
               render:(role_id) => this.roleNames[role_id]
            },
            {
                title:'操作',
                render:(user)=>(
                    <span>
                        <LinkButton onClick={()=>this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }
    /**添加或更改 */
    addOrUpdateUser=async ()=>{
        //收集输入数据
        this.setState({isShow:false})
        const user = this.form.getFieldsValue()
        this.form.resetFields()
        //如果是更新，需要给user指定_id属性
        if(this.user){
            user._id = this.user._id
        }
        //提交添加的请求
        const result = await reqAddOrUpdateUser(user)

        //更新列表显示
        if (result.status===0){
            message.success(`${this.user?'修改':'添加'}用户成功`)
            this.getUsers()
        }
    }
    getUsers= async ()=>{
        const result = await reqUsers()
        if (result.status === 0){
            const {users,roles} = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }
    initRoleNames=(roles)=>{
        /**
         * 根据role的数组，生成包含所有角色名的对象（属性名用角色的ID值）
         */
        const roleNames = roles.reduce((pre,role)=>{
            pre[role._id]=role.name
            return pre
        },{})
        this.roleNames=roleNames
        //console.log('roleName:',roleNames)
        //console.log('this.roleName:',roleNames)
    }
    /**
     * 显示修改页面
     */
    showUpdate=(user)=>{
        this.user=user
        this.setState({
            isShow:true
        })
    }
    /**
     * 显示添加界面
     */
    showAdd=()=>{
        this.user=null
        this.setState({isShow:true})
    }
    /**
     * 删除指定用户
     */
    deleteUser=(user)=>{
        Modal.confirm({
            title:`确认删除${user.username}吗？`,
            content:'',
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if(result.status===0){
                    message.success('删除用户成功！')
                    this.getUsers()
                }else{
                    message.error('删除失败！')
                }
            },
        })
    }
    componentWillMount(){
        this.initColumns()
    }
    componentDidMount(){
        this.getUsers()
    }
    render(){
        const { users,isShow,roles  } = this.state
        const user = this.user
        const title =<Button type="primary" onClick={this.showAdd}>创建用户</Button>
        return(
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE, showQuickJumper: true}}
                />
                <Modal
                    title={user?'修改用户':'添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={()=>{
                        this.form.resetFields()
                        this.setState({isShow:false})
                    }}
                >
                 <UserForm setForm={form=>this.form=form} roles = {roles} user={user}/>
                </Modal>
            </Card>
        )
    }
}