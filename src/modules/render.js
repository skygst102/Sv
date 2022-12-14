import { Exception } from "./Exception";
//指令
function directive(dom, content, arr, compObj) {
    let input = {
        event: 'oninput',
    };
    if (dom.tagName == 'input' || dom.tagName == 'textarea') {
        input.event = input.event.replace(/^(on)/g, '');
        dom.el.addEventListener(input.event, function () {
            if (arr[0] === 'state') {
                compObj.setState({ [arr[1]]: dom.el.value });
            }
        }, false)
    }
}
/* 绑定的state 信息 */
function parallelism(keyName, compObj, tagName, id, type, key, value, parallelism_flash) {
    let vo = {
        tagName: tagName,
        id: id,
        type: type,
        key: type === 'text' ? '' : key,
        value: value,
    }

    let parallelism = compObj.parallelism[keyName];
    let parallelism_f = parallelism_flash[keyName];
    if (!parallelism && !parallelism_f) {
        compObj.parallelism[keyName] = [vo];
        parallelism_flash[keyName] = [JSON.stringify(vo)]
    } else {
        if (parallelism_f.indexOf(JSON.stringify(vo)) == -1) {
            parallelism.push(vo);
            parallelism_f.push(JSON.stringify(vo));
        }
    }
    return vo;
}
// =============================
// 解析{...}
//
//==============================
function analysis(dom, compObj, type, attr, value, status, parallelism_flash, temIdentifying_select, temIdentifying_replace) {
    let content;
    let temp = value.match(temIdentifying_select);
    if (temp) {
        temp.forEach((key, i, self) => {
            let cobjv;
            let text;
            let arr = key.replace(temIdentifying_replace, '').replace(/this\./g, '').split('.');
            if (arr.length == 1) {
                cobjv = compObj[arr[0]];
            }
            if (arr.length == 2) {
                cobjv = compObj[arr[0]][arr[1]];
            }
            if (arr.length == 3) {
                cobjv = compObj[arr[0]][arr[1]][arr[2]];
            }
            if (arr.length == 4) {
                cobjv = compObj[arr[0]][arr[1]][arr[2]][arr[3]];
            }
            if (typeof (cobjv) == 'function') {
                let res = cobjv();
                if (typeof (res) === 'string') {
                    text = res;
                } else {
                    Exception.error(key + ' 返回值不是string类型')
                }
            }
            if (typeof (cobjv) == 'string') {
                text = cobjv;
            }
            if (self.length > 1 && content) {
                content = content.replace(key, text);
            } else {
                content = value.replace(key, text);
            }
            if (status) {
                if (arr[0] === 'state') {
                    let keyName = arr.join('_');
                    parallelism(keyName, compObj, dom.tagName, dom.id, type, attr, value, parallelism_flash);
                }
                // directive
                let one = true;
                if (directive && one) {
                    let result = directive(dom, content, arr, compObj);
                    typeof (result) === 'string' ? content = result : null;
                    one = false
                }
            }
        });
    } else {
        content = value;
    }
    return content;
}
function createElement(vdom, compObj, temIdentifying_select, temIdentifying_replace, parallelism_flash, orderPrefix) {
    let parentNode = null;
    vdom.forEach((key, i) => {
        let dom = {
            el: document.createElement(key.tagName),
            id: key.id,
            pid: key.pid,
            tagName: key.tagName,
            text: key.props.text,
            attributes: key.props.attributes,
        }
        let sty = JSON.stringify(key.props.style).replace(/\{|\}|"|\'/g, '') || '';

        dom.el.setAttribute('data-sv_sign_id', dom.id);

        if (dom.attributes.style) {
            dom.attributes["style"] += ';' + sty;
        } else if (sty) {
            dom.attributes["style"] = sty;
        }

        if (dom.text) {
            if (temIdentifying_select.test(dom.text)) {
                let text = analysis(dom, compObj, 'text', '', dom.text, true, parallelism_flash, temIdentifying_select, temIdentifying_replace);
                dom.el.innerText = text
            } else {
                dom.el.innerText = dom.text
            }
        }

        if (JSON.stringify(dom.attributes) !== '{}') {
            for (const key in dom.attributes) {
                let attr;
                if (temIdentifying_select.test(dom.attributes[key])) {
                    attr = analysis(dom, compObj, 'attribute', key, dom.attributes[key], true, parallelism_flash, temIdentifying_select, temIdentifying_replace);

                } else {
                    attr = dom.attributes[key];
                }
                if (!orderPrefix.test(key)) {
                    dom.el.setAttribute(key, attr)
                }
            }
        }
        if (!parentNode) {
            parentNode = dom.el;
        } else {
            if (dom.pid === 1) {
                parentNode.appendChild(dom.el);
            } else {
                parentNode.querySelector('[data-sv_sign_id="' + dom.pid + '"]').appendChild(dom.el);
            }
        }
    });
    return parentNode;
}

function render(vdom, compObj, config, _analysis) {
    let parentNode = null;
    let orderPrefix = /^(v-)/gi;
    let parallelism_flash = {};
    let temIdentifying_select = /\{(.+?)\}/g;
    let temIdentifying_replace = /\{|\}/g;

    if (config.template === '{{}}') {
        temIdentifying_select = new RegExp(/^\{\{.+\}\}$/g);
        temIdentifying_replace = new RegExp(/^\{\{|\}\}$/g);
    }
    if (config.orderPrefix) {
        orderPrefix = new RegExp('^(' + config.orderPrefix + ')', 'gi');
    }
    if (typeof (_analysis) === 'object') {
        return analysis('', compObj, '', _analysis.key, _analysis.value, false, parallelism_flash, temIdentifying_select, temIdentifying_replace)
    }
    parentNode = createElement(vdom, compObj, temIdentifying_select, temIdentifying_replace, parallelism_flash, orderPrefix)
    return parentNode;
}

export { render }