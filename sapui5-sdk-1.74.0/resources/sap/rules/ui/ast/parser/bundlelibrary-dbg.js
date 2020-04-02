(function () {
	"use strict";

	jQuery.sap.declare("sap.rules.ui.ast.parser.bundlelibrary");

	// delegate further initialization of this library to the Core
	/*sap.ui.getCore().initLibrary({
		name: "sap.rules.ui.ast.parser.bundle",
		noLibraryCSS: true
	});*/

	sap.ui.define(
		["sap/rules/ui/ast/parser/bundle"],
		// callback
		function () {

			var instance;

			function createInstance() {
				return {
					ASTConstants: window.idp.ASTConstants.ASTConstants,
					ASTUtil: window.idp.ASTUtil.ASTUtil,
					IDPCustomVisitor: idp.IDPCustomVisitor.IDPCustomVisitor,
					IDPLexer: window.idp.IDPLexer.IDPLexer,
					IDPParser: window.idp.IDPParser.IDPParser,
					IDPVisitor: window.idp.IDPVisitor.IDPVisitor,
					Node: window.idp.Node.Node,
					antlr4: window.idp.antlr4,
					CodeCompletionCore: window.idp.AutoSuggestion.AutoSuggest,
					TermsBuilder: window.idp.TermsBuilder,
					TermsProvider: window.idp.TermsProvider,
					ASTErrorListener: window.idp.ASTErrorListener.ASTErrorListener 
				};
			};
			return {
				getInstance: function () {
					if (!instance) {
						instance = createInstance();
					}
					return instance;
				}

			};
		});

})();