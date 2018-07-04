'use strict'

function info(obj, msg) {
    var info = '';
    for (var key in obj) {
        info += key + ' ';
    }
    console.log(info + '---' + msg)
}

/* 建立模型 */
Sv.model('component', function () {
    var observe={};
    this.component = {
        ss: function () {
            console.log('ss')
        }
    }
   
    this.action = function () {
        var arr=[];
        var vdom = Sv.vdom(this.tpl||$(this.scope)[0].innerHTML);
        var RegExp=/\{\{([\s\S])\}\}/;
        $.each(vdom.querySelectorAll('*'), function (key, i,self) {
            var nodes=key.childNodes;
            var nodeval=nodes[0].nodeValue;
            if (RegExp.test(nodeval)&&nodes.length==1) {
                var tdata = nodeval.match(RegExp)[1];
                var svTpl=key.childNodes[0].nodeValue.replace(RegExp,'{$1}');
                key.setAttribute('tdata', tdata);
                key.setAttribute('svTpl', svTpl);
            }
        }.bind(this));
        var html = Sv.tplEngine(vdom.innerHTML, this.store);
        //处理dom
        document.querySelector(this.scope).innerHTML = html;
        var dom = document.querySelector(this.scope).querySelectorAll('*');
        $.each(dom, function (key, i,self) {
            var tdata=key.svTpl=key.getAttribute('tdata');
            var svTpl=key.svTpl=key.getAttribute('svTpl');
            key.removeAttribute('tdata');
            key.removeAttribute('svTpl');
            var nodes=key.childNodes;
             if (tdata) {
                arr.push([tdata,key,svTpl]);
                if (!observe.hasOwnProperty(key)) {
                    observe[tdata] =[];
                }
            }
        }.bind(this));
        //映射对象
        $.each(arr,function(key,i,arr){
            observe[key[0]].push([key[1],key[2]])
        }.bind(this))
        //监听修改
        Sv.observe(this.store,this.store,null,setter);
        function setter(val,key){
            $.each(observe[key],function(key,i,arr){
                key[0].innerHTML=key[1].replace(/\{([\s\S])\}/,val)
            })
        };
    }
});
/* 建立模型 */
Sv.model('test', function () {
    this.test = {
        tt: function () {
            return 'tt'
            console.log('tt')
        }
    }
})

    // var tpl = new Sv.component({
    //     scope: '#dss',
    //     extend: ['test'],
    //     store:{
    //         k: '<script2>',
    //         s:'....0.000...'
    //     },
    //     tpl: '<div>120....{{k}}\
    //             <span style="color:red">{{k}}12</span>\
    //             <div style="color:red">{{s}}0202</div>\
    //             0.000{{k}}\
    //           </div>\
    //           <div style="color:red">{{k}}</div>\
    //           <div>{{s}}\
    //             <span style="color:red">{{k}}12</span>\
    //             <span>{{k}}12\
    //                 <a style="color:red">{{k}}12</a>\
    //             </span>\
    //           </div>',
    //     run: function () {
    //         info(this, '!this is a "run" function 137')
    //         // console.log(this.tpl)
    //         if (this.test.tt() == 'tt') {
    //             console.log('调用成功')
    //         }
    //         console.log(this)
    //         console.log(this.store)
    //         this.store.k='##000....##'
    //         this.store.s='ss'
    //     },
    // });

    // //测试一： this指向模型，与模型配置 //this 与模型this保持一致
    // tpl.controller(function () {
    //     info(this, '!this is a "tpl.controller" function ')
    // })
    // if (tpl.tpl) {
    //     info(tpl, '!this is a "tpl obj" function ')
    // }



//在浏览器console 内输入  tpl.store.k='45646466' 可测试数据绑定效果

var tpl2 = new Sv.component({
    scope: '.tt',
    //extend: [],
    store: {
        k: '<script2>'
    },
    tpl:'',
    run: function () {
       // console.log(this.tpl)
       // this.tpl=$('.tt')[0].innerHTML
       this.store.k='1021'
       //console.log(this.tpl)
    },
})

tpl2.store.k=0.1

// //测试一： this指向模型，与模型配置 //this 与模型this保持一致
    tpl2.controller('load',function () {
       console.log(this);

       console.log($('.tt'))
        
    })
  

//TODO
//tplUrl      ==+
//tpl数组     ==+

