/**
 * author skygst
 * 
 */
'use strict';
try {window.attachEvent('onload',function () {
	if(!window.addEventListener){
		document.write(
			'你的浏览器过于陈旧，请升级浏览器!<br/> IE8以上版本或现代浏览器可显示内容 <br/>'+
			'IE:&nbsp;<a href="https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads">点击升级</a><br/>'+
			'firefox:&nbsp;<a href="https://www.mozilla.org/zh-CN/firefox/new/">点击升级</a><br/>'+
			'360:&nbsp;<a href="http://se.360.cn/">点击升级</a>'
		)}return
	});
}catch(error){}
;(function (window, factory) {
    function $(selector, context, index) {
        return new $.prototype.init(selector, context, index);
    };
    $.prototype.init = function (selector, context, index) {
        this.index = index || null;
        this.context = context || document;
        if (selector && selector.nodeType) {
            this[0] = selector;
            this.length = 1;
            return this;
        } else if (typeof selector == 'string') {
            this.selector = selector || null;
            $.nodeList = this.context.querySelectorAll(selector);
            this.length = $.nodeList.length;
            for (var i = 0; i < this.length; i++) {
                this[i] = $.nodeList[i];
            }
        } else if(typeof selector == 'function'){
            addEventListener(document, 'DOMContentLoaded', null, callback)
        }else {
            return this;
        }
    };
    $.fn = $.prototype.init.prototype = {};
    $.fnExtend = function (source) {
        for (var key in source) {
            if (!$.fn.hasOwnProperty(key)) {
                $.fn[key] = source[key];
            } else {
                throw '$.fnExtend (' + key + ') already exist'
            }
        }
    };
    $.extend = function (source) {
        for (var key in source) {
            if (!$.hasOwnProperty(key)) {
                $[key] = source[key];
            } else {
                throw '$.extend (' + key + ') already exist'
            }
        }
    };
    $.plug = function (name, fn) {
        fn($);
    }
    factory($);
})(this, function ($) {
    function addEvent(element, type, selector, callback) {
        var fn = function (event) {
            var targetEl = document.querySelector(selector);
            if (selector) {
                var event = event || window.event;
                var target = event.target || event.srcElement;
                if (target == targetEl) callback();
            } else {
                callback();
            }
        }
        element.addEventListener(type, function (event) {
            fn(event)
        }, false)
    }

    function removeEvent(element, type, callback) {
        element.removeEventListener(type, callback, false);
    };
    //其它
    $.extend({
        ready: function (callback) {
            addEvent(document, 'DOMContentLoaded', null, callback)
        },
        load: function (callback) {
            addEvent(window, 'load', null, callback)
        },
        loadcss=function (str){
            var x = document.getElementsByTagName('head')[0]; 
            if(x.getElementsByTagName('style')[0]){
                var style=x.getElementsByTagName('style')[0];
                style.innerHTML+=str;	
            }else{
                var s = document.createElement('style');
                s.type="text/css";
                s.innerHTML=str; 
                x.appendChild(s);
            }	
        },
        loadjs:function (src) { 
            var x = document.getElementsByTagName('head')[0]; 
            if(src instanceof Array){
                for (var i = 0; i <src.length; i++) {
                    var s = document.createElement('script'); 
                    s.type = 'text/javascript'; 
                    s.async = true; 
                    s.src = src[i]; 
                    x.appendChild(s); 
                }
            }
        },
        typeof: function (o, type) {
            var otype;
            o !== null ? otype = Object.prototype.toString.call(o).match(/\s(.*)\]$/)[1] : otype = 'Null'
            type ? otype = (otype == type) : null;
            return otype
        },
        each: function (obj, fn) {
            if ($.typeof(obj, 'Object')) {
                for (var key in obj) fn.call(obj, obj[key], i, obj);
            } else if (obj.length) {
                for (var i = 0; i < obj.length; i++) {
                    var rFn = fn.call(obj, obj[i], i, obj);
                    if (rFn === false || i == 1000) break;
                    if (rFn === true || i == 1000) continue;
                }
            }
        },
        
        isTel:function() {
            return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/.test(arguments[0])
        },
        isPassword:function(){
            /*密码只能为6-20个字母、数字、下划线、点*/
            return /^(\w){6,20}|[.]$/.test(arguments[0])
        },
        isName:function(){
            /*名称不能为空或含有空格*/
            return /^\S+$/.test(arguments[0])
        },
        isEmile:function() {
            return /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/.test(arguments[0])
        },
        isPhone:function(){
            return /^1[3|4|5|8][0-9]\d{4,8}$/.test(arguments[0])
        },
        isIdcard:function(){
            return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(arguments[0])
        }
        
    });
    //dom操作
    $.fnExtend({
        eq: function (i) {
            return $(this[i], this.selector, i)
        },
        filter: function (e) {
            return $(e, this[0], 0)
        },
        css : function (attr, value) {
            var style='';
            if (typeof attr=='object') {
                      for(var i in attr){
                          style+=(i+':'+attr[i]+';');
                    }
                    this[0].style.cssText =style;
            }else if(value==null){
                    if(this.currentStyle){
                        return this[0].currentStyle[attr];
                    }else{
                        return getComputedStyle(this[0],false)[attr];
                    }
            }else{
                    this[0].style[attr] = value;
            };
            return this;  
        },
        addClass : function(){		
                var classValue=this[0].getAttribute("class");
                if (!classValue) {classValue='';}
                for(var i=0; i<arguments.length; i++){
                    classValue+=" "+arguments[i];
                }
                this[0].setAttribute("class",classValue);
                return this;
        },
        removeClass : function(){
                var classValue=this[0].getAttribute("class");
                var remove='';
                if (classValue) {
                    for(var i=0; i<arguments.length; i++){
                        remove+=" "+arguments[i];
                    };
                    var newclassValue=classValue.replace(remove," ");
                    this[0].setAttribute("class",newclassValue);
                }
                return this;
        },
        attr : function(attr,value){
                if (value!=null) {
                        this[0].setAttribute(attr,value);						
                        return this;		
                }else{return this[0].getAttribute(attr)}	
        },
        removeAttr:function(attr){
                this[0].removeAttribute(attr);
        },
        //nodes
        parent : function(){	
                this[0]=this[0].parentNode;
                return this;
        },
        next : function(){
                this[0]=this[0].nextSibling;
                while (this[0].nodeType==3) {
                        this[0]=this[0].nextSibling;
                }
                return this;
        },
        prev : function(){
                this[0]=this[0].previousSibling;
                while (this[0].nodeType==3) {
                        this[0]=this[0].previousSibling;
                }
                return this;	
        },
        siblings: function(){	
                var el=this[0],parentNode=this[0].parentNode;
                for (var i=0; i<parentNode.children.length; i++){
                    if(el!=parentNode.children[i]){this[i]=parentNode.children[i]}	
                }
                return this;
        },
        children:function(){
                var children=this[0].children;
                for (var i=0; i<children.length; i++){
                    this[i]=children[i]	
                }
                return this;
        },
        clone: function(tf){
                if (tf===false) {
                    return this[0].cloneNode(false)
                }else{return this[0].cloneNode(true)}
        },
        append:function(child){
                if (typeof child=='string') {
                        this[0].innerHTML+=child;
                        return this;
                }else if (child.nodeName) {
                        this[0].appendChild(child);
                }else if(child[0].nodeName){
                        this[0].appendChild(child[0]);
                }			
                this[0]=this[0].lastChild;
                return this;
        },
        before:function(child){
                if (child.nodeName) {
                        this[0].parentNode.insertBefore(child,this[0]);
                }else if(child[0].nodeName){
                        var cloneNode=child[0].cloneNode(true);
                        this[0].parentNode.insertBefore(cloneNode,this[0]);
                }
                return this.prev();
        },
        replace:function(child){
                if (child.nodeName) {
                        this[0].parentNode.replaceChild(child,this[0]);
                }else if(child[0].nodeName){
                        var cloneNode=child[0].cloneNode(true);
                        this[0].parentNode.replaceChild(cloneNode,this[0]);
                }
                return this;
        },
        remove:function(child){	
                this[0].parentNode.removeChild(this[0]);
                return this;
        },
        hide:function(el){	
                this[0].style.display='none';
                return this;
        },
        show:function(el){	
                this[0].style.display='block';
                return this;
        },
        height:function(inner){//The default visual area size
                (inner=='inner') ? inner= this[0].clientHeight : inner=this[0].offsetHeight;
                return inner;
        },
        width:function(inner){
                (inner=='inner') ? inner= this[0].clientWidth : inner=this[0].offsetWidth;
                return inner;
        },
        trigger: function(eventType, eventData) {
            this.dispatchEvent(new CustomEvent(eventType, {
                detail: eventData,
                bubbles: true,
                cancelable: true
            }));
            return this;
        },
        css:function( property) {
            var styles = this.ownerDocument.defaultView.getComputedStyle(this, null);
            if (property) {
                return styles.getPropertyValue(property) || styles[property];
            }
            return styles;
        },
        trim : function() {
            this.innerText.replace(/^\s|\r|\n/,'').replace(/\s|\r|\n$/,'');
        },
    });

    //事件
    $.fnExtend({
        addEvent: function (type, selector, callback) {
            addEvent(this, type, selector, callback);
            return this;
        },
        removeEvent: function (type, fnName) {
            removeEvent(this, type, fnName);
            return this;
        },
        getEvent: function (event) {
            return event || window.event;
        },
        getTarget: function (event) {
            return event.target || event.srcElement;
        },
        stopPropagation: function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        },
        preventDefault: function (event) {
            if (event.prevenDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },
        click:function (callback) {
            addEvent('click', this, callback)
        },
        on: function (events, selector,callback) {
            var events = events.split(/\s/);
            if (typeof selector == 'function') {
                for (var key in events) {
                    addEvent(this[0], events[key], null, selector)
                }
            } else {
                for (var key in events) {
                    addEvent(this[0], events[key], selector, data)
                }
            }
         
            return this;
        }
 
    });
});
// ;[].slice.call(node).forEach(function (key,i,arr) {
//     console.log(key)
    
