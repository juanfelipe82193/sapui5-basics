jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper/');
jQuery.sap.require("sap.apf.core.entityTypeMetadata");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.metadata');

(function() {
	'use strict';

	QUnit.module('Check creation', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck();
		}
	});
	QUnit.test('wrong argument for entitytype', function(assert) {
		assert.throws(function() {
			new sap.apf.core.EntityTypeMetadata(this.oIfMessageHandler, 1);
		}, "Error successfully thrown due to wrong creation");
	});
	QUnit.test('wrong argument for metadata', function(assert) {
		assert.throws(function() {
			new sap.apf.core.EntityTypeMetadata(this.oIfMessageHandler, "entitytype", {});
		}, "Error successfully thrown due to wrong creation");
	});
	QUnit.module('Get property metadata', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck();
			this.oMetadata = new sap.apf.testhelper.doubles.Metadata({
				instances : {
					messageHandler : this.oIfMessageHandler
				},
				constructors: {
					Hashtable : sap.apf.utils.Hashtable
				}
			});
			this.oEntityTypeOneMetadata = new sap.apf.core.EntityTypeMetadata(this.oIfMessageHandler, 'entityTypeOne', this.oMetadata);
			this.oEntityTypeTwoMetadata = new sap.apf.core.EntityTypeMetadata(this.oIfMessageHandler, 'entityTypeTwo', this.oMetadata);
			this.oMetadata.setPropertyMetadata('entityTypeOne', [ {
				name : 'property1_1',
				metadata : {
					attribute1 : '1_1_one',
					attribute2 : '1_1_two',
					dataType : {
						EdmType : 'Edm.Decimal',
						Precision : '34'
					},
					attribute3 : '1_1_three'
				}
			}, {
				name : 'property1_2',
				metadata : {
					attribute1 : '1_2_one',
					attribute2 : '1_2_two',
					dataType : {
						EdmType : 'Edm.String',
						MaxLength : '42'
					},
					attribute3 : '1_2_three'
				}
			}, {
				name : 'property1_3',
				metadata : {
					attribute1 : '1_3_one',
					attribute2 : '1_3_two',
					dataType : {
						EdmType : 'Edm.DateTime'
					},
					attribute3 : '1_3_three'
				}
			}, {
				name : 'property1_4',
				metadata : {
					attribute1 : '1_4_one',
					attribute2 : '1_4_two',
					dataType : {
						EdmType : 'Edm.Int32'
					},
					attribute3 : '1_4_three'
				}
			} ]);
			this.oMetadata.setPropertyMetadata('entityTypeTwo', [ {
				name : 'property2_1',
				metadata : {
					attribute1 : '2_1_one',
					attribute2 : '2_1_two',
					dataType : {
						EdmType : 'Edm.Int32'
					},
					attribute3 : '2_2_three'
				}
			}, {
				name : 'property2_2',
				metadata : {
					attribute1 : '2_2_one',
					attribute2 : '2_2_two',
					dataType : {
						EdmType : 'Edm.Decimal',
						Precision : '34'
					},
					attribute3 : '2_2_three'
				}
			}, {
				name : 'property2_3',
				metadata : {
					attribute1 : '2_3_one',
					attribute2 : '2_3_two',
					dataType : {
						EdmType : 'Edm.String',
						MaxLength : '42'
					},
					attribute3 : '2_3_three'
				}
			}, {
				name : 'property2_4',
				metadata : {
					attribute1 : '2_4_one',
					attribute2 : '2_4_two',
					dataType : {
						EdmType : 'Edm.DateTime'
					},
					attribute3 : '2_4_three'
				}
			} ]);
		}
	});
	QUnit.test('Correct "OData Edm-Type" for valid properties', function(assert) {
		var oDataTypeProperty1 = this.oEntityTypeOneMetadata.getPropertyMetadata('property1_1').dataType;
		var oDataTypeProperty2 = this.oEntityTypeTwoMetadata.getPropertyMetadata('property2_1').dataType;
		assert.equal(oDataTypeProperty1.EdmType, 'Edm.Decimal', 'Correct edm type expected');
		assert.equal(oDataTypeProperty2.EdmType, 'Edm.Int32', 'Correct edm type expected');
	});
	QUnit.test('Empty "dataType"-subobject for invalid property name', function(assert) {
		assert.equal(this.oEntityTypeOneMetadata.getPropertyMetadata('unknownProperty').dataType.EdmType, undefined, 'Existence of property "dataType" expected');
	});
	QUnit.test('Additional attribute for OData Edm-Type \'Edm.String\'', function(assert) {
		var oDataTypeProperty = this.oEntityTypeOneMetadata.getPropertyMetadata('property1_2').dataType;
		var oExpected = {
			EdmType : 'Edm.String',
			MaxLength : '42'
		};
		assert.deepEqual(oDataTypeProperty, oExpected, 'Correct type object expected');
	});

}());