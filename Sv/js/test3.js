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
} /* 建立模型 */
Sv.model("component", function () {
    this.component = {
        ss: function () {
            console.log("ss");
        }
    };
    this.action = function () {
        var observe = {},
            arr = [];
        var vdom = Sv.vdom(this.tpl || document.querySelector(this.scope).innerHTML);
        var RegExp = /\{\{([\s\S]+?)\}\}/;

        //@bind(html)
        //@bind(attr)
        //@bind(html,attr)
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
                    // var svbind = [];
                    for (var i = 0; i < nodes.length;i++){
                        if (nodes[i].nodeType == 3 && RegExp.test(nodes[i].nodeValue)) {
                            // svbind.push(nodes[i].nodeValue.match(RegExp)[1].replace(/\s/g, ''));
                            svtpl.push(nodes[i].nodeValue.replace(RegExp, "{$1}").replace(/\s/g, ''));
                        }
                    }
                }else{
                    var nodeValue = key.childNodes[0].nodeValue;
                    if (RegExp.test(nodeValue)) {
                        // var svbind = nodeValue.match(RegExp)[1].replace(/\s/g, '');
                        var svtpl = nodeValue.replace(RegExp, "{$1}").replace(/\s/g, '');
                    }
                }
                if (svtpl) {
                    // key.setAttribute("svbind", svbind);
                    key.setAttribute("svtpl", svtpl);
                }
            }
        }.bind(this));

        console.log(vdom); 
        //编译模板
        var html = Sv.tplEngine(vdom.innerHTML, this.data); 
        document.querySelector(this.scope).innerHTML = html;

        console.log(html);
        
        //处理dom 
        var dom = document.querySelector(this.scope).querySelectorAll("*");
        var RegExp2 =/\[(.*)\]/;
        var RegExp3 =/\((.*)\)/;
        var filterAttr='css,attr,nodeValue';
        function attrBind(arg){
            // console.warn(arg);
            
        }
        
        [].slice.call(dom).forEach(function (key, i, self) {
            var bind = hasBind(key.attributes);
            if (bind) {
                //@bind 句法定义
                //bind.nodeName (@bind*)
                //@bind[attr(style)]='css'
                //@bind[html]='ht'
                var changeAttr = bind.nodeName.match(RegExp2)[1];
                var attrMap = bind.nodeValue.split(',');
                if (/text/.test(changeAttr)) {
                    console.info(changeAttr);
                }
                if (/attr/.test(changeAttr)) {
                    var attrArg=changeAttr.match(RegExp3)[1];
                    attrBind(attrArg)
                }
                // console.log(changeAttr,attrMap);
                //this.store赋值
                for (var i = 0; i < attrMap.length;i++){
                    if (!this.store.hasOwnProperty(attrMap[i])) {
                        this.store[attrMap[i]]='';
                    }else{
                        console.error('Variables (' + attrMap[i] + ') already exist!');
                        return;
                    }
                };

                console.log(attrMap);
                // console.log(this.store);
                var svtpl = key.svtpl = key.getAttribute("svtpl");
                arr.push([attrMap, key, svtpl]);
                attrMap.forEach(function (key, i, arr) {
                    if (!observe.hasOwnProperty(key)) {
                        observe[key] = [];
                    }
                })
                
                // var nodes = key.childNodes;
                // key.removeAttribute("svbind");
                // key.removeAttribute("svtpl");
                // if (svtpl&&attrMap) {
                 
                    
                console.log(observe);
                
            };
            
        }.bind(this));

        // analysis
        //映射对象 
        // arr.forEach(function (key, i, arr) {
        //     key[0].forEach(function (key2, i, arr){
        //         observe[key2].push([key[1], key[2]]);
        //     })
            
        // });
        // console.log(observe); 

        //监听修改 
        Sv.observe(this.store, this.store, null, setter);
        function setter(val, key) {
            console.log(val);
            
            console.log(key);
            
            observe[key].forEach(function (key, i, arr) {
                key[0].innerHTML = key[1].replace(/\{([\s\S]+?)\}/, val);
            });
        }
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
        b: 'bsbssbsbsbsbsbsbsb'
    },
    store: {
        // k: "<script2>",
        // s: "....0.000...",
        // b: 'bsbssbsbsbsbsbsbsb'
    },
    tpl: '<div id="ss" style = "color:red" @bind[text]="te1,te2"> test{{b}}\
            <span @bind[attr(clientHeight)]>123</span>\
            <span>1234<a>aaaaaaaa<i></i></a></span>\
            {{s}}test\
        </div >\
        <div @bind[attr(style)]="css">{{b}}<span @bind[attr(style)]="css">{{s}}</span></div>\
        <div @bind[attr(style)]="css">122222222</div>',
    init: function () {
        info(this, '!this is a "run" function 137');
        // console.log(this.tpl) 
        if (this.test.tt() == "tt") {
            console.log("调用成功");
        }
        console.log(this);
  
;
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