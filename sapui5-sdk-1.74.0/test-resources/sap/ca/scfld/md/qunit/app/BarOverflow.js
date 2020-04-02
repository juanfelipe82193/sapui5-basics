/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright
        2009-2014 SAP SE. All rights reserved
    
 */
sap.ui.require([
	"sap/ca/scfld/md/app/BarOverflow",
	"sap/ca/scfld/md/app/BarOverflowLayoutData",
	"sap/m/ActionSheet",
	"sap/m/App",
	"sap/m/Bar",
	"sap/m/Button",
	"sap/m/Page",
	"sap/ui/core/Item"
], function (BarOverflow, BarOverflowLayoutData, ActionSheet, App, Bar, Button, Page, Item) {
	"use strict";
	/*eslint no-new: "error"*/

	var oActionSheet = new ActionSheet({
			placement : "Top",
			buttons : [
				new Button({
					text : "i stay in the overflow",
					layoutData : new BarOverflowLayoutData({
						stayInOverflow : true
					})
				})
			]
		}),
		oFooter = new Bar({
			contentRight : [
				new Button({
					text : "Hi i am button 1"
				}),
				new Button({
					text : "Hi i am button 2"
				}),
				new Button({
					text : "Hi i am button 3"
				}),
				new sap.m.Select({
					items : [
						new Item({
							text : "foo",
							key : "foo"
						}),
						new Item({
							text : "barbarbarbaz",
							key : "barbarbarbaz"
						})
					]
				}),
				new Button({
					text : "Overflow menu",
					layoutData : new BarOverflowLayoutData({
						moveToOverflow : false
					}),
					press : function () {
						oActionSheet.openBy(this);
					}
				})
			]
		}),
		oPage = new Page({
			footer: oFooter
		});

	new BarOverflow(oFooter, oActionSheet);
	new App().addPage(oPage).placeAt("body");
});