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
                .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
                .replace(/\\/g, "").replace(/''/g, '')
        }
        var complied = function (str) {
            var tpl = str.replace(/\{\{\}\}|[\r\t\n]/g, '').replace(/'/g, '&#039;')
                .replace(/\{\{([\s\S]+?)\}\}/g, function (match, value) {
                    return "' + escape(" + value + ")+ '"
                }).replace(/<%([\s\S]+?)%>/g, function (match, value) {
                    return "';\n" + value + "\ntpl+='";
                }).replace(/(tpl\+=\'\';)/g, '');
            tpl = "tpl='" + tpl + "';";
            tpl = 'var tpl="";\nwith(obj||{}){\n' + tpl + '\n}\nreturn tpl;';
            return new Function('obj', 'escape', tpl);
        };
        var Engine = function (tpl, data) {
            var tpl = complied(tpl)
            return tpl(data, escape);
        }
        return Engine(tpl, data)
    },
    initModule: function (init, modelFn, modelName) {
        if (typeof init=='function') {
            var obj = {
                scope:function (id) {
                    console.log(arguments);
                    
                },
                data: function (url,config) {
                    console.log(arguments);
                    
                },
                view:function (params) {
                    console.log(arguments);
                    
                },
                extend:function (/* str||[] */) {
                    var arg=arguments;
                    if (arg[0] instanceof Array) {
                        arg=arg[0];
                    }
                    ;[].slice.call(arg).forEach(function (key, i, self) {
                        obj[key] = Sv[key + 'Extend']
                    })
                },
                store:function (watch) {
                    var re=typeof watch==='object' ? watch :{};
                    return re;
                },
            };
            init.call(obj);

            modelFn.prototype = obj;
            var model= new modelFn();
            $(function () {
                model.action();
            })
            //将配置复制到构造函数
            // for (var key in init) {
            //     key == 'tpl' ? init[key] = init[key].replace(/(\s){2}/g, '') : null;
            //     this[key] = init[key]
            // };
            //实例化模型后使函数this 指向模型
            // init.call(model);
            // init.ready ? $(function () {
            //     init.ready.call(model)
            // }) : null;

        };
        //执行实例对象controller函数
        this.controller = function () {
            var arg = arguments[0];
            var fn = arguments[1];
            if (arg == 'ready') {
                $(function () {
                    fn.call(model);
                })
            } else if (typeof arg == 'function') {
                arg.call(model);
            }
        };
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
    this.action = function () {
        console.log(this);

       
        //编译模板
        // var html = Sv.tplEngine(vdom.innerHTML, this.data);
        //插入模板
        // document.querySelector(this.scope).innerHTML = html;
        //处理dom 
        // var dom = document.querySelector(this.scope).querySelectorAll("*");
    
        
        
    };
});