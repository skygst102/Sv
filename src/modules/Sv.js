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
Sv.defineProperty = function (Wobj, key, setFn, getFn) {
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
                if (isFunction(getFn)) {
                    getFn(key)
                }
                return Wobj[key];
            },
            set: function (value) {
                if (Wobj[key] !== value) {
                    Wobj[key] = value;
                    if (isFunction(setFn)) {
                        setFn(key, value)
                    }
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
                obj._updateStateList = {};
                obj._pipeline = {};
                obj._status = 'init';
                obj._name = compName;
                obj._root = obj.props._el || '';

                /*  */
                Sv.defineProperty(obj.state, null, function (key, value) {
                    updateStateList(obj, { [key]: value })
                    // obj.update('state_' + key, value);
                    // parallelism('state_' + key, value, obj)
                });
                Sv.defineProperty(obj, '_status', function (key, status) {
                    if(status===false)return;
                    componentStatusFn(obj, status);
                    updateParallelism(obj, status);
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
                if (isObject(obj)) {
                    let _in = {}, _su = {};
                    //state存在更新，不存在取出
                    for (const key in obj) {
                        if (componentObj.state[key]) {
                            _in['_' + key + '_'] = obj[key]
                        } else {
                            _su[key] = obj[key]
                        }
                    }
                    Object.assign(componentObj.state, Object.assign(_in, _su))

                    /* 监听新值 */
                    for (let key in _su) {
                        Sv.defineProperty(componentObj.state, key, function (key, value) {
                            updateStateList(componentObj, { [key]: value })
                        });
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
            componentObj.update = (key, value) => {
                // console.log('update');
                // parallelism('state_' + key, value, componentObj)
                // updateParallelism(componentObj,status)
            }
            componentObj.unMount = () => {
                /* 组件从 DOM 中卸载被调用 */
                componentObj.__status_='componentUnMount';
            }

            if (componentObj.template) {
                /* 在挂载前调用 */
                componentObj.__status_='componentMount';
                if (componentObj._status===false) {
                    return;
                }
                Sv.domReady(function () {
                    componentObj._root = componentObj._root ? document.querySelector(componentObj._root) : null;
                    let parentEl = componentObj._root;
                    let template = componentObj.template();
                    let vnode;
                    let html;

                    if (isString(template)) { vnode = htmlToVnode(template); }
                    /* 生成dom */
                    html = Sv.render(vnode, componentObj, Sv.config);
                    componentObj._html = html;
                    /* 在渲染前调用 */
                    componentObj.__status_='componentBeforeRender';
                    if (componentObj._status===false) {
                        return;
                    }
                    /* 插入dom */
                    parentEl.appendChild(componentObj._html);

                    /* 在渲染后调用 */
                    componentObj.__status_='componentAfterRender';
                });
            }
        }
    }
    function updateParallelism(compObj, status) {
        let parentEl; let parallelism = compObj.parallelism;
        /* 根据组件所处状态触发更新 元素  */
        if (/componentBeforeRender/g.test(compObj._status) == true ) {
            parentEl = compObj._html;
        }else if(/componentMount/g.test(compObj._status) == true){
            return;
        }else{
            parentEl = compObj._root;
        }
        if (compObj._status == 'componentBeforeRendered'||compObj._status == 'componentAfterRendered') {
            let updateState=status.replace(/(ed)$/g,'');
            for (const key in compObj._updateStateList[updateState]) {
                let value=compObj._updateStateList[updateState][key]
                update(key,value);
            }
            /* 在组件完成更新*/
            compObj.__status_='componentAfterUpdate';
        }

        function analysis(compObj, _analysis) {
            return render(null, compObj, Sv.config, _analysis)
        }
        function update(key, value) {
            parallelism['state_' + key].forEach(o => {
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
            });
        }
    }
    function componentStatusFn(compObj, status) {
        compObj.__status_ = status;
        switch (status) {
            case 'componentMount':
                if (compObj.componentMount) {
                    let res = compObj.componentMount();
                    if (res===false) {
                        compObj.__status_=false;
                    }
                    compObj.__status_='componentMounted';
                }
                break;
            case 'componentUnMount':
                if (compObj.componentUnMount) {
                    let res = compObj.componentUnMount();
                    if (res===false) {
                        return;
                    }
                }
                Sv.components[compObj._name] = null;
                delete Sv.components[compObj._name];
                compObj.__status_='componentMounted';
                break;
            case 'componentBeforeRender':
                if (compObj.componentBeforeRender) {
                    let res = compObj.componentBeforeRender(compObj._html);
                    if (isObject(res) && res.html) {
                        compObj._html = res.html;
                    }
                    if (res===false) {
                        compObj.__status_=false;
                    }
                }
                compObj.__status_='componentBeforeRendered';
                break;
            case 'componentAfterRender':
                if (compObj.componentAfterRender) {
                    let res=compObj.componentAfterRender();
                    if (res===false) {
                        compObj.__status_=false;
                    }
                }
                compObj.__status_='componentAfterRendered';
                break;
            case 'componentAfterUpdate':
                console.log('12');
                if (compObj.componentAfterUpdate) {
                    let res=compObj.componentAfterUpdate();
                    if (res===false) {
                        compObj.__status_=false;
                    }
                }
                compObj.__status_='componentAfterUpdated';
                break;

        }

    }
    function updateStateList(componentObj, stateKey) {
        /* 收集需要更新的值 */
        if (componentObj._status == 'componentMount') {
            return;
        }
        let stateList = componentObj._updateStateList[componentObj._status];
        if (componentObj._status == 'init') {
            return;
        }
        if (!stateList) {
            componentObj._updateStateList[componentObj._status] = {}
        }
        if (isObject(stateKey)) {
            Object.assign(componentObj._updateStateList[componentObj._status], stateKey)

        } else {
            Object.assign(componentObj._updateStateList[componentObj._status], { [stateKey]: componentObj.state[stateKey] })

        }
    }


    console.log(_componentList['c2']);

    return _componentList;
}

Sv._init.forEach(fn => {
    fn();
});


export { Sv, Component }