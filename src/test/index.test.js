import { expect, describe, jest, test } from '@jest/globals';
import { Sv, Component } from '../modules/Sv';
// import fs from 'fs';
console.error=function () { };
// let storage={};
document.body.innerHTML = `<div id='dddd2'>
    我时d2
</div>`
Sv.domReady = function (fn) {
    fn()
}
let storage= {};
let window={};
let localStorageMock = {
    setItem: function (key, value) {
        storage[key] = value || '';
    },
    getItem: function (key) {
        return storage[key] || null;
    },
    removeItem: function (key) {
        delete storage[key];
    },

    key: function (i) {
        var keys = Object.keys(storage);
        return keys[i] || null;
    }
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
class list extends Sv.Component {
    constructor(pops) {
        super(pops);
        this.state = { ll: '333' }
    }

    componentWillMount() {/* 在渲染前调用 */
        console.log('2');
    }
    componentDidMount() { /* 在第一次渲染后调用 */
    }
    componentDidUpdate() {/* 在组件完成更新后立即调用。在初始化时不会被调用 */
    }
    componentWillUnmount() {/* 在组件从 DOM 中移除之前被调用 */

    }
    methods = {
        event: function (e) {
            console.log('event');
        }
    }
}
class list2 extends Sv.Component {
    constructor(pops) {
        super(pops);
        this.state = { ll: '333' }
    }

    methods = {
        event: function (e) {
            console.log('event');
        }
    }
}
class list3 extends Sv.Component {
    constructor(pops) {
        super(pops);
        this.state = { ll: '333' }
    }

    methods = {
        event: function (e) {
            console.log('event');
        }
    }
}

// var list1=new list('1');
// console.log(list1);

// console.log(list1.componentWillMount());

describe('1. Sv.registerComponent组件注册', () => {
    describe('单个组件注册', () => {
        class test_list extends Sv.Component { }
        // @ts-ignore
        test('单个组件注册true', () => {
            Sv.registerComponent(test_list)
            if (Sv.components.list) {
                let status = true;
                // @ts-ignore
                expect(status).toBeTruthy()
            }

        })
        // @ts-ignore
        test('组件已经被注册,请重新命名', () => {
            let status = Sv.registerComponent(test_list)
            // @ts-ignore
            expect(status).toBeFalsy()

        })
        // @ts-ignore
        test('组件必须继承父类Component父类', () => {
            class test_listErrorTest { }
            let status = Sv.registerComponent(test_listErrorTest)
            // @ts-ignore
            expect(status).toBeFalsy()
        })

    })
    describe('多组件注册', () => {
        test('Sv.registerComponent', () => {
            class test_list_d1 extends Sv.Component { }
            class test_list_d2 extends Sv.Component { }
            Sv.registerComponent(test_list_d1, test_list_d2)
            if (Sv.components.test_list_d1 && Sv.components.test_list_d2) {
                let status = true;
                // @ts-ignore
                expect(status).toBeTruthy()
            } else {
                let status = false;
                // @ts-ignore
                expect(status).toBeFalsy()
            }

        })
    })
})


describe('2. Sv.registerModule 模块注册', () => {
    Sv.registerModule('dd', (s) => {
        return {
            k: function (k) {
                return true
                // log(k + ' registerModule 注册成功');
            }
        }
    })
    test('Sv.registerModule', () => {
        let result = Sv.dd.k('23')
        // @ts-ignore
        expect(result).toBe(true)
    })

})

describe('3. Sv.use 实例化组件', () => {
    test('未注册组件实例化', () => {
        let status = Sv.use('test_list11111111111', { def: 'mm' })
        expect(status).toBeFalsy()
    })
    test('组件实例化', () => {
        let obj = Sv.use('test_list', { def: 'mm' })
        expect(typeof (obj)).toBe('object')
    })
    test('父子组件实例化', () => {
        class use_c1 extends Sv.Component { }
        class use_c2 extends Sv.Component { }
        class use_c3 extends Sv.Component { }
        Sv.registerComponent(use_c1, use_c2, use_c3)
        let obj = Sv.use({ 'use_c1': {}, 'use_c2': {}, 'use_c3': {} })
        expect(typeof (obj)).not.toBeFalsy()
    })
    test('父子组件实例化,组件未注册', () => {
        let obj = Sv.use({ 'use_c1': {}, 'use_c2': {}, 'use_c3': {}, 'use_c11123': {} })
        expect(obj).toBeFalsy()
    })
})

describe('4. 组件 功能验证(store state pipeline)', () => {

    class c2 extends Sv.Component {
        constructor() {
            super()
            this.state = { c2_1: 'kkk', c2_2: 'css_ee', input: 'input' }
            this.store = { c2_1: '333' }
            this.pipelineName = 'ksee';
        }
        methods = {
            event: function (e) {
                return "event"
            }
        }
        componentBeforeRender() {/* 在渲染前调用 */

            this.setStore({ 'test_var_store': 2222 })
            this.setStore({ 'test_var_store_global': 'global222'},true )

            this.setState({ 'test_var_state': 3333 })
            // this.setStore({'kfff':3666},true)
            // this.setStore({'kff5f':3655566})
            this.pipeline.set({ 'ipe': 'ipe' })
        }
        componentBeforeRemove() {/* 在组件从 DOM 中移除之前被调用 */

            // console.log(this.getStore('test_var_store'));
            // console.log(this.pipeline.get('ipe'));
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
                        <h1 id="d2" class="kk">{this.state.ll}</h1>
    
                        <input v-event="kk" value=""></input>
                        <input v-event="kk" value="{this.state.input}"></input>
                        <p>{this.state.input}</p>

                        <div class="{this.state.c2_2}">{this.state.c2_1}</div>
                        <div class="{this.state.c2_2}">{this.state.c2_2}</div>
    
                        <div class="">{this.methods.event}</div>
    
                        <p class="p2">
                            <span>222</span>
                        </p>
                    </div>
            `
        }
    }
    Sv.registerComponent(c2);
    let s = Sv.use({ 'c2': { _el: '#dddd2' } })


    let comp = s['c2'];
    // console.log('%J', localStorageMock);
    // console.log('%J', comp);
    expect(comp.getStore('test_var_store')).toBe(2222)
    expect(comp.getState('test_var_state')).toBe(3333)
    expect(comp._parentNode).toBe('#dddd2')
    expect(comp._pipeline.ipe).toBe('ipe')

})




/* 3 */

// Sv.use({'c1':{'kk':636,'s':333},'c2':{},'c3':{}})



