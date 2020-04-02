sap.ui.define([], function(){
	'use strict';

	function Metadata(oInject, sAbsolutePathToServiceDocument) {
		var Hashtable = (oInject.constructors && oInject.constructors.Hashtable) || sap.apf.utils.Hashtable;
		var oEntityTypes = new Hashtable(oInject.instances.messageHandler);
		this.type = "metadata";
		this.isInitialized = function() {
			return jQuery.Deferred().resolve(this);
		};
		this.getPropertyMetadata = function(sEntityType, sPropertyName) {
			if (!sEntityType || !sPropertyName || !oEntityTypes.getItem(sEntityType)) {
				return {
					dataType: {}
				};
			}
			return oEntityTypes.getItem(sEntityType).getItem(sPropertyName);
		};
		this.getUriComponents = function(sEntitySetName) {
			return {
				entitySet: sEntitySetName,
				navigationProperty: "Results"
			};
		};
		this.getEntityTypeAnnotations = function(sEntityType) {
			if (!sEntityType || !oEntityTypes.getItem(sEntityType) || !oEntityTypes.getItem(sEntityType).getItem("extensions")) {
				return [];
			}
			return oEntityTypes.getItem(sEntityType).getItem("extensions");
		};
		this.getParameterEntitySetKeyProperties = function(sEntityType) {
			if (!sEntityType || !oEntityTypes.getItem(sEntityType)) {
				return [];
			}
			return oEntityTypes.getItem(sEntityType).getItem('Parameters');
		};
		this.getFilterableProperties = function(sEntityType) {
			return this.getBooleanAnnotationByName(sEntityType, 'filterable');
		};
		this.getBooleanAnnotationByName = function(sEntityType, sAnnotation) {
			if (!sEntityType || !oEntityTypes.getItem(sEntityType)) {
				return [];
			}
			var aResults = [];
			var aProperties;
			aProperties = oEntityTypes.getItem(sEntityType).getKeys();
			for (var i = 0; i < aProperties.length; i++) {
				if (oEntityTypes.getItem(sEntityType).getItem(aProperties[i])[sAnnotation] === true) {
					aResults.push(oEntityTypes.getItem(sEntityType).getItem(aProperties[i]).name);
				}
			}
			return aResults;
		};
		/*
		 * Test double helper methods
		 * Used to parameterize a test double instance before usage in tests
		 */
		this.setPropertyMetadata = function(sEntityType, aPropertyMetadata) {
			var oEntityType, i;
			if (!oEntityTypes.hasItem(sEntityType)) {
				oEntityTypes.setItem(sEntityType, new oInject.constructors.Hashtable(oInject.instances.messageHandler));
			}
			oEntityType = oEntityTypes.getItem(sEntityType);
			for (i = 0; i < aPropertyMetadata.length; i++) {
				setPropertyMetadataSingle(oEntityType, aPropertyMetadata[i].name, aPropertyMetadata[i].metadata);
			}
		};

		function setPropertyMetadataSingle(oEntityType, sProperty, oPropertyMetadata) {
			var sMetadata = '';
			var oProperty;
			if (!oEntityType.hasItem(sProperty)) {
				oEntityType.setItem(sProperty, {});
				oEntityType.getItem(sProperty)['name'] = sProperty;
			}
			oProperty = oEntityType.getItem(sProperty);
			for (sMetadata in oPropertyMetadata) {
				oProperty[sMetadata] = oPropertyMetadata[sMetadata];
			}
		}

		this.addFilterRequiredAnnotations = function(sEntityType, aProperties) {
			var oEntitytypeMetadata;

			function getFilterRequiredTemplate() {
				return {
					name: '',
					extensions: []
				};
			}

			oEntitytypeMetadata = getFilterRequiredTemplate();
			oEntitytypeMetadata.name = sEntityType;
			oEntitytypeMetadata.extensions.push({
				"requiresFilter": "true",
				"requiredProperties": aProperties.join()
			});
			oEntitytypeMetadata.requiresFilter = "true";
			if (oEntitytypeMetadata.requiredProperties) {
				oEntitytypeMetadata.requiredProperties = oEntitytypeMetadata.requiredProperties + aProperties.join();
			} else {
				oEntitytypeMetadata.requiredProperties = aProperties.join();
			}
			this.addEntityTypeMetadata(sEntityType, oEntitytypeMetadata);
		};
		this.addFilterableAnnotations = function(sEntityType, oFilterable) {
			var aFilterable = [];
			var oFilter;

			function getFilterableTemplate() {
				return {
					name: '',
					metadata: {
						'filterable': ''
					}
				};
			}

			for (var sFilterable in oFilterable) {
				oFilter = getFilterableTemplate();
				oFilter.name = sFilterable;
				oFilter.metadata['filterable'] = oFilterable[sFilterable];
				aFilterable.push(oFilter);
			}
			this.setPropertyMetadata(sEntityType, aFilterable);
		};
		this.addTypeAnnotations = function(sEntityType, oODataTypes) {
			var aODataTypes = [];
			var oODataType;

			function getODataTypeTemplate() {
				return {
					name: '',
					metadata: {
						dataType: {
							EdmType: ''
						}
					}
				};
			}

			for (var sType in oODataTypes) {
				oODataType = getODataTypeTemplate();
				oODataType.name = sType;
				oODataType.metadata.dataType.EdmType = oODataTypes[sType];
				aODataTypes.push(oODataType);
			}
			this.setPropertyMetadata(sEntityType, aODataTypes);
		};
		this.addParameters = function(sEntityType, aParameters) {
			if (!oEntityTypes.hasItem(sEntityType)) {
				oEntityTypes.setItem(sEntityType, new oInject.constructors.Hashtable(oInject.instances.messageHandler));
			}
			if (!oEntityTypes.getItem(sEntityType).hasItem('Parameters')) {
				oEntityTypes.getItem(sEntityType).setItem('Parameters', aParameters);
			}
		};
		this.addNewParameter = function(sEntityType, oParameter) {
			var aParameters = oEntityTypes.getItem(sEntityType).getItem('Parameters');
			aParameters.push(oParameter);
			oEntityTypes.getItem(sEntityType).setItem('Parameters', aParameters);
		};
		this.addEntityTypeMetadata = function(sEntityType, aExtensions) {
			if (!oEntityTypes.hasItem(sEntityType)) {
				oEntityTypes.setItem(sEntityType, new oInject.constructors.Hashtable(oInject.instances.messageHandler));
			}
			if (!oEntityTypes.getItem(sEntityType).hasItem('extensions')) {
				oEntityTypes.getItem(sEntityType).setItem('extensions', aExtensions);
			}
		};
		this.getODataModel = function() {
			return {
				getServiceMetadata: function() {
				}
			};
		};
		//TODO Remove following 'fixed' entity types once tests are cleaned up, i.e. metadata test double is always parametrized in the test file itself
		this.addFilterableAnnotations('entityTypeWithParams', {
			'FilterPropertyOne': true,
			'FilterPropertyTwo': true,
			'FilterPropertyThree': true,
			'FilterPropertyFour': false
		});
		this.addParameters('entityTypeWithParams', [{
			'name': 'p_stringParameter',
			'defaultValue': "defaultString",
			'dataType': {
				'type': 'Edm.String'
			}
		}, {
			'name': 'p_int32Parameter',
			'defaultValue': 10,
			'dataType': {
				'type': 'Edm.Int32'
			}
		}]);
		this.addTypeAnnotations('entityTypeWithParams', {
			stringProperty: 'Edm.String',
			int32Property: 'Edm.Int32'
		});
		this.addFilterableAnnotations('entityTypeWithoutParams', {
			'FilterPropertyOne': true,
			'name': true
		});
		this.setPropertyMetadata('entityTypeWithParams', [{
			name: 'stringProperty',
			metadata: {
				dataType: {
					type: 'Edm.String',
					maxLength: '30'
				},
				'aggregation-role': 'dimension'
			}
		}, {
			name: 'int32Property',
			metadata: {
				dataType: {
					type: 'Edm.Int32'
				},
				'aggregation-role': 'measure',
				'filterable': false
			}
		}]);
	}

	sap.apf.testhelper.doubles.Metadata = Metadata;
	return Metadata;
}, true /*GLOBAL_EXPORT*/);
