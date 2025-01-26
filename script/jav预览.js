// ==UserScript==
// @name         JavLibrary & JavBus 识别码提取与DMM视频播放
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  从JavLibrary和JavBus页面识别并提取识别码，并插入DMM视频播放器（支持自动播放）
// @author       YourName
// @match        https://www.javlibrary.com/cn/?v=*
// @match        https://www.javbus.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function getText(selector) {
        let element = document.querySelector(selector);
        return element ? element.innerText.trim() : '未知';
    }

    function extractIDFromURL() {
        let match = window.location.pathname.match(/\/([A-Z0-9-]+)$/i);
        return match ? match[1] : '未知';
    }

    function formatDMMID(videoID) {
        return videoID.toLowerCase().replace('-', '');
    }

    function padDMMID(dmmID) {
        let match = dmmID.match(/([a-z]+)(\d+)/);
        if (match) {
            let prefix = match[1];
            let number = match[2].padStart(3, '0'); // 保留原格式
            return `${prefix}${number}`;
        }
        return dmmID;
    }

    function generateDMMLinks(videoID) {
        let dmmID = formatDMMID(videoID);
        let paddedDMMID = padDMMID(dmmID);
        let numericPrefix = String(Math.floor(parseInt(dmmID.match(/\d+/)[0]) / 100)).padStart(3, '0');
        
        let url1 = `https://cc3001.dmm.co.jp/litevideo/freepv/1/118/118${dmmID}/118${dmmID}mhb.mp4`;
        let url2 = `https://cc3001.dmm.co.jp/litevideo/freepv/${paddedDMMID.charAt(0)}/${paddedDMMID.slice(0,3)}/${paddedDMMID}/${paddedDMMID}mhb.mp4`;
        let url3 = `https://cc3001.dmm.co.jp/litevideo/freepv/1/${numericPrefix}/${numericPrefix}${paddedDMMID}/${numericPrefix}${paddedDMMID}mhb.mp4`;
        
        return [url1, url2, url3];
    }

    function checkVideoURL(urls, callback) {
        let index = 0;
        function tryURL() {
            if (index >= urls.length) {
                console.log('所有链接均无效');
                return;
            }
            let url = urls[index];
            fetch(url, { method: 'HEAD' }).then(response => {
                if (response.ok) {
                    callback(url);
                } else {
                    index++;
                    tryURL();
                }
            }).catch(() => {
                index++;
                tryURL();
            });
        }
        tryURL();
    }

    function insertVideoPlayer(videoURL) {
        let playerDiv = document.createElement('div');
        playerDiv.style.position = 'relative';
        playerDiv.style.width = '60%'; // 调整宽度
        playerDiv.style.margin = '20px auto';
        playerDiv.style.textAlign = 'center';
        playerDiv.style.maxWidth = '800px'; // 限制最大宽度

        let videoElement = document.createElement('video');
        videoElement.src = videoURL;
        videoElement.controls = true;
        videoElement.autoplay = true;
        videoElement.muted = true; // 确保浏览器允许自动播放
        videoElement.style.width = '100%';
        videoElement.style.borderRadius = '10px';
        videoElement.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';

        playerDiv.appendChild(videoElement);
        document.body.insertBefore(playerDiv, document.body.firstChild);
    }

    let videoID;
    if (window.location.hostname.includes('javlibrary.com')) {
        videoID = getText('#video_id .text');
    } else if (window.location.hostname.includes('javbus.com')) {
        videoID = extractIDFromURL();
    }
    
    if (videoID !== '未知') {
        let videoURLs = generateDMMLinks(videoID);
        console.log('识别码:', videoID);
        console.log('尝试DMM视频链接:', videoURLs);
        checkVideoURL(videoURLs, insertVideoPlayer);
    } else {
        console.log('无法识别识别码');
    }
})();
