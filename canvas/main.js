window.onload=function () {
    var video = document.getElementById("video"); //视频dom元素


//001.开启摄像头
$('#rec').click(function() {
//视频获取
var Devicestate = navigator.mediaDevices.getUserMedia({
video: true
})


Devicestate.then(function(mediaStream) {


video.src = window.URL.createObjectURL(mediaStream);
console.log(mediaStream)
video.onloadedmetadata = function(e) {
video.play();
};


});


//用户拒绝使用,或者没有摄像头
Devicestate.catch(function(err) {
console.log(err.name);
});


});


//002.点击拍照按钮
$('#camera').click(function() {
//视频转换到canvs
var outrec = document.getElementById("outrec");
var outreccon = outrec.getContext("2d");
outreccon.drawImage(video, 0, 0, 640, 480);


var img = outrec.toDataURL("image/jpeg", 0.5)


$('#imgvideo').attr('src', img);


// 调用方式
// 参数一： 选择器，代表canvas
// 参数二： 图片名称，可选
downloadCanvasIamge('#outrec', 'imgvideo');
//关闭摄像窗口页面
setTimeout(function(){
custom_close();
},1100);

});
// 下载Canvas元素的图片
function downloadCanvasIamge(selector, name) {
   // 通过选择器获取canvas元素
   var canvas = document.querySelector(selector)
   // 使用toDataURL方法将图像转换被base64编码的URL字符串
   var url = canvas.toDataURL('image/jpeg')
   // 生成一个a元素
   var a = document.createElement('a')
   // 创建一个单击事件
   var event = new MouseEvent('click')
   
   // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
   a.download = name || '下载图片名称'
   // 将生成的URL设置为a.href属性
   a.href = url
   
   // 触发a的单击事件
   a.dispatchEvent(event)
}
//关闭摄像窗口页面
function custom_close(){
if(confirm("摄像拍照成功，确认是否关闭本窗口")){
//delete_file();
window.opener=null;
window.open('','_self');
window.close();
}else{


}
}
//关闭窗口之后删除下载的图片文件，ActiveXObject对象只能在IE浏览器创建
/*function delete_file(){
alert("删除文件");
var fso = new ActiveXObject("Scripting.FileSystemObject");
var imgHandle = fso.GetFile("C:\\Users\\yuzhangwei\\Downloads\\imgvideo.jpg"); 
imgHandle.Delete();
}*/

    
}