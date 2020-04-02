/* global QUnit, sinon */

sap.ui.define([
	"sap/ui/comp/smartfield/ODataHelper",
	"sap/ui/comp/smartfield/BindingUtil",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/odata/ODataMetaModel",
	"test-resources/sap/ui/comp/qunit/smartfield/QUnitHelper",
	"sap/ui/model/json/JSONModel",
	"sap/ui/thirdparty/jquery",
	"sap/base/util/merge",
	"sap/base/Log",
	"test-resources/sap/ui/comp/qunit/smartfield/data/TestModel.data",
	"test-resources/sap/ui/comp/qunit/smartfield/data/ComplexTestModel.data"

], function(
	ODataHelper,BindingUtil,
	ODataModel,
	ODataMetaModel,
	QUnitHelper,
	JSONModel,
	jQuery,
	merge,
	Log,
	TestModelTestData,
	ComplexTestModelTestData

) {
	"use strict";

	var oSimpleTestModel = TestModelTestData.TestModel;
	var oTestModel2 = JSON.parse('{"version":"1.0","dataServices":{"dataServiceVersion":"2.0","schema":[{"namespace":"com.sap.GL.ZAF","entityType":[{"name":"GL_ACCOUNT","key":{"propertyRef":[{"name":"CompanyCode"},{"name":"GLAccount"}]},"property":[{"name":"CompanyCode","type":"Edm.String","nullable":"false","maxLength":"4","extensions":[{"name":"filter-restriction","value":"multi-value","namespace":"SAPData"},{"name":"required-in-filter","value":"true","namespace":"SAPData"},{"name":"label","value":"Company","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]},{"name":"GLAccount","type":"Edm.String","nullable":"false","maxLength":"10","extensions":[{"name":"label","value":"Account","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]},{"name":"ChartOfAccount","type":"Edm.String","nullable":"false","maxLength":"4","extensions":[{"name":"label","value":"Chart Of Account","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]},{"name":"Description","type":"Edm.String","nullable":"false","maxLength":"50","extensions":[{"name":"label","value":"Description","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]}],"navigationProperty":[{"name":"GL_ACCOUNT_BALANCE","relationship":"com.sap.GL.ZAF.ACCOUNT_ACCOUNT_BALANCE","fromRole":"FromRole_ACCOUNT_ACCOUNT_BALANCE","toRole":"ToRole_ACCOUNT_ACCOUNT_BALANCE"}],"extensions":[{"name":"label","value":"GL Account","namespace":"SAPData"},{"name":"content-version","value":"1","namespace":"SAPData"}]},{"name":"LINE_ITEM","key":{"propertyRef":[{"name":"Ledger"},{"name":"CompanyCode"},{"name":"LedgerFiscalYear"},{"name":"LedgerAccountingDocument"},{"name":"LedgerGLLineItem"}]},"property":[{"name":"GLAccount","type":"Edm.String","nullable":"false","maxLength":"10","extensions":[{"name":"label","value":"Account","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"}]},{"name":"Ledger","type":"Edm.String","nullable":"false","maxLength":"2","extensions":[{"name":"label","value":"Ledger","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"}]},{"name":"CompanyCode","type":"Edm.String","nullable":"false","maxLength":"4","extensions":[{"name":"label","value":"Company","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"}]},{"name":"LedgerFiscalYear","type":"Edm.String","nullable":"false","maxLength":"4","extensions":[{"name":"label","value":"Year","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"}]},{"name":"LedgerFiscalPeriod","type":"Edm.String","nullable":"false","maxLength":"3","extensions":[{"name":"label","value":"Period","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"filterable","value":"false","namespace":"SAPData"}]},{"name":"LedgerAccountingDocument","type":"Edm.String","nullable":"false","maxLength":"10","extensions":[{"name":"label","value":"Document","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"}]},{"name":"LedgerGLLineItem","type":"Edm.String","nullable":"false","maxLength":"6","extensions":[{"name":"label","value":"Item","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"}]},{"name":"PostingDate","type":"Edm.DateTime","nullable":"false","precision":"0","extensions":[{"name":"display-format","value":"Date","namespace":"SAPData"},{"name":"filter-restriction","value":"interval","namespace":"SAPData"},{"name":"label","value":"Posting Date","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"}]},{"name":"Amount","type":"Edm.Decimal","precision":"28","scale":"3","extensions":[{"name":"unit","value":"CurrencyCode","namespace":"SAPData"},{"name":"label","value":"Balance","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"filterable","value":"false","namespace":"SAPData"}]},{"name":"CurrencyCode","type":"Edm.String","nullable":"false","maxLength":"5","extensions":[{"name":"label","value":"Currency","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"filterable","value":"false","namespace":"SAPData"},{"name":"semantics","value":"currency-code","namespace":"SAPData"}]}],"extensions":[{"name":"label","value":"Line Item","namespace":"SAPData"},{"name":"content-version","value":"1","namespace":"SAPData"}]},{"name":"ACCOUNTING_DOCUMENT","key":{"propertyRef":[{"name":"CompanyCode"},{"name":"DocumentID"},{"name":"Year"},{"name":"ItemID"}]},"property":[{"name":"CompanyCode","type":"Edm.String","nullable":"false","maxLength":"4","extensions":[{"name":"label","value":"Company Code","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]},{"name":"DocumentID","type":"Edm.String","nullable":"false","maxLength":"10","extensions":[{"name":"label","value":"Document Number","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]},{"name":"Year","type":"Edm.String","nullable":"false","maxLength":"4","extensions":[{"name":"label","value":"Fiscal Year","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]},{"name":"ItemID","type":"Edm.String","nullable":"false","maxLength":"3","extensions":[{"name":"label","value":"Line item","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]},{"name":"RegionCode","type":"Edm.String","nullable":"false","maxLength":"3","extensions":[{"name":"label","value":"Region","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]},{"name":"Amount","type":"Edm.Decimal","nullable":"false","precision":"28","scale":"3","extensions":[{"name":"unit","value":"CurrencyCode","namespace":"SAPData"},{"name":"label","value":"Amount","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"},{"name":"filterable","value":"false","namespace":"SAPData"}]},{"name":"CurrencyCode","type":"Edm.String","nullable":"false","maxLength":"5","extensions":[{"name":"label","value":"Currency","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"},{"name":"filterable","value":"false","namespace":"SAPData"},{"name":"semantics","value":"currency-code","namespace":"SAPData"}]}],"extensions":[{"name":"label","value":"Accounting Document","namespace":"SAPData"},{"name":"content-version","value":"1","namespace":"SAPData"}]},{"name":"GEO_COORDINATES","key":{"propertyRef":[{"name":"CountryCode"},{"name":"RegionCode"}]},"property":[{"name":"CountryCode","type":"Edm.String","nullable":"false","maxLength":"3","extensions":[{"name":"filter-restriction","value":"single-value","namespace":"SAPData"},{"name":"label","value":"Country","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]},{"name":"RegionCode","type":"Edm.String","nullable":"false","maxLength":"3","extensions":[{"name":"label","value":"Region","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]},{"name":"Longitude","type":"Edm.Double","nullable":"false","extensions":[{"name":"label","value":"Longitude","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"},{"name":"filterable","value":"false","namespace":"SAPData"}]},{"name":"Latitude","type":"Edm.Double","nullable":"false","extensions":[{"name":"label","value":"Latitude","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"},{"name":"filterable","value":"false","namespace":"SAPData"}]}],"extensions":[{"name":"label","value":"Geo Coordinates","namespace":"SAPData"},{"name":"content-version","value":"1","namespace":"SAPData"}]},{"name":"COUNTRY","key":{"propertyRef":[{"name":"CountryCode"}]},"property":[{"name":"CountryCode","type":"Edm.String","nullable":"false","maxLength":"3","extensions":[{"name":"text","value":"Description","namespace":"SAPData"},{"name":"label","value":"Country","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]},{"name":"Description","type":"Edm.String","nullable":"false","maxLength":"50","extensions":[{"name":"label","value":"Long name","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]}],"extensions":[{"name":"label","value":"Country","namespace":"SAPData"},{"name":"content-version","value":"1","namespace":"SAPData"}]},{"name":"REGION","key":{"propertyRef":[{"name":"CountryCode"},{"name":"RegionCode"}]},"property":[{"name":"CountryCode","type":"Edm.String","nullable":"false","maxLength":"3","extensions":[{"name":"label","value":"Country","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]},{"name":"RegionCode","type":"Edm.String","nullable":"false","maxLength":"3","extensions":[{"name":"text","value":"Description","namespace":"SAPData"},{"name":"label","value":"Region","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]},{"name":"Description","type":"Edm.String","nullable":"false","maxLength":"20","extensions":[{"name":"label","value":"Description","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]}],"extensions":[{"name":"label","value":"Region","namespace":"SAPData"},{"name":"content-version","value":"1","namespace":"SAPData"}]},{"name":"GL_ACCOUNT_BALANCE","key":{"propertyRef":[{"name":"Ledger"},{"name":"LedgerFiscalYear"},{"name":"CompanyCode"},{"name":"GLAccount"}]},"property":[{"name":"AccmltdBalAmtInCoCodeCrcy","type":"Edm.Decimal","precision":"28","scale":"3","extensions":[{"name":"unit","value":"CurrencyCode","namespace":"SAPData"},{"name":"label","value":"Balance","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"},{"name":"filterable","value":"false","namespace":"SAPData"}]},{"name":"CurrencyCode","type":"Edm.String","nullable":"false","maxLength":"5","extensions":[{"name":"label","value":"Currency","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"},{"name":"filterable","value":"false","namespace":"SAPData"},{"name":"semantics","value":"currency-code","namespace":"SAPData"}]},{"name":"Ledger","type":"Edm.String","nullable":"false","maxLength":"2","extensions":[{"name":"label","value":"Ledger","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]},{"name":"LedgerFiscalYear","type":"Edm.String","nullable":"false","maxLength":"4","extensions":[{"name":"label","value":"Fiscal Year","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]},{"name":"CompanyCode","type":"Edm.String","nullable":"false","maxLength":"4","extensions":[{"name":"label","value":"Company","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]},{"name":"GLAccount","type":"Edm.String","nullable":"false","maxLength":"10","extensions":[{"name":"label","value":"Account","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"},{"name":"filterable","value":"false","namespace":"SAPData"}]}],"navigationProperty":[{"name":"GL_ACCOUNT","relationship":"com.sap.GL.ZAF.ACCOUNT_ACCOUNT_BALANCE","fromRole":"ToRole_ACCOUNT_ACCOUNT_BALANCE","toRole":"FromRole_ACCOUNT_ACCOUNT_BALANCE"}],"extensions":[{"name":"label","value":"GL Account Balance","namespace":"SAPData"},{"name":"content-version","value":"1","namespace":"SAPData"}]},{"name":"COMPANY","key":{"propertyRef":[{"name":"CompanyCode"}]},"property":[{"name":"CompanyCode","type":"Edm.String","nullable":"false","maxLength":"4","extensions":[{"name":"text","value":"CompanyName","namespace":"SAPData"},{"name":"label","value":"Company","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"}]},{"name":"CompanyName","type":"Edm.String","nullable":"false","maxLength":"25","extensions":[{"name":"label","value":"Name","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"}]},{"name":"City","type":"Edm.String","nullable":"false","maxLength":"25","extensions":[{"name":"label","value":"City","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"},{"name":"filterable","value":"false","namespace":"SAPData"}]},{"name":"CurrencyCode","type":"Edm.String","nullable":"false","maxLength":"5","extensions":[{"name":"label","value":"Currency","namespace":"SAPData"},{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"sortable","value":"false","namespace":"SAPData"},{"name":"semantics","value":"currency-code","namespace":"SAPData"}]}],"extensions":[{"name":"label","value":"Company","namespace":"SAPData"},{"name":"content-version","value":"1","namespace":"SAPData"}]}],"association":[{"name":"ACCOUNT_ACCOUNT_BALANCE","end":[{"type":"com.sap.GL.ZAF.GL_ACCOUNT","multiplicity":"1","role":"FromRole_ACCOUNT_ACCOUNT_BALANCE"},{"type":"com.sap.GL.ZAF.GL_ACCOUNT_BALANCE","multiplicity":"*","role":"ToRole_ACCOUNT_ACCOUNT_BALANCE"}],"referentialConstraint":{"principal":{"role":"FromRole_ACCOUNT_ACCOUNT_BALANCE","propertyRef":[{"name":"CompanyCode"},{"name":"GLAccount"}]},"dependent":{"role":"ToRole_ACCOUNT_ACCOUNT_BALANCE","propertyRef":[{"name":"CompanyCode"},{"name":"GLAccount"}]}},"extensions":[{"name":"content-version","value":"1","namespace":"SAPData"}]}],"entityContainer":[{"name":"com.sap.GL.ZAF_Entities","isDefaultEntityContainer":"true","entitySet":[{"name":"LINE_ITEMS","entityType":"com.sap.GL.ZAF.LINE_ITEM","extensions":[{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"deletable","value":"false","namespace":"SAPData"},{"name":"searchable","value":"true","namespace":"SAPData"},{"name":"pageable","value":"false","namespace":"SAPData"},{"name":"content-version","value":"1","namespace":"SAPData"}]},{"name":"ACCOUNTING_DOCUMENTSet","entityType":"com.sap.GL.ZAF.ACCOUNTING_DOCUMENT","extensions":[{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"deletable","value":"false","namespace":"SAPData"},{"name":"searchable","value":"true","namespace":"SAPData"},{"name":"pageable","value":"false","namespace":"SAPData"},{"name":"content-version","value":"1","namespace":"SAPData"}]},{"name":"GEO_COORDINATESSet","entityType":"com.sap.GL.ZAF.GEO_COORDINATES","extensions":[{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"deletable","value":"false","namespace":"SAPData"},{"name":"searchable","value":"true","namespace":"SAPData"},{"name":"pageable","value":"false","namespace":"SAPData"},{"name":"content-version","value":"1","namespace":"SAPData"}]},{"name":"COUNTRYSet","entityType":"com.sap.GL.ZAF.COUNTRY","extensions":[{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"deletable","value":"false","namespace":"SAPData"},{"name":"searchable","value":"true","namespace":"SAPData"},{"name":"pageable","value":"false","namespace":"SAPData"},{"name":"content-version","value":"1","namespace":"SAPData"}]},{"name":"REGIONSet","entityType":"com.sap.GL.ZAF.REGION","extensions":[{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"deletable","value":"false","namespace":"SAPData"},{"name":"searchable","value":"true","namespace":"SAPData"},{"name":"pageable","value":"false","namespace":"SAPData"},{"name":"content-version","value":"1","namespace":"SAPData"}]},{"name":"GL_ACCOUNT_BALANCE_SET","entityType":"com.sap.GL.ZAF.GL_ACCOUNT_BALANCE","extensions":[{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"deletable","value":"false","namespace":"SAPData"},{"name":"searchable","value":"true","namespace":"SAPData"},{"name":"pageable","value":"false","namespace":"SAPData"},{"name":"content-version","value":"1","namespace":"SAPData"}]},{"name":"COMPANIES","entityType":"com.sap.GL.ZAF.COMPANY","extensions":[{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"deletable","value":"false","namespace":"SAPData"},{"name":"searchable","value":"true","namespace":"SAPData"},{"name":"pageable","value":"false","namespace":"SAPData"},{"name":"content-version","value":"1","namespace":"SAPData"}]},{"name":"GL_ACCOUNT_SET","entityType":"com.sap.GL.ZAF.GL_ACCOUNT","extensions":[{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"deletable","value":"false","namespace":"SAPData"},{"name":"searchable","value":"true","namespace":"SAPData"},{"name":"pageable","value":"false","namespace":"SAPData"},{"name":"content-version","value":"1","namespace":"SAPData"}]}],"associationSet":[{"name":"ACCOUNT_ACCOUNT_BALANCESet","association":"com.sap.GL.ZAF.ACCOUNT_ACCOUNT_BALANCE","end":[{"entitySet":"GL_ACCOUNT_SET","role":"FromRole_ACCOUNT_ACCOUNT_BALANCE"},{"entitySet":"GL_ACCOUNT_BALANCE_SET","role":"ToRole_ACCOUNT_ACCOUNT_BALANCE"}],"extensions":[{"name":"creatable","value":"false","namespace":"SAPData"},{"name":"updatable","value":"false","namespace":"SAPData"},{"name":"deletable","value":"false","namespace":"SAPData"},{"name":"content-version","value":"1","namespace":"SAPData"}]}],"functionImport":[{"name":"SendForClarification","returnType":"com.sap.GL.ZAF.GL_ACCOUNT_BALANCE","entitySet":"GL_ACCOUNT_BALANCE_SET","httpMethod":"GET","parameter":[{"name":"Receiver","type":"Edm.String","mode":"In"}]}]}],"annotations":[{"target":"com.sap.GL.ZAF.GL_ACCOUNT_BALANCE/CompanyCode","annotation":[{"term":"com.sap.vocabularies.Common.v1.ValueList","record":{"propertyValue":[{"property":"CollectionPath","string":"COMPANIES"},{"property":"SearchSupported","bool":"true"},{"property":"Parameters","collection":{"record":[{"type":"com.sap.vocabularies.Common.v1.ValueListParameterInOut","propertyValue":[{"property":"LocalDataProperty","propertyPath":"CompanyCode"},{"property":"ValueListProperty","string":"CompanyCode"}]},{"type":"com.sap.vocabularies.Common.v1.ValueListParameterIn","propertyValue":[{"property":"LocalDataProperty","propertyPath":"CurrencyCode"},{"property":"ValueListProperty","string":"CurrencyCode"}]},{"type":"com.sap.vocabularies.Common.v1.ValueListParameterOut","propertyValue":[{"property":"LocalDataProperty","propertyPath":"CompanyName"},{"property":"ValueListProperty","string":"CompanyName"}]},{"type":"com.sap.vocabularies.Common.v1.ValueListParameterOut","propertyValue":[{"property":"LocalDataProperty","propertyPath":"CurrencyCode"},{"property":"ValueListProperty","string":"CurrencyCode"}]}]}}]}}]},{"target":"com.sap.GL.ZAF.GL_ACCOUNT/CompanyCode","annotation":[{"term":"com.sap.vocabularies.Common.v1.ValueList","record":{"propertyValue":[{"property":"CollectionPath","string":"COMPANIES"},{"property":"SearchSupported","bool":"true"},{"property":"Parameters","collection":{"record":[{"type":"com.sap.vocabularies.Common.v1.ValueListParameterInOut","propertyValue":[{"property":"LocalDataProperty","propertyPath":"CompanyCode"},{"property":"ValueListProperty","string":"CompanyCode"}]},{"type":"com.sap.vocabularies.Common.v1.ValueListParameterIn","propertyValue":[{"property":"LocalDataProperty","propertyPath":"CurrencyCode"},{"property":"ValueListProperty","string":"CurrencyCode"}]},{"type":"com.sap.vocabularies.Common.v1.ValueListParameterOut","propertyValue":[{"property":"LocalDataProperty","propertyPath":"CompanyName"},{"property":"ValueListProperty","string":"CompanyName"}]},{"type":"com.sap.vocabularies.Common.v1.ValueListParameterOut","propertyValue":[{"property":"LocalDataProperty","propertyPath":"CurrencyCode"},{"property":"ValueListProperty","string":"CurrencyCode"}]}]}}]}}]},{"target":"com.sap.GL.ZAF.GL_ACCOUNT/CurrencyCode","annotation":[{"term":"com.sap.vocabularies.Common.v1.ValueList","record":{"propertyValue":[{"property":"CollectionPath","string":"CURRENCYSet"},{"property":"CollectionRoot","string":"foo/ZAF_CURRENCY_SRV"},{"property":"Parameters","collection":{"record":[{"type":"com.sap.vocabularies.Common.v1.ValueListParameterInOut","propertyValue":[{"property":"LocalDataProperty","propertyPath":"CurrencyCode"},{"property":"ValueListProperty","string":"CurrencyCode"}]}]}}]}}]},{"target":"com.sap.GL.ZAF.COMPANY/CurrencyCode","annotation":[{"term":"com.sap.vocabularies.Common.v1.ValueList","record":{"propertyValue":[{"property":"CollectionPath","string":"CURRENCYSet"},{"property":"CollectionRoot","string":"foo/ZAF_CURRENCY_SRV"},{"property":"Parameters","collection":{"record":[{"type":"com.sap.vocabularies.Common.v1.ValueListParameterInOut","propertyValue":[{"property":"LocalDataProperty","propertyPath":"CurrencyCode"},{"property":"ValueListProperty","string":"CurrencyCode"}]}]}}]}}]},{"target":"com.sap.GL.ZAF.GEO_COORDINATES/CountryCode","annotation":[{"term":"com.sap.vocabularies.Common.v1.ValueList","record":{"propertyValue":[{"property":"CollectionPath","string":"COUNTRYSet"},{"property":"Parameters","collection":{"record":[{"type":"com.sap.vocabularies.Common.v1.ValueListParameterInOut","propertyValue":[{"property":"LocalDataProperty","propertyPath":"CountryCode"},{"property":"ValueListProperty","string":"CountryCode"}]}]}}]}}]},{"target":"com.sap.GL.ZAF.GEO_COORDINATES/RegionCode","annotation":[{"term":"com.sap.vocabularies.Common.v1.ValueList","record":{"propertyValue":[{"property":"CollectionPath","string":"REGIONSet"},{"property":"Parameters","collection":{"record":[{"type":"com.sap.vocabularies.Common.v1.ValueListParameterInOut","propertyValue":[{"property":"LocalDataProperty","propertyPath":"RegionCode"},{"property":"ValueListProperty","string":"RegionCode"}]},{"type":"com.sap.vocabularies.Common.v1.ValueListParameterInOut","propertyValue":[{"property":"LocalDataProperty","propertyPath":"CountryCode"},{"property":"ValueListProperty","string":"CountryCode"}]}]}}]}}]},{"target":"com.sap.GL.ZAF.REGION/CountryCode","annotation":[{"term":"com.sap.vocabularies.Common.v1.ValueList","record":{"propertyValue":[{"property":"CollectionPath","string":"COUNTRYSet"},{"property":"Parameters","collection":{"record":[{"type":"com.sap.vocabularies.Common.v1.ValueListParameterInOut","propertyValue":[{"property":"LocalDataProperty","propertyPath":"CountryCode"},{"property":"ValueListProperty","string":"CountryCode"}]}]}}]}}]}],"extensions":[{"name":"lang","value":"en","namespace":"http://www.w3.org/XML/1998/namespace"},{"name":"link","value":null,"attributes":[{"name":"rel","value":"self","namespace":null},{"name":"href","value":"foo/ZAF_GL_BALANCE_SRV/$metadata","namespace":null}],"children":[],"namespace":"http://www.w3.org/2005/Atom"},{"name":"link","value":null,"attributes":[{"name":"rel","value":"latest-version","namespace":null},{"name":"href","value":"foo/ZAF_GL_BALANCE_SRV/$metadata","namespace":null}],"children":[],"namespace":"http://www.w3.org/2005/Atom"}]}]},"extensions":[{"name":"Reference","value":null,"attributes":[{"name":"Uri","value":"http://localhost:8080/uilib-sample/s…lName=\'%2FIWBEP%2FVOC_MEASURES\',Version=\'0001\',SAP__Origin=\'LOCAL\')/$value","namespace":null}],"children":[{"name":"Include","value":null,"attributes":[{"name":"Namespace","value":"Org.OData.Measures.V1","namespace":null}],"children":[],"namespace":"http://docs.oasis-open.org/odata/ns/edmx"}],"namespace":"http://docs.oasis-open.org/odata/ns/edmx"},{"name":"Reference","value":null,"attributes":[{"name":"Uri","value":"http://localhost:8080/uilib-sample/s…nicalName=\'%2FIWBEP%2FVOC_CORE\',Version=\'0001\',SAP__Origin=\'LOCAL\')/$value","namespace":null}],"children":[{"name":"Include","value":null,"attributes":[{"name":"Namespace","value":"Org.OData.Core.V1","namespace":null}],"children":[],"namespace":"http://docs.oasis-open.org/odata/ns/edmx"}],"namespace":"http://docs.oasis-open.org/odata/ns/edmx"},{"name":"Reference","value":null,"attributes":[{"name":"Uri","value":"http://localhost:8080/uilib-sample/s…ies(TechnicalName=\'ZRHA_COMMON\',Version=\'0001\',SAP__Origin=\'LOCAL\')/$value","namespace":null}],"children":[{"name":"Include","value":null,"attributes":[{"name":"Namespace","value":"com.sap.vocabularies.Common.v1_1","namespace":null}],"children":[],"namespace":"http://docs.oasis-open.org/odata/ns/edmx"}],"namespace":"http://docs.oasis-open.org/odata/ns/edmx"}]}');

	var oTestEntitySet = {
		"name": "Project",
		"entityType": "ZMEY_SRV.Project_Type",
		"extensions": [{
			"name": "pageable",
			"value": "false",
			"namespace": "http://www.sap.com/Protocols/SAPData"
		},
		{
			"name": "addressable",
			"value": "false",
			"namespace": "http://www.sap.com/Protocols/SAPData"
		},
		{
			"name": "content-version",
			"value": "1",
			"namespace": "http://www.sap.com/Protocols/SAPData"
		},
		{
			"name": "updatable-path",
			"value": "Properties/EntityUpdatable",
			"namespace": "http://www.sap.com/Protocols/SAPData"
		}],
		"sap:pageable": "false",
		"Org.OData.Capabilities.V1.SkipSupported": {
			"Bool": "false"
		},
		"Org.OData.Capabilities.V1.TopSupported": {
			"Bool": "false"
		},
		"sap:addressable": "false",
		"sap:content-version": "1",
		"sap:updatable-path": "Properties/EntityUpdatable",
		"Org.OData.Core.V1.UpdateRestrictions": {
			"Updatable": {
				"Path": "Properties/EntityUpdatable"
			}
		},
		"Org.OData.Capabilities.V1.SearchRestrictions": {
			"Searchable": {
				"Bool": "false"
			}
		},
		"Org.OData.Capabilities.V1.FilterRestrictions": {
			"NonFilterableProperties": [{
				"PropertyPath": "ID"
			},
			{
				"PropertyPath": "Name"
			},
			{
				"PropertyPath": "Description"
			},
			{
				"PropertyPath": "StartDate"
			},
			{
				"PropertyPath": "StartTime"
			},
			{
				"PropertyPath": "StartDateTime"
			},
			{
				"PropertyPath": "Amount"
			},
			{
				"PropertyPath": "AmountCurrency"
			},
			{
				"PropertyPath": "Quantity"
			},
			{
				"PropertyPath": "QuantityUnit"
			},
			{
				"PropertyPath": "Description_Required"
			},
			{
				"PropertyPath": "Description_ReadOnly"
			},
			{
				"PropertyPath": "Description_Hidden"
			},
			{
				"PropertyPath": "Description_FC"
			},
			{
				"PropertyPath": "StartDate_Required"
			},
			{
				"PropertyPath": "StartDate_ReadOnly"
			},
			{
				"PropertyPath": "StartDate_Hidden"
			},
			{
				"PropertyPath": "StartDate_FC"
			},
			{
				"PropertyPath": "EntityUpdatable_FC"
			},
			{
				"PropertyPath": "Released"
			},
			{
				"PropertyPath": "ReleaseActionEnabled_FC"
			},
			{
				"PropertyPath": "BigInteger"
			}]
		},
		"Org.OData.Capabilities.V1.SortRestrictions": {
			"NonSortableProperties": [{
				"PropertyPath": "ID"
			},
			{
				"PropertyPath": "Name"
			},
			{
				"PropertyPath": "Description"
			},
			{
				"PropertyPath": "StartDate"
			},
			{
				"PropertyPath": "StartTime"
			},
			{
				"PropertyPath": "StartDateTime"
			},
			{
				"PropertyPath": "Amount"
			},
			{
				"PropertyPath": "AmountCurrency"
			},
			{
				"PropertyPath": "Quantity"
			},
			{
				"PropertyPath": "QuantityUnit"
			},
			{
				"PropertyPath": "Description_Required"
			},
			{
				"PropertyPath": "Description_ReadOnly"
			},
			{
				"PropertyPath": "Description_Hidden"
			},
			{
				"PropertyPath": "Description_FC"
			},
			{
				"PropertyPath": "StartDate_Required"
			},
			{
				"PropertyPath": "StartDate_ReadOnly"
			},
			{
				"PropertyPath": "StartDate_Hidden"
			},
			{
				"PropertyPath": "StartDate_FC"
			},
			{
				"PropertyPath": "EntityUpdatable_FC"
			},
			{
				"PropertyPath": "Released"
			},
			{
				"PropertyPath": "ReleaseActionEnabled_FC"
			},
			{
				"PropertyPath": "BigInteger"
			}]
		}
	};

	var oTestEntityType = {
		"name": "Project_Type",
		"key": {
			"propertyRef": [{
				"name": "ID"
			}]
		},
		"property": [{
			"name": "ID",
			"type": "Edm.Int32",
			"nullable": "false",
			"extensions": [{
				"name": "creatable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "updatable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:creatable": "false",
			"sap:updatable": "false",
			"sap:sortable": "false",
			"sap:filterable": "false",
			"Org.OData.Core.V1.Computed": {
				"Bool": "true"
			}
		},
		{
			"name": "Name",
			"type": "Edm.String",
			"nullable": "false",
			"maxLength": "24",
			"extensions": [{
				"name": "field-control",
				"value": "Properties/Name_FC",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "label",
				"value": "Name",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:field-control": "Properties/Name_FC",
			"com.sap.vocabularies.Common.v1.FieldControl": {
				"Path": "Properties/Name_FC"
			},
			"sap:label": "Name",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Name"
			},
			"sap:sortable": "false",
			"sap:filterable": "false"
		},
		{
			"name": "Description",
			"type": "Edm.String",
			"nullable": "false",
			"maxLength": "80",
			"extensions": [{
				"name": "field-control",
				"value": "Description_FC",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "label",
				"value": "Description",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:field-control": "Description_FC",
			"com.sap.vocabularies.Common.v1.FieldControl": {
				"Path": "Description_FC"
			},
			"sap:label": "Description",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Description"
			},
			"sap:sortable": "false",
			"sap:filterable": "false"
		},
		{
			"name": "StartDate",
			"type": "Edm.DateTime",
			"precision": "0",
			"extensions": [{
				"name": "display-format",
				"value": "Date",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "field-control",
				"value": "StartDate_FC",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "label",
				"value": "Start Date",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:display-format": "Date",
			"sap:field-control": "StartDate_FC",
			"com.sap.vocabularies.Common.v1.FieldControl": {
				"Path": "StartDate_FC"
			},
			"sap:label": "Start Date",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Start Date"
			},
			"sap:sortable": "false",
			"sap:filterable": "false"
		},
		{
			"name": "StartTime",
			"type": "Edm.Time",
			"precision": "0",
			"extensions": [{
				"name": "label",
				"value": "Start Time",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:label": "Start Time",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Start Time"
			},
			"sap:sortable": "false",
			"sap:filterable": "false",
			"com.sap.vocabularies.Common.v1.FieldControl": {
				"Path": "StartDate_FC"
			}
		},
		{
			"name": "StartDateTime",
			"type": "Edm.DateTimeOffset",
			"precision": "0",
			"documentation": [{
				"text": null,
				"extensions": [{
					"name": "Summary",
					"value": "The UTC timestamp is the date and time relative to the UTC (Universal coordinated time).",
					"attributes": [],
					"children": [],
					"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
				},
				{
					"name": "LongDescription",
					"value": "To normalize local times in a UTC time stamp and make them comparable, they must be converted using their time zone and the ABAP command convert.\nAlthough the time zone for the conversion can be fetched from customizing or master data, you should save it redundantly.\nThe internal structure of the UTC time stamp is logically divided into a date and time part in packed number format <YYYYMMDDhhmmss>. There is also a high resolution UTC time stamp (10^-7 seconds).",
					"attributes": [],
					"children": [],
					"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
				}]
			}],
			"extensions": [{
				"name": "label",
				"value": "Start Date and Time",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "heading",
				"value": "Time Stamp",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "quickinfo",
				"value": "UTC Time Stamp in Short Form (YYYYMMDDhhmmss)",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:label": "Start Date and Time",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Start Date and Time"
			},
			"sap:heading": "Time Stamp",
			"com.sap.vocabularies.Common.v1.Heading": {
				"String": "Time Stamp"
			},
			"sap:quickinfo": "UTC Time Stamp in Short Form (YYYYMMDDhhmmss)",
			"com.sap.vocabularies.Common.v1.QuickInfo": {
				"String": "UTC Time Stamp in Short Form (YYYYMMDDhhmmss)"
			},
			"sap:sortable": "false",
			"sap:filterable": "false",
			"com.sap.vocabularies.Common.v1.FieldControl": {
				"If": [{
					"Path": "Released"
				},
				{
					"Int": "1"
				},
				{
					"Int": "3"
				}]
			}
		},
		{
			"name": "Amount",
			"type": "Edm.Decimal",
			"nullable": "false",
			"precision": "11",
			"scale": "2",
			"documentation": [{
				"text": null,
				"extensions": [{
					"name": "Summary",
					"value": "Price for external processing.",
					"attributes": [],
					"children": [],
					"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
				},
				{
					"name": "LongDescription",
					"value": null,
					"attributes": [],
					"children": [],
					"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
				}]
			}],
			"extensions": [{
				"name": "unit",
				"value": "AmountCurrency",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "label",
				"value": "Price",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:unit": "AmountCurrency",
			"sap:label": "Price",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Price"
			},
			"sap:sortable": "false",
			"sap:filterable": "false",
			"Org.OData.Measures.V1.ISOCurrency": {
				"Path": "AmountCurrency"
			}
		},
		{
			"name": "AmountCurrency",
			"type": "Edm.String",
			"nullable": "false",
			"maxLength": "5",
			"documentation": [{
				"text": null,
				"extensions": [{
					"name": "Summary",
					"value": "Currency key for amounts in the system.",
					"attributes": [],
					"children": [],
					"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
				},
				{
					"name": "LongDescription",
					"value": null,
					"attributes": [],
					"children": [],
					"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
				}]
			}],
			"extensions": [{
				"name": "label",
				"value": "Currency",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "heading",
				"value": "Crcy",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "quickinfo",
				"value": "Currency Key",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "semantics",
				"value": "currency-code",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:label": "Currency",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Currency"
			},
			"sap:heading": "Crcy",
			"com.sap.vocabularies.Common.v1.Heading": {
				"String": "Crcy"
			},
			"sap:quickinfo": "Currency Key",
			"com.sap.vocabularies.Common.v1.QuickInfo": {
				"String": "Currency Key"
			},
			"sap:sortable": "false",
			"sap:filterable": "false",
			"sap:semantics": "currency-code"
		},
		{
			"name": "Quantity",
			"type": "Edm.Decimal",
			"nullable": "false",
			"precision": "13",
			"scale": "3",
			"documentation": [{
				"text": null,
				"extensions": [{
					"name": "Summary",
					"value": "Total quantity (including scrap) to be produced in this order.",
					"attributes": [],
					"children": [],
					"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
				},
				{
					"name": "LongDescription",
					"value": null,
					"attributes": [],
					"children": [],
					"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
				}]
			}],
			"extensions": [{
				"name": "unit",
				"value": "QuantityUnit",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "label",
				"value": "Quantity",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "heading",
				"value": "Total order quantity",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "quickinfo",
				"value": "Total order quantity",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:unit": "QuantityUnit",
			"sap:label": "Quantity",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Quantity"
			},
			"sap:heading": "Total order quantity",
			"com.sap.vocabularies.Common.v1.Heading": {
				"String": "Total order quantity"
			},
			"sap:quickinfo": "Total order quantity",
			"com.sap.vocabularies.Common.v1.QuickInfo": {
				"String": "Total order quantity"
			},
			"sap:sortable": "false",
			"sap:filterable": "false",
			"Org.OData.Measures.V1.Unit": {
				"Path": "QuantityUnit"
			}
		},
		{
			"name": "QuantityUnit",
			"type": "Edm.String",
			"nullable": "false",
			"maxLength": "3",
			"documentation": [{
				"text": null,
				"extensions": [{
					"name": "Summary",
					"value": "Unit of measure in which stocks of the material are managed. The system converts all the quantities you enter in other units of measure (alternative units of measure) to the base unit of measure.",
					"attributes": [],
					"children": [],
					"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
				},
				{
					"name": "LongDescription",
					"value": "You define the base unit of measure and also alternative units of measure and their conversion factors in the material master record.\nSince all data is updated in the base unit of measure, your entry is particularly important for the conversion of alternative units of measure. A quantity in the alternative unit of measure can only be shown precisely if its value can be shown with the decimal places available. To ensure this, please note the following:\nThe base unit of measure is the unit satisfying the highest necessary requirement for precision.\nThe conversion of alternative units of measure to the base unit should result in simple decimal fractions (not, for example, 1/3 = 0.333...).\nInventory Management\nIn Inventory Management, the base unit of measure is the same as the stockkeeping unit.\nServices\nServices have units of measure of their own, including the following:\nService unit\nUnit of measure at the higher item level. The precise quantities of the individual services are each at the detailed service line level.\nBlanket\nUnit of measure at service line level for services to be provided once only, and for which no precise quantities can or are to be specified.",
					"attributes": [],
					"children": [],
					"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
				}]
			}],
			"extensions": [{
				"name": "label",
				"value": "Unit",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "heading",
				"value": "BUn",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "quickinfo",
				"value": "Base Unit of Measure",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "semantics",
				"value": "unit-of-measure",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:label": "Unit",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Unit"
			},
			"sap:heading": "BUn",
			"com.sap.vocabularies.Common.v1.Heading": {
				"String": "BUn"
			},
			"sap:quickinfo": "Base Unit of Measure",
			"com.sap.vocabularies.Common.v1.QuickInfo": {
				"String": "Base Unit of Measure"
			},
			"sap:sortable": "false",
			"sap:filterable": "false",
			"sap:semantics": "unit-of-measure"
		},
		{
			"name": "Description_Required",
			"type": "Edm.Boolean",
			"nullable": "false",
			"extensions": [{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:sortable": "false",
			"sap:filterable": "false"
		},
		{
			"name": "Description_ReadOnly",
			"type": "Edm.Boolean",
			"nullable": "false",
			"extensions": [{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:sortable": "false",
			"sap:filterable": "false"
		},
		{
			"name": "Description_Hidden",
			"type": "Edm.Boolean",
			"nullable": "false",
			"extensions": [{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:sortable": "false",
			"sap:filterable": "false"
		},
		{
			"name": "Description_FC",
			"type": "Edm.Byte",
			"nullable": "false",
			"extensions": [{
				"name": "creatable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "updatable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:creatable": "false",
			"sap:updatable": "false",
			"sap:sortable": "false",
			"sap:filterable": "false",
			"Org.OData.Core.V1.Computed": {
				"Bool": "true"
			}
		},
		{
			"name": "StartDate_Required",
			"type": "Edm.Boolean",
			"nullable": "false",
			"extensions": [{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:sortable": "false",
			"sap:filterable": "false"
		},
		{
			"name": "StartDate_ReadOnly",
			"type": "Edm.Boolean",
			"nullable": "false",
			"extensions": [{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:sortable": "false",
			"sap:filterable": "false"
		},
		{
			"name": "StartDate_Hidden",
			"type": "Edm.Boolean",
			"nullable": "false",
			"extensions": [{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:sortable": "false",
			"sap:filterable": "false"
		},
		{
			"name": "StartDate_FC",
			"type": "Edm.Byte",
			"nullable": "false",
			"extensions": [{
				"name": "creatable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "updatable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:creatable": "false",
			"sap:updatable": "false",
			"sap:sortable": "false",
			"sap:filterable": "false",
			"Org.OData.Core.V1.Computed": {
				"Bool": "true"
			}
		},
		{
			"name": "EntityUpdatable_FC",
			"type": "Edm.Boolean",
			"nullable": "false",
			"extensions": [{
				"name": "creatable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "updatable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:creatable": "false",
			"sap:updatable": "false",
			"sap:sortable": "false",
			"sap:filterable": "false",
			"Org.OData.Core.V1.Computed": {
				"Bool": "true"
			}
		},
		{
			"name": "Released",
			"type": "Edm.Boolean",
			"nullable": "false",
			"extensions": [{
				"name": "creatable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "updatable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:creatable": "false",
			"sap:updatable": "false",
			"sap:sortable": "false",
			"sap:filterable": "false",
			"Org.OData.Core.V1.Computed": {
				"Bool": "true"
			}
		},
		{
			"name": "ReleaseActionEnabled_FC",
			"type": "Edm.Boolean",
			"nullable": "false",
			"extensions": [{
				"name": "creatable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "updatable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:creatable": "false",
			"sap:updatable": "false",
			"sap:sortable": "false",
			"sap:filterable": "false",
			"Org.OData.Core.V1.Computed": {
				"Bool": "true"
			}
		},
		{
			"name": "BigInteger",
			"type": "Edm.Int64",
			"nullable": "false",
			"extensions": [{
				"name": "label",
				"value": "Big Integer",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:label": "Big Integer",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Big Integer"
			},
			"sap:sortable": "false",
			"sap:filterable": "false"
		}],
		"navigationProperty": [{
			"name": "Properties",
			"relationship": "ZMEY_SRV.ProjectProperties",
			"fromRole": "FromRole_ProjectProperties",
			"toRole": "ToRole_ProjectProperties"
		},
		{
			"name": "Tasks",
			"relationship": "ZMEY_SRV.ProjectTask",
			"fromRole": "FromRole_ProjectTask",
			"toRole": "ToRole_ProjectTask"
		}],
		"extensions": [{
			"name": "content-version",
			"value": "1",
			"namespace": "http://www.sap.com/Protocols/SAPData"
		}],
		"sap:content-version": "1",
		"namespace": "ZMEY_SRV",
		"$path": "/dataServices/schema/0/entityType/0"
	};

	QUnit.module("sap.ui.comp.smartfield.ODataHelper", {
		beforeEach: function() {

			function findIndex(aArray, vExpectedPropertyValue, sPropertyName) {
				var iIndex = -1;

				sPropertyName = sPropertyName || "name";
				jQuery.each(aArray || [], function (i, oObject) {
					if (oObject[sPropertyName] === vExpectedPropertyValue) {
						iIndex = i;
						return false; // break
					}
				});

				return iIndex;
			}

			function getObject1(oModel, sArrayName, sQualifiedName, bAsPath) {
				var vResult = bAsPath ? undefined : null,
					iSeparatorPos,
					sNamespace,
					sName;

				sQualifiedName = sQualifiedName || "";
				iSeparatorPos = sQualifiedName.lastIndexOf(".");
				sNamespace = sQualifiedName.slice(0, iSeparatorPos);
				sName = sQualifiedName.slice(iSeparatorPos + 1);
				jQuery.each(oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
					if (oSchema.namespace === sNamespace) {
						jQuery.each(oSchema[sArrayName] || [], function (j, oThing) {
							if (oThing.name === sName) {
								vResult = bAsPath ? oThing.$path : oThing;
								return false; // break
							}
						});
						return false; // break
					}
				});

				return vResult;
			}

			this.oModel = sinon.createStubInstance(ODataModel);

			this.oModel.getMetaModel = function() {
				var oStub = sinon.createStubInstance(ODataMetaModel);
				oStub.oModel = new JSONModel(oTestModel2);
				oStub.oData = oTestModel2;

				oStub.getObject = function(sPath) {
					var oNode, aParts = sPath.split("/"), iIndex = 0;
					if (!aParts[0]) {
						// absolute path starting with slash
						oNode = this.oData;
						iIndex++;
					}
					while (oNode && aParts[iIndex]) {
						oNode = oNode[aParts[iIndex]];
						iIndex++;
					}
					return oNode;
				};

				oStub.getODataEntityContainer = function(bAsPath) {
					var vResult = bAsPath ? undefined : null;

					jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
						var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

						if (j >= 0) {
							vResult = bAsPath
								? "/dataServices/schema/" + i + "/entityContainer/" + j
								: oSchema.entityContainer[j];
							return false; //break
						}
					});

					return vResult;
				};

				oStub.getODataEntitySet = function(sName, bAsPath) {
					var k,
					oEntityContainer = this.getODataEntityContainer(),
					vResult = bAsPath ? undefined : null;

					if (oEntityContainer) {
						k = findIndex(oEntityContainer.entitySet, sName);
						if (k >= 0) {
							vResult = bAsPath
								? oEntityContainer.$path + "/entitySet/" + k
								: oEntityContainer.entitySet[k];
						}
					}

					return vResult;
				};

				oStub.getODataEntityType = function (sQualifiedName, bAsPath) {
					return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
				};

				oStub.getODataProperty = function (oType, vName, bAsPath) {
					var i,
						aParts = jQuery.isArray(vName) ? vName : [vName],
						oProperty = null,
						sPropertyPath;

					while (oType && aParts.length) {
						i = findIndex(oType.property, aParts[0]);
						if (i < 0) {
							break;
						}

						aParts.shift();
						oProperty = oType.property[i];
						sPropertyPath = oType.$path + "/property/" + i;

						if (aParts.length) {
							// go to complex type in order to allow drill-down
							oType = this.getODataComplexType(oProperty.type);
						}
					}

					return bAsPath ? sPropertyPath : oProperty;
				};

				oStub.getODataComplexType = function (sQualifiedName, bAsPath) {
					return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
				};

				return oStub;
			};

			this.oMetaData = new ODataHelper(this.oModel, new BindingUtil());
			this.oMetaData.oMeta.oData.dataServices.schema[0].namespace = "com.sap.GL.ZAF";
		},
		afterEach: function() {
			this.oMetaData.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oMetaData);
	});

	QUnit.test("getAnalyzer", function(assert) {
		assert.ok(this.oMetaData.getAnalyzer());
	});

	QUnit.test("oMeta.getODataEntitySet", function(assert) {
		var oEntity = this.oMetaData.oMeta.getODataEntitySet("GL_ACCOUNT_BALANCE_SET");
		assert.equal(oEntity.entityType, "com.sap.GL.ZAF.GL_ACCOUNT_BALANCE");
	});

	QUnit.test("oMeta.getODataEntitySet - invalid entity name", function(assert) {
		var oEntity = this.oMetaData.oMeta.getODataEntitySet({
			sPath : "/GL_ACCOUNT_BALANCE_SET(id1='71' id2='abcd')"
		});
		assert.equal(!oEntity, true);
	});

	QUnit.test("oMeta.getODataEntityTypee", function(assert) {
		var oDef = this.oMetaData.oMeta.getODataEntityType("com.sap.GL.ZAF.GL_ACCOUNT_BALANCE");
		assert.equal(oDef.name, "GL_ACCOUNT_BALANCE");
	});

	QUnit.test("getEntity - invalid entity type", function(assert) {
		var oDef = this.oMetaData.oMeta.getODataEntityType("Project_TypeDummy");
		assert.equal(!oDef, true);

		oDef = this.oMetaData.oMeta.getODataEntityType();
		assert.equal(!oDef, true);
	});

	QUnit.test("getProperty", function(assert) {
		var oSet = this.oMetaData.oMeta.getODataEntitySet("GL_ACCOUNT_BALANCE_SET");
		var oType = this.oMetaData.oMeta.getODataEntityType(oSet.entityType);
		var oMeta = {
			entityType: oType,
			entitySet: oSet,
			path: "GLAccount"
		};

		this.oMetaData.getProperty(oMeta);

		assert.equal(oMeta.property.property.name, "GLAccount");
		assert.equal(oMeta.property.property.type, "Edm.String");
		assert.equal(oMeta.property.typePath, "GLAccount");
	});

	QUnit.test("getProperty - invalid input", function(assert) {
		var oSet = this.oMetaData.oMeta.getODataEntitySet("GL_ACCOUNT_BALANCE_SET");
		var oType = this.oMetaData.oMeta.getODataEntityType(oSet.entityType);
		var oMeta = {
			entityType: oType,
			entitySet: oSet,
			path: ""
		};
		this.oMetaData.getProperty(oMeta);

		assert.equal(!oMeta.property.property, true);
	});

	QUnit.test("getProperty - invalid property name", function(assert) {
		var oSet = this.oMetaData.oMeta.getODataEntitySet("GL_ACCOUNT_BALANCE_SET");
		var oType = this.oMetaData.oMeta.getODataEntityType(oSet.entityType);
		var oMeta = {
			entityType: oType,
			entitySet: oSet,
			path: "Wrong/False"
		};

		this.oMetaData.getProperty(oMeta);

		assert.ok(!oMeta.property);
	});

	QUnit.test("getProperty - complex type", function(assert) {
		var oComplexTypes = JSON.parse("[{\"name\":\"AcctgDocSimTmpKey\",\"property\":[{\"name\":\"TmpIdType\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"label\",\"value\":\"Temp. Belegart\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TmpId\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"22\",\"extensions\":[{\"name\":\"label\",\"value\":\"Temp. Beleg-ID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CompanyCode\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Buchungskreis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"FiscalYear\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Geschäftsjahr\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]},{\"name\":\"AcctgDocHdrPayment\",\"property\":[{\"name\":\"HouseBank\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcHouseBank\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Hausbank\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"GLAccount\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcGLAccount\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Sachkonto\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"GLAccountName\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"20\",\"extensions\":[{\"name\":\"label\",\"value\":\"Kurztext\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"HouseBankAccount\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcHouseBankAccount\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Konto-Id\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AmountInTransCrcy\",\"type\":\"Edm.Decimal\",\"precision\":\"13\",\"scale\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAmountInTransCrcy\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"unit\",\"value\":\"TransactionCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Betrag\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TransactionCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Währung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AmountInCoCodeCrcy\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\",\"precision\":\"13\",\"scale\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAmountInCoCodeCrcy\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"unit\",\"value\":\"CoCodeCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Hauswährungsbetrag\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CoCodeCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Hauswährung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"BusinessArea\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcBusinessArea\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"GeschBereich\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ProfitCenter\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcProfitCenter\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Profitcenter\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"DocumentItemText\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"50\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcDocumentItemText\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Positionstext\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AssignmentReference\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"18\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAssignmentReference\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Zuordnung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ValueDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcValueDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Valutadatum\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcHouseBank\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcGLAccount\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcHouseBankAccount\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAmountInTransCrcy\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAmountInCoCodeCrcy\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcBusinessArea\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcProfitCenter\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcDocumentItemText\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAssignmentReference\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcValueDate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}],\"namespace\":\"FAC_FINANCIALS_POSTING_SRV\"},{\"name\":\"AcctgDocHdrBankCharges\",\"property\":[{\"name\":\"AmountInTransCrcy\",\"type\":\"Edm.Decimal\",\"precision\":\"13\",\"scale\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAmountInTransCrcy\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"unit\",\"value\":\"TransactionCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Betrag\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TransactionCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Währung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AmountInCoCodeCrcy\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\",\"precision\":\"13\",\"scale\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAmountInCoCodeCrcy\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"unit\",\"value\":\"CoCodeCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Hauswährungsbetrag\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CoCodeCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Hauswährung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TaxCode\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcTaxCode\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Umsatzsteuer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcTaxCode\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAmountInCoCodeCrcy\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAmountInTransCrcy\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]},{\"name\":\"FunctionImportDummyReturn\",\"property\":[{\"name\":\"Dummy\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]},{\"name\":\"AcctgDocTmpKey\",\"property\":[{\"name\":\"TmpIdType\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"label\",\"value\":\"Temp. Belegart\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TmpId\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"22\",\"extensions\":[{\"name\":\"label\",\"value\":\"Temp. Beleg-ID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]},{\"name\":\"AcctgDocKey\",\"property\":[{\"name\":\"AccountingDocument\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Belegnummer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CompanyCode\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Geschäftsjahr\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"FiscalYear\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Belegnummer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]},{\"name\":\"APARAccountKey\",\"property\":[{\"name\":\"CompanyCode\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Buchungskreis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"APARAccount\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"label\",\"value\":\"Konto\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}]}]");
		var oSet = JSON.parse("{\"name\":\"FinsPostingPaymentHeaders\",\"entityType\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostingPaymentHeader\",\"extensions\":[{\"name\":\"pageable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}");
		var oType = JSON.parse("{\"name\":\"FinsPostingPaymentHeader\",\"key\":{\"propertyRef\":[{\"name\":\"TmpId\"},{\"name\":\"TmpIdType\"}]},\"property\":[{\"name\":\"BankCharges\",\"type\":\"FAC_FINANCIALS_POSTING_SRV.AcctgDocHdrBankCharges\",\"nullable\":\"false\"},{\"name\":\"Payment\",\"type\":\"FAC_FINANCIALS_POSTING_SRV.AcctgDocHdrPayment\",\"nullable\":\"false\"},{\"name\":\"AccountingDocument\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAccountingDocument\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Belegnummer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AccountingDocumentCategory\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"label\",\"value\":\"Belegstatus\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AccountingDocumentHeaderText\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"25\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAccountingDocumentHeaderText\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Kopftext\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AccountingDocumentType\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcAccountingDocumentType\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Belegart\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"AccountingDocumentTypeName\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"40\",\"extensions\":[{\"name\":\"label\",\"value\":\"Langtext\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CompanyCode\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcCompanyCode\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Buchungskreis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CompanyCodeCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Hauswährung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"CompanyCodeName\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"54\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"DisplayCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"label\",\"value\":\"Anzeigewährung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"DocumentDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"field-control\",\"value\":\"UxFcDocumentDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Belegdatum\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"DocumentReferenceID\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"16\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcDocumentReferenceID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Referenz\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ExchangeRate\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcExchangeRate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Umrechnungskurs\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ExchangeRateDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcExchangeRateDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Umrechnungsdatum\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ExchangeRateForTaxes\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcExchangeRateForTaxes\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Umrechnungskurs\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"FiscalPeriod\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"2\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcFiscalPeriod\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Periode\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"FiscalYear\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"label\",\"value\":\"Geschäftsjahr\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"HasInvoiceReference\",\"type\":\"Edm.Boolean\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"Rechn.bez. berücks.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"IntercompanyTransaction\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"16\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcIntercompanyTransaction\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"GesellschÜbergr. TA\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"IsNetEntry\",\"type\":\"Edm.Boolean\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcIsNetEntry\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Nettoerfassung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"LedgerGroup\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcLedgerGroup\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Ledger-Gruppe\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"NoteToPayee\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"Verwendungszweck\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"PostingDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"field-control\",\"value\":\"UxFcPostingDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Buchungsdatum\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"ScreenVariant\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"30\",\"extensions\":[{\"name\":\"label\",\"value\":\"Variante\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TaxIsCalculatedAutomatically\",\"type\":\"Edm.Boolean\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcTaxIsCalculatedAutomatically\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Steuer rechnen\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TaxReportingDate\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcTaxReportingDate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Steuermeldedat.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TmpId\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"22\",\"extensions\":[{\"name\":\"label\",\"value\":\"Temporäre ID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TmpIdType\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"label\",\"value\":\"Art der temporären ID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TotalCreditAmountInDisplayCrcy\",\"type\":\"Edm.Decimal\",\"precision\":\"17\",\"scale\":\"2\",\"extensions\":[{\"name\":\"unit\",\"value\":\"DisplayCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Habensumme\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TotalDebitAmountInDisplayCrcy\",\"type\":\"Edm.Decimal\",\"precision\":\"17\",\"scale\":\"2\",\"extensions\":[{\"name\":\"unit\",\"value\":\"DisplayCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Sollsumme\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TotalNetAmountInDisplayCrcy\",\"type\":\"Edm.Decimal\",\"precision\":\"17\",\"scale\":\"2\",\"extensions\":[{\"name\":\"unit\",\"value\":\"DisplayCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Nettosumme der Posten\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"TransactionCurrency\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"field-control\",\"value\":\"UxFcTransactionCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Transaktionswährung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxAction\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"15\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAccountingDocument\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAccountingDocumentHeaderText\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcAccountingDocumentType\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcCompanyCode\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcDocumentDate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcDocumentReferenceID\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcExchangeRate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcExchangeRateDate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcExchangeRateForTaxes\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcFiscalPeriod\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcIntercompanyTransaction\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcIsNetEntry\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcLedgerGroup\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcPostingDate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcTaxIsCalculatedAutomatically\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcTaxReportingDate\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxFcTransactionCurrency\",\"type\":\"Edm.Byte\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"UI-Feldsteuerung\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxProcessTaxAlways\",\"type\":\"Edm.Boolean\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"label\",\"value\":\"Flag\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"UxStatus\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"label\",\"value\":\"Datnerfassgsstats\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}],\"navigationProperty\":[{\"name\":\"Attachments\",\"relationship\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostPaytHdrAttachment\",\"fromRole\":\"FromRole_FinsPostPaytHdrAttachment\",\"toRole\":\"ToRole_FinsPostPaytHdrAttachment\"},{\"name\":\"Notes\",\"relationship\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostPaytHdrNote\",\"fromRole\":\"FromRole_FinsPostPaytHdrNote\",\"toRole\":\"ToRole_FinsPostPaytHdrNote\"},{\"name\":\"APARItemsToBeClrd\",\"relationship\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostPaytHdrAPARItemToBeClrd\",\"fromRole\":\"FromRole_FinsPostPaytHdrAPARItemToBeClrd\",\"toRole\":\"ToRole_FinsPostPaytHdrAPARItemToBeClrd\"},{\"name\":\"APARItems\",\"relationship\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostPaytHdrAPARItem\",\"fromRole\":\"FromRole_FinsPostPaytHdrAPARItem\",\"toRole\":\"ToRole_FinsPostPaytHdrAPARItem\"},{\"name\":\"Items\",\"relationship\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostPaytHdrGLItm\",\"fromRole\":\"FromRole_FinsPostPaytHdrGLItm\",\"toRole\":\"ToRole_FinsPostPaytHdrGLItm\"}],\"extensions\":[{\"name\":\"service-schema-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"service-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"namespace\":\"FAC_FINANCIALS_POSTING_SRV\",\"entityType\":\"FAC_FINANCIALS_POSTING_SRV.FinsPostingPaymentHeader\"}");

		this.oMetaData.oMeta.oData.dataServices.schema[0].entityType.push(oType);
		this.oMetaData.oMeta.oData.dataServices.schema[0].complexType = oComplexTypes;
		this.oMetaData.oMeta.oData.dataServices.schema[0].namespace = "FAC_FINANCIALS_POSTING_SRV";

		var oMeta = {
			entityType: oType,
			entitySet: oSet,
			path: "Payment/TransactionCurrency"
		};

		this.oMetaData.getProperty(oMeta);
		assert.equal(oMeta.property.property.name, "TransactionCurrency");
		assert.equal(oMeta.property.typePath, "AcctgDocHdrPayment/TransactionCurrency");
		assert.equal(oMeta.property.complex, true);
	});

	QUnit.test("getValueListAnnotationPath", function(assert) {
		var oMetaData = JSON.parse("{\"annotations\":{\"uom\":null,\"lineitem\":{\"term\":\"com.sap.vocabularies.UI.v1.LineItem\",\"collection\":{\"record\":[{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Bukrs\"},{\"property\":\"Label\",\"string\":\"my Bukrs\"}],\"extensions\":[{\"name\":\"Annotation\",\"value\":null,\"attributes\":[{\"name\":\"Term\",\"value\":\"com.sap.vocabularies.UI.v1.Importance\",\"namespace\":null},{\"name\":\"EnumMember\",\"value\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\",\"namespace\":null}],\"children\":[],\"namespace\":\"http://docs.oasis-open.org/odata/ns/edm\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Gjahr\"}],\"extensions\":[{\"name\":\"Annotation\",\"value\":null,\"attributes\":[{\"name\":\"Term\",\"value\":\"com.sap.vocabularies.UI.v1.Importance\",\"namespace\":null},{\"name\":\"EnumMember\",\"value\":\"com.sap.vocabularies.UI.v1.ImportanceType/Medium\",\"namespace\":null}],\"children\":[],\"namespace\":\"http://docs.oasis-open.org/odata/ns/edm\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Kunnr\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Name1\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Dmbtr\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Hwaer\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"BUDAT\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"BLDAT\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Cnt\"}],\"extensions\":[{\"name\":\"Annotation\",\"value\":null,\"attributes\":[{\"name\":\"Term\",\"value\":\"com.sap.vocabularies.UI.v1.Importance\",\"namespace\":null},{\"name\":\"EnumMember\",\"value\":\"com.sap.vocabularies.UI.v1.ImportanceType/Low\",\"namespace\":null}],\"children\":[],\"namespace\":\"http://docs.oasis-open.org/odata/ns/edm\"}]}]},\"fields\":[\"Bukrs\",\"Gjahr\",\"Kunnr\",\"Name1\",\"Dmbtr\",\"Hwaer\",\"BUDAT\",\"BLDAT\",\"Cnt\"],\"labels\":{\"Bukrs\":\"my Bukrs\"}},\"semantic\":null},\"path\":\"Kunnr\",\"namespace\":\"com.sap.GL.zrha\",\"entitySet\":{\"name\":\"LineItemsSet\",\"entityType\":\"com.sap.GL.zrha.LineItems\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"deletable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"pageable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},\"entityType\":{\"name\":\"LineItems\",\"key\":{\"propertyRef\":[{\"name\":\"Id\"}]},\"property\":[{\"name\":\"Id\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"visible\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"SADL Key Field\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:visible\":\"false\",\"sap:label\":\"SADL Key Field\",\"sap:creatable\":\"false\"},{\"name\":\"Bukrs\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"required-in-filter\",\"value\":\"true\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Company Code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"CoCd\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:required-in-filter\":\"true\",\"sap:label\":\"Company Code\",\"sap:heading\":\"CoCd\",\"sap:creatable\":\"false\"},{\"name\":\"Belnr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Document Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Doc. No.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Accounting Document Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Document Number\",\"sap:heading\":\"Doc. No.\",\"sap:quickinfo\":\"Accounting Document Number\",\"sap:creatable\":\"false\"},{\"name\":\"Gjahr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"NonNegative\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"required-in-filter\",\"value\":\"true\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Fiscal Year\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Year\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"NonNegative\",\"sap:required-in-filter\":\"true\",\"sap:label\":\"Fiscal Year\",\"sap:heading\":\"Year\",\"sap:creatable\":\"false\"},{\"name\":\"Buzei\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\",\"precision\":\"3\",\"scale\":\"0\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"NonNegative\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Line Item\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Itm\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Number of Line Item Within Accounting Document\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"NonNegative\",\"sap:label\":\"Line Item\",\"sap:heading\":\"Itm\",\"sap:quickinfo\":\"Number of Line Item Within Accounting Document\",\"sap:creatable\":\"false\"},{\"name\":\"Kunnr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"text\",\"value\":\"Name1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Customer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Customer Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:text\":\"Name1\",\"sap:label\":\"Customer\",\"sap:quickinfo\":\"Customer Number\",\"sap:creatable\":\"false\"},{\"name\":\"Augbl\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Clearing Doc. No.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Clrng Doc.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Clearing Document Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Clearing Doc. No.\",\"sap:heading\":\"Clrng Doc.\",\"sap:quickinfo\":\"Clearing Document Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Dmbtr\",\"type\":\"Edm.Decimal\",\"precision\":\"25\",\"scale\":\"2\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"measure\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"unit\",\"value\":\"Hwaer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Amount in LC\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"measure\",\"sap:unit\":\"Hwaer\",\"sap:label\":\"Amount in LC\",\"sap:creatable\":\"false\"},{\"name\":\"Sgtxt\",\"type\":\"Edm.String\",\"maxLength\":\"50\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Item Text\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Item Text\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Umskz\",\"type\":\"Edm.String\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Special G/L ind\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"SG\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Special G/L Indicator\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Special G/L ind\",\"sap:heading\":\"SG\",\"sap:quickinfo\":\"Special G/L Indicator\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Zuonr\",\"type\":\"Edm.String\",\"maxLength\":\"18\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"visible\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Assignment\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Assignment Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:visible\":\"false\",\"sap:label\":\"Assignment\",\"sap:quickinfo\":\"Assignment Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Blart\",\"type\":\"Edm.String\",\"maxLength\":\"2\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Document Type\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"DT\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Document Type\",\"sap:heading\":\"DT\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Hwaer\",\"type\":\"Edm.String\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Currency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Crcy\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Currency Key\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:label\":\"Currency\",\"sap:heading\":\"Crcy\",\"sap:quickinfo\":\"Currency Key\",\"sap:creatable\":\"false\",\"sap:semantics\":\"currency-code\"},{\"name\":\"Name1\",\"type\":\"Edm.String\",\"maxLength\":\"35\",\"extensions\":[{\"name\":\"label\",\"value\":\"Name\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Name 1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Name 1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Name\",\"sap:heading\":\"Name 1\",\"sap:quickinfo\":\"Name 1\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"KOSTL\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Cost Center\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Cost Ctr\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:label\":\"Cost Center\",\"sap:heading\":\"Cost Ctr\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"PRCTR\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Profit Center\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Profit Center\",\"sap:creatable\":\"false\"},{\"name\":\"HKONT\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"G/L\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"General Ledger Account\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"G/L\",\"sap:quickinfo\":\"General Ledger Account\",\"sap:creatable\":\"false\"},{\"name\":\"SHKZG\",\"type\":\"Edm.String\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Debit/Credit\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"D/C\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Debit/Credit Indicator\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Debit/Credit\",\"sap:heading\":\"D/C\",\"sap:quickinfo\":\"Debit/Credit Indicator\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"GSBER\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Business Area\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"BusA\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Business Area\",\"sap:heading\":\"BusA\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"AUFNR\",\"type\":\"Edm.String\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Order\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Order Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Order\",\"sap:quickinfo\":\"Order Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"ANLN1\",\"type\":\"Edm.String\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Main Asset No.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Asset\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Main Asset Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Main Asset No.\",\"sap:heading\":\"Asset\",\"sap:quickinfo\":\"Main Asset Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"ANLN2\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Subnumber\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"SNo.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Asset Subnumber\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Subnumber\",\"sap:heading\":\"SNo.\",\"sap:quickinfo\":\"Asset Subnumber\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"BUDAT\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filter-restriction\",\"value\":\"interval\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Posting Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Pstng Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Posting Date in the Document\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"Date\",\"sap:filter-restriction\":\"interval\",\"sap:label\":\"Posting Date\",\"sap:heading\":\"Pstng Date\",\"sap:quickinfo\":\"Posting Date in the Document\",\"sap:creatable\":\"false\"},{\"name\":\"BLDAT\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Document Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Doc. Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Document Date in Document\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"Date\",\"sap:label\":\"Document Date\",\"sap:heading\":\"Doc. Date\",\"sap:quickinfo\":\"Document Date in Document\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"SAKNR\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"G/L Account\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"G/L Acct\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"G/L Account Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"G/L Account\",\"sap:heading\":\"G/L Acct\",\"sap:quickinfo\":\"G/L Account Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Cnt\",\"type\":\"Edm.Int32\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"measure\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Count\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"measure\",\"sap:label\":\"Count\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\",\"sap:filterable\":\"false\"}],\"extensions\":[{\"name\":\"label\",\"value\":\"Line Item\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"aggregate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Line Item\",\"sap:semantics\":\"aggregate\",\"sap:content-version\":\"1\",\"$path\":\"/dataServices/schema/0/entityType/2\"},\"typecount\":2,\"property\":{\"property\":{\"name\":\"Kunnr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"text\",\"value\":\"Name1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Customer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Customer Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:text\":\"Name1\",\"sap:label\":\"Customer\",\"sap:quickinfo\":\"Customer Number\",\"sap:creatable\":\"false\"},\"typePath\":\"Kunnr\",\"extensions\":{\"sap:creatable\":{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:quickinfo\":{\"name\":\"quickinfo\",\"value\":\"Customer Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:label\":{\"name\":\"label\",\"value\":\"Customer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:text\":{\"name\":\"text\",\"value\":\"Name1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:display-format\":{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:aggregation-role\":{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}}}}");

		QUnitHelper.liftV4Annotations(oMetaData);
		var oAnnotation = this.oMetaData.getValueListAnnotationPath(oMetaData);
		assert.ok(oAnnotation);
		oMetaData.property.complex = true;
		oMetaData.property.parents = [{
			namespace: "dummyNameSpace"
		}];
		oAnnotation = this.oMetaData.getValueListAnnotationPath(oMetaData);
		assert.ok(oAnnotation);
	});

	QUnit.test("getUOMValueListAnnotationPath", function(assert) {
		var oMetaData = JSON.parse("{\"annotations\":{\"uom\":null,\"lineitem\":{\"term\":\"com.sap.vocabularies.UI.v1.LineItem\",\"collection\":{\"record\":[{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Bukrs\"},{\"property\":\"Label\",\"string\":\"my Bukrs\"}],\"extensions\":[{\"name\":\"Annotation\",\"value\":null,\"attributes\":[{\"name\":\"Term\",\"value\":\"com.sap.vocabularies.UI.v1.Importance\",\"namespace\":null},{\"name\":\"EnumMember\",\"value\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\",\"namespace\":null}],\"children\":[],\"namespace\":\"http://docs.oasis-open.org/odata/ns/edm\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Gjahr\"}],\"extensions\":[{\"name\":\"Annotation\",\"value\":null,\"attributes\":[{\"name\":\"Term\",\"value\":\"com.sap.vocabularies.UI.v1.Importance\",\"namespace\":null},{\"name\":\"EnumMember\",\"value\":\"com.sap.vocabularies.UI.v1.ImportanceType/Medium\",\"namespace\":null}],\"children\":[],\"namespace\":\"http://docs.oasis-open.org/odata/ns/edm\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Kunnr\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Name1\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Dmbtr\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Hwaer\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"BUDAT\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"BLDAT\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Cnt\"}],\"extensions\":[{\"name\":\"Annotation\",\"value\":null,\"attributes\":[{\"name\":\"Term\",\"value\":\"com.sap.vocabularies.UI.v1.Importance\",\"namespace\":null},{\"name\":\"EnumMember\",\"value\":\"com.sap.vocabularies.UI.v1.ImportanceType/Low\",\"namespace\":null}],\"children\":[],\"namespace\":\"http://docs.oasis-open.org/odata/ns/edm\"}]}]},\"fields\":[\"Bukrs\",\"Gjahr\",\"Kunnr\",\"Name1\",\"Dmbtr\",\"Hwaer\",\"BUDAT\",\"BLDAT\",\"Cnt\"],\"labels\":{\"Bukrs\":\"my Bukrs\"}},\"semantic\":null},\"path\":\"Kunnr\",\"namespace\":\"com.sap.GL.zrha\",\"entitySet\":{\"name\":\"LineItemsSet\",\"entityType\":\"com.sap.GL.zrha.LineItems\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"deletable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"pageable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},\"entityType\":{\"name\":\"LineItems\",\"key\":{\"propertyRef\":[{\"name\":\"Id\"}]},\"property\":[{\"name\":\"Id\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"visible\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"SADL Key Field\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:visible\":\"false\",\"sap:label\":\"SADL Key Field\",\"sap:creatable\":\"false\"},{\"name\":\"Bukrs\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"required-in-filter\",\"value\":\"true\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Company Code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"CoCd\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:required-in-filter\":\"true\",\"sap:label\":\"Company Code\",\"sap:heading\":\"CoCd\",\"sap:creatable\":\"false\"},{\"name\":\"Belnr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Document Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Doc. No.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Accounting Document Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Document Number\",\"sap:heading\":\"Doc. No.\",\"sap:quickinfo\":\"Accounting Document Number\",\"sap:creatable\":\"false\"},{\"name\":\"Gjahr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"NonNegative\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"required-in-filter\",\"value\":\"true\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Fiscal Year\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Year\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"NonNegative\",\"sap:required-in-filter\":\"true\",\"sap:label\":\"Fiscal Year\",\"sap:heading\":\"Year\",\"sap:creatable\":\"false\"},{\"name\":\"Buzei\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\",\"precision\":\"3\",\"scale\":\"0\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"NonNegative\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Line Item\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Itm\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Number of Line Item Within Accounting Document\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"NonNegative\",\"sap:label\":\"Line Item\",\"sap:heading\":\"Itm\",\"sap:quickinfo\":\"Number of Line Item Within Accounting Document\",\"sap:creatable\":\"false\"},{\"name\":\"Kunnr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"text\",\"value\":\"Name1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Customer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Customer Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:text\":\"Name1\",\"sap:label\":\"Customer\",\"sap:quickinfo\":\"Customer Number\",\"sap:creatable\":\"false\"},{\"name\":\"Augbl\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Clearing Doc. No.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Clrng Doc.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Clearing Document Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Clearing Doc. No.\",\"sap:heading\":\"Clrng Doc.\",\"sap:quickinfo\":\"Clearing Document Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Dmbtr\",\"type\":\"Edm.Decimal\",\"precision\":\"25\",\"scale\":\"2\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"measure\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"unit\",\"value\":\"Hwaer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Amount in LC\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"measure\",\"sap:unit\":\"Hwaer\",\"sap:label\":\"Amount in LC\",\"sap:creatable\":\"false\"},{\"name\":\"Sgtxt\",\"type\":\"Edm.String\",\"maxLength\":\"50\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Item Text\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Item Text\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Umskz\",\"type\":\"Edm.String\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Special G/L ind\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"SG\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Special G/L Indicator\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Special G/L ind\",\"sap:heading\":\"SG\",\"sap:quickinfo\":\"Special G/L Indicator\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Zuonr\",\"type\":\"Edm.String\",\"maxLength\":\"18\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"visible\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Assignment\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Assignment Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:visible\":\"false\",\"sap:label\":\"Assignment\",\"sap:quickinfo\":\"Assignment Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Blart\",\"type\":\"Edm.String\",\"maxLength\":\"2\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Document Type\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"DT\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Document Type\",\"sap:heading\":\"DT\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Hwaer\",\"type\":\"Edm.String\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Currency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Crcy\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Currency Key\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:label\":\"Currency\",\"sap:heading\":\"Crcy\",\"sap:quickinfo\":\"Currency Key\",\"sap:creatable\":\"false\",\"sap:semantics\":\"currency-code\"},{\"name\":\"Name1\",\"type\":\"Edm.String\",\"maxLength\":\"35\",\"extensions\":[{\"name\":\"label\",\"value\":\"Name\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Name 1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Name 1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Name\",\"sap:heading\":\"Name 1\",\"sap:quickinfo\":\"Name 1\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"KOSTL\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Cost Center\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Cost Ctr\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:label\":\"Cost Center\",\"sap:heading\":\"Cost Ctr\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"PRCTR\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Profit Center\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Profit Center\",\"sap:creatable\":\"false\"},{\"name\":\"HKONT\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"G/L\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"General Ledger Account\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"G/L\",\"sap:quickinfo\":\"General Ledger Account\",\"sap:creatable\":\"false\"},{\"name\":\"SHKZG\",\"type\":\"Edm.String\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Debit/Credit\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"D/C\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Debit/Credit Indicator\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Debit/Credit\",\"sap:heading\":\"D/C\",\"sap:quickinfo\":\"Debit/Credit Indicator\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"GSBER\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Business Area\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"BusA\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Business Area\",\"sap:heading\":\"BusA\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"AUFNR\",\"type\":\"Edm.String\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Order\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Order Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Order\",\"sap:quickinfo\":\"Order Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"ANLN1\",\"type\":\"Edm.String\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Main Asset No.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Asset\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Main Asset Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Main Asset No.\",\"sap:heading\":\"Asset\",\"sap:quickinfo\":\"Main Asset Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"ANLN2\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Subnumber\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"SNo.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Asset Subnumber\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Subnumber\",\"sap:heading\":\"SNo.\",\"sap:quickinfo\":\"Asset Subnumber\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"BUDAT\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filter-restriction\",\"value\":\"interval\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Posting Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Pstng Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Posting Date in the Document\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"Date\",\"sap:filter-restriction\":\"interval\",\"sap:label\":\"Posting Date\",\"sap:heading\":\"Pstng Date\",\"sap:quickinfo\":\"Posting Date in the Document\",\"sap:creatable\":\"false\"},{\"name\":\"BLDAT\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Document Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Doc. Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Document Date in Document\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"Date\",\"sap:label\":\"Document Date\",\"sap:heading\":\"Doc. Date\",\"sap:quickinfo\":\"Document Date in Document\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"SAKNR\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"G/L Account\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"G/L Acct\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"G/L Account Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"G/L Account\",\"sap:heading\":\"G/L Acct\",\"sap:quickinfo\":\"G/L Account Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Cnt\",\"type\":\"Edm.Int32\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"measure\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Count\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"measure\",\"sap:label\":\"Count\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\",\"sap:filterable\":\"false\"}],\"extensions\":[{\"name\":\"label\",\"value\":\"Line Item\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"aggregate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Line Item\",\"sap:semantics\":\"aggregate\",\"sap:content-version\":\"1\",\"$path\":\"/dataServices/schema/0/entityType/2\"},\"typecount\":2,\"property\":{\"property\":{\"name\":\"Kunnr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"text\",\"value\":\"Name1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Customer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Customer Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:text\":\"Name1\",\"sap:label\":\"Customer\",\"sap:quickinfo\":\"Customer Number\",\"sap:creatable\":\"false\"},\"typePath\":\"Kunnr\",\"extensions\":{\"sap:creatable\":{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:quickinfo\":{\"name\":\"quickinfo\",\"value\":\"Customer Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:label\":{\"name\":\"label\",\"value\":\"Customer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:text\":{\"name\":\"text\",\"value\":\"Name1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:display-format\":{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:aggregation-role\":{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}}}}");

		QUnitHelper.liftV4Annotations(oMetaData);

		oMetaData.annotations.uom = {
			entitySet : oMetaData.entitySet,
			entityType : oMetaData.entityType,
			property: oMetaData.property
		};
		this.oMetaData.getUOMValueListAnnotationPath(oMetaData);
		assert.equal("com.sap.GL.zrha.LineItems/Kunnr", oMetaData.annotations.valuelistuom);
	});

	QUnit.test("getUOMTextAnnotation", function(assert) {
		var oMetaData = JSON.parse("{\"annotations\":{\"uom\":null,\"lineitem\":{\"term\":\"com.sap.vocabularies.UI.v1.LineItem\",\"collection\":{\"record\":[{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Bukrs\"},{\"property\":\"Label\",\"string\":\"my Bukrs\"}],\"extensions\":[{\"name\":\"Annotation\",\"value\":null,\"attributes\":[{\"name\":\"Term\",\"value\":\"com.sap.vocabularies.UI.v1.Importance\",\"namespace\":null},{\"name\":\"EnumMember\",\"value\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\",\"namespace\":null}],\"children\":[],\"namespace\":\"http://docs.oasis-open.org/odata/ns/edm\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Gjahr\"}],\"extensions\":[{\"name\":\"Annotation\",\"value\":null,\"attributes\":[{\"name\":\"Term\",\"value\":\"com.sap.vocabularies.UI.v1.Importance\",\"namespace\":null},{\"name\":\"EnumMember\",\"value\":\"com.sap.vocabularies.UI.v1.ImportanceType/Medium\",\"namespace\":null}],\"children\":[],\"namespace\":\"http://docs.oasis-open.org/odata/ns/edm\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Kunnr\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Name1\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Dmbtr\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Hwaer\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"BUDAT\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"BLDAT\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Cnt\"}],\"extensions\":[{\"name\":\"Annotation\",\"value\":null,\"attributes\":[{\"name\":\"Term\",\"value\":\"com.sap.vocabularies.UI.v1.Importance\",\"namespace\":null},{\"name\":\"EnumMember\",\"value\":\"com.sap.vocabularies.UI.v1.ImportanceType/Low\",\"namespace\":null}],\"children\":[],\"namespace\":\"http://docs.oasis-open.org/odata/ns/edm\"}]}]},\"fields\":[\"Bukrs\",\"Gjahr\",\"Kunnr\",\"Name1\",\"Dmbtr\",\"Hwaer\",\"BUDAT\",\"BLDAT\",\"Cnt\"],\"labels\":{\"Bukrs\":\"my Bukrs\"}},\"semantic\":null},\"path\":\"Kunnr\",\"namespace\":\"com.sap.GL.zrha\",\"entitySet\":{\"name\":\"LineItemsSet\",\"entityType\":\"com.sap.GL.zrha.LineItems\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"deletable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"pageable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},\"entityType\":{\"name\":\"LineItems\",\"key\":{\"propertyRef\":[{\"name\":\"Id\"}]},\"property\":[{\"name\":\"Id\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"visible\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"SADL Key Field\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:visible\":\"false\",\"sap:label\":\"SADL Key Field\",\"sap:creatable\":\"false\"},{\"name\":\"Bukrs\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"required-in-filter\",\"value\":\"true\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Company Code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"CoCd\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:required-in-filter\":\"true\",\"sap:label\":\"Company Code\",\"sap:heading\":\"CoCd\",\"sap:creatable\":\"false\"},{\"name\":\"Belnr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Document Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Doc. No.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Accounting Document Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Document Number\",\"sap:heading\":\"Doc. No.\",\"sap:quickinfo\":\"Accounting Document Number\",\"sap:creatable\":\"false\"},{\"name\":\"Gjahr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"NonNegative\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"required-in-filter\",\"value\":\"true\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Fiscal Year\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Year\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"NonNegative\",\"sap:required-in-filter\":\"true\",\"sap:label\":\"Fiscal Year\",\"sap:heading\":\"Year\",\"sap:creatable\":\"false\"},{\"name\":\"Buzei\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\",\"precision\":\"3\",\"scale\":\"0\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"NonNegative\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Line Item\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Itm\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Number of Line Item Within Accounting Document\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"NonNegative\",\"sap:label\":\"Line Item\",\"sap:heading\":\"Itm\",\"sap:quickinfo\":\"Number of Line Item Within Accounting Document\",\"sap:creatable\":\"false\"},{\"name\":\"Kunnr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"text\",\"value\":\"Name1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Customer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Customer Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:text\":\"Name1\",\"sap:label\":\"Customer\",\"sap:quickinfo\":\"Customer Number\",\"sap:creatable\":\"false\"},{\"name\":\"Augbl\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Clearing Doc. No.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Clrng Doc.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Clearing Document Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Clearing Doc. No.\",\"sap:heading\":\"Clrng Doc.\",\"sap:quickinfo\":\"Clearing Document Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Dmbtr\",\"type\":\"Edm.Decimal\",\"precision\":\"25\",\"scale\":\"2\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"measure\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"unit\",\"value\":\"Hwaer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Amount in LC\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"measure\",\"sap:unit\":\"Hwaer\",\"sap:label\":\"Amount in LC\",\"sap:creatable\":\"false\"},{\"name\":\"Sgtxt\",\"type\":\"Edm.String\",\"maxLength\":\"50\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Item Text\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Item Text\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Umskz\",\"type\":\"Edm.String\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Special G/L ind\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"SG\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Special G/L Indicator\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Special G/L ind\",\"sap:heading\":\"SG\",\"sap:quickinfo\":\"Special G/L Indicator\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Zuonr\",\"type\":\"Edm.String\",\"maxLength\":\"18\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"visible\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Assignment\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Assignment Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:visible\":\"false\",\"sap:label\":\"Assignment\",\"sap:quickinfo\":\"Assignment Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Blart\",\"type\":\"Edm.String\",\"maxLength\":\"2\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Document Type\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"DT\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Document Type\",\"sap:heading\":\"DT\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Hwaer\",\"type\":\"Edm.String\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Currency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Crcy\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Currency Key\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:label\":\"Currency\",\"sap:heading\":\"Crcy\",\"sap:quickinfo\":\"Currency Key\",\"sap:creatable\":\"false\",\"sap:semantics\":\"currency-code\"},{\"name\":\"Name1\",\"type\":\"Edm.String\",\"maxLength\":\"35\",\"extensions\":[{\"name\":\"label\",\"value\":\"Name\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Name 1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Name 1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Name\",\"sap:heading\":\"Name 1\",\"sap:quickinfo\":\"Name 1\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"KOSTL\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Cost Center\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Cost Ctr\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:label\":\"Cost Center\",\"sap:heading\":\"Cost Ctr\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"PRCTR\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Profit Center\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Profit Center\",\"sap:creatable\":\"false\"},{\"name\":\"HKONT\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"G/L\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"General Ledger Account\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"G/L\",\"sap:quickinfo\":\"General Ledger Account\",\"sap:creatable\":\"false\"},{\"name\":\"SHKZG\",\"type\":\"Edm.String\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Debit/Credit\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"D/C\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Debit/Credit Indicator\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Debit/Credit\",\"sap:heading\":\"D/C\",\"sap:quickinfo\":\"Debit/Credit Indicator\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"GSBER\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Business Area\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"BusA\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Business Area\",\"sap:heading\":\"BusA\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"AUFNR\",\"type\":\"Edm.String\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Order\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Order Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Order\",\"sap:quickinfo\":\"Order Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"ANLN1\",\"type\":\"Edm.String\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Main Asset No.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Asset\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Main Asset Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Main Asset No.\",\"sap:heading\":\"Asset\",\"sap:quickinfo\":\"Main Asset Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"ANLN2\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Subnumber\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"SNo.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Asset Subnumber\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Subnumber\",\"sap:heading\":\"SNo.\",\"sap:quickinfo\":\"Asset Subnumber\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"BUDAT\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filter-restriction\",\"value\":\"interval\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Posting Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Pstng Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Posting Date in the Document\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"Date\",\"sap:filter-restriction\":\"interval\",\"sap:label\":\"Posting Date\",\"sap:heading\":\"Pstng Date\",\"sap:quickinfo\":\"Posting Date in the Document\",\"sap:creatable\":\"false\"},{\"name\":\"BLDAT\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Document Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Doc. Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Document Date in Document\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"Date\",\"sap:label\":\"Document Date\",\"sap:heading\":\"Doc. Date\",\"sap:quickinfo\":\"Document Date in Document\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"SAKNR\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"G/L Account\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"G/L Acct\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"G/L Account Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"G/L Account\",\"sap:heading\":\"G/L Acct\",\"sap:quickinfo\":\"G/L Account Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Cnt\",\"type\":\"Edm.Int32\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"measure\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Count\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"measure\",\"sap:label\":\"Count\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\",\"sap:filterable\":\"false\"}],\"extensions\":[{\"name\":\"label\",\"value\":\"Line Item\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"aggregate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Line Item\",\"sap:semantics\":\"aggregate\",\"sap:content-version\":\"1\",\"$path\":\"/dataServices/schema/0/entityType/2\"},\"typecount\":2,\"property\":{\"property\":{\"name\":\"Kunnr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"text\",\"value\":\"Name1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Customer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Customer Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:text\":\"Name1\",\"sap:label\":\"Customer\",\"sap:quickinfo\":\"Customer Number\",\"sap:creatable\":\"false\"},\"typePath\":\"Kunnr\",\"extensions\":{\"sap:creatable\":{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:quickinfo\":{\"name\":\"quickinfo\",\"value\":\"Customer Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:label\":{\"name\":\"label\",\"value\":\"Customer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:text\":{\"name\":\"text\",\"value\":\"Name1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:display-format\":{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:aggregation-role\":{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}}}}");

		QUnitHelper.liftV4Annotations(oMetaData);

		oMetaData.annotations.uom = {
			entitySet : oMetaData.entitySet,
			entityType : oMetaData.entityType,
			property: oMetaData.property,
			path: "Kunnr"
		};

		this.oMetaData.getUOMTextAnnotation(oMetaData);
		assert.equal("Name1", oMetaData.annotations.textuom.path);
	});

	QUnit.test("getValueListData shall use sap:value-list annotation", function(assert) {
		var oMetaData = JSON.parse("{\"annotations\":{\"uom\":null,\"lineitem\":{\"term\":\"com.sap.vocabularies.UI.v1.LineItem\",\"collection\":{\"record\":[{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Bukrs\"},{\"property\":\"Label\",\"string\":\"my Bukrs\"}],\"extensions\":[{\"name\":\"Annotation\",\"value\":null,\"attributes\":[{\"name\":\"Term\",\"value\":\"com.sap.vocabularies.UI.v1.Importance\",\"namespace\":null},{\"name\":\"EnumMember\",\"value\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\",\"namespace\":null}],\"children\":[],\"namespace\":\"http://docs.oasis-open.org/odata/ns/edm\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Gjahr\"}],\"extensions\":[{\"name\":\"Annotation\",\"value\":null,\"attributes\":[{\"name\":\"Term\",\"value\":\"com.sap.vocabularies.UI.v1.Importance\",\"namespace\":null},{\"name\":\"EnumMember\",\"value\":\"com.sap.vocabularies.UI.v1.ImportanceType/Medium\",\"namespace\":null}],\"children\":[],\"namespace\":\"http://docs.oasis-open.org/odata/ns/edm\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Kunnr\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Name1\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Dmbtr\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Hwaer\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"BUDAT\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"BLDAT\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Cnt\"}],\"extensions\":[{\"name\":\"Annotation\",\"value\":null,\"attributes\":[{\"name\":\"Term\",\"value\":\"com.sap.vocabularies.UI.v1.Importance\",\"namespace\":null},{\"name\":\"EnumMember\",\"value\":\"com.sap.vocabularies.UI.v1.ImportanceType/Low\",\"namespace\":null}],\"children\":[],\"namespace\":\"http://docs.oasis-open.org/odata/ns/edm\"}]}]},\"fields\":[\"Bukrs\",\"Gjahr\",\"Kunnr\",\"Name1\",\"Dmbtr\",\"Hwaer\",\"BUDAT\",\"BLDAT\",\"Cnt\"],\"labels\":{\"Bukrs\":\"my Bukrs\"}},\"semantic\":null},\"path\":\"Kunnr\",\"namespace\":\"com.sap.GL.zrha\",\"entitySet\":{\"name\":\"LineItemsSet\",\"entityType\":\"com.sap.GL.zrha.LineItems\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"deletable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"pageable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},\"entityType\":{\"name\":\"LineItems\",\"key\":{\"propertyRef\":[{\"name\":\"Id\"}]},\"property\":[{\"name\":\"Id\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"visible\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"SADL Key Field\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:visible\":\"false\",\"sap:label\":\"SADL Key Field\",\"sap:creatable\":\"false\"},{\"name\":\"Bukrs\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"required-in-filter\",\"value\":\"true\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Company Code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"CoCd\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:required-in-filter\":\"true\",\"sap:label\":\"Company Code\",\"sap:heading\":\"CoCd\",\"sap:creatable\":\"false\"},{\"name\":\"Belnr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Document Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Doc. No.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Accounting Document Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Document Number\",\"sap:heading\":\"Doc. No.\",\"sap:quickinfo\":\"Accounting Document Number\",\"sap:creatable\":\"false\"},{\"name\":\"Gjahr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"NonNegative\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"required-in-filter\",\"value\":\"true\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Fiscal Year\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Year\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"NonNegative\",\"sap:required-in-filter\":\"true\",\"sap:label\":\"Fiscal Year\",\"sap:heading\":\"Year\",\"sap:creatable\":\"false\"},{\"name\":\"Buzei\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\",\"precision\":\"3\",\"scale\":\"0\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"NonNegative\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Line Item\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Itm\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Number of Line Item Within Accounting Document\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"NonNegative\",\"sap:label\":\"Line Item\",\"sap:heading\":\"Itm\",\"sap:quickinfo\":\"Number of Line Item Within Accounting Document\",\"sap:creatable\":\"false\"},{\"name\":\"Kunnr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"text\",\"value\":\"Name1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Customer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Customer Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:text\":\"Name1\",\"sap:label\":\"Customer\",\"sap:quickinfo\":\"Customer Number\",\"sap:creatable\":\"false\"},{\"name\":\"Augbl\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Clearing Doc. No.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Clrng Doc.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Clearing Document Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Clearing Doc. No.\",\"sap:heading\":\"Clrng Doc.\",\"sap:quickinfo\":\"Clearing Document Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Dmbtr\",\"type\":\"Edm.Decimal\",\"precision\":\"25\",\"scale\":\"2\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"measure\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"unit\",\"value\":\"Hwaer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Amount in LC\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"measure\",\"sap:unit\":\"Hwaer\",\"sap:label\":\"Amount in LC\",\"sap:creatable\":\"false\"},{\"name\":\"Sgtxt\",\"type\":\"Edm.String\",\"maxLength\":\"50\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Item Text\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Item Text\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Umskz\",\"type\":\"Edm.String\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Special G/L ind\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"SG\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Special G/L Indicator\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Special G/L ind\",\"sap:heading\":\"SG\",\"sap:quickinfo\":\"Special G/L Indicator\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Zuonr\",\"type\":\"Edm.String\",\"maxLength\":\"18\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"visible\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Assignment\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Assignment Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:visible\":\"false\",\"sap:label\":\"Assignment\",\"sap:quickinfo\":\"Assignment Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Blart\",\"type\":\"Edm.String\",\"maxLength\":\"2\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Document Type\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"DT\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Document Type\",\"sap:heading\":\"DT\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Hwaer\",\"type\":\"Edm.String\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Currency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Crcy\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Currency Key\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:label\":\"Currency\",\"sap:heading\":\"Crcy\",\"sap:quickinfo\":\"Currency Key\",\"sap:creatable\":\"false\",\"sap:semantics\":\"currency-code\"},{\"name\":\"Name1\",\"type\":\"Edm.String\",\"maxLength\":\"35\",\"extensions\":[{\"name\":\"label\",\"value\":\"Name\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Name 1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Name 1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Name\",\"sap:heading\":\"Name 1\",\"sap:quickinfo\":\"Name 1\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"KOSTL\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Cost Center\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Cost Ctr\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:label\":\"Cost Center\",\"sap:heading\":\"Cost Ctr\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"PRCTR\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Profit Center\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Profit Center\",\"sap:creatable\":\"false\"},{\"name\":\"HKONT\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"G/L\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"General Ledger Account\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"G/L\",\"sap:quickinfo\":\"General Ledger Account\",\"sap:creatable\":\"false\"},{\"name\":\"SHKZG\",\"type\":\"Edm.String\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Debit/Credit\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"D/C\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Debit/Credit Indicator\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Debit/Credit\",\"sap:heading\":\"D/C\",\"sap:quickinfo\":\"Debit/Credit Indicator\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"GSBER\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Business Area\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"BusA\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Business Area\",\"sap:heading\":\"BusA\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"AUFNR\",\"type\":\"Edm.String\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Order\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Order Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Order\",\"sap:quickinfo\":\"Order Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"ANLN1\",\"type\":\"Edm.String\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Main Asset No.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Asset\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Main Asset Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Main Asset No.\",\"sap:heading\":\"Asset\",\"sap:quickinfo\":\"Main Asset Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"ANLN2\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Subnumber\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"SNo.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Asset Subnumber\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Subnumber\",\"sap:heading\":\"SNo.\",\"sap:quickinfo\":\"Asset Subnumber\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"BUDAT\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filter-restriction\",\"value\":\"interval\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Posting Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Pstng Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Posting Date in the Document\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"Date\",\"sap:filter-restriction\":\"interval\",\"sap:label\":\"Posting Date\",\"sap:heading\":\"Pstng Date\",\"sap:quickinfo\":\"Posting Date in the Document\",\"sap:creatable\":\"false\"},{\"name\":\"BLDAT\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Document Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Doc. Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Document Date in Document\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"Date\",\"sap:label\":\"Document Date\",\"sap:heading\":\"Doc. Date\",\"sap:quickinfo\":\"Document Date in Document\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"SAKNR\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"G/L Account\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"G/L Acct\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"G/L Account Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"G/L Account\",\"sap:heading\":\"G/L Acct\",\"sap:quickinfo\":\"G/L Account Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Cnt\",\"type\":\"Edm.Int32\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"measure\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Count\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"measure\",\"sap:label\":\"Count\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\",\"sap:filterable\":\"false\"}],\"extensions\":[{\"name\":\"label\",\"value\":\"Line Item\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"aggregate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Line Item\",\"sap:semantics\":\"aggregate\",\"sap:content-version\":\"1\",\"$path\":\"/dataServices/schema/0/entityType/2\"},\"typecount\":2,\"property\":{\"property\":{\"name\":\"Kunnr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"text\",\"value\":\"Name1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Customer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Customer Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:text\":\"Name1\",\"sap:label\":\"Customer\",\"sap:quickinfo\":\"Customer Number\",\"sap:creatable\":\"false\"},\"typePath\":\"Kunnr\",\"extensions\":{\"sap:creatable\":{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:quickinfo\":{\"name\":\"quickinfo\",\"value\":\"Customer Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:label\":{\"name\":\"label\",\"value\":\"Customer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:text\":{\"name\":\"text\",\"value\":\"Name1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:display-format\":{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:aggregation-role\":{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}}}}");
		oMetaData.property.property["sap:value-list"] = true;
		QUnitHelper.liftV4Annotations(oMetaData);
		this.oMetaData.getValueListData(oMetaData);

		// assert
		assert.equal(oMetaData.annotations.valuelistType, true);
	});

	QUnit.test("getValueListData shall use com.sap.vocabularies.Common.v1.ValueList", function(assert) {
		var oMetaData = JSON.parse("{\"annotations\":{\"uom\":null,\"lineitem\":{\"term\":\"com.sap.vocabularies.UI.v1.LineItem\",\"collection\":{\"record\":[{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Bukrs\"},{\"property\":\"Label\",\"string\":\"my Bukrs\"}],\"extensions\":[{\"name\":\"Annotation\",\"value\":null,\"attributes\":[{\"name\":\"Term\",\"value\":\"com.sap.vocabularies.UI.v1.Importance\",\"namespace\":null},{\"name\":\"EnumMember\",\"value\":\"com.sap.vocabularies.UI.v1.ImportanceType/High\",\"namespace\":null}],\"children\":[],\"namespace\":\"http://docs.oasis-open.org/odata/ns/edm\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Gjahr\"}],\"extensions\":[{\"name\":\"Annotation\",\"value\":null,\"attributes\":[{\"name\":\"Term\",\"value\":\"com.sap.vocabularies.UI.v1.Importance\",\"namespace\":null},{\"name\":\"EnumMember\",\"value\":\"com.sap.vocabularies.UI.v1.ImportanceType/Medium\",\"namespace\":null}],\"children\":[],\"namespace\":\"http://docs.oasis-open.org/odata/ns/edm\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Kunnr\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Name1\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Dmbtr\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Hwaer\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"BUDAT\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"BLDAT\"}]},{\"type\":\"com.sap.vocabularies.UI.v1.DataField\",\"propertyValue\":[{\"property\":\"Value\",\"path\":\"Cnt\"}],\"extensions\":[{\"name\":\"Annotation\",\"value\":null,\"attributes\":[{\"name\":\"Term\",\"value\":\"com.sap.vocabularies.UI.v1.Importance\",\"namespace\":null},{\"name\":\"EnumMember\",\"value\":\"com.sap.vocabularies.UI.v1.ImportanceType/Low\",\"namespace\":null}],\"children\":[],\"namespace\":\"http://docs.oasis-open.org/odata/ns/edm\"}]}]},\"fields\":[\"Bukrs\",\"Gjahr\",\"Kunnr\",\"Name1\",\"Dmbtr\",\"Hwaer\",\"BUDAT\",\"BLDAT\",\"Cnt\"],\"labels\":{\"Bukrs\":\"my Bukrs\"}},\"semantic\":null},\"path\":\"Kunnr\",\"namespace\":\"com.sap.GL.zrha\",\"entitySet\":{\"name\":\"LineItemsSet\",\"entityType\":\"com.sap.GL.zrha.LineItems\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"deletable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"pageable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},\"entityType\":{\"name\":\"LineItems\",\"key\":{\"propertyRef\":[{\"name\":\"Id\"}]},\"property\":[{\"name\":\"Id\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"visible\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"SADL Key Field\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:visible\":\"false\",\"sap:label\":\"SADL Key Field\",\"sap:creatable\":\"false\"},{\"name\":\"Bukrs\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"required-in-filter\",\"value\":\"true\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Company Code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"CoCd\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:required-in-filter\":\"true\",\"sap:label\":\"Company Code\",\"sap:heading\":\"CoCd\",\"sap:creatable\":\"false\"},{\"name\":\"Belnr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Document Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Doc. No.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Accounting Document Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Document Number\",\"sap:heading\":\"Doc. No.\",\"sap:quickinfo\":\"Accounting Document Number\",\"sap:creatable\":\"false\"},{\"name\":\"Gjahr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"NonNegative\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"required-in-filter\",\"value\":\"true\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Fiscal Year\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Year\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"NonNegative\",\"sap:required-in-filter\":\"true\",\"sap:label\":\"Fiscal Year\",\"sap:heading\":\"Year\",\"sap:creatable\":\"false\"},{\"name\":\"Buzei\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\",\"precision\":\"3\",\"scale\":\"0\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"NonNegative\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Line Item\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Itm\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Number of Line Item Within Accounting Document\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"NonNegative\",\"sap:label\":\"Line Item\",\"sap:heading\":\"Itm\",\"sap:quickinfo\":\"Number of Line Item Within Accounting Document\",\"sap:creatable\":\"false\"},{\"name\":\"Kunnr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"text\",\"value\":\"Name1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Customer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Customer Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:text\":\"Name1\",\"sap:label\":\"Customer\",\"sap:quickinfo\":\"Customer Number\",\"sap:creatable\":\"false\"},{\"name\":\"Augbl\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Clearing Doc. No.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Clrng Doc.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Clearing Document Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Clearing Doc. No.\",\"sap:heading\":\"Clrng Doc.\",\"sap:quickinfo\":\"Clearing Document Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Dmbtr\",\"type\":\"Edm.Decimal\",\"precision\":\"25\",\"scale\":\"2\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"measure\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"unit\",\"value\":\"Hwaer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Amount in LC\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"measure\",\"sap:unit\":\"Hwaer\",\"sap:label\":\"Amount in LC\",\"sap:creatable\":\"false\"},{\"name\":\"Sgtxt\",\"type\":\"Edm.String\",\"maxLength\":\"50\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Item Text\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Item Text\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Umskz\",\"type\":\"Edm.String\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Special G/L ind\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"SG\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Special G/L Indicator\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Special G/L ind\",\"sap:heading\":\"SG\",\"sap:quickinfo\":\"Special G/L Indicator\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Zuonr\",\"type\":\"Edm.String\",\"maxLength\":\"18\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"visible\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Assignment\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Assignment Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:visible\":\"false\",\"sap:label\":\"Assignment\",\"sap:quickinfo\":\"Assignment Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Blart\",\"type\":\"Edm.String\",\"maxLength\":\"2\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Document Type\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"DT\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Document Type\",\"sap:heading\":\"DT\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Hwaer\",\"type\":\"Edm.String\",\"maxLength\":\"5\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Currency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Crcy\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Currency Key\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"currency-code\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:label\":\"Currency\",\"sap:heading\":\"Crcy\",\"sap:quickinfo\":\"Currency Key\",\"sap:creatable\":\"false\",\"sap:semantics\":\"currency-code\"},{\"name\":\"Name1\",\"type\":\"Edm.String\",\"maxLength\":\"35\",\"extensions\":[{\"name\":\"label\",\"value\":\"Name\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Name 1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Name 1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Name\",\"sap:heading\":\"Name 1\",\"sap:quickinfo\":\"Name 1\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"KOSTL\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Cost Center\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Cost Ctr\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:label\":\"Cost Center\",\"sap:heading\":\"Cost Ctr\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"PRCTR\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Profit Center\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Profit Center\",\"sap:creatable\":\"false\"},{\"name\":\"HKONT\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"G/L\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"General Ledger Account\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"G/L\",\"sap:quickinfo\":\"General Ledger Account\",\"sap:creatable\":\"false\"},{\"name\":\"SHKZG\",\"type\":\"Edm.String\",\"maxLength\":\"1\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Debit/Credit\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"D/C\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Debit/Credit Indicator\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Debit/Credit\",\"sap:heading\":\"D/C\",\"sap:quickinfo\":\"Debit/Credit Indicator\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"GSBER\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Business Area\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"BusA\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Business Area\",\"sap:heading\":\"BusA\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"AUFNR\",\"type\":\"Edm.String\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Order\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Order Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Order\",\"sap:quickinfo\":\"Order Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"ANLN1\",\"type\":\"Edm.String\",\"maxLength\":\"12\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Main Asset No.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Asset\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Main Asset Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Main Asset No.\",\"sap:heading\":\"Asset\",\"sap:quickinfo\":\"Main Asset Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"ANLN2\",\"type\":\"Edm.String\",\"maxLength\":\"4\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Subnumber\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"SNo.\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Asset Subnumber\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"Subnumber\",\"sap:heading\":\"SNo.\",\"sap:quickinfo\":\"Asset Subnumber\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"BUDAT\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filter-restriction\",\"value\":\"interval\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Posting Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Pstng Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Posting Date in the Document\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"Date\",\"sap:filter-restriction\":\"interval\",\"sap:label\":\"Posting Date\",\"sap:heading\":\"Pstng Date\",\"sap:quickinfo\":\"Posting Date in the Document\",\"sap:creatable\":\"false\"},{\"name\":\"BLDAT\",\"type\":\"Edm.DateTime\",\"precision\":\"0\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Document Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"Doc. Date\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Document Date in Document\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"Date\",\"sap:label\":\"Document Date\",\"sap:heading\":\"Doc. Date\",\"sap:quickinfo\":\"Document Date in Document\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"SAKNR\",\"type\":\"Edm.String\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"G/L Account\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"heading\",\"value\":\"G/L Acct\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"G/L Account Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:label\":\"G/L Account\",\"sap:heading\":\"G/L Acct\",\"sap:quickinfo\":\"G/L Account Number\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\"},{\"name\":\"Cnt\",\"type\":\"Edm.Int32\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"measure\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Count\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"measure\",\"sap:label\":\"Count\",\"sap:creatable\":\"false\",\"sap:updatable\":\"false\",\"sap:filterable\":\"false\"}],\"extensions\":[{\"name\":\"label\",\"value\":\"Line Item\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"semantics\",\"value\":\"aggregate\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:label\":\"Line Item\",\"sap:semantics\":\"aggregate\",\"sap:content-version\":\"1\",\"$path\":\"/dataServices/schema/0/entityType/2\"},\"typecount\":2,\"property\":{\"property\":{\"name\":\"Kunnr\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"10\",\"extensions\":[{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"text\",\"value\":\"Name1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Customer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"quickinfo\",\"value\":\"Customer Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}],\"sap:aggregation-role\":\"dimension\",\"sap:display-format\":\"UpperCase\",\"sap:text\":\"Name1\",\"sap:label\":\"Customer\",\"sap:quickinfo\":\"Customer Number\",\"sap:creatable\":\"false\"},\"typePath\":\"Kunnr\",\"extensions\":{\"sap:creatable\":{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:quickinfo\":{\"name\":\"quickinfo\",\"value\":\"Customer Number\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:label\":{\"name\":\"label\",\"value\":\"Customer\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:text\":{\"name\":\"text\",\"value\":\"Name1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:display-format\":{\"name\":\"display-format\",\"value\":\"UpperCase\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:aggregation-role\":{\"name\":\"aggregation-role\",\"value\":\"dimension\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}}}}");
		oMetaData.property.property["com.sap.vocabularies.Common.v1.ValueList"] = {
			"CollectionPath": {
				String: "COUNTRYSet"
			}
		};

		QUnitHelper.liftV4Annotations(oMetaData);
		this.oMetaData.getValueListData(oMetaData);

		// assert
		assert.ok(!oMetaData.annotations.valuelistType);
	});

	QUnit.test("getUnitOfMeasure: currency-code", function(assert) {

		// create the mock
		function findIndex(aArray, vExpectedPropertyValue, sPropertyName) {
			var iIndex = -1;

			sPropertyName = sPropertyName || "name";
			jQuery.each(aArray || [], function (i, oObject) {
				if (oObject[sPropertyName] === vExpectedPropertyValue) {
					iIndex = i;
					return false; // break
				}
			});

			return iIndex;
		}

		function getObject1(oModel, sArrayName, sQualifiedName, bAsPath) {
			var vResult = bAsPath ? undefined : null,
				iSeparatorPos,
				sNamespace,
				sName;

			sQualifiedName = sQualifiedName || "";
			iSeparatorPos = sQualifiedName.lastIndexOf(".");
			sNamespace = sQualifiedName.slice(0, iSeparatorPos);
			sName = sQualifiedName.slice(iSeparatorPos + 1);

			jQuery.each(oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {

				if (oSchema.namespace === sNamespace) {
					jQuery.each(oSchema[sArrayName] || [], function (j, oThing) {

						if (oThing.name === sName) {
							vResult = bAsPath ? oThing.$path : oThing;
							return false; // break
						}
					});

					return false;
				}
			});

			return vResult;
		}

		var oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			var oStub = sinon.createStubInstance(ODataMetaModel);
			oStub.oModel = new JSONModel(oSimpleTestModel);
			oStub.oData = oSimpleTestModel;

			oStub.getObject = function(sPath) {
				var oNode,
					aParts = sPath.split("/"),
					iIndex = 0;

				if (!aParts[0]) {
					// absolute path starting with slash
					oNode = this.oData;
					iIndex++;
				}

				while (oNode && aParts[iIndex]) {
					oNode = oNode[aParts[iIndex]];
					iIndex++;
				}

				return oNode;
			};

			oStub.getODataEntityContainer = function(bAsPath) {
				var vResult = bAsPath ? undefined : null;

				jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
					var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

					if (j >= 0) {
						vResult = bAsPath
							? "/dataServices/schema/" + i + "/entityContainer/" + j
							: oSchema.entityContainer[j];
						return false; //break
					}
				});

				return vResult;
			};

			oStub.getODataEntitySet = function(sName, bAsPath) {
				var k,
					oEntityContainer = this.getODataEntityContainer(),
					vResult = bAsPath ? undefined : null;

				if (oEntityContainer) {
					k = findIndex(oEntityContainer.entitySet, sName);

					if (k >= 0) {
						vResult = bAsPath
							? oEntityContainer.$path + "/entitySet/" + k
							: oEntityContainer.entitySet[k];
					}
				}

				return vResult;
			};

			oStub.getODataEntityTypee = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
			};

			oStub.getODataProperty = function (oType, vName, bAsPath) {
				var i,
					aParts = jQuery.isArray(vName) ? vName : [vName],
					oProperty = null,
					sPropertyPath;

				while (oType && aParts.length) {
					i = findIndex(oType.property, aParts[0]);

					if (i < 0) {
						break;
					}

					aParts.shift();
					oProperty = oType.property[i];
					sPropertyPath = oType.$path + "/property/" + i;

					if (aParts.length) {

						// go to complex type in order to allow drill-down
						oType = this.getODataComplexType(oProperty.type);
					}
				}

				return bAsPath ? sPropertyPath : oProperty;
			};

			oStub.getODataComplexType = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
			};

			return oStub;
		};

		var oMetaData = new ODataHelper(oModel, new BindingUtil());

		//prepare the meta data.
		var oSet = oMetaData.oMeta.getODataEntitySet("Project");
		var oType = oMetaData.oMeta.getODataEntityTypee(oSet.entityType);
		var oMeta = {
			entitySet: oSet,
			entityType: oType,
			path: "Amount"
		};

		oMetaData.getProperty(oMeta);
		oMeta.property.property["Org.OData.Measures.V1.ISOCurrency"] = { "Path" : "AmountCurrency" };
		oMetaData.getProperty = function(oMetaData) {
			oMetaData.property =  {
				"property": {
					"name": "AmountCurrency",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"sap:semantics" : "currency-code",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "SchlÃ¼ssel der WÃ¤hrung, in der die BetrÃ¤ge im System gefÃ¼hrt werden.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "WÃ¤hrung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "WÃ¤hrg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "WÃ¤hrungsschlÃ¼ssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				"typePath": "AmountCurrency"
			};
		};

		var oResult = oMetaData.getUnitOfMeasure2(oMeta);

		// assert
		assert.equal(oResult.property.typePath, "AmountCurrency");
		assert.equal(!!oResult.property.property, true);
		assert.equal(oResult.property.property["sap:semantics"], "currency-code");
	});

	QUnit.test("getUnitOfMeasure: quantity", function(assert) {

		//create the mock.
		function findIndex(aArray, vExpectedPropertyValue, sPropertyName) {
			var iIndex = -1;

			sPropertyName = sPropertyName || "name";
			jQuery.each(aArray || [], function (i, oObject) {

				if (oObject[sPropertyName] === vExpectedPropertyValue) {
					iIndex = i;
					return false; // break
				}
			});

			return iIndex;
		}

		function getObject1(oModel, sArrayName, sQualifiedName, bAsPath) {
			var vResult = bAsPath ? undefined : null,
				iSeparatorPos,
				sNamespace,
				sName;

			sQualifiedName = sQualifiedName || "";
			iSeparatorPos = sQualifiedName.lastIndexOf(".");
			sNamespace = sQualifiedName.slice(0, iSeparatorPos);
			sName = sQualifiedName.slice(iSeparatorPos + 1);

			jQuery.each(oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {

				if (oSchema.namespace === sNamespace) {
					jQuery.each(oSchema[sArrayName] || [], function (j, oThing) {

						if (oThing.name === sName) {
							vResult = bAsPath ? oThing.$path : oThing;
							return false;
						}
					});

					return false;
				}
			});

			return vResult;
		}

		var oModel = sinon.createStubInstance(ODataModel);

		oModel.getMetaModel = function() {
			var oStub = sinon.createStubInstance(ODataMetaModel);
			oStub.oModel = new JSONModel(oSimpleTestModel);
			oStub.oData = oSimpleTestModel;

			oStub.getObject = function(sPath) {
				var oNode,
					aParts = sPath.split("/"),
					iIndex = 0;

				if (!aParts[0]) {
					// absolute path starting with slash
					oNode = this.oData;
					iIndex++;
				}

				while (oNode && aParts[iIndex]) {
					oNode = oNode[aParts[iIndex]];
					iIndex++;
				}

				return oNode;
			};

			oStub.getODataEntityContainer = function(bAsPath) {
				var vResult = bAsPath ? undefined : null;

				jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
					var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

					if (j >= 0) {
						vResult = bAsPath
							? "/dataServices/schema/" + i + "/entityContainer/" + j
							: oSchema.entityContainer[j];
						return false; //break
					}
				});

				return vResult;
			};

			oStub.getODataEntitySet = function(sName, bAsPath) {
				var k,
					oEntityContainer = this.getODataEntityContainer(),
					vResult = bAsPath ? undefined : null;

				if (oEntityContainer) {
					k = findIndex(oEntityContainer.entitySet, sName);

					if (k >= 0) {
						vResult = bAsPath
							? oEntityContainer.$path + "/entitySet/" + k
							: oEntityContainer.entitySet[k];
					}
				}

				return vResult;
			};

			oStub.getODataEntityType = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
			};

			oStub.getODataProperty = function (oType, vName, bAsPath) {
				var i,
					aParts = jQuery.isArray(vName) ? vName : [vName],
					oProperty = null,
					sPropertyPath;

				while (oType && aParts.length) {
					i = findIndex(oType.property, aParts[0]);

					if (i < 0) {
						break;
					}

					aParts.shift();
					oProperty = oType.property[i];
					sPropertyPath = oType.$path + "/property/" + i;

					if (aParts.length) {

						// go to complex type in order to allow drill-down
						oType = this.getODataComplexType(oProperty.type);
					}
				}

				return bAsPath ? sPropertyPath : oProperty;
			};

			oStub.getODataComplexType = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
			};

			return oStub;
		};

		var oMetaData = new ODataHelper(oModel, new BindingUtil());

		//prepare the meta data.
		var oSet = oMetaData.oMeta.getODataEntitySet("Project");
		var oType = oMetaData.oMeta.getODataEntityType(oSet.entityType);
		var oMeta = {
			entitySet: oSet,
			entityType: oType,
			path: "Quantity"
		};

		oMetaData.getProperty(oMeta);
		oMeta.property.property["Org.OData.Measures.V1.Unit"] = { "Path" : "AmountCurrency" };

		oMetaData.getProperty = function(oMetaData) {
			oMetaData.property = {
				"property": {
					"name": "AmountCurrency",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"sap:semantics": "unit-of-measure",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "SchlÃ¼ssel der WÃ¤hrung, in der die BetrÃ¤ge im System gefÃ¼hrt werden.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "WÃ¤hrung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "WÃ¤hrg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "WÃ¤hrungsschlÃ¼ssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				"typePath": "AmountCurrency"
			};
		};

		//get the unit of measure.
		var oResult = oMetaData.getUnitOfMeasure2(oMeta);
		assert.equal(oResult.property.typePath, "AmountCurrency");
		assert.equal(!!oResult.property.property, true);
		assert.equal(oResult.property.property["sap:semantics"], "unit-of-measure");
	});

	QUnit.test("getUnitOfMeasure: neither quantity nor currency-code", function(assert) {

		//create the mock.
		function findIndex(aArray, vExpectedPropertyValue, sPropertyName) {
			var iIndex = -1;

			sPropertyName = sPropertyName || "name";
			jQuery.each(aArray || [], function (i, oObject) {

				if (oObject[sPropertyName] === vExpectedPropertyValue) {
					iIndex = i;
					return false; // break
				}
			});

			return iIndex;
		}

		function getObject1(oModel, sArrayName, sQualifiedName, bAsPath) {
			var vResult = bAsPath ? undefined : null,
				iSeparatorPos,
				sNamespace,
				sName;

			sQualifiedName = sQualifiedName || "";
			iSeparatorPos = sQualifiedName.lastIndexOf(".");
			sNamespace = sQualifiedName.slice(0, iSeparatorPos);
			sName = sQualifiedName.slice(iSeparatorPos + 1);

			jQuery.each(oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {

				if (oSchema.namespace === sNamespace) {

					jQuery.each(oSchema[sArrayName] || [], function (j, oThing) {

						if (oThing.name === sName) {
							vResult = bAsPath ? oThing.$path : oThing;
							return false;
						}
					});

					return false;
				}
			});

			return vResult;
		}

		var oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			var oStub = sinon.createStubInstance(ODataMetaModel);
			oStub.oModel = new JSONModel(oSimpleTestModel);
			oStub.oData = oSimpleTestModel;

			oStub.getObject = function(sPath) {
				var oNode,
					aParts = sPath.split("/"),
					iIndex = 0;

				if (!aParts[0]) {

					// absolute path starting with slash
					oNode = this.oData;
					iIndex++;
				}

				while (oNode && aParts[iIndex]) {
					oNode = oNode[aParts[iIndex]];
					iIndex++;
				}

				return oNode;
			};

			oStub.getODataEntityContainer = function(bAsPath) {
				var vResult = bAsPath ? undefined : null;

				jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
					var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

					if (j >= 0) {
						vResult = bAsPath
							? "/dataServices/schema/" + i + "/entityContainer/" + j
							: oSchema.entityContainer[j];
						return false; //break
					}
				});

				return vResult;
			};

			oStub.getODataEntitySet = function(sName, bAsPath) {
				var k,
					oEntityContainer = this.getODataEntityContainer(),
					vResult = bAsPath ? undefined : null;

				if (oEntityContainer) {
					k = findIndex(oEntityContainer.entitySet, sName);

					if (k >= 0) {
						vResult = bAsPath
							? oEntityContainer.$path + "/entitySet/" + k
							: oEntityContainer.entitySet[k];
					}
				}

				return vResult;
			};

			oStub.getODataEntityTypee = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
			};

			oStub.getODataProperty = function (oType, vName, bAsPath) {
				var i,
					aParts = jQuery.isArray(vName) ? vName : [vName],
					oProperty = null,
					sPropertyPath;

				while (oType && aParts.length) {
					i = findIndex(oType.property, aParts[0]);

					if (i < 0) {
						break;
					}

					aParts.shift();
					oProperty = oType.property[i];
					sPropertyPath = oType.$path + "/property/" + i;

					if (aParts.length) {

						// go to complex type in order to allow drill-down
						oType = this.getODataComplexType(oProperty.type);
					}
				}

				return bAsPath ? sPropertyPath : oProperty;
			};

			oStub.getODataComplexType = function(sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
			};

			return oStub;
		};

		var oMetaData = new ODataHelper(oModel, new BindingUtil());

		//prepare the meta data.
		var oSet = oMetaData.oMeta.getODataEntitySet("Project");
		var oType = oMetaData.oMeta.getODataEntityTypee(oSet.entityType);
		var oMeta = {
			entityType: oType,
			entitySet: oSet,
			path: "Description"
		};
		oMetaData.getProperty(oMeta);

		// assert
		assert.equal(!oMetaData.getUnitOfMeasure2(oMeta), true);
	});

	QUnit.test("getUnitOfMeasure: for complex type", function(assert) {

		//create the mock.
		function findIndex(aArray, vExpectedPropertyValue, sPropertyName) {
			var iIndex = -1;

			sPropertyName = sPropertyName || "name";

			jQuery.each(aArray || [], function (i, oObject) {

				if (oObject[sPropertyName] === vExpectedPropertyValue) {
					iIndex = i;
					return false;
				}
			});

			return iIndex;
		}

		function getObject1(oModel, sArrayName, sQualifiedName, bAsPath) {
			var vResult = bAsPath ? undefined : null,
				iSeparatorPos,
				sNamespace,
				sName;

			sQualifiedName = sQualifiedName || "";
			iSeparatorPos = sQualifiedName.lastIndexOf(".");
			sNamespace = sQualifiedName.slice(0, iSeparatorPos);
			sName = sQualifiedName.slice(iSeparatorPos + 1);

			jQuery.each(oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {

				if (oSchema.namespace === sNamespace) {

					jQuery.each(oSchema[sArrayName] || [], function (j, oThing) {

						if (oThing.name === sName) {
							vResult = bAsPath ? oThing.$path : oThing;
							return false;
						}
					});

					return false;
				}
			});

			return vResult;
		}

		var oModel = sinon.createStubInstance(ODataModel);

		oModel.getMetaModel = function() {
			var oStub = sinon.createStubInstance(ODataMetaModel);
			oStub.oModel = new JSONModel(ComplexTestModelTestData);
			oStub.oData = ComplexTestModelTestData;

			oStub.getObject = function(sPath) {
				var oNode,
					aParts = sPath.split("/"),
					iIndex = 0;

				if (!aParts[0]) {
					// absolute path starting with slash
					oNode = this.oData;
					iIndex++;
				}

				while (oNode && aParts[iIndex]) {
					oNode = oNode[aParts[iIndex]];
					iIndex++;
				}

				return oNode;
			};

			oStub.getODataEntityContainer = function(bAsPath) {
				var vResult = bAsPath ? undefined : null;

				jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
					var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

					if (j >= 0) {
						vResult = bAsPath
							? "/dataServices/schema/" + i + "/entityContainer/" + j
							: oSchema.entityContainer[j];
						return false; //break
					}
				});

				return vResult;
			};

			oStub.getODataEntitySet = function(sName, bAsPath) {
				var oEntityContainer = this.getODataEntityContainer(),
					vResult = bAsPath ? undefined : null;

				if (oEntityContainer) {
					var k = findIndex(oEntityContainer.entitySet, sName);

					if (k >= 0) {
						vResult = bAsPath
							? oEntityContainer.$path + "/entitySet/" + k
							: oEntityContainer.entitySet[k];
					}
				}

				return vResult;
			};

			oStub.getODataEntityTypee = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
			};

			oStub.getODataProperty = function (oType, vName, bAsPath) {
				var aParts = jQuery.isArray(vName) ? vName : [vName],
					oProperty = null,
					sPropertyPath;

				while (oType && aParts.length) {
					var i = findIndex(oType.property, aParts[0]);

					if (i < 0) {
						break;
					}

					aParts.shift();
					oProperty = oType.property[i];
					sPropertyPath = oType.$path + "/property/" + i;

					if (aParts.length) {

						// go to complex type in order to allow drill-down
						oType = this.getODataComplexType(oProperty.type);
					}
				}

				return bAsPath ? sPropertyPath : oProperty;
			};

			oStub.getODataComplexType = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
			};

			return oStub;
		};

		var oMetaData = new ODataHelper(oModel, new BindingUtil());

		//meta data
		var oSet = oMetaData.oMeta.getODataEntitySet("FinsPostingPaymentHeaders");
		var oType = oMetaData.oMeta.getODataEntityTypee(oSet.entityType);
		var oMeta = {
			entityType: oType,
			entitySet: oSet,
			path: "Payment/AmountInCoCodeCrcy",
			navigationPath: "Payment"
		};
		oMetaData.getProperty(oMeta);

		// check for complex type: parents.
		assert.equal(oMeta.property.parents.length, 1);

		oMeta.property.property["Org.OData.Measures.V1.ISOCurrency"] = { "Path" : "CoCodeCurrency" };
		oMetaData.getProperty = function(oMetaData) {
			oMetaData.property = {
				"typePath": "AcctgDocHdrPayment/CoCodeCurrency",
				"property": {
					"name": "CoCodeCurrency",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"sap:semantics": "currency-code",
					"extensions": [{
						"name": "label",
						"value": "HauswÃ¤hrung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				"complex": true
			};
		};

		var oResult = oMetaData.getUnitOfMeasure2(oMeta);

		// assert
		assert.equal(oResult.property.typePath, "AcctgDocHdrPayment/CoCodeCurrency");
		assert.equal(!!oResult.property, true);
		assert.equal(oResult.property.property["sap:semantics"], "currency-code");
	});

	QUnit.test("getUnitOfMeasure2: for complex type", function(assert) {

		//create the mock.
		function findIndex(aArray, vExpectedPropertyValue, sPropertyName) {
			var iIndex = -1;

			sPropertyName = sPropertyName || "name";

			jQuery.each(aArray || [], function (i, oObject) {
				if (oObject[sPropertyName] === vExpectedPropertyValue) {
					iIndex = i;
					return false; // break
				}
			});

			return iIndex;
		}

		function getObject1(oModel, sArrayName, sQualifiedName, bAsPath) {
			var vResult = bAsPath ? undefined : null,
				iSeparatorPos,
				sNamespace,
				sName;

			sQualifiedName = sQualifiedName || "";
			iSeparatorPos = sQualifiedName.lastIndexOf(".");
			sNamespace = sQualifiedName.slice(0, iSeparatorPos);
			sName = sQualifiedName.slice(iSeparatorPos + 1);

			jQuery.each(oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {

				if (oSchema.namespace === sNamespace) {

					jQuery.each(oSchema[sArrayName] || [], function (j, oThing) {

						if (oThing.name === sName) {
							vResult = bAsPath ? oThing.$path : oThing;
							return false;
						}
					});

					return false;
				}
			});

			return vResult;
		}

		var oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			var oStub = sinon.createStubInstance(ODataMetaModel);
			oStub.oModel = new JSONModel(ComplexTestModelTestData);
			oStub.oData = ComplexTestModelTestData;

			oStub.getObject = function(sPath) {
				var oNode,
					aParts = sPath.split("/"),
					iIndex = 0;

				if (!aParts[0]) {

					// absolute path starting with slash
					oNode = this.oData;
					iIndex++;
				}

				while (oNode && aParts[iIndex]) {
					oNode = oNode[aParts[iIndex]];
					iIndex++;
				}

				return oNode;
			};

			oStub.getODataEntityContainer = function(bAsPath) {
				var vResult = bAsPath ? undefined : null;

				jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
					var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

					if (j >= 0) {
						vResult = bAsPath
							? "/dataServices/schema/" + i + "/entityContainer/" + j
							: oSchema.entityContainer[j];
						return false; //break
					}
				});

				return vResult;
			};

			oStub.getODataEntitySet = function(sName, bAsPath) {
				var k,
					oEntityContainer = this.getODataEntityContainer(),
					vResult = bAsPath ? undefined : null;

				if (oEntityContainer) {
					k = findIndex(oEntityContainer.entitySet, sName);

					if (k >= 0) {
						vResult = bAsPath
							? oEntityContainer.$path + "/entitySet/" + k
							: oEntityContainer.entitySet[k];
					}
				}

				return vResult;
			};

			oStub.getODataEntityTypee = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
			};

			oStub.getODataProperty = function (oType, vName, bAsPath) {
				var aParts = jQuery.isArray(vName) ? vName : [vName],
					oProperty = null,
					sPropertyPath;

				while (oType && aParts.length) {
					var i = findIndex(oType.property, aParts[0]);

					if (i < 0) {
						break;
					}

					aParts.shift();
					oProperty = oType.property[i];
					sPropertyPath = oType.$path + "/property/" + i;

					if (aParts.length) {
						// go to complex type in order to allow drill-down
						oType = this.getODataComplexType(oProperty.type);
					}
				}

				return bAsPath ? sPropertyPath : oProperty;
			};

			oStub.getODataComplexType = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
			};

			return oStub;
		};

		var oMetaData = new ODataHelper(oModel, new BindingUtil());

		//meta data
		var oSet = oMetaData.oMeta.getODataEntitySet("FinsPostingPaymentHeaders");
		var oType = oMetaData.oMeta.getODataEntityTypee(oSet.entityType);
		var oMeta = {
			entityType: oType,
			entitySet: oSet,
			path: "Payment/AmountInCoCodeCrcy"
		};
		oMetaData.getProperty(oMeta);

		// check for complex type: parents.
		assert.equal(oMeta.property.parents.length, 1);

		oMeta.property.property["Org.OData.Measures.V1.ISOCurrency"] = { "Path" : "CoCodeCurrency" };
		oMetaData.getProperty = function(oMetaData) {

			oMetaData.property = {
				"typePath": "AcctgDocHdrPayment/CoCodeCurrency",
				"property": {
					"name": "CoCodeCurrency",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"sap:semantics": "currency-code",
					"extensions": [{
						"name": "label",
						"value": "HauswÃ¤hrung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				"complex": true
			};
		};

		var oResult = oMetaData.getUnitOfMeasure2(oMeta);
		assert.equal(oResult.path, "Payment/CoCodeCurrency");
		assert.equal(oResult.property.typePath, "AcctgDocHdrPayment/CoCodeCurrency");
		assert.equal(!!oResult.property, true);
		assert.equal(oResult.property.property["sap:semantics"], "currency-code");

		oMeta.path = "DummyPath/Payment/AmountInCoCodeCrcy";
		oMeta.navigationPath = "DummyPath";
		oResult = oMetaData.getUnitOfMeasure2(oMeta);
		assert.equal(oResult.path, "DummyPath/Payment/CoCodeCurrency");
		assert.equal(oResult.property.typePath, "AcctgDocHdrPayment/CoCodeCurrency");
		assert.equal(!!oResult.property, true);
		assert.equal(oResult.property.property["sap:semantics"], "currency-code");
	});

	QUnit.test("getUOMValueListAnnotationPath: simple type", function(assert) {

		//create the mock.
		function findIndex(aArray, vExpectedPropertyValue, sPropertyName) {
			var iIndex = -1;

			sPropertyName = sPropertyName || "name";

			jQuery.each(aArray || [], function (i, oObject) {

				if (oObject[sPropertyName] === vExpectedPropertyValue) {
					iIndex = i;
					return false;
				}
			});

			return iIndex;
		}

		function getObject1(oModel, sArrayName, sQualifiedName, bAsPath) {
			var vResult = bAsPath ? undefined : null,
				iSeparatorPos,
				sNamespace,
				sName;

			sQualifiedName = sQualifiedName || "";
			iSeparatorPos = sQualifiedName.lastIndexOf(".");
			sNamespace = sQualifiedName.slice(0, iSeparatorPos);
			sName = sQualifiedName.slice(iSeparatorPos + 1);

			jQuery.each(oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {

				if (oSchema.namespace === sNamespace) {

					jQuery.each(oSchema[sArrayName] || [], function (j, oThing) {

						if (oThing.name === sName) {
							vResult = bAsPath ? oThing.$path : oThing;
							return false;
						}
					});

					return false;
				}
			});

			return vResult;
		}

		var oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			var oStub = sinon.createStubInstance(ODataMetaModel);
			oStub.oModel = new JSONModel(oSimpleTestModel);
			oStub.oData = oSimpleTestModel;

			oStub.getObject = function(sPath) {
				var oNode, aParts = sPath.split("/"), iIndex = 0;
				if (!aParts[0]) {
					// absolute path starting with slash
					oNode = this.oData;
					iIndex++;
				}
				while (oNode && aParts[iIndex]) {
					oNode = oNode[aParts[iIndex]];
					iIndex++;
				}
				return oNode;
			};

			oStub.getODataEntityContainer = function(bAsPath) {
				var vResult = bAsPath ? undefined : null;

				jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
					var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

					if (j >= 0) {
						vResult = bAsPath
							? "/dataServices/schema/" + i + "/entityContainer/" + j
							: oSchema.entityContainer[j];
						return false; //break
					}
				});

				return vResult;
			};

			oStub.getODataEntitySet = function(sName, bAsPath) {
				var k,
				oEntityContainer = this.getODataEntityContainer(),
				vResult = bAsPath ? undefined : null;

				if (oEntityContainer) {
					k = findIndex(oEntityContainer.entitySet, sName);
					if (k >= 0) {
						vResult = bAsPath
							? oEntityContainer.$path + "/entitySet/" + k
							: oEntityContainer.entitySet[k];
					}
				}

				return vResult;
			};

			oStub.getODataEntityTypee = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
			};

			oStub.getODataProperty = function (oType, vName, bAsPath) {
				var i,
				aParts = jQuery.isArray(vName) ? vName : [vName],
				oProperty = null,
				sPropertyPath;

				while (oType && aParts.length) {
					i = findIndex(oType.property, aParts[0]);
					if (i < 0) {
						break;
					}

					aParts.shift();
					oProperty = oType.property[i];
					sPropertyPath = oType.$path + "/property/" + i;

					if (aParts.length) {
						// go to complex type in order to allow drill-down
						oType = this.getODataComplexType(oProperty.type);
					}
				}

				return bAsPath ? sPropertyPath : oProperty;
			};

			oStub.getODataComplexType = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
			};

			return oStub;
		};

		var oMetaData = new ODataHelper(oModel, new BindingUtil());

		//prepare the meta data.
		var oSet = oMetaData.oMeta.getODataEntitySet("Project");
		var oType = oMetaData.oMeta.getODataEntityTypee(oSet.entityType);
		var oMeta = {
			entityType: oType,
			entitySet: oSet,
			path: "Amount"
		};
		oMetaData.getProperty(oMeta);
		oMeta.property.property["Org.OData.Measures.V1.ISOCurrency"] = { "Path" : "AmountCurrency" };
		oMetaData.getProperty = function(oMetaData) {
			oMetaData.property = {
				"property": {
					"name": "AmountCurrency",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"sap:semantics": "currency-code",
					"documentation": [{
						"text": null,
						"extensions": [{
							"name": "Summary",
							"value": "SchlÃ¼ssel der WÃ¤hrung, in der die BetrÃ¤ge im System gefÃ¼hrt werden.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						},
						{
							"name": "LongDescription",
							"value": null,
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}]
					}],
					"extensions": [{
						"name": "label",
						"value": "WÃ¤hrung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "WÃ¤hrg",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "WÃ¤hrungsschlÃ¼ssel",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				"typePath": "AmountCurrency"
			};
		};

		oMetaData.getUnitOfMeasure2(oMeta);
		var oData = {
			entityType: oType,
			entitySet: oSet,
			property: oMeta.property,
			annotations: {
				uom: {
					entityType: oType,
					entitySet: oSet,
					property: oMeta.property
				}
			}
		};

		oMetaData.getUOMValueListAnnotationPath(oData);
		assert.equal(!!oData.annotations.valuelistuom, true);
	});

	QUnit.test("getUOMValueListAnnotation: for complex type", function(assert) {

		function findIndex(aArray, vExpectedPropertyValue, sPropertyName) {
			var iIndex = -1;

			sPropertyName = sPropertyName || "name";

			jQuery.each(aArray || [], function (i, oObject) {

				if (oObject[sPropertyName] === vExpectedPropertyValue) {
					iIndex = i;
					return false;
				}
			});

			return iIndex;
		}

		function getObject1(oModel, sArrayName, sQualifiedName, bAsPath) {
			var vResult = bAsPath ? undefined : null,
				iSeparatorPos,
				sNamespace,
				sName;

			sQualifiedName = sQualifiedName || "";
			iSeparatorPos = sQualifiedName.lastIndexOf(".");
			sNamespace = sQualifiedName.slice(0, iSeparatorPos);
			sName = sQualifiedName.slice(iSeparatorPos + 1);

			jQuery.each(oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {

				if (oSchema.namespace === sNamespace) {

					jQuery.each(oSchema[sArrayName] || [], function (j, oThing) {

						if (oThing.name === sName) {
							vResult = bAsPath ? oThing.$path : oThing;
							return false;
						}
					});

					return false;
				}
			});

			return vResult;
		}

		var oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			var oStub = sinon.createStubInstance(ODataMetaModel);
			oStub.oModel = new JSONModel(ComplexTestModelTestData);
			oStub.oData = ComplexTestModelTestData;

			oStub.getObject = function(sPath) {
				var oNode, aParts = sPath.split("/"), iIndex = 0;
				if (!aParts[0]) {
					// absolute path starting with slash
					oNode = this.oData;
					iIndex++;
				}
				while (oNode && aParts[iIndex]) {
					oNode = oNode[aParts[iIndex]];
					iIndex++;
				}
				return oNode;
			};

			oStub.getODataEntityContainer = function(bAsPath) {
				var vResult = bAsPath ? undefined : null;

				jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
					var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

					if (j >= 0) {
						vResult = bAsPath
							? "/dataServices/schema/" + i + "/entityContainer/" + j
							: oSchema.entityContainer[j];
						return false; //break
					}
				});

				return vResult;
			};

			oStub.getODataEntitySet = function(sName, bAsPath) {
				var oEntityContainer = this.getODataEntityContainer(),
					vResult = bAsPath ? undefined : null;

				if (oEntityContainer) {
					var k = findIndex(oEntityContainer.entitySet, sName);

					if (k >= 0) {
						vResult = bAsPath
							? oEntityContainer.$path + "/entitySet/" + k
							: oEntityContainer.entitySet[k];
					}
				}

				return vResult;
			};

			oStub.getODataEntityTypee = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
			};

			oStub.getODataProperty = function (oType, vName, bAsPath) {
				var i,
					aParts = jQuery.isArray(vName) ? vName : [vName],
					oProperty = null,
					sPropertyPath;

				while (oType && aParts.length) {
					i = findIndex(oType.property, aParts[0]);

					if (i < 0) {
						break;
					}

					aParts.shift();
					oProperty = oType.property[i];
					sPropertyPath = oType.$path + "/property/" + i;

					if (aParts.length) {

						// go to complex type in order to allow drill-down
						oType = this.getODataComplexType(oProperty.type);
					}
				}

				return bAsPath ? sPropertyPath : oProperty;
			};

			oStub.getODataComplexType = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
			};

			return oStub;
		};

		var oMetaData = new ODataHelper(oModel, new BindingUtil());

		//meta data
		var oSet = oMetaData.oMeta.getODataEntitySet("FinsPostingPaymentHeaders");
		var oType = oMetaData.oMeta.getODataEntityTypee(oSet.entityType);
		var oMeta = {
			entityType: oType,
			entitySet: oSet,
			path: "Payment/AmountInCoCodeCrcy"
		};

		oMetaData.getProperty(oMeta);
		oMeta.property.property["Org.OData.Measures.V1.ISOCurrency"] = { "Path" : "CoCodeCurrency" };
		oMetaData.getProperty = function(oMetaData) {
			oMetaData.property = {
				"typePath": "AcctgDocHdrPayment/CoCodeCurrency",
				"property": {
					"name": "CoCodeCurrency",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "5",
					"sap:semantics": "currency-code",
					"extensions": [{
						"name": "label",
						"value": "HauswÃ¤hrung",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "creatable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}]
				},
				"complex": true,
				"parents": [{
					"namespace": "dummynamespace"
				}]
			};
		};

		var oResult = oMetaData.getUnitOfMeasure2(oMeta);
		var oData = {
			entityType: oType,
			entitySet: oSet,
			property: oMeta.property,
			annotations: {
				uom: {
					entityType: oType,
					entitySet: oSet,
					property: oResult
				}
			}
		};

		oMetaData.getUOMValueListAnnotationPath(oData);
		assert.equal(!!oData.annotations.valuelistuom, true);
	});

	QUnit.test("getTextProperty", function(assert) {

		//create the mock.
		function findIndex(aArray, vExpectedPropertyValue, sPropertyName) {
			var iIndex = -1;
			sPropertyName = sPropertyName || "name";

			jQuery.each(aArray || [], function (i, oObject) {

				if (oObject[sPropertyName] === vExpectedPropertyValue) {
					iIndex = i;
					return false;
				}
			});

			return iIndex;
		}

		function getObject1(oModel, sArrayName, sQualifiedName, bAsPath) {
			var vResult = bAsPath ? undefined : null,
				iSeparatorPos,
				sNamespace,
				sName;

			sQualifiedName = sQualifiedName || "";
			iSeparatorPos = sQualifiedName.lastIndexOf(".");
			sNamespace = sQualifiedName.slice(0, iSeparatorPos);
			sName = sQualifiedName.slice(iSeparatorPos + 1);

			jQuery.each(oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {

				if (oSchema.namespace === sNamespace) {

					jQuery.each(oSchema[sArrayName] || [], function (j, oThing) {

						if (oThing.name === sName) {
							vResult = bAsPath ? oThing.$path : oThing;
							return false;
						}
					});

					return false;
				}
			});

			return vResult;
		}

		var oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			var oStub = sinon.createStubInstance(ODataMetaModel);
			oStub.oModel = new JSONModel(oSimpleTestModel);
			oStub.oData = oSimpleTestModel;

			oStub.getObject = function(sPath) {
				var oNode,
					aParts = sPath.split("/"),
					iIndex = 0;

				if (!aParts[0]) {

					// absolute path starting with slash
					oNode = this.oData;
					iIndex++;
				}

				while (oNode && aParts[iIndex]) {
					oNode = oNode[aParts[iIndex]];
					iIndex++;
				}

				return oNode;
			};

			oStub.getODataEntityContainer = function(bAsPath) {
				var vResult = bAsPath ? undefined : null;

				jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
					var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

					if (j >= 0) {
						vResult = bAsPath
							? "/dataServices/schema/" + i + "/entityContainer/" + j
							: oSchema.entityContainer[j];

						return false;
					}
				});

				return vResult;
			};

			oStub.getODataEntitySet = function(sName, bAsPath) {
				var oEntityContainer = this.getODataEntityContainer(),
					vResult = bAsPath ? undefined : null;

				if (oEntityContainer) {
					var k = findIndex(oEntityContainer.entitySet, sName);
					if (k >= 0) {
						vResult = bAsPath
							? oEntityContainer.$path + "/entitySet/" + k
							: oEntityContainer.entitySet[k];
					}
				}

				return vResult;
			};

			oStub.getODataEntityTypee = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
			};

			oStub.getODataProperty = function (oType, vName, bAsPath) {
				var i,
					aParts = jQuery.isArray(vName) ? vName : [vName],
					oProperty = null,
					sPropertyPath;

				while (oType && aParts.length) {
					i = findIndex(oType.property, aParts[0]);

					if (i < 0) {
						break;
					}

					aParts.shift();
					oProperty = oType.property[i];
					sPropertyPath = oType.$path + "/property/" + i;

					if (aParts.length) {

						// go to complex type in order to allow drill-down
						oType = this.getODataComplexType(oProperty.type);
					}
				}

				return bAsPath ? sPropertyPath : oProperty;
			};

			oStub.getODataComplexType = function(sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
			};

			return oStub;
		};

		var oMetaData = new ODataHelper(oModel, new BindingUtil());

		//prepare the meta data.
		var oSet = oMetaData.oMeta.getODataEntitySet("Project");
		var oType = oMetaData.oMeta.getODataEntityTypee(oSet.entityType);
		var oProperty = {
			"name": "Amount",
			"type": "Edm.Decimal",
			"nullable": "false",
			"precision": "11",
			"scale": "2",
			"sap:text": "AmountCurrency",
			"documentation": [{
				"text": null,
				"extensions": [{
					"name": "Summary",
					"value": "Price for external processing.",
					"attributes": [],
					"children": [],
					"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
				},
				{
					"name": "LongDescription",
					"value": null,
					"attributes": [],
					"children": [],
					"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
				}]
			}],
			"extensions": [{
				"name": "text",
				"value": "AmountCurrency",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "label",
				"value": "Price",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:unit": "AmountCurrency",
			"sap:label": "Price",
			"sap:sortable": "false",
			"sap:filterable": "false"
		};

		QUnitHelper.liftProperty(oProperty);
		//get the unit of measure.
		var oMeta = {
			entityType: oType,
			entitySet: oSet,
			property: {
				property: oProperty
			},
			path: "Amount"
		};

		var oResult = oMetaData.getTextProperty2(oMeta);

		// assert
		assert.equal(!!oResult, true);
		assert.equal(oResult.path, "AmountCurrency");
		assert.equal(!!oResult.property.property, true);
	});

	QUnit.test("checkNavigationProperty", function(assert) {

		//create the mock.
		function findIndex(aArray, vExpectedPropertyValue, sPropertyName) {
			var iIndex = -1;
			sPropertyName = sPropertyName || "name";

			jQuery.each(aArray || [], function (i, oObject) {

				if (oObject[sPropertyName] === vExpectedPropertyValue) {
					iIndex = i;
					return false;
				}
			});

			return iIndex;
		}

		function findObject(aArray, vExpectedPropertyValue, sPropertyName) {
			var iIndex = findIndex(aArray, vExpectedPropertyValue, sPropertyName);
			return iIndex < 0 ? null : aArray[iIndex];
		}

		function getObject1(oModel, sArrayName, sQualifiedName, bAsPath) {
			var vResult = bAsPath ? undefined : null,
				iSeparatorPos,
				sNamespace,
				sName;

			sQualifiedName = sQualifiedName || "";
			iSeparatorPos = sQualifiedName.lastIndexOf(".");
			sNamespace = sQualifiedName.slice(0, iSeparatorPos);
			sName = sQualifiedName.slice(iSeparatorPos + 1);

			jQuery.each(oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {

				if (oSchema.namespace === sNamespace) {

					jQuery.each(oSchema[sArrayName] || [], function (j, oThing) {

						if (oThing.name === sName) {
							vResult = bAsPath ? oThing.$path : oThing;
							return false;
						}
					});

					return false;
				}
			});

			return vResult;
		}

		var oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			var oStub = sinon.createStubInstance(ODataMetaModel);
			oStub.oModel = new JSONModel(oSimpleTestModel);
			oStub.oData = oSimpleTestModel;

			oStub.getObject = function(sPath) {
				var oNode,
					aParts = sPath.split("/"),
					iIndex = 0;

				if (!aParts[0]) {

					// absolute path starting with slash
					oNode = this.oData;
					iIndex++;
				}

				while (oNode && aParts[iIndex]) {
					oNode = oNode[aParts[iIndex]];
					iIndex++;
				}

				return oNode;
			};

			oStub.getODataEntityContainer = function(bAsPath) {
				var vResult = bAsPath ? undefined : null;

				jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
					var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

					if (j >= 0) {
						vResult = bAsPath
							? "/dataServices/schema/" + i + "/entityContainer/" + j
							: oSchema.entityContainer[j];

						return false;
					}
				});

				return vResult;
			};

			oStub.getODataEntitySet = function(sName, bAsPath) {
				var oEntityContainer = this.getODataEntityContainer(),
					vResult = bAsPath ? undefined : null;

				if (oEntityContainer) {
					var k = findIndex(oEntityContainer.entitySet, sName);

					if (k >= 0) {
						vResult = bAsPath
							? oEntityContainer.$path + "/entitySet/" + k
							: oEntityContainer.entitySet[k];
					}
				}

				return vResult;
			};

			oStub.getODataEntityType = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
			};

			oStub.getODataProperty = function (oType, vName, bAsPath) {
				var i,
					aParts = jQuery.isArray(vName) ? vName : [vName],
					oProperty = null,
					sPropertyPath;

				while (oType && aParts.length) {
					i = findIndex(oType.property, aParts[0]);

					if (i < 0) {
						break;
					}

					aParts.shift();
					oProperty = oType.property[i];
					sPropertyPath = oType.$path + "/property/" + i;

					if (aParts.length) {

						// go to complex type in order to allow drill-down
						oType = this.getODataComplexType(oProperty.type);
					}
				}

				return bAsPath ? sPropertyPath : oProperty;
			};

			oStub.getODataComplexType = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
			};

			oStub.getODataAssociationSetEnd = function (oEntityType, sName) {
				var oAssociationSet,
					oAssociationSetEnd = null,
					oEntityContainer = this.getODataEntityContainer(),
					oNavigationProperty = oEntityType
						? findObject(oEntityType.navigationProperty, sName)
						: null;

				if (oEntityContainer && oNavigationProperty) {
					oAssociationSet = findObject(oEntityContainer.associationSet,
						oNavigationProperty.relationship, "association");
					oAssociationSetEnd = oAssociationSet
						? findObject(oAssociationSet.end, oNavigationProperty.toRole, "role")
						: null;
				}

				return oAssociationSetEnd;
			};

			return oStub;
		};

		var oMetaData = new ODataHelper(oModel, new BindingUtil());
		var oSet = oMetaData.oMeta.getODataEntitySet("Project");
		var oType = oMetaData.oMeta.getODataEntityType(oSet.entityType);
		var oData = {
			path: "Description",
			namespace: "ZMEY_SRV",
			entitySet: oSet,
			entityType: oType
		};

		var oResult = oMetaData.checkNavigationProperty();
		assert.equal(!oResult, true);

		var oParent = {
			getBindingContext : function() {
				return null;
			},
			getObjectBinding : function() {
				return { sPath : "Tasks" };
			}
		};

		oResult = oMetaData.checkNavigationProperty(oData, oParent);
		assert.equal(oData.entityType.name, "Task_Type");

		oData = {
			path: "Description",
			namespace: "ZMEY_SRV",
			entitySet: oSet,
			entityType: oType
		};
		oParent = {
			getBindingContext : function() {
				return {
					sPath : "/Project(1)/Tasks('id-1428419016778-51')"
				};
			},
			getObjectBinding : function() {
				return null;
			}
		};

		oResult = oMetaData.checkNavigationProperty(oData, oParent);
		assert.equal(oData.entityType.name, "Task_Type");

		oMetaData.destroy();
	});

	QUnit.test("checkNavigationProperty with binding info", function(assert) {

		//create the mock.
		function findIndex(aArray, vExpectedPropertyValue, sPropertyName) {
			var iIndex = -1;
			sPropertyName = sPropertyName || "name";

			jQuery.each(aArray || [], function (i, oObject) {

				if (oObject[sPropertyName] === vExpectedPropertyValue) {
					iIndex = i;
					return false; // break
				}
			});

			return iIndex;
		}

		function findObject(aArray, vExpectedPropertyValue, sPropertyName) {
			var iIndex = findIndex(aArray, vExpectedPropertyValue, sPropertyName);
			return iIndex < 0 ? null : aArray[iIndex];
		}

		function getObject1(oModel, sArrayName, sQualifiedName, bAsPath) {
			var vResult = bAsPath ? undefined : null,
				iSeparatorPos,
				sNamespace,
				sName;

			sQualifiedName = sQualifiedName || "";
			iSeparatorPos = sQualifiedName.lastIndexOf(".");
			sNamespace = sQualifiedName.slice(0, iSeparatorPos);
			sName = sQualifiedName.slice(iSeparatorPos + 1);

			jQuery.each(oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {

				if (oSchema.namespace === sNamespace) {

					jQuery.each(oSchema[sArrayName] || [], function (j, oThing) {

						if (oThing.name === sName) {
							vResult = bAsPath ? oThing.$path : oThing;
							return false;
						}
					});
					return false;
				}
			});

			return vResult;
		}

		var oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			var oStub = sinon.createStubInstance(ODataMetaModel);
			oStub.oModel = new JSONModel(oSimpleTestModel);
			oStub.oData = oSimpleTestModel;

			oStub.getObject = function(sPath) {
				var oNode,
					aParts = sPath.split("/"),
					iIndex = 0;

				if (!aParts[0]) {

					// absolute path starting with slash
					oNode = this.oData;
					iIndex++;
				}

				while (oNode && aParts[iIndex]) {
					oNode = oNode[aParts[iIndex]];
					iIndex++;
				}

				return oNode;
			};

			oStub.getODataEntityContainer = function(bAsPath) {
				var vResult = bAsPath ? undefined : null;

				jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
					var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

					if (j >= 0) {
						vResult = bAsPath
							? "/dataServices/schema/" + i + "/entityContainer/" + j
							: oSchema.entityContainer[j];
						return false; //break
					}
				});

				return vResult;
			};

			oStub.getODataEntitySet = function(sName, bAsPath) {
				var oEntityContainer = this.getODataEntityContainer(),
					vResult = bAsPath ? undefined : null;

				if (oEntityContainer) {
					var k = findIndex(oEntityContainer.entitySet, sName);

					if (k >= 0) {
						vResult = bAsPath
							? oEntityContainer.$path + "/entitySet/" + k
							: oEntityContainer.entitySet[k];
					}
				}

				return vResult;
			};

			oStub.getODataEntityType = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
			};

			oStub.getODataProperty = function (oType, vName, bAsPath) {
				var i,
					aParts = jQuery.isArray(vName) ? vName : [vName],
					oProperty = null,
					sPropertyPath;

				while (oType && aParts.length) {
					i = findIndex(oType.property, aParts[0]);

					if (i < 0) {
						break;
					}

					aParts.shift();
					oProperty = oType.property[i];
					sPropertyPath = oType.$path + "/property/" + i;

					if (aParts.length) {

						// go to complex type in order to allow drill-down
						oType = this.getODataComplexType(oProperty.type);
					}
				}

				return bAsPath ? sPropertyPath : oProperty;
			};

			oStub.getODataComplexType = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
			};

			oStub.getODataAssociationSetEnd = function (oEntityType, sName) {
				var oAssociationSet,
					oAssociationSetEnd = null,
					oEntityContainer = this.getODataEntityContainer(),
					oNavigationProperty = oEntityType
						? findObject(oEntityType.navigationProperty, sName)
						: null;

				if (oEntityContainer && oNavigationProperty) {
					oAssociationSet = findObject(oEntityContainer.associationSet,
						oNavigationProperty.relationship, "association");
					oAssociationSetEnd = oAssociationSet
						? findObject(oAssociationSet.end, oNavigationProperty.toRole, "role")
						: null;
				}

				return oAssociationSetEnd;
			};

			return oStub;
		};

		var oMetaData = new ODataHelper(oModel, new BindingUtil());
		var oSet = oMetaData.oMeta.getODataEntitySet("Project");
		var oType = oMetaData.oMeta.getODataEntityType(oSet.entityType);
		var oData = {
			path: "Description",
			namespace: "ZMEY_SRV",
			entitySet: oSet,
			entityType: oType
		};

		var oParent = {
			getBindingContext : function() {
				return null;
			},
			getObjectBinding : function() {
				return { sPath : "Tasks" };
			}
		};

		oMetaData.checkNavigationProperty(oData, oParent);
		assert.equal(!oData.navigationPath, true);
		assert.equal(oData.entityType.name, "Task_Type");

		oData = {
			path: "Description",
			namespace: "ZMEY_SRV",
			entitySet: oSet,
			entityType: oType
		};

		oParent = {
			getBindingContext : function() {
				return {
					sPath : "/Project(1)"
				};
			},
			getObjectBinding : function() {
				return { sPath : "Tasks" };
			}
		};

		oMetaData.checkNavigationProperty(oData, oParent);
		assert.equal(!oData.navigationPath, true);
		assert.equal(oData.entityType.name, "Task_Type");

		oMetaData.destroy();
	});

	QUnit.test("startWithNavigationProperty", function(assert) {

		//create the mock.
		function findIndex(aArray, vExpectedPropertyValue, sPropertyName) {
			var iIndex = -1;
			sPropertyName = sPropertyName || "name";

			jQuery.each(aArray || [], function (i, oObject) {

				if (oObject[sPropertyName] === vExpectedPropertyValue) {
					iIndex = i;
					return false;
				}
			});

			return iIndex;
		}

		function findObject(aArray, vExpectedPropertyValue, sPropertyName) {
			var iIndex = findIndex(aArray, vExpectedPropertyValue, sPropertyName);
			return iIndex < 0 ? null : aArray[iIndex];
		}

		function getObject1(oModel, sArrayName, sQualifiedName, bAsPath) {
			var vResult = bAsPath ? undefined : null,
				iSeparatorPos,
				sNamespace,
				sName;

			sQualifiedName = sQualifiedName || "";
			iSeparatorPos = sQualifiedName.lastIndexOf(".");
			sNamespace = sQualifiedName.slice(0, iSeparatorPos);
			sName = sQualifiedName.slice(iSeparatorPos + 1);

			jQuery.each(oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {

				if (oSchema.namespace === sNamespace) {

					jQuery.each(oSchema[sArrayName] || [], function (j, oThing) {

						if (oThing.name === sName) {
							vResult = bAsPath ? oThing.$path : oThing;
							return false;
						}
					});

					return false;
				}
			});

			return vResult;
		}

		var oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			var oStub = sinon.createStubInstance(ODataMetaModel);
			oStub.oModel = new JSONModel(oSimpleTestModel);
			oStub.oData = oSimpleTestModel;

			oStub.getObject = function(sPath) {
				var oNode,
					aParts = sPath.split("/"),
					iIndex = 0;

				if (!aParts[0]) {

					// absolute path starting with slash
					oNode = this.oData;
					iIndex++;
				}

				while (oNode && aParts[iIndex]) {
					oNode = oNode[aParts[iIndex]];
					iIndex++;
				}

				return oNode;
			};

			oStub.getODataEntityContainer = function(bAsPath) {
				var vResult = bAsPath ? undefined : null;

				jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
					var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

					if (j >= 0) {
						vResult = bAsPath
							? "/dataServices/schema/" + i + "/entityContainer/" + j
							: oSchema.entityContainer[j];
						return false;
					}
				});

				return vResult;
			};

			oStub.getODataEntitySet = function(sName, bAsPath) {
				var oEntityContainer = this.getODataEntityContainer(),
					vResult = bAsPath ? undefined : null;

				if (oEntityContainer) {
					var k = findIndex(oEntityContainer.entitySet, sName);

					if (k >= 0) {
						vResult = bAsPath
							? oEntityContainer.$path + "/entitySet/" + k
							: oEntityContainer.entitySet[k];
					}
				}

				return vResult;
			};

			oStub.getODataEntityType = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
			};

			oStub.getODataProperty = function (oType, vName, bAsPath) {
				var i,
					aParts = jQuery.isArray(vName) ? vName : [vName],
					oProperty = null,
					sPropertyPath;

				while (oType && aParts.length) {
					i = findIndex(oType.property, aParts[0]);

					if (i < 0) {
						break;
					}

					aParts.shift();
					oProperty = oType.property[i];
					sPropertyPath = oType.$path + "/property/" + i;

					if (aParts.length) {

						// go to complex type in order to allow drill-down
						oType = this.getODataComplexType(oProperty.type);
					}
				}

				return bAsPath ? sPropertyPath : oProperty;
			};

			oStub.getODataComplexType = function (sQualifiedName, bAsPath) {
				return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
			};

			oStub.getODataAssociationSetEnd = function (oEntityType, sName) {
				var oAssociationSet,
					oAssociationSetEnd = null,
					oEntityContainer = this.getODataEntityContainer(),
					oNavigationProperty = oEntityType
						? findObject(oEntityType.navigationProperty, sName)
						: null;

				if (oEntityContainer && oNavigationProperty) {
					oAssociationSet = findObject(oEntityContainer.associationSet,
						oNavigationProperty.relationship, "association");
					oAssociationSetEnd = oAssociationSet
						? findObject(oAssociationSet.end, oNavigationProperty.toRole, "role")
						: null;
				}

				return oAssociationSetEnd;
			};

			return oStub;
		};

		var oMetaData = new ODataHelper(oModel, new BindingUtil());
		var oSet = oMetaData.oMeta.getODataEntitySet("Project");
		var oType = oMetaData.oMeta.getODataEntityType(oSet.entityType);
		var oData = {
			path: "Description",
			namespace: "ZMEY_SRV",
			entitySet: oSet,
			entityType: oType
		};

		var oResult = oMetaData.checkNavigationProperty();
		assert.equal(!oResult, true);

		var oParent = {
			getBindingContext : function() {
				return null;
			},
			getObjectBinding : function() {
				return { sPath : "Tasks" };
			}
		};

		oResult = oMetaData.checkNavigationProperty(oData, oParent);
		assert.equal(oData.entityType.name, "Task_Type");

		oData = {
			path: "Description",
			namespace: "ZMEY_SRV",
			entitySet: oSet,
			entityType: oType
		};
		oParent = {
			getBindingContext : function() {
				return {
					sPath : "/Project(1)/Tasks('id-1428419016778-51')"
				};
			},
			getObjectBinding : function() {
				return null;
			}
		};

		assert.equal(this.oMetaData.startWithNavigationProperty("Tasks/MockPath", oData), "Tasks");
		assert.ok(!(this.oMetaData.startWithNavigationProperty("TasksNotExisting/MockPath", oData)));
		oMetaData.destroy();
	});

	QUnit.test("geValueListEntitySet", function(assert) {
		var oData = {
			annotations: {
				valuelist: {
					primaryValueListAnnotation: {
						valueListEntitySetName:"GL_ACCOUNT_BALANCE_SET"
					}
				}
			}
		};

		this.oMetaData.geValueListEntitySet(oData);
		assert.equal(oData.annotations.valuelistentityset.name, "GL_ACCOUNT_BALANCE_SET");
	});

	QUnit.test("getEdmDisplayPath", function(assert) {
		var sPath = this.oMetaData.getEdmDisplayPath({
			annotations : {
				text: {
					property: {
						name: "text"
					},
					path: "struct/text"
				}
			},
			property: {
				property: {
					name: "field"
				}
			}
		});
		assert.equal(sPath, "struct/text");

		sPath = this.oMetaData.getEdmDisplayPath({
			path: "struct/field",
			annotations : { },
			property: {
				property: {
					name: "field"
				}
			}
		});
		assert.equal(sPath, "struct/field");
	});

	QUnit.test("getAbsolutePropertyPathToValueListEntity it should return the path to a OData entity data model property specified in the " +
				"ValueList text annotation (test case 1)", function(assert) {

		// arrange
		var oSettings = {
			property: {
				"com.sap.vocabularies.Common.v1.Text": {
					Path: "LTXT"
				},
				type: "Edm.String"
			},
			entitySet: {
				name: "VL_SH_H_CATEGORY"
			},
			entityID: "PR"
		};

		// act
		var sPath = this.oMetaData.getAbsolutePropertyPathToValueListEntity(oSettings);

		// assert
		assert.strictEqual(sPath, "/VL_SH_H_CATEGORY('PR')/LTXT");
	});

	// BCP: 1980069522
	QUnit.test("getAbsolutePropertyPathToValueListEntity it should return the path to a OData entity data model property specified in the " +
				"ValueList Text annotation (test case 2)", function(assert) {

		// arrange
		var oSettings = {
			property: {
				"com.sap.vocabularies.Common.v1.Text": {
					Path: "LTXT"
				},
				type: "Edm.Guid"
			},
			entitySet: {
				name: "VL_SH_H_CATEGORY"
			},
			entityID: "PR"
		};

		// act
		var sPath = this.oMetaData.getAbsolutePropertyPathToValueListEntity(oSettings);

		// assert
		assert.strictEqual(sPath, "/VL_SH_H_CATEGORY(guid'pr')/LTXT");
	});

	QUnit.test("getAbsolutePropertyPathToValueListEntity it should return the path to a OData entity data model property specified in the "  +
				"ValueList Text annotation (test case 3)", function(assert) {

		// arrange
		var oSettings = {
			property: {
				"com.sap.vocabularies.Common.v1.Text": {
					Path: "LTXT"
				},
				type: "Edm.String"
			},
			bindingContextPath: "/VL_SH_H_CATEGORY('PR')"
		};

		// act
		var sPath = this.oMetaData.getAbsolutePropertyPathToValueListEntity(oSettings);

		// assert
		assert.strictEqual(sPath, "/VL_SH_H_CATEGORY('PR')/LTXT");
	});

	QUnit.test("getAbsolutePropertyPathToValueListEntity it should return an empty path (test case 1)", function(assert) {

		// arrange
		var oSettings = {
			property: {}
		};

		// act
		var sPath = this.oMetaData.getAbsolutePropertyPathToValueListEntity(oSettings);

		// assert
		assert.strictEqual(sPath, "");
	});

	QUnit.test("getAbsolutePropertyPathToValueListEntity it should return an empty path (test case 2)", function(assert) {

		// arrange
		var oMetadata = {
			property: {
				"com.sap.vocabularies.Common.v1.Text": {
					Path: "LTXT"
				}
			}
		};

		// act
		var sPath = this.oMetaData.getAbsolutePropertyPathToValueListEntity(oMetadata);

		// assert
		assert.strictEqual(sPath, "");
	});

	// BCP: 1980194246
	QUnit.test("getAbsolutePropertyPathToValueListEntity it should return an empty path (test case 3)", function(assert) {

		// arrange
		var oSettings = {
			property: {
				"com.sap.vocabularies.Common.v1.Text": {
					Path: "LTXT"
				},
				type: "Edm.String"
			},
			entitySet: {
				name: "VL_SH_H_CATEGORY"
			},
			entityID: ""
		};

		// act
		var sPath = this.oMetaData.getAbsolutePropertyPathToValueListEntity(oSettings);

		// assert
		assert.strictEqual(sPath, "");
	});

	// BCP: 1980279133
	QUnit.test("getAbsolutePropertyPathToValueListEntity it should return an empty path (test case 4)", function(assert) {

		// arrange
		var oSettings = {
			property: {
				"com.sap.vocabularies.Common.v1.Text": {
					Path: "LTXT"
				},
				type: "Edm.String"
			},
			entitySet: {
				name: "VL_SH_H_CATEGORY"
			},
			entityID: null
		};

		// act
		var sPath = this.oMetaData.getAbsolutePropertyPathToValueListEntity(oSettings);

		// assert
		assert.strictEqual(sPath, "");
	});

	QUnit.test("getODataValueListKeyProperty it should return the key field", function(assert) {

		// arrange
		var oValueListAnnotation = {
			"fields": [
				{
					"name": "CATC",
					"type": "Edm.String",
					"nullable": "false",
					"maxLength": "4",
					"extensions": [
						{
							"name": "display-format",
							"value": "UpperCase",
							"namespace": "http://www.sap.com/Protocols/SAPData"
						},
						{
							"name": "label",
							"value": "Category",
							"namespace": "http://www.sap.com/Protocols/SAPData"
						}
					],
					"sap:display-format": "UpperCase",
					"com.sap.vocabularies.Common.v1.IsUpperCase": {
						"Bool": "true"
					},
					"sap:label": "Category",
					"com.sap.vocabularies.Common.v1.Label": {
						"String": "Category"
					},
					"com.sap.vocabularies.Common.v1.Text": {
						"Path": "LTXT",
						"com.sap.vocabularies.UI.v1.TextArrangement": {
							"EnumMember": "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
						}
					},
					"fieldLabel": "Category",
					"displayFormat": "UpperCase",
					"isDigitSequence": false,
					"isURL": false,
					"isEmailAddress": false,
					"isPhoneNumber": false,
					"isUpperCase": true,
					"isCalendarDate": false,
					"description": "LTXT",
					"displayBehaviour": "idAndDescription",
					"isImageURL": false,
					"visible": true,
					"entityName": "VL_SH_H_CATEGORY",
					"fullName": "com.sap.GL.zrha.VL_SH_H_CATEGORY/CATC",
					"hidden": false,
					"hiddenFilter": false,
					"filterable": true,
					"requiredFilterField": false,
					"sortable": true
				},
				{
					"name": "LTXT",
					"type": "Edm.String",
					"nullable": "false",
					"extensions": [
						{
							"name": "label",
							"value": "Category Description",
							"namespace": "http://www.sap.com/Protocols/SAPData"
						}
					],
					"sap:label": "Category Description",
					"com.sap.vocabularies.Common.v1.Label": {
						"String": "Category Description"
					},
					"fieldLabel": "Category Description",
					"isDigitSequence": false,
					"isURL": false,
					"isEmailAddress": false,
					"isPhoneNumber": false,
					"isUpperCase": false,
					"isCalendarDate": false,
					"isImageURL": false,
					"visible": true,
					"entityName": "VL_SH_H_CATEGORY",
					"fullName": "com.sap.GL.zrha.VL_SH_H_CATEGORY/LTXT",
					"hidden": false,
					"hiddenFilter": false,
					"filterable": true,
					"requiredFilterField": false,
					"sortable": true
				}
			],
			"keys": [
				"CATC"
			],
			"keyField": "CATC",
			"descriptionField": "LTXT"
		};

		// act
		var oField = this.oMetaData.getODataValueListKeyProperty(oValueListAnnotation);

		// assert
		assert.strictEqual(oField.name, "CATC");
	});

	QUnit.test("getUOMPath", function(assert) {
		var sPath = this.oMetaData.getUOMPath({
			annotations : {
				uom: {
					property: {
						name: "unit"
					},
					path: "struct/unit"
				}
			},
			property: {
				typePath: "struct_type/field",
				complex: true,
				property: {
					name: "field",
					"sap:unit": "unit"
				}
			}
		});
		assert.equal(sPath, "struct/unit");

		sPath = this.oMetaData.getUOMPath({
			path: "struct/field",
			annotations : {
				uom: {
					property: {
						name: "uom"
					}
				}
			},
			property: {
				property: {
					name: "field"
				}
			}
		});
		assert.equal(sPath, null);

		sPath = this.oMetaData.getUOMPath();
		assert.equal(sPath, null);
	});

	QUnit.test("getUOMTypePath", function(assert) {
		var sPath = this.oMetaData.getUOMTypePath({
			path: "struct/field",
			annotations : {
				uom: {
					property: {
						name: "uom"
					}
				}
			},
			property: {
				typePath: "struct_type/field",
				complex: true,
				property: {
					name: "field"
				}
			}
		});
		assert.equal(sPath, "struct_type/uom");

		sPath = this.oMetaData.getUOMTypePath({
			path: "struct/field",
			annotations : {
				uom: {
					property: {
						name: "uom"
					}
				}
			},
			property: {
				property: {
					name: "field"
				}
			}
		});
		assert.equal(sPath, "uom");
	});

	QUnit.test("getSelectionChangeHandler", function(assert) {
		var bFire = false;
		var bExc = false;
		var bFired = false;
		var oControl = {
			fireChange: function() {
				bFire = true;

				if (bExc) {
					bFired = true;
					throw "Error";
				}

				return true;
			}
		};

		var oHandler = this.oMetaData.getSelectionChangeHandler(oControl, true);
		oHandler({
			"mParameters": true,
			getParameter: function() {
				return {
					getKey: function() {
						return {};
					}
				};
			}
		});
		assert.ok(bFire);
		assert.ok(!bFired);

		bExc = true;
		oHandler({
			"mParameters": true,
			getParameter: function() {
				return {
					getKey: function() {
						return {};
					}
				};
			}
		});

		assert.ok(bFired);
	});

	QUnit.test("traverseNavigationProperties", function(assert) {
		var oModel = sinon.createStubInstance(ODataMetaModel);

		oModel.getODataEntityType = function(sType) {

			if (sType === "ZMEY_SRV.Project_Type") {
				return oTestEntityType;
			}

			return {};
		};

		oModel.getODataEntitySet = function() {
			return oTestEntitySet;
		};

		oModel.getODataAssociationSetEnd = function() {
			return {"entitySet":"ProjectFC","role":"ToRole_ProjectProperties"};
		};

		var oMetaData = new ODataHelper(null, null, oModel);
		var oResult = oMetaData.traverseNavigationProperties("Properties/EntityUpdatable", oTestEntityType);
		assert.equal(oResult.navigationPath, "Properties");
		assert.ok(oResult.entitySet);
		assert.ok(oResult.entityType);

		oMetaData.destroy();
	});

	QUnit.test("getProperty with navigation property in value property", function(assert) {
		var oModel = sinon.createStubInstance(ODataMetaModel);

		oModel.getODataEntityType = function(sType) {

			if (sType === "ZMEY_SRV.Project_Type") {
				return oTestEntityType;
			}

			return {};
		};

		oModel.getODataEntitySet = function() {
			return oTestEntitySet;
		};

		oModel.getODataProperty = function() {
			return {
				name: "ID"
			};
		};

		oModel.getODataAssociationSetEnd = function() {
			return {
				"entitySet": "ProjectFC",
				"role": "ToRole_ProjectProperties"
			};
		};

		var oMeta = {
			entitySet: oTestEntitySet,
			entityType: oTestEntityType,
			path: "Properties/ID"
		};

		var oMetaData = new ODataHelper(null, null, oModel);
		oMetaData.getProperty(oMeta);
		assert.equal(oMeta.navigationPath, "Properties");
		assert.ok(oMeta.entitySet);
		assert.ok(oMeta.entityType);
		assert.ok(oMeta.property.property);
		oMetaData.destroy();
	});

	QUnit.test("_postprocAnnotation with navigationPath", function(assert) {
		var oMeta = {
			navigationPath: "navProp2",
			path: "dummyPath"
		};

		var oMetaIn = {
			navigationPath: "navProp1"
		};

		this.oMetaData._postprocAnnotation(oMeta, oMetaIn);

		// assert
		assert.equal(oMeta.navigationPath, "navProp1/navProp2");
		assert.equal(oMeta.path, "navProp1/navProp2/dummyPath");
	});

	QUnit.test("Shall be destructible", function(assert) {
		this.oMetaData.destroy();
		assert.ok(this.oMetaData);
	});

	QUnit.module("Navigation property and value list required metadata", {
		beforeEach: function() {
			this.oProductCategorySchema = TestModelTestData.GlobalProductCategorySchema;
			this.oProductEntityType = TestModelTestData.GlobalProductEntityType;
			this.oGlobalValueListAnnotation = TestModelTestData.GlobalValueListAnnotation;
		},
		afterEach: function() {
			this.oProductCategorySchema = null;
			this.oProductEntityType = null;
			this.oGlobalValueListAnnotation = null;
		}
	});

	QUnit.test("it should return false when the Text annotation is NOT specified", function(assert) {

		// arrange
		var oTextAnnotation; // not specified
		var oMetadata = {
			propertyName: "CategoryID",
			textAnnotation: oTextAnnotation,
			entityType: this.oProductEntityType
		};
		var ERROR_MESSAGE = 'Missing "com.sap.vocabularies.Common.v1.Text" annotation for "CategoryID" EDM property of ' +
							'"com.sap.GL.zrha.Product" entity type.';
		var oLogInfoSpy = this.spy(Log, "info");

		// act
		var bMetadataOK = ODataHelper.prototype.checkNavigationPropertyRequiredMetadata(oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oLogInfoSpy.calledOnceWith(ERROR_MESSAGE));
	});

	QUnit.test("it should return false when the Text annotation path attribute is NOT specified", function(assert) {

		// arrange
		var oTextAnnotation = {}; // Text annotation specified but the path attribute is missing
		var oMetadata = {
			propertyName: "CategoryID",
			textAnnotation: oTextAnnotation,
			entityType: this.oProductEntityType
		};
		var ERROR_MESSAGE = 'Missing "Path" attribute of "com.sap.vocabularies.Common.v1.Text" annotation for "CategoryID" ' +
							'EDM property of "com.sap.GL.zrha.Product" entity type. - sap.ui.comp.smartfield.ODataHelper';
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = ODataHelper.prototype.checkNavigationPropertyRequiredMetadata(oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});

	QUnit.test("it should return false when the Text annotation URL path name is NOT specified", function(assert) {

		// arrange
		var oTextAnnotation = {
			"Path": "", // path is empty
			"com.sap.vocabularies.UI.v1.TextArrangement": {
				"EnumMember": "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
			}
		};
		var oMetadata = {
			propertyName: "CategoryID",
			textAnnotation: oTextAnnotation,
			entityType: this.oProductEntityType
		};
		var ERROR_MESSAGE = 'Missing URL path name of "com.sap.vocabularies.Common.v1.Text" annotation for "CategoryID" EDM ' +
							'property of "com.sap.GL.zrha.Product" entity type. - sap.ui.comp.smartfield.ODataHelper';
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = ODataHelper.prototype.checkNavigationPropertyRequiredMetadata(oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});

	QUnit.test("it should return false when the TextArrangement annotation is NOT specified", function(assert) {

		// arrange
		var oTextAnnotation = {
			"Path": "to_ProductCategories/Description"
			// missing TextArrangement Annotation
		};
		var oMetadata = {
			propertyName: "CategoryID",
			textAnnotation: oTextAnnotation,
			entityType: this.oProductEntityType
		};
		var ERROR_MESSAGE = 'Missing "com.sap.vocabularies.UI.v1.TextArrangement" annotation for "CategoryID" EDM property ' +
							'of "com.sap.GL.zrha.Product" entity type.';
		var oLogInfoSpy = this.spy(Log, "info");

		// act
		var bMetadataOK = ODataHelper.prototype.checkNavigationPropertyRequiredMetadata(oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oLogInfoSpy.calledOnceWith(ERROR_MESSAGE));
	});

	QUnit.test('it should return false when the TextArrangement annotation enum member is ' +
				'"com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate"', function(assert) {

		// arrange
		var oTextAnnotation = {
			"Path": "to_ProductCategories/Description",
			"com.sap.vocabularies.UI.v1.TextArrangement": {
				"EnumMember": "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate" // ID only
			}
		};
		var oMetadata = {
			propertyName: "CategoryID",
			textAnnotation: oTextAnnotation,
			entityType: this.oProductEntityType
		};

		// act
		var bMetadataOK = ODataHelper.prototype.checkNavigationPropertyRequiredMetadata(oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
	});

	QUnit.test('it should return false when the navigation property URL path name specified in the "Path" attribute of ' +
				'the Text annotation where the text is fetched does NOT contain a "/"', function(assert) {

		// arrange
		var oTextAnnotation = {
			"Path": "Description", // not a path to a Navigation Property
			"com.sap.vocabularies.UI.v1.TextArrangement": {
				"EnumMember": "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
			}
		};
		var oMetadata = {
			propertyName: "CategoryID",
			textAnnotation: oTextAnnotation,
			entityType: this.oProductEntityType
		};
		var ERROR_MESSAGE = 'Invalid navigation property URL path name specified in the ' +
							'"com.sap.vocabularies.Common.v1.Text" annotation of the "CategoryID" EDM property of the ' +
							'"com.sap.GL.zrha.Product" entity type. - sap.ui.comp.smartfield.ODataHelper';
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = ODataHelper.prototype.checkNavigationPropertyRequiredMetadata(oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});

	QUnit.test('it should return false when the navigation property URL path name specified in the Text annotation ' +
		'was not found in the entity type', function(assert) {

		// arrange
		var oTextAnnotation = {
			"Path": "to_LoremIpsum/Description", // nonexistent Navigation Property path
			"com.sap.vocabularies.UI.v1.TextArrangement": {
				"EnumMember": "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
			}
		};
		var ERROR_MESSAGE = 'The navigation property URL path name "to_LoremIpsum" (specified in the Text annotation of the ' +
							'"CategoryID" EDM property) was not found in the "com.sap.GL.zrha.Product" entity type of the service ' +
							'metadata document. - sap.ui.comp.smartfield.ODataHelper';
		var oMetadata = {
			propertyName: "CategoryID",
			textAnnotation: oTextAnnotation,
			entityType: this.oProductEntityType
		};
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = ODataHelper.prototype.checkNavigationPropertyRequiredMetadata(oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});

	QUnit.test('it should return false when the "EnumMember" attribute of the TextArrangement annotation is NOT specified', function(assert) {

		// arrange
		var oTextAnnotation = {
			"Path": "to_ProductCategories/Description",
			"com.sap.vocabularies.UI.v1.TextArrangement": {
				// missing "EnumMember" attribute
			}
		};
		var ERROR_MESSAGE = 'Missing "EnumMember" attribute of "com.sap.vocabularies.UI.v1.TextArrangement" annotation for ' +
							'"CategoryID" EDM property of "com.sap.GL.zrha.Product" entity type. - sap.ui.comp.smartfield.ODataHelper';
		var oMetadata = {
			propertyName: "CategoryID",
			textAnnotation: oTextAnnotation,
			entityType: this.oProductEntityType
		};
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = ODataHelper.prototype.checkNavigationPropertyRequiredMetadata(oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});

	QUnit.test('it should return false when the "EnumMember" attribute of the TextArrangement annotation is invalid', function(assert) {

		// arrange
		var oTextAnnotation = {
			"Path": "to_ProductCategories/Description",
			"com.sap.vocabularies.UI.v1.TextArrangement": {
				"EnumMember": "com.sap.vocabularies.UI.v1.TextArrangementType/LoremIpsum" // invalid enum member
			}
		};
		var ERROR_MESSAGE = 'Invalid "com.sap.vocabularies.UI.v1.TextArrangementType/LoremIpsum" Text annotation enumeration ' +
							'member for "CategoryID" EDM property of "com.sap.GL.zrha.Product" entity type. - sap.ui.comp.smartfield.ODataHelper';
		var oMetadata = {
			propertyName: "CategoryID",
			textAnnotation: oTextAnnotation,
			entityType: this.oProductEntityType
		};
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = ODataHelper.prototype.checkNavigationPropertyRequiredMetadata(oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});

	QUnit.test("it should return false when the ValueList annotation is NOT specified", function(assert) {

		// arrange
		var oMetadata = {
			propertyName: "CategoryID",
			entityType: this.oProductEntityType,
			valueListAnnotation: null
		};
		var ERROR_MESSAGE = 'Missing "ValueList" annotation for "CategoryID" EDM property of "com.sap.GL.zrha.Product" ' +
		                    'entity type. - sap.ui.comp.smartfield.ODataHelper';
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = ODataHelper.prototype.checkValueListRequiredMetadataForTextArrangment(oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});

	QUnit.test("it should return false when the ValueList annotation does NOT contains fields", function(assert) {

		// arrange
		var oValueListAnnotation = merge({}, this.oGlobalValueListAnnotation);
		delete oValueListAnnotation.fields; // simulate missing fields for testing
		var oMetadata = {
			propertyName: "CategoryID",
			entityType: this.oProductEntityType,
			valueListAnnotation: oValueListAnnotation
		};
		var ERROR_MESSAGE = 'Missing fields for "SFOData.PickListValueUI_parentPickListValue_VH" entity. - sap.ui.comp.smartfield.ODataHelper';
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = ODataHelper.prototype.checkValueListRequiredMetadataForTextArrangment(oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});

	QUnit.test("it should return false when the description field is NOT found", function(assert) {

		// arrange
		var oValueListAnnotation = merge({}, this.oGlobalValueListAnnotation);
		oValueListAnnotation.fields.splice(0, 1); // remove the "VH_displayName" description field for testing
		var oMetadata = {
			propertyName: "CategoryID",
			entityType: this.oProductEntityType,
			valueListAnnotation: oValueListAnnotation
		};
		var ERROR_MESSAGE = 'The "VH_displayName" description field was not found in the service metadata document. - sap.ui.comp.smartfield.ODataHelper';
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = ODataHelper.prototype.checkValueListRequiredMetadataForTextArrangment(oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});

	QUnit.test("it should return false when the description field is not filterable", function(assert) {

		// arrange
		var oValueListAnnotation = merge({}, this.oGlobalValueListAnnotation);
		// oValueListAnnotation.fields[0]["sap:filterable"] = "false"; // default
		var oMetadata = {
			propertyName: "CategoryID",
			entityType: this.oProductEntityType,
			valueListAnnotation: oValueListAnnotation
		};

		// act
		var bMetadataOK = ODataHelper.prototype.checkValueListRequiredMetadataForTextArrangment(oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
	});

	QUnit.test("it should return true when the required metadata for the ValueList is provided", function(assert) {

		// arrange
		var oValueListAnnotation = merge({}, this.oGlobalValueListAnnotation);
		oValueListAnnotation.fields[0]["sap:filterable"] = "true";
		var oMetadata = {
			propertyName: "CategoryID",
			entityType: this.oProductEntityType,
			valueListAnnotation: oValueListAnnotation
		};

		// act
		var bMetadataOK = ODataHelper.prototype.checkValueListRequiredMetadataForTextArrangment(oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, true);
	});


	QUnit.module("Navigation Property required metadata (part 2)", {
		beforeEach: function() {
			this.oProductEntityType = TestModelTestData.GlobalProductEntityType;
			var oODataModel = sinon.createStubInstance(ODataModel);
			var oBindingUtil = new BindingUtil();
			this.oMetaModel = sinon.createStubInstance(ODataMetaModel);
			this.oMetaModel.oModel = new JSONModel();

			var oTextAnnotation = {
				"Path": "to_ProductCategories/Description",
				"com.sap.vocabularies.UI.v1.TextArrangement": {
					"EnumMember": "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
				}
			};

			this.oMetadata = {
				propertyName: "CategoryID",
				textAnnotation: oTextAnnotation,
				entityType: this.oProductEntityType
			};

			// system under test
			this.oODataHelper = new ODataHelper(oODataModel, oBindingUtil, this.oMetaModel);
		},
		afterEach: function() {
			this.oProductEntityType = null;
			this.oMetaModel.oModel.destroy();
			this.oMetaModel = null;
			this.oMetadata = null;
			this.oODataHelper.destroy();
			this.oODataHelper = null;
		}
	});

	QUnit.test('it should return false when the association for the navigation property "to_ProductCategories" is not ' +
		'found', function(assert) {

		// arrange
		this.stub(this.oMetaModel.oModel, "getObject").withArgs("/dataServices/schema").callsFake(function(sPath, oContext, mParameters) {
			var oSchema = merge({}, TestModelTestData.GlobalProductCategorySchema);
			delete oSchema.association; // simulate missing associations
			return [oSchema];
		});
		var ERROR_MESSAGE = 'Missing "com.sap.GL.zrha.ProductCategory" association for "to_ProductCategories" EDM ' +
							'navigation property of the "com.sap.GL.zrha.Product" entity type. - sap.ui.comp.smartfield.ODataHelper';
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = this.oODataHelper.checkNavigationPropertyRequiredMetadata(this.oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});

	QUnit.test("it should return false when the referential integrity is NOT enforced", function(assert) {

		// arrange
		this.stub(this.oMetaModel.oModel, "getObject").withArgs("/dataServices/schema").callsFake(function(sPath, oContext, mParameters) {
			var oSchema = merge({}, TestModelTestData.GlobalProductCategorySchema);
			delete oSchema.association[0].referentialConstraint; // simulate missing referential constraint
			return [oSchema];
		});
		var ERROR_MESSAGE = 'Missing referential constraint for "com.sap.GL.zrha.ProductCategory" association in the ' +
							'service metadata document. - sap.ui.comp.smartfield.ODataHelper';
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = this.oODataHelper.checkNavigationPropertyRequiredMetadata(this.oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});

	QUnit.test("it should return false when the association end are missing", function(assert) {

		// arrange
		this.stub(this.oMetaModel.oModel, "getObject").withArgs("/dataServices/schema").callsFake(function(sPath, oContext, mParameters) {
			var oSchema = merge({}, TestModelTestData.GlobalProductCategorySchema);
			delete oSchema.association[0].end; // simulate missing association end
			return [oSchema];
		});
		var ERROR_MESSAGE = 'Missing association end for "com.sap.GL.zrha.ProductCategory" association in the service ' +
							'metadata document. - sap.ui.comp.smartfield.ODataHelper';
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = this.oODataHelper.checkNavigationPropertyRequiredMetadata(this.oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});

	QUnit.test("it should return false when the association end are missing", function(assert) {

		// arrange
		this.stub(this.oMetaModel.oModel, "getObject").withArgs("/dataServices/schema").callsFake(function(sPath, oContext, mParameters) {
			var oSchema = merge({}, TestModelTestData.GlobalProductCategorySchema);
			oSchema.association[0].end = []; // simulate missing association end
			return [oSchema];
		});
		var ERROR_MESSAGE = 'Missing association end for "com.sap.GL.zrha.ProductCategory" association in the service ' +
							'metadata document. - sap.ui.comp.smartfield.ODataHelper';
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = this.oODataHelper.checkNavigationPropertyRequiredMetadata(this.oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});

	QUnit.test('it should return false when the "toRole" association end multiplicity is NOT 1', function(assert) {

		// arrange
		this.stub(this.oMetaModel.oModel, "getObject").withArgs("/dataServices/schema").callsFake(function(sPath, oContext, mParameters) {
			var oSchema = merge({}, TestModelTestData.GlobalProductCategorySchema);
			oSchema.association[0].end[1].multiplicity = "*"; // simulate multiplicity
			return [oSchema];
		});
		var ERROR_MESSAGE = 'Expected multiplicity of 1 for "ToRole_ProductCategory" association end of the ' +
							'"com.sap.GL.zrha.ProductCategory" association in the service metadata document. ' +
							'- sap.ui.comp.smartfield.ODataHelper';
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = this.oODataHelper.checkNavigationPropertyRequiredMetadata(this.oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});

	QUnit.test('it should return false when more/less than 1 foreign keys EDM property are specified as referential ' +
	           'constraints (test case 1)', function(assert) {

		// arrange
		this.stub(this.oMetaModel.oModel, "getObject").withArgs("/dataServices/schema").callsFake(function(sPath, oContext, mParameters) {
			var oSchema = merge({}, TestModelTestData.GlobalProductCategorySchema);
			oSchema.association[0].referentialConstraint.principal.propertyRef.push({
				name: "SalesOrderID"
			});
			return [oSchema];
		});
		var ERROR_MESSAGE = 'Expected the single "CategoryID" foreign key EDM property as referential constraint ' +
							'in the "com.sap.GL.zrha.ProductCategory" association. - sap.ui.comp.smartfield.ODataHelper';
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = this.oODataHelper.checkNavigationPropertyRequiredMetadata(this.oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});

	QUnit.test('it should return false when more/less than 1 foreign keys EDM property are specified as referential ' +
	           'constraints (test case 2)', function(assert) {

		// arrange
		this.stub(this.oMetaModel.oModel, "getObject").withArgs("/dataServices/schema").callsFake(function(sPath, oContext, mParameters) {
			var oSchema = merge({}, TestModelTestData.GlobalProductCategorySchema);

			// add an extra foreign key as referential to change the control flow of the
			// .checkNavigationPropertyRequiredMetadata() method
			oSchema.association[0].referentialConstraint.dependent.propertyRef.push({
				name: "SalesOrderID"
			});
			return [oSchema];
		});
		var ERROR_MESSAGE = 'Expected the single "CategoryID" foreign key EDM property as referential constraint ' +
							'in the "com.sap.GL.zrha.ProductCategory" association. - sap.ui.comp.smartfield.ODataHelper';
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = this.oODataHelper.checkNavigationPropertyRequiredMetadata(this.oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});

	QUnit.test("the lookup entity type should contain a single key property", function(assert) {

		// arrange
		this.stub(this.oMetaModel.oModel, "getObject").withArgs("/dataServices/schema").callsFake(function(sPath, oContext, mParameters) {
			var oSchema = merge({}, TestModelTestData.GlobalProductCategorySchema);
			return [oSchema];
		});
		this.stub(this.oODataHelper, "getNavigationProperty").callsFake(function(oEntityType, sNavigationPropertyName) {
			var oCategoryEntityType = merge({}, TestModelTestData.GlobalCategoryEntityType);

			// add an extra ID to the lookup entity type to change the control flow of the
			// .checkNavigationPropertyRequiredMetadata() method return false
			oCategoryEntityType.key.propertyRef.push({
				name: "ID2"
			});

			return {
				entitySet: {}, // not required for this test
				entityType: oCategoryEntityType
			};
		});
		var ERROR_MESSAGE = 'Expected a single key property in the lookup "com.sap.GL.zrha.Category" ' +
							'entity type. - sap.ui.comp.smartfield.ODataHelper';
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = this.oODataHelper.checkNavigationPropertyRequiredMetadata(this.oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});

	QUnit.test("the dependent property name in the referential constraint should match with the single key property " +
	           "name of the lookup entity type", function(assert) {

		// arrange
		this.stub(this.oMetaModel.oModel, "getObject").withArgs("/dataServices/schema").callsFake(function(sPath, oContext, mParameters) {
			var oSchema = merge({}, TestModelTestData.GlobalProductCategorySchema);

			// change the ID to make .checkNavigationPropertyRequiredMetadata() return false
			oSchema.association[0].referentialConstraint.principal.propertyRef[0].name = "ID2";
			return [oSchema];
		});
		this.stub(this.oODataHelper, "getNavigationProperty").returns({
			entitySet: {}, // not required for this test
			entityType: TestModelTestData.GlobalCategoryEntityType
		});

		var ERROR_MESSAGE = 'Expected a property named "ID2" to be the single key property in the lookup ' +
							'"com.sap.GL.zrha.Category" entity type. - sap.ui.comp.smartfield.ODataHelper';
		var oConsoleAssertSpy = this.spy(console, "assert");

		// act
		var bMetadataOK = this.oODataHelper.checkNavigationPropertyRequiredMetadata(this.oMetadata);

		// assert
		assert.strictEqual(bMetadataOK, false);
		assert.ok(oConsoleAssertSpy.calledOnceWith(false, ERROR_MESSAGE));
	});
});
