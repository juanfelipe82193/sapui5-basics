/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/m/Page",
	"sap/me/Calendar",
	"sap/me/CalendarLegend",
	"sap/me/CalendarRenderer",
	"sap/ui/layout/form/Form",
	"sap/ui/layout/form/ResponsiveGridLayout",
	"sap/ui/layout/Grid",
	"sap/ui/layout/form/FormContainer",
	"sap/ui/layout/form/FormElement",
	"sap/ui/thirdparty/jquery"
], function(
	qutils,
	createAndAppendDiv,
	Page,
	Calendar,
	CalendarLegend,
	CalendarRenderer,
	Form,
	ResponsiveGridLayout,
	Grid,
	FormContainer,
	FormElement,
	jQuery
) {
	"use strict";

	// prepare DOM
	createAndAppendDiv("target1");
	createAndAppendDiv("target2");
	createAndAppendDiv("content");



	var form = new Form();
	var container = new FormContainer();
	var element = new FormElement();
	var grid = new Grid({defaultSpan: "L12 M12 S12", width: "auto"});
	var layout = new ResponsiveGridLayout({
		labelSpanL: 3,
		labelSpanM: 3,
		emptySpanL: 4,
		emptySpanM: 4,
		columnsL: 1,
		columnsM: 1
	});

	var sapmecl = new CalendarLegend();
	sapmecl.setLegendForType00('zero');
	sapmecl.setLegendForType01('one');
	sapmecl.setLegendForType04('two');
	sapmecl.setLegendForType06('three');
	sapmecl.setLegendForType07('four');
	sap.ui.getCore().getConfiguration().setLanguage("fr");

	form.setLayout(layout);
	element.addField(sapmecl);
	container.addFormElement(element);
	form.addFormContainer(container);
	grid.addContent(form);
	grid.placeAt('content');

	QUnit.test("BCP 0020079747 0000828216 2015", function (assert) {
		jQuery('.sapUIMeCalendarLegendLabels').each(function (index, sap_me_label) {
			var str = window.getComputedStyle(sap_me_label, ':after').getPropertyValue('content');
			assert.strictEqual(str.indexOf(':'), -1, 'There should be no colon in the :after text, content: ' + str);
		});
	});
});