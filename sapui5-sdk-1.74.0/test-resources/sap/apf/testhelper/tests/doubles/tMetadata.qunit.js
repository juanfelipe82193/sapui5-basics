jQuery.sap.require('sap.apf.utils.hashtable');

function commonSetup_tMData(oContext) {
	
	var oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
    oIfMessageHandler.raiseOnCheck();
    var oInject = {hashtable : sap.apf.utils.Hashtable, messageHandler : oIfMessageHandler};
	oContext.oMetadata = new sap.apf.testhelper.doubles.Metadata(oInject, "");
}

QUnit.module('Doubled methods', {
	beforeEach : function(assert) {
		commonSetup_tMData(this);
	}	
});

QUnit.test('Get edm-type for property', function(assert) {
	assert.equal(this.oMetadata.getPropertyMetadata(), undefined);
	assert.equal(this.oMetadata.getPropertyMetadata('entityTypeWithParams', 'stringProperty').dataType.type, 'Edm.String');
	assert.equal(this.oMetadata.getPropertyMetadata('entityTypeWithParams', 'int32Property').dataType.type, 'Edm.Int32');
});

QUnit.test('Get parameter entity set key properties for entity type', function(assert) {
	assert.equal(this.oMetadata.getParameterEntitySetKeyProperties(), undefined);
	assert.deepEqual(this.oMetadata.getParameterEntitySetKeyProperties('entityTypeWithParams'), [ {
		"dataType" : {
			'type' : 'Edm.String'
		},
		'defaultValue': "defaultString",
		'name' : 'p_stringParameter'
	}, {
		"dataType" : {
			'type' : 'Edm.Int32'	
		},
		'defaultValue': 10,
		'name' : 'p_int32Parameter'
	}]);
});


QUnit.test('Get filterable properties from entityType that has explicitely assigned filterable properties', function(assert) {
	assert.deepEqual(this.oMetadata.getFilterableProperties('entityTypeWithParams'), ['FilterPropertyOne', 'FilterPropertyTwo', 'FilterPropertyThree'], 'Three filter properties expected');
});

QUnit.module('Parametrization methods', {
	beforeEach : function(assert) {
		commonSetup_tMData(this);
	}	
});

QUnit.test('Set property metadata', function(assert) {
	this.oMetadata.setPropertyMetadata('anyEntityType', [{
		name : 'myProperty1',
		metadata : {
			attribute1 : 'one',
			attribute2 : 'two'
			}
		},{
		name : 'myProperty2',
		metadata : {
			attribute1 : 'three',
			attribute2 : 'four'
			}
		}
	]);
	assert.equal(this.oMetadata.getPropertyMetadata('anyEntityType', 'myProperty2').name, 'myProperty2', 'Correct property name annotation expected');
	assert.equal(this.oMetadata.getPropertyMetadata('anyEntityType', 'myProperty2').attribute1, 'three', 'Correct value for annotation expected');
});

QUnit.test('Annotate properties of entity type with filterable attribute', function(assert) {
	this.oMetadata.addFilterableAnnotations('entityTypeWithFilterableAnnotations', {
		myProp1 : true,
		myProp2 : false,
		myProp3 : true
	});
	assert.deepEqual(this.oMetadata.getFilterableProperties('entityTypeWithFilterableAnnotations'), ['myProp1', 'myProp3'], 'Two filterable properties expected');
});

QUnit.test('Annotate properties of entity type with filter required attribute', function(assert) {
	this.oMetadata.addFilterRequiredAnnotations('entityTypeWithFilterRequiredAnnotations', ["myProp1"]);
	var oEntityTypeMetadata = this.oMetadata.getEntityTypeMetadata('entityTypeWithFilterRequiredAnnotations');
	assert.ok(oEntityTypeMetadata.requiresFilter !== undefined && oEntityTypeMetadata.requiresFilter === "true", 'Entity type requires filter');
	assert.equal(oEntityTypeMetadata.requiredProperties,'myProp1','One property expected as required for the entity type');
});

QUnit.test('Add parameters to entity type', function(assert) {
	this.oMetadata.addParameters('entityTypeWithParameters', [ {
		'name' : 'myParam1',
		'nullable' : 'false',
		'dataType' : {
			'type' : 'Edm.Int32',
			'defaultValue': 10
		},
		'parameter' : 'mandatory'
	}, {
		'name' : 'myParam2',
		'maxLength' : '5',
		'nullable' : 'false',
		'dataType' : {
			'type' : 'Edm.String',
			'defaultValue': 20
		},
		'parameter' : 'mandatory'
	}]);
	assert.deepEqual(this.oMetadata.getParameterEntitySetKeyProperties('entityTypeWithParameters'), [ {
		'name' : 'myParam1',
		'nullable' : 'false',
		'dataType' : {
			'type' : 'Edm.Int32',
			'defaultValue': 10
		},
		'parameter' : 'mandatory'
	}, {
		'name' : 'myParam2',
		'maxLength' : '5',
		'nullable' : 'false',
		'dataType' : {
			'type' : 'Edm.String',
			'defaultValue': 20
		},
		'parameter' : 'mandatory'
	}], 'Array containing parameter objects expected');
});
