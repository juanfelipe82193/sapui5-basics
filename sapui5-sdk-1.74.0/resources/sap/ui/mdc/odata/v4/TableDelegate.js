/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/mdc/TableDelegate"],function(T){"use strict";var O=Object.assign({},T);O.fetchProperties=function(t){var m=t.getDelegate().payload,p=[],P,o,e,M,a,b;e="/"+m.collectionName;M=t.getModel(m.model);a=M.getMetaModel();return Promise.all([a.requestObject(e+"/"),a.requestObject(e+"@")]).then(function(r){var E=r[0],c=r[1];var s=c["@Org.OData.Capabilities.V1.SortRestrictions"]||{};var n=(s["NonSortableProperties"]||[]).map(function(C){return C["$PropertyPath"];});for(var k in E){o=E[k];if(o&&o.$kind==="Property"){b=a.getObject(e+"/"+k+"@");P={name:k,label:b["@com.sap.vocabularies.Common.v1.Label"],description:b["@com.sap.vocabularies.Common.v1.Text"]&&b["@com.sap.vocabularies.Common.v1.Text"].$Path,maxLength:o.$MaxLength,precision:o.$Precision,scale:o.$Scale,type:o.$Type,sortable:n.indexOf(k)==-1,filterable:true};p.push(P);}}return p;});};O.rebindTable=function(m,r,s){if(s){r.parameters.$search=s;}T.rebindTable(m,r);};return O;});
