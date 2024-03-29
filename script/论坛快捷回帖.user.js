// ==UserScript==
// @name         论坛快捷回帖
// @namespace    bmqy.net
// @version      3.1.3
// @author       bmqy
// @description  使用自定义内容或本扩展预定义的回帖内容，快捷回复支持的论坛的发帖！
// @license      ISC
// @homepage     https://github.com/bmqy/bbs_quickreply#readme
// @homepageURL  https://github.com/bmqy/bbs_quickreply#readme
// @source       https://github.com/bmqy/bbs_quickreply.git
// @supportURL   https://github.com/bmqy/bbs_quickreply/issues
// @match        https://www.wnflb2023.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.3.6/dist/index.full.min.js
// @require      https://cdn.jsdelivr.net/npm/@element-plus/icons-vue@2.1.0/dist/index.iife.min.js
// @resource     element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.3.6/dist/index.css
// @connect      quickreply.lc.bmqy.net
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(t=>{const a=document.createElement("style");a.dataset.source="vite-plugin-monkey",a.textContent=t,document.head.append(a)})(' .quickReplyBox[data-v-15069efc]{position:relative}v-deep .el-dialog[data-v-15069efc]{display:flex;flex-direction:column;margin:0!important;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);max-height:calc(100% - 30px);max-width:1300px;min-width:1000px}v-deep .el-dialog__body[data-v-15069efc]{flex:1;overflow:auto;padding:0}.app-dialog-foot[data-v-15069efc]{color:#909399;font-size:14px}.quickReplyBoxTitle[data-v-15069efc]{margin-right:10px;font-weight:700;color:red}.el-form-item--mini.el-form-item[data-v-15069efc],.el-form-item--small.el-form-item[data-v-15069efc]{margin-bottom:10px}.el-select[data-v-15069efc]{width:300px}.app-margin-right-30[data-v-977a0533]{margin-right:30px}.list-left[data-v-977a0533]{padding-right:15px;display:flex;flex:1;align-items:stretch;justify-content:start}.list-number[data-v-977a0533]{margin-right:5px;color:#909399}.list-title[data-v-977a0533]{flex:1;font-weight:400}.list-right[data-v-977a0533]{min-width:70px}.list-right .el-badge.item[data-v-977a0533]{margin-right:30px}.list li[data-v-977a0533]{margin-bottom:5px;padding-bottom:5px;font-size:13px;line-height:30px;display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1px solid #ebeef5}.list li[data-v-977a0533]:hover{background-color:#f5f5f5}.tips[data-v-977a0533]{color:#909399;font-size:14px;text-align:center}.quickReplyLoginBox .tips[data-v-977a0533]{margin-left:50px;text-align:left;font-size:12px}.addReplyBox[data-v-977a0533]{margin-top:15px;padding-top:10px;border-top:1px dashed #ccc}.box-card .el-card__header[data-v-977a0533]{padding:10px 20px}.box-card .el-card__header span[data-v-977a0533]{font-size:14px}.clearfix[data-v-977a0533]:before,.clearfix[data-v-977a0533]:after{display:table;content:""}.clearfix[data-v-977a0533]:after{clear:both}.el-pagination[data-v-977a0533]{padding:15px 5px 0}.margin-left{margin-left:15px} ');

