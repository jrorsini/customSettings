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
const variableProcessor_1 = require("./variableProcessor");
const vscode_1 = require("vscode");
class VariableDiagnosticsProvider {
    activate(subscriptions) {
        this.diagnosticCollection = vscode_1.languages.createDiagnosticCollection();
        vscode_1.workspace.onDidOpenTextDocument(this.checkVariables, this, subscriptions);
        vscode_1.workspace.onDidCloseTextDocument((textDocument) => {
            this.diagnosticCollection.delete(textDocument.uri);
        }, null, subscriptions);
        vscode_1.workspace.onDidSaveTextDocument(this.checkVariables, this, subscriptions);
        // Check all open documents
        vscode_1.workspace.textDocuments.forEach(this.checkVariables, this);
    }
    dispose() {
        this.diagnosticCollection.clear();
        this.diagnosticCollection.dispose();
    }
    checkVariables(document) {
        return __awaiter(this, void 0, void 0, function* () {
            if (document.languageId !== 'http') {
                return;
            }
            let diagnostics = [];
            let vars = this.findVariables(document);
            let varNames = vars.map((v) => v.variableName.split(".")[0].split("[")[0]);
            // Distinct varNames
            varNames = Array.from(new Set(varNames));
            let existArray = yield variableProcessor_1.VariableProcessor.checkVariableDefinitionExists(document, varNames);
            existArray.forEach((ea) => {
                if (!ea.exists) {
                    vars.forEach((v) => {
                        if (v.variableName == ea.name) {
                            diagnostics.push({
                                severity: vscode_1.DiagnosticSeverity.Error,
                                range: new vscode_1.Range(new vscode_1.Position(v.lineNumber, v.startIndex), new vscode_1.Position(v.lineNumber, v.endIndex)),
                                message: `${v.variableName} is not loaded in memory`,
                                source: 'ex',
                                code: "10",
                            });
                        }
                    });
                }
            });
            this.diagnosticCollection.set(document.uri, diagnostics);
        });
    }
    findVariables(document) {
        let vars = [];
        let lines = document.getText().split(/\r?\n/g);
        let pattern = /\{\{(\w+)(\.\w+|\[\d+\])*\}\}/;
        lines.forEach((line, i) => {
            let match;
            let currentIndex = 0;
            while (match = pattern.exec(line)) {
                let variableName = match[1];
                let startIndex = match.index + 2;
                let endIndex = startIndex + variableName.length;
                vars.push(new Variable(variableName, currentIndex + startIndex, currentIndex + endIndex, i));
                line = line.substring(endIndex + 2);
                currentIndex += endIndex + 2;
            }
        });
        return vars;
    }
}
exports.VariableDiagnosticsProvider = VariableDiagnosticsProvider;
class Variable {
    constructor(variableName, startIndex, endIndex, lineNumber) {
        this.variableName = variableName;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.lineNumber = lineNumber;
    }
}
//# sourceMappingURL=variableDiagnosticsProvider.js.map