"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const parser = require("emmet/lib/parser/abbreviation");
const prettier = require("prettier");
const find = (text, regex) => {
    const result = regex.exec(text);
    if (result) {
        const match = result[0];
        const start = result.index;
        const end = start + match.length;
        return { match, start, end };
    }
    else {
        return { match: '', start: 0, end: 0 };
    }
};
/**
 * Extract abbreviation from a line of text (assume cursor at end)
 */
function extract(line, cursorPos) {
    const before = line.substring(0, cursorPos);
    const after = line.substring(cursorPos, line.length);
    const ABBR_BEFORE = /((({[^{}]+})|(\[[^\[\]]+\])|[\w\.\*\>\+\-#]+)+({[^\{\}]*)?)$/;
    const ABBR_AFTER = /^(([^\{\}]*})?(({[^{}]+})|(\[[^\[\]]+\])|([\w\.\*\>\+\-#]+))+)/;
    const { match: abbrBefore, start: startBefore, end: endBefore } = find(before, ABBR_BEFORE);
    const { match: abbrAfter, start: startAfter, end: endAfter } = find(after, ABBR_AFTER);
    return {
        abbr: abbrBefore + abbrAfter,
        abbrStart: startBefore,
        abbrEnd: before.length + endAfter,
    };
}
exports.extract = extract;
const toOtherAttrString = (attrs) => {
    const otherAttrs = attrs.filter(attr => !/^(class|id)$/.test(attr.name));
    return otherAttrs.length
        ? JSON.stringify(otherAttrs.reduce((o, { name, value }) => {
            o[name] = value;
            return o;
        }, {}))
        : '';
};
const toClassString = (attrs) => {
    const classAttr = attrs.find(attr => attr.name === 'class');
    return classAttr == null
        ? ''
        : classAttr.value
            .split(' ')
            .map(s => `.${s}`)
            .join('');
};
const toIdString = (attrs) => {
    const idAttr = attrs.find(attr => attr.name === 'id');
    return idAttr == null ? '' : `#${idAttr.value}`;
};
const toChildrenString = (children, content, options) => {
    return children.length === 0
        ? content === '' ? '' : JSON.stringify(content)
        : '[' + children.map(c => expandNode(c, options)).join(',') + ']';
};
const expandNode = (node, options) => {
    const name = !options.outputDefaultTagName && node.name() === 'div' ? '' : node.name();
    const content = node.content;
    const attrs = node.attributeList() || [];
    const classStr = toClassString(attrs);
    const id = toIdString(attrs);
    const otherAttr = toOtherAttrString(attrs);
    const children = toChildrenString(node.children || [], content, options);
    const isComponent = /^[A-Z]/.test(name);
    const selectorStr = isComponent
        ? name
        : "'" + [name, id, classStr].filter(s => s !== '').join('') + "'";
    const bodyStr = [selectorStr, otherAttr, children]
        .filter(s => s !== '')
        .join(',');
    return `${options.vnodeFactoryFunctionName}(${bodyStr})`;
};
function expand(abbr, { vnodeFactoryFunctionName = 'm', outputDefaultTagName = false, prettierConfig, } = {}) {
    const root = parser.parse(abbr, { syntax: 'html' });
    const expanded = (root.children || [])
        .map(node => expandNode(node, {
        vnodeFactoryFunctionName,
        outputDefaultTagName,
    }))
        .join(',');
    let formatted;
    try {
        formatted = prettier.format(expanded, prettierConfig);
    }
    catch (error) {
        // console.error('[mithril-emmet]', error)
        formatted = expanded;
    }
    return formatted;
}
exports.expand = expand;
//# sourceMappingURL=expander.js.map