(function (vue, ElementPlus, ElementPlusIconsVue) {
  'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const ElementPlusIconsVue__namespace = /*#__PURE__*/_interopNamespaceDefault(ElementPlusIconsVue);

  const cssLoader = (e) => {
    const t = GM_getResourceText(e), o = document.createElement("style");
    return o.innerText = t, document.head.append(o), t;
  };
  cssLoader("element-plus/dist/index.css");
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$2 = { class: "quickReplyBox" };
  const _hoisted_2$2 = {
    slot: "label",
    class: "quickReplyBoxTitle"
  };
  const _hoisted_3$1 = { class: "app-dialog-foot" };
  const _sfc_main$2 = {
    __name: "App",
    setup(__props) {
      const { proxy } = vue.getCurrentInstance();
      const list = vue.ref([]);
      const currentReply = vue.ref("");
      const fwin_replyLoaded = vue.ref(false);
      const hasEditor = vue.ref(false);
      const lastClickElemet = vue.ref(false);
      const setShow = vue.ref(false);
      vue.onBeforeMount(() => {
        getList();
      });
      async function getList() {
        let myListStorage = proxy.$storage.get();
        list.value = myListStorage && myListStorage.length > 0 ? myListStorage : [];
        currentReply.value = "";
      }
      function openSet() {
        setShow.value = !setShow.value;
      }
      function updateMyList() {
        let myListStorage = proxy.$storage.get();
        list.value = myListStorage;
      }
      function enterReply() {
        if (fwin_replyLoaded.value) {
          enterPostReply();
        } else if (hasEditor.value) {
          enterEditorReply();
        } else {
          enterFastPostReply();
        }
      }
      function enterPostReply() {
        let $postmessage = document.querySelector("#postmessage");
        $postmessage.value = currentReply.value;
      }
      function enterFastPostReply() {
        try {
          let $fastpostmessage = document.querySelector(
            "#fastpostmessage"
          );
          $fastpostmessage.style.background = "";
          $fastpostmessage.value = currentReply.value;
        } catch (err) {
          console.log("请检查发帖权限！");
        }
      }
      function enterEditorReply() {
        let $editorTextarea = document.querySelector("#e_textarea");
        let $editorIframe = document.querySelector("#e_iframe").contentWindow.document.body;
        $editorIframe.style.background = "";
        $editorIframe.innerHTML = currentReply.value || window.bbcode2html(`${$editorTextarea.value}`);
      }
      function fastreBindClick() {
        document.querySelector("body").addEventListener(
          "click",
          (e) => {
            let theElement = `fastre&${e.target.href}`;
            if (lastClickElemet.value != theElement && e.target.className == "fastre") {
              lastClickElemet.value = theElement;
              fwin_replyLoaded.value = false;
            }
          },
          true
        );
      }
      function replyfastBindClick() {
        document.querySelector("body").addEventListener(
          "click",
          (e) => {
            let theElement = `replyfast&${e.target.href}`;
            if (lastClickElemet.value != theElement && e.target.className == "replyfast") {
              lastClickElemet.value = theElement;
              fwin_replyLoaded.value = false;
            }
          },
          true
        );
      }
      function flbcBindClick() {
        document.querySelector("body").addEventListener(
          "click",
          (e) => {
            let theElement = `flbc&${e.target.href}`;
            if (lastClickElemet.value != theElement && e.target.className == "flbc") {
              lastClickElemet.value = theElement;
              fwin_replyLoaded.value = false;
            }
          },
          true
        );
      }
      function checkEditor() {
        hasEditor.value = document.querySelector("#e_iframe");
      }
      function postReplyMutationObserver() {
        let mos = new MutationObserver(function(mutations, observer) {
          for (const mutation in mutations) {
            if (Object.hasOwnProperty.call(mutations, mutation)) {
              const element = mutations[mutation];
              if (element.target.id == "subjecthide") {
                fwin_replyLoaded.value = true;
              }
            }
          }
        });
        mos.observe(document.querySelector("#append_parent"), {
          attributes: true,
          childList: true,
          subtree: true
        });
      }
      const title = vue.computed(() => {
        return `${proxy.$app.getName()}`;
      });
      const tips = vue.computed(() => {
        return `${proxy.$app.getName()}设置`;
      });
      vue.onMounted(() => {
        checkEditor();
        postReplyMutationObserver();
        enterReply();
        fastreBindClick();
        replyfastBindClick();
        flbcBindClick();
      });
      vue.watch(fwin_replyLoaded, (n) => {
        if (n) {
          let $floatlayout_reply = document.querySelector(
            "#floatlayout_reply"
          );
          $floatlayout_reply.insertBefore(
            proxy.$el,
            $floatlayout_reply.childNodes[0]
          );
          enterPostReply();
        } else {
          let $fastposteditor = document.querySelector(
            "#fastposteditor"
          );
          $fastposteditor.insertBefore(
            proxy.$el,
            $fastposteditor.childNodes[0]
          );
        }
      });
      vue.watch(currentReply, (n) => {
        n && enterReply();
      });
      return (_ctx, _cache) => {
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_app_set = vue.resolveComponent("app-set");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
          vue.createVNode(vue.Transition, { name: "el-fade-in-linear" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form, {
                inline: true,
                class: "demo-form-inline"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_form_item, null, {
                    default: vue.withCtx(() => [
                      vue.createElementVNode("div", _hoisted_2$2, vue.toDisplayString(`${vue.unref(title)}: `), 1),
                      vue.createVNode(_component_el_select, {
                        modelValue: vue.unref(currentReply),
                        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(currentReply) ? currentReply.value = $event : null),
                        placeholder: "请选择",
                        "no-data-text": "这里啥都没有...",
                        onChange: enterReply
                      }, {
                        default: vue.withCtx(() => [
                          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(list), (item, index) => {
                            return vue.openBlock(), vue.createBlock(_component_el_option, {
                              key: index,
                              label: item,
                              value: item
                            }, null, 8, ["label", "value"]);
                          }), 128))
                        ]),
                        _: 1
                      }, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_form_item, null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_button, {
                        type: "primary",
                        class: "btnQuickReplySet",
                        icon: "tools",
                        onClick: openSet,
                        title: vue.unref(tips)
                      }, null, 8, ["title"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_dialog, {
            modelValue: vue.unref(setShow),
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.isRef(setShow) ? setShow.value = $event : null),
            title: _ctx.$app.getName(),
            width: "75%",
            "show-close": true,
            "append-to-body": ""
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_app_set, { onUpdateMyList: updateMyList })
            ]),
            footer: vue.withCtx(() => [
              vue.createElementVNode("span", _hoisted_3$1, vue.toDisplayString(`ver: ${_ctx.$app.getVersion()}`), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "title"])
        ]);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-15069efc"]]);
  const _withScopeId = (n) => (vue.pushScopeId("data-v-977a0533"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = { class: "setBox" };
  const _hoisted_2$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", null, "我在用的", -1));
  const _hoisted_3 = { style: { "margin-left": "10px" } };
  const _hoisted_4 = {
    key: 0,
    class: "quickReplyLoginBox"
  };
  const _hoisted_5 = { style: { "margin-top": "15px" } };
  const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", { class: "tips" }, [
    /* @__PURE__ */ vue.createTextVNode(" * 登录后，即可在任意设备同步你的配置；"),
    /* @__PURE__ */ vue.createElementVNode("br"),
    /* @__PURE__ */ vue.createTextVNode(" * 云端只负责保存账号及其回复列表，不留存多余信息；"),
    /* @__PURE__ */ vue.createElementVNode("br"),
    /* @__PURE__ */ vue.createTextVNode(" * 如不需登录，也可忽略登录界面，直接使用即可；"),
    /* @__PURE__ */ vue.createElementVNode("br")
  ], -1));
  const _hoisted_7 = { key: 1 };
  const _hoisted_8 = {
    key: 0,
    class: "list"
  };
  const _hoisted_9 = { class: "list-left" };
  const _hoisted_10 = { class: "list-number" };
  const _hoisted_11 = { class: "list-title" };
  const _hoisted_12 = { class: "list-right" };
  const _hoisted_13 = {
    key: 1,
    class: "tips"
  };
  const _hoisted_14 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "未设置快速回帖内容!", -1));
  const _hoisted_15 = [
    _hoisted_14
  ];
  const _hoisted_16 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", null, "网友分享的", -1));
  const _hoisted_17 = { class: "addReplyBox" };
  const _sfc_main$1 = {
    __name: "Set",
    emits: ["updateMyList"],
    setup(__props, { emit }) {
      const { proxy } = vue.getCurrentInstance();
      const myList = vue.ref([]);
      const systemList = vue.ref([]);
      const systemListCount = vue.ref(0);
      const loading = vue.ref(false);
      const isLogin = vue.ref(false);
      const realtimeSync = vue.ref(false);
      const showLoginForce = vue.ref(false);
      const newReply = vue.ref("");
      const queryData = vue.ref({
        skip: 0,
        prop: "replyId",
        order: "descending"
      });
      vue.onBeforeMount(() => {
        isLogin.value = proxy.$storage.getUserInfo("userId");
        realtimeSync.value = proxy.$storage.getUserInfo("realtimeSync");
        getMyList();
        getSystemList();
      });
      function getMyList() {
        let myListStorage = proxy.$storage.get();
        myList.value = myListStorage && myListStorage.length > 0 ? myListStorage : [];
      }
      async function getSystemList() {
        loading.value = true;
        let res = await proxy.$api.selectList(queryData.value.skip, queryData.value.prop, queryData.value.order);
        systemList.value = res.data.totalCount > 0 ? res.data.list : [];
        systemListCount.value = res.data.totalCount;
        loading.value = false;
      }
      function currentPageChange(current) {
        queryData.value.skip = (current - 1) * 10;
        getSystemList();
      }
      function sortChange(e) {
        queryData.value.prop = e.order ? e.prop : "replyId";
        queryData.value.order = e.order ? e.order : "descending";
        getSystemList();
      }
      function addReply() {
        if (newReply.value == "") {
          proxy.$message.error("回复内容不能为空！");
          return false;
        }
        if (myList.value.indexOf(newReply.value) != -1) {
          proxy.$message.error("该回复已添加过！");
          newReply.value = "";
          return false;
        }
        if (myList.value.length >= 10) {
          proxy.$message.warning("自定义回复，超出条数上限！");
          return false;
        }
        myList.value.push(newReply.value);
        updateMyList();
        newReply.value = "";
        return true;
      }
      function updateMyList() {
        proxy.$storage.set(myList.value);
        emit("updateMyList");
      }
      function delReply(index) {
        myList.value.splice(index, 1);
        updateMyList();
        realtimeSync.value && upload();
      }
      function shareReply(index) {
        proxy.$api.replyInsert(myList.value[index]).then((res) => {
          proxy.$message.success(res.memo);
        }).catch((err) => {
          proxy.$message.error(err.memo);
        });
      }
      function likeReply(index) {
        proxy.$api.likeCountUpdate(systemList.value[index].id).then((res) => {
          systemList.value[index]["likeCount"] = res.data.likeCount;
          proxy.$message.success(res.memo);
        }).catch((err) => {
          proxy.$message.error(err.memo);
        });
      }
      function collectReply(index) {
        let nStr = systemList.value[index].content;
        if (myList.value.indexOf(nStr) != -1) {
          proxy.$message.error("该回复已添加过！");
          return false;
        }
        newReply.value = nStr;
        proxy.$api.collectCountUpdate(systemList.value[index].id).then((res) => {
          addReply() && proxy.$message.success(res.memo);
          realtimeSync.value && upload();
        }).catch((err) => {
          proxy.$message.error(err.memo);
        });
      }
      function onLoginSuccess() {
        showLoginForce.value = false;
        isLogin.value = true;
        myList.value.length === 0 && download();
      }
      function upload() {
        if (myList.length == 0) {
          proxy.$message.error("无可同步数据");
          return false;
        }
        proxy.$api.upQuickReplyList({
          userId: proxy.$storage.getUserInfo("userId"),
          list: myList.value
        }).then((res) => {
          proxy.$message.success(res.memo);
        }).catch((err) => {
          proxy.$message.error(err.memo);
        });
      }
      function download() {
        proxy.$api.downQuickReplyList({
          userId: proxy.$storage.getUserInfo("userId")
        }).then((res) => {
          if (res.code != 0) {
            proxy.$message.error(res.memo);
            return false;
          }
          myList.value = res.data;
          updateMyList();
        }).catch((err) => {
          proxy.$message.error(err.memo);
        });
      }
      function loginForce() {
        showLoginForce.value = !showLoginForce.value;
      }
      function logout() {
        proxy.$storage.setUserInfo("userId", "");
        isLogin.value = false;
      }
      function changeRealtimeSync(e) {
        realtimeSync.value = e;
        proxy.$storage.setUserInfo("realtimeSync", e);
      }
      return (_ctx, _cache) => {
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_tooltip = vue.resolveComponent("el-tooltip");
        const _component_el_checkbox = vue.resolveComponent("el-checkbox");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_app_login = vue.resolveComponent("app-login");
        const _component_el_card = vue.resolveComponent("el-card");
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_el_tag = vue.resolveComponent("el-tag");
        const _component_el_table = vue.resolveComponent("el-table");
        const _component_el_pagination = vue.resolveComponent("el-pagination");
        const _component_el_input = vue.resolveComponent("el-input");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.createVNode(_component_el_card, {
            class: "box-card",
            shadow: "never"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_row, { gutter: 30 }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_col, { span: 9 }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_card, {
                        class: "box-card",
                        shadow: "never"
                      }, {
                        header: vue.withCtx(() => [
                          vue.createVNode(_component_el_row, {
                            gutter: 20,
                            justify: "space-between"
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_el_col, {
                                span: 12,
                                offset: 0
                              }, {
                                default: vue.withCtx(() => [
                                  _hoisted_2$1
                                ]),
                                _: 1
                              }),
                              vue.unref(isLogin) ? (vue.openBlock(), vue.createBlock(_component_el_col, {
                                key: 0,
                                span: 12,
                                offset: 0,
                                style: { "display": "flex", "justify-content": "end" }
                              }, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_el_tooltip, {
                                    class: "item",
                                    effect: "dark",
                                    content: "注销登录",
                                    placement: "top-start"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_el_button, {
                                        type: "danger",
                                        icon: "SwitchButton",
                                        size: "small",
                                        circle: "",
                                        onClick: logout
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_el_tooltip, {
                                    class: "item",
                                    effect: "dark",
                                    content: "上传列表，覆盖云端",
                                    placement: "top-start"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_el_button, {
                                        type: "primary",
                                        icon: "Upload",
                                        size: "small",
                                        circle: "",
                                        onClick: upload
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_el_tooltip, {
                                    class: "item",
                                    effect: "dark",
                                    content: "下载列表，覆盖本地",
                                    placement: "top-start"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_el_button, {
                                        type: "warning",
                                        icon: "Download",
                                        size: "small",
                                        circle: "",
                                        onClick: download
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_el_tooltip, {
                                    class: "item",
                                    effect: "dark",
                                    content: "开启实时同步，修改后立即上传",
                                    placement: "top-start"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createElementVNode("div", _hoisted_3, [
                                        vue.createVNode(_component_el_checkbox, {
                                          modelValue: vue.unref(realtimeSync),
                                          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(realtimeSync) ? realtimeSync.value = $event : null),
                                          label: "实时",
                                          size: "small",
                                          onChange: changeRealtimeSync
                                        }, null, 8, ["modelValue"])
                                      ])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })) : vue.createCommentVNode("", true),
                              !vue.unref(isLogin) && vue.unref(myList).length > 0 ? (vue.openBlock(), vue.createBlock(_component_el_col, {
                                key: 1,
                                span: 12,
                                offset: 0,
                                style: { "display": "flex", "justify-content": "end" }
                              }, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_el_tooltip, {
                                    class: "item",
                                    effect: "dark",
                                    content: "登录账号，云端同步",
                                    placement: "top-start"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_el_button, {
                                        type: "success",
                                        icon: "UserFilled",
                                        size: "small",
                                        circle: "",
                                        onClick: loginForce
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })) : vue.createCommentVNode("", true)
                            ]),
                            _: 1
                          })
                        ]),
                        default: vue.withCtx(() => [
                          vue.unref(myList).length === 0 && !vue.unref(isLogin) || vue.unref(showLoginForce) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4, [
                            vue.createElementVNode("div", _hoisted_5, [
                              vue.createVNode(_component_app_login, { onOnSuccess: onLoginSuccess }),
                              _hoisted_6
                            ])
                          ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_7, [
                            !vue.unref(showLoginForce) || vue.unref(myList).length > 0 ? (vue.openBlock(), vue.createElementBlock("ul", _hoisted_8, [
                              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(myList), (item, index) => {
                                return vue.openBlock(), vue.createElementBlock("li", { key: index }, [
                                  vue.createElementVNode("div", _hoisted_9, [
                                    vue.createElementVNode("div", _hoisted_10, vue.toDisplayString(`${index + 1}、`), 1),
                                    vue.createElementVNode("div", _hoisted_11, vue.toDisplayString(`${item}`), 1)
                                  ]),
                                  vue.createElementVNode("div", _hoisted_12, [
                                    vue.createVNode(_component_el_tooltip, {
                                      class: "item",
                                      effect: "dark",
                                      content: "分享它",
                                      placement: "top-start"
                                    }, {
                                      default: vue.withCtx(() => [
                                        vue.createVNode(_component_el_button, {
                                          type: "success",
                                          size: "mini",
                                          icon: "Share",
                                          circle: "",
                                          onClick: ($event) => shareReply(index)
                                        }, null, 8, ["onClick"])
                                      ]),
                                      _: 2
                                    }, 1024),
                                    vue.createVNode(_component_el_tooltip, {
                                      class: "item",
                                      effect: "dark",
                                      content: "移除",
                                      placement: "top-start"
                                    }, {
                                      default: vue.withCtx(() => [
                                        vue.createVNode(_component_el_button, {
                                          type: "danger",
                                          size: "mini",
                                          icon: "DeleteFilled",
                                          circle: "",
                                          onClick: ($event) => delReply(index)
                                        }, null, 8, ["onClick"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ])
                                ]);
                              }), 128))
                            ])) : vue.createCommentVNode("", true),
                            vue.unref(myList).length == 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_13, _hoisted_15)) : vue.createCommentVNode("", true)
                          ]))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_col, { span: 15 }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_card, {
                        class: "box-card",
                        shadow: "never",
                        "body-style": { padding: "0 20px 20px" }
                      }, {
                        header: vue.withCtx(() => [
                          _hoisted_16
                        ]),
                        default: vue.withCtx(() => [
                          vue.withDirectives((vue.openBlock(), vue.createBlock(_component_el_table, {
                            ref: "filterTable",
                            data: vue.unref(systemList),
                            size: "small",
                            stripe: "",
                            onSortChange: sortChange
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_el_table_column, {
                                prop: "replyId",
                                label: "ID",
                                width: "80"
                              }),
                              vue.createVNode(_component_el_table_column, {
                                prop: "content",
                                label: "内容"
                              }),
                              vue.createVNode(_component_el_table_column, {
                                prop: "likeCount",
                                sortable: "custom",
                                width: "100",
                                label: "点赞"
                              }, {
                                default: vue.withCtx((scope) => [
                                  vue.createVNode(_component_el_tag, {
                                    type: "info",
                                    size: "mini"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(vue.toDisplayString(scope.row.likeCount), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_el_table_column, {
                                label: "操作",
                                width: "100"
                              }, {
                                default: vue.withCtx((scope) => [
                                  vue.createVNode(_component_el_tooltip, {
                                    class: "item",
                                    effect: "dark",
                                    content: "给个赞",
                                    placement: "top-start"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_el_button, {
                                        type: "success",
                                        size: "mini",
                                        icon: "Pointer",
                                        circle: "",
                                        onClick: ($event) => likeReply(scope.$index)
                                      }, null, 8, ["onClick"])
                                    ]),
                                    _: 2
                                  }, 1024),
                                  vue.createVNode(_component_el_tooltip, {
                                    class: "item",
                                    effect: "dark",
                                    content: "收藏进我的",
                                    placement: "top-start"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_el_button, {
                                        type: "danger",
                                        size: "mini",
                                        icon: "StarFilled",
                                        circle: "",
                                        onClick: ($event) => collectReply(scope.$index)
                                      }, null, 8, ["onClick"])
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["data"])), [
                            [_directive_loading, vue.unref(loading)]
                          ]),
                          vue.createVNode(_component_el_pagination, {
                            background: "",
                            layout: "prev, pager, next",
                            "page-size": 10,
                            "pager-count": 5,
                            onCurrentChange: currentPageChange,
                            total: vue.unref(systemListCount)
                          }, null, 8, ["total"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.createElementVNode("div", _hoisted_17, [
                vue.createVNode(_component_el_input, {
                  placeholder: "请输入新的回复内容",
                  modelValue: vue.unref(newReply),
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.isRef(newReply) ? newReply.value = $event : null),
                  autosize: { minRows: 1, maxRows: 3 },
                  maxlength: "100",
                  "show-word-limit": true,
                  resize: "none",
                  clearable: "",
                  class: "input-with-select"
                }, {
                  append: vue.withCtx(() => [
                    vue.createVNode(_component_el_button, {
                      icon: "Plus",
                      onClick: addReply
                    })
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          })
        ]);
      };
    }
  };
  const Set = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-977a0533"]]);
  const _hoisted_1 = { class: "margin-left" };
  const _hoisted_2 = { class: "margin-left" };
  const _sfc_main = {
    __name: "Login",
    emits: ["onSuccess"],
    setup(__props, { emit }) {
      const { proxy } = vue.getCurrentInstance();
      const checkName = (rule, value, callback) => {
        if (!/[0-9a-zA-Z@\.]{5,20}/.test(value)) {
          callback("用户名5-20，只能包含字母、数字、“.”、“@”等");
        }
        callback();
      };
      const checkPassword = (rule, value, callback) => {
        if (!/[0-9a-zA-Z\.\-_]{2,20}/.test(value)) {
          callback("密码2-20，只能包含字母、数字、“.”、“-”、“_”等");
        }
        callback();
      };
      const checkRePassword = (rule, value, callback) => {
        if (value !== loginForm.value.password) {
          callback("两次密码不一致");
        }
        callback();
      };
      const registerFormRef = vue.ref();
      const formMode = vue.ref(1);
      const registerRules = vue.ref({
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
          // { validator: checkName, trigger: 'blur'}
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { validator: checkPassword, trigger: "blur" }
        ],
        rePassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { validator: checkRePassword, trigger: "blur" }
        ]
      });
      const loginFormRef = vue.ref();
      const loginForm = vue.ref({
        username: "",
        password: "",
        rePassword: ""
      });
      const loginRules = vue.ref({
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { validator: checkName, trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { validator: checkPassword, trigger: "blur" }
        ]
      });
      const loginSuccess = (res) => {
        proxy.$storage.setUserInfo("userId", res.data.userId);
        emit("onSuccess");
      };
      const loginOnSubmit = () => {
        loginFormRef.value.validate(async (valid, fields) => {
          if (valid) {
            proxy.$api.login(loginForm.value).then((res) => {
              if (res.code != 0) {
                proxy.$message.error(res.memo);
                return false;
              }
              loginSuccess(res);
            }).catch((err) => {
              console.log("登录失败：", err);
            });
          }
        });
      };
      const registerOnSubmit = () => {
        registerFormRef.value.validate(async (valid, fields) => {
          if (valid) {
            proxy.$api.register(loginForm.value).then((res) => {
              if (res.code != 0) {
                proxy.$message.error(res.memo);
                return false;
              }
              loginSuccess(res);
            }).catch((err) => {
              console.log("注册失败：", err);
            });
          }
        });
      };
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_link = vue.resolveComponent("el-link");
        const _component_el_form = vue.resolveComponent("el-form");
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.unref(formMode) === 1 ? (vue.openBlock(), vue.createBlock(_component_el_form, {
            key: 0,
            ref_key: "loginFormRef",
            ref: loginFormRef,
            model: vue.unref(loginForm),
            rules: vue.unref(loginRules),
            "label-width": "120px"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form_item, {
                label: "用户名：",
                prop: "username",
                required: ""
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    modelValue: vue.unref(loginForm).username,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(loginForm).username = $event)
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "密码：",
                prop: "password",
                required: ""
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    modelValue: vue.unref(loginForm).password,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(loginForm).password = $event)
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    onClick: loginOnSubmit
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("登录")
                    ]),
                    _: 1
                  }),
                  vue.createElementVNode("div", _hoisted_1, [
                    vue.createVNode(_component_el_link, {
                      href: "javascript:;",
                      onClick: _cache[2] || (_cache[2] = ($event) => formMode.value = 0)
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("注册")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["model", "rules"])) : (vue.openBlock(), vue.createBlock(_component_el_form, {
            key: 1,
            ref_key: "registerFormRef",
            ref: registerFormRef,
            model: vue.unref(loginForm),
            rules: vue.unref(registerRules),
            "label-width": "120px"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form_item, {
                label: "用户名：",
                prop: "username",
                required: ""
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    modelValue: vue.unref(loginForm).username,
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(loginForm).username = $event)
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "密码：",
                prop: "password",
                required: ""
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    modelValue: vue.unref(loginForm).password,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(loginForm).password = $event)
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "确认密码：",
                prop: "rePassword",
                required: ""
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    modelValue: vue.unref(loginForm).rePassword,
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.unref(loginForm).rePassword = $event)
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    onClick: registerOnSubmit
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("注册")
                    ]),
                    _: 1
                  }),
                  vue.createElementVNode("div", _hoisted_2, [
                    vue.createVNode(_component_el_link, {
                      href: "javascript:;",
                      onClick: _cache[6] || (_cache[6] = ($event) => formMode.value = 1)
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("登录")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["model", "rules"]))
        ]);
      };
    }
  };
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const Storage = {
    install: (app2, options) => {
      app2.config.globalProperties.$storage = {
        key: "QuickReply",
        userStorageKey: "QuickReplyUser",
        set(value) {
          _GM_setValue(this.key, value);
        },
        get() {
          if (_GM_getValue(this.key) && _GM_getValue(this.key).length > 0) {
            return _GM_getValue(this.key);
          } else {
            return [];
          }
        },
        setUserInfo(key, value) {
          let fullKey = `${this.userStorageKey}.${key}`;
          _GM_setValue(fullKey, value);
        },
        getUserInfo(key) {
          let fullKey = `${this.userStorageKey}.${key}`;
          if (_GM_getValue(fullKey) !== "") {
            return _GM_getValue(fullKey);
          } else {
            return "";
          }
        }
      };
      app2.config.globalProperties.$app = {
        getName() {
          return _GM_info["script"]["name"];
        },
        getVersion: function() {
          return _GM_info["script"]["version"];
        }
      };
    }
  };
  const http = function(api, data) {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "POST",
        url: `https://quickreply.lc.bmqy.net/1.1/functions${api}`,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-LC-Id": `JLqezdmWrYQOatywxVKmB9pX-gzGzoHsz`,
          "X-LC-Key": `hemx77fyB2Usg317i2crcuer`
        },
        data: `${JSON.stringify(data)}`,
        responseType: "json",
        onload: function(xhr) {
          if (xhr.status == 200) {
            resolve(xhr.response.result);
          } else {
            reject(xhr.response.result);
          }
        },
        onerror: function(xhr) {
          reject(xhr.response);
        }
      });
    });
  };
  const Api = {
    install: (app2, options) => {
      app2.config.globalProperties.$api = {
        // 获取网友分享的回复
        selectList: async function(skip = 0, prop = "replyId", order = "descending") {
          return await http("/selectList", {
            skip,
            prop,
            order
          });
        },
        // 更新收藏数量
        collectCountUpdate: async function(replyId) {
          return await http("/collectCountUpdate", {
            replyId
          });
        },
        // 更新点赞数量
        likeCountUpdate: async function(replyId) {
          return await http("/likeCountUpdate", {
            replyId
          });
        },
        // 添加网友分享的回复
        replyInsert: async function(content) {
          return await http("/replyInsert", {
            content
          });
        },
        // 用户注册
        register: async function(params) {
          return await http("/register", params);
        },
        // 用户登录
        login: async function(params) {
          return await http("/login", params);
        },
        // 上传列表
        upQuickReplyList: async function(params) {
          return await http("/uploadList", params);
        },
        // 下载列表
        downQuickReplyList: async function(params) {
          return await http("/downloadList", params);
        }
      };
    }
  };
  const app = vue.createApp(App);
  for (const [key, component] of Object.entries(ElementPlusIconsVue__namespace)) {
    app.component(key, component);
  }
  app.component("app-set", Set);
  app.component("app-login", _sfc_main);
  app.use(ElementPlus);
  app.use(Storage);
  app.use(Api);
  app.mount(
    (() => {
      const $fastposteditor = document.querySelector("#fastposteditor");
      const $postbox = document.querySelector("#postbox");
      const $appRoot = document.createElement("div");
      if ($fastposteditor) {
        $fastposteditor.insertBefore($appRoot, $fastposteditor.childNodes[0]);
      }
      if ($postbox) {
        $postbox.insertBefore($appRoot, $postbox.childNodes[4]);
      }
      return $appRoot;
    })()
  );

})(Vue, ElementPlus, ElementPlusIconsVue);
