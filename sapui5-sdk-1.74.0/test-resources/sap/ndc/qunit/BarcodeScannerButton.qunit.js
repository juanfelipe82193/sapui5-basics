/* global QUnit */
sap.ui.define([
	"sap/ndc/BarcodeScannerButton",
	"sap/m/MessageToast"
], function (
	BarcodeScannerButton,
	MessageToast
) {
	"use strict";

	QUnit.module("Basic functionality", function () {
		QUnit.test("should not have a default width set", function(assert) {
			var oScanButton = new BarcodeScannerButton({
				provideFallback: "{/btnFallback}",
				visible: "{/btnVisible}",
				scanSuccess: onScanSuccess,
				scanFail: onScanError,
				inputLiveUpdate: onScanLiveupdate,
			});

			oScanButton.placeAt("qunit-fixture");

			assert.strictEqual(oScanButton.getWidth(), "", "button width was set");

			oScanButton.destroy();
		});

		QUnit.test("should be able to set agregated button width to 30%", function(assert) {
			var oScanButton30p = new BarcodeScannerButton({
				provideFallback: "{/btnFallback}",
				visible: "{/btnVisible}",
				scanSuccess: onScanSuccess,
				scanFail: onScanError,
				inputLiveUpdate: onScanLiveupdate,
				width: "30%"
			});

			oScanButton30p.placeAt("qunit-fixture");

			assert.strictEqual(oScanButton30p.getWidth(), "30%", "button width was set");

			oScanButton30p.destroy();
		});

		QUnit.test("should be able to set agregated button width to 100px", function(assert) {
			var oScanButton100px = new BarcodeScannerButton({
				provideFallback: "{/btnFallback}",
				visible: "{/btnVisible}",
				scanSuccess: onScanSuccess,
				scanFail: onScanError,
				inputLiveUpdate: onScanLiveupdate,
				width: "100px"
			});

			oScanButton100px.placeAt("qunit-fixture");

			assert.strictEqual(oScanButton100px.getWidth(), "100px", "button width was set");
			oScanButton100px.destroy();
		});

	});

	function onScanSuccess(oEvent) {
		if (oEvent.getParameter("cancelled")) {
			MessageToast.show("Scan cancelled", { duration:1000 });
		} else {
			MessageToast.show("Scanned: " + oEvent.getParameter("text"), { duration:2000 });
		}
	}

	function onScanError(oEvent) {
		MessageToast.show("Scan failed" + oEvent, { duration:1000 });
	}

	function onScanLiveupdate(oEvent) {
		var sCloseCode = oModel.getProperty("/closeCode");
		if (sCloseCode && sCloseCode === oEvent.getParameter("newValue")) {
			BarcodeScanner.closeScanDialog();
		}
	}

	function onScan() {
		BarcodeScanner.scan(onScanSuccess, onScanError, onScanLiveupdate);
	}

	QUnit.done(function () {
		document.getElementById("qunit-fixture").style.display = "none";
	});
});
