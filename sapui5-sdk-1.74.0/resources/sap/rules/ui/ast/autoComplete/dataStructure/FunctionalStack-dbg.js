sap.ui.define(["sap/rules/ui/ast/autoComplete/dataStructure/BaseStack",
		"sap/rules/ui/ast/constants/Constants",
		"sap/rules/ui/ast/autoComplete/node/TermNode",
		"sap/rules/ui/ast/autoComplete/dataStructure/Stack"
	],
	function (BaseStack, Constants, TermNode, Stack) {
		"use strict";

		var FunctionalStack = function () {
			BaseStack.apply(this, arguments);
			this._name = "";
			this._oFunction = null;
		};

		FunctionalStack.prototype = new BaseStack();
		FunctionalStack.prototype.constructor = BaseStack;

		FunctionalStack.prototype.push = function (oToken) {
			var type = oToken.getTokenType();
			switch (type) {
			case Constants.LEFTPARENTHESIS:
				return this.handleLeftParenthesisToken(oToken);
			case Constants.RIGHTPARENTHESIS:
				return this._handleRightParenthesisToken(oToken);
			case Constants.COMMA:
				if (this.getTop() && "push" in this.getTop()) {
					var oResult = this.getTop().push(oToken);
					if (oResult.bTokenPushed == false && this.getHasOpenParenthesis() == true) {
						return this._CloseArgumentAndCreateNextStack();
					} else if (oResult.bTokenPushed == false) {
						return oResult;
					}
				} else {
					// TODO:
					return {
						bTokenPushed: false,
						error: "invalid token comma"
					}
				}
			case Constants.WS:
				return {
					bTokenPushed: true
				};
			default:
				if (this.getTop() && "push" in this.getTop()) {
					return this._top.push(oToken);
				} else {
					return {
						bTokenPushed: false
					}
				}

			}
		};

		FunctionalStack.prototype._getArgSequenceDeterminingBusinessDataType = function () {
			var aArgsMetadata = this.getFunction().getArgumentsMetadata();
			for (var lIndex = 0; lIndex < aArgsMetadata.length; lIndex++) {
				if (aArgsMetadata[lIndex][Constants.DETERMINESRETURNDATAOBJECTTYPE] == Constants.YES) {
					return lIndex;
				}
			}
			return -1;
		};

		FunctionalStack.prototype.getName = function () {
			return this._name;
		};

		FunctionalStack.prototype.setName = function (name) {
			this._name = name;
			return this;
		};

		FunctionalStack.prototype.getFunction = function () {
			return this._oFunction;
		};

		FunctionalStack.prototype.setFunction = function (oFunction) {
			this._oFunction = oFunction;
			return this;
		};

		FunctionalStack.prototype._handleRightParenthesisToken = function (oToken) {
			if (this.getTop() && "push" in this.getTop()) {
				var oResult = this.getTop().push(oToken);
				if (oResult.bTokenPushed === false && this.getHasOpenParenthesis() == true) {
					return this._closeFunctionAndReturnCalculatedNode();
				} else if (oResult.bTokenPushed === true) {
					return oResult;
				} else {
					// TODO :throw exception
					return {
						bTokenPushed: false
					};
				}
			} else if (this.getTop() && !("push" in this.getTop()) && this.getHasOpenParenthesis() == true) {
				return this._closeFunctionAndReturnCalculatedNode();
			} else {
				return {
					bTokenPushed: false
				};
			}

		};

		FunctionalStack.prototype._closeFunctionAndReturnCalculatedNode = function () {
			this.setHasOpenParenthesis(false);

			var sCategory = this.getFunction().getCategory();
			if (sCategory == Constants.AGGREGATE || sCategory == Constants.SELECTION) {
				return this._closeAggregateFunction();
			} else {
				return this._closeFunction();
			}

		};

		FunctionalStack.prototype._closeFunction = function () {
			var cNode = new TermNode();
			cNode.setName(this.getFunction().getName());
			cNode.setLabel(this.getFunction().getLabel());

			var stackSize = this.getSize();
			var aArgsMetadata = this.getFunction().getArgumentsMetadata();
			var sBusinessDataType;
			var sDataObjectType;
			var currentArgumentMetdata;

			if (aArgsMetadata == undefined) {
				sBusinessDataType = this.getFunction().getDefaultReturnBusinessDataType();
				sDataObjectType = this.getFunction().getDefaultReturnDataObjectType();
			} else if (aArgsMetadata) {

			    if(this.getFunction() && this.getFunction().getNumberOfArguments() === "*" && stackSize >= aArgsMetadata.length) {
                    currentArgumentMetdata = aArgsMetadata[aArgsMetadata.length - 1];
                } else {
                    currentArgumentMetdata = aArgsMetadata[stackSize - 1];
                }
				var oTopNode = this._getNodeRecursively(this._top);

				if (currentArgumentMetdata) {
					if (currentArgumentMetdata.referenceIndex != -1) {
						var referenceArgumentNode = this._getNodeRecursively(this.peek(currentArgumentMetdata.referenceIndex - 1));

						var referenceArgumentNodeBusinessDataType = referenceArgumentNode.getBusinessDataType();
						var referenceArgumentNodeDataObjectDataType = referenceArgumentNode.getDataObjectType();

						if (referenceArgumentNodeDataObjectDataType == "S") {
							referenceArgumentNodeDataObjectDataType = "T";
						}

						if (referenceArgumentNodeBusinessDataType && oTopNode && "getBusinessDataType" in oTopNode &&
							oTopNode.getBusinessDataType() && "referenceBusinessDataTypeCollection" in currentArgumentMetdata && currentArgumentMetdata[
								"referenceBusinessDataTypeCollection"] && currentArgumentMetdata["referenceBusinessDataTypeCollection"][
								referenceArgumentNodeBusinessDataType
							]) {
							sBusinessDataType = currentArgumentMetdata["referenceBusinessDataTypeCollection"][referenceArgumentNodeBusinessDataType][oTopNode.getBusinessDataType()];
						}
						var sTopNodeDataObjectType = oTopNode.getDataObjectType();
						if (sTopNodeDataObjectType == "S") {
							sTopNodeDataObjectType = "T";
						}

						if (referenceArgumentNodeDataObjectDataType && oTopNode && "getDataObjectType" in oTopNode &&
							oTopNode.getDataObjectType() && "referenceDataObjectTypeCollection" in currentArgumentMetdata && currentArgumentMetdata[
								"referenceDataObjectTypeCollection"] && currentArgumentMetdata["referenceDataObjectTypeCollection"][
								referenceArgumentNodeDataObjectDataType
							]) {
							sDataObjectType = currentArgumentMetdata["referenceDataObjectTypeCollection"][referenceArgumentNodeDataObjectDataType][
								sTopNodeDataObjectType
							];
						}

						if (sDataObjectType == undefined && sBusinessDataType == undefined) {
							return {
								bTokenPushed: false,
								errorCode: 10,
								errorMessage: "Mismatch in argument businessData type or dataObject type"
							};
						}

					} else {
						// TODO : Handle this case when metadata is enhanced

					}
				} else {
					return {
						bTokenPushed: false,
						errorCode: 9,
						errorMessage: "Mismatch in number of arguments"
					};
				}
			} else {
				return {
					bTokenPushed: false,
					errorCode: 9,
					errorMessage: "Mismatch in number of arguments"
				};
			}

			cNode.setBusinessDataType(sBusinessDataType);
			cNode.setDataObjectType(sDataObjectType);

			this._top = cNode;
			this._size = 1;
			return {
				bTokenPushed: true,
				bFunctionClosed: true
			};
		};

		FunctionalStack.prototype._closeAggregateFunction = function () {
			var cNode = new TermNode();
			cNode.setName(this.getFunction().getName());
			cNode.setLabel(this.getFunction().getLabel());

			var sDefaultDataObjectType = this.getFunction().getDefaultReturnDataObjectType();
			var aReturnDataObjectTypeList = this.getFunction().getProbableDataObjectTypeList();

			cNode.setDataObjectType(sDefaultDataObjectType); // Default is table
			cNode.setBusinessDataType(this.getFunction().getDefaultReturnBusinessDataType());
			if (this.getTermPrefixId() && this.getTermPrefixId() != "") { // TODO :: handle 
				cNode.setId(this.getTermPrefixId());
			}
			var lIndex = this._getArgSequenceDeterminingBusinessDataType();
			if (aReturnDataObjectTypeList && aReturnDataObjectTypeList.length >= 1 && lIndex > -1 && this._determinetoChangeDataObjectType()) {
				var node = this._getNodeRecursively(this.peek(lIndex));
				if (node instanceof TermNode) {
					// Special Handling metadata like Count
					if (sDefaultDataObjectType == Constants.Element) {
						cNode.setDataObjectType(Constants.Table);
					} else {
						cNode.setDataObjectType(Constants.Element);
						var sBusinessDataType = node.getBusinessDataType();
						//If Function is CountDistinct its businessDataType will be "N" independent of Vocabulary						
						if (this.getFunction().getName() == Constants.COUNTDISTINCT) {
							sBusinessDataType = Constants.NUMBERBUSINESSDATATYPE;
						}
						cNode.setBusinessDataType(sBusinessDataType);
					}

				}
			}

			this._top = cNode;
			this._size = 1;
			return {
				bTokenPushed: true,
				bFunctionClosed: true
			};
		}

		FunctionalStack.prototype._determinetoChangeDataObjectType = function () {
			if (this.getFunction().getName() == Constants.COUNT) {
				if (this.getSize() == 1)
					return false;
				else
					return true;
			} else if (this.getSize() <= 2)
				return true;
			return false;
		};

		FunctionalStack.prototype.handleLeftParenthesisToken = function (oToken) {
			if (this.getHasOpenParenthesis() === false && this.getSize() == 0) {
				this.setHasOpenParenthesis(true);
				this._top = new sap.rules.ui.ast.autoComplete.dataStructure.Stack(this.getTermPrefixId());
				// TODO : read from mandatory parameter and set the expected 
				// dataObjectType and BusinessDataType
				var aArgsMetadata = this.getFunction().getArgumentsMetadata();
				var aProbableDataObjectList = [];
				var aProbableBusinessDataTypeList = [];
				if (aArgsMetadata) {
					aProbableDataObjectList = aArgsMetadata[0].dataObjectTypeList;
					aProbableBusinessDataTypeList = aArgsMetadata[0].businessDataTypeList ? aArgsMetadata[0].businessDataTypeList : [];
				}
				this._top.setPrevious(this);
				this._top.setProbableDataObjectReturnTypeList(aProbableDataObjectList);
				this._top.setProbableBusinessDataReturnTypeList(aProbableBusinessDataTypeList);
				this._size += 1;

				return {
					bTokenPushed: true
				}
			} else if (this.getHasOpenParenthesis() == true && this.getSize() > 0 && this.getTop() && "push" in this.getTop()) {
				return this.getTop().push(oToken);
			} else {
				// TODO : throw exception
				return {
					bTokenPushed: false
				}
			}
		};

		FunctionalStack.prototype._CloseArgumentAndCreateNextStack = function () {

			var nextArgumentIndex = this.getSize() + 1;
			var oTopNode = this._getNodeRecursively(this._top);
			var aArgsMetadata = this.getFunction().getArgumentsMetadata();

			if (this.getFunction().getNumberOfArguments() != "*" && nextArgumentIndex > this.getFunction().getNumberOfArguments()) {

				return {
					bTokenPushed: false,
					errorCode: 11,
					errorMessage: "More number of arguments is been added"
				};
			}
			var node = new sap.rules.ui.ast.autoComplete.dataStructure.Stack(this.getTermPrefixId());
			if (this.getFunction().getCategory() == Constants.AGGREGATE || this.getFunction().getCategory() == Constants.SELECTION) {
				if (this.getSize() <= aArgsMetadata.length) {
					// TODO: hack for now to make attribute with prefix id
					node.setProbableDataObjectReturnTypeList(aArgsMetadata[this.getSize() - 1].dataObjectTypeList);
					node.setProbableBusinessDataReturnTypeList(aArgsMetadata[this.getSize() - 1].businessDataTypeList);
				} else {
					node.setProbableDataObjectReturnTypeList([]);
					node.setProbableBusinessDataReturnTypeList([]);
				}
				if (this.getSize() == 1 && oTopNode instanceof TermNode) {
					this.setTermPrefixId(oTopNode.getId());
				}
			} else {

				var propableBussinessDataTypeCollection;
				var propableDataObjectTypeCollection;
				var currentArgumentMetadata;
				var nextArgumentMetadata;
				if (aArgsMetadata) {

					var argsSize = this.getSize();
					if(this.getFunction() && this.getFunction().getNumberOfArguments() === "*" && argsSize >= aArgsMetadata.length) {
                        currentArgumentMetadata = aArgsMetadata[0];
                        nextArgumentMetadata = aArgsMetadata[aArgsMetadata.length-1];
                    } else {
                        currentArgumentMetadata = aArgsMetadata[argsSize - 1];
                        nextArgumentMetadata = aArgsMetadata[argsSize];
                    }

					if (nextArgumentMetadata.referenceIndex != -1) {
						var businessDataType = oTopNode.getBusinessDataType();
						var dataObjectDataType = oTopNode.getDataObjectType();

						// We treat structure as table
						if (dataObjectDataType == "S") {
							dataObjectDataType = "T";
						}

						if (businessDataType && "referenceBusinessDataTypeCollection" in nextArgumentMetadata && nextArgumentMetadata[
								"referenceBusinessDataTypeCollection"]) {
							var nextArgumentMetadataBusinessDataTypeCollection = nextArgumentMetadata["referenceBusinessDataTypeCollection"][businessDataType];
							if (nextArgumentMetadataBusinessDataTypeCollection) {
								propableBussinessDataTypeCollection = Object.keys(nextArgumentMetadataBusinessDataTypeCollection);

							} else {
								return {
									bTokenPushed: false,
									errorCode: 13,
									errorMessage: "BusinessDatatype Mismatch for arguement :" + this.getSize() + "FunctionName :" + this.getFunction().getName()
								};
							}
						}

						if (dataObjectDataType && "referenceDataObjectTypeCollection" in nextArgumentMetadata &&
							nextArgumentMetadata["referenceDataObjectTypeCollection"]) {
							var nextArgumentMetadataDatObjectTypeCollection = nextArgumentMetadata["referenceDataObjectTypeCollection"][dataObjectDataType];
							if (nextArgumentMetadataDatObjectTypeCollection) {
								propableDataObjectTypeCollection = Object.keys(nextArgumentMetadataDatObjectTypeCollection);
							} else {
								return {
									bTokenPushed: false,
									errorCode: 13,
									errorMessage: "BusinessDatatype Mismatch for arguement :" + this.getSize() + "FunctionName :" + this.getFunction().getName()
								};
							}
						}

					} else {
						// TODO : handle this case
					}

				} else {
					return {
						bTokenPushed: false,
						errorCode: 12,
						errorMessage: "Arguments information is missing : " + this.getFunction().getName()
					};
				}

				node.setProbableBusinessDataReturnTypeList(propableBussinessDataTypeCollection);
				node.setProbableDataObjectReturnTypeList(propableDataObjectTypeCollection);
			}

			node.setTermPrefixId(this.getTermPrefixId());
			node.setPrevious(this._top);
			this._top = node;
			this._size += 1;
			return {
				bTokenPushed: true
			};

		};

		FunctionalStack.prototype.getProbableBusinessDataReturnTypeList = function () {
			return this.getFunction().getProbableBusinessDataTypeList();
		};

		FunctionalStack.prototype.getProbableDataObjectReturnTypeList = function () {
			return this.getFunction().getProbableDataObjectTypeList();
		};

		return FunctionalStack;
	}, true);