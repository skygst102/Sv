export function isFunction (obj){
    // In some browsers, typeof returns "function" for HTML <object> elements
    // (i.e., `typeof document.createElement( "object" ) === "function"`).
    // We don't want to classify *any* DOM node as a function.
    return typeof obj === "function" && typeof obj.nodeType !== "number";
}
export function isArray (obj){
    return obj instanceof Array;
}
export function isString (obj){

    return typeof obj==='string';
}
export function isObject (obj){
    return typeof obj==='object';
}
