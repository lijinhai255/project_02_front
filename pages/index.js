import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd';
// import G6 from '@antv/g6';
import styles from './styles/style.module.scss';


// import G6 from '@antv/g6';
import { API } from 'core/api'
const BaseConfig = {
  nameFontSize: 12,
  childCountWidth: 22,
  countMarginLeft: 0,
  itemPadding: 16,
  nameMarginLeft: 4,
  rootPadding: 18,
};
export default function Home() {
  const [data, getData] = useState([])
  const [mums, getMums] = useState([])
  const [ChildMums,getChildMums] = useState([])
  const [ThrideMums,getThrideMums] = useState([])
  const [content, getContent] = useState({})
  useEffect(() => {
    API.getWebData()
  })

  async function getCssFn() {
    const data = await API.getCssMum()
    const newData = JSON.parse(data)
    getMums(newData)
  }
  function renderMums(data) {
    
    return mums&&mums.map((item,index) => {
      // console.log(item.length,"lenggh",item)
      if(+item.length===1||item==="字母索引"){
        // console.log(item,"item")
      }else{
        return <li key={index} onClick={()=>chooseItem(item)}>{item.label}</li>
      }
    })
  }
  function chooseItem(item){
    getChildMums(item)

  }
  function renderChildMums(item){
    // console.log(item,"2")
    return ChildMums&&ChildMums.children&&ChildMums.children.map((it,index)=>{
      // console.log(it.label,index)
      return <li key={index} onClick={()=>chooseSecondItem(it)}>{it.label}</li>
    })
  }
  function chooseSecondItem(item){
    // console.log(item,"it-it")
    getThrideMums(item)

  }
  function renderThrideMums(){
    // console.log(ThrideMums,"it-it")
    return ThrideMums&&ThrideMums.children&&ThrideMums.children.map((it,index)=>{
      console.log(it.label)
      return <li key={index} onClick={()=>getContentFn(it)}>{it.label}</li>
    })
  }
  async function getContentFn(it){
    console.log(it,"it-it")
    let content = await API.gerCssContent({url:it.href})
    getContent(content)
    console.log(content,"content")
  }
  function renderContent(){
    return  content.children&&content.children.map((item,index)=>{
      return(<> <li key={index}>{item.label}</li>  <div dangerouslySetInnerHTML={createMarkup(item.content)} ></div></>)
    })
  }
  function createMarkup(content){
    return {__html:content}

  }

  return (
    <div className="container">
      <Button onClick={() => getCssFn()}> 获取css数据</Button>
      {/* <G6component data={data}/> */}
      <div className="content">
        <div className="menu">
          这是 目录
              <ul>
            {
              renderMums()
            }
          </ul>

        </div>
        <div className="menu_child">
          {/* 这是子目录 */}
          {
            renderChildMums()
          }
        </div>
        <div className="content_child_one">
          {
            renderThrideMums()
          }
        </div>
        <div className="content_child_two">
          {content.label}
          {
            renderContent()
          }
        </div>

      </div>

    </div>
  )
}
