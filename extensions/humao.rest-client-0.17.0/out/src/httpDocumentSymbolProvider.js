'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const selector_1 = require("./selector");
const workspaceUtility_1 = require("./workspaceUtility");
const requestParserFactory_1 = require("./models/requestParserFactory");
const variableProcessor_1 = require("./variableProcessor");
const arrayUtility_1 = require("./common/arrayUtility");
const url = require("url");
const os_1 = require("os");
class HttpDocumentSymbolProvider {
    provideDocumentSymbols(document, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let symbols = [];
            let lines = document.getText().split(/\r?\n/g);
            let delimitedLines = selector_1.Selector.getDelimiterRows(lines);
            delimitedLines.push(lines.length);
            let requestRange = [];
            let start = 0;
            for (let index = 0; index < delimitedLines.length; index++) {
                let end = delimitedLines[index] - 1;
                while (start < end) {
                    let line = lines[end];
                    if (selector_1.Selector.isEmptyLine(line) || selector_1.Selector.isCommentLine(line)) {
                        end--;
                    }
                    else {
                        break;
                    }
                }
                if (start <= end) {
                    requestRange.push([start, end]);
                    start = delimitedLines[index] + 1;
                }
            }
            for (let index = 0; index < requestRange.length; index++) {
                let [blockStart, blockEnd] = requestRange[index];
                // get real start for current requestRange
                while (blockStart <= blockEnd) {
                    let line = lines[blockStart];
                    if (selector_1.Selector.isEmptyLine(line) ||
                        selector_1.Selector.isCommentLine(line)) {
                        blockStart++;
                    }
                    else if (selector_1.Selector.isVariableDefinitionLine(line)) {
                        let [name, container] = this.getVariableSymbolInfo(line);
                        symbols.push(new vscode_1.SymbolInformation(name, vscode_1.SymbolKind.Variable, container, new vscode_1.Location(document.uri, new vscode_1.Range(blockStart, 0, blockStart, line.length))));
                        blockStart++;
                    }
                    else {
                        break;
                    }
                }
                if (selector_1.Selector.isResponseStatusLine(lines[blockStart])) {
                    continue;
                }
                if (blockStart <= blockEnd) {
                    let text = yield variableProcessor_1.VariableProcessor.processRawRequest(this.getRequestLines(lines.slice(blockStart, blockEnd + 1)).join(os_1.EOL));
                    let [name, container] = this.getRequestSymbolInfo(text);
                    symbols.push(new vscode_1.SymbolInformation(name, vscode_1.SymbolKind.Method, container, new vscode_1.Location(document.uri, new vscode_1.Range(blockStart, 0, blockEnd, 0))));
                }
            }
            return symbols;
        });
    }
    getVariableSymbolInfo(line) {
        let fileName = workspaceUtility_1.getCurrentHttpFileName();
        line = line.trim();
        return [line.substring(1, line.indexOf('=')).trim(), fileName];
    }
    getRequestSymbolInfo(text) {
        let parser = HttpDocumentSymbolProvider.requestParserFactory.createRequestParser(text);
        let request = parser.parseHttpRequest(text, vscode_1.window.activeTextEditor.document.fileName);
        let parsedUrl = url.parse(request.url);
        return [`${request.method} ${parsedUrl.path}`, parsedUrl.host];
    }
    getRequestLines(lines) {
        if (lines.length <= 1) {
            return lines;
        }
        let end = arrayUtility_1.ArrayUtility.firstIndexOf(lines, val => val.trim()[0] !== '?' && val.trim()[0] !== '&', 1);
        return lines.slice(0, end);
    }
}
HttpDocumentSymbolProvider.requestParserFactory = new requestParserFactory_1.RequestParserFactory();
exports.HttpDocumentSymbolProvider = HttpDocumentSymbolProvider;
//# sourceMappingURL=httpDocumentSymbolProvider.js.map