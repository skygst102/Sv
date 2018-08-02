"use strict";
function info(obj, msg) {
    var info = "";
    for (var key in obj) {
        info += key + " ";
    }
    console.log(info + "---" + msg);
}
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
    // store:{},
    store: {
        // k: "<script2>",
        // s: "....0.000...",
        // te1: 'bsbssbsbsbsbsbsbsb',
        // te2: 'lllllllll',
        // css: 'css'
    },
    tpl: '<div id="ss" style = "color:red" @bind[text]="te1,te2">\
            te1{{b}}\
            <span @bind[height]>123{{s}}</span>\
            <span>1234<a>aaaaaaaa<i></i></a></span>\
            {{s}}te2\
        </div >\
        <div @bind[css]="css">{{b}}<span @bind[css]="css">{{s}}</span></div>',
    init: function () {
        info(this, '!this is a "init" function 137');
        // console.log(this.tpl) 
        if (this.test.tt() == "tt") {
            console.log("调用成功");
        }
      
        this.store.kv='kv123检验煤的仪器';
    },
  
});
// //测试一： this指向模型，与模型配置 //this 与模型this保持一致 
tpl.controller('ready', function () {
    info(this, '!this is a "tpl.controller" function ')
   
    this.store.css={color: "red"};
    console.log(this.store.kv);
     
})


// 在浏览器console 内输入  tpl.store.css = {color:'red'} 可测试数据绑定效果



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