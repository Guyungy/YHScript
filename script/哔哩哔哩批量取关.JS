// ==UserScript==
// @name        哔哩哔哩批量取关
// @namespace   Violentmonkey Scripts
// @match       https://space.bilibili.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2022/9/1 17:40:15
// ==/UserScript==

var ms = 250; // 暂停250毫秒
var ii = 0;
var xx = $(".be-dropdown-item:contains('取消关注')");
console.log("本页关注了", xx.length, "个up主！");
tt = setInterval(function(){
  if (0 <= ii && ii < xx.length) {
    xx[ii].click(); // 自动点击【取消关注】
  } else {
    clearInterval(tt); // 停止批量操作
    console.log("OK！你已取消了对本页所有up主的关注！");
  }
  ii += 1;
}, ms+ii*10); // 暂停多少毫秒，再执行下一次点击，时间间隔增加一点儿变化
