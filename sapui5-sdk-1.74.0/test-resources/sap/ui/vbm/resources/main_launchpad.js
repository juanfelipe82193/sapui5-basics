//localStorage.setItem('map', '');

var controller = {

	currentTest: 0,

	tests: [],

	testDescription: new sap.m.Text(),

	navigateLeftButton: new sap.m.Button({
		icon: "sap-icon://navigation-left-arrow"
	}),

	navigateRightButton: new sap.m.Button({
		icon: "sap-icon://navigation-right-arrow"
	}),

	testListButton: new sap.m.Button({
		icon: "sap-icon://list",
		text: "All Tests",
		press: function () {
			controller.showTests();
			controller.testTitle.setText("");
			controller.testDescription.setText("");
		}
	}),

	rtlButton: new sap.m.Button({
		icon: "sap-icon://text-align-right",
		text: "RTL Mode",
		press: function () {
			window.location.href = window.location.origin + window.location.pathname + "?component=" + controller.tests.tests[controller.currentTest].componentName + "&sap-ui-rtl=true"
		}
	}),

	ltrButton: new sap.m.Button({
		icon: "sap-icon://text-align-left",
		text: "LTR Mode",
		press: function () {
			window.location.href = window.location.origin + window.location.pathname + "?component=" + controller.tests.tests[controller.currentTest].componentName + "&sap-ui-rtl=false"
		}
	}),

	reloadAppButton: new sap.m.Button({
		icon: "sap-icon://refresh",
		text: "Reload Test App",
		press: function () {
			window.location.href = window.location.origin + window.location.pathname
		}
	}),

	testTitle: new sap.m.Label()



};

controller.page = new sap.m.Page({
	subHeader: new sap.m.Bar({
		contentMiddle: [
			controller.testDescription
		]
	}),
	customHeader: [
		new sap.m.Bar({
			contentLeft: [
				controller.navigateLeftButton,
				controller.testListButton,
				controller.rtlButton
			],
			contentMiddle: [
				controller.testTitle
			],
			contentRight: [
				controller.ltrButton,
				controller.reloadAppButton,
				controller.navigateRightButton
			]
		})
	]
});

controller.getTestIndexFromComponentName = function (componentName) {
	var index = -1;
	for (var i = 0; i < controller.tests.tests.length; i++) {
		if (componentName === controller.tests.tests[i].componentName) {
			index = i;
			break;
		}
	}
	return index;
}

controller.getTestIndexFromTestNumber = function (testNumber) {
	var index = -1;
	for (var i = 0; i < controller.tests.tests.length; i++) {
		if (testNumber === controller.tests.tests[i].number) {
			index = i;
			break;
		}
	}
	return index;
}

controller.showTests = function (testIndex) {
	var that = this;
	this.page.destroyContent();
	
	for (var i = 0; i < that.tests.areas.length; i++) {
		const areaTests = that.tests.tests.filter(test => test.area == that.tests.areas[i]);
		var component = new sap.m.TileContainer("tc" + i, {
			height: "35%"
		});

		var title = new sap.m.Title({
			text: that.tests.areas[i]
		});

		for (var ia = 0; ia < areaTests.length; ia++) {
			var t = areaTests[ia];
			component.addTile(new sap.m.StandardTile({
				icon: "sap-icon://activity-2",
				title: t.name,
				info: t.area,
				number: t.number,
				press: function (event) {
					var componentName = event.getSource().getCustomData()[0].getValue(),
						testIndex = controller.getTestIndexFromComponentName(componentName);
					controller.loadTest(testIndex);
				},
				customData: {
					Type: sap.ui.core.CustomData,
					key: "componentName",
					value: t.componentName
				}
			}))
		}
		this.page.addContent(title);
		this.page.addContent(component);
	}

};

controller.loadTest = function (testIndex) {

	if (testIndex < 0) {
		testIndex = this.tests.tests.length - 1;
	} else if (testIndex >= this.tests.tests.length) {
		testIndex = 0;
	}

	this.currentTest = testIndex;

	var testInfo = this.tests.tests[testIndex];

	var component = new sap.ui.core.ComponentContainer({
		name: testInfo.componentName,
		height: "100%",
		width: "100%"
	});

	this.page.destroyContent();
	this.page.addContent(component);
	this.testTitle.setText(testInfo.number + " - " + testInfo.name);
	this.testDescription.setText(testInfo.description);

};

controller.loadNextTest = function () {
	this.currentTest++;
	this.loadTest(this.currentTest);
}

controller.loadPreviousTest = function () {
	this.currentTest--;
	this.loadTest(this.currentTest);
}


controller.page.placeAt("content");

var dat = $.getJSON("./test_structure.json", function (tests) {

	controller.tests = tests;
	jQuery.sap.require("sap.ui.model.json.JSONModel");
	var model = new sap.ui.model.json.JSONModel(tests);

	controller.navigateLeftButton.attachPress(controller.loadPreviousTest.bind(controller));
	controller.navigateRightButton.attachPress(controller.loadNextTest.bind(controller));

	if (jQuery.sap.getUriParameters().get('component')) {
		var componentName = jQuery.sap.getUriParameters().get('component');
		testIndex = controller.getTestIndexFromComponentName(componentName);
		controller.loadTest(testIndex);
	} else {
		sap.ui.getCore().attachInit(function () {
			controller.showTests();
		});
	}
});