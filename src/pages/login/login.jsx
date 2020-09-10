import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import './login.less'
import logo from './images/logo.png';
class Login extends React.Component{
    handleSubmit=(event)=>{

        event.preventDefault();

        this.props.form.validateFields((err,values)=>{
            if(!err){
                console.log('校验成功，发送ajax请求',values);
            }else{
                console.log('校验失败')
            }
        });


        //const form = this.props.form;
        //const value = form.getFieldsValue();
        //console.log(value);
    }
    render(){
        
        const form = this.props.form;
        const {getFieldDecorator} =form;    
        return(
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt=""/>
                    <h1>React后台管理</h1>
                </header>
                <section className="login-content">
                    <h2>用户登陆</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                //声明式验证：直接使用别人定义好的验证规则进行验证
                            rules: [
                                { required: true,whitespace:true, message: '用户名必须输入' },
                                {min:4,message:'用户名至少是4位'},
                                {max:12,message:'用户名最多12位'},
                                {pattern: /^[a-zA-Z0-9_]+$/,message:'用户名必须是英文、数字或下划线组成'}],
                            })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Username"
                            />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [
                                    { required: true,whitespace:true, message: '请输入密码！' },
                                {min:4,message:'密码至少为4位'},
                                {max:12,message:'密码最多为12位'},
                                {pattern: /^[a-zA-Z0-9_]+$/,message:'密码必须是英文、数字或下划线组成'}],
                            })(
                                <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Password"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button"> 登陆 </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
/**
 * 1、高阶函数
 * 
 * 2、高阶组件
 * 
 * 
 * 包装Form组件生成一个新的组件：Form(Login)
 * 新的组件会向Form组件传递一个强大的对象属性：form
 */
const WrapLogin = Form.create()(Login);
export default WrapLogin;

/**
 * 1、前台验证表单
 * 
 * 2、收集表单输入的数据
 */