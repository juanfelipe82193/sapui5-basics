sap.ui.define(["sap/rules/ui/ast/util/AstUtil", "sap/rules/ui/ast/provider/TermsProvider", "sap/rules/ui/ast/constants/Constants"],
	function (astUtil, termsProvider, constants) {
		"use strict";

		var instance;
		var TermsBuilder = function () {
			this._dataObjects = [];
			this._visitorAssociations = new astUtil.prototype.HashSet();
			this.termsProviderInstance = termsProvider.getInstance();
		};

		TermsBuilder.prototype._getDataObjectType = function (dataObjectType) {
			if (dataObjectType) {
				if (dataObjectType === "Structure") {
					return "S";
				}
				if (dataObjectType === "Table") {
					return "T";
				}
				if (dataObjectType === "Element") {
					return "E";
				}
			}
			return dataObjectType;
		};

		TermsBuilder.prototype._getBusinessDataType = function (businessDataType) {
			if (businessDataType) {
				if (businessDataType.toLocaleLowerCase() === "Number".toLocaleLowerCase()) {
					return "N";
				}
				if (businessDataType.toLocaleLowerCase() === "String".toLocaleLowerCase()) {
					return "S";
				}
				if (businessDataType.toLocaleLowerCase() === "Boolean".toLocaleLowerCase()) {
					return "B";
				}
				if (businessDataType.toLocaleLowerCase() === "Date".toLocaleLowerCase()) {
					return "D";
				}
				if (businessDataType.toLocaleLowerCase() === "Timestamp".toLocaleLowerCase()) {
					return "U";
				}
				if (businessDataType.toLocaleLowerCase() === "Time".toLocaleLowerCase()) {
					return "T";
				}
				if (businessDataType.toLocaleLowerCase() === "Geometry".toLocaleLowerCase()) {
					return "G";
				}
			}
			return businessDataType;
		};

		TermsBuilder.prototype._generateTermsFromAssociations = function (association, sourceDO, vocaId, prefix, prefixId, prefixLabel) {
			var targetDO, attributes, attribute, associations, term, doLabel, associationLabel, attrLabel;
			if (association) {
				
				//if label is undefined then name will be used for label map
				doLabel = sourceDO.Name;
				if(sourceDO.Label && sourceDO.Label != ""){
					doLabel = sourceDO.Label;
				}
				associationLabel = association.Name;
				if(association.Label && association.Label != ""){
					associationLabel = association.Label;
				}
				
				term = this.termsProviderInstance.createTerm(prefix + constants.DOT + association.Name,
						prefixId + constants.DOT + association.Id, null, vocaId, 'AO', associationLabel, false, association.Cardinality);
				targetDO = this._getDataObject(association.TargetDataObjectId);
				this.termsProviderInstance.addToTermsIdMap(prefixId + constants.DOT + association.Id, term);
				this.termsProviderInstance.addToTermsNameMap(prefix + constants.DOT + association.Name, term);
				this.termsProviderInstance.addToTermsLabelMap(prefixLabel + constants.DOT + associationLabel, term);

				attributes = targetDO.Attributes;
				for (var attrIterator = 0; attrIterator < attributes.length; attrIterator++) {
					attribute = attributes[attrIterator];
					//if label is undefined then name will be used for label map
					attrLabel = attribute.Name;
					if(attribute.Label && attribute.Label != ""){
						attrLabel = attribute.Label;
					}
					term = this.termsProviderInstance.createTerm(prefix + constants.DOT + association.Name + constants.DOT + attribute.Name,
						prefixId + constants.DOT + association.Id + constants.DOT + attribute.Id, this._getBusinessDataType(attribute.BusinessDataType), vocaId, 'E',
						attrLabel, attribute.HasValueSource);
					this.termsProviderInstance.addToTermsIdMap(prefixId + constants.DOT + association.Id + constants.DOT + attribute.Id, term);
					this.termsProviderInstance.addToTermsNameMap(prefix + constants.DOT + association.Name + constants.DOT + attribute.Name,
						term);
					this.termsProviderInstance.addToTermsLabelMap(prefixLabel + constants.DOT + associationLabel + constants.DOT + attrLabel,
						term);
				}

				associations = targetDO.Associations;
				var assoc;
				for (var assocIterator = 0; assocIterator < associations.length; assocIterator++) {
					assoc = associations[assocIterator];
					this._generateTermsFromAssociations(assoc, targetDO, vocaId, prefix + constants.DOT + association.Name, prefixId + constants.DOT +
						association.Id, prefixLabel + constants.DOT + associationLabel);
				}
			}
		};
	
		/* generates terms from rules */
		TermsBuilder.prototype._generateTermsFromRules = function (json) {
			var rule, _rules, ruleLabel, term, dataObject, attributes, attribute, association, associations, attributeLabel, _dataObjects, vocaId;
			if (json.d && json.d.DataObjects){
				_dataObjects = json.d.DataObjects;
				vocaId = json.d.Id;
			} else if(json.DataObjects){
				_dataObjects = json.DataObjects;
				vocaId = json.Id;
			}
			if (json.d && json.d.Rules){
				_rules = json.d.Rules;
			} else if(json.Rules){
				_rules = json.Rules;
			}
			for (var ruleIterator = 0; ruleIterator < _rules.length; ruleIterator++) {
                rule = _rules[ruleIterator];
                //if label is undefined then name will be used for label map
                ruleLabel = rule.Name;
                if (rule.Label && rule.Label != "") {
                    ruleLabel = rule.Label;
                }
                term = this.termsProviderInstance.createTerm(rule.Name, rule.Id, null,
                    rule.VocabularyId, null, ruleLabel);
                term.ResultDataObjectId = rule.ResultDataObjectId;
                term.Status = rule.Status;
                term.Type = constants.RULE;
                var resultDoTerm = this.termsProviderInstance.getTermByTermId(term.ResultDataObjectId);
                if (resultDoTerm && resultDoTerm.getIsDataObjectElement()) {
                    term.isResultDataObjectElement = true;
                    var elementAttrTerm = this.termsProviderInstance._getAllAttrsAndAssocsForDataObject(term.ResultDataObjectId);
                    term._bussinessDataType = elementAttrTerm[0]._bussinessDataType;
                    term._hasValueSource = elementAttrTerm[0]._hasValueSource;
                }
                this.termsProviderInstance.addToTermsIdMap(rule.Id, term);
                this.termsProviderInstance.addToTermsNameMap(rule.Name, term);
                this.termsProviderInstance.addToTermsLabelMap(ruleLabel, term);
                
                for (var doIterator = 0; doIterator < _dataObjects.length; doIterator++) {
					dataObject = _dataObjects[doIterator];
					if(dataObject.Id === term.ResultDataObjectId) {
						attributes = dataObject.Attributes;
						for (var attrIterator = 0; attrIterator < attributes.length; attrIterator++) {
							attribute = attributes[attrIterator];
							//if label is undefined then name will be used for label map
							attributeLabel = attribute.Name;
							if(attribute.Label && attribute.Label != ""){
								attributeLabel = attribute.Label;
							}
							term = this.termsProviderInstance.createTerm(attribute.Name, rule.Id + constants.DOT +
								attribute.Id,
								this._getBusinessDataType(attribute.BusinessDataType), vocaId, 'E', attributeLabel);
							this.termsProviderInstance.addToTermsIdMap(rule.Id + constants.DOT + attribute.Id, term);
							this.termsProviderInstance.addToTermsNameMap(rule.Name + constants.DOT + attribute.Name, term);
							this.termsProviderInstance.addToTermsLabelMap(ruleLabel + constants.DOT + attributeLabel, term);
						}

						associations = dataObject.Associations;
						for (var assocIterator = 0; assocIterator < associations.length; assocIterator++) {
							association = associations[assocIterator];
							this._generateTermsFromAssociations(association, dataObject, vocaId, rule.Name, rule.Id, ruleLabel);
						}
					}
			   }
            }
		};
		
		/* returns all the dataObjects */
		TermsBuilder.prototype._getDataObject = function (id) {
			for (var doIterator = 0; doIterator < this._dataObjects.length; doIterator++) {
				if (id === this._dataObjects[doIterator].Id) {
					return this._dataObjects[doIterator];
				}
			}
		};

		/*
			Generates all possible terms for all dataObjects.
			Example:
				Assume a dataObject DO has two attributes(do1attr1, do1attr2) and one association(asso1) which is linked to dataObject DO2.
				Assume DO2 has two attributes(do2attr1, do2attr2)
				So this function for do1 will create the following terms:
				do1
				do1.doattr1
				do1.do1attr2
				do1.asso1
				do1.asso1.do2attr1
				do1.asso1.do2attr1
		*/
		TermsBuilder.prototype.construct = function (json) {
			/* constructs terms from the passed json parameter & sets it in TermsProvider */
			this._dataObjects = json.DataObjects;
			this._rules = json.Rules;
			var vocaId = json.Id;
			this.termsProviderInstance.reset();
			this.termsProviderInstance.setVocabularyId(vocaId);
			var dataObject, attributes, attribute, association, associations, term, doLabel, attributeLabel;
			for (var doIterator = 0; doIterator < this._dataObjects.length; doIterator++) {
				dataObject = this._dataObjects[doIterator];
				//if label is undefined then name will be used for label map
				doLabel = dataObject.Name;
				if(dataObject.Label && dataObject.Label != ""){
					doLabel = dataObject.Label;
				}		
			    var isDataObjectElement = false;
				if (dataObject.Type === "Element") {
					isDataObjectElement = true
				}
				term = this.termsProviderInstance.createTerm(dataObject.Name, dataObject.Id, null,
					vocaId, this._getDataObjectType(dataObject.Type), doLabel);
				term.setIsDataObjectElement(isDataObjectElement);
				this.termsProviderInstance.addToTermsIdMap(dataObject.Id, term);
				this.termsProviderInstance.addToTermsNameMap(dataObject.Name, term);
				this.termsProviderInstance.addToTermsLabelMap(doLabel, term);

				attributes = dataObject.Attributes;
				for (var attrIterator = 0; attrIterator < attributes.length; attrIterator++) {
					attribute = attributes[attrIterator];
					
					//if label is undefined then name will be used for label map
					attributeLabel = attribute.Name;
					if(attribute.Label && attribute.Label != ""){
						attributeLabel = attribute.Label;
					}
					term = this.termsProviderInstance.createTerm(dataObject.Name + constants.DOT + attribute.Name, dataObject.Id + constants.DOT +
						attribute.Id,
					this._getBusinessDataType(attribute.BusinessDataType), vocaId, 'E', attributeLabel, attribute.HasValueSource);
					this.termsProviderInstance.addToTermsIdMap(dataObject.Id + constants.DOT + attribute.Id, term);
					this.termsProviderInstance.addToTermsNameMap(dataObject.Name + constants.DOT + attribute.Name, term);
					this.termsProviderInstance.addToTermsLabelMap(doLabel + constants.DOT + attributeLabel, term);
				}

				associations = dataObject.Associations;
				for (var assocIterator = 0; assocIterator < associations.length; assocIterator++) {
					association = associations[assocIterator];
					this._generateTermsFromAssociations(association, dataObject, vocaId, dataObject.Name, dataObject.Id, doLabel);
				}
			}
			
			if(this._rules && this._rules.length > 0) {
				this._generateTermsFromRules(json);
			}
		};
		return {
			/*
				Returns the TermsBuilder instance. This is the only instance available as this class is singleton
			*/
			getInstance: function () {
				if (!instance) {
					instance = new TermsBuilder();
					instance.constructor = null;
				}
				return instance;
			}
		};
	}, true);