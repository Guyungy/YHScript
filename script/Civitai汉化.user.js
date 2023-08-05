// ==UserScript==
// @name        Civitai汉化
// @description  汉化Civitai
// @namespace   Violentmonkey Scripts
// @match       https://civitai.com/
// @match       https://civitai.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @author      Ella Maietta
// @version     1.1
// @license     All Rights Reserved

// ==/UserScript==
(function() {
  'use strict';

  if (!GM_getValue("userConfirmed")) {
    fetchContent("https://raw.githubusercontent.com/Guyungy/AIGC-knowbase/main/civitai.md", function(htmlContent) {
      let overlay = document.createElement("div");
      let contentContainer = document.createElement("div"); 

      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
      overlay.style.zIndex = "9999";
      overlay.style.textAlign = "center";
      overlay.style.paddingTop = "20%";

      contentContainer.style.display = "inline-block";
      contentContainer.style.backgroundColor = "white";
      contentContainer.style.borderRadius = "10px";
      contentContainer.style.border = "2px solid black";
      contentContainer.style.padding = "20px";
      overlay.appendChild(contentContainer); 

      let contentBox = document.createElement("div");
      contentBox.innerHTML = htmlContent;
      contentContainer.appendChild(contentBox); 

      let confirmBtn = document.createElement("button");
      confirmBtn.innerText = "开始使用";
      confirmBtn.style.marginTop = "50px";
      confirmBtn.style.fontSize = "20px";
      confirmBtn.style.padding = "15px 30px";
      confirmBtn.style.borderRadius = "10px";
      confirmBtn.style.backgroundColor = "#2196F3";
      confirmBtn.style.color = "white";
      confirmBtn.style.cursor = "pointer";
      confirmBtn.style.transition = "transform 0.2s";
      confirmBtn.onmouseover = function() {
        this.style.transform = "scale(1.05)";
      }
      confirmBtn.onmouseout = function() {
        this.style.transform = "scale(1)";
      }
      contentContainer.appendChild(confirmBtn); 

      document.body.appendChild(overlay);

      confirmBtn.onclick = function() {
        GM_setValue("userConfirmed", true);
        overlay.remove();
      };
    });
  }


  const i18n = new Map([
    // 新增功能
    ['New homepage!', '新主页！'],
    ['Home', '家'],
    ['Announcements', '公告'],
    ['Settings', '设置'],

    ['Settings', '设置'],
    ['Get', '获取'],
    ['Quick Search', '快速搜索'],
    ['Models', '模型'],
    ['Images', '图片'],
    ['Posts', '帖子'],
    ['Articles', '文章'],
        // 浏览方式
    ['Highest Rated','最高评分'],
    ['Most Downloaded','最多下载'],
    ['Most Liked','最多收藏'],
    ['Most Discussed','最多讨论'],
    ['Most Bookmarks','最多收藏'],
    ['Newest','最新的'],
    //时间筛选
    ['Day', '日'],
    ['Week', '周'],
    ['Month', '月'],
    ['Year', '年'],
    ['All  Time', '全部时间'],
    //筛选菜单
    ['Model status', '模型状态'],
    ['Early Access', '早期访问'],
    ['Model types', '模型类型'],
    ['Checkpoint ', '大模型'],
    ['Model status', '模型类型'],
    ['Base model', '底模版本'],
    ['Clear Filters', '取消筛选'],

    //菜单
    ['guide','指南'],
    ['View more','查看更多'],
    ['Upload a model','上传模型'],


    //登录相关
    ['Your profile','您的个人资料'],
    ['My collections','我的收藏'],
    ['Liked models','喜欢的模型'],
    ['Bookmarked articles','收藏的文章'],
    ['Leaderboard','排行榜'],
    ['Hidden models','隐藏的模型'],
    ['Creators you follow','您关注的创作者'],
    ['Download history','下载历史'],
    ['Questions','问题'],
    ['Beta','测试版'],
    ['Dark mode','深色模式'],
    ['Account settings','账户设置'],
    ['Logout','登出'],

    //个人资料
    ['My 图片','我的图片'],
    ['My Reactions','我的反应'],
    ['Most Reactions','最多反应'],
    ['Most Comments','最多评论'],
    ['No results found','没有找到结果'],
    ['Mode','模式'],
    ['Stats','统计'],
    ['Published','已发布'],

    // 其他
    ['Featured','特色'],

    //模型页
    ['Download','下载'],
    ['Like','我超爱'],
    ['Share','分享'],

    ['Details','详情'],
    ['Base 模式l','底模'],
    ['Type','类型'],
    ['Downloads','下载量'],
    ['Uploaded','上传时间'],
    ['Updated','更新'],
    ['Hash','哈希'],

    ['Add Review','添加评论'],
    ['Reviews','评论'],
    ['See Reviews','查看评论'],
    ['Hash','哈希'],
    ['Hash','哈希'],

    ['File','文件'],
    ['Verified','验证于'],
    ['About this version','版本信息'],
    ['Discussion','讨论'],
    ['Add Comment','讲俩句'],
    ['Gallery','画廊'],
    ['Add Post','发表文章'],
    ['Create Image Post','发表图片帖'],
    


      // 月份
      ['Jan', '1月'],
      ['Feb', '2月'],
      ['Mar', '3月'],
      ['Apr', '4月'],
      ['May', '5月'],
      ['Jun', '6月'],
      ['Jul', '7月'],
      ['Aug', '8月'],
      ['Sep', '9月'],
      ['Oct', '10月'],
      ['Nov', '11月'],
      ['Dec', '12月'],
      // 时间
      ['about 1 hour ago', '大约1小时前'],
      ['about 2 hours ago', '大约2小时前'],
      ['about 3 hours ago', '大约3小时前'],
      ['about 4 hours ago', '大约4小时前'],
      ['about 5 hours ago', '大约5小时前'],
      ['about 6 hours ago', '大约6小时前'],
      ['about 7 hours ago', '大约7小时前'],
      ['about 8 hours ago', '大约8小时前'],
      ['about 9 hours ago', '大约9小时前'],
      ['about 10 hours ago', '大约10小时前'],
      ['about 11 hours ago', '大约11小时前'],
      ['about 12 hours ago', '大约12小时前'],
      ['about 13 hours ago', '大约13小时前'],
      ['about 14 hours ago', '大约14小时前'],
      ['about 15 hours ago', '大约15小时前'],
      ['about 16 hours ago', '大约16小时前'],
      ['about 17 hours ago', '大约17小时前'],
      ['about 18 hours ago', '大约18小时前'],
      ['about 19 hours ago', '大约19小时前'],
      ['about 20 hours ago', '大约20小时前'],
      ['about 21 hours ago', '大约21小时前'],
      ['about 22 hours ago', '大约22小时前'],
      ['about 23 hours ago', '大约23小时前'],
      ['days ago', '天前'],

  ])

  replaceText(document.body)
  const bodyObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(addedNode => replaceText(addedNode))
    })
  })
  bodyObserver.observe(document.body, { childList: true, subtree: true })

  function replaceText(node) {
    nodeForEach(node).forEach(htmlnode => {
      i18n.forEach((value, index) => {
        const textReg = new RegExp(index, 'g')
        if (htmlnode instanceof Text && htmlnode.nodeValue.includes(index))
          htmlnode.nodeValue = htmlnode.nodeValue.replace(textReg, value)
        else if (htmlnode instanceof HTMLInputElement && htmlnode.value.includes(index))
          htmlnode.value = htmlnode.value.replace(textReg, value)
      })
    })
  }

  function nodeForEach(node) {
    const list = []
    if (node.childNodes.length === 0) list.push(node)
    else {
      node.childNodes.forEach(child => {
        if (child.childNodes.length === 0) list.push(child)
        else list.push(...nodeForEach(child))
      })
    }
    return list
  }

  function fetchContent(url, callback) {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function(response) {
        if (response.status === 200) {
          callback(response.responseText);
        }
      }
    });
  }
})();
