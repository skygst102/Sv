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
// Sv.domReadyFn=[];


Sv._init = [
    function () {
        Sv.config.current.localStorage.removeItem(Sv.config._global_store_sign);
    },
    function () {
        Sv.globalStorage = new componentStore(Sv.config);
        Sv.globalStorage.init()
    }
]
Sv.mergeConfig = function (o) {
    Object.assign(Sv.config, o)
}
Sv.domReady = function (fn) {
    document.addEventListener('DOMContentLoaded', fn, false);
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
Sv.defineProperty = function (Wobj, setFn, getFn, key) {
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
    Sv.domReady(function () {
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
                    obj._pipeline = {};
                    obj.parallelism = {};
                    obj._name = compName;
                    obj._parentNode = obj.props._el || '';
                    /*  */
                    Sv.defineProperty(obj.state, function (key, value) {
                        parallelism('state_' + key, value, obj)
                    });
                    Sv.defineProperty(obj.store);
                    Sv.defineProperty(obj.props);
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
                        if (type === true) {Sv.globalStorage.set(o); }
                    } else {
                        Exception.error('setStore 参数必须是对象')
                    }
                }
                componentObj.getStore = (key, type) => {
                    if (isString(key)) {
                        return componentObj.store[key];
                    }
                    if (type === true) {return Sv.globalStorage.get(key)}

                }
                componentObj.setState = (obj) => {
                    if (isObject(obj)) {
                        let _in = {}, _su = {};
                        {
                            for (const key in obj) {
                                if (componentObj.state[key]) {
                                    _in['_' + key + '_'] = obj[key]
                                } else {
                                    _su[key] = obj[key]
                                }
                            }
                            Object.assign(componentObj.state, Object.assign(_in,_su))
                        }
                        {
                            /* 监听新值 */
                            for (let key in _su) {
                                if (key) {
                                    Sv.defineProperty(componentObj.state, function (key, value) {
                                        parallelism('state_' + key, value, componentObj)
                                    }, null, key);
                                }
                            }
                        }
                    }
                }
                componentObj.getState = (key) => {
                    return componentObj.state[key];
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
                    let parentEl = componentObj.props._el ? document.querySelector(componentObj.props._el) : null;
                    let template = componentObj.template();
                    if (isString(template)) { template = htmlToVnode(template); }
                    parentEl.appendChild(Sv.render(template, componentObj, Sv.config));
                    /* 在第一次渲染后调用 */
                    componentObj.componentAfterMount ? componentObj.componentAfterMount() : null;
                }

                /* 在渲染前调用 */
                if (componentObj.componentBeforeRemove) {
                    componentObj.componentBeforeRender();
                }

                /* 在组件完成更新后立即调用。在初始化时不会被调用 */
                // componentObj.componentAfterUpdate();
                /* 组件从 DOM 中移除之前被调用 */
                if (componentObj.componentBeforeRemove) {
                    componentObj.componentBeforeRemove()
                }


            }
        }
        function parallelism(key, value, compObj) {
            let parentEl = compObj.props['_el'];
            typeof (parentEl) == 'string' ? parentEl = document.querySelector(parentEl) : null;
            compObj.parallelism[key].forEach(o => {
                let sign = 'sv_sign_id="' + o.id + '"';
                let el = parentEl.querySelector('[data-' + sign + ']');
                let content=analysis(compObj,{
                    value:o.value
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
                o.value = value;
            });
            function analysis(compObj,_analysis) {
               return render(null, compObj, Sv.config,_analysis)
            }
        }
        console.log(_componentList['c2']);
    });

    return _componentList;
}

Sv._init.forEach(fn => {
    fn();
});


export { Sv, Component }