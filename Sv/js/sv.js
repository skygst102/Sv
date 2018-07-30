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
                .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
                .replace(/\\/g, "").replace(/''/g, '');
        }
        var complied = function (str) {
            var tpl = str.replace(/\{\{\}\}|[\r\t\n]/g, '')
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
    initModule: function (config, modelFn, modelName) {
        if (config) {
            var obj = {
                tpl: config.tpl.replace(/(\s){2}/g, ''),
                tplUrl: config.tplUrl,
                data: config.data,
                store: config.store,
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