// })
/* tplEngine: function (tpl, data) {
    var escape = function (html) {
        return String(html).replace(/&(?!\w+;)/g, '$amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
            .replace(/\\/g, "").replace(/''/g, '')
    }
    var complied = function (str) {
        var tpl = str.replace(/\{\{\}\}|[\r\t\n]|[\s]{2}/g, '').replace(/'/g,'"')
            .replace(/\{\{#([\s\S]+?)\}\}/g, function (match, value) {
                return "';\n"+ value+"\ntpl+='" ;
            })
            .replace(/\{\{([^#]+?)\}\}/g, function (match, value) {
                return "'+ escape(" + value + ") +' "
            })
            .replace(/<%([\s\S]+?)%>/g, function (match, value) {
                return value;
            })
        tpl ="tpl='"+tpl + "';";
        tpl = 'var tpl="";\n' + tpl + '\nreturn tpl;';
        return new Function('d', 'escape','Sv', tpl);
    };
    var Engine = function (tpl, data) {
        var tpl = complied(tpl)
        return tpl(data, escape,Sv);
    }
    return Engine(tpl, data)
} */

// defineProperty: function (mapdata, key, val, getter, setter) {
//     var obj = {};
//     Object.keys(mapdata).forEach(function (key, i, arr) {
//         obj[key] = mapdata[key]
//     })
//     Object.defineProperty(mapdata, key, {
//         enumerable: true,
//         initurable: true,
//         get: function () {
//             getter ? getter(val, key) : null;
//             return obj[key];
//         },
//         set: function (v) {
//             obj[key] = v;
//             setter ? setter(v, key) : null;
//         }
//     })
// },
// observe: function (sourcedata, mapdata, getter, setter) {
//     Object.keys(sourcedata).forEach(function (key) {
//         Sv.defineProperty(mapdata, key, sourcedata[key], getter, setter);
//     });
// },
// vdom: function (parentNode, vdomName, vdomAttr) {
//     var vdomName = vdomName || 'vdom';
//     var flagment = document.createDocumentFragment();
//     var createEl = document.createElement(vdomName);
//     for (var key in vdomAttr) {
//         createEl.setAttribute(key, vdomAttr[key])
//     }
//     flagment.appendChild(createEl);
//     var vdom = flagment.querySelector(vdomName);
//     if (typeof parentNode != 'string') {
//         var html = document.querySelector(parentNode);
//         vdom.innerHTML = html.innerHTML;
//     } else {
//         vdom.innerHTML = parentNode;
//     }
//     return vdom;
// },

//requestAnimationFrame.polyfill
// (function() {
//     var lastTime = 0;
//     var vendors = ['ms', 'moz', 'webkit', 'o'];
//     for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
//         window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
//         window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
//     }
//     if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
//         var currTime = new Date().getTime();
//         var timeToCall = Math.max(0, 16 - (currTime - lastTime));
//         var id = window.setTimeout(function() {
//             callback(currTime + timeToCall);
//         }, timeToCall);
//         lastTime = currTime + timeToCall;
//         return id;
//     };
//     if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
//         clearTimeout(id);
//     };
// }());