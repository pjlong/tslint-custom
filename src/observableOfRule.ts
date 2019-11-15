import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  static FAILURE_STRING = "'of' must be imported as 'observableOf'";

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  return ctx.sourceFile.forEachChild(cb);

  function cb(node: ts.Node): void {
    if (node.kind === ts.SyntaxKind.ImportDeclaration) {
      const importDeclarationNode = node as ts.ImportDeclaration;

      if (
        importDeclarationNode.moduleSpecifier
        && importDeclarationNode.moduleSpecifier.getText() === "'rxjs'"
        && importDeclarationNode.importClause
      ) {
        const namedImports = importDeclarationNode.importClause.namedBindings as ts.NamedImports;

        namedImports.elements.forEach(element => {
          if (
            (!element.propertyName && element.name.text === 'of')
            || (element.propertyName && element.propertyName.text === 'of' && element.name.text !== 'observableOf')
          ) {
            ctx.addFailureAtNode(
              element,
              Rule.FAILURE_STRING,
              new Lint.Replacement(element.getStart(), element.getWidth(), 'of as observableOf'),
            );
          }
        });
      }
    }

    return node.forEachChild(cb);
  }
}
