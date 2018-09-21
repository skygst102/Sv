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
var obj={
    t:'1',
    b:'2'
}

var tpll='\
<div id="ss" style = "color:red" @bind[nodeValue]="te1,te2">\
{{# if(obj.t==="1"){console.log("111")}}\
te1{{b}}<br/>\
{{# }}}\
<span @bind[height]>(span标签内){{s}}</span><br/>\
<span>(span标签内)<a>(a标签内)<i></i></a></span><br/>\
{{s}}te2\
</div >\
<div @bind[css]="css">{{b}}<span @bind[css]="css">{{s}}</span></div>'
var tpl = new Sv.component({
    scope: "#dss",
    extend: ["test"],
    data: {
        k: "{...我是data[k]...}",
        s: "{...我是data[s]...}",
        b: '{...我是data[b]...}'
    },
    // store:{
    //     css: 'css'
    // },

    tpl: tpll,
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
    this.store.css={color: "green"};
    console.log(this)

})





console.log(tpl.store)



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