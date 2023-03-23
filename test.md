# Untitled

### 语句

写一个python脚本 利用chatgpt api 提供第三方服务

收录了一些自用**TamperMonkey**[油猴脚本](https://greasyfork.org/zh-CN) 如果觉得不错，点个`Star`吧 😃

## Install

首先安装[TamperMonkey](https://www.tampermonkey.net/)或者[暴力猴](https://violentmonkey.github.io/)拓展，也就是俗称的油猴拓展，版本库中有如下脚本，可以直接点击安装按钮进行安装。

| 名称 | 详情 | 安装 | 简介 |
| --- | --- | --- | --- |
| 文本选中复制 | https://github.com/WindrunnerMax/TKScript/blob/master/src/copy/README.md | https://cdn.jsdelivr.net/gh/WindrunnerMax/TKScript@master/dist/copy.user.js｜https://raw.githubusercontent.com/WindrunnerMax/TKScript/master/dist/copy.user.js | 解除网站不允许复制的限制，需要适配新的网站可提issue。 |
| 文本选中复制-通用 | https://github.com/WindrunnerMax/TKScript/blob/master/src/copy-currency/README.md | https://cdn.jsdelivr.net/gh/WindrunnerMax/TKScript@master/dist/copy-currency.user.js｜https://raw.githubusercontent.com/WindrunnerMax/TKScript/master/dist/copy-currency.user.js | 文本选中复制通用处理版本，具体使用方式请查阅详情。 |
| 跳转链接直达 | https://github.com/WindrunnerMax/TKScript/blob/master/src/site-director/README.md | https://cdn.jsdelivr.net/gh/WindrunnerMax/TKScript@master/dist/site-director.user.js｜https://raw.githubusercontent.com/WindrunnerMax/TKScript/master/dist/site-director.user.js | 去掉确定跳转链接页面，用于谷歌、知乎、CSDN、简书。 |
| 自动展开阅读全文 | https://github.com/WindrunnerMax/TKScript/blob/master/src/expansion/README.md | https://cdn.jsdelivr.net/gh/WindrunnerMax/TKScript@master/src/expansion/expansion.user.js｜https://raw.githubusercontent.com/WindrunnerMax/TKScript/master/src/expansion/expansion.user.js | 展开阅读全文，用于CSDN、知乎。 |
| 放开飞书复制和右键 | https://greasyfork.org/zh-CN/scripts/454518-%E6%94%BE%E5%BC%80%E9%A3%9E%E4%B9%A6%E5%A4%8D%E5%88%B6%E5%92%8C%E5%8F%B3%E9%94%AE | 安装｜https://raw.githubusercontent.com/WindrunnerMax/TKScript/master/src/captcha/captcha.user.js | 自动填写强智的验证码，请自行处理@match到匹配地址。 |
| 强智教务验证码识别 | https://github.com/WindrunnerMax/TKScript/blob/master/src/captcha/README.md | https://cdn.jsdelivr.net/gh/WindrunnerMax/TKScript@master/src/captcha/captcha.user.js｜https://raw.githubusercontent.com/WindrunnerMax/TKScript/master/src/captcha/captcha.user.js | 自动填写强智的验证码，请自行处理@match到匹配地址。 |
| 强智教务验证码识别 | https://github.com/WindrunnerMax/TKScript/blob/master/src/captcha/README.md | https://cdn.jsdelivr.net/gh/WindrunnerMax/TKScript@master/src/captcha/captcha.user.js｜https://raw.githubusercontent.com/WindrunnerMax/TKScript/master/src/captcha/captcha.user.js | 自动填写强智的验证码，请自行处理@match到匹配地址。 |
| 强智教务验证码识别 | https://github.com/WindrunnerMax/TKScript/blob/master/src/captcha/README.md | https://cdn.jsdelivr.net/gh/WindrunnerMax/TKScript@master/src/captcha/captcha.user.js｜https://raw.githubusercontent.com/WindrunnerMax/TKScript/master/src/captcha/captcha.user.js | 自动填写强智的验证码，请自行处理@match到匹配地址。 |
| 强智教务验证码识别 | https://github.com/WindrunnerMax/TKScript/blob/master/src/captcha/README.md | https://cdn.jsdelivr.net/gh/WindrunnerMax/TKScript@master/src/captcha/captcha.user.js｜https://raw.githubusercontent.com/WindrunnerMax/TKScript/master/src/captcha/captcha.user.js | 自动填写强智的验证码，请自行处理@match到匹配地址。 |

## Release

如果想`clone`版本库自行打包脚本，请使用`pnpm`，如果不需要这步操作，可以直接在上方表格点击安装按钮即可安装打包好的脚本。版本库中`dist`为打包目录，其中仅`copy`、`site-director`、`copy-currency`脚本需`rollup`打包使用，其他脚本直接安装即可。

`$ pnpm install
$ pnpm run build`
