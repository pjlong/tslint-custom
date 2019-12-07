import * as Lint from 'tslint';
import * as ts from 'typescript';

type ImportAsModuleMapping = {
  [key: string]: { [key: string]: string }
}

export class Rule extends Lint.Rules.AbstractRule {
  static failureStringBuilder(importName: string, importAsName: string, moduleName: string): string {
    return `'${importName}' must be imported as '${importAsName}' for module '${moduleName}'`
  }

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const { ruleArguments: ruleMappingConfig } = this.getOptions();
    return this.applyWithFunction(sourceFile, walk, ruleMappingConfig[0]);
  }
}

function walk(ctx: Lint.WalkContext<ImportAsModuleMapping>) {
  const moduleNameMapping: ImportAsModuleMapping = ctx.options;

  return ctx.sourceFile.forEachChild(cb);

  function cb(node: ts.Node): void {
    if (node.kind === ts.SyntaxKind.ImportDeclaration) {
      const importDeclarationNode = node as ts.ImportDeclaration;
      const moduleSpecifier = importDeclarationNode.moduleSpecifier.getText().replace(/['"]/g, '');

      if (
        importDeclarationNode.moduleSpecifier
        && moduleSpecifier in moduleNameMapping
        && importDeclarationNode.importClause
      ) {
        const namedImports = importDeclarationNode.importClause.namedBindings as ts.NamedImports;
        const moduleImportMapping: { [key: string]: string } = moduleNameMapping[moduleSpecifier];

        namedImports.elements.forEach(element => {
          const hasInvalidName = !element.propertyName && element.name.text in moduleImportMapping;
          const hasInvalidPropertyName = element.propertyName && element.propertyName.text in moduleImportMapping && element.name.text !== moduleImportMapping[element.name.text];

          if (hasInvalidName || hasInvalidPropertyName) {
            ctx.addFailureAtNode(
              element,
              Rule.failureStringBuilder(element.name.text, moduleImportMapping[element.name.text], moduleSpecifier),
              new Lint.Replacement(element.getStart(), element.getWidth(), `${element.name.text} as ${moduleImportMapping[element.name.text]}`),
            );
          }
        });
      }
    }

    return node.forEachChild(cb);
  }
}
