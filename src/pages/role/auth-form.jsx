import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Input,Tree } from 'antd'
import menuList from '../../config/menuConfig'
const { TreeNode } = Tree;
const Item = Form.Item

/*
添加分类的form组件
 */
export default class AuthForm extends Component {
    static propTypes = {
        role: PropTypes.object, // 用来传递form对象的函数
    }
    state={
        checkedKeys:[]
    }


    constructor(props){
        super(props)
        //根据传入角色的menus生成初始状态
        const {menus} = this.props.role
        this.state={
            checkedKeys:menus
        }
    }

    //为父组件提供得到最新的menus数据的方法
    getMenus=()=>this.state.checkedKeys

    getTreeNodes=(menuList)=>{
        return menuList.reduce((pre,item)=>{
            console.log(item)
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children? this.getTreeNodes(item.children):null}
                </TreeNode>
            )
            return pre
        },[])
    }

    //选中某个node时的回调函数
    onCheck = checkedKeys => {
        this.setState({checkedKeys});
    };
    
    componentWillMount(){
        this.TreeNodes = this.getTreeNodes(menuList)
    }
    //当组件接收到新的属性时自动调用
    UNSAFE_componentWillReceiveProps(nextProps){
        const menus = nextProps.role.menus
        this.state.checkedKeys = menus
        /*this.setState({
            checkedKeys:menus
        })*/
    }

  render() {
    const { role } = this.props//取出父组件传过来的role对象
    const { checkedKeys }=this.state
    const formItemLayout = {
        labelCol: { span: 5 },  // 左侧label的宽度
        wrapperCol: { span: 8 }, // 右侧包裹的宽度
      }
    return (
      <div>
        <Item label="角色名称" {...formItemLayout}>
        <Input value={role.name} disabled/>
        </Item>

        <Tree checkedKeys={checkedKeys} checkable defaultExpandAll={true} onCheck={this.onCheck}>
            <TreeNode title="平台权限" key="all">
                {this.TreeNodes}
            </TreeNode>
        </Tree>
      </div>
    )
  }
}

