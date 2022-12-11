# 注意：export.default 向外暴露的成员，可以使用任意变量来接收

# 注意：在一个模块中，export default 只允许向外暴露一次

# 注意：在一个模块中，可以同时使用 export default 和 export 向外暴露成员

# 注意：使用 export 向外暴露的成员，只能使用 {} 的形式来接收，叫做 ----按需导出

# 注意：在一个模块中，export 可以向外暴露多个，

# 同时，如果某些成员在 import 时，不需要 则可以不在 {} 中定义

# 注意；使用 export 导出的成员，必须严格按照 导出时候的名称，来使用 {} 按需接收

# 注意；使用 export 导出的成员，如果要换个名称，可以使用 as 起别名

# node.js的exports、module.exports与ES6的export {}、export default

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);

// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);

// toBe()  精准匹配 , 只能检测常规类型

test('数值相加 , 等于2' , () => {
    expect(2+2).toBe(4)
})

// toEqual()  精准匹配 : 可以检测对象
test("检测object对象,是否是预期结果" , () => {
    const data = { one : 1}
    data["two"] = 2
    expect(data).toEqual({one : 1 , two : 2})
})

// toBeNull 只匹配null
// toBeUndefined 只匹配undefined
// toBeDefine 只匹配有值
// toBeTruthy 只匹配为true
// toBeFalsy 只匹配为false


test("Truthiness" , () => {
    // toBeNull 只匹配null
    expect(null).toBeNull()

    // toBeUndefined 只匹配undefined
    expect(undefined).toBeUndefined()

    // toBeDefine 只匹配有值
    expect("123").toBeDefine()

    // toBeTruthy 只匹配为true
    expect(true).toBeTruthy()

    // toBeFalsy 只匹配为false
    expect(false).toBeFalsy()
})
// toBeGreaterThan() 大于
// toBeGreaterThanOrEqual() 大于或者等于
// toBeLessThan() 小于
// toBeLessThanOrEqual() 小于或等于
// toBe和toEqual只适用于数字,不适用小数
// toBeCloseTo() 小数使用这个
使用toMatch()测试字符串，传递的参数是正则表达式。
test('there is no I in team', () => {
  expect('team').not.toMatch(/I/);
});

test('but there is a "stop" in Christoph', () => {
  expect('Christoph').toMatch(/stop/);
});
如何检测数组中是否包含特定某一项？可以使用toContain()

function compileAndroidCode() {
  throw new ConfigError('you are using the wrong JDK');
}
测试error
test('compiling android goes as expected', () => {
  expect(compileAndroidCode).toThrow();
  expect(compileAndroidCode).toThrow(ConfigError);

  // You can also use the exact error message or a regexp
  expect(compileAndroidCode).toThrow('you are using the wrong JDK');
  expect(compileAndroidCode).toThrow(/JDK/);
});


function fetchData(call) {
  setTimeout(() => {
    call('peanut butter1')
  },1000);
}
7. 测试异步代码
1. 使用done进行等待
使用单个参数调用done，而不是将测试放在一个空参数的函数中，Jest会等done回调函数执行结束后，结束测试。
如果done()永远不会被调用，则说明这个测试将失败
test('the data is peanut butter', (done) => {
  function callback(data) {
    expect(data).toBe('peanut butter');
    done()
  }
  fetchData(callback);
});
2. 返回promise
注意：一定要返回Promise，如果省略了return语句，测试将会在fetchData完成之前完成。
test('the data is peanut butter', () => {
  expect.assertions(1);
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});

3. Async/Await
test('the data is peanut butter', async () => {
  expect.assertions(1);
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch (e) {
    expect(e).toMatch('error');
  }
});

写测试的时候，我们经常需要进行测试之前做一些准备工作，和在进行测试后需要进行一些整理工作。Jest提供辅助函数来处理这个问题。

beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));
test('', () => console.log('1 - test'));
describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'));
  afterAll(() => console.log('2 - afterAll'));
  beforeEach(() => console.log('2 - beforeEach'));
  afterEach(() => console.log('2 - afterEach'));
  test('', () => console.log('2 - test'));
});

// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach  //特别注意
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll

describe('匹配器', () => {
    test("数值相加" , () => {
        expect(2 + 2).toBe(4)
    })

    test("object" , () => {
        const data = { one : 1}
        data["two"] = 2
        expect(data).toEqual({ one :1  , two :2 })
    })

    test("undefined null false true 匹配器" , () => {
        expect(null).toBeNull()
        expect(undefined).toBeUndefined()
        expect("123").toBeDefined()
        expect(true).toBeTruthy()
        expect(false).toBeFalsy()
    })

    test("数字匹配器",() => {
        const value =  2  + 2

        expect(value).toBeGreaterThan(3)
        expect(value).toBeGreaterThanOrEqual(3.5)
        expect(value).toBeLessThan(5)
        expect(value).toBeLessThanOrEqual(4)

        expect(value).toBe(4)
        expect(value).toEqual(4)
    })

    test("浮点数" , () => {
        const value = 0.1 + 0.2 
        expect(value).toBeCloseTo(0.3)
    })

    test("数组匹配器" , () => {
        const arr = [
            'diapers',
            'kleenex',
            'trash bags',
            'paper towels',
            'beer',
          ];
          expect(arr).toContain('beer')
    })

    test("error" , () => {
        function error(){
            throw new Error("报错信息")
        }

        expect(error).toThrow("报错信息")
    })

    test("测试异步代码" , (done) => {
        function fetchData(call){
            setTimeout(() => {
                call("内容")
            },3000)
        }

        fetchData((data) => {
            expect(data).toBe("内容")
            done()
        })
    })

    test("测试异步代码 promise" , () => {
        function fetchData(){
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve("内容")
                },3000)
            }) 
        }
        expect.assertions(1)
        return fetchData().then((data) => {
            expect(data).toBe("内容")
        })
    })

    test("测试异步代码 async await" , async () => {
        function fetchData(){
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve("内容")
                },3000)
            })
        }
        expect.assertions(1)
        const data = await fetchData()
        expect(data).toBe("内容")
    })

})

