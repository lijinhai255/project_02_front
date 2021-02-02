import request from './request'

// 搜索结果
export const API = {
    Register: (submitData) => {
        return request.post('/api/user/register', submitData)
    },
    Login: (submitData) => {
        return request.post('/api/user/login', submitData)
    },
    // 获取验证码 
    Sendcode:(query) => {
        return request.get("/api/sendcode",query)
    },
    ///获取用户信息
    UserInfo:(parames)=>{
        return request.get("/api/user/info",parames)
    },
    // 图片上传
    UploadFile:(Data,fn)=>{
        const form = new FormData();
        form.append("name","file");
        form.append("files",Data)
        return request.post("/api/uploadfile",form,{
            onUploadProgress:progress=>{
                fn(Number(((progress.loaded/progress.total)*100).toFixed(2)))
                console.log( Number(((progress.loaded/progress.total)*100).toFixed(2)),"12343212323")
            }
        })
    },
    getWebData:()=>{
        return request.get("/api/data")
    },
    getCss:()=>{
        return request.get("/api/dataCss")

    },
    getCssMum:()=>{
        return request.get("/api/dataCssMum")
    },
    gerCssContent:(data)=>{
        return request.post("/api/dataCssContent",data)

    }
}


