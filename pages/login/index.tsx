import React, { useState } from 'react'
import "./index.module.scss"
import { useRouter } from 'next/router'
import { Form, Input, Button, Checkbox, message } from 'antd';
import { API } from 'core/api'
import md5 from "md5"

var timeSet = null;
export default function login() {
    const [CaptchaUrl, getCaptcha] = useState(null)
    const [time, changeTime] = useState(10)
    const [submitData, changeSubmitData] = useState({
        email: "976041476@qq.com",
        nickname: "",
        password: "",
        captcha: "",
        emailcode: ""
    })
    const router = useRouter()
    const onFinish = (values: any) => {
        console.log('Success:', values);
        let submitData = {
            email: values.email,
            nickname: values.nickname,
            password: md5(values.password),
            captcha: values.captcha,
            emailcode:values.emailcode
        }
        console.log(submitData, "submitData")
        LoginFn(submitData)
    };
    async function LoginFn(submitData) {
        const data = await API.Login(submitData)
        console.log(data, "RegisterFn-data")
        // return data
        if (data.code === 0) {
            message.success("登陆成功")
            localStorage.setItem("USER_TOKEN", data.data.token)
            router.push("/userInfo")
        } else {
            message.success(data.message)
        }
    }
    const sendText = () => {
        // console.log(time, "time")
        if (time === 10) {
            return "发送"
        } else if (time > 0) {
            return `${time}s后发送`
        } else {
            clearTimeout(timeSet)
            changeTime(10)
            return "发送"
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    function updateCaptcha() {
        getCaptcha("/api/captcha?" + new Date().getTime()
        )

    }
    function changeSubmitFn(e, target) {
        submitData[target] = e.target.value
        changeSubmitData(submitData)
    }
    async function sendEmailCode() {
        changeTime(10)
        let data = await API.Sendcode({ email: submitData.email })
        console.log(data)
        let { code } = data
        if (code === 0) {
            timeSet = setInterval(() => {
                changeTime((time) => time - 1)
            }, 1000)
            message.success(data.message)
        } else {
            message.error(data.message)
        }
    }
    return (
        <div className="login">
            <div className="content">
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    // labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                >

                    <Form.Item
                        label="邮箱"
                        name="email"
                        rules={[{ required: true, message: '请填写密码' }]}
                        style={{ display: 'flex' }}
                    >
                        <Input
                            value={submitData.email}
                            onChange={(e) => changeSubmitFn(e, "email")}
                        />

                    </Form.Item>
                    <div style={{display:"flex"}}>
                    <Form.Item
                        label="验证码"
                        name="captcha"
                        rules={[{ required: true, message: '请填写验证码' }]}
                        style={{ display: 'flex' }}
                    >
                        <Input
                            value={submitData.captcha}
                        />
                    </Form.Item>
                    <img
                        onClick={() => updateCaptcha()} src={CaptchaUrl ? CaptchaUrl : "/api/captcha"}
                    ></img>
                    </div>
                    <div style={{display:"flex"}}>
                    <Form.Item
                        label="邮箱验证码"
                        name="emailcode"
                        rules={[{ required: true, message: '请填写邮箱验证码' }]}
                        style={{ display: 'flex' }}
                    >
                        <Input
                            value={submitData.emailcode}
                        />
                    </Form.Item>
                    <Button type="primary" style={{marginLeft:"20px"}}  disabled={time !== 10 ? true : false} onClick={() => sendEmailCode()} >{sendText()}</Button>
                    </div>
                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: '请填写密码' }]}
                        style={{ display: 'flex' }}
                        initialValue="123456"
                    >
                        <Input.Password
                            value={submitData.password}
                        />
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit" style={{ marginLeft: "100px" }}>
                            提交
                        </Button>
                    </Form.Item>
                </Form>

            </div>
            {/* <Button type="primary">Primary Button</Button> */}
        </div>
    )
}
