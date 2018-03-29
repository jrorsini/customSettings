"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const previewOption_1 = require("../models/previewOption");
class RestClientSettings {
    constructor() {
        vscode_1.workspace.onDidChangeConfiguration(() => {
            this.initializeSettings();
        });
        this.initializeSettings();
    }
    initializeSettings() {
        let restClientSettings = this.getWorkspaceConfiguration();
        this.followRedirect = restClientSettings.get("followredirect", true);
        this.defaultUserAgent = restClientSettings.get("defaultuseragent", "vscode-restclient");
        this.showResponseInDifferentTab = restClientSettings.get("showResponseInDifferentTab", false);
        this.rememberCookiesForSubsequentRequests = restClientSettings.get("rememberCookiesForSubsequentRequests", true);
        this.timeoutInMilliseconds = restClientSettings.get("timeoutinmilliseconds", 0);
        if (this.timeoutInMilliseconds < 0) {
            this.timeoutInMilliseconds = 0;
        }
        this.excludeHostsForProxy = restClientSettings.get("excludeHostsForProxy", []);
        this.fontSize = restClientSettings.get("fontSize", null);
        this.fontFamily = restClientSettings.get("fontFamily", null);
        this.fontWeight = restClientSettings.get("fontWeight", null);
        this.environmentVariables = restClientSettings.get("environmentVariables", new Map());
        this.mimeAndFileExtensionMapping = restClientSettings.get("mimeAndFileExtensionMapping", new Map());
        this.previewResponseInUntitledDocument = restClientSettings.get("previewResponseInUntitledDocument", false);
        this.previewResponseSetUntitledDocumentLanguageByContentType = restClientSettings.get("previewResponseSetUntitledDocumentLanguageByContentType", false);
        this.includeAdditionalInfoInResponse = restClientSettings.get("includeAdditionalInfoInResponse", false);
        this.hostCertificates = restClientSettings.get("certificates", new Map());
        this.useTrunkedTransferEncodingForSendingFileContent = restClientSettings.get("useTrunkedTransferEncodingForSendingFileContent", true);
        this.suppressResponseBodyContentTypeValidationWarning = restClientSettings.get("suppressResponseBodyContentTypeValidationWarning", false);
        this.disableHighlightResonseBodyForLargeResponse = restClientSettings.get("disableHighlightResonseBodyForLargeResponse", true);
        this.disableAddingHrefLinkForLargeResponse = restClientSettings.get("disableAddingHrefLinkForLargeResponse", true);
        this.largeResponseBodySizeLimitInMB = restClientSettings.get("largeResponseBodySizeLimitInMB", 5);
        this.previewOption = previewOption_1.fromString(restClientSettings.get("previewOption", "full"));
        let httpSettings = vscode_1.workspace.getConfiguration('http');
        this.proxy = httpSettings.get('proxy', undefined);
        this.proxyStrictSSL = httpSettings.get('proxyStrictSSL', false);
        this.enableTelemetry = httpSettings.get('enableTelemetry', true);
        this.showEnvironmentStatusBarItem = restClientSettings.get('showEnvironmentStatusBarItem', true);
    }
    getWorkspaceConfiguration() {
        let editor = vscode_1.window.activeTextEditor;
        if (editor && editor.document) {
            return vscode_1.workspace.getConfiguration("rest-client", editor.document.uri);
        }
        else {
            return vscode_1.workspace.getConfiguration("rest-client");
        }
    }
}
exports.RestClientSettings = RestClientSettings;
//# sourceMappingURL=configurationSettings.js.map