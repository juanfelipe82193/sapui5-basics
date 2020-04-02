/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./BasePanel", "sap/m/Label", "sap/m/ColumnListItem", "sap/m/Select", "sap/m/Text", "sap/ui/core/Item"
], function (BasePanel, Label, ColumnListItem, Select, Text, Item) {
	"use strict";

	/**
	 * Constructor for ChartItemPanel
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
	 * @alias sap.ui.mdc.p13n.ChartItemPanel
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ChartItemPanel = BasePanel.extend("sap.ui.mdc.p13n.ChartItemPanel", {
		library: "sap.ui.mdc",
		metadata: {},
		init: function () {
			// Initialize the BasePanel
			BasePanel.prototype.init.apply(this, arguments);
			var oChartItemPanelTemplate = new ColumnListItem({
				selected: "{selected}",
				cells: [
					new Label({
						wrapping: true,
						text: "{label}",
						tooltip: "{tooltip}"
					}),
					new Text({
						wrapping: true,
						text: "{kind}"
					}),
					new Select({
						width: "100%",
						selectedKey: "{role}",
						change: [this.onChangeOfRole, this],
						forceSelection: false,
						enabled: "{selected}",
						items: {
							path: "availableRoles",
							templateShareable: false,
							template: new Item({
								key: "{key}",
								text: "{text}"
							})
						}
					})
				]
			});

			this.setTemplate(oChartItemPanelTemplate);
			this.setPanelColumns([
				this.getResourceText("chart.PERSONALIZATION_DIALOG_COLUMN_DESCRIPTION"), this.getResourceText("chart.PERSONALIZATION_DIALOG_COLUMN_TYPE"), this.getResourceText("chart.PERSONALIZATION_DIALOG_COLUMN_ROLE")
			]);
		},
		renderer: {}
	});

	ChartItemPanel.prototype.onChangeOfRole = function (oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		// Fire event only for valid selection
		if (oSelectedItem) {
			var oTableItem = oEvent.getSource().getParent();

			this.fireChange();
			this._updateEnableOfMoveButtons(oTableItem);
		}
	};

	return ChartItemPanel;

});
