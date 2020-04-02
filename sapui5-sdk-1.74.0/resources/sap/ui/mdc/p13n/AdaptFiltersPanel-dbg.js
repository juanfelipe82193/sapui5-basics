/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./BasePanel", 'sap/ui/model/Filter', 'sap/m/ColumnListItem', 'sap/m/VBox', 'sap/m/HBox', 'sap/m/Label', 'sap/ui/core/Icon'
], function (BasePanel, Filter, ColumnListItem, VBox, HBox, Label, Icon) {
	"use strict";

	/**
	 * Constructor for AdaptFiltersPanel
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
	 * @since 1.72
	 * @alias sap.ui.mdc.p13n.AdaptFiltersPanel
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var AdaptFiltersPanel = BasePanel.extend("sap.ui.mdc.p13n.AdaptFiltersPanel", {
		library: "sap.ui.mdc",
		metadata: {},
		init: function () {
			// Initialize the BasePanel
			BasePanel.prototype.init.apply(this, arguments);

			var oP13nCellTemplate = new ColumnListItem({
				selected: "{selected}",
				//styleClass: "sapUiSmallMarginBegin", TODO: style class in js as property?
				cells: [
					new HBox({
						justifyContent:"SpaceBetween",
						width:"100%",
						alignItems:"Center",
						items: [
							new VBox({
								items: [
									new Label({
										design: "Bold",
										required: "{required}",
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
							}),
							new Icon({
								src:"sap-icon://filter",
								size: "1.25rem",
								visible: "{isFiltered}"
							})
						]
					})
				]
			});

			this.setTemplate(oP13nCellTemplate);
		},
		renderer: {}

	});

	AdaptFiltersPanel.prototype.setAdaptFilterPanelColumns = function(bAdvancedMode) {
		var aPanelColumns = [this.getResourceText("filterbar.ADAPT_COLUMN_DESCRIPTION")];

		if (bAdvancedMode) {
			aPanelColumns.push(this.getResourceText("filterbar.ADAPT_COLUMN_VALUE"));
		}

		this.setPanelColumns(aPanelColumns);
	};

	AdaptFiltersPanel.prototype._onSearchFieldLiveChange = function (oEvent) {
		var aFilters = new Filter([
			new Filter("label", "Contains", oEvent.getSource().getValue()),
			new Filter("groupLabel", "Contains", oEvent.getSource().getValue())
		]);

		this._oMTable.getBinding("items").filter(aFilters, false);

		if (this._bAdvancedMode) {
			this.insertFilterItems(true);
		}

	};

	AdaptFiltersPanel.prototype.insertFilterItems = function (bCloneFileds) {
		if (!this._bAdvancedMode) {
			return;
		}
		//insert FilterField clones in AdaptFiltersDialog
		this._oMTable.getItems().forEach(function (oFilterItem, iIndex) {
			var oFilterField = this.getModel().getProperty("/items")[iIndex].control.clone();

			//Reorder mode + search field will cause the controls in the binding to be destroyed,
			//thus they are unavaliable anymore, additional cloning is necessary here
			oFilterField = bCloneFileds ? oFilterField.clone() : oFilterField;

			//Panel fires change event if field fires change event
			oFilterField.attachChange(function () {
				this.fireChange();
			}.bind(this));

			//insert the Cell in the panel
			oFilterItem.insertCell(oFilterField, 1);

		}, this);
	};

	AdaptFiltersPanel.prototype._onPressToggleMode = function (oEvent) {
		this._togglePanelMode();

		if (!this._bAdvancedMode) {
			return;
		}

		this._oMTable.getItems().forEach(function (oFilterItem, iIndex) {
			var oFilterField = this.getModel().getProperty("/items")[iIndex].control;
			oFilterField.setVisible(!this.getPanelMode());
		}, this);

		this.insertFilterItems(true);
	};

	AdaptFiltersPanel.prototype.setAdvancedMode = function (bAdvancedMode) {
		this._bAdvancedMode = bAdvancedMode;
	};

	return AdaptFiltersPanel;

});
