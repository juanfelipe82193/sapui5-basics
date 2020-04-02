sap.ui.define(["sap/rules/ui/ast/autoComplete/node/TermNode",
    "sap/rules/ui/ast/autoComplete/node/OperatorNode",
    "sap/rules/ui/ast/constants/Constants",
    "sap/rules/ui/ast/provider/TermsProvider",
    "sap/rules/ui/ast/provider/OperatorProvider"],
    function (TermNode, OperatorNode, Constants, TermsProvider, OperatorProvider) {
        "use strict";

        var NodeManager = function () {

        };

        NodeManager.prototype.getNode = function (token, prefixId) {
            switch (token.getTokenType()) {
                case Constants.TERM:
                    var oTermNode = new TermNode();
                    var sText = token.getText();
                    sText = sText.replace(".", "");
                    sText = sText.replace(/\//g, ".");
                    sText = sText.replace(".", "");
                    if (prefixId) {
                        sText = prefixId + Constants.DOT + sText;
                    }
                    var oTerm = TermsProvider.getInstance().getTermByTermId(sText);
                    // TODO : Handle empty term throw exception accordingly
                    if (oTerm) {
                        var businessDataType = oTerm.getBusinessDataType();
                        var dataObjectType = oTerm.getDataObjectType();
                        if (oTerm._isDataObjectElement || oTerm.isResultDataObjectElement) {
                            var attribute = TermsProvider.getInstance()._getAllAttrsAndAssocsForDataObject(oTerm._termId)[0];
                            businessDataType = attribute ? attribute.getBusinessDataType() : businessDataType;
                            dataObjectType = attribute ? attribute.getDataObjectType() : dataObjectType;
                        }
                        dataObjectType = dataObjectType == "S" ? "T" : dataObjectType;
                        oTermNode.setName(oTerm.getTermName()).setLabel(oTerm.getLabel()).setId(oTerm.getTermId()).setBusinessDataType(businessDataType).setDataObjectType(
                            dataObjectType);
                    } else {

                    }

                    return oTermNode;
                case Constants.OPERATOR:
                    var oOperatorNode = new OperatorNode();
                    var operator = OperatorProvider.getInstance().getOperatorByName(token.getText().toUpperCase());
                    oOperatorNode.setName(operator.getName()).setLabel(operator.getLabel());
                    oOperatorNode.setOperatorMetadata(operator);
                    return oOperatorNode;
                case Constants.STRINGBUSINESSDATATYPE:
                case Constants.DATEBUSINESSDATATYPE:
                case Constants.BOOLEANBUSINESSDATATYPE:
                case Constants.TIMEBUSINESSDATATYPE:
                case Constants.QUANTITYBUSINESSDATATYPE:
                case Constants.NUMBERBUSINESSDATATYPE:
                case Constants.GEOBUSINESSDATATYPE:
				case Constants.UTC_TIMESTAMP:
                    // Assume everthing is integer Now
                    var oLiteralNode = new TermNode();
                    oLiteralNode.setName(token.getText()).setLabel(token.getText())
                        .setBusinessDataType(token.getTokenType()).setDataObjectType("E");
                    return oLiteralNode;
                default:
                    break;
            }
        };

        NodeManager.prototype.getBusinessDataTypeOfGivenLiteral = function (sLiteral) {
            // TODO : Special handling for date/time
            var reg = /^[0-9]+$/;
            if (reg.test(sLiteral) == true) {
                return Constants.NUMBERBUSINESSDATATYPE;
            } else if (typeof sLiteral === Constants.BOOLEAN) {
                return Constants.BOOLEANBUSINESSDATATYPE;
            } else {
                return Constants.STRINGBUSINESSDATATYPE;
            }
        };

        return NodeManager;

    }, true);