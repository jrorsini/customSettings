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
const Constants = require("./constants");
const variableUtility_1 = require("./variableUtility");
class CustomVariableReferencesCodeLensProvider {
    provideCodeLenses(document, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let blocks = [];
            let lines = document.getText().split(/\r?\n/g);
            let delimitedLines = selector_1.Selector.getDelimiterRows(lines);
            delimitedLines.push(lines.length);
            let requestRange = [];
            let start = 0;
            for (const current of delimitedLines) {
                let end = current - 1;
                if (start <= end) {
                    requestRange.push([start, end]);
                    start = current + 1;
                }
            }
            for (const range of requestRange) {
                let [blockStart, blockEnd] = range;
                while (blockStart <= blockEnd) {
                    if (selector_1.Selector.isVariableDefinitionLine(lines[blockStart])) {
                        const range = new vscode_1.Range(blockStart, 0, blockEnd, 0);
                        const line = lines[blockStart];
                        let match;
                        if (match = Constants.VariableDefinitionRegex.exec(line)) {
                            const variableName = match[1];
                            const locations = variableUtility_1.VariableUtility.getReferenceRanges(lines, variableName);
                            const cmd = {
                                arguments: [document.uri, range.start, locations.map(loc => new vscode_1.Location(document.uri, loc))],
                                title: locations.length === 1 ? '1 reference' : `${locations.length} references`,
                                command: locations.length ? 'editor.action.showReferences' : '',
                            };
                            blocks.push(new vscode_1.CodeLens(range, cmd));
                        }
                        blockStart++;
                    }
                    else {
                        break;
                    }
                }
            }
            return blocks;
        });
    }
}
exports.CustomVariableReferencesCodeLensProvider = CustomVariableReferencesCodeLensProvider;
//# sourceMappingURL=customVariableReferencesCodeLensProvider.js.map