import React, { useState } from 'react'
import { useRouter } from 'next/router'
import "./index.module.scss"
import { Form, Input, Button, Checkbox ,message} from 'antd';
import md5 from "md5"
import {API} from 'core/api'

export default function login(props) {
    const [CaptchaUrl, getCaptcha] = useState(null)
    const router = useRouter()
     const onFinish = (values: any) => {
        console.log('Success:', values);
        let submitData = {
            email:values.email,
            nickname:values.nickname,
            password:md5(values.password),
            captcha:values.captcha,
        }
        console.log(submitData,"submitData")
         RegisterFn(submitData)
    };
    async function RegisterFn(submitData){
        const data = await API.Register(submitData)
        console.log(data,"RegisterFn-data")
        // return data
        // let {code,message} = data
        if(data.code===0){
            message.success(data.message)
            console.log(props,"props")
            router.push("/login")

        }

    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    function updateCaptcha() {
        getCaptcha("/api/captcha?" + new Date().getTime()
        )
    }
    return (
        <div className="register">
            <div className="content">
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                >

                    <Form.Item
                        label="邮箱"
                        name="email"
                        rules={[{ required: true, message: '请填写邮箱' },
                        { type: "email", message: '请填写正确邮箱' }]}
                        style={{ display: 'flex' }}
                    >
                        <Input 
                         />

                    </Form.Item>
                    <Form.Item
                        label="昵称"
                        name="nickname"
                        style={{ display: 'flex' }}
                        rules={[{ required: true, message: '请填写昵称' }]}

                    >
                        <Input />

                    </Form.Item>
                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: '请填写密码' }]}
                        style={{ display: 'flex' }}

                        
                    >
                        <Input.Password />

                    </Form.Item>
                    <Form.Item
                        label="确认密码"
                        name="repassword"
                        rules={[{ required: true, message: '请填写确认密码' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('两次密码不一致');
                            },
                        }),]}

                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="验证码"
                        name="captcha"
                        rules={[{ required: true, message: '请填写验证码' }]}
                        style={{ display: 'flex', }}


                    >
                        <Input style={{ width: "200px" }} />

                    </Form.Item>
                    <img onClick={() => updateCaptcha()} src={CaptchaUrl ? CaptchaUrl : "/api/captcha"}></img>

                    <Button type="primary" htmlType="submit" >确认注册</Button>
                </Form>

            </div>
        </div>
    )
}
