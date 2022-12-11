// @ts-nocheck
'use strict';

function dom(selector, context, index) {
    return new dom.prototype.init(selector, context, index);
};
dom.prototype.init = function (selector, context, index) {
    this.index = index || null;
    this.context = context || document;
    if (selector && selector.nodeType) {
        this[0] = selector;
        this.length = 1;
        return this;
    } else if (typeof(selector) == 'string') {
        this.selector = selector;
        dom.nodeList = this.context.querySelectorAll(selector);
        this.length = dom.nodeList.length;
        for (var i = 0; i < this.length; i++) {
            this[i] = dom.nodeList[i];
        }
    } else {
        return this;
    }
};
dom.fn = dom.prototype.init.prototype = {};
dom.fnExtend = function (source) {
    for (var key in source) {
        if (!dom.fn.hasOwnProperty(key)) {
            dom.fn[key] = source[key];
        } else {
            throw 'dom.fnExtend (' + key + ') already exist'
        }
    }
};
dom.extend = function (source) {
    for (var key in source) {
        if (!dom.hasOwnProperty(key)) {
            dom[key] = source[key];
        } else {
            throw 'dom.extend (' + key + ') already exist'
        }
    }
};
dom.plug = function (name, fn) {
    fn(dom);
}
function addEvent(element, type, selector, callback) {
    var fn = function (event) {
        var targetEl = document.querySelector(selector);
        if (selector) {
            var event = event || window.event;
            var target = event.target || event.srcElement;
            if (target == targetEl) callback();
        } else {
            callback();
        }
    }
    element.addEventListener(type, function (event) {
        fn(event)
    }, false)
}

