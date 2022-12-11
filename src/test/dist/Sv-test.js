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

function isFunction(obj) {
  // In some browsers, typeof returns "function" for HTML <object> elements
  // (i.e., `typeof document.createElement( "object" ) === "function"`).
  // We don't want to classify *any* DOM node as a function.
  return typeof obj === "function" && typeof obj.nodeType !== "number";
}
function isString(obj) {
  return typeof obj === 'string';
}

const Sv = Object.create({});
Sv._version = '1.0';
Sv._name = 'Sv';
Sv.components = {};
Sv.Component = Component;
Sv.registerModule = function (mName, fn) {
  if (isString(mName) && isFunction(fn)) {
    if (this.hasOwnProperty(mName)) {
      console.error('[ ' + mName + ' ]  模块已经被注册,请重新命名');
    } else {
      this[mName] = fn();
    }
  } else {
    console.error('Sv.registerModule(string,function)  注册模块正确参数');
  }
};
Sv.registerComponent = function (...cName) {
  cName.forEach(key => {
    if (Object.getPrototypeOf(key) === Component) {
      if (this.components.hasOwnProperty(key.name)) {
        console.error('[ ' + key.name + ' ]  组件已经被注册,请重新命名');
        return false;
      } else {
        this.components[key.name] = key;
      }
    } else {
      console.error('[ ' + key.name + ' ]  组件必须继承 Component 父类');
      return false;
    }
  });
};
Sv.use = function (componentNameArr) {
  // componentNameArr={
  //     name:'',
  //     pops:{class:'',style:''}
  // }
  let store = {},
    obj = {},
    listenerQueue = [];
  // let componentInfo={
  //     status:true,
  //     error:['__null__']
  // }

  // componentNameArr.forEach(key => {
  //     if (this.components.indexOf(key)==-1) {
  //         componentInfo.status==true?componentInfo.status=false:null;
  //         componentInfo.error.push(key)
  //     }
  // });
  // if (!componentInfo.status) {
  //     componentInfo.errorArr.forEach((key,i) => {
  //         if (i!==0) {
  //             console.error('[ '+key+' ]  此名称的组件未被注册不能使用');
  //         }
  //     });
  //     return
  // }
  const action = {
    setStore: function (o) {
      Object.assign(store, o);
      Object.assign(obj, o);
      return store;
    },
    getStore: function (key) {
      return key ? store[key] : store;
    },
    listener: function (key, fn) {
      // if (typeof key==='function') {
      //     fnQueue.push(key)
      // }
      if (key === 'store') {
        listenerQueue.push(fn);
      }
    }
  };
  /* 初始化模块对象 */
  function initObj(obj) {
    const o = new obj.className(obj.arg);
    o.setStore = o => {
      return action.setStore(o);
    };
    o.getStore = key => {
      return action.getStore(key);
    };
    o.listener = (key, fn) => {
      action.listener(key, fn);
    };
    return o;
  }
  /* 遍历执行模块函数 */
  if (Array.isArray(componentNameArr)) {
    componentNameArr.forEach((v, i) => {
      var o = initObj(v);
      o.run();
    });
  }
  /* 监听函数：函数队列 */
  if (listenerQueue.length > 0) {
    listenerQueue.forEach(function (v) {
      v(store);
    });
  }

  /* 监听数据执行函数 */
  for (const key in obj) {
    Object.defineProperty(obj, key, {
      get: function () {
        return store[key];
      },
      set: function (value) {
        if (listenerQueue.length > 0) {
          listenerQueue.forEach(v => {
            v(store, key);
          });
        }
      }
    });
  }
};

// let conut=0;
// function log(params) {
//     typeof(params)=='undefined'?params='':null
//     conut++;
//     console.log('%c--ok--'+params,'color:green;');
//     console.log('%c⬆ '+ conut,'color:blue;');
// }
// function logError(params) {
//     console.error(params+' 错误');
// }
// function test(a,fn) {
//     console.log('⬇ test '+a);
//     fn()
// }
Sv.registerModule('dd', function (s) {
  return {
    k: function (k) {
      return true;
      // log(k + ' registerModule 注册成功');
    }
  };
});

console.log(Sv);

// @ts-ignore
test('Sv.registerModule', function () {
  let result = Sv.dd.k('23');
  // @ts-ignore
  expect(result).toBe(true);
});
class list extends Sv.Component {
  constructor(pops) {
    super(pops);
    this.state = {
      ll: '333'
    };
  }
  componentWillMount() {
    /* 在渲染前调用 */
    console.log('2');
  }
  componentDidMount() {/* 在第一次渲染后调用 */
  }
  componentDidUpdate() {/* 在组件完成更新后立即调用。在初始化时不会被调用 */
  }
  componentWillUnmount() {/* 在组件从 DOM 中移除之前被调用 */
  }
  methods = {
    event: function (e) {
      console.log('event');
    }
  };
}
class list2 extends Sv.Component {
  constructor(pops) {
    super(pops);
    this.state = {
      ll: '333'
    };
  }
  methods = {
    event: function (e) {
      console.log('event');
    }
  };
}
class list3 extends Sv.Component {
  constructor(pops) {
    super(pops);
    this.state = {
      ll: '333'
    };
  }
  methods = {
    event: function (e) {
      console.log('event');
    }
  };
}

// var list1=new list('1');
// console.log(list1);

// console.log(list1.componentWillMount());

/*test  单个组件注册/true/false */
// @ts-ignore
describe('Sv.registerComponent单个组件注册', () => {
  class test_list extends Sv.Component {}
  // @ts-ignore
  test('单个组件注册true', function () {
    Sv.registerComponent(test_list);
    if (Sv.components.list) {
      let status = true;
      // @ts-ignore
      expect(status).toBeTruthy();
    }
  });
  // @ts-ignore
  test('组件已经被注册,请重新命名', () => {
    let status = Sv.registerComponent(test_list);
    // @ts-ignore
    expect(status).toBeFalsy();
  });
  // @ts-ignore
  test('组件必须继承父类Component父类', () => {
    class test_listErrorTest {}
    let status = Sv.registerComponent(test_listErrorTest);
    // @ts-ignore
    expect(status).toBeFalsy();
  });
  // @ts-ignore
  test('组件必须继承父类Component父类', () => {
    class test_listErrorTest {}
    let status = Sv.registerComponent(test_listErrorTest);
    // @ts-ignore
    expect(status).toBeFalsy();
  });
});
// @ts-ignore
describe('Sv.registerComponent多组件注册', () => {
  class test_list_d1 extends Sv.Component {}
  class test_list_d2 extends Sv.Component {}
  Sv.registerComponent(test_list_d1, test_list_d2);
  if (Sv.components.test_list_d1 && Sv.components.test_list_d2) {
    let status = true;
    // @ts-ignore
    expect(status).toBeTruthy();
  } else {
    let status = false;
    // @ts-ignore
    expect(status).toBeFalsy();
  }
});

/* 3 */

// /* 手动 动态添加实例化后的组件 */
// Sv.use('c1','dom')
// /* 实例化组件 */
// Sv.use(['c1','c2','c3','c4'])
// /* 实例化组合组件 */
// Sv.use([{c1:'c2,c3'},{}])
// var listss=new list()
// console.log(listss);
// console.log(listss.getState());

// let vNode=[
//     {
//         id:1,
//         pid:null,

//     },
//     {}
// ]
//# sourceMappingURL=Sv-test.js.map
