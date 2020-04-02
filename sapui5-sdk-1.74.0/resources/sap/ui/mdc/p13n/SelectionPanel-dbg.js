/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./BasePanel", "sap/m/Label", "sap/m/ColumnListItem", "sap/m/HBox", "sap/m/VBox", "sap/ui/model/Filter"
], function(BasePanel, Label, ColumnListItem, HBox, VBox, Filter) {
	"use strict";

	/**
	 * Constructor for SelectionPanel
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class TODO
	 *        <h3><b>Note:</b></h3>
	 *        The control is experimental and the API/behaviour is not finalised and hence this should not be used for productive usage.
	 * @extends sap.ui.mdc.p13n.BasePanel
	 * @author SAP SE
	 * @constructor The API/behaviour is not finalised and hence this control should not be used for productive usage.
	 * @private
	 * @experimental
	 * @since 1.66
	 * @alias sap.ui.mdc.p13n.SelectionPanel
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SelectionPanel = BasePanel.extend("sap.ui.mdc.p13n.SelectionPanel", {
		library: "sap.ui.mdc",
		metadata: {},
		init: function() {

			// Initialize the BasePanel
			BasePanel.prototype.init.apply(this, arguments);

			var oSelectionPanelTemplate = new ColumnListItem({
				selected: "{selected}",
				cells: new VBox({
					items: [
						new Label({
							design: "Bold",
							wrapping: true,
							tooltip: "{tooltip}",
							text: "{label}"
						}),
						new Label({
							wrapping: true,
							tooltip: "{tooltip}",
							text: "{groupLabel}"
						})

					]
				})

			});

			this.setTemplate(oSelectionPanelTemplate);
			this.setPanelColumns(this.getResourceText("fieldsui.COLUMNS"));

		},
		renderer: {}
	});

	SelectionPanel.prototype._onSearchFieldLiveChange = function(oEvent) {
		//TODO: implement in BasePanel
		var aFilters = new Filter([
			new Filter("label", "Contains", oEvent.getSource().getValue()),
			new Filter("groupLabel", "Contains", oEvent.getSource().getValue())
		]);

		this._oMTable.getBinding("items").filter(aFilters, false);
	};

	return SelectionPanel;

});
