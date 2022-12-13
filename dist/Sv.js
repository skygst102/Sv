class Component {
  constructor(props) {}
  // render() {/* 渲染 */}
  // setState(){}

  // getState(s){}
  // listener(){}
  // setStore(){}
  // getStore(){}
  // run() {}
  // componentWillMount()   {/* 在渲染前调用 */}
  // componentDidMount()    { /* 在第一次渲染后调用 */}
  // componentDidUpdate()   {/* 在组件完成更新后立即调用。在初始化时不会被调用 */}
  // componentWillUnmount() {/* 在组件从 DOM 中移除之前被调用 */}
}

class _Exception {
  constructor(props) {
    this.current = props.current;
    this.color = {
      'error': 'color:red',
      'warn': ''
    };
  }
  error(msg) {
    if (this.current === window) {
      console.error('%c' + msg, this.color.error);
    }
  }
  warn(msg) {
    if (this.current === window) {
      console.warn('%c' + msg, this.color.warn);
    }
  }
}
const Exception = new _Exception({
  'current': window
});

class componentStore {
  constructor(props) {
    this.current = props.current;
    this.props = props;
  }
  set(o, sign) {
    if (sign) {
      let pipeline = this.current.localStorage.getItem(this.props._pipelineSign);
      let obj = JSON.parse(pipeline);
      if (!obj[sign]) {
        obj[sign] = {};
      }
      let store = obj[sign];
      Object.assign(store, o);
      Object.assign(obj, {
        [sign]: store
      });
      this.current.localStorage.setItem(this.props._pipelineSign, JSON.stringify(obj));
      return obj;
    } else {
      let store = this.current.localStorage.getItem(this.props._global_store_sign);
      let storeObj = JSON.parse(store) || {};
      Object.assign(storeObj, o);
      this.current.localStorage.setItem(this.props._global_store_sign, JSON.stringify(storeObj));
      return this.current.localStorage[this.props._global_store_sign];
    }
  }
  get(key, sign) {
    let store;
    if (sign) {
      let pipeline = this.current.localStorage.getItem(this.props._pipelineSign);
      let obj = JSON.parse(pipeline);
      store = obj[sign];
    } else {
      store = this.current.localStorage.getItem(this.props._global_store_sign);
    }
    let storeObj = typeof store === 'string' ? JSON.parse(store) : store;
    return storeObj[key];
  }
  init(o) {
    this.current.localStorage.setItem(this.props._global_store_sign, '{}');
    this.current.localStorage.setItem(this.props._pipelineSign, '{}');
  }
}

