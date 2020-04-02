/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
(function() {
	'use strict';
	/**
		* Creates the sort option for the representation.      
		* @description sets the selected sort item on the view setting dialog. Selects the first property in case the default property has to be selected
		*/
	function _selectSortItemOnViewSettingDialog(oSelectedRepresentation, oViewSettingDialog) {
		var oSelectedSortItem = {}, isAscending;
		if (oSelectedRepresentation.orderby && oSelectedRepresentation.orderby.length && oSelectedRepresentation.orderby[0].ascending !== undefined) {
			isAscending = oSelectedRepresentation.orderby[0].ascending;
		}
		if (oSelectedRepresentation.orderby && oSelectedRepresentation.orderby.length > 1) { //More than one sorting criterium in config
			oSelectedSortItem = undefined;
		} else if(oSelectedRepresentation.orderby && oSelectedRepresentation.orderby.length == 1) { //One sorting criterium in config
			oSelectedSortItem = oSelectedRepresentation.orderby[0].property;
		} else {
			oSelectedSortItem = undefined; //No sorting criterium in config
			isAscending = true;
		}
		oViewSettingDialog.setSortDescending(!isAscending);
		oViewSettingDialog.setSelectedSortItem(oSelectedSortItem);
	}
	function _bIsSortoptionChanged(oSortEvent, oViewSettingDialog) {
		var property;
		if(oSortEvent.getParameters().sortItem && oSortEvent.getParameters().sortItem.getKey()){
			property = oSortEvent.getParameters().sortItem.getKey();
		} else {
			return false;
		}
		var oCurrSortOption = {
				property : property, // read the sort property and sort order
				ascending : !oSortEvent.getParameters().sortDescending
		};
		var oPrevSortOption = {
			property : oViewSettingDialog._oPreviousState.sortItem ? oViewSettingDialog._oPreviousState.sortItem.getKey() : undefined,
			ascending : !oViewSettingDialog._oPreviousState.sortDescending
		};
		if (oPrevSortOption.property === oCurrSortOption.property && oPrevSortOption.ascending === oCurrSortOption.ascending) {
			return false;
		}
		return true;
	}
	sap.ui.controller("sap.apf.ui.reuse.controller.viewSetting", {
		/**
		* @method onInit - lifecycle event 
		* @description reads the selected representation and alternate representation (if any) from the view data.
		* Also sets the sort property and sort order on the view setting dialog
		*/
		onInit : function() {
			var oController = this;
			this.oViewSettingDialog = oController.getView().getContent()[0];
			this.oSelectedRepresentation = oController.getView().getViewData().oTableInstance;
			_selectSortItemOnViewSettingDialog(this.oSelectedRepresentation, this.oViewSettingDialog);
		},
		/**
		* @method handleConfirmForSort
		* @description handler for the sort property change on press of ok in view setting dialog.
		* Reads the sort property from the event and sorts the data in the table as well as in alternate representation
		*/
		handleConfirmForSort : function(oSortEvent) {
			if (!_bIsSortoptionChanged(oSortEvent, this.oViewSettingDialog)) {
				return;
			}
			if(this.oSelectedRepresentation){
				this.oSelectedRepresentation.resetPaginationForTable();
			}
			this.oSelectedRepresentation.oApi.selectionChanged(true);
			
		},
		/**
		* @method handleCancel
		* @description handler for the sort property change on press of cancel in view setting dialog.
		* Cancels the sort dialog
		*/
		handleCancel : function(oSortEvent) {
			this.oViewSettingDialog.destroy();
			this.oSelectedRepresentation.oViewSettingDialog = undefined;
		}
	});
}());