sap.ui.require(['jquery.sap.global', 'sap/rules/ui/ast/builder/TermsBuilder',
		'sap/rules/ui/ast/provider/TermsProvider'
	],
	function (jQuery, termsBuilder, termsProvider) {
		'use strict';
		var vocabularyData = (function getVocabularyData() {
			return jQuery.sap.sjax({
				url: '../../data/ast/vocabularyData.json',
				dataType: "json"
			}).data;
		})();
		
		var multipleAssociationsVocabData = (function getMultipleAssociationsVocabularyData() {
			return jQuery.sap.sjax({
				url: '../../data/ast/multipleAssociations.json',
				dataType: "json"
			}).data;
		})();

		QUnit.test("terms when vocab id is passed", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			var termsFromVocabId = termsProvider.getInstance().getTermsById("c9c600c73d1745fd9ae5b445d0054364");
			var expectedTermsFromVocabId = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromVocabId.json',
					dataType: "json"
				}).data;
			})();

			assert.propEqual(termsFromVocabId, expectedTermsFromVocabId, "Terms Util");
		});

		//passing a dataobject id & get all it's associations/attributes that are 1 level below
		QUnit.test("terms when dataobject id is passed", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			var termsFromDoId = termsProvider.getInstance().getTermsById("40ff80b379e64fc1a6e2cc2357f2b9e9");
			var expectedTermsFromDoId = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromDoId.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(termsFromDoId, expectedTermsFromDoId, "Terms Util");
		});

		//passing a dataobject name & get all it's associations/attributes that are 1 level below
		QUnit.test("getting term by term name: BOOKING_WITH_CONNECTION_CARRIER", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			var termsByName = termsProvider.getInstance().getTermsByName("BOOKING_WITH_CONNECTION_CARRIER");
			var expectedTermsFromDoName = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromDoName.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(termsByName, expectedTermsFromDoName, "Terms Util");
		});

		//passing a dataobject name & get all it's associations/attributes that are 1 level below
		QUnit.test("getting term by term name: CUSTOMER", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			var termsByName = termsProvider.getInstance().getTermsByName("CUSTOMER");
			var expectedTermsFromDoName = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromDoName1.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(termsByName, expectedTermsFromDoName, "Terms Util");
		});

		QUnit.test("getting all terms", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			var allTerms = termsProvider.getInstance().getAllTerms();
			var expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/allTerms.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(allTerms, expectedTerms, "Terms Util");
		});

		QUnit.test("getting term by term id", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			var termByTermId = termsProvider.getInstance().getTermByTermId(
				"e20f244be8414addb4bcf94ca5aeb7f6.0bfbf02ed0e94082a75f8d49e9d31a7f.0260cede0922498e86f9ed0f518c4e38");
			var expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termByTermId.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(termByTermId, expectedTerms, "Terms Util");
		});

		//passing dataObjectName.AttributeName
		QUnit.test("getting term by dataObjectName.AttributeName", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			var term = termsProvider.getInstance().getTermByTermName("BOOKING.CARRID");
			var expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromTermName.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(term, expectedTerms, "Terms Util");
		});
		
		//passing business datatype
		QUnit.test("getting terms by business datatype", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			var term = termsProvider.getInstance().getTermsByBusinessDataType("S");
			var expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromBusinessDatatype.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(term, expectedTerms, "Terms Util");
		});
		
		//passing prefix id & business datatype
		QUnit.test("getting terms by prefix id & business datatype", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			var term = termsProvider.getInstance().getTermsByPrefixIdAndBusinessDataType("9e1095dfbb4f4b919f5f24cc459a9687", "S");
			var expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromPrefixIdAndBusinessDatatype.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(term, expectedTerms, "Passed dataobject id & string business type");
			
			//passing date
			term = termsProvider.getInstance().getTermsByPrefixIdAndBusinessDataType("9e1095dfbb4f4b919f5f24cc459a9687", "D");
			expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromPrefixIdAndBusinessDatatype1.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(term, expectedTerms, "Passed dataobject id & date business type");
			
			//passing association
			term = termsProvider.getInstance().getTermsByPrefixIdAndBusinessDataType("e20f244be8414addb4bcf94ca5aeb7f6.0bfbf02ed0e94082a75f8d49e9d31a7f", "D");
			expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromPrefixIdAndBusinessDatatype2.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(term, expectedTerms, "Passed association id & string business type");
		});
		
		//passing prefix name & business datatype
		QUnit.test("getting terms by prefix name & business datatype", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			var term = termsProvider.getInstance().getTermsByPrefixNameAndBusinessDataType("BOOKING", "S");
			var expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromPrefixIdAndBusinessDatatype.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(term, expectedTerms, "Passed dataobject name & string business type");
			
			//passing date
			term = termsProvider.getInstance().getTermsByPrefixNameAndBusinessDataType("BOOKING", "D");
			expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromPrefixIdAndBusinessDatatype1.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(term, expectedTerms, "Passed dataobject name & date business type");
			
			//passing association
			term = termsProvider.getInstance().getTermsByPrefixNameAndBusinessDataType("CUSTOMER_TABLE.HISTORICAL_BOOKING", "D");
			expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromPrefixIdAndBusinessDatatype2.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(term, expectedTerms, "Passed association name & string business type");
		});
		
		//passing dataobject type
		QUnit.test("getting terms by dataobject type", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			var term = termsProvider.getInstance().getTermsByDataObjectType("T");
			var expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromTableDOType.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(term, expectedTerms, "Table type dataobjects");
			
			term = termsProvider.getInstance().getTermsByDataObjectType("S");
			expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromStructureDOType.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(term, expectedTerms, "Structure type dataobjects");
		});
		
		//passing dataobject type(will be either E or AO), prefix
		QUnit.test("getting terms by dataobject type (E/AO) & prefix", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			var term = termsProvider.getInstance().getTermsByDataObjectTypeAndPrefixId("40ff80b379e64fc1a6e2cc2357f2b9e9", "E");
			var expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromDOTypeAndPrefix.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(term, expectedTerms, "Getting all attributes for Customer prefix id");
			
			term = termsProvider.getInstance().getTermsByDataObjectTypeAndPrefixName("CUSTOMER", "E");
			expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromDOTypeAndPrefix.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(term, expectedTerms, "Getting all attributes for Customer prefix name");
		});
		
		//passing dataobject type & business datatype
		QUnit.test("getting terms by dataobject type & business datatype", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			var term = termsProvider.getInstance().getTermsByBusinessAndDOType("S", "S");
			var expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromDOBusinessDatatype.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(term, expectedTerms, "terms with Structure do type & string business type");
		});
		
		QUnit.test("getting terms by prefix id, dataobject type & business datatype", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			var term = termsProvider.getInstance().getTermsByPrefixIdBusinessAndDOType("40ff80b379e64fc1a6e2cc2357f2b9e9", ["E"], "S");
			var expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromPrefixDOBusinessDatatype.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(term, expectedTerms, "Terms with prefix id, at do type & string business type");
			
			term = termsProvider.getInstance().getTermsByPrefixNameBusinessAndDOType("CUSTOMER", ["E"], "S");
			var expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromPrefixDOBusinessDatatype.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(term, expectedTerms, "Terms with prefix id, at do type & string business type");
		});
		
		QUnit.test("getting do terms that have at least 1 attr of type business datatype", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			var term = termsProvider.getInstance().getDOTermsByBusinessDataType("S");
			var expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/doTermsFromStringBusinessDatatype.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(term, expectedTerms, "Terms with prefix id, at do type & string business type");
			
			term = termsProvider.getInstance().getDOTermsByBusinessDataType("B");
			expectedTerms = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/doTermsFromBooleanBusinessDatatype.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(term, expectedTerms, "Terms with prefix id, at do type & boolean business type");
		});
		
		//testing the label map
		//retrieving a dataobject that has label
		QUnit.test("terms from label map", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			var termsFromLabel = termsProvider.getInstance().getTermByTermLabel("Discount Table Hdi");
			var expectedTermsFromLabel = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromTermLabel.json',
					dataType: "json"
				}).data;
			})();

			assert.propEqual(termsFromLabel, expectedTermsFromLabel, "Terms Util");
		});
		
		//retrieving a dataobject that doesn't have label (--> in label map itself the key will be name)
		QUnit.test("term having no label", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			var termsFromLabel = termsProvider.getInstance().getTermByTermLabel("DISCOUNT"); //"DISCOUNT" is the dataobject name
			var expectedTermsFromLabel = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termWithNoLabel.json',
					dataType: "json"
				}).data;
			})();

			assert.propEqual(termsFromLabel, expectedTermsFromLabel, "Terms Util");
		});
		
		//test cases for attribute
		QUnit.test("terms from label map for attribute", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			
			//for below attr doLabel is defined
			var termsFromLabel = termsProvider.getInstance().getTermByTermLabel("Booking.Fldate");
			var expectedTermsFromLabel = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromAttrTermLabel.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(termsFromLabel, expectedTermsFromLabel, "Terms Util");
			
			//for below attr doLabel is the Name
			termsFromLabel = termsProvider.getInstance().getTermByTermLabel("DISCOUNT.Discount Value");
			expectedTermsFromLabel = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromAttrTermLabel2.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(termsFromLabel, expectedTermsFromLabel, "Terms Util");
			
			//for below attr name is the label
			termsFromLabel = termsProvider.getInstance().getTermByTermLabel("Booking.CARRID");
			expectedTermsFromLabel = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromAttrTermLabel3.json',
					dataType: "json"
				}).data;
			})();

			assert.propEqual(termsFromLabel, expectedTermsFromLabel, "Terms Util");
		});
		
		//test cases for association
		QUnit.test("terms from label map for association", function (assert) {
			termsBuilder.getInstance().construct(vocabularyData);
			
			//for below assoc Label is undefined
			var termsFromLabel = termsProvider.getInstance().getTermByTermLabel("Customer Table.HISTORICAL_BOOKING");
			var expectedTermsFromLabel = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromAssocTermLabel.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(termsFromLabel, expectedTermsFromLabel, "Terms Util");
			
			//for below attr doLabel is the Name
			termsFromLabel = termsProvider.getInstance().getTermByTermLabel("Customer.Current Booking");
			expectedTermsFromLabel = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromAssocTermLabel2.json',
					dataType: "json"
				}).data;
			})();
			assert.propEqual(termsFromLabel, expectedTermsFromLabel, "Terms Util");
		});
		
		//test cases for multiple associations
		QUnit.test("terms for multiple associations", function (assert) {
			termsBuilder.getInstance().construct(multipleAssociationsVocabData);
			
			//for below assoc Label is undefined
			var termsFromLabelMap = termsProvider.getInstance()._termsLabelMap;
			var expectedTermsFromLabelMap = (function getData() {
				return jQuery.sap.sjax({
					url: '../../expectedData/ast/terms/termsFromMultipleAssocs.json',
					dataType: "json"
				}).data;
			})();
			
			assert.propEqual(termsFromLabelMap, expectedTermsFromLabelMap, "Terms Util");
		});
		
	});