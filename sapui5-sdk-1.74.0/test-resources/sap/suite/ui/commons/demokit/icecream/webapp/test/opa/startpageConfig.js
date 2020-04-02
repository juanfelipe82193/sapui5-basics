sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/suite/ui/commons/demokit/icecream/test/opa/sharedConfig"
], function(Opa5, SharedConfig) {
	return {
		arrangements: new Opa5({
			iStartMyApp: SharedConfig.arrangements.iStartMyApp
		}),
		actions: new Opa5({
			iPressOnTheTileWithTitle: SharedConfig.actions.iPressOnTileWithTitle,
			iPressOnATileWithStateAndSize: SharedConfig.actions.iPressOnATileWithStateAndSize
		}),
		assertions: new Opa5({
			iShouldSeeAPageWithTitle: SharedConfig.assertions.iShouldSeeAPageWithTitle,
			iShouldSeeAButtonWithId: SharedConfig.assertions.iShouldSeeAButtonWithId
		})
	};
}, true);
