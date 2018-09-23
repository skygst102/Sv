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
    // this.init=function () {}//默认被执行
});

var tpl = new Sv.component(function () {
    console.info('指向模型init new Sv.component--fn')
    console.log(this)
    /* 指向模型init */
        this.extend('test','tt2')
        this.scope("#dss");
        this.data('url',{
            type:'get',
            cache:true
        })
        this.render('#listTemp')
        
    });
// //测试一： this指向模型，//this 与模型this保持一致 
tpl.controller('ready', function () {
    console.info('controller---指向“模型”')
    console.log(this.$scope)
    //this.pull('data')
    console.log(this.test)
    
    this.store.css={color: "green"};
    // this.view=function (list){
    //this.view(data).before(function(){

    // })

    // if (this.test.tt() == "tt") {
    //     console.log("调用成功");
    // }

});


// 
// '<div id="ss" sv='node'   @bind[nodeValue]="te1,te2">\
// var n=new element('node')
// n.bind={
//     nodeValue:'te1',
//     height:'t2'
// }
