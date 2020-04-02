/*
 * ! SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/* global window */
jQuery.sap.declare("sap.apf.ui.utils.print");
jQuery.sap.require("sap.apf.ui.utils.printView");
jQuery.sap.require("sap.apf.ui.utils.formatter");
jQuery.sap.require("sap.viz.ui5.types.legend.Common");
/**
 * @class Print
 * @memberOf sap.apf.ui.utils
 * @description has functions to perform printing of Analysis Path
 */
sap.apf.ui.utils.Print = function(oInject) {
	"use strict";
	var oCoreApi = oInject.oCoreApi;
	var oUiApi = oInject.uiApi;
	var aAllSteps = null;
	var printModel = new sap.apf.ui.utils.PrintModel(oInject);
	var printView = new sap.apf.ui.utils.PrintView(oInject, printModel);
	this.oPrintLayout = {};
	/**
	 * @method _createDivForPrint removes the existing div apfPrintArea. Later creates the div apfPrintArea
	 */
	function _createDivForPrint(oContext) {
		if (!jQuery.isEmptyObject(oContext.oPrintLayout)) {
			oContext.oPrintLayout.removeContent();
		}
		jQuery('#apfPrintArea').remove(); // removing the div which holds the printable content
		jQuery("body").append('<div id="apfPrintArea"></div>'); // div which holds the printable content
		oUiApi.createApplicationLayout(false).then(function(applicationLayout) {
			applicationLayout.setBusy(true);// sets the Local Busy Indicator for the print
		});
	}
	/**
	 * @method Print used to print all the steps in Analysis Path.
	 * @usage Print().doPrint has to be used for printing Analysis Path
	 */
	this.doPrint = function() {
		oCoreApi.getApplicationConfigProperties().done(function(applicationConfig) {
			printModel.setApplicationConfig(applicationConfig);
			var j, nIndex, oPrintFirstPageLayout;
			var pTimer = 2000, self = this;
			printModel.nStepRenderCount = 0;
			aAllSteps = oCoreApi.getSteps();
			printModel.nNoOfSteps = aAllSteps.length;
			this.oPrintLayout = new sap.ui.layout.VerticalLayout({
				id : "idAPFPrintLayout"
			});
			_createDivForPrint(this);
			// Facet Filter and footers are printed in the initial page along with the header
			oPrintFirstPageLayout = new sap.ui.layout.VerticalLayout({
				id : 'idAPFPrintFirstPageLayout',
				content : [ printView.getHeaderForFirstPage(), printView.getPrintLayoutForFacetFiltersAndFooters() ]
			}).addStyleClass("filterLayout");
			this.oPrintLayout.addContent(oPrintFirstPageLayout);
			// Consecutive pages with one step each is printed
			for(j = 0; j < aAllSteps.length; j++) {
				nIndex = parseInt(j, 10) + 1;
				this.oPrintLayout.addContent(printView.getPrintLayoutForEachStep(aAllSteps[j], nIndex, aAllSteps.length));
			}
			this.oPrintLayout.placeAt("apfPrintArea");
			_printChainOfPromises(self.oPrintLayout, pTimer);
		}.bind(this));
	};
	function _printChainOfPromises(oPrintLayout, pTimer) {
		new Promise(function(resolve) {
			setTimeout(function() { // wait for pTimer ms before starting the Printing
				resolve();
			}, pTimer);
		}).then(function() { // print (sync) & wait for the ApplicationLayout to be recreated (async)
			_prepareDomForPrinting(oPrintLayout);
			_processWindowPrint();
			_processPostPrintingTask(oPrintLayout);
			return oUiApi.createApplicationLayout(false)
		}).then(function(applicationLayout) {
			applicationLayout.setBusy(false);
		});
	}
	function _processPostPrintingTask(oPrintLayout) {
		var oSelectedRepresentation, oChart;
		var oId,oItems,oItem;
		for(var i = 0; i < jQuery("#apfPrintArea").siblings().length; i++) {
			jQuery("#apfPrintArea").siblings()[i].hidden = false;
		}
		for(var stepNo = 0; stepNo < aAllSteps.length; stepNo++) {
			oSelectedRepresentation = aAllSteps[stepNo].getSelectedRepresentation();
			oSelectedRepresentation = oSelectedRepresentation.bIsAlternateView ? oSelectedRepresentation.toggleInstance : oSelectedRepresentation;
			//setting Excel to Export button visible after print operation for table representation type to prevent button not to be print on the Non-interactive pdf
			if(oSelectedRepresentation && oSelectedRepresentation.titleControl && oSelectedRepresentation.titleControl.oParent ){
				oItems = oSelectedRepresentation.titleControl.oParent.getItems();
				if (oItems && oItems.length > 1){
					for (var j = 0; j < oItems.length; j++) {
						if (oItems[j].getMetadata()._sClassName === "sap.m.HBox"){
							oItem = oItems[j];
							oItem.setVisible(true);
						}}
					}}
			// Check if the representation is not a table representation; if not destroy the chart instance
			if (oSelectedRepresentation.type !== sap.apf.ui.utils.CONSTANTS.representationTypes.TREE_TABLE_REPRESENTATION && oSelectedRepresentation.type !== sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION) {
				// Access layout content to retrieve the chart; Destroy the chart to prevent memory leaks
				oChart = oPrintLayout.getContent()[stepNo + 1].getContent()[1].getContent()[0];
				oChart.destroy();
				oChart = null;
			}
		}
		oPrintLayout.destroy(); // Destroy the reference & remove from dom
		oPrintLayout = null;
		// deleting manually using jquery because deleting UI5 object was deleting objects internally
		jQuery("div[id^=idAPFStepLayout]").remove();
		jQuery("#apfPrintArea").remove();
	}
	function _processWindowPrint() {
		var ifTablet = sap.ui.Device.system.tablet;
		var ifOsIos = sap.ui.Device.os.ios;
		if (ifTablet === true && ifOsIos === true) {
			var htmlCopy = jQuery("html").clone();
			var bodyDomObject = jQuery(htmlCopy).find('body');
			jQuery(bodyDomObject).children("div").each(function(index, element) {
				if (jQuery(element).attr('id') === 'apfPrintArea') {
					jQuery(element).show();
				} else {
					jQuery(element).remove();
				}
			});
			jQuery(jQuery(htmlCopy).find('body')).html(jQuery(bodyDomObject.html()));
			var tempWholePage = "<html>" + jQuery(htmlCopy).html() + "</html>";
			var myWindow = window.open("", "_blank", "width=300,height=300");
			myWindow.document.write(tempWholePage);
			myWindow.print();
		} else {
			window.print();
		}
	}
	function _prepareDomForPrinting(oPrintLayout) {
		var domContent = oPrintLayout.getDomRef(); // Get the DOM Reference
		jQuery("#apfPrintArea").empty(); // Clear the apfPrintArea
		jQuery("#apfPrintArea").append(jQuery(domContent).html()); // Push it to apfPrintArea
		for(var i = 0; i < jQuery("#apfPrintArea").siblings().length; i++) {
			// alternate way of hiding the content and printing only the representations
			jQuery("#apfPrintArea").siblings()[i].hidden = true; // hiding the content apart from apfPrintArea div
		}
	}
};
