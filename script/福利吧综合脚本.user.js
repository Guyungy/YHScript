// ==UserScript==
// @name         福利吧综合脚本
// @namespace    http://your-namespace.com
// @version      2.1
// @description  自动签到，最新帖子排序，高亮热帖
// @author       long661
// @match        https://www.wnflb2023.com/*
// @grant        none
// ==/UserScript==

//替换模块
(function() {
    'use strict';

    // 替换规则
    var replacements = [
        {
            from: /https:\/\/www\.wnflb2023\.com\/forum-(\d+)-(\d+)\.html/g,
            to: 'https://www.wnflb2023.com/forum.php?mod=forumdisplay&fid=$1&filter=author&orderby=dateline'
        }
    ];

    // 检查并替换网址
    function replaceURL() {
        var currentURL = window.location.href;
        for (var i = 0; i < replacements.length; i++) {
            var replacement = replacements[i];
            if (replacement.from.test(currentURL)) {
                var newURL = currentURL.replace(replacement.from, replacement.to);
                window.location.href = newURL;
                break;
            }
        }
    }

    // 执行网址替换
    replaceURL();

})();

//高亮模块
(function() {
    'use strict';

    // 定义高亮函数
    function highlightPosts() {
        const replyElements = document.querySelectorAll('td.num > a.xi2');
        replyElements.forEach((el) => {
            const replyCount = parseInt(el.innerText, 10);
            if (replyCount > 50) {
                const postTitleElement = el.parentNode.parentNode.querySelector('th.common > a.s.xst');
                postTitleElement.style.backgroundColor = 'yellow';
            }
        });
    }

    // 初始化页面加载时的高亮
    highlightPosts();

    // 创建 MutationObserver 监听页面内容变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 检查新增的节点是否包含需要高亮的帖子
            const addedNodes = mutation.addedNodes;
            addedNodes.forEach((node) => {
                if (node instanceof HTMLElement) {
                    const replyElements = node.querySelectorAll('td.num > a.xi2');
                    replyElements.forEach((el) => {
                        const replyCount = parseInt(el.innerText, 10);
                        if (replyCount > 50) {
                            const postTitleElement = el.parentNode.parentNode.querySelector('th.common > a.s.xst');
                            postTitleElement.style.backgroundColor = 'yellow';
                        }
                    });
                }
            });
        });
    });

    // 配置 MutationObserver 监听的目标和选项
    observer.observe(document.body, { childList: true, subtree: true });
})();


//签到模块
(function() {
    'use strict';

    // 设置开关状态（true: 开启自动签到, false: 关闭自动签到）
    var autoCheckinEnabled = true;

    // 构造签到请求的URL
    var checkinUrl = 'https://www.wnflb2023.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1';

    // 显示签到提示
    function showCheckinMessage(message) {
        var checkinMessage = document.createElement('div');
        checkinMessage.style.position = 'fixed';
        checkinMessage.style.top = '50%';
        checkinMessage.style.left = '50%';
        checkinMessage.style.transform = 'translate(-50%, -50%)';
        checkinMessage.style.padding = '20px';
        checkinMessage.style.background = 'rgba(0, 0, 0, 0.8)';
        checkinMessage.style.color = '#fff';
        checkinMessage.style.fontFamily = 'Arial, sans-serif';
        checkinMessage.style.fontSize = '18px';
        checkinMessage.style.textAlign = 'center';
        checkinMessage.style.zIndex = '9999';
        checkinMessage.textContent = message;

        document.body.appendChild(checkinMessage);

        // 3秒后自动隐藏签到提示
        setTimeout(function() {
            checkinMessage.style.display = 'none';
        }, 3000);
    }

    // 检查签到状态
    function checkCheckinStatus() {
        var checkinButton = document.getElementById('fx_checkin_topb');
        if (checkinButton) {
            var checkinImg = checkinButton.getElementsByTagName('img')[0];
            if (checkinImg && checkinImg.alt === '已签到') {
                checkinImg.alt = '已签到 自动签到运行中';
                checkinImg.setAttribute('src', 'source/plugin/fx_checkin/images/mini2.gif');
                autoCheckinEnabled = false; // 设置自动签到为关闭状态
            }
        }
    }

    // 发送签到请求
    function checkin() {
        var checkinRequest = new XMLHttpRequest();
        checkinRequest.open('GET', checkinUrl, true);
        checkinRequest.onreadystatechange = function() {
            if (checkinRequest.readyState === 4 && checkinRequest.status === 200) {
                checkCheckinStatus();
                if (autoCheckinEnabled) {
                    showCheckinMessage('签到成功！');
                }
            }
        };
        checkinRequest.send();
    }

    // 执行自动签到
    function autoCheckin() {
        if (autoCheckinEnabled) {
            var checkinButton = document.getElementById('fx_checkin_topb');
            if (checkinButton) {
                checkinButton.click();
            }
        }
    }

    // 检查签到状态
    checkCheckinStatus();

    // 执行自动签到
    autoCheckin();

})();
