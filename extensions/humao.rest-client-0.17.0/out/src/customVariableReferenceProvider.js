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
const variableUtility_1 = require("./variableUtility");
class CustomVariableReferenceProvider {
    provideReferences(document, position, context, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!variableUtility_1.VariableUtility.isVariableDefinition(document, position) && !variableUtility_1.VariableUtility.isVariableReference(document, position)) {
                return;
            }
            let documentLines = document.getText().split(/\r?\n/g);
            let wordRange = document.getWordRangeAtPosition(position);
            let selectedVariableName = document.getText(wordRange);
            let locations = [];
            if (context.includeDeclaration) {
                let definitionLocations = variableUtility_1.VariableUtility.getDefinitionRanges(documentLines, selectedVariableName);
                locations.push(...definitionLocations);
            }
            let referenceLocations = variableUtility_1.VariableUtility.getReferenceRanges(documentLines, selectedVariableName);
            locations.push(...referenceLocations);
            return locations.map(location => new vscode_1.Location(document.uri, location));
        });
    }
}
exports.CustomVariableReferenceProvider = CustomVariableReferenceProvider;
//# sourceMappingURL=customVariableReferenceProvider.js.map