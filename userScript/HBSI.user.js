// ==UserScript==
// @name         HBSI助手
// @namespace    https://assistant.hbsi.fur93.icu
// @version      0.1
// @description  嗯
// @author       玖叁 (colour93) <colour_93@furry.top>
// @match        *://next.change.tm/*
// @match        *://mooc.icve.com.cn/*
// @icon         https://www.google.com/s2/favicons?domain=change.tm
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js
// @resource     css  https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css
// ==/UserScript==

(async function() {
    'use strict';

    GM_addStyle(GM_getResourceText("css"));

    // ===============启嘉助手 模块===============
    if (window.location.hostname == "next.change.tm") {

        // 初始化变量
        const getLevelResourceURL = "http://next.change.tm/api/student/Course/getLevelResource";
        const getResourceDetailURL = "http://next.change.tm/api/student/Course/getResourceDetail";
        const setLevelArticleURL = "http://next.change.tm/api/student/Course/setLevelArticle";
        const token = localStorage.getItem("[application]token");
        let url = window.location;
    
        // ---------一键通关 模块---------
        if (window.location.pathname == "/course/CourseDetail") {
            
            // 绑定样式
            let style = document.createElement("style");
            style.type = "text/css";
            let text = document.createTextNode(".float-btn{position:fixed;right:40px;top:50vh;width:auto;height:48px;color:#fff;text-align:center;cursor:pointer;border-radius:10px;border:none;padding:0 10px 0 10px;background-color:#237cec;transition:all 0.25s;color:#fff;}.float-btn:hover,.float-btn:disabled{background-color:#1856a1;}");
            style.appendChild(text);
            let head = document.getElementsByTagName("head")[0];
            head.appendChild(style);
            let floatBtn = '<button class="float-btn" id="oneClickToLoad">一键加载</button>';
            let body = $("body");
            body.prepend(floatBtn);
        
            // 按钮绑定
            $("#oneClickToLoad").click(async function () {
                $(this).html('正在执行');
                $(this).attr("disabled", "disabled");
                let result = await rollSetLevelArticle();
                if (result=='ok') {
                    alert("操作完毕，即将刷新页面\n请注意，实际学习进度除了与加载出的课件有关外，实际操作题的运行也占一部分\n本插件不会自动做题");
                    window.location.reload();
                }
            });
        
        }
        
        // ---------基础操作函数---------

        // 循环解锁等级限制
        function rollSetLevelArticle () {
            return new Promise ( async (resolve, reject) => {
    
                let x = {};
    
                // 按次循环 防gank
                for (let i = 0; i < 300; i++) {
                    x = await setLevelArticle();
                    if (x.code == 0) {
                        resolve('ok');
                        break;
                    }
                }
                resolve('not ok');
            })
        }
    
        // 解锁等级限制
        function setLevelArticle () {
            return new Promise ( async (resolve, reject) => {
    
                // 由URL初始化变量
                let { course_id } = getQueryArgs(window.location.search);
                let level_content_id = getQueryArgs(window.location.search).id;
    
                // 发送请求
                axios({
                    method: 'post',
                    url: setLevelArticleURL,
                    data: {
                        level_content_id, course_id
                    },
                    headers: {token}
                })
                    .then((resp) => {
                        if (resp.data.data == "{-null-}") {
                            resolve({code:0});
                            return;
                        };
                        console.log(resp.data);
                        resolve(resp.data);
                    });
            })
        }
        
        // 获取资源详情
        function getResourceDetail (resourceId) {
            return new Promise ( async (resolve, reject) => {
    
                
            })
        }
    
        // 获取课程资源
        function getLevelResource () {
            return new Promise ( async (resolve, reject) => {
    
                // 由URL初始化变量
                let { course_id } = getQueryArgs(window.location.search);
                let level_content_id = getQueryArgs(window.location.search).id;
        
                // 发送请求
                axios({
                    method: 'get',
                    url: getLevelResourceURL,
                    params: {
                        level_content_id, course_id
                    },
                    headers: {token}
                })
                    .then((resp) => {
                        console.log(resp.data);
                        resolve(resp.data);
                    });
            })
        }
        
    }


    //  ===============职教云mooc助手 模块===============
    if (window.location.hostname == "mooc.icve.com.cn") {

        const   _self = unsafeWindow,
                top = _self;

        try {
            while (top != _self.top) top = top.parent.document ? top.parent : _self.top;
        } catch (err) {
            console.log(err);
            top = _self;
        }
        
        // ---------课程详情 模块---------
        if (window.location.pathname == "/study/courseLearn/resourcesStudy.html") {

            // 等待DOM载入
            window.onload = () => {

                // 挂载载入提示
                $("body").append(`<div class="toast-container position-absolute bottom-0 end-0 p-3"><div class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true" id="toolBoxLoading" data-bs-autohide="false"><div class="d-flex"><div class="toast-body"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>                HBSI助手 - 职教云MOOC模块 载入中...</div></div></div></div>`)
                let loadingToast = new bootstrap.Toast($("#toolBoxLoading"));
                // 显示提示
                loadingToast.show();
                
                // 创建监听器，以及监听回调
                // 用于判断信息与DOM加载
                let liListner = new MutationObserver(()=>{
                    console.log("[HSBI助手] 信息载入完毕");
                    loadingToast.hide();
                    let cate = $("li.np-section-level.np-section-level-3.active").data().categoryname;
                    console.log(cate)
                    switch (cate) {
                        case "视频":
                            videoHandler();
                            break;
                    
                        default:
                            break;
                    }
                });
                liListner.observe($("ol.np-section-list")[0], {
                    childList: true
                })
            }

            // 视频处理函数
            function videoHandler () {
                
                // 初始化
                let ls_playRate = parseInt(localStorage.getItem("[hbsiTB]playRate"));
                let player = top.jwplayer($(".jwplayer").attr("id"));

                console.log("[HBSI助手] 初始化完毕");
                    
                // 清除样式
                $("ul#topDirectorUl").attr("style","float: left;margin-left: 60px;");
                
                // 挂载工具箱按钮
                let toolBoxA = `<li><a id="toolBoxA" data-bs-toggle="modal" data-bs-target="#toolBoxModal">工具箱</a></li>`;
                let ul = $("ul.am-nav.am-nav-pills.am-topbar-right.admin-header-list");
                ul.append(toolBoxA);

                // 挂载工具箱modal
                let toolBoxModal = `<div class="modal fade" id="toolBoxModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">工具箱设置</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><div class="playRate"><label for="playRateRange" class="form-label">播放倍速</label><span id="playRateRangeSpan"></span><input type="range" class="form-range" min="1" max="8" step="1" id="playRateRange" onchange="document.getElementById('playRateRangeSpan').innerHTML=value"></div></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button><button type="button" class="btn btn-primary" id="saveSettingsBtn" data-bs-dismiss="modal">确定</button></div></div></div></div>`;
                let body = $("body");
                body.append(toolBoxModal);

                // 若是初次使用
                if(!ls_playRate) {
                    ls_playRate = player.getPlaybackRate();
                    localStorage.setItem("[hbsiTB]playRate",ls_playRate);
                };

                // 初始化工具箱显示数值
                document.getElementById('playRateRangeSpan').innerHTML = ls_playRate;
                document.getElementById('playRateRange').value = ls_playRate;
                
                // 初始化倍速
                player.setPlaybackRate(ls_playRate);

                
                // 添加工具箱保存监听
                document.getElementById('saveSettingsBtn').addEventListener('click',() => {

                    // 设置倍速
                    ls_playRate = parseInt(document.getElementById('playRateRange').value);
                    localStorage.setItem("[hbsiTB]playRate", ls_playRate);
                    player.setPlaybackRate(ls_playRate);
                    console.log(`[HBSI助手] ${ls_playRate}倍速`);
                })
            
            }
            
        }
    }


    // ---------常规函数---------

    // 处理URL查询参数
    function getQueryArgs(url){
    var qs = (url.length > 0 ? url.substring(url.indexOf('?')).substr(1) : ''),
        //保存每一项
        args = {},
        //得到每一项
        items = qs.length ? qs.split('&') : [],
        item = null,
        name = null,
        value = null,
        i = 0,
        len = items.length;

        for(i = 0;i<len ;i++){
            item = items[i].split('='),
            name = decodeURIComponent(item[0])
            value = decodeURIComponent(item[1])
            if(name.length){
                args[name] = value;
            }
        }
        return args;
    }

})();