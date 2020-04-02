sap.ui.define(["sap/rules/ui/ast/model/Term", "sap/rules/ui/ast/constants/Constants"], function (termObj, constants) {
	'use strict';

	/**
	 * Constructor for TermsProvider
	 *
	 * @param {string} [_vocabId] is the vocabulary ID
	 * @param {hashmap} [_termsIdMap] it is a hashmap for which the IDs (dataobject ID or dataobjectID.attributeID)
	 * are keys & the value is the corresponding term object
	 * @param {hashmap} [_termsNameMap] it is a hashmap for which the names (dataobject name or dataobjectName.attributeName)
	 * are keys & the value is the corresponding term object
	 * 
	 */

	var TermsProvider = function () {
		this._vocabId = ''; //to be populated by TermsBuilder
		this._termsIdMap = {};
		this._termsNameMap = {};
		this._termsLabelMap = {};
	}
	
	TermsProvider.prototype.reset = function () {
		this._vocabId = ''; //to be populated by TermsBuilder
		this._termsIdMap = {};
		this._termsNameMap = {};
		this._termsLabelMap = {};
	};

	/* Below variable is to hold the reference for this class as it is singleton */
	var instance;

	TermsProvider.prototype._getAllAttrsAndAssocsForDataObject = function (id) {
		var list = [],
			term;
		var doDepthLevel = id.split(constants.DOT).length;

		for (var termsKey in this._termsIdMap) {
			term = this._termsIdMap[termsKey];
			if (termsKey.startsWith(id + constants.DOT) && (term.getBusinessDataType() ||
				term.getDataObjectType() === 'AO') && (termsKey.split(constants.DOT).length) <= doDepthLevel + 1) {
				list.push(term);
			}
		}
		return list;
	};

	TermsProvider.prototype._getAllAttrsAndAssocsForDataObjectByName = function (name) {
		var list = [],
			term, termName;
		var doDepthLevel = name.split(constants.DOT).length;
		for (var termsKey in this._termsNameMap) {
			term = this._termsNameMap[termsKey];
			termName = term.getTermName();
			if (termName.startsWith(name + constants.DOT) && (term.getBusinessDataType() ||
				term.getDataObjectType() === 'AO') && (termName.split(constants.DOT).length) <= doDepthLevel + 1) {
				list.push(term);
			}
		}
		return list;
	};

	TermsProvider.prototype._getAllAttributesByPrefixIdAndBusinessType = function (prefix, businessDatatype) {
		var terms = [],
			term, termId;
		var doDepthLevel = prefix.split(constants.DOT).length;

		for (var termsKey in this._termsIdMap) {
			term = this._termsIdMap[termsKey];
			termId = term.getTermId();
			if (termId && termId && termId.startsWith(prefix + constants.DOT) && (term.getBusinessDataType() && term.getBusinessDataType() === businessDatatype)
				&& (termId.split(constants.DOT).length) <= (doDepthLevel + 1)) {
				terms.push(term);
			}
		}
		return terms;
	};

	TermsProvider.prototype._getAllAttributesByPrefixNameAndBusinessType = function (prefix, businessDatatype) {
		var terms = [],
			term, termName;
		var doDepthLevel = prefix.split(constants.DOT).length;

		for (var termsKey in this._termsNameMap) {
			term = this._termsNameMap[termsKey];
			termName = term.getTermName();
			if (termName.startsWith(prefix + constants.DOT) && (term.getBusinessDataType() && term.getBusinessDataType() === businessDatatype) &&
				(termName.split(constants.DOT).length) <= (doDepthLevel + 1)) {
				terms.push(term);
			}
		}
		return terms;
	};
	
	TermsProvider.prototype._getAttributesGivenPrefixId = function (prefix, businessDatatype) {
        var terms = [],
            term, termId;
        var doDepthLevel = prefix.split(constants.DOT).length;

        for (var termsKey in this._termsIdMap) {
            term = this._termsIdMap[termsKey];
            termId = term.getTermId();
            if (termId && termId && termId.startsWith(prefix + constants.DOT) && term.getDataObjectType() != 'AO'
                && (termId.split(constants.DOT).length) <= (doDepthLevel + 1)) {
                terms.push(term);
            }
        }
        return terms;
    };

	TermsProvider.prototype._getAllDataObjects = function () {
		var dataObjectsTerms = [],
			type, term;
		for (var termsKey in this._termsIdMap) {
			term = this._termsIdMap[termsKey];
			type = term ? term.getDataObjectType() : ""; //type is undefined for attributes
			//hence using it to filter all the dataobjects
			if (type && (('E'.localeCompare(type) === 0 && term._bussinessDataType === null) || ('E'.localeCompare(type) != 0 && 'AO'.localeCompare(
					type) != 0 && term && term.type !== constants.RULE))) {
				dataObjectsTerms.push(term);
			}
		}
		return dataObjectsTerms;
	};
	
	/* used to get the vocabulary rules */
	TermsProvider.prototype._getAllVocabularyRules = function () {
		var vocabularyRules = [],
			type, term;
		for (var termsKey in this._termsIdMap) {
			term = this._termsIdMap[termsKey];
			type = term ? term.Type : ""; 
			//hence using it to filter all the dataobjects
			if (type && type === constants.RULE) {
                vocabularyRules.push(term);
				/*var resultDOTerm = this.getTermByTermId(term.ResultDataObjectId)
				 if (resultDOTerm && resultDOTerm._dataObjectType !== "T") {
				 vocabularyRules.push(term);
				 }*/
			}
		}
		return vocabularyRules;
	};

	/* used by the TermBuilder to set the vocabulary ID while constructing the terms */
	TermsProvider.prototype.setVocabularyId = function (vocabId) {
		this._vocabId = vocabId;
		return this;
	};

	/* function to create Term object */
	TermsProvider.prototype.createTerm = function (termName, termId, businessDataType, vocaId, dataObjectType, label, hasValueSource, cardinality) {
		return new termObj().setTermName(termName).setTermId(termId).setBusinessDataType(businessDataType)
			.setVocaId(vocaId).setDataObjectType(dataObjectType).setLabel(label).setHasValueSource(hasValueSource).setCardinality(cardinality);
	};

	/* adds term to the termsIdMap. example key - 7166d7b82b364b3a8f18106b643af254.9156f9eee8ff4316acd314ba2a5f2b93 */
	TermsProvider.prototype.addToTermsIdMap = function (key, value) {
		this._termsIdMap[key] = value;
	};

	/* adds term to the termsNameMap. example key - DISCOUNT.DISCOUNT_VALUE (DoName.AttributeName). It could be DoName.Association name too */
	TermsProvider.prototype.addToTermsNameMap = function (key, value) {
		this._termsNameMap[key] = value;
	};
	
	/* adds term to the termsLabelMap. example key - DISCOUNT.DISCOUNT_VALUE (DoLabel.AttributeLabel). It could be DoLabel.AssociationLabel too */
	TermsProvider.prototype.addToTermsLabelMap = function (key, value) {
		this._termsLabelMap[key] = value;
	};

	/* 
		Does a lookup on _termsIdMap & returns the term object.
		Example - doing a lookup with key as 7166d7b82b364b3a8f18106b643af254.9156f9eee8ff4316acd314ba2a5f2b93 (DoId.AttributeId)
	*/
	TermsProvider.prototype.getTermByTermId = function (termId) {
		var oTerm = this._termsIdMap[termId];
		if (oTerm) {
			return oTerm;
		} else {
			// Use brute force search till we get Attribute at return and if not return null
			for (var key in this._termsIdMap) {
				var term = this._termsIdMap[key];
				if (term && term.getTermId().indexOf(termId) >= 0 && term.getDataObjectType()) {
					return term;
				}
			}

		}
		return oTerm;
	};

	/* 
		Does a lookup on _termsNameMap & returns the term object.
		Example - doing a lookup with key as DISCOUNT.DISCOUNT_VALUE (DoName.AttributeName)
	*/
	TermsProvider.prototype.getTermByTermName = function (termName) {
		return this._termsNameMap[termName];
	};
	
	/* 
		Does a lookup on _termsLabelMap & returns the term object.
		Example - doing a lookup with key as DISCOUNT.DISCOUNT_VALUE (DoLabel.Label)
	*/
	TermsProvider.prototype.getTermByTermLabel = function (termLabel) {
		return this._termsLabelMap[termLabel];
	};

	/*
		Returns all the terms from _termsIdMap
	*/
	TermsProvider.prototype.getAllTerms = function () {
		var terms = [];
		for (var key in this._termsIdMap) {
			terms.push(this._termsIdMap[key]);
		}
		return terms;
	};

	/* 
		1. if the id passed is vocab ID or blank then returns all the data objects
		2. else iterates over the terms & get all the attributes & association for the data object whose id is passed as parameter
	    (returns only immediate children)
	*/
	TermsProvider.prototype.getTermsById = function (id) {

		if (this._vocabId === id || !id) {
			return this._getAllDataObjects();
		}
		var term, dataObjectType;
		term = this._termsIdMap[id];
		if (term) {
			dataObjectType = term.getDataObjectType();
			if (dataObjectType && ('E'.localeCompare(dataObjectType) != 0) && (constants.ELEMENT.localeCompare(dataObjectType) != 0)) {
				return this._getAllAttrsAndAssocsForDataObject(id);
			}
		}
		return [];
	};

	/* 
		1. if the name passed is blank then returns all the data objects
		2. else iterates over the terms & get all the attributes & association for the data object whose name is passed as parameter
		    (returns only immediate children)
	*/
	TermsProvider.prototype.getTermsByName = function (name) {
		if (!name) {
			return _getAllDataObjects();
		}
		var term, dataObjectType;
		term = this._termsNameMap[name];
		if (term) {
			dataObjectType = term.getDataObjectType();
			if (dataObjectType && (constants.ELEMENT.localeCompare(dataObjectType) != 0)) {
				return this._getAllAttrsAndAssocsForDataObjectByName(name);
			}
		}
		return [];
	};

	TermsProvider.prototype.getTermsByBusinessDataType = function (businessType) {
		var terms = [];
		for (var key in this._termsIdMap) {
			var term = this._termsIdMap[key];
			if (term.getBusinessDataType() === businessType) {
				terms.push(term);
			}
		}
		return terms;
	};

	TermsProvider.prototype.getTermsByPrefixIdAndBusinessDataType = function (prefix, businessType) {
		return this._getAllAttributesByPrefixIdAndBusinessType(prefix, businessType);
	};

	TermsProvider.prototype.getTermsByPrefixNameAndBusinessDataType = function (prefix, businessType) {
		return this._getAllAttributesByPrefixNameAndBusinessType(prefix, businessType);
	};

	TermsProvider.prototype.getDOTermsByBusinessDataType = function (businessDatatype) {
		//returns the dataobject terms which have atleast one attribute of type 'businessDatatype'

		// 1. Get all dataobjects
		var doTerms = this._getAllDataObjects();
		var finalDOTerms = [];
		var terms = [];
		var doTerm;
		if (doTerms) {
			// 2. For each dataobject call getTermsByPrefixIdBusinessAndDOType(prefixId, dataObjectType, businessDatatype)
			for (var termsIterator = 0; termsIterator < doTerms.length; termsIterator++) {
				doTerm = doTerms[termsIterator];
				terms = this.getTermsByPrefixIdBusinessAndDOType(doTerm.getTermId(), ['E'], businessDatatype);
				if (terms && terms.length > 0) { //if such terms exist then add the data object term
					finalDOTerms.push(doTerm);
				}
			}
		}
		return finalDOTerms;
	}

	TermsProvider.prototype.getTermsByDataObjectType = function (dataObjectType) {
		var terms = [];
		var term;
		for (var key in this._termsIdMap) {
			term = this._termsIdMap[key];
			if (term && term.getDataObjectType() === dataObjectType) {
				terms.push(term);
			}
		}
		return terms;
	};

	TermsProvider.prototype.getTermsByDataObjectTypeAndPrefixId = function (prefixId, dataObjectType) {
		var term;
		var finalTerms = [];
		var terms = this.getTermsById(prefixId); //get all terms for this prefix;
		if (terms) {
			for (var termsIterator = 0; termsIterator < terms.length; termsIterator++) {
				term = terms[termsIterator];
				if (term.getDataObjectType() === dataObjectType) {
					finalTerms.push(term);
				}
			}

		}
		return finalTerms;
	};

	TermsProvider.prototype.getTermsByDataObjectTypeAndPrefixName = function (prefixName, dataObjectType) {
		var term;
		var finalTerms = [];
		var terms = this.getTermsByName(prefixName); //get all terms for this prefix;
		if (terms) {
			for (var termsIterator = 0; termsIterator < terms.length; termsIterator++) {
				term = terms[termsIterator];
				if (term.getDataObjectType() === dataObjectType) {
					finalTerms.push(term);
				}
			}
		}
		return finalTerms;
	};

	TermsProvider.prototype._getTermsByBusinessType = function (terms, businessType) {
		var filteredTerms = [];
		var term;
		for (var termsIter = 0; termsIter < terms.length; termsIter++) {
			term = terms[termsIter];
			if (term && term.getBusinessDataType() === businessType) {
				filteredTerms.push(term);
			}
		}
		return filteredTerms;
	};

	TermsProvider.prototype.getTermsByBusinessAndDOType = function (dataObjectType, businessDatatype) {

		//get all dataobjects of type dataObjectType
		var terms = this.getTermsByDataObjectType(dataObjectType);

		var finalTerms = [];
		var attrTerms = [];
		for (var termsIter = 0; termsIter < terms.length; termsIter++) {
			attrTerms = this.getTermsById(terms[termsIter].getTermId());
			finalTerms.push.apply(finalTerms, this._getTermsByBusinessType(attrTerms, businessDatatype));
		}
		return finalTerms;
	};

	//above method with prefix name/id
	TermsProvider.prototype.getTermsByPrefixIdBusinessAndDOType = function (prefixId, dataObjectType, businessDatatype) {

		//dataObjectType is an array - can have 'AT' or 'AO'
		var term, doType;
		var finalTerms = [];
		var terms = this.getTermsById(prefixId); //get all terms for this prefix
		if (terms) {
			for (var termsIterator = 0; termsIterator < terms.length; termsIterator++) {
				term = terms[termsIterator];
				for (var doTypeIterator = 0; doTypeIterator < dataObjectType.length; doTypeIterator++) {
					doType = dataObjectType[doTypeIterator];
					if (term.getDataObjectType() === doType && term.getBusinessDataType() === businessDatatype) {
						finalTerms.push(term);
					}
				}
			}

		}
		return finalTerms;
	};

	TermsProvider.prototype.getTermsByPrefixNameBusinessAndDOType = function (prefixName, dataObjectType, businessDatatype) {

		//dataObjectType is an array - can have 'E' or 'AO'
		var term, doType;
		var finalTerms = [];
		var terms = this.getTermsByName(prefixName); //get all terms for this prefix
		if (terms) {
			for (var termsIterator = 0; termsIterator < terms.length; termsIterator++) {
				term = terms[termsIterator];
				for (var doTypeIterator = 0; doTypeIterator < dataObjectType.length; doTypeIterator++) {
					doType = dataObjectType[doTypeIterator];
					if (term.getDataObjectType() === doType && term.getBusinessDataType() === businessDatatype) {
						finalTerms.push(term);
					}
				}
			}
		}
		return finalTerms;
	};

	TermsProvider.prototype.getAssociationsGivenPrefixName = function (prefixName) {

		var term;
		var finalTerms = [];
		var terms = this.getTermsByName(prefixName); //get all terms for this prefix

		if (terms && terms.length > 0) {
			for (var termsIterator = 0; termsIterator < terms.length; termsIterator++) {
				term = terms[termsIterator];
				if (term.getDataObjectType() == 'AO') {
					finalTerms.push(term);
				}
			}
		};
		return finalTerms;

	};

	TermsProvider.prototype.getAssociationsGivenPrefixId = function (prefixName) {

		var term;
		var finalTerms = [];
		var terms = this.getTermsById(prefixName); //get all terms for this prefix

		if (terms && terms.length > 0) {
			for (var termsIterator = 0; termsIterator < terms.length; termsIterator++) {
				term = terms[termsIterator];
				if (term.getDataObjectType() == 'AO') {
					finalTerms.push(term);
				}
			}
		};
		return finalTerms;

	};
	
	return {
		/*
			Returns the TermsProvider instance. This is the only instance available as this class is singleton
		*/
		getInstance: function () {
			if (!instance) {
				instance = new TermsProvider();
				instance.constructor = null;
			}
			return instance;
		}
	};
}, true);
