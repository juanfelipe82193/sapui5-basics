jQuery.sap.require('sap.apf.core.constants');
jQuery.sap.require('sap.apf.core.binding');
jQuery.sap.require('sap.apf.ui.representations.representationInterface');

QUnit.module('Representation Double', {
	beforeEach : function(assert) {
		var oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
		var oCoreApi =  new sap.apf.testhelper.doubles.CoreApi({
			instances: {
				messageHandler : oMessageHandler
			}
		}).doubleMessaging();
		this.oApi = new sap.apf.testhelper.doubles.ApfApi({ messageHandler : oMessageHandler, coreApi : oCoreApi}).doubleStandardMethods();
	},
	createThreeSelections : function() {
		var data = [ 'data1', 'data2', 'data3' ];
		var representation = new sap.apf.testhelper.doubles.Representation(this.oApi , {
			id : 'threeSelections',
			sRepresentationType : 'RepresentationTestDouble'
		});
		representation.setData(data);
		representation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.all);
		return representation;
	},
	createFiveSelections : function() {
		var data = [ 'data1', 'data2', 'data3', 'data4', 'data5' ];
		var representation = new sap.apf.testhelper.doubles.Representation(this.oApi, {
			id : 'threeSelections',
			sRepresentationType : 'RepresentationTestDouble'
		});
		representation.setData(data);
		representation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.all);
		return representation;
	}
});
QUnit.test('Get objects that have been set by setData()-method', function(assert) {
	var oDouble = new sap.apf.testhelper.doubles.Representation(this.oApi, {
		id : 'double1',
		sRepresentationType : 'RepresentationTestDouble'
	});
	oDouble.setData({}, {
		metadataDouble : 'metadatadouble'
	});
	assert.equal(oDouble.getParametersOfSetData().metadata.metadataDouble, 'metadatadouble', 'Metadata instance expected');
});
QUnit.test('Emulate filter method type start filter', function(assert) {
	var oDouble = new sap.apf.testhelper.doubles.Representation(this.oApi, {
		id : 'double1',
		sRepresentationType : 'RepresentationTestDouble'
	});
	oDouble.emulateFilterMethodType(sap.apf.core.constants.filterMethodTypes.startFilter);
	assert.equal(oDouble.getFilterMethodType(),'sf', 'Emulated filter method type expected');
});
QUnit.test('Selection adoption in target representation succeeds', function(assert) {
	var oSource = this.createThreeSelections();
	var oTarget = this.createFiveSelections();	
	
	oTarget.emulateSelectionAdoptionSuccessful();
	oTarget.adoptSelection(oSource);

	assert.deepEqual(oTarget.getSelectionAsArray().length, 3, 'Adoption of selection from source representation expected');
});
QUnit.test('Selection adoption in target representation fails', function(assert) {
	var oSource = this.createThreeSelections();
	var oTarget = this.createFiveSelections();	
	
	oTarget.emulateSelectionAdoptionFailed();
	oTarget.adoptSelection(oSource);
	
	assert.deepEqual(oTarget.getSelectionAsArray().length, 5, 'No adoption of selection from source representation expected');
});
QUnit.test('Serialize / deserialize of Representation', function(assert) {
	var oRepresentation = this.createThreeSelections();
	var aSelections = oRepresentation.getSelectionAsArray();
	var oSerializableRepresentation = oRepresentation.serialize();
	assert.ok(oSerializableRepresentation.indicesOfSelectedData.length === 3, "Serializable representation object has three selections"); 
	
	var oNewRepresentation = new sap.apf.testhelper.doubles.Representation(this.oApi, {
		id : 'threeSelections',
		sRepresentationType : 'RepresentationTestDouble'
	});
	oNewRepresentation.deserialize(oSerializableRepresentation);
	assert.deepEqual(aSelections, oNewRepresentation.getSelectionAsArray(), "Representation has same selection after deserialization");
});