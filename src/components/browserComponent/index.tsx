import React from 'react'
const bcd = require('@mdn/browser-compat-data');
export default function index() {
    console.log(bcd.css.properties.background,"")
    return (
        <div>
            这是一个浏览器兼容性 问题的测试 
        </div>
    )
}
