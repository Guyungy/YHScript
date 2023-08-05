// ==UserScript==
// @name         南+关注功能
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.2
// @description  添加关注功能。点击按钮时会弹出关注的作者列表和查看主题链接，支持导出导入数据。
// @author       You
// @match        https://www.level-plus.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// ==/UserScript==

(function () {
  'use strict';

  const userInfos = document.querySelectorAll('table.js-post .r_two');

  userInfos.forEach(userInfo => {
    const uidElement = userInfo.querySelector('.f12');
    const uid = uidElement ? uidElement.innerText : 'N/A';

    let isFollowing = GM_getValue(uid, false);

    if (!userInfo.querySelector('.uid-button')) {
      const uidButton = document.createElement('button');
      uidButton.textContent = isFollowing ? '取消关注' : `关注 ${uid}`;
      uidButton.classList.add('uid-button');
      uidButton.onclick = () => {
        isFollowing = !isFollowing;
        GM_setValue(uid, isFollowing);
        uidButton.textContent = isFollowing ? '取消关注' : `关注 ${uid}`;

        setTimeout(createFloatingMenu, 200);
      };

      const authorLink = userInfo.querySelector('a[title="只看该作者的所有回复"]');
      const parentElement = authorLink ? authorLink.parentElement : userInfo;

      parentElement.appendChild(uidButton);
    }
  });

  const floatingButton = document.createElement('button');
  floatingButton.textContent = '南+助手';
  floatingButton.style.position = 'fixed';
  floatingButton.style.bottom = '20px';
  floatingButton.style.right = '20px';
  floatingButton.style.backgroundColor = 'blue';
  floatingButton.style.color = 'white';
  floatingButton.style.padding = '5px';
  floatingButton.style.cursor = 'pointer';
  floatingButton.style.zIndex = '9999';

  document.body.appendChild(floatingButton);

  let floatingDiv;

  floatingButton.addEventListener('click', () => {
    createFloatingMenu();
  });

  function createFloatingMenu() {
    if (floatingDiv) {
      document.body.removeChild(floatingDiv);
    }

    floatingDiv = document.createElement('div');
    floatingDiv.id = 'floating-menu';
    floatingDiv.style.position = 'fixed';
    floatingDiv.style.bottom = '50px';
    floatingDiv.style.right = '50px';
    floatingDiv.style.backgroundColor = 'white';
    floatingDiv.style.color = 'black';
    floatingDiv.style.padding = '10px';
    floatingDiv.style.border = '1px solid black';
    floatingDiv.style.zIndex = '9999';
    floatingDiv.style.width = '400px'; // Set the width to be twice the original size

    const followingAuthors = getFollowingAuthorsList();

    if (followingAuthors.length > 0) {
      const followingList = document.createElement('ul');

      // Title line
      const titleItem = document.createElement('li');
      titleItem.style.fontWeight = 'bold';
      titleItem.textContent = '关注'; // Change the title here
      followingList.appendChild(titleItem);

      followingAuthors.forEach(uid => {
        // Content line
        const listItem = document.createElement('li');

        // Name and UID
        const userInfoDiv = document.createElement('div');
        userInfoDiv.textContent = `${uid}`;
        listItem.appendChild(userInfoDiv);

        // Cancel Button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消关注';
        cancelButton.classList.add('cancel-button');
        cancelButton.onclick = () => {
          GM_setValue(uid, false);
          setTimeout(createFloatingMenu, 200);
        };
        listItem.appendChild(cancelButton);

        // 异步获取最新主题名称和时间
        getLatestTopicInfo(uid)
          .then(topicInfo => {
            const topicLink = `https://level-plus.net/${topicInfo.link}`;
            const topicInfoDiv = document.createElement('div');
            topicInfoDiv.innerHTML = `最新主题名称: <a href="${topicLink}" target="_blank">${topicInfo.name}</a><br>最新主题时间: ${topicInfo.time}`;
            listItem.appendChild(topicInfoDiv);
          })
          .catch(error => {
            const topicInfoDiv = document.createElement('div');
            topicInfoDiv.textContent = '无法获取最新主题信息';
            listItem.appendChild(topicInfoDiv);
          });

        // 查看主题 Button
        const viewButton = document.createElement('button');
        viewButton.textContent = '查看主题';
        viewButton.onclick = () => {
          window.open(`https://level-plus.net/u.php?action-topic-uid-${uid}.html`, '_blank');
        };
        listItem.appendChild(viewButton);

        followingList.appendChild(listItem);
      });

      floatingDiv.appendChild(followingList);
    } else {
      floatingDiv.textContent = '暂无关注的作者';
    }

    const exportButton = document.createElement('button');
    exportButton.textContent = '导出关注数据';
    exportButton.onclick = () => {
      const dataToExport = JSON.stringify(getFollowingAuthorsList());
      const blob = new Blob([dataToExport], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'following_authors.json';
      a.click();
    };
    floatingDiv.appendChild(exportButton);

    const importButton = document.createElement('button');
    importButton.textContent = '导入关注数据';
    importButton.onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async event => {
          const data = event.target.result;
          try {
            const importedAuthors = JSON.parse(data);
            if (Array.isArray(importedAuthors)) {
              importedAuthors.forEach(uid => {
                GM_setValue(uid, true);
              });
              setTimeout(createFloatingMenu, 200);
              alert('导入成功！');
            } else {
              alert('无法解析导入的数据');
            }
          } catch (error) {
            alert('导入失败：' + error);
          }
        };

        reader.readAsText(file);
      };
      input.click();
    };
    floatingDiv.appendChild(importButton);

    document.body.appendChild(floatingDiv);
  }

  function getFollowingAuthorsList() {
    const followingAuthors = [];
    const allValues = GM_listValues();
    allValues.forEach(uid => {
      if (GM_getValue(uid, false)) {
        followingAuthors.push(uid);
      }
    });
    return followingAuthors;
  }

  async function getLatestTopicInfo(uid) {
    const response = await fetch(`https://level-plus.net/u.php?action-topic-uid-${uid}.html`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const topicRows = doc.querySelectorAll('tbody tr');

    let latestTopicName = '';
    let latestTopicTime = '';
    let latestTopicLink = '';

    topicRows.forEach(row => {
      const topicNameElement = row.querySelector('th a');
      const topicTimeElement = row.querySelector('.gray.f9');

      if (topicNameElement && topicTimeElement) {
        const topicName = topicNameElement.textContent.trim();
        const topicTime = topicTimeElement.textContent.trim();
        const topicLink = topicNameElement.getAttribute('href');

        if (latestTopicTime === '' || topicTime > latestTopicTime) {
          latestTopicName = topicName;
          latestTopicTime = topicTime;
          latestTopicLink = topicLink;
        }
      }
    });

    return { name: latestTopicName, time: latestTopicTime, link: latestTopicLink };
  }
})();