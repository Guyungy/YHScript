// ==UserScript==
// @name         南+关注功能
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2.0
// @description  添加关注功能。优化按钮样式和位置，使用更美观的浮动菜单，支持导出导入数据，显示最新主题信息，并记录作者名字。
// @author       You
// @match        https://www.level-plus.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @connect      www.level-plus.net
// ==/UserScript==

(function () {
  'use strict';

  const FOLLOW_KEY_PREFIX = 'follow_';

  const getFollowStatus = (uid) => GM_getValue(FOLLOW_KEY_PREFIX + uid, null);
  const setFollowStatus = (uid, name, status) => GM_setValue(FOLLOW_KEY_PREFIX + uid, { name, status });
  const getFollowingAuthors = () => {
      const allValues = GM_listValues();
      return allValues
          .filter(key => key.startsWith(FOLLOW_KEY_PREFIX))
          .map(key => {
              const value = GM_getValue(key);
              return { uid: key.replace(FOLLOW_KEY_PREFIX, ''), name: value.name, status: value.status };
          })
          .filter(author => author.status);
  };

  const createFollowButton = (userInfo, uid, name) => {
      const followData = getFollowStatus(uid);
      const isFollowing = followData ? followData.status : false;
      const button = document.createElement('div');
      button.textContent = isFollowing ? '✔ 关注中' : '+ 关注';
      button.className = 'custom-follow-button';
      button.addEventListener('click', () => toggleFollow(uid, name, button));
      return button;
  };

  const toggleFollow = (uid, name, button) => {
      const followData = getFollowStatus(uid);
      const newStatus = !(followData ? followData.status : false);
      setFollowStatus(uid, name, newStatus);
      button.textContent = newStatus ? '✔ 关注中' : '+ 关注';
      updateFloatingMenu();
  };

  const initFollowButtons = () => {
      const userInfos = document.querySelectorAll('table.js-post .r_two');
      userInfos.forEach(userInfo => {
          const uidElement = userInfo.querySelector('.f12');
          const nameElement = userInfo.querySelector('a[target="_blank"] strong');

          const uid = uidElement ? uidElement.innerText.trim() : null;
          const name = nameElement ? nameElement.innerText.trim() : '未知';

          if (!uid || userInfo.querySelector('.custom-follow-button')) return;

          const followButton = createFollowButton(userInfo, uid, name);
          followButton.style.marginLeft = '10px';
          userInfo.appendChild(followButton);
      });
  };

  const createFloatingButton = () => {
      const button = document.createElement('button');
      button.textContent = '关注列表';
      button.className = 'floating-button';
      document.body.appendChild(button);
      button.addEventListener('click', toggleFloatingMenu);
  };

  const toggleFloatingMenu = () => {
      if (document.getElementById('floating-menu')) {
          removeFloatingMenu();
      } else {
          createFloatingMenu();
      }
  };

  const removeFloatingMenu = () => {
      const menu = document.getElementById('floating-menu');
      if (menu) document.body.removeChild(menu);
  };

  const updateFloatingMenu = () => {
      removeFloatingMenu();
      createFloatingMenu();
  };

  const createFloatingMenu = () => {
      const floatingDiv = document.createElement('div');
      floatingDiv.id = 'floating-menu';
      floatingDiv.className = 'floating-menu';

      const title = document.createElement('h3');
      title.textContent = '已关注作者';
      floatingDiv.appendChild(title);

      const followingAuthors = getFollowingAuthors();

      if (followingAuthors.length > 0) {
          const list = document.createElement('ul');
          list.className = 'author-list';

          followingAuthors.forEach(({ uid, name }) => {
              const listItem = document.createElement('li');
              listItem.className = 'author-item';

              const authorInfoDiv = document.createElement('div');
              authorInfoDiv.className = 'author-info';
              authorInfoDiv.textContent = `UID: ${uid} | 昵称: ${name}`;
              listItem.appendChild(authorInfoDiv);

              const topicInfoDiv = document.createElement('div');
              topicInfoDiv.className = 'topic-info';
              topicInfoDiv.textContent = '加载中...';
              listItem.appendChild(topicInfoDiv);

              getLatestTopicInfo(uid, topicInfoDiv);

              const cancelButton = document.createElement('button');
              cancelButton.textContent = '取消关注';
              cancelButton.className = 'cancel-button';
              cancelButton.addEventListener('click', () => {
                  setFollowStatus(uid, name, false);
                  updateFloatingMenu();
              });
              listItem.appendChild(cancelButton);

              list.appendChild(listItem);
          });

          floatingDiv.appendChild(list);

          const exportButton = document.createElement('button');
          exportButton.textContent = '导出关注数据';
          exportButton.className = 'export-button';
          exportButton.addEventListener('click', exportFollowData);
          floatingDiv.appendChild(exportButton);

          const importButton = document.createElement('button');
          importButton.textContent = '导入关注数据';
          importButton.className = 'import-button';
          importButton.addEventListener('click', importFollowData);
          floatingDiv.appendChild(importButton);
      } else {
          const noFollow = document.createElement('p');
          noFollow.textContent = '暂无关注作者';
          floatingDiv.appendChild(noFollow);
      }

      document.body.appendChild(floatingDiv);
  };

  const getLatestTopicInfo = (uid, topicInfoDiv) => {
      const url = `https://www.level-plus.net/u.php?action-topic-uid-${uid}.html`;

      GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
              if (response.status !== 200) {
                  console.error(`请求失败，状态码: ${response.status}`);
                  topicInfoDiv.textContent = '无法获取最新主题信息';
                  return;
              }

              const parser = new DOMParser();
              const doc = parser.parseFromString(response.responseText, 'text/html');
              const topicRow = doc.querySelector('.u-table th a');

              if (topicRow) {
                  const topicName = topicRow.textContent.trim();
                  const topicLink = topicRow.getAttribute('href');
                  topicInfoDiv.innerHTML = `最新主题: <a href="https://www.level-plus.net/${topicLink}" target="_blank">${topicName}</a>`;
              } else {
                  topicInfoDiv.textContent = '未找到最新主题';
              }
          },
          onerror: function(error) {
              console.error(`请求出错:`, error);
              topicInfoDiv.textContent = '无法获取最新主题信息';
          }
      });
  };

  const exportFollowData = () => {
      const data = JSON.stringify(getFollowingAuthors(), null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'following_authors.json';
      a.click();

      URL.revokeObjectURL(url);
  };

  const importFollowData = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.style.display = 'none';

      input.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = () => {
              try {
                  const importedAuthors = JSON.parse(reader.result);
                  if (Array.isArray(importedAuthors)) {
                      importedAuthors.forEach(({ uid, name }) => setFollowStatus(uid, name, true));
                      alert('导入成功！');
                      updateFloatingMenu();
                  } else {
                      throw new Error('数据格式错误');
                  }
              } catch (error) {
                  alert('导入失败：' + error.message);
              }
          };
          reader.readAsText(file);
      });

      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
  };

  const addStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
          .custom-follow-button {
              display: inline-block;
              padding: 5px 10px;
              background-color: #007BFF;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
          }

          .custom-follow-button:hover {
              background-color: #0056b3;
          }

          .floating-button {
              position: fixed;
              bottom: 20px;
              right: 20px;
              background-color: #28a745;
              color: white;
              padding: 10px 20px;
              border: none;
              border-radius: 30px;
              cursor: pointer;
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
              z-index: 1000;
          }

          .floating-menu {
              position: fixed;
              bottom: 80px;
              right: 20px;
              background-color: white;
              border: 1px solid #ccc;
              border-radius: 10px;
              padding: 20px;
              width: 300px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
              z-index: 1000;
              max-height: 400px;
              overflow-y: auto;
          }

          .floating-menu h3 {
              margin: 0 0 10px 0;
              font-size: 18px;
              text-align: center;
          }

          .author-list {
              list-style: none;
              padding: 0;
              margin: 0;
          }

          .author-item {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              padding: 5px 0;
              border-bottom: 1px solid #eee;
          }

          .author-info {
              font-weight: bold;
          }

          .topic-info {
              font-size: 12px;
              color: #555;
              margin: 5px 0;
          }

          .cancel-button {
              background-color: #dc3545;
              color: white;
              border: none;
              border-radius: 5px;
              padding: 5px 10px;
              cursor: pointer;
              align-self: flex-end;
          }

          .cancel-button:hover {
              background-color: #c82333;
          }

          .export-button, .import-button {
              margin-top: 10px;
              width: 100%;
              padding: 10px;
              background-color: #007BFF;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
          }

          .export-button:hover, .import-button:hover {
              background-color: #0056b3;
          }
      `;
      document.head.appendChild(style);
  };

  const init = () => {
      addStyles();
      initFollowButtons();
      createFloatingButton();
  };

  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
  } else {
      init();
  }
})();
