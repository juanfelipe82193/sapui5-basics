/* global QUnit, jQuery */
(function (){

	/* helper to load modules dynamically */
	function load(sUrl) {
		jQuery.ajax({
			url : sUrl,
			dataType : 'script',
			async : false,
			error: function() { throw new Error("failed to load " + sUrl); }
		});
	}

	QUnit.test("Load SAPUI5 Core", function(assert) {

		/*
		* In Pegasus, SAPUI5 is loaded dynamically somewhen after the HCP framework has been initialized.
		* To ensure a sufficiently similar test context, we ensure that the tests run after document.ready
		*/
		assert.equal(document.readyState, "complete", "document is ready");

		/* now the SAPUI5 core without jQuery can be loaded */
		/* this is the new configuration possibility which is NOT YET available for pegasus */
		window["sap-ui-config"] = {
			theme : "sap_bluecrystal",
			resourceRoots : {
				"" :  "../../../../../../resources/"
			}
		};
		load('../../../../../../resources/sap-ui-core-nojQuery.js');
		load('../../../../../../resources/sap/ui/qunit/QUnitUtils.js')

		/* check that SAPUI5 has been loaded */
		assert.ok(jQuery.sap, "jQuery.sap namespace exists");
		assert.ok(window.sap, "sap namespace exists");
		assert.ok(sap.ui, "sap.ui namespace exists");
		assert.ok(typeof sap.ui.getCore === "function", "sap.ui.getCore exists");
		assert.ok(sap.ui.getCore(), "sap.ui.getCore() returns a value");

	});

	/* Library Loading should work now as well*/
	QUnit.test("Load a Library", function(assert) {
		sap.ui.getCore().loadLibrary("sap.ui.commons");
		assert.ok(jQuery.sap.getObject("sap.ui.commons"), "lib namespace exists");
		assert.ok(sap.ui.lazyRequire._isStub("sap.ui.commons.Button"), "Control from lib is available as a stub");
		new sap.ui.commons.Button();
		assert.ok(typeof sap.ui.commons.Button.prototype.attachPress === "function", "control lazily loaded and initialized");
	});

	/* The real application logic is executed even later */
	QUnit.test("Create SAPUI5 UI", function(assert) {
		var oLayout = new sap.ui.commons.layout.MatrixLayout("toolbarLayout");
		oLayout.setLayoutFixed(false);
		var oTB1 = new sap.ui.commons.Button("oTB1");
		oTB1.setText("Save");
		oTB1.attachPress(function() {
			pressed = true;
		});
		var oTB2 = new sap.ui.commons.Button("oTB2");
		oTB2.setText("Close");
		var oTB3 = new sap.ui.commons.Button("oTB3");
		oTB3.setText("New");
		var oTB4 = new sap.ui.commons.Button("oTB4");
		oTB4.setText("Change Status");
		var oTB5 = new sap.ui.commons.Button("oTB5");
		oTB5.setText("Check For Duplicates");
		oTB5.setEnabled(false);
		var oTB6 = new sap.ui.commons.Button("oTB6");
		oTB6.setText("Web services");
		oTB6.setIcon("../../images/rss-14x14.gif");
		oLayout.createRow(oTB1, oTB2, oTB3, oTB4, oTB5, oTB6);
		oLayout.placeAt('uiArea');
		assert.ok(true, "creation of UI worked");

		// the UI is invalid now and we have to wait for rerendering
		// stop test execution for 50ms (should allow a rerendering)
		setTimeout(assert.async(), 50);
	});

	QUnit.test("Check that rendering worked", function(assert) {
		assert.ok(jQuery("#oTB1").size() === 1, "control has been rendered");
	});

	QUnit.test("Check eventing", function(assert) {
		pressed = false;
		jQuery("#oTB1").focus().click();
		assert.ok(pressed, "event 'press' has been fired");
	});
}());