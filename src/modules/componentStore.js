import { Exception } from "./Exception";

class componentStore {
    constructor(props) {
        this.current = props.current
        this.props = props
    }
    set(o,sign) {
        if (sign) {
            let pipeline = this.current.localStorage.getItem(this.props._pipelineSign);
            let obj=JSON.parse(pipeline);
            if (!obj[sign]) {
                obj[sign]={};
            }
            let store=obj[sign];
            Object.assign(store,o);
            Object.assign(obj,{[sign] : store});
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
    get(key,sign) {
        let store;
        if (sign) {
            let pipeline = this.current.localStorage.getItem(this.props._pipelineSign);
            let obj=JSON.parse(pipeline);
            store=obj[sign];

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