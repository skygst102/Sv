"use strict";

function _each(obj, fn) {
    if (obj.length) {
        for (var i = 0; i < obj.length; i++) {
            var rFn = fn.call(obj, obj[i], i, obj);
            if (rFn === false || i == 1000) break;
            if (rFn === true || i == 1000) continue;
        }
    } else {
        for (var key in obj) fn.call(obj, obj[key], i, obj);
    }
}
function info(obj, msg) {
    var info = "";
    for (var key in obj) {
        info += key + " ";
    }
    console.log(info + "---" + msg);
} 

/* 建立模型 */
Sv.model("component", function () {
    this.component = {
        ss: function () {
            console.log("ss");
        }
    };
    this.action = function () {
        var observe = {},arr = [];
        var vdom = Sv.vdom(this.tpl || document.querySelector(this.scope).innerHTML);
        var RegExp = /\{\{([\s\S]+?)\}\}/;
        var hasBind=function (attrs) {
            for (var i = 0; i < attrs.length ;i++){
                if (/@bind/.test(attrs[i].nodeName) && attrs[i].nodeValue!='') {
                    return attrs[i];
                }
            } 
        };
        //编译之前处理模板
        ;[].slice.call(vdom.querySelectorAll("*")).forEach(function (key, i, self) {
            var bind = hasBind(key.attributes);
            if (bind) {
                var nodes = key.childNodes;
                if (nodes.length>1) {
                    var svtpl=[];
                    for (var i = 0; i < nodes.length;i++){
                        if (nodes[i].nodeType == 3 && RegExp.test(nodes[i].nodeValue)) {
                            svtpl.push(nodes[i].nodeValue.replace(RegExp, "{$1}").replace(/\s/g, ''));
                        }
                    }
                }else{
                    var nodeValue = key.childNodes[0].nodeValue;
                    if (RegExp.test(nodeValue)) {
                        var svtpl = nodeValue.replace(RegExp, "{$1}").replace(/\s/g, '');
                    }
                }
                if (svtpl) {
                    key.setAttribute("svtpl", svtpl);
                }
            }
        }.bind(this));

        console.log(vdom); 
        //编译模板
        var html = Sv.tplEngine(vdom.innerHTML, this.data); 
        document.querySelector(this.scope).innerHTML = html;
        //处理dom 
        var dom = document.querySelector(this.scope).querySelectorAll("*");
        var RegExp2 =/\[(.*)\]/;
        var RegExp3 =/\((.*)\)/;
       // var filterAttr='css,attr,nodeValue';
        [].slice.call(dom).forEach(function (key, i, self) {
            var bind = hasBind(key.attributes);
            if (bind) {
                //@bind 句法定义
                //@bind[attr(style)]='css'
                //@bind[text]='ht'
                var changeCon = bind.nodeName.match(RegExp2)[1];
                var getBindAttr = bind.nodeValue.split(',');
                //this.store赋值
                for (var i = 0; i < getBindAttr.length;i++){
                    if (this.store.hasOwnProperty(getBindAttr[i])) {
                        this.store[getBindAttr[i]]='';
                    }
                };
                var svtpl = key.svtpl = key.getAttribute("svtpl");
                arr.push([getBindAttr, key, svtpl,changeCon]);
                getBindAttr.forEach(function (key, i, arr) {
                    if (!observe.hasOwnProperty(key)) {
                        observe[key] = [];
                    }
                })
               
                // var nodes = key.childNodes;
                // key.removeAttribute("svbind");
                // key.removeAttribute("svtpl");
                
            };
            
        }.bind(this));
        // analysis
        //映射对象 
        arr.forEach(function (key, i, arr) {
            key[0].forEach(function (key2, i, arr){
                var con=key[2].split(',');
                observe[key2].push([key[1], con[i],key[3],i]);
            })
        });
        console.log(observe); 
        var observeAction={
            text:function (el,key,val){
                el.childNodes[key[3]].nodeValue = key[1].replace(/\{([\s\S]+?)\}/, val);
            },
            attr:function (el,key,val) {
                var bindAttr=key[2].match(RegExp3)[1];
                if (bindAttr=='style') {
                    var style;
                    if (typeof val=='object'&&!val.length) {
                        style=JSON.stringify(val).replace(/,/,';').replace(/(\{")|("\})/g,'').replace(/":"/g,':');
                    }
                    el.style.cssText+=style;
                }
            }
        };

        //监听修改 
        Sv.observe(this.store, this.store, null, setter);
        function setter(val, setkey) {
            observe[setkey].forEach(function (key, i, arr) {
                if (key[2]=='text') {
                    observeAction.text(key[0],key,val);
                }else if(/attr/.test(key[2])){
                    observeAction.attr(key[0],key,val);
                }
            });
        };

        

        
        
    };
});
/* 建立模型 */
Sv.model("test", function () {
    this.test = {
        tt: function () {
            return "tt";
            console.log("tt");
        }
    };
});
var tpl = new Sv.component({
    scope: "#dss",
    extend: ["test"],
    data: {
        k: "<script2>",
        s: "....0.000...",
        b: 'cccccccccccccc'
    },
    store: {
        k: "<script2>",
        s: "....0.000...",
        te1: 'bsbssbsbsbsbsbsbsb',
        te2: 'lllllllll',
        css:'css'
    },
    tpl:'<div id="ss" style = "color:red" @bind[text]="te1,te2">\
            te1{{b}}\
            <span @bind[attr(clientHeight)]>123</span>\
            <span>1234<a>aaaaaaaa<i></i></a></span>\
            {{s}}te2\
        </div >\
        <div @bind[attr(style)]="css">{{b}}<span @bind[attr(style)]="css">{{s}}</span></div>',
    init: function () {
        info(this, '!this is a "run" function 137');
        // console.log(this.tpl) 
        if (this.test.tt() == "tt") {
            console.log("调用成功");
        }
        console.log(this);
  
    }
});
// //测试一： this指向模型，与模型配置 //this 与模型this保持一致 
tpl.controller('ready', function () {
    info(this, '!this is a "tpl.controller" function ')

})



// if (tpl.tpl) {
//     info(tpl, '!this is a "tpl obj" function ')
// }
// 在浏览器console 内输入  tpl.store.k = '45646466' 可测试数据绑定效果
// var tpl2 = new Sv.component({
//     scope: '.tt',
//     extend: [],
//     store: {
//         k: '<script2>'
//     },
//     tpl: '',
//     init: function () {
//         this.store.k = '10210'
//         console.log(this)
//     }
// })
// tpl2.controller(function () {
//     this.store.k = '100....'
// })

// \
// <div>{{ s }}\
//             <span style="color:red">{{ k }}12</span><br />\
//         </div>








//TODO //tplUrl      ==+ //tpl数组     ==+