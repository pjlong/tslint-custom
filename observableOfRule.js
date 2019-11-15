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
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    Rule.FAILURE_STRING = "'of' must be imported as 'observableOf'";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    return ctx.sourceFile.forEachChild(cb);
    function cb(node) {
        if (node.kind === ts.SyntaxKind.ImportDeclaration) {
            var importDeclarationNode = node;
            if (importDeclarationNode.moduleSpecifier
                && importDeclarationNode.moduleSpecifier.getText() === "'rxjs'"
                && importDeclarationNode.importClause) {
                var namedImports = importDeclarationNode.importClause.namedBindings;
                namedImports.elements.forEach(function (element) {
                    if ((!element.propertyName && element.name.text === 'of')
                        || (element.propertyName && element.propertyName.text === 'of' && element.name.text !== 'observableOf')) {
                        ctx.addFailureAtNode(element, Rule.FAILURE_STRING, new Lint.Replacement(element.getStart(), element.getWidth(), 'of as observableOf'));
                    }
                });
            }
        }
        return node.forEachChild(cb);
    }
}
