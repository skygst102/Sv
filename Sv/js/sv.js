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
            configurable: true,
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
    tplEngine: function (tpl, data) {
        var escape = function (html) {
            return String(html).replace(/&(?!\w+;)/g, '$amp;').replace(/</g, '&lt;')
                .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
                .replace(/\\/g, "").replace(/''/g, '')
        }
        var complied = function (str) {//.replace(/\{\{\}\}|[\r\t\n]/g, '')
            var tpl = str.replace(/\{\{#([\s\S]+?)\}\}/g, function (match, value) {
              
                    return "';\n" + value ;
                })
                .replace(/\{\{([^#]+?)\}/g, function (match, value) {
                   
                    return "tpl+='+ escape(" + value + ")+ '"
                   
                })
               
                .replace(/<%([\s\S]+?)%>/g, function (match, value) {
                    return "';\n" + value + "\n'";
                })
                console.log(tpl)
           
            tpl = "tpl='" + tpl + "';";
            tpl = 'var tpl="";\nwith(escapeObj||{}){\n' + tpl + '\n}\nreturn tpl;';
            return new Function('escapeObj', 'escape', tpl);
        };
        var Engine = function (tpl, data) {
            var tpl = complied(tpl)
            console.log(tpl)
            return tpl(data, escape);
        }
        return Engine(tpl, data)
    },
    initModule: function (config, modelFn, modelName) {
        if (config) {
            var obj = {
                tpl: config.tpl? config.tpl.replace(/(\s){2}/g, ''):null,
                tplUrl: config.tplUrl,
                data: config.data,
                store:config.store|| {},
                scope: typeof config === 'string' ? config : config.scope,
            };
            if (config.extend && config.extend[0]) {
                config.extend.forEach(function (key, i, self) {
                    obj[key] = Sv[key + 'Extend']
                })
            };
            modelFn.prototype = obj;
            var model_o = new modelFn();
            $(function () {
                model_o.action();
            })
            //将配置复制到构造函数
            for (var key in config) {
                key == 'tpl' ? config[key] = config[key].replace(/(\s){2}/g, '') : null;
                this[key] = config[key]
            };
            //配置无store 时，在对象内取
            if (!config.store) {
                this.store=model_o.store;
            }
            //实例化模型后使函数this 指向模型//执行配置函数
            config.init ? config.init.call(model_o) : null;
            config.ready ? $(function () {
                config.ready.call(model_o)
            }) : null;

        };
        //执行实例对象controller函数
        this.controller = function () {
            var arg = arguments[0];
            var fn = arguments[1];
            if (arg == 'ready') {
                $(function () {
                    fn.call(model_o);
                })
            } else if (typeof arg == 'function') {
                arg.call(model_o);
            }
        };
    },
    model: function (modelName, modelFn) {
        Sv[modelName + 'Extend'] = new modelFn()[modelName];
        Sv[modelName] = function (config) {
            Sv.initModule.call(this, config, modelFn, modelName)
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
    this.action = function () {//可优化，页面未加载或者未加载完毕时处理
        var observe = {},arr = [],objSelf=this;
        var vdom = Sv.vdom(this.tpl || document.querySelector(this.scope).innerHTML);
        var RegExp = /\{\{([\s\S]+?)\}\}/g;
        var hasBind = function (attrs) {
            for (var i = 0; i < attrs.length; i++) {
                if (/@bind/.test(attrs[i].nodeName)&&attrs[i].nodeValue!='') {
                    return attrs[i];
                }
            }
        };
        //编译之前处理模板
        ;[].slice.call(vdom.querySelectorAll("*")).forEach(function (key, i, self) {
            var bind = hasBind(key.attributes);
            if (bind) {
                var nodes = key.childNodes;
                if (nodes.length > 1) {
                    var svtpl = [];
                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i].nodeType == 3 && RegExp.test(nodes[i].nodeValue)) {
                            svtpl.push(nodes[i].nodeValue.replace(RegExp, "{$1}").replace(/\s/g, ''));
                        }
                    }
                } else {
                    if (key.nodeName.toLocaleLowerCase()=='input') {
                        var nodeValue = key.value;
                    }else{
                        var nodeValue = key.childNodes[0].nodeValue;
                    }
                    
                    if (RegExp.test(nodeValue)) {
                        var svtpl = nodeValue.replace(RegExp, "{$1}").replace(/\s/g, '');
                    }else{
                        var svtpl=nodeValue;
                    }
                }
                key.setAttribute("svtpl", svtpl);
            }
        });
        //编译模板
        var html = Sv.tplEngine(vdom.innerHTML, this.data);
        //插入模板
        document.querySelector(this.scope).innerHTML = html;
        //处理dom 
        var dom = document.querySelector(this.scope).querySelectorAll("*");
        var RegExp2 = /\[(.*)\]/;
        [].slice.call(dom).forEach(function (key, i, self) {
            var bind = hasBind(key.attributes);
            if (bind) {
                //@bind 句法定义
                //@bind[css]='css'
                var changeCon = bind.nodeName.match(RegExp2)[1];
                var bindAttr = bind.nodeValue.split(',');
                if (key.nodeName.toLocaleLowerCase()=='input') {
                    var svtpl = key.svtpl = key.getAttribute("value");
                }else{
                    var svtpl = key.svtpl = key.getAttribute("svtpl");
                }
                key.removeAttribute(bind.name);
                key.removeAttribute("svtpl");
                //this.store初始化//待优化
                for (var i = 0; i < bindAttr.length; i++) {
                    this.store[bindAttr[i]] = '';
                };
                arr.push([bindAttr, key, svtpl, changeCon]);
                bindAttr.forEach(function (key, i, arr) {
                    if (!observe.hasOwnProperty(key)) {
                        observe[key] = [];
                    }
                });
            };
        }.bind(this));
        //映射对象 
        arr.forEach(function (key, i, arr) {
            key[0].forEach(function (key2, i, arr) {
                var con = key[2].split(',');
                observe[key2].push([key[1], con[i], key[3], i]);
            })
            //监听input[value]实时更新绑定值
            if (key[1].nodeName.toLocaleLowerCase()=='input') {
                $(key[1]).on('input',function(){
                    objSelf.store[key[0]] = $(this).val();
                })
            }
        });
        var observeAction = {
            nodeValue: function (el, key, val) {
                el.childNodes[key[3]].nodeValue = key[1].replace(/\{([\s\S]+?)\}/, val);
            },
            attr: function (el, key, val) {
                var attr=key[2];
                switch (attr) {
                    case 'value':
                        attr='val';
                        break;
                }
                $(el)[attr](val)
            }
        };
        //监听修改 
        Sv.observe(this.store, this.store, null, setter);
        function setter(val, setkey) {
            observe[setkey].forEach(function (key, i, arr) {
                if (key[2] == 'nodeValue') {
                    observeAction.text(key[0], key, val);
                }else {
                    observeAction.attr(key[0], key, val);
                }
            });
        };
    };
});