import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import "./index.module.scss"
import { API } from 'core/api'
import { useRouter } from 'next/router'
import { Form, Input, Button, Checkbox, message, Progress } from 'antd';
import sparkMD5 from 'spark-md5'
let worker;// 开辟新的进程
let culChunks;
// let hashProcess;
const CHUNK_SIZE = 0.1 * 1024 * 1024
var window = window&&globalThis
export default function index() {
    const [userInfo, getUserInfo] = useState({})
    const [fileInfo, getFileInfo] = useState({})
    const [imageUrl, getImageUrl] = useState(null)
    const [uploadProgress, changeUploadProgress] = useState(0)
    const upLoadRef = useRef(null)
    const [chunks, changeChunks] = useState([])
    const [hashProcess, changeHashProcess] = useState(0)
    const [hashProcess1, changeHashProcess1] = useState(0)
    useEffect(() => {
        getUserInfoFn()
        bindElement()
        // drag 监听事件
        // upLoadRef&&upLoadRef.addEventListener('dragover',e=>{
        //     upLoadRef.style.borderColor = "red"
        // })
    }, [])
    function bindElement() {
        let drag = upLoadRef.current
        drag.addEventListener('dragover', e => {
            drag.style.borderColor = "red"
            // console.log("drag-drag")
            e.stopPropagation();
            e.preventDefault();
        })
        drag.addEventListener('dragleave', e => {
            drag.style.borderColor = '#eee'
            e.stopPropagation();
            e.preventDefault()
        })
        drag.addEventListener('drop', e => {
            e.stopPropagation();
            e.preventDefault()

            const fileList = e.dataTransfer.files[0]
            // console.log(fileList,"fileList-fileList")
            drag.style.borderColor = '#eee'
            const url = URL.createObjectURL(fileList)
            console.log(url, "ulr")
            getImageUrl(url)
            getFileInfo(fileList)
            // 创建url
            // const e.dataTrans
        })
    }
    const router = useRouter()

    async function getUserInfoFn() {
        const data = await API.UserInfo()
        //    console.log(data,"data-data")
        if (data && data.code === 0) {
            getUserInfo(data)

        } else {
            // message.error(data.message)
            router.push("/login")
        }
    }
    function onChangeFileFn(e) {
        getFileInfo(e.target.files[0])
    }
    async function submitUploadFile() {

        const result = await isImage(fileInfo);
        // if (!result) return;

        // 如果 图片合法 对图片进行切片
        culChunks = createFileChunk(fileInfo)
        // console.log(result, "result",culChunks,"culChunks")

        const hash = await calculateHashWorker()
        const hash1 = await calculateHashIdle()
        console.log(hash, "hash-hash", hash1, "hash1-hash1")

        //抽样hash
        


        // const data = await API.UploadFile(fileInfo, (num) => getNum(num))

    }
    function calculateHashIdle() {

        return new Promise(resolve => {
            const spark = new sparkMD5.ArrayBuffer()
            let count = 0;
            const appendToSpark = async file => {
                return new Promise(resolve => {
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = e => {
                        spark.append(e.target.result)
                        resolve({})
                    }
                })

            }
            const workLoop = async deadline => {
                while (count < chunks.length && deadline.timeRemaining() > 1) {
                    await appendToSpark(chunks[count].file)
                    count++;
                    if (count < chunks.length) {
                        changeHashProcess1(Number(
                            ((100 * count) / chunks.length).toFixed(2)
                        ))
                    } else {
                        changeHashProcess1(100)
                        resolve(spark.end)
                    }
                }
                
                    window.requestIdleCallback(workLoop)
                

            }
            window.requestIdleCallback(workLoop)

        })
    }
    function calculateHashWorker() {
        return new Promise(resolve => {
            worker = new Worker("/hash.js")
            // console.log(culChunks,"culChunks-culChunks",worker)
            worker.postMessage({ chunks: culChunks })
            // console.log(1212122121)
            worker.onmessage = function (e) {
                console.log(e, "e-e")
                const { progress, hash } = e.data
                console.log(progress, hash, "1212-1212")
                changeHashProcess(Number(progress.toFixed(2)))
                console.log(hash, hash)
                if (hash) {
                    resolve(hash)
                }
            }
        })

    }

    function getNum(num) {
        changeUploadProgress(num)
    }
    function createFileChunk(file, size = CHUNK_SIZE) {
        const chunks = [];
        let cur = 0;
        while (cur < file.size) {
            chunks.push({ idnex: cur, file: file.slice(cur, cur + size) })
            cur += size;
        }
        return chunks;
    }
    // 判断图片 

    async function isGif(file) {
        // GIF89a 和GIF87a
        // 前面6个16进制，'47 49 46 38 39 61' '47 49 46 38 37 61'
        // 16进制的抓安环
        const ret = await blobToString(file.slice(0, 6));
        // console.log(ret, "file-file")
        const isGif = (ret == '474946383961') || (ret == '474946383761')
        console.log(isGif, "isGIf")
        return isGif
    }
    async function isPng(file) {
        const ret = await blobToString(file.slice(0, 8))
        // console.log(ret, "ret-ret-ret")
        const ispng = (ret == "89504E470D0A1A0A")
        // console.log(ispng, "ispng")
        return ispng
    }
    async function isJpgFn(file) {
        const len = file.size
        // console.log(len)
        const start = await blobToString(file.slice(0, 2))
        // console.log(start)
        const tail = await blobToString(file.slice(-2, len))
        // console.log(tail)
        const isjpg = (start == 'FFD8') && (tail == 'FFD9')
        // console.log(isjpg, "121212isJpg")
        return isjpg
    }
    async function blobToString(blob) {
        // console.log(blob, "blob-blob")
        return new Promise(resolve => {
            const reader = new FileReader();
            // console.log(reader, "reader-reader")
            // reader.onload = function () {
            //     const ret = reader.result.split('')
            //         .map(v => v.charCodeAt())
            //         .map(v => v.toString(16).toUpperCase())
            //         .map(v => v.padStart(2, '0'))
            //         .join('')
            //     resolve(ret)
            //     // const ret = reader.
            // }
            // reader.readAsBinaryString(blob)

        })

    }
    async function isImage(file) {
        // 通过文件流 来进行判断
        return await isGif(file) || await isPng(file) || await isJpgFn(file)
    }
    return (
        <div className="userInfo" style={{ marginLeft: "20px" }}>
            这是用户信息
            <div className="uploadFile" >
                <div>
                    <input type="file" onChange={(e) => onChangeFileFn(e)} />
                </div>
                <div>

                </div>

            </div>
            <div ref={upLoadRef} className="drag" style={{ marginTop: "20px" }}>
                拖拽上传
                <div>
                    {/* <input type="file" onChange={(e) => onChangeFileFn(e)} /> */}
                </div>
                <div >
                    <img src={imageUrl}></img>
                </div>
                <div>
                    <h2>进度条</h2>
                    <Progress percent={uploadProgress} size="small" status="active" />
                </div>
            </div>
            <div>
                <h1>计算Hash 的进度</h1>
                <Progress percent={hashProcess} size="small" status="active" />
                <Progress percent={hashProcess1} size="small" status="active" />
            </div>

            <Button type="primary" onClick={() => submitUploadFile()}>
                文件上传
           </Button>

        </div>
    )
}
