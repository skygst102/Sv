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
            //??????????????????????????????
            // for (var key in init) {
            //     key == 'tpl' ? init[key] = init[key].replace(/(\s){2}/g, '') : null;
            //     this[key] = init[key]
            // };
            //???????????????????????????this ????????????
            // init.call(model);
            // init.ready ? $(function () {
            //     init.ready.call(model)
            // }) : null;

        };
        //??????????????????controller??????
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
/* ???????????? */
Sv.model("component", function () {
    this.component = {
        ss: function () {
            console.log("ss");
        }
    };
<<<<<<< HEAD
    this.action = function () {//?????????????????????????????????????????????????????????
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
        //????????????????????????
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
=======
    this.action = function () {
        console.log(this);

       
>>>>>>> 869db5d549dc153171fe23d1cc91dd2ac49436cd
        //????????????
        // var html = Sv.tplEngine(vdom.innerHTML, this.data);
        //????????????
        // document.querySelector(this.scope).innerHTML = html;
        //??????dom 
<<<<<<< HEAD
        var dom = document.querySelector(this.scope).querySelectorAll("*");
        var RegExp2 = /\[(.*)\]/;
        [].slice.call(dom).forEach(function (key, i, self) {
            var bind = hasBind(key.attributes);
            if (bind) {
                //@bind ????????????
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
                //this.store?????????//?????????
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
        //???????????? 
        arr.forEach(function (key, i, arr) {
            key[0].forEach(function (key2, i, arr) {
                var con = key[2].split(',');
                observe[key2].push([key[1], con[i], key[3], i]);
            })
            //??????input[value]?????????????????????
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
        //???????????? 
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
=======
        // var dom = document.querySelector(this.scope).querySelectorAll("*");
    
        
        
>>>>>>> 869db5d549dc153171fe23d1cc91dd2ac49436cd
    };
});