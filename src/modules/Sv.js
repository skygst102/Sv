import { Component } from './component'
import { componentStore } from './componentStore.js'
import { Exception } from './Exception.js'
import { render } from './render.js'
import { htmlToVnode } from './vnode.js'
import { isFunction, isArray, isString, isObject } from './util'

const Sv = Object.create({});
Sv._version = '1.0';
Sv._name = 'Sv';
Sv.config = {
    template: '{}',
    orderPrefix: '',
    current: window,
    _global_store_sign: '__sv_store__',
    _pipelineSign: '__sv_pipelineSign__',

};

Sv.components = {};
Sv.Component = Component;
Sv.render = render;
// Sv._pipeline=[];
Sv.domReadyFn = [];


Sv._init = [
    function () {
        Sv.config.current.localStorage.removeItem(Sv.config._global_store_sign);
    },
    function () {
        Sv.globalStorage = new componentStore(Sv.config);
        Sv.globalStorage.init()
    },
    function () {
        document.addEventListener('DOMContentLoaded', function () {
            Sv.domReadyFn.forEach(fn => {
                fn()
            });
        }, false);
    }
]
Sv.mergeConfig = function (o) {
    Object.assign(Sv.config, o)
}
Sv.domReady = function (fn) {
    Sv.domReadyFn.push(fn);
}
Sv.registerModule = function (mName, fn) {
    if (isString(mName) && isFunction(fn)) {
        if (this.hasOwnProperty(mName)) {
            Exception.error('[ ' + mName + ' ]  模块已经被注册,请重新命名');
        } else {
            this[mName] = fn()
        }
    } else {
        Exception.error('Sv.registerModule(string,function)  注册模块正确参数');
    }
}
Sv.registerComponent = function (...cName) {
    cName.forEach(key => {
        if (Object.getPrototypeOf(key) === Component) {
            if (this.components.hasOwnProperty(key.name)) {
                Exception.error('[ ' + key.name + ' ]  组件已经被注册,请重新命名');
                return false;
            } else {
                this.components[key.name] = key;
            }
        } else {
            Exception.error('[ ' + key.name + ' ]  组件必须继承 Component 父类');
            return false;
        }
    });
}
Sv.defineProperty = function (Wobj,key,setFn, getFn) {
    if (key) {
        wacth(Wobj, key)
    } else {
        for (const key in Wobj) {
            wacth(Wobj, key)
        }
    }

    function wacth(Wobj, key) {
        Object.defineProperty(Wobj, '_' + key + '_', {
            get: function () {
                if (isFunction(setFn)) {
                    getFn(key)
                }
                return Wobj[key];
            },
            set: function (value) {
                Wobj[key] = value;
                if (isFunction(setFn)) {
                    setFn(key, value)
                }
            }
        })
    }
}
// Sv._discernWatch = function (Wobj, obj) {
//     for (const key in obj) {
//         Object.defineProperty(Wobj, key, {
//             value: obj[key],
//             writable: false,
//             enumerable: false,
//             configurable: false,
//         })
//     }
// }
Sv.use = function (comParam, arg) {
    let _componentList = {};

    // Sv.domReady(function () {
    if (isString(comParam)) {
        let componentObj = Sv.components[comParam];
        if (!componentObj) {
            Exception.error('[ ' + comParam + ' ] 组件未注册');
            _componentList = false;
            return;
        }
    }
    if (isObject(comParam)) {
        /* 初始化对象 */
        let comParamList = Object.entries(comParam);
        for (let index = 0; index < comParamList.length; index++) {
            let compName = comParamList[index][0];
            let value = comParamList[index][1]
            let component = Sv.components[compName];
            if (component) {
                let obj = new component(value);
                obj.state = Object.assign(obj.state || {}, {});
                obj.store = Object.assign(obj.store || {}, {});
                obj.props = Object.assign(obj.props || {}, value);
                obj.parallelism = {};
                obj._pipeline = {};
                obj._status ='init';
                obj._name = compName;
                obj._parentNode = obj.props._el || '';
                /*  */
                Sv.defineProperty(obj.state,null, function (key, value) {
                    parallelism('state_' + key, value, obj)
                });
                // Sv.defineProperty(obj.store);
                // Sv.defineProperty(obj.props);
                _componentList[compName] = obj;
            } else {
                Exception.error('[ ' + compName + ' ] 组件未注册');
                _componentList = false;
                return;
            }
        }
        /* 实例添加方法 */
        for (let key in _componentList) {
            let componentObj = _componentList[key];
            componentObj.setStore = (o, type) => {
                if (isObject(o)) {
                    Object.assign(componentObj.store, o);
                    if (type === true) { Sv.globalStorage.set(o, componentObj._name + '_store'); }
                } else {
                    Exception.error('setStore 参数必须是对象')
                }
            }
            componentObj.getStore = (key, type) => {
                if (isString(key)) {
                    return componentObj.store[key];
                }
                if (type === true) { return Sv.globalStorage.get(key, componentObj._name + '_store') }

            }
            componentObj.setState = (obj) => {
                // _updateStateList.push(obj)

                if (isObject(obj)) {
                    let _in = {}, _su = {};

                    {
                        for (const key in obj) {
                            //state存在更新，不存在取出
                            if (componentObj.state[key]) {
                                _in['_' + key + '_'] = obj[key]
                            } else {
                                _su[key] = obj[key]
                            }
                        }
                        Object.assign(componentObj.state, Object.assign(_in, _su))
                    }
                    {
                        /* 监听新值 */
                        for (let key in _su) {
                            if (key) {
                                Sv.defineProperty(componentObj.state,key, function (key, value) {
                                    parallelism('state_' + key, value, componentObj)
                                });
                            }
                        }
                    }
                }
            }
            componentObj.getState = (key) => {
                let res = componentObj.state[key];
                return res;
            }
            componentObj.getComponent = (name) => {
                return {
                    getState: _componentList[name].getState,
                    getStore: _componentList[name].getStore,
                    setState: _componentList[name].setState,
                    setStore: _componentList[name].setStore,
                    props: _componentList[name].props,
                    state: _componentList[name].state,
                    store: _componentList[name].store,
                }
            }
            componentObj.pipeline = {
                set: function (o) {
                    if (isObject(o)) {
                        if (componentObj.pipelineName) {
                            Object.assign(componentObj._pipeline, o);
                            return Sv.globalStorage.set(o, componentObj.pipelineName)
                        }
                    } else {
                        Exception.error('pipeline.set 参数必须是对象')
                    }
                },
                get: function (key) {
                    if (isString(key) && componentObj.pipelineName) {
                        return Sv.globalStorage.get(key, componentObj.pipelineName)
                    }
                }
            }

            if (componentObj.template) {
                /* 在挂载前调用 */
                if (componentObj.componentMount) {
                    componentObj._status='componentMount';
                    let res = componentObj.componentMount();
                    if (res) {
                        return res;
                    }
                }

                Sv.domReady(function () {
                    let parentEl = componentObj.props._el ? document.querySelector(componentObj.props._el) : null;
                    let template = componentObj.template();
                    let vnode;
                    let html;
                    if (isString(template)) {
                        vnode = htmlToVnode(template);
                    }
                    /* 生成dom */
                    html = Sv.render(vnode, componentObj, Sv.config);
                    componentObj._html=html;
                    /* 在渲染前调用 */
                    if (componentObj.componentBeforeRender) {
                        componentObj._status='componentBeforeRender';
                        let res=componentObj.componentBeforeRender(html);
                        if (res) {
                            if (isObject(res)&&res.html) {
                                html=res.html;
                            } else {
                                return res;
                            }
                        }
                    }
                    /* 插入dom */
                    parentEl.appendChild(html);

                    /* 在渲染后调用 */
                    if (componentObj.componentAfterRender) {
                        componentObj._status='componentAfterRender';
                        componentObj.componentAfterRender();
                    }

                    /* 在组件完成更新后立即调用。在初始化时不会被调用 */
                    if (componentObj.componentAfterUpdate) {
                        componentObj._status='componentAfterUpdate';
                        componentObj.componentAfterUpdate();
                    }

                    /* 组件从 DOM 中卸载被调用 */
                    if (componentObj.componentUnMount) {
                        componentObj._status='componentUnMount';
                        componentObj.componentUnMount();
                    }

                });
            }
        }
    }
    function parallelism(key, value, compObj) {
        let parentEl= compObj.props['_el'];
        typeof (parentEl) == 'string' ? parentEl = document.querySelector(parentEl) : null;
        /* 根据组件所处状态触发更新 元素  */
        if (compObj._status=='componentBeforeRender') {
            parentEl=compObj._html;
        }
        if (compObj._status=='componentMount') {
            return;
        }

        compObj.parallelism[key].forEach(o => {
            let sign = 'sv_sign_id="' + o.id + '"';
            let el = parentEl.querySelector('[data-' + sign + ']');
            let content = analysis(compObj, {
                value: o.value
            })

            switch (o.type) {
                case 'attribute':
                    if (o.key == 'class') {
                        let _class = el.getAttribute('class') || '';
                        _class = _class.replace(content, '');
                        _class = _class == '' ? '' : _class + ' ';

                        el.setAttribute('class', _class + value);
                    }
                    if (o.key == 'style') {
                        let _style = el.getAttribute('style') || '';
                        _style = _style.replace(content, '');
                        _style = _style == '' ? '' : _style + ' ';
                        el.setAttribute('style', _style + value);
                    }
                    if (o.key != '') {
                        el.setAttribute(o.key, value);
                    }
                    break;
                case 'text':
                    if (value !== o.text) {
                        el.innerText = value;
                    }
                    break;
                default:
                    break;
            }
            // o.value = value;
        });
        function analysis(compObj, _analysis) {
            return render(null, compObj, Sv.config, _analysis)
        }
    }
    console.log(_componentList['c2']);
    // });

    return _componentList;
}

Sv._init.forEach(fn => {
    fn();
});


export { Sv, Component }