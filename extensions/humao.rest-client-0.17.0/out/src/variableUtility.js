'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const Constants = require("./constants");
class VariableUtility {
    static isVariableDefinition(document, position) {
        let wordRange = document.getWordRangeAtPosition(position);
        let lineRange = document.lineAt(position);
        if (!wordRange
            || wordRange.start.character < 1
            || lineRange.text[wordRange.start.character - 1] !== '@') {
            // not a custom variable definition syntax
            return false;
        }
        return true;
    }
    static isVariableReference(document, position) {
        let wordRange = document.getWordRangeAtPosition(position);
        let lineRange = document.lineAt(position);
        if (!wordRange
            || wordRange.start.character < 2
            || wordRange.end.character > lineRange.range.end.character - 1
            || lineRange.text[wordRange.start.character - 1] !== '{'
            || lineRange.text[wordRange.start.character - 2] !== '{'
            || lineRange.text[wordRange.end.character] !== '}'
            || lineRange.text[wordRange.end.character + 1] !== '}') {
            // not a custom variable reference syntax
            return false;
        }
        return true;
    }
    static getDefinitionRanges(lines, variable) {
        let locations = [];
        for (const [index, line] of lines.entries()) {
            let match;
            if ((match = Constants.VariableDefinitionRegex.exec(line)) && match[1] === variable) {
                let startPos = line.indexOf(`@${variable}`);
                let endPos = startPos + variable.length + 1;
                locations.push(new vscode_1.Range(index, startPos, index, endPos));
            }
        }
        ;
        return locations;
    }
    static getReferenceRanges(lines, variable) {
        let locations = [];
        for (const [index, line] of lines.entries()) {
            if (Constants.CommentIdentifiersRegex.test(line)) {
                continue;
            }
            let regex = new RegExp(`\{\{${variable}\}\}`, 'g');
            let match;
            while (match = regex.exec(line)) {
                let startPos = match.index + 2;
                let endPos = startPos + variable.length;
                locations.push(new vscode_1.Range(index, startPos, index, endPos));
                regex.lastIndex = match.index + 1;
            }
        }
        ;
        return locations;
    }
}
exports.VariableUtility = VariableUtility;
//# sourceMappingURL=variableUtility.js.map