//指令
function directive(dom, content, arr, compObj) {
  let input = {
    event: 'oninput'
  };
  if (dom.tagName == 'input' || dom.tagName == 'textarea') {
    input.event = input.event.replace(/^(on)/g, '');
    dom.el.addEventListener(input.event, function () {
      if (arr[0] === 'state') {
        compObj.setState({
          [arr[1]]: dom.el.value
        });
      }
    }, false);
  }
}
/* 绑定的state 信息 */
function parallelism(keyName, compObj, tagName, id, type, key, value, parallelism_flash) {
  let vo = {
    tagName: tagName,
    id: id,
    type: type,
    key: type === 'text' ? '' : key,
    value: value
  };
  let parallelism = compObj.parallelism[keyName];
  let parallelism_f = parallelism_flash[keyName];
  if (!parallelism && !parallelism_f) {
    compObj.parallelism[keyName] = [vo];
    parallelism_flash[keyName] = [JSON.stringify(vo)];
  } else {
    if (parallelism_f.indexOf(JSON.stringify(vo)) == -1) {
      parallelism.push(vo);
      parallelism_f.push(JSON.stringify(vo));
    }
  }
  return vo;
}
// =============================
// 解析{...}
//
//==============================
function analysis(dom, compObj, type, attr, value, status, parallelism_flash, temIdentifying_select, temIdentifying_replace) {
  let content;
  let temp = value.match(temIdentifying_select);
  if (temp) {
    temp.forEach((key, i, self) => {
      let cobjv;
      let text;
      let arr = key.replace(temIdentifying_replace, '').replace(/this\./g, '').split('.');
      if (arr.length == 1) {
        cobjv = compObj[arr[0]];
      }
      if (arr.length == 2) {
        cobjv = compObj[arr[0]][arr[1]];
      }
      if (arr.length == 3) {
        cobjv = compObj[arr[0]][arr[1]][arr[2]];
      }
      if (arr.length == 4) {
        cobjv = compObj[arr[0]][arr[1]][arr[2]][arr[3]];
      }
      if (typeof cobjv == 'function') {
        let res = cobjv();
        if (typeof res === 'string') {
          text = res;
        } else {
          Exception.error(key + ' 返回值不是string类型');
        }
      }
      if (typeof cobjv == 'string') {
        text = cobjv;
      }
      if (self.length > 1 && content) {
        content = content.replace(key, text);
      } else {
        content = value.replace(key, text);
      }
      if (status) {
        if (arr[0] === 'state') {
          let keyName = arr.join('_');
          parallelism(keyName, compObj, dom.tagName, dom.id, type, attr, value, parallelism_flash);
        }
        // directive
        let one = true;
        if (directive && one) {
          let result = directive(dom, content, arr, compObj);
          typeof result === 'string' ? content = result : null;
          one = false;
        }
      }
    });
  } else {
    content = value;
  }
  return content;
}
function createElement(vdom, compObj, temIdentifying_select, temIdentifying_replace, parallelism_flash, orderPrefix) {
  let parentNode = null;
  vdom.forEach((key, i) => {
    let dom = {
      el: document.createElement(key.tagName),
      id: key.id,
      pid: key.pid,
      tagName: key.tagName,
      text: key.props.text,
      attributes: key.props.attributes
    };
    let sty = JSON.stringify(key.props.style).replace(/\{|\}|"|\'/g, '') || '';
    dom.el.setAttribute('data-sv_sign_id', dom.id);
    if (dom.attributes.style) {
      dom.attributes["style"] += ';' + sty;
    } else if (sty) {
      dom.attributes["style"] = sty;
    }
    if (dom.text) {
      if (temIdentifying_select.test(dom.text)) {
        let text = analysis(dom, compObj, 'text', '', dom.text, true, parallelism_flash, temIdentifying_select, temIdentifying_replace);
        dom.el.innerText = text;
      } else {
        dom.el.innerText = dom.text;
      }
    }
    if (JSON.stringify(dom.attributes) !== '{}') {
      for (const key in dom.attributes) {
        let attr;
        if (temIdentifying_select.test(dom.attributes[key])) {
          attr = analysis(dom, compObj, 'attribute', key, dom.attributes[key], true, parallelism_flash, temIdentifying_select, temIdentifying_replace);
        } else {
          attr = dom.attributes[key];
        }
        if (!orderPrefix.test(key)) {
          dom.el.setAttribute(key, attr);
        }
      }
    }
    if (!parentNode) {
      parentNode = dom.el;
    } else {
      if (dom.pid === 1) {
        parentNode.appendChild(dom.el);
      } else {
        parentNode.querySelector('[data-sv_sign_id="' + dom.pid + '"]').appendChild(dom.el);
      }
    }
  });
  return parentNode;
}
function render(vdom, compObj, config, _analysis) {
  let parentNode = null;
  let orderPrefix = /^(v-)/gi;
  let parallelism_flash = {};
  let temIdentifying_select = /\{(.+?)\}/g;
  let temIdentifying_replace = /\{|\}/g;
  if (config.template === '{{}}') {
    temIdentifying_select = new RegExp(/^\{\{.+\}\}$/g);
    temIdentifying_replace = new RegExp(/^\{\{|\}\}$/g);
  }
  if (config.orderPrefix) {
    orderPrefix = new RegExp('^(' + config.orderPrefix + ')', 'gi');
  }
  if (typeof _analysis === 'object') {
    return analysis('', compObj, '', _analysis.key, _analysis.value, false, parallelism_flash, temIdentifying_select, temIdentifying_replace);
  }
  parentNode = createElement(vdom, compObj, temIdentifying_select, temIdentifying_replace, parallelism_flash, orderPrefix);
  return parentNode;
}

function htmlToVnode(element) {
  let vnode = [];
  let count = 1;
  if (typeof element === 'string') {
    let div = document.createElement('div');
    div.innerHTML = element;
    element = div;
  }
  function vNode(el, obj, root, parentEl) {
    // obj={id:'',pid:'',index:'',}
    let tagName = el.tagName.toLowerCase();
    let name = tagName === 'div' ? 'View' : tagName === 'img' ? 'Image' : tagName === 'input' ? 'TextInput' : tagName;
    let text = parentEl ? null : el.firstChild ? el.firstChild.nodeValue : null;
    if (typeof text === 'string' && text.replace(/\n|\s|\t/g, '') === '') {
      text = null;
    }
    let nodeObj = {
      tagName: tagName,
      id: obj.id || count,
      index: obj.index || null,
      pid: obj.pid || root || 'root',
      name: name,
      props: {
        attributes: {},
        text: text,
        style: {}
      }
    };
    Array.from(el.attributes).forEach((key, i) => {
      nodeObj.props.attributes[key.name] = key.value || '';
    });
    return nodeObj;
  }
  function recursion(element, pid, id) {
    let nodeArr = Array.prototype.slice.call(element.children);
    if (nodeArr.length > 0) {
      nodeArr.forEach((key, i) => {
        count++;
        vnode.push(vNode(key, {
          id: count,
          pid: pid || count
        }));
        recursion(key, count);
      });
    }
  }
  vnode.push(vNode(element, {}, null, true));
  recursion(element, count);
  return vnode;
}

function isFunction(obj) {
  // In some browsers, typeof returns "function" for HTML <object> elements
  // (i.e., `typeof document.createElement( "object" ) === "function"`).
  // We don't want to classify *any* DOM node as a function.
  return typeof obj === "function" && typeof obj.nodeType !== "number";
}
function isString(obj) {
  return typeof obj === 'string';
}
function isObject(obj) {
  return typeof obj === 'object';
}

const Sv = Object.create({});
Sv._version = '1.0';
Sv._name = 'Sv';
Sv.config = {
  template: '{}',
  orderPrefix: '',
  current: window,
  _global_store_sign: '__sv_store__',
  _pipelineSign: '__sv_pipelineSign__'
};
Sv.components = {};
Sv.Component = Component;
Sv.render = render;
// Sv._pipeline=[];
Sv.domReadyFn = [];
Sv._init = [function () {
  Sv.config.current.localStorage.removeItem(Sv.config._global_store_sign);
}, function () {
  Sv.globalStorage = new componentStore(Sv.config);
  Sv.globalStorage.init();
}, function () {
  document.addEventListener('DOMContentLoaded', function () {
    Sv.domReadyFn.forEach(fn => {
      fn();
    });
  }, false);
}];
Sv.mergeConfig = function (o) {
  Object.assign(Sv.config, o);
};
Sv.domReady = function (fn) {
  Sv.domReadyFn.push(fn);
};
Sv.registerModule = function (mName, fn) {
  if (isString(mName) && isFunction(fn)) {
    if (this.hasOwnProperty(mName)) {
      Exception.error('[ ' + mName + ' ]  模块已经被注册,请重新命名');
    } else {
      this[mName] = fn();
    }
  } else {
    Exception.error('Sv.registerModule(string,function)  注册模块正确参数');
  }
};
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
};
Sv.defineProperty = function (Wobj, key, setFn, getFn) {
  if (key) {
    wacth(Wobj, key);
  } else {
    for (const key in Wobj) {
      wacth(Wobj, key);
    }
  }
  function wacth(Wobj, key) {
    Object.defineProperty(Wobj, '_' + key + '_', {
      get: function () {
        if (isFunction(setFn)) {
          getFn(key);
        }
        return Wobj[key];
      },
      set: function (value) {
        Wobj[key] = value;
        if (isFunction(setFn)) {
          setFn(key, value);
        }
      }
    });
  }
};
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
      let value = comParamList[index][1];
      let component = Sv.components[compName];
      if (component) {
        let obj = new component(value);
        obj.state = Object.assign(obj.state || {}, {});
        obj.store = Object.assign(obj.store || {}, {});
        obj.props = Object.assign(obj.props || {}, value);
        obj.parallelism = {};
        obj._pipeline = {};
        obj._status = 'init';
        obj._name = compName;
        obj._parentNode = obj.props._el || '';
        /*  */
        Sv.defineProperty(obj.state, null, function (key, value) {
          parallelism('state_' + key, value, obj);
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
          if (type === true) {
            Sv.globalStorage.set(o, componentObj._name + '_store');
          }
        } else {
          Exception.error('setStore 参数必须是对象');
        }
      };
      componentObj.getStore = (key, type) => {
        if (isString(key)) {
          return componentObj.store[key];
        }
        if (type === true) {
          return Sv.globalStorage.get(key, componentObj._name + '_store');
        }
      };
      componentObj.setState = obj => {
        // _updateStateList.push(obj)

        if (isObject(obj)) {
          let _in = {},
            _su = {};
          {
            for (const key in obj) {
              //state存在更新，不存在取出
              if (componentObj.state[key]) {
                _in['_' + key + '_'] = obj[key];
              } else {
                _su[key] = obj[key];
              }
            }
            Object.assign(componentObj.state, Object.assign(_in, _su));
          }
          {
            /* 监听新值 */
            for (let key in _su) {
              if (key) {
                Sv.defineProperty(componentObj.state, key, function (key, value) {
                  parallelism('state_' + key, value, componentObj);
                });
              }
            }
          }
        }
      };
      componentObj.getState = key => {
        let res = componentObj.state[key];
        return res;
      };
      componentObj.getComponent = name => {
        return {
          getState: _componentList[name].getState,
          getStore: _componentList[name].getStore,
          setState: _componentList[name].setState,
          setStore: _componentList[name].setStore,
          props: _componentList[name].props,
          state: _componentList[name].state,
          store: _componentList[name].store
        };
      };
      componentObj.pipeline = {
        set: function (o) {
          if (isObject(o)) {
            if (componentObj.pipelineName) {
              Object.assign(componentObj._pipeline, o);
              return Sv.globalStorage.set(o, componentObj.pipelineName);
            }
          } else {
            Exception.error('pipeline.set 参数必须是对象');
          }
        },
        get: function (key) {
          if (isString(key) && componentObj.pipelineName) {
            return Sv.globalStorage.get(key, componentObj.pipelineName);
          }
        }
      };
      if (componentObj.template) {
        /* 在挂载前调用 */
        if (componentObj.componentMount) {
          componentObj._status = 'componentMount';
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
          componentObj._html = html;
          /* 在渲染前调用 */
          if (componentObj.componentBeforeRender) {
            componentObj._status = 'componentBeforeRender';
            let res = componentObj.componentBeforeRender(html);
            if (res) {
              if (isObject(res) && res.html) {
                html = res.html;
              } else {
                return res;
              }
            }
          }
          /* 插入dom */
          parentEl.appendChild(html);

          /* 在渲染后调用 */
          if (componentObj.componentAfterRender) {
            componentObj._status = 'componentAfterRender';
            componentObj.componentAfterRender();
          }

          /* 在组件完成更新后立即调用。在初始化时不会被调用 */
          if (componentObj.componentAfterUpdate) {
            componentObj._status = 'componentAfterUpdate';
            componentObj.componentAfterUpdate();
          }

          /* 组件从 DOM 中卸载被调用 */
          if (componentObj.componentUnMount) {
            componentObj._status = 'componentUnMount';
            componentObj.componentUnMount();
          }
        });
      }
    }
  }
  function parallelism(key, value, compObj) {
    let parentEl = compObj.props['_el'];
    typeof parentEl == 'string' ? parentEl = document.querySelector(parentEl) : null;
    /* 根据组件所处状态触发更新 元素  */
    if (compObj._status == 'componentBeforeRender') {
      parentEl = compObj._html;
    }
    if (compObj._status == 'componentMount') {
      return;
    }
    compObj.parallelism[key].forEach(o => {
      let sign = 'sv_sign_id="' + o.id + '"';
      let el = parentEl.querySelector('[data-' + sign + ']');
      let content = analysis(compObj, {
        value: o.value
      });
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
      }
      // o.value = value;
    });

    function analysis(compObj, _analysis) {
      return render(null, compObj, Sv.config, _analysis);
    }
  }
  console.log(_componentList['c2']);
  // });

  return _componentList;
};
Sv._init.forEach(fn => {
  fn();
});

