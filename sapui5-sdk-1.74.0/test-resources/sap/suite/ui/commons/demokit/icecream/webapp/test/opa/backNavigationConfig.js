sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/suite/ui/commons/demokit/icecream/test/opa/sharedConfig"
], function(Opa5, SharedConfig) {
	return {
		arrangements: new Opa5({
			iStartMyApp: SharedConfig.arrangements.iStartMyApp,
			iNavigateToPageWithTileTitle: SharedConfig.actions.iPressOnTileWithTitle,
			iNavigateToPageViaTileWithStateAndSize: SharedConfig.actions.iPressOnATileWithStateAndSize
		}),
		actions: new Opa5({
			iPressOnTheButtonWithId: SharedConfig.actions.iPressOnTheButtonWithId
		}),
		assertions: new Opa5({
			iShouldSeeAPageWithTitle: SharedConfig.assertions.iShouldSeeAPageWithTitle
		})
	};
}, true);
