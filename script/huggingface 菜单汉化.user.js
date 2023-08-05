// ==UserScript==
// @name        huggingface 菜单汉化
// @description  汉化 huggingface界面的部分菜单及内容
// @namespace   Violentmonkey Scripts
// @match       https://huggingface.co/
// @match      https://huggingface.co/*
// @grant       none
// @author       sec
// @version     1.0
// ==/UserScript==

(function() {
    'use strict';

    const i18n = new Map([
      ['Settings', '设置'],
      ['Get', '获取'],
      ['Organizations','组织'],
      ['Create New', '新建'],
      ['Resources', '资源'],
      ['Hub guide', '中枢指南'],
      ['Transformers doc', 'Transformers文档'],
      ['Forum', '论坛'],
      ['Tasks', '任务'],
      ['Course', '课程'],
        ['Light theme', '光明主题'],
        ['All', '全部'],
        ['Models', '模型'],
        ['Datasets', '数据集'],
        ['Spaces', '空间'],
        ['Community', '社区'],
        ['Likes', '喜欢'],
        ['Updated', '更新于'],
        ['minutes ago', '分钟前'],
        ['No application file', '没有应用文件'],
        ['Liked a space', '喜欢一个空间'],
        ['months ago', '个月前'],
        ['Liked a model', '喜欢一个模型'],
        ['days ago', '天前'],
        ['Hugging Face is way more fun with friends and colleagues! ', '与朋友和同事一起加入Hugging Face更快乐！'],
        ['Join an organization', '加入一个组织'],
        ['Search models, datasets, users...', '搜索模型、数据集、用户...'],
        ['Docs', '文档'],
        ['Solutions', '解决方案'],
        ['Pricing', '定价'],
        ['Profile', '概述'],
        ['Inbox', '收件箱'],
        ['Dark theme', '黑暗主题'],
        ['System theme', '系统主题'],
        ['Trending', '趋势'],
        ['last 7 days', '最近7天'],
        ['Privacy', '隐私保护'],
        ['Team', '团队'],
        ['Jobs', '工作机会'],
        ['TOS', '服务条款'],
        ['Website', '网站'],
        ['Metrics', '指标'],
        ['Languages', '语言'],
        ['Blog', '博客'],
        ['HF Store', '商店'],
        ['Classrooms', '教室'],
        ['Dismiss this message', '不再提醒'],
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
        ['Notifications', '通知'],
        ['New Model', '新模型'],
        ['New Dataset', '新数据集'],
        ['New Space', '新空间'],
        ['Create organization', '创建组织'],
        ['Sign Out', '退出登录'],
        ['Profile', '帐户简介'],
        ['Account', '帐户'],
        ['Organizations', '组织'],
        ['Billing', '计费'],
        ['Access Tokens', '访问令牌'],
        ['GPG Keys', 'GPG密钥'],
        ['Notifications', '通知'],
        ['Theme', '主题'],
        ['Profile Settings', '简介设置'],
        ['Full name', '全名'],
        ['Avatar', '头像'],
        ['Homepage', '主页'],
        ['(optional)', '（可选）'],
        ['Research interests', '研究兴趣'],
         ['GitHub username', 'GitHub用户名'],
        ['Twitter username', '推特账户'],
        ['Save changes', '保存更改'],
        ['Username', '用户名'],
        ['Primary email', '主要电子邮件'],
        ['We will use this email to communicate with you. This is also the email to use to authenticate on hf.co.', '我们将使用此电子邮件与您沟通。这也是用于在hf.co网站上进行认证的电子邮件。'],
        ['Password', '密码'],
        ['Enter new password', '输入新密码'],
        ['Additional emails', '额外的电子邮件'],
        ['Link additional emails to your account to join your organizations easily and', '将其他的电子邮件链接到你的账户，以便轻松地加入你的组织和'],
        ['Delete your account', '删除您的帐户'],
        ['Delete your HF account permanently, this action is irreversible. 全部 your repositories (models, datasets, & 空间) will be deleted.', '永久删除您的HF帐户，此操作是不可逆转的。您的全部存储库（模型，数据集，和空间）将被删除。'],
        ['Delete my account', '删除我的账户'],
        ['You are not a member of any organization.', '你不是任何组织的成员。'],
        ['Overview', '概述'],
        ['Payment information', '支付信息'],
        ['PRO Subscription', '专业版订阅'],
        ['Using HF paid services', '使用HF付费服务'],
        ['You need to add a payment method to get started.', '您需要添加一个支付方式才能开始使用。'],
        ['Update payment information', '更新支付信息'],
        ['Access tokens programmatically authenticate your identity to the Hugging Face Hub, allowing applications to perform specific actions specified by the scope of permissions (read, write, or admin) granted', '访问令牌以编程方式对您的身份进行认证，允许应用程序执行由授予的权限范围（读、写或管理）指定的具体行动。'],
        ['Notification', '通知'],
        ['Participating and mentions', '参与和提及'],
        ['Email', '电子邮件'],
        ['Web', '网页'],
        ['New activity on watched orgs/users', '被关注的组织/用户的新活动'],
        ['Watch settings ', '观察设置 '],
        ['Choose on which organizations/users to get notified on new discussions and PRs', '选择哪些组织/用户获得新的讨论和公告的通知'],
        ['repositories ', '仓库'],
        ['Other notifications (email only)', '其他的通知（仅电子邮件）'],
        ['New features and announcements', '新功能和公告'],
        ['Requests to join your organization', '要求加入你的组织'],
        ['Most Downloads', '最多下载'],
        ['Recently Updated', '最近更新'],
        ['Most 喜欢', '最多喜欢'],
        ['Libraries', '图书馆'],
        ['Licenses', '许可证'],
        ['Fine-Grained', '细致的'],
        ['Multilinguality', '多语言性'],
        ['Sizes', '大小'],
        ['Alphabetical', '按字母顺序排列'],
        ['Documentations', '文档资料'],
        ['Expert Acceleration Program', '专家加速计划'],
        ['Accelerate your ML roadmap', '加快你的ML路线图'],
        ['Private Hub', '私人枢纽'],
        ['Build ML collaboratively', '协同建立ML'],
        ['Inference Endpoints', '推导端点'],
        ['Deploy models in minutes', '几分钟内部署模型'],
        ['AutoTrain', '自动训练'],
        ['Create ML models without code', '无需代码即可创建ML模型'],
        ['Hardware', '硬件设施'],
        ['Scale with dedicated hardware', '使用专用硬件进行扩展'],
        ['None yet', '尚无'],
        ['Edit profile', '编辑个人资料'],
        ['a space', '空间'],
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
        ['Activity', '的活动内容'],

    ])

    replaceText(document.body)
//   |
//  ₘₙⁿ
// ▏n
// █▏　､⺍             所以，不要停下來啊（指加入词条
// █▏ ⺰ʷʷｨ
// █◣▄██◣
// ◥██████▋
// 　◥████ █▎
// 　　███▉ █▎
// 　◢████◣⌠ₘ℩
// 　　██◥█◣\≫
// 　　██　◥█◣
// 　　█▉　　█▊
// 　　█▊　　█▊
// 　　█▊　　█▋
// 　　 █▏　　█▙
// 　　 █ ​
    const bodyObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(addedNode => replaceText(addedNode))
      })
    })
    bodyObserver.observe(document.body, { childList: true, subtree: true })

    function replaceText(node) {
      nodeForEach(node).forEach(htmlnode => {
        i18n.forEach((value, index) => {
          // includes可直接使用 === 以提高匹配精度
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
})();