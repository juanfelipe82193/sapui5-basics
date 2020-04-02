sap.ui.require([
	"sap/ui/model/json/JSONModel",
	"sap/ui/comp/variants/VariantManagement",
	"sap/m/Title",
	"sap/m/Toolbar",
	"sap/m/ToolbarSpacer",
	"sap/m/ToolbarSeparator"

], function (
		JSONModel,
		VariantManagement,
		Title,
		Toolbar,
		ToolbarSpacer,
		ToolbarSeparator
	) {
	"use strict";

	/*** DEFINE RE-USE COMPONENTS - NORMALLY DONE IN SEPARATE FILES ***/

	// define a new (simple) Controller type
	sap.ui.controller("my.own.controller", {

		// implement an event handler in the Controller
		doSomething: function() {
/* eslint-disable no-alert */
			alert("Hello World!");
/* eslint-enable no-alert */
		}
	});


	// define a new (simple) View type
	// ...alternatively this can be done in an XML file without JavaScript!
	sap.ui.jsview("my.own.view", {

		// define the (default) controller type for this View
		getControllerName: function() {
			return "my.own.controller";
		},

		// defines the UI of this View
		createContent: function(oController) {
			// button text is bound to Model, "press" action is bound to Controller's event handler
			return new Toolbar({
				content: [
						new Title({text: "Title",tooltip: "Title"}),
						new ToolbarSpacer({width: "0.5rem"}),
						new ToolbarSeparator(),
						new ToolbarSpacer({width: "0.5rem"}),
						new VariantManagement()
					]
			});
		}
	});



	/*** THIS IS THE "APPLICATION" CODE ***/

	// create some dummy JSON data
	var data = {
		actionName: "Say Hello"
	};

	// instantiate the View
	var myView = sap.ui.view({type:sap.ui.core.mvc.ViewType.JS, viewName:"my.own.view"});

	// create a Model and assign it to the View
	var oModel = new JSONModel();
	oModel.setData(data);
	myView.setModel(oModel);

	// put the View onto the screen
	myView.placeAt('content');

});