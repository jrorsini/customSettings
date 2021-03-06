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
const environmentController_1 = require("./controllers/environmentController");
const variableProcessor_1 = require("./variableProcessor");
const variableUtility_1 = require("./variableUtility");
class CustomVariableHoverProvider {
    provideHover(document, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!variableUtility_1.VariableUtility.isVariableReference(document, position)) {
                return;
            }
            let wordRange = document.getWordRangeAtPosition(position);
            let selectedVariableName = document.getText(wordRange);
            let fileCustomVariables = variableProcessor_1.VariableProcessor.getCustomVariablesInCurrentFile();
            for (let [variableName, variableValue] of fileCustomVariables) {
                if (variableName === selectedVariableName) {
                    let contents = [variableValue, { language: 'http', value: `File Variable ${variableName}` }];
                    return new vscode_1.Hover(contents, wordRange);
                }
            }
            let environmentCustomVariables = yield environmentController_1.EnvironmentController.getCustomVariables();
            for (let [variableName, variableValue] of environmentCustomVariables) {
                if (variableName === selectedVariableName) {
                    let contents = [variableValue, { language: 'http', value: `Environment Variable ${variableName}` }];
                    return new vscode_1.Hover(contents, wordRange);
                }
            }
            return;
        });
    }
}
exports.CustomVariableHoverProvider = CustomVariableHoverProvider;
//# sourceMappingURL=customVariableHoverProvider.js.map