class _Exception {
    constructor(props) {
        this.current=props.current
        this.color={
            'error':'color:red',
            'warn' : ''
        };
    }
    error(msg){
        if (this.current===window) {
            console.error('%c'+msg,this.color.error)
        } else {

        }
    }
    warn(msg){
        if (this.current===window) {
            console.warn('%c'+msg,this.color.warn)
        } else {

        }
    }
    
}
const Exception=new _Exception({'current':window})
export {Exception}