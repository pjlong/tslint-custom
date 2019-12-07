"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Lint = require("tslint");
var ts = require("typescript");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.failureStringBuilder = function (importName, importAsName, moduleName) {
        return "'" + importName + "' must be imported as '" + importAsName + "' for module '" + moduleName + "'";
    };
    Rule.prototype.apply = function (sourceFile) {
        var ruleMappingConfig = this.getOptions().ruleArguments;
        return this.applyWithFunction(sourceFile, walk, ruleMappingConfig[0]);
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    var moduleNameMapping = ctx.options;
    return ctx.sourceFile.forEachChild(cb);
    function cb(node) {
        if (node.kind === ts.SyntaxKind.ImportDeclaration) {
            var importDeclarationNode = node;
            var moduleSpecifier_1 = importDeclarationNode.moduleSpecifier.getText().replace(/['"]/g, '');
            if (importDeclarationNode.moduleSpecifier
                && moduleSpecifier_1 in moduleNameMapping
                && importDeclarationNode.importClause) {
                var namedImports = importDeclarationNode.importClause.namedBindings;
                var moduleImportMapping_1 = moduleNameMapping[moduleSpecifier_1];
                namedImports.elements.forEach(function (element) {
                    var hasInvalidName = !element.propertyName && element.name.text in moduleImportMapping_1;
                    var hasInvalidPropertyName = element.propertyName && element.propertyName.text in moduleImportMapping_1 && element.name.text !== moduleImportMapping_1[element.name.text];
                    if (hasInvalidName || hasInvalidPropertyName) {
                        ctx.addFailureAtNode(element, Rule.failureStringBuilder(element.name.text, moduleImportMapping_1[element.name.text], moduleSpecifier_1), new Lint.Replacement(element.getStart(), element.getWidth(), element.name.text + " as " + moduleImportMapping_1[element.name.text]));
                    }
                });
            }
        }
        return node.forEachChild(cb);
    }
}
