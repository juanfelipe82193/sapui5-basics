/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/Element'],function(E){"use strict";var S=E.extend("sap.ui.mdc.link.SemanticObjectMapping",{metadata:{library:"sap.ui.mdc",properties:{semanticObject:{type:"string"}},defaultAggregation:"items",aggregations:{items:{type:"sap.ui.mdc.link.SemanticObjectMappingItem",multiple:true,singularName:"item"}}}});return S;});
