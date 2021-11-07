// ==UserScript==
// @name         启嘉助手
// @namespace    https://assistant.hbsi.fur93.icu
// @version      0.1
// @description  嗯
// @author       玖叁 (colour93) <colour_93@furry.top>
// @match        http://next.change.tm/*
// @match        https://mooc.icve.com.cn/*
// @icon         https://www.google.com/s2/favicons?domain=change.tm
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// ==/UserScript==

(function() {
    'use strict';

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