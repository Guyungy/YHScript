// ==UserScript==
// @name         Javbus在线播放
// @namespace    your-namespace
// @version      1.0
// @description  在磁力链接下方增加【在线播放】地址
// @match        https://www.javbus.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // 检查网址中是否包含 "forum"
    if (window.location.href.includes("forum")) {
        return; // 如果包含 "forum"，则不执行脚本
    }

    // 提取识别码
    var codeElement = document.querySelector('.col-md-3.info span[style="color:#CC0000;"]');
    if (codeElement) {
        // 提取识别码文本内容
        var code = codeElement.innerText.trim();

        // 将识别码输出到控制台
        console.log('识别码: ' + code);

        // 创建在线播放区域
        var playArea = document.createElement("div");
        playArea.className = "play-area";

        // 创建标题
        var title = document.createElement("h3");
        title.textContent = "在线播放";

        // 创建超链接列表
        var linkList = document.createElement("ul");
        linkList.className = "link-list";

        // 创建超链接1
        var link1 = createLink("Javgg", "https://javgg.net/jav/sdam-074/" + code);
        linkList.appendChild(link1);

        // 创建超链接2
        var link2 = createLink("Javmost", "https://www5.javmost.com/" + code);
        linkList.appendChild(link2);

        // 创建超链接3
        var link3 = createLink("Njav", "https://njav.tv/zh/v/" + code);
        linkList.appendChild(link3);

        // 将标题和超链接列表添加到在线播放区域
        playArea.appendChild(title);
        playArea.appendChild(linkList);

        // 查找磁力链接容器
        var magnetTable = document.getElementById("magnet-table");
        if (magnetTable) {
            // 创建行元素并插入到磁力链接容器下方
            var row = document.createElement("tr");
            var cell = document.createElement("td");
            cell.colSpan = 3;
            cell.appendChild(playArea);
            row.appendChild(cell);
            magnetTable.parentNode.insertBefore(row, magnetTable.nextSibling);
        }

        // 检查超链接状态并获取链接标题
        checkLinkStatus(link1);
        checkLinkStatus(link2);
        checkLinkStatus(link3);
    }

    // 创建超链接函数
    function createLink(title, url) {
        var link = document.createElement("li");
        var linkText = document.createElement("a");
        linkText.textContent = title;
        linkText.href = url;
        var linkTitle = document.createElement("span"); // 创建用于显示链接标题的span元素
        link.appendChild(linkText);
        link.appendChild(linkTitle);
        return link;
    }

    // 检查超链接状态并获取链接标题函数
    function checkLinkStatus(link) {
        GM_xmlhttpRequest({
            method: "HEAD",
            url: link.firstChild.href,
            onload: function(response) {
                if (response.status === 200) {
                    link.firstChild.style.color = "green"; // 超链接可用，显示为绿色
                    getLinkTitle(link.firstChild.href, link.lastChild); // 获取链接标题并显示在最后一个子元素中
                } else {
                    link.firstChild.style.color = "red"; // 超链接不可用，显示为红色
                }
            }
        });
    }

    // 获取链接标题函数
    function getLinkTitle(url, titleElement) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                var html = response.responseText;
                var titleMatch = html.match(/<title>(.*?)<\/title>/i);
                if (titleMatch && titleMatch.length > 1) {
                    var title = titleMatch[1];
                    titleElement.textContent = " - " + title; // 显示链接标题
                }
            }
        });
    }
})();
