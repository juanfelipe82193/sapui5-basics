QUnit.module('Auth.TestHelper for APF', {
	beforeEach : function (assert) {
		var done = assert.async();
		this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(done, function () {
			done();
		});
	},
	afterEach : function (assert) {
		
	}
});


QUnit.test('Check XSE ressource access', function(assert) {
	var done = assert.async();
	jQuery.ajax({
		url: "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
		type: "GET",
		success : function (oData, sStatus, oJqXHR) {
			assert.ok(oData);
			assert.ok(oJqXHR.responseXML);
			done();
		},
		error : function () {
			assert.ok(false, "Access denied.");
			done();
		}
	});
});