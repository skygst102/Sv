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
        [].slice.call(vdom.querySelectorAll("*")).forEach(function (key, i, self) {
            if (key.childNodes.length == 1) {
                var nodeval = key.innerText;
                if (RegExp.test(nodeval)) {
                    var tdata = nodeval.match(RegExp)[1].replace(/\s/g, '');
                    var svTpl = key.childNodes[0].nodeValue.replace(RegExp, "{$1}");
                    key.setAttribute("tdata", tdata);
                    key.setAttribute("svTpl", svTpl);
                }
            }
        }.bind(this));

        var html = Sv.tplEngine(vdom.innerHTML, this.store); console.log(html);
        //处理dom 
        document.querySelector(this.scope).innerHTML = html;
        var dom = document.querySelector(this.scope).querySelectorAll("*");
        [].slice.call(dom).forEach(function (key, i, self) {
            var tdata = key.svTpl = key.getAttribute("tdata");
            var svTpl = key.svTpl = key.getAttribute("svTpl");
            var nodes = key.childNodes;
            key.removeAttribute("tdata");
            key.removeAttribute("svtpl");
            if (tdata) {
                arr.push([tdata, key, svTpl]);
                if (!observe.hasOwnProperty(key)) {
                    observe[tdata] = [];
                }
            }
        }.bind(this));
        //映射对象 
        arr.forEach(function (key, i, arr) {
            observe[key[0]].push([key[1], key[2]]);
        }.bind(this));
        console.log(observe);

        //监听修改 
        Sv.observe(this.store, this.store, null, setter);
        function setter(val, key) {
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
    store: {
        k: "<script2>",
        s: "....0.000...",
        b: { s: 'bsbssbsbsbsbsbsbsb' }
    },
    tpl: '<div style = "color:red" > {{b.s}}</div > <br />',
    init: function () {
        info(this, '!this is a "run" function 137');
        // console.log(this.tpl) 
        if (this.test.tt() == "tt") {
            console.log("调用成功");
        }
        console.log(this);
        this.store.k = "##000....##";
        this.store.s = "ss";

        console.log(this.store);
    }
});
// //测试一： this指向模型，与模型配置 //this 与模型this保持一致 
tpl.controller('ready', function () {
    info(this, '!this is a "tpl.controller" function ')
    this.store.b = 12313;
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