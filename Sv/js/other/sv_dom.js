/**
 * author skygst
 * 
 */
'use strict';
(function (window, o, factory) {
    function $(selector, context, index) {
        return new $.prototype.init(selector, context, index);
    };
    $.prototype.init = function (selector, context, index) {
        this.index = index || null;
        this.context = context || document;
        if (selector && selector.nodeType) {
            this[0] = selector;
            this.length = 1;
            return this;
        } else if (typeof selector == 'string') {
            this.selector = selector || null;
            $.nodeList = this.context.querySelectorAll(selector);
            this.length = $.nodeList.length;
            for (var i = 0; i < this.length; i++) {
                this[i] = $.nodeList[i];
            }
        } else {
            return this;
        }
    };
    $.fn = $.prototype.init.prototype = {};
    $.fnExtend = function (source) {
        for (var key in source) {
            if (!$.fn.hasOwnProperty(key)) {
                $.fn[key] = source[key];
            } else {
                throw '$.fnExtend (' + key + ') already exist'
            }
        }
    };
    $.extend = function (source) {
        for (var key in source) {
            if (!$.hasOwnProperty(key)) {
                $[key] = source[key];
            } else {
                throw '$.extend (' + key + ') already exist'
            }
        }
    };
    $.plug = function (name, fn) {
        fn($);
    }
    window[o] = $;
    factory($);
})(this, '$', function ($) {
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
    $.extend({
        ready: function (callback) {
            addEvent(document, 'DOMContentLoaded', null, callback)
        },
        load: function (callback) {
            addEvent(window, 'load', null, callback)
        },
        typeof: function (o, type) {
            var otype;
            o !== null ? otype = Object.prototype.toString.call(o).match(/\s(.*)\]$/)[1] : otype = 'Null'
            type ? otype = (otype == type) : null;
            return otype
        },
        each: function (obj, fn) {
            if ($.typeof(obj, 'Object')) {
                for (var key in obj) fn.call(obj, obj[key], i, obj);
            } else if (obj.length) {
                for (var i = 0; i < obj.length; i++) {
                    var rFn = fn.call(obj, obj[i], i, obj);
                    if (rFn === false || i == 1000) break;
                    if (rFn === true || i == 1000) continue;
                }
            }
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
    });
    //dom操作
    $.fnExtend({
        eq: function (i) {
            return $(this[i], this.selector, i)
        },
        filter: function (e) {
            return $(e, this[0], 0)
        },
    });

    //事件
    $.fnExtend({
        addEvent: function (type, selector, callback) {
            addEvent(this, type, selector, callback);
            return this;
        },
        removeEvent: function (type, fnName) {
            removeEvent(this, type, fnName);
            return this;
        },

        on: function (events, selector, data, callback, one) {
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
            // if (typeof data=='function') {
            //TODO
            // }
            return this;
        },
        trigger: function (evt, name, xhr) {
            if (evt == "click" || evt == "blur" || evt == "focus")
                return evt();
            if (document.createEvent) {
                var e = document.createEvent('Events');
                evt[0].addEventListener('ajaxSuccess', $[name].apply(this, xhr))
                evt[0].dispatchEvent(e, e.initEvent('ajaxSuccess', true, true));
            }
        },
    });
});