// import { htmlToVnode } from './modules/vnode.js'
// import { render } from './modules/render.js'

class c1 extends Sv.Component {
  constructor(props) {
    super();
    this.state = {
      ll: '333',
      ks: 'css_ee',
      input: 'input'
    };
    this.store = {
      st: 23
    };
    this.props = props;
  }
  componentAfterMount() {
    /* 在第一次渲染后调用 */

    console.log('watch  fn 2');
    console.log(this.getComponent('c1'));
    this.getComponent('c1').setState('ks', 'ssssss35f');
  }
  componentBeforeRender() {
    /* 在渲染前调用 */

    this.setStore({
      'kss': 111111
    }, true);
  }
  componentAfterUpdate() {/* 在组件完成更新后立即调用。在初始化时不会被调用 */
  }
  componentBeforeRemove() {/* 在组件从 DOM 中移除之前被调用 */
  }
  methods = {
    event: function (e) {
      return "event";
      // console.log('event');
    }
  };
}

class c2 extends Sv.Component {
  constructor() {
    super();
    this.state = {
      c2_1: '333',
      c2_2: 'css_ee',
      input: 'input'
    };
    this.store = {
      c2_1: '333'
    };
    // this.pipelineName='ksee';
  }

  methods = {
    event: function (e) {
      return "event";
    }
  };
  componentMount() {
    this.setStore({
      'kss2': 2222
    }, true);
    // this.setStore({'kfff':3666},true)
    this.setState({
      c2_1: '333;;klkll',
      'test_var_state': 'test_var_state',
      'test_var_state2': 3333
    });
    this.pipeline.set({
      'ipe': 6655566
    });
  }
  componentBeforeRender() {/* 在渲染a调用 */
    // this.setState({ 'test_var_state': '3336445465','test_var_state2': 'test_var_state23333' })
  }
  componentAfterRender() {
    this.setState({
      'test_var_state': '3336445465',
      'test_var_state2': 'test_var_state2111'
    });
  }
  template() {
    return `
                <div id="d" class="kk" style="color:red">
                    <div>555</div>
                    <p class="1p" style="display:block;height: 100px;">
                        <span class="span">内容</span>
                        <span class="span">内容2</span>
                        <span class="span">内容3</span>
                        <span class="span">内容4</span>
                    </p>
                    <h1 id="d2" class="kk">{this.methods.event}</h1>

                    <input v-event="kk" value="{this.methods.event}"></input>
                    <input v-event="kk" value="{this.state.input}"></input>
                    <p>{this.state.input}</p>

                    <div class="{this.state.c2_1}">{this.state.c2_1}wo de{this.state.c2_1}</div>
                    <div class="{this.state.c2_2}">{this.state.test_var_state}</div>

                    <p>{this.state.test_var_state2}</p>

                    <div class="">{this.methods.event}</div>

                    <p class="p2">
                        <span>222</span>
                    </p>
                </div>
        `;
  }
}
class c3 extends Sv.Component {
  constructor() {
    super();
    this.state = {};
    this.store = {};
  }
}
Sv.registerComponent(c1, c2, c3);
Sv.use({
  'c1': {
    _el: '#dddd2',
    'kk': 636,
    's': 333
  },
  'c2': {
    _el: '#dddd2'
  },
  'c3': {}
});
// console.log(new c1());
//# sourceMappingURL=Sv.js.map
