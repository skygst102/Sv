/**
 * author skygst
 * browser  >=ie9
 */

//module
window['Sv'] = {
    defineProperty: function (mapdata, key, val, getter, setter) {
        var obj = {};
        Object.keys(mapdata).forEach(function (key, i, arr) {
            obj[key] = mapdata[key]
        })
        Object.defineProperty(mapdata, key, {
            enumerable: true,
            initurable: true,
            get: function () {
                getter ? getter(val, key) : null;
                return obj[key];
            },
            set: function (v) {
                obj[key] = v;
                setter ? setter(v, key) : null;
            }
        })
    },
    observe: function (sourcedata, mapdata, getter, setter) {
        Object.keys(sourcedata).forEach(function (key) {
            Sv.defineProperty(mapdata, key, sourcedata[key], getter, setter);
        });
    },
    vdom: function (parentNode, vdomName, vdomAttr) {
        var vdomName = vdomName || 'vdom';
        var flagment = document.createDocumentFragment();
        var createEl = document.createElement(vdomName);
        for (var key in vdomAttr) {
            createEl.setAttribute(key, vdomAttr[key])
        }
        flagment.appendChild(createEl);
        var vdom = flagment.querySelector(vdomName);
        if (typeof parentNode != 'string') {
            var html = document.querySelector(parentNode);
            vdom.innerHTML = html.innerHTML;
        } else {
            vdom.innerHTML = parentNode;
        }
        return vdom;
    },
    each: function (obj, fn) {
        if (typeof obj==='object'&&!(obj instanceof Array)) {
            for (var key in obj) fn.call(obj, obj[key], i, obj);
        } else if (obj.length) {
            for (var i = 0; i < obj.length; i++) {
                var rFn = fn.call(obj, obj[i], i, obj);
                if (rFn === false) break;
                if (rFn === true) continue;
            }
        }
    },
    tplEngine: function (tpl, data) {
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
    },
    initModule: function (init, modelFn, modelName) {
        var _model,_self=this
        this.el='';
        this.extend=function (/* str||[] */) {
            var arg=arguments;
            if (arg[0] instanceof Array) {
                arg=arg[0];
            }
            ;[].slice.call(arg).forEach(function (key, i, self) {
                _self[key] = Sv[key + 'Extend']
            })
        },
        this.store=function (watch) {
            var re=typeof watch==='object' ? watch :{};
            return re;
        }
        //执行实例对象controller函数
        this.controller = function () {
            var arg = arguments[0];
            var fn = arguments[1];
            if (arg == 'ready') {
                $(function () {
                    fn.call(_self);
                })
            } else if (typeof arg == 'function') {
                arg.call(_self);
            }
        };
        $(function(){
            _model=new modelFn().init();
            _model.extend=_self.extend;
            _model.store=_self.store;
            _model.global.scope=_self.el;

            //执行实例函数并继承模型init
            init.call(_model);
            /*执行模型init方法,操作元素 */
            // _model.init();
        })
    },
    model: function (modelName, modelFn) {
        Sv[modelName + 'Extend'] = new modelFn()[modelName];
        Sv[modelName] = function (init) {
            Sv.initModule.call(this, init, modelFn, modelName)
        };
    }
};
/* 建立模型 */
Sv.model("component", function () {
    this.component = {
        ss: function () {
            console.log("ss");
        }
    };
    this.init = function () {
        return {
            global:{_scope:''},
            scope:function (id) {
                this.global._scope=id;
            },
            data: function (url,config) {
                return {
                    cover:'cover',
                    name:'name',
                    score:'score',
                    teacherName:'teacherName',
                    jobTitleName:'jobTitleName',
                    userCounts:'userCounts'
                }
            },
            render:function (tempId,data) {
                var dom=document.querySelector(tempId||this.global._scope+'Temp');
                var html=Sv.tplEngine(dom.innerHTML,data||this.data());
                document.querySelector(this.global._scope).innerHTML=html;
            }
        };
       
        //编译模板
        // var html = Sv.tplEngine(vdom.innerHTML, this.data);
        //插入模板
        // document.querySelector(this.scope).innerHTML = html;
        //处理dom 

    };
});