
import { Sv, Component } from './modules/Sv.js'
// import { htmlToVnode } from './modules/vnode.js'
// import { render } from './modules/render.js'

class c1 extends Sv.Component {
    constructor(props) {
        super()
        this.state = { ll: '333',ks:'css_ee',input:'input' }
        this.store={st:23}
        this.props=props
    }

    componentAfterMount() { /* 在第一次渲染后调用 */

            console.log('watch  fn 2');

            console.log(this.getComponent('c1'));
            this.getComponent('c1').setState('ks','ssssss35f')

    }
    componentBeforeRender() {/* 在渲染前调用 */

        this.setStore({'kss':111111},true)

    }
    componentAfterUpdate() {/* 在组件完成更新后立即调用。在初始化时不会被调用 */
    }
    componentBeforeRemove() {/* 在组件从 DOM 中移除之前被调用 */

    }

    methods = {
        event: function (e) {
            return "event"
            // console.log('event');
        }
    }


}
class c2 extends Sv.Component {
    constructor() {
        super()
        this.state = { c2_1:'333',c2_2:'css_ee',input:'input' }
        this.store={ c2_1: '333'}
        // this.pipelineName='ksee';
    }
    methods = {
        event: function (e) {
            return "event"
        }
    }
    componentMount(){
        this.setStore({'kss2':2222},true)
        // this.setStore({'kfff':3666},true)
        this.setState({ c2_1:'333;;klkll','test_var_state': 'test_var_state','test_var_state2': 3333 })
    
    
        this.pipeline.set({'ipe':6655566})
    }
    componentBeforeRender() {/* 在渲染a调用 */
        // this.setState({ 'test_var_state': '3336445465','test_var_state2': 'test_var_state23333' })

    }
    componentAfterRender(){
        this.setState({ 'test_var_state': '3336445465','test_var_state2': 'test_var_state2111' })
    }

    template(){
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
        `
    }
}
class c3 extends Sv.Component {
    constructor() {
        super()
        this.state={}
        this.store={}
    }
}

Sv.registerComponent(c1,c2,c3)

let s=Sv.use({'c1':{_el:'#dddd2','kk':636,'s':333},'c2':{_el:'#dddd2'},'c3':{}})
// console.log(new c1());





