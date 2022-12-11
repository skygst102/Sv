import { Exception } from "./Exception";

class componentStore {
    constructor(props) {
        this.current = props.current
        this.props = props
    }
    set(o,pipelineName) {
        if (pipelineName) {
            let pipeline = this.current.localStorage.getItem(this.props._pipelineSign);
            let obj=JSON.parse(pipeline);
            if (!obj[pipelineName]) {
                obj[pipelineName]={};
            }
            let store=obj[pipelineName];
            Object.assign(store,o);
            Object.assign(obj,{[pipelineName] : store});
            this.current.localStorage.setItem(this.props._pipelineSign,JSON.stringify(obj));
            return obj;
        } else {
            let store = this.current.localStorage.getItem(this.props._global_store_sign);
            let storeObj = JSON.parse(store)||{};
            Object.assign(storeObj, o)
            this.current.localStorage.setItem(this.props._global_store_sign,JSON.stringify(storeObj));
            return this.current.localStorage[this.props._global_store_sign];
        }

    }
    get(key,pipelineName) {
        let store;
        if (pipelineName) {
            let pipeline = this.current.localStorage.getItem(this.props._pipelineSign);
            let obj=JSON.parse(pipeline);
            store=obj[pipelineName];

        } else {
            store = this.current.localStorage.getItem(this.props._global_store_sign);
        }

        let storeObj = typeof(store)==='string' ? JSON.parse(store) : store;
        return storeObj[key];
    }
    init(o){
        this.current.localStorage.setItem(this.props._global_store_sign, '{}');
        this.current.localStorage.setItem(this.props._pipelineSign, '{}');
    }
}

export { componentStore }