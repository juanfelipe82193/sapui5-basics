QUnit.module('Configuration Double');

QUnit.test('Get instance', function(assert) {
	assert.ok(sap.apf.testhelper.config.getSampleConfiguration(), 'Configuration double instance expected');

});

QUnit.test('Fresh instance per call', function(assert) {
	var resultFirstCall = sap.apf.testhelper.config.getSampleConfiguration();
	var resultSecondCall = sap.apf.testhelper.config.getSampleConfiguration();
	assert.notEqual(resultFirstCall, resultSecondCall, 'Different instances expected');
});

QUnit.test('Different instances have same content', function(assert) {
	var resultFirstCall = sap.apf.testhelper.config.getSampleConfiguration();
	var resultSecondCall = sap.apf.testhelper.config.getSampleConfiguration();
	assert.deepEqual(resultFirstCall, resultSecondCall, 'Same content per instance expected');
});

QUnit.test('Local change in instance', function(assert) {
	var resultFirstCall = sap.apf.testhelper.config.getSampleConfiguration();
	var resultSecondCall = sap.apf.testhelper.config.getSampleConfiguration();
	resultSecondCall.steps[0].id = 'testChange';
	assert.notDeepEqual(resultFirstCall, resultSecondCall, 'Different content per instance expected');
});