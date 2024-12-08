// ==UserScript==
// @name         南+关注功能
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      8.1
// @description  添加关注功能。优化按钮样式和位置，使用更美观的浮动菜单，支持导出导入数据，显示最新主题信息，添加备注功能，访问主页功能，用户界面优化，自动刷新与更新提示。
// @author       You
// @match        *://www.level-plus.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @connect      www.level-plus.net
// ==/UserScript==

(function () {
  'use strict';

  const FOLLOW_KEY_PREFIX = 'follow_';
  const SCRIPT_VERSION = '8.1'; // 当前脚本版本
  const UPDATE_URL = 'https://example.com/path-to-your-script-version.json'; // 替换为您的脚本版本检查URL

  // 获取关注状态
  const getFollowStatus = (uid) => {
      const data = GM_getValue(FOLLOW_KEY_PREFIX + uid, null);
      if (data) {
          try {
              return JSON.parse(data);
          } catch (e) {
              console.error(`解析关注数据失败，UID=${uid}`, e);
              return null;
          }
      }
      return null;
  };

  // 设置关注状态
  const setFollowStatus = (uid, data) => {
      GM_setValue(FOLLOW_KEY_PREFIX + uid, JSON.stringify(data));
  };

  // 获取所有关注的作者
  const getFollowingAuthors = () => {
      const allValues = GM_listValues();
      return allValues
          .filter(key => key.startsWith(FOLLOW_KEY_PREFIX))
          .map(key => {
              const uid = key.replace(FOLLOW_KEY_PREFIX, '');
              const value = getFollowStatus(uid);
              return { uid, ...value };
          })
          .filter(author => author.status);
  };

  // 创建关注按钮
  const createFollowButton = (userInfo, uid, name) => {
      const followData = getFollowStatus(uid);
      const isFollowing = followData ? followData.status : false;
      const button = document.createElement('button');
      button.type = 'button'; // 设置按钮类型，防止作为提交按钮
      button.textContent = isFollowing ? '✔ 关注中' : '+ 关注';
      button.className = 'custom-follow-button';
      button.addEventListener('click', (event) => {
          event.preventDefault(); // 阻止默认行为
          toggleFollow(uid, name, button);
      });
      console.log(`创建关注按钮：UID=${uid}, 名称=${name}, 状态=${isFollowing}`);
      return button;
  };

  // 切换关注状态
  const toggleFollow = (uid, name, button) => {
      const followData = getFollowStatus(uid);
      const newStatus = !(followData ? followData.status : false);
      const newData = {
          name: name,
          status: newStatus,
          lastTopic: followData ? followData.lastTopic : '',
          note: followData ? followData.note : ''
      };
      setFollowStatus(uid, newData);
      button.textContent = newStatus ? '✔ 关注中' : '+ 关注';
      console.log(`切换关注状态：UID=${uid}, 新状态=${newStatus}`);
      updateFloatingMenu();
  };

  // 初始化关注按钮
  const initFollowButtons = () => {
      console.log('初始化关注按钮...');
      // 请根据实际的DOM结构调整选择器
      const userInfos = document.querySelectorAll('table.js-post .r_two'); // 示例选择器，请根据实际情况调整
      console.log(`找到 ${userInfos.length} 个用户信息元素`);
      userInfos.forEach((userInfo, index) => {
          const uidElement = userInfo.querySelector('.f12');
          const nameElement = userInfo.querySelector('a[target="_blank"] strong');

          const uid = uidElement ? uidElement.innerText.trim() : null;
          const name = nameElement ? nameElement.innerText.trim() : '未知';

          if (!uid) {
              console.log(`帖子 ${index + 1} 未找到 UID，跳过该用户`);
              return;
          }

          if (userInfo.querySelector('.custom-follow-button')) {
              console.log(`UID=${uid} 已存在关注按钮，跳过`);
              return;
          }

          const followButton = createFollowButton(userInfo, uid, name);
          userInfo.appendChild(followButton);
          console.log(`已添加关注按钮到 UID=${uid}`);
      });
  };

  // 创建浮动按钮
  const createFloatingButton = () => {
      console.log('创建浮动按钮...');
      // 检查是否已存在浮动按钮
      if (document.querySelector('.floating-button')) return;

      const button = document.createElement('button');
      button.textContent = '关注列表';
      button.className = 'floating-button';
      document.body.appendChild(button);
      button.addEventListener('click', toggleFloatingMenu);
      console.log('已添加浮动按钮到页面');
  };

  // 切换浮动菜单
  const toggleFloatingMenu = () => {
      if (document.getElementById('floating-menu')) {
          removeFloatingMenu();
      } else {
          createFloatingMenu();
      }
  };

  // 移除浮动菜单
  const removeFloatingMenu = () => {
      const menu = document.getElementById('floating-menu');
      if (menu) {
          document.body.removeChild(menu);
          console.log('已移除浮动菜单');
      }
  };

  // 更新浮动菜单
  const updateFloatingMenu = () => {
      console.log('更新浮动菜单...');
      removeFloatingMenu();
      createFloatingMenu();
  };

  // 创建浮动菜单
  const createFloatingMenu = () => {
      console.log('创建浮动菜单...');
      const floatingDiv = document.createElement('div');
      floatingDiv.id = 'floating-menu';
      floatingDiv.className = 'floating-menu';

      const title = document.createElement('h3');
      title.textContent = '已关注作者';
      floatingDiv.appendChild(title);

      // 添加搜索框
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.placeholder = '搜索作者...';
      searchInput.className = 'search-input';
      searchInput.addEventListener('input', filterAuthors);
      floatingDiv.appendChild(searchInput);

      console.log(`已关注作者数量：${getFollowingAuthors().length}`);

      if (getFollowingAuthors().length > 0) {
          const list = document.createElement('ul');
          list.className = 'author-list';

          getFollowingAuthors().forEach(({ uid, name, lastTopic, note }) => {
              const listItem = createAuthorListItem(uid, name, lastTopic, note);
              list.appendChild(listItem);
          });

          floatingDiv.appendChild(list);

          // 导出按钮
          const exportButton = document.createElement('button');
          exportButton.textContent = '导出关注数据';
          exportButton.className = 'export-button';
          exportButton.addEventListener('click', exportFollowData);
          floatingDiv.appendChild(exportButton);

          // 导入按钮
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
      console.log('已添加浮动菜单到页面');
  };

  // 创建作者列表项
  const createAuthorListItem = (uid, name, lastTopic, note) => {
      const listItem = document.createElement('li');
      listItem.className = 'author-item';
      listItem.setAttribute('data-uid', uid);

      const authorInfoDiv = document.createElement('div');
      authorInfoDiv.className = 'author-info';
      authorInfoDiv.innerHTML = `UID: ${uid} | 昵称: <a href="https://www.level-plus.net/u.php?uid=${uid}" target="_blank">${name}</a>`;
      listItem.appendChild(authorInfoDiv);

      // 备注显示与编辑
      const noteDiv = document.createElement('div');
      noteDiv.className = 'note-div';
      const noteLabel = document.createElement('span');
      noteLabel.textContent = '备注: ';
      const noteText = document.createElement('span');
      noteText.textContent = note || '无';
      noteText.className = 'note-text';
      noteText.style.cursor = 'pointer';
      noteText.addEventListener('click', () => editNote(uid, noteText));
      noteDiv.appendChild(noteLabel);
      noteDiv.appendChild(noteText);
      listItem.appendChild(noteDiv);

      const topicInfoDiv = document.createElement('div');
      topicInfoDiv.className = 'topic-info';
      topicInfoDiv.textContent = lastTopic ? `最新主题: ${lastTopic}` : '加载中...';
      listItem.appendChild(topicInfoDiv);

      getLatestTopicInfo(uid, topicInfoDiv);

      const cancelButton = document.createElement('button');
      cancelButton.textContent = '取消关注';
      cancelButton.className = 'cancel-button';
      cancelButton.addEventListener('click', () => {
          setFollowStatus(uid, { name, status: false, lastTopic, note });
          updateFloatingMenu();
          console.log(`已取消关注 UID=${uid}`);
      });
      listItem.appendChild(cancelButton);

      return listItem;
  };

  // 编辑备注
  const editNote = (uid, noteTextElement) => {
      const followData = getFollowStatus(uid);
      if (!followData) {
          console.error(`无法找到 UID=${uid} 的关注数据`);
          return;
      }

      const newNote = prompt('请输入备注:', followData.note || '');
      if (newNote !== null) {
          const trimmedNote = newNote.trim();
          followData.note = trimmedNote;
          setFollowStatus(uid, followData);
          noteTextElement.textContent = trimmedNote || '无';
          updateFloatingMenu();
          console.log(`已更新 UID=${uid} 的备注为 ${followData.note}`);
      }
  };

  // 获取最新主题信息并处理通知
  const getLatestTopicInfo = (uid, topicInfoDiv) => {
      const url = `https://www.level-plus.net/u.php?action-topic-uid-${uid}.html`;
      console.log(`获取 UID=${uid} 的最新主题信息，URL=${url}`);

      GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
              if (response.status !== 200) {
                  console.error(`请求失败，UID=${uid}，状态码: ${response.status}`);
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
                  console.log(`UID=${uid} 的最新主题：${topicName}`);

                  // 检查是否有新帖
                  const followData = getFollowStatus(uid);
                  if (followData && followData.lastTopic && followData.lastTopic !== topicName) {
                      notifyNewPost(followData.name, topicName, topicLink);
                      console.log(`检测到 UID=${uid} 的新主题：${topicName}`);
                  }
                  // 更新最后主题
                  if (followData) {
                      setFollowStatus(uid, { ...followData, lastTopic: topicName });
                      console.log(`已更新 UID=${uid} 的最后主题为 ${topicName}`);
                  }
              } else {
                  topicInfoDiv.textContent = '未找到最新主题';
                  console.log(`UID=${uid} 未找到最新主题`);
              }
          },
          onerror: function(error) {
              console.error(`请求出错，UID=${uid}，错误:`, error);
              topicInfoDiv.textContent = '无法获取最新主题信息';
          }
      });
  };

  // 通知新帖
  const notifyNewPost = (authorName, topicName, topicLink) => {
      if (Notification.permission === 'granted') {
          const notification = new Notification(`${authorName} 发布了新主题`, {
              body: topicName,
              icon: 'https://www.level-plus.net/favicon.ico',
              data: { url: `https://www.level-plus.net/${topicLink}` }
          });
          notification.onclick = () => {
              window.open(`https://www.level-plus.net/${topicLink}`, '_blank');
          };
          console.log(`已发送新帖通知：${authorName} - ${topicName}`);
      }
  };

  // 请求通知权限
  const requestNotificationPermission = () => {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
              console.log(`通知权限：${permission}`);
          });
      }
  };

  // 导出关注数据
  const exportFollowData = () => {
      const data = JSON.stringify(getFollowingAuthors(), null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'following_authors.json';
      a.click();

      URL.revokeObjectURL(url);
      console.log('已导出关注数据');
  };

  // 导入关注数据
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
                      importedAuthors.forEach(({ uid, name, note }) => {
                          const existing = getFollowStatus(uid);
                          setFollowStatus(uid, {
                              name: name,
                              status: true,
                              lastTopic: existing ? existing.lastTopic : '',
                              note: note || ''
                          });
                      });
                      alert('导入成功！');
                      updateFloatingMenu();
                      console.log('已导入关注数据');
                  } else {
                      throw new Error('数据格式错误');
                  }
              } catch (error) {
                  alert('导入失败：' + error.message);
                  console.error('导入失败：', error);
              }
          };
          reader.readAsText(file);
      });

      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
  };

  // 过滤作者列表
  const filterAuthors = (event) => {
      const query = event.target.value.toLowerCase().trim();
      const authorItems = document.querySelectorAll('.author-item');

      authorItems.forEach(item => {
          const authorInfo = item.querySelector('.author-info').textContent.toLowerCase().trim();
          const matchesQuery = authorInfo.includes(query);
          if (matchesQuery) {
              item.style.display = '';
          } else {
              item.style.display = 'none';
          }
      });
      console.log(`过滤作者：查询="${query}"`);
  };

  // 用户界面优化与样式
  const addStyles = () => {
      console.log('添加样式...');
      const style = document.createElement('style');
      style.textContent = `
          /* 按钮样式 */
          .custom-follow-button {
              display: inline-block;
              padding: 5px 10px;
              background-color: #007BFF;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
              transition: background-color 0.3s;
              margin-left: 10px;
          }

          .custom-follow-button:hover {
              background-color: #0056b3;
          }

          /* 浮动按钮样式 */
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
              transition: background-color 0.3s;
              font-size: 16px;
          }

          .floating-button:hover {
              background-color: #218838;
          }

          /* 浮动菜单样式 */
          .floating-menu {
              position: fixed;
              bottom: 80px;
              right: 20px;
              background-color: white;
              border: 1px solid #ccc;
              border-radius: 10px;
              padding: 20px;
              width: 350px;
              box-shadow: 0 4px 16px rgba(0,0,0,0.2);
              z-index: 1000;
              max-height: 600px;
              overflow-y: auto;
              animation: fadeIn 0.3s ease-in-out;
              font-family: Arial, sans-serif;
          }

          @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
          }

          .floating-menu h3 {
              margin: 0 0 15px 0;
              font-size: 22px;
              text-align: center;
              color: #333;
              border-bottom: 2px solid #007BFF;
              padding-bottom: 10px;
          }

          /* 搜索框样式 */
          .search-input {
              width: 100%;
              padding: 8px;
              margin-bottom: 15px;
              border: 1px solid #ccc;
              border-radius: 5px;
              box-sizing: border-box;
              font-size: 14px;
          }

          /* 作者列表样式 */
          .author-list {
              list-style: none;
              padding: 0;
              margin: 0 0 15px 0;
          }

          .author-item {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
              transition: background-color 0.3s;
          }

          .author-item:hover {
              background-color: #f9f9f9;
          }

          .author-info {
              font-weight: bold;
              font-size: 14px;
              color: #555;
          }

          .note-div {
              font-size: 12px;
              color: #888;
              margin: 5px 0;
              display: flex;
              align-items: center;
          }

          .note-text {
              color: #007BFF;
              text-decoration: underline;
              margin-left: 5px;
          }

          .topic-info {
              font-size: 12px;
              color: #555;
              margin: 5px 0;
          }

          .topic-info a {
              color: #28a745;
              text-decoration: none;
          }

          .topic-info a:hover {
              text-decoration: underline;
          }

          .cancel-button {
              background-color: #dc3545;
              color: white;
              border: none;
              border-radius: 5px;
              padding: 5px 10px;
              cursor: pointer;
              align-self: flex-end;
              font-size: 12px;
              transition: background-color 0.3s;
              margin-top: 5px;
          }

          .cancel-button:hover {
              background-color: #c82333;
          }

          /* 导出和导入按钮样式 */
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
              transition: background-color 0.3s;
          }

          .export-button:hover, .import-button:hover {
              background-color: #0056b3;
          }

          /* 响应式设计 */
          @media (max-width: 480px) {
              .floating-menu {
                  width: 90%;
                  right: 5%;
                  bottom: 70px;
              }

              .floating-button {
                  right: 5%;
              }
          }
      `;
      document.head.appendChild(style);
      console.log('样式已添加');
  };

  // 自动刷新与更新提示
  const checkForUpdates = () => {
      console.log('检查脚本更新...');
      GM_xmlhttpRequest({
          method: 'GET',
          url: UPDATE_URL,
          onload: function(response) {
              if (response.status === 200) {
                  try {
                      const updateInfo = JSON.parse(response.responseText);
                      if (updateInfo.version && compareVersions(updateInfo.version, SCRIPT_VERSION) > 0) {
                          if (confirm(`有新的脚本版本 (${updateInfo.version}) 可用。是否前往更新？`)) {
                              window.open(updateInfo.downloadUrl, '_blank');
                          }
                      } else {
                          console.log('当前已是最新版本。');
                      }
                  } catch (e) {
                      console.error('解析更新信息失败：', e);
                  }
              } else {
                  console.error(`更新检查请求失败，状态码: ${response.status}`);
              }
          },
          onerror: function(error) {
              console.error('更新检查请求出错：', error);
          }
      });
  };

  // 版本比较函数
  const compareVersions = (v1, v2) => {
      const v1parts = v1.split('.').map(Number);
      const v2parts = v2.split('.').map(Number);
      for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
          const a = v1parts[i] || 0;
          const b = v2parts[i] || 0;
          if (a > b) return 1;
          if (a < b) return -1;
      }
      return 0;
  };

  // 初始化脚本
  const init = () => {
      console.log('初始化脚本...');
      addStyles();
      initFollowButtons();
      createFloatingButton();
      requestNotificationPermission();
      checkForUpdates();
      // 自动刷新最新主题信息，每隔5分钟
      setInterval(updateFollowingAuthorsTopics, 5 * 60 * 1000);
  };

  // 更新所有关注作者的最新主题信息
  const updateFollowingAuthorsTopics = () => {
      console.log('定时更新关注作者的最新主题信息...');
      const followingAuthors = getFollowingAuthors();
      followingAuthors.forEach(({ uid }) => {
          const topicInfoDiv = document.querySelector(`.author-item[data-uid="${uid}"] .topic-info`);
          if (topicInfoDiv) {
              getLatestTopicInfo(uid, topicInfoDiv);
          } else {
              console.log(`未找到 UID=${uid} 的 topic-info 元素`);
          }
      });
  };

  // 监听页面加载和动态内容加载
  const observeDOM = () => {
      const observer = new MutationObserver((mutations) => {
          mutations.forEach(mutation => {
              if (mutation.type === 'childList') {
                  initFollowButtons();
              }
          });
      });
      observer.observe(document.body, { childList: true, subtree: true });
      console.log('已启动 MutationObserver 以监测动态内容');
  };

  // 监听页面加载
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
          init();
          observeDOM();
      });
  } else {
      init();
      observeDOM();
  };

})();
