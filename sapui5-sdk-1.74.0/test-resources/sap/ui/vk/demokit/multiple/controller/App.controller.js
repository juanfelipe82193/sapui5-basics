sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/vk/ContentResource",
	"sap/m/MessageToast"
], function (Controller, JSONModel, ContentResource, MessageToast) {
	"use strict";

	//throws a Message Toast alert on the screen
	//when the user tries to load a model but there's no url specified
	var handleEmptyUrl = function (view) {
		var oBundle = view.getModel("i18n").getResourceBundle();
		var msg = oBundle.getText("missingUrl");
		MessageToast.show(msg);
	};

	//checks if all URL input fields are empty or not
	var checkIfAllInputsEmpty = function (urls) {
		var allEmpty = true;
		for (var i = 0; i < urls.length; i++) {
			if (urls[i]) {
				allEmpty = false;
				break;
			}
		}
		return allEmpty;
	}

	//loads the models from the URLs into the viewer
	var loadModelsIntoViewer = function (viewer, urls, sourceType) {
		//clears all the models currently loaded in the viewer
		viewer.destroyContentResources();

		//iterates through all URLs
		//and loads all models into the viewer
		for (var i = 0; i < urls.length; i++) {
			if (urls[i]) {
				var contentResource = new ContentResource({
					source: urls[i],
					sourceType: sourceType,
					sourceId: "abc",
					name: urls[i].split("/")[2]
				});
				//add current model to the viewer
				viewer.addContentResource(contentResource);
			}
		}
	};

	return Controller.extend("sap-demo.controller.App", {
		//when the controller is initialized,
		//we declare an empty structure and
		//we set this as model for the URLs
		onInit: function () {
			var sourceData = {
				url1: "",
				url2: "",
				url3: ""
			};
			var model = new JSONModel();
			model.setData(sourceData);
			this.getView().setModel(model, "source");
		},

		//onPressLoadRemoteModels handles the click event on the LOAD button
		onPressLoadRemoteModels: function (event) {
			var view = this.getView();
			//set the source model to a variable
			var sourceData = view.getModel("source").getData();

			//get the current viewer control
			var viewer = view.byId("viewer");

			//create the list of URLs from the input fields
			var urls = [sourceData.url1, sourceData.url2, sourceData.url3];

			//if all URL inputs are empty show an alert on the screen
			//if at least one URL is specified, then take the URL list
			//and load all existing ones into the viewer
			if (checkIfAllInputsEmpty(urls)) {
				handleEmptyUrl(view);
			} else {
				loadModelsIntoViewer(viewer, urls, "vds");
			}
		}
	});
});
