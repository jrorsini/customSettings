"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const expander_1 = require("./lib/expander");
const handleExpand = () => __awaiter(this, void 0, void 0, function* () {
    try {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const document = editor.document;
        const selection = editor.selection;
        const curCursor = selection.active;
        const curLine = document.lineAt(curCursor.line).text;
        const config = (() => {
            const { tabSize, insertSpaces } = editor.options;
            const { vnodeFactoryFunctionName, outputDefaultTagName, } = vscode.workspace.getConfiguration('mithrilEmmet');
            const tab = insertSpaces ? ' '.repeat(tabSize) : '\t';
            return {
                tab,
                vnodeFactoryFunctionName,
                outputDefaultTagName,
            };
        })();
        const indentLevel = (() => {
            const tabsAtStart = new RegExp(`^(${config.tab})*`);
            const match = tabsAtStart.exec(curLine);
            return match ? match[0].length / config.tab.length : 0;
        })();
        const { abbr, abbrStart, abbrEnd } = expander_1.extract(curLine, curCursor.character);
        if (abbr === '') {
            return vscode.window.showInformationMessage('[mithril-emmet] Nothing to expand');
        }
        const expanded = expander_1.expand(abbr, Object.assign({}, config, { indentLevel }));
        const TABSTOP = /\${[^{}]+}/g;
        const containsTapstop = TABSTOP.test(expanded);
        if (!containsTapstop) {
            yield editor.edit(edit => {
                // edit.replace() doesn't work well here, it messes up cursor position/selection
                edit.delete(new vscode.Range(curCursor.line, abbrStart, curCursor.line, abbrEnd));
                edit.insert(new vscode.Position(curCursor.line, abbrStart), expanded);
            });
            const newCursor = selection.active;
            editor.revealRange(new vscode.Range(newCursor.line, abbrStart, newCursor.line, newCursor.character));
        }
        else {
            const supportInsertSnippet = typeof editor.insertSnippet === 'function';
            if (supportInsertSnippet) {
                const snippet = new vscode.SnippetString(expanded);
                yield editor.edit(edit => {
                    edit.delete(new vscode.Range(curCursor.line, abbrStart, curCursor.line, abbrEnd));
                });
                editor.insertSnippet(snippet, new vscode.Position(curCursor.line, abbrStart));
            }
            else {
                yield editor.edit(edit => {
                    edit.delete(new vscode.Range(curCursor.line, abbrStart, curCursor.line, abbrEnd));
                    edit.insert(new vscode.Position(curCursor.line, abbrStart), expanded.replace(TABSTOP, ''));
                });
                const cursor = selection.active; // current cursor position after edit
                editor.revealRange(new vscode.Range(curCursor.line, abbrStart, cursor.line, cursor.character));
            }
        }
    }
    catch (e) {
        console.error('[mithril-emmet]', e);
        vscode.window.showErrorMessage('[mithril-emmet] Failed to expand');
    }
});
exports.activate = (context) => {
    context.subscriptions.push(vscode.commands.registerCommand('mithrilEmmet.expand', handleExpand));
};
const noop = () => { };
//# sourceMappingURL=extension.js.map