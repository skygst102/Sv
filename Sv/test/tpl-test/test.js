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
    // this.action=function () {}//默认被执行
});
<<<<<<< HEAD
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
=======
// scope:'',
// extend: ["test"],
// // data: {//url || 数据 ||function 
// //     k: "{...我是data[k]...}",
// //     s: "{...我是data[s]...}",
// //     b: '{...我是data[b]...}'
// // },
// // store:{
// //     css: 'css'
// // },

var tpl = new Sv.component(function () {
        // console.log(this) 
        // if (this.test.tt() == "tt") {
        //     console.log("调用成功");
        // }
        console.log(this);
        
        this.scope("#dss");
        this.data('url',{
            type:'get',
            cache:true
        })
        this.view('id',this.data)
        this.extend('test','tt2')
        
    });
>>>>>>> 869db5d549dc153171fe23d1cc91dd2ac49436cd
// //测试一： this指向模型，与模型配置 //this 与模型this保持一致 
tpl.controller('ready', function () {
    info(this, '!this is a "tpl.controller" function ')
    this.store.css={color: "green"};
    console.info(this)
    // this.view=function (list){
    //this.view(data).before(function(){

    // })

});




// function initHotCourseListView(list){//初始化热门课程；
// 	layui.use('laytpl', function(){
//         var temp= hotCourseListTemp.innerHTML;
//         layui.laytpl(temp).render({list:list},function(html){
//         	hotCourseList.innerHTML += html;
//         });
//     });
// };
/* <script id="hotCourseListTemp" type="text/html">
    {{# layui.each(d.list,function(index,item){ }}
		<div class="cloumn box">
	        <p>
	          <a href="web/course/videoList/{{item.id}}" target="_blank" >
	              <img src="{{item.cover}}" width="218" height="123" />
	          </a>
	        </p>
	        <p class="part text-hide">
	            <a href="web/course/videoList/{{item.id}}" title="{{item.name}}" target="_blank">{{item.name}}</a>
	            <font class="f12 black999">
	                <label class="orange">{{item.score}}分</label>
	            </font>
	          </p>
			<p class="part f12"><a class="transtion-font" href="web/teacher/course/teach_info?teachId={{item.teachId}}" target="_blank">{{item.teacherName ? item.teacherName : '无'}}</a><font class="part f12">{{item.jobTitleName}}</font>
	            <span class="right"><i></i>{{item.userCounts}}</span>
	        </p>
	        <div class="show f12">
                <a href="web/course/videoList/{{item.id}}" target="_blank" >
	            <p><font class="black999">开课时间：</font>{{item.lessonBegin}}</p>
	            <p><font class="black999">学习时长：</font>{{item.totalHours ? item.totalHours+'学时' : '无'}}</p>
	            <p><font class="black999">学科门类：</font>{{item.categoryName ? item.categoryName : '无'}}</p>
                </a>
	        </div>
	    </div>

    {{# }); }}
</script> */

// 
// '<div id="ss" sv='node'   @bind[nodeValue]="te1,te2">\
// var n=new element('node')
// n.bind={
//     nodeValue:'te1',
//     height:'t2'
// }






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