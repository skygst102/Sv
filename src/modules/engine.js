

function engineStringToFn(tpl, args, param, debug, type) {
    var regExp = {
        arg: /\$\{([^#]+?)\}/g,
        fn: /\{\{([\s\S]+?)\}\}/g,
        empty: /\^$\{\}/g
    }

    if (type == 'fn') {
        var complied = function (str, param) {
            var tpl = str.replace(/[\r\t\n]/g, '')
                .replace(regExp.empty, '').replace(/\s{2}/g, '')
                .replace(regExp.fn, function (match, value) {
                    return "\n" + value + "\n";
                })
                .replace(/this/g, '_this')
                .replace(regExp.arg, function (match, value) {
                    return "'+ (" + value + ") +'"
                })
            tpl = tpl.match(/\{(.+?)\}$/g)[0];
            if (debug == 'tpl') { console.log(tpl) }
            return new Function(param, tpl);
        }
    } else {
        var complied = function (str, param) {
            var tpl = str.replace(/[\r\t\n]/g, '').replace(/'/g, '"')
                .replace(regExp.empty, '')
                .replace(regExp.fn, function (match, value) {
                    return "';\n" + value + "\ntpl+='";
                })
                .replace(/this/g, '_this')
                .replace(regExp.arg, function (match, value) {
                    return "'+ Sv.escape(" + value + ") +'"
                })
                .replace(/<%([\s\S]+?)%>/g, function (match, value) {
                    return "';\n" + value + "\n'";
                })
            tpl = "tpl='" + tpl + "';";
            tpl = 'var tpl="";\n' + tpl + '\nreturn tpl;';
            if (debug == 'tpl') { console.log(tpl) }
            return new Function(param, tpl);
        }
    }

    var engine = function (tpl, args, param) {
        var fn = complied(tpl, param)
        if (debug == 'fn') { console.log(fn) }
        if (args instanceof Array) {
            return fn.apply(null, args)
        } else {
            return fn(args);
        }
    }
    function escape(html) {
        var rules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;", "\\": "", };
        return html !== 0 ? String(html).replace(/[&<>'\/\\]/g, function (m) {
            return rules[m] || m;
        }) : "0";
    }
    param ? param = param : param = '_this';
    return engine(tpl, args, param);
}