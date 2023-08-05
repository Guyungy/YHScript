// ==UserScript==
// @name         Open Download Link with Button Click and Delay
// @namespace    https://www.ysjf.com/productDetail?id=*
// @version      1.0
// @description  Automatically opens the download link on the webpage https://www.ysjf.com/productDetail?id=*, after clicking the asset-detail-head-attrs-buy button and a delay
// @match        https://www.ysjf.com/productDetail?id=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const clickInterval = setInterval(() => {
        // 获取 asset-detail-head-attrs-buy 按钮
        const buyButton = document.querySelector('.asset-detail-head-attrs-buy');

        // 检查是否找到按钮元素
        if (buyButton) {
            // 停止循环
            clearInterval(clickInterval);

            // 点击按钮
            buyButton.click();

            // 等待一段时间，以便点击生效
            setTimeout(() => {
                // 获取所有具有 download-input 类的元素
                const downloadInputElements = document.querySelectorAll('.download-input');

                // 确保找到至少两个元素
                if (downloadInputElements.length >= 2) {
                    // 提取第一个元素的内容作为第一行
                    const firstLine = downloadInputElements[0].value || downloadInputElements[0].textContent;

                    // 提取第二个元素的内容作为第二行
                    const secondLine = downloadInputElements[1].value || downloadInputElements[1].textContent;

                    // 构建新链接
                    const linkUrl = `${firstLine}?pwd=${secondLine}`;

                    // 在新标签页中打开链接
                    window.open(linkUrl, '_blank');
                } else {
                    console.log('未找到足够的元素');
                }
            }, 2000); // 适当调整延迟时间
        }
    }, 1000); // 适当调整循环间隔时间，以便检查按钮是否已加载
})();