function removeEvent(element, type, callback) {
    element.removeEventListener(type, callback, false);
};
//其它
dom.extend({
    ready: function (callback) {
        addEvent(document, 'DOMContentLoaded', null, callback)
    },
    load: function (callback) {
        addEvent(window, 'load', null, callback)
    },
    loadcss: function (str) {
        var x = document.getElementsByTagName('head')[0];
        if (x.getElementsByTagName('style')[0]) {
            var style = x.getElementsByTagName('style')[0];
            style.innerHTML += str;
        } else {
            var s = document.createElement('style');
            s.type = "text/css";
            s.innerHTML = str;
            x.appendChild(s);
        }
    },
    loadjs: function (src) {
        var x = document.getElementsByTagName('head')[0];
        if (src instanceof Array) {
            for (var i = 0; i < src.length; i++) {
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = src[i];
                x.appendChild(s);
            }
        }
    },
    typeof: function (o, type) {
        var otype;
        o !== null ? otype = Object.prototype.toString.call(o).match(/\s(.*)\]dom/)[1] : otype = 'Null'
        type ? otype = (otype == type) : false;
        return otype
    },
    each: function (obj, fn) {
        if (dom.typeof(obj, 'Object')) {
            for (var key in obj) fn.call(obj, obj[key], i, obj);
        } else if (obj.length) {
            for (var i = 0; i < obj.length; i++) {
                var rFn = fn.call(obj, obj[i], i, obj);
                if (rFn === false || i == 1000) break;
                if (rFn === true || i == 1000) continue;
            }
        }
    },

});
//dom操作
dom.fnExtend({
    eq: function (i) {
        return dom(this[i], this.selector, i)
    },
    filter: function (e) {
        return dom(e, this[0], 0)
    },
    css: function (attr, value) {
        var style = '';
        if (typeof attr == 'object') {
            for (var i in attr) {
                style += (i + ':' + attr[i] + ';');
            }
            this[0].style.cssText = style;
        } else if (value == null) {
            if (this.currentStyle) {
                return this[0].currentStyle[attr];
            } else {
                return getComputedStyle(this[0], false)[attr];
            }
        } else {
            this[0].style[attr] = value;
        };
        return this;
    },
    addClass: function () {
        var classValue = this[0].getAttribute("class");
        if (!classValue) { classValue = ''; }
        for (var i = 0; i < arguments.length; i++) {
            classValue += " " + arguments[i];
        }
        this[0].setAttribute("class", classValue);
        return this;
    },
    removeClass: function () {
        var classValue = this[0].getAttribute("class");
        var remove = '';
        if (classValue) {
            for (var i = 0; i < arguments.length; i++) {
                remove += " " + arguments[i];
            };
            var newclassValue = classValue.replace(remove, " ");
            this[0].setAttribute("class", newclassValue);
        }
        return this;
    },
    attr: function (attr, value) {
        if (value != null) {
            this[0].setAttribute(attr, value);
            return this;
        } else { return this[0].getAttribute(attr) }
    },
    removeAttr: function (attr) {
        this[0].removeAttribute(attr);
    },
    //nodes
    parent: function () {
        this[0] = this[0].parentNode;
        return this;
    },
    next: function () {
        this[0] = this[0].nextSibling;
        while (this[0].nodeType == 3) {
            this[0] = this[0].nextSibling;
        }
        return this;
    },
    prev: function () {
        this[0] = this[0].previousSibling;
        while (this[0].nodeType == 3) {
            this[0] = this[0].previousSibling;
        }
        return this;
    },
    siblings: function () {
        var el = this[0], parentNode = this[0].parentNode;
        for (var i = 0; i < parentNode.children.length; i++) {
            if (el != parentNode.children[i]) { this[i] = parentNode.children[i] }
        }
        return this;
    },
    children: function () {
        var children = this[0].children;
        for (var i = 0; i < children.length; i++) {
            this[i] = children[i]
        }
        return this;
    },
    clone: function (tf) {
        if (tf === false) {
            return this[0].cloneNode(false)
        } else { return this[0].cloneNode(true) }
    },
    append: function (child) {
        if (typeof child == 'string') {
            this[0].innerHTML += child;
            return this;
        } else if (child.nodeName) {
            this[0].appendChild(child);
        } else if (child[0].nodeName) {
            this[0].appendChild(child[0]);
        }
        this[0] = this[0].lastChild;
        return this;
    },
    before: function (child) {
        if (child.nodeName) {
            this[0].parentNode.insertBefore(child, this[0]);
        } else if (child[0].nodeName) {
            var cloneNode = child[0].cloneNode(true);
            this[0].parentNode.insertBefore(cloneNode, this[0]);
        }
        return this.prev();
    },
    replace: function (child) {
        if (child.nodeName) {
            this[0].parentNode.replaceChild(child, this[0]);
        } else if (child[0].nodeName) {
            var cloneNode = child[0].cloneNode(true);
            this[0].parentNode.replaceChild(cloneNode, this[0]);
        }
        return this;
    },
    remove: function (child) {
        this[0].parentNode.removeChild(this[0]);
        return this;
    },
    hide: function (el) {
        this[0].style.display = 'none';
        return this;
    },
    show: function (el) {
        this[0].style.display = 'block';
        return this;
    },
    height: function (inner) {//The default visual area size
        (inner == 'inner') ? inner = this[0].clientHeight : inner = this[0].offsetHeight;
        return inner;
    },
    width: function (inner) {
        (inner == 'inner') ? inner = this[0].clientWidth : inner = this[0].offsetWidth;
        return inner;
    },
    trigger: function (eventType, eventData) {
        this.dispatchEvent(new CustomEvent(eventType, {
            detail: eventData,
            bubbles: true,
            cancelable: true
        }));
        return this;
    },
    css: function (property) {
        var styles = this.ownerDocument.defaultView.getComputedStyle(this, null);
        if (property) {
            return styles.getPropertyValue(property) || styles[property];
        }
        return styles;
    },
    trim: function () {
        this.innerText.replace(/^\s|\r|\n/, '').replace(/\s|\r|\ndom/, '');
    },
});

//事件
dom.fnExtend({
    addEvent: function (type, selector, callback) {
        addEvent(this, type, selector, callback);
        return this;
    },
    removeEvent: function (type, fnName) {
        removeEvent(this, type, fnName);
        return this;
    },
    getEvent: function (event) {
        return event || window.event;
    },
    getTarget: function (event) {
        return event.target || event.srcElement;
    },
    stopPropagation: function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    preventDefault: function (event) {
        if (event.prevenDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    click: function (callback) {
        addEvent('click', this, callback)
    },
    on: function (events, selector, callback) {
        var events = events.split(/\s/);
        if (typeof selector == 'function') {
            for (var key in events) {
                addEvent(this[0], events[key], null, selector)
            }
        } else {
            for (var key in events) {
                addEvent(this[0], events[key], selector, data)
            }
        }

        return this;
    }

});

