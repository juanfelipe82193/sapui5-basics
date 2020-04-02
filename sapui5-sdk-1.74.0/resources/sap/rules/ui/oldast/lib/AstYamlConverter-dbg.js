/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

/**
 * Expression to ast yaml converter utility function for sap.rules.ui.
 * @return {object} astYamlConverter
 */

sap.ui.define([
	"sap/rules/ui/oldast/lib/Constants"
], function(Constants) {
	"use strict";
	var astYamlConverter = {};

	/**
	 *
	 * @param astOutput
	 *
	 * Utility function to AST to Yaml Json
	 */
	astYamlConverter.parseConditionStatement = function(astOutput) {

		// Get the Statements Array

		if (!this.hasOwnProperty("Id")) {
			this.Id = 0;
		}
		var Children = [];
		var parentObject;
		var hasStatementsOperator = false;
		var statementsArray = astOutput[Constants.STATEMENTS_ARRAY];
		if (statementsArray.hasOwnProperty(Constants.RESULTS)) {
			statementsArray = statementsArray[Constants.RESULTS];
		}
		var iterator;
		for (iterator = 0; iterator < statementsArray.length; iterator++) {
			var statement = statementsArray[iterator]; // get the statement
			// Get type of the statement using the lookup

			var type = statement.getType();

			
			//TODO: if (!type) Handle Empty type and handle exceptions accordigly
			
			// TODO : try out other statements and handle different statements type
			if (type === Constants.MODEL) {
				// Call this method recursively
				Children.push(this.parseConditionStatement(statement));
			} else if (type === Constants.COMPLEX_STATEMENT) {
				Children.push(this.parseConditionStatement(statement.getModel()));
			} else if (type === Constants.SIMPLE_STATEMENT) {
				// Call Simple Statement
				Children.push(this.parseSimpleStatement(statement));
			} else if (type === Constants.STATEMENT_OPERATOR) { // Assumption? Only one statementOperator per statementsArray// Example : or/and
				// Get type of statementOperator
				// output of statementOperator is always boolean
				hasStatementsOperator = Constants.TRUE;
				var output = {
					DataObjectType: Constants.ELEMENT,
					BusinessDataType: Constants.BOOLEAN
				};
				parentObject = this._getEmptyAstObject();
				parentObject.Id = this.Id++;
				parentObject.Token.Type = Constants.FUNCTION; // And/Or should be function

				parentObject.Token.Value = Constants[statement.getValue()];
				parentObject.Output = output;
				parentObject.Root = Constants.TRUE;


			} 
				
			// TODO : if (type === Constants.BOOLEAN_EQUALITY_OPERATOR) Handle this case

		}

		if (hasStatementsOperator) {
			parentObject.Children = [];
			for (iterator = 0; iterator < Children.length; iterator++) {
				parentObject.Children.push({
					Id: Children[iterator].Id,
					sequenceNumber: iterator + 1,
					Object: Children[iterator]
				});
			}
		} else {
			parentObject = Children[0]; //TODO : verify this
		}

		return parentObject;
	};

	// Utility to get emptyAstObject
	astYamlConverter._getEmptyAstObject = function() {
		var obj = {
			Id: null,
			Root: false,
			Token: {
				Type: null,
				Value: null
			}
		};
		return obj;
	};

	astYamlConverter.parseSimpleStatement = function(statement) {

		var selectionOperator, leftSelectionObject, rightSelectionObject;
		// check LeftSelectionClause, operator and RightSelectionClause

		if (statement.hasOwnProperty(Constants.LEFT_SELECTION_CLAUSE)) {
			var leftSelectionClause = statement.getLeftSelectionClause();
			leftSelectionObject = this._recursiveParseExpression(leftSelectionClause);
		}
		if (statement.hasOwnProperty(Constants.SELECTION_OPERATOR)) {
			selectionOperator = statement.getSelectionOperator();
		} else {
			return leftSelectionObject;
		}
		if (statement.hasOwnProperty(Constants.RIGHT_SELECTION_CLAUSE)) {
			var rightSelectionClause = statement.getRightSelectionClause();
			rightSelectionObject = this._recursiveParseExpression(rightSelectionClause);
		}

		var object = this._getEmptyAstObject();
		object.Id = this.Id++;
		object.Token.Type = Constants.FUNCTION;
		object.Token.Value = Constants[selectionOperator.getValue()];
		object.Root = true;
		object.Output = {
			BusinessDataType: Constants.BOOLEAN,
			DataObjectType: Constants.ELEMENT
		};
		object[Constants.CHILDREN] = [];
		this._addChildren(object, leftSelectionObject, 1);
		this._addChildren(object, rightSelectionObject, 2);
		return object;
	};

	// Add children to parent SelectionOperator
	astYamlConverter._addChildren = function(object, child, sequenceNumber) {
		if (child instanceof Array) {
			var cbject;
			// Loop through each array element and it to children
			for (cbject in child) {
				object.Children.push({
					Id: child[cbject].Id,
					SequenceNumber: sequenceNumber++,
					Object: child[cbject]
				});
			}
		} else {
			object.Children.push({
				Id: child.Id,
				SequenceNumber: sequenceNumber,
				Object: child
			});
		}
	};

	// Loop through series of Statements recursively
	astYamlConverter._recursiveParseExpression = function(selectionClause) {
		var selectionsObject;
		var selectionsArray = [];
		var arithmeticOperatorsArray = [];
		var iterator;
		var selection;
		var value;
		var object;
		// Handle selectionsArray and value List Array
		if (selectionClause.hasOwnProperty(Constants.SELECTIONS_ARRAY)) {
			// Get Selection Array
			var selectionArray = selectionClause[Constants.SELECTIONS_ARRAY];
			for (iterator = 0; iterator < selectionArray.length; iterator++) {
				// Get type of selectionArray
				var type = selectionArray[iterator].getType();

				if (type === Constants.SIMPLE_SELECTION) {
					selection = selectionArray[iterator];
					if (selection.hasOwnProperty(Constants.ORIGINALVALUE)) {
						value = selection.getOriginalValue();
					} else {
						value = selection.getValue();
					}
					var valueType = selection.getValueType();

					object = this._getEmptyAstObject();
					object.Id = this.Id++;
					object.Token.Type = Constants.LITERAL; // For simple selection type is always Literal
					object.Token.Value = value;
					object.Root = false;
					object.Output = {
						BusinessDataType: Constants[valueType.toUpperCase()],
						DataObjectType: Constants.ELEMENT // valueType
					};
					selectionsArray.push(object);
				} else if (type === Constants.COMPOUND_SELECTION) {
					selection = selectionArray[iterator].getSelection();
					// TODO : Aggregation Expression Handling
					var navigationPredicate = selection.getNavigationPredicateDetails();
					//var navigationFullPath = navigationPredicate.getNavigationFullPath();
					var navigationFullPathId = navigationPredicate.getNavigationFullPathId();
					//var attribute = navigationPredicate.getAttribute();
					//var rootObject = navigationPredicate.getRootObject();
					var attributeType = navigationPredicate.getAttributeType();
					object = this._getEmptyAstObject();
					object.Id = this.Id++;
					object.Token.Type = Constants.OBJECT; // For Compound selection type is always Object
					object.Token.Value = navigationFullPathId;
					object.Output = {
						BusinessDataType: Constants[attributeType.toUpperCase()],
						DataObjectType: Constants.ELEMENT // valueType
					};
					selectionsArray.push(object);

				} else if (type === Constants.ARITHMETICOPERATOR) {
					selection = selectionArray[iterator];
					value = selection.getValue();
					if (value === Constants.LEFT_SMALL_BRACKET || value === Constants.RIGHT_SMALL_BRACKET) {
						continue;
					}
					var arithmeticRootObject;
					arithmeticRootObject = this._getEmptyAstObject();
					arithmeticRootObject.Id = this.Id++;
					arithmeticRootObject.Token.Type = Constants.FUNCTION;
					arithmeticRootObject.Token.Value = Constants[value];
					arithmeticRootObject.Output = {
						BusinessDataType: Constants.NUMBER,
						DataObjectType: Constants.ELEMENT
					};

					arithmeticOperatorsArray.push(arithmeticRootObject);

				} else if (type === Constants.SELECTION_CLAUSE) {
					selectionsArray.push(this._recursiveParseExpression(selectionArray[iterator]));
				}
			}

		} else if (selectionClause.hasOwnProperty(Constants.VALUES_ARRAY)) {
			var valuesArray = selectionClause[Constants.VALUES_ARRAY];
			for (iterator = 0; iterator < valuesArray.length; iterator++) {
				selectionsArray.push(this._recursiveParseExpression(valuesArray[iterator])[0]);
			}

		} 
		// TODO : Handle Else case
		
		if (arithmeticOperatorsArray.length > 0) {
			selectionsObject = this._constructArithmeticObject(arithmeticOperatorsArray, selectionsArray);
		} else {
			selectionsObject = selectionsArray;
		}

		return selectionsObject;
	};

	// same priority operators will be part of arithmeticOperatorsArray
	astYamlConverter._constructArithmeticObject = function(arithmeticOperatorsArray, numericArray) {
		for (var outerIterator = 0; outerIterator < arithmeticOperatorsArray.length; outerIterator++) {
			var numericObject = arithmeticOperatorsArray[outerIterator];
			numericObject.Children = [];
			// pop two items from numeric Array and add result back to numericArray
			var leftChild = numericArray.shift();
			var rightChild = numericArray.shift();

			numericObject.Root = true;

			numericObject.Children.push({
				Id: leftChild.Id,
				SequenceNumber: 0,
				Object: leftChild
			});

			numericObject.Children.push({
				Id: rightChild.Id,
				SequenceNumber: 1,
				Object: rightChild
			});

			numericArray.unshift(numericObject);

		}

		return numericArray[0];
	};

	return astYamlConverter;
}, true);
