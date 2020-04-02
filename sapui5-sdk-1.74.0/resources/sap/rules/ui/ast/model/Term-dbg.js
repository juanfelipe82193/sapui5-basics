sap.ui.define(function () {
	"use strict";

	var Term = function () {
		this._termName;
		this._bussinessDataType;
		this._termId;
		this._vocaId;
		this._dataObjectType;
		this._label;
		this._hasValueSource = false;
		this._cardinality;
		this._isDataObjectElement = false;
	};

	var _basicSetterValueValidation = function (setterValue) {
		if (setterValue === null || setterValue === undefined) {
			//TODO
		}
	}

	Term.prototype = {

		getTermName: function () {
			return this._termName;
		},

		setTermName: function (termName) {
			_basicSetterValueValidation(termName);
			this._termName = termName;
			return this;
		},

		getBusinessDataType: function () {
			return this._bussinessDataType;
		},

		setBusinessDataType: function (businessDataType) {
			_basicSetterValueValidation(businessDataType);
			this._bussinessDataType = businessDataType;
			return this;
		},

		getTermId: function () {
			return this._termId;
		},

		setTermId: function (termId) {
			_basicSetterValueValidation(termId);
			this._termId = termId;
			return this;
		},

		getVocaId: function () {
			return this._vocaId;
		},

		setVocaId: function (vocaId) {
			_basicSetterValueValidation(vocaId);
			this._vocaId = vocaId;
			return this;
		},

		getDataObjectType: function () {
			return this._dataObjectType;
		},

		setDataObjectType: function (dataObjectType) {
			_basicSetterValueValidation(dataObjectType);
			this._dataObjectType = dataObjectType;
			return this;
		},

		getLabel: function () {
			return this._label;
		},

		setLabel: function (label) {
			_basicSetterValueValidation(label);
			this._label = label;
			return this;
		},

		setHasValueSource: function (hasValueSource) {
			if (hasValueSource == undefined) {
				return this;
			}
			this._hasValueSource = hasValueSource;
			return this;
		},

		getHasValueSource: function () {
			return this._hasValueSource;
		},
		
		getCardinality: function(){
			return this._cardinality;
		},

		setCardinality: function(cardinality){
			_basicSetterValueValidation(cardinality);
			//set the value only if its defined (so that it's get set only for associations)
			if(cardinality){
				this._cardinality = cardinality;
			}
			return this;
		},
 
  		setIsDataObjectElement: function (value) {
 			this._isDataObjectElement = value;
 		},
 
  		getIsDataObjectElement: function () {
 			return this._isDataObjectElement;
		}		
		
	}
	return Term;
}, true);
