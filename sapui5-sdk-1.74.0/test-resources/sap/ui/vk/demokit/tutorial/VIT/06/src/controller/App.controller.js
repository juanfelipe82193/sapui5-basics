sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/table/Column",
	"sap/m/Text",
	"sap/m/Button"
], function(Controller, Column, Text, Button) {
	"use strict";

	return Controller.extend("customizedSceneTree.controller.App", {

		onInit: function() {
			var view = this.getView(),
				viewer = view.byId("viewer");

			viewer.attachSceneLoadingSucceeded(function() {
				var sceneTree = viewer.getSceneTree(),
					treeTable = sceneTree.getTreeTable();

				// set custom SceneTree title
				sceneTree.setTitle(view.byId("sceneTreeTitle").getValue());

				// hide default visibility column
				treeTable.getColumns()[1].setVisible(false);

				// add custom visibility column
				treeTable.addColumn(new Column({
					label: new Text({
						text: "Visibility"
					}),
					template: new Button({
						text: "{= ${visible} ? 'visible' : 'hidden'}",
						press: function(event) {
							var context = treeTable.getContextByIndex(this.getParent().getIndex());
							var object = context ? context.getObject() : null;
							if (object) {
								viewer.getViewStateManager().setVisibilityState(object.id, !object.visible, true);
							}
						}
					}),
					width: "5rem",
					resizable: false,
					hAlign: "Center"
				}));
			});
		},

		onTitleSubmit: function(event) {
			var sceneTree = this.getView().byId("viewer").getSceneTree();
			sceneTree.setTitle(event.getSource().getValue()); // change SceneTree title
		},

		onTitleSelect: function(event) {
			var sceneTree = this.getView().byId("viewer").getSceneTree();
			sceneTree.setShowTitle(event.getSource().getSelected()); // show/hide SceneTree title
		},

		onSearchFieldSelect: function(event) {
			var sceneTree = this.getView().byId("viewer").getSceneTree();
			sceneTree.setShowSearchField(event.getSource().getSelected()); // show/hide SceneTree search field
		},

		onDefaultColumnSelect: function(event) {
			var sceneTree = this.getView().byId("viewer").getSceneTree();
			var column = sceneTree.getTreeTable().getColumns()[1];
			column.setVisible(event.getSource().getSelected()); // show/hide default visibility column
		},

		onCustomColumnSelect: function(event) {
			var sceneTree = this.getView().byId("viewer").getSceneTree();
			var column = sceneTree.getTreeTable().getColumns()[2];
			column.setVisible(event.getSource().getSelected()); // show/hide custom visibility column
		}
	});
});