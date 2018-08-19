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
    scope: "#mm",
    extend: ["test"],
    // data: {},
    // store:{},
    // tpl: '',
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
    console.log(this)

})
console.log(tpl.store)
