sap.ui.define(["sap/ui/base/Object",
		"sap/ui/model/analytics/odata4analytics",
		"sap/base/Log",
		"sap/base/util/each"
	],
	function (BaseObject, oData4Analytics, Log, each) {
		"use strict";

		var AnnotationHelper = BaseObject.extend("sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationHelper");

		sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationHelper.criticalityConstants = {
			StateValues: {
				None: "None",
				Negative: "Error",
				Critical: "Warning",
				Positive: "Success"
			},
			ColorValues: {
				None: "Neutral",
				Negative: "Error",
				Critical: "Critical",
				Positive: "Good"
			}
		};

		AnnotationHelper.selectionPresentationVariantResolveWithQualifier = function (oContext) {
			//var oResult = Basics.followPath(oContext, oContext.getObject());

			var oKpi = oContext.getObject();
			var oModel = oContext.getModel();
			var oMetaModel = oModel.getProperty("/metaModel");
			var oEntitySet = oMetaModel.getODataEntitySet(oKpi.entitySet);
			var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
			var sAnnotationPath = oEntityType.$path + "/com.sap.vocabularies.UI.v1.SelectionPresentationVariant#" + oKpi.qualifier;
			return oMetaModel.createBindingContext(sAnnotationPath);

		};

		AnnotationHelper.resolveParameterizedEntitySet = function (oDataModel, oEntitySet, oSelectionVariant) {
			var path = "";
			var o4a = new oData4Analytics.Model(oData4Analytics.Model.ReferenceByModel(oDataModel));
			var queryResult = o4a.findQueryResultByName(oEntitySet.name);
			var queryResultRequest = new oData4Analytics.QueryResultRequest(queryResult);
			var parameterization = queryResult && queryResult.getParameterization();

			if (parameterization) {
				var param;
				queryResultRequest.setParameterizationRequest(new oData4Analytics.ParameterizationRequest(parameterization));
				if (oSelectionVariant.getParameterNames) {
					var aAllParams = oSelectionVariant.getParameterNames();
					aAllParams.forEach(function (oParam) {
						param = oSelectionVariant.getParameter(oParam);
						queryResultRequest.getParameterizationRequest().setParameterValue(
							oParam,
							param
						);
					});
				} else {
					each(oSelectionVariant.Parameters, function () {
						if (this.RecordType === "com.sap.vocabularies.UI.v1.IntervalParameter") {
							param = this.PropertyValueFrom.PropertyPath.split("/");
							queryResultRequest.getParameterizationRequest().setParameterValue(
								param[param.length - 1],
								this.PropertyValueFrom.String,
								this.PropertyValueTo.String
							);
						} else {
							param = this.PropertyName.PropertyPath.split("/");
							queryResultRequest.getParameterizationRequest().setParameterValue(
								param[param.length - 1],
								this.PropertyValue.String
							);
						}
					});
				}
			}

			try {
				path = queryResultRequest.getURIToQueryResultEntitySet();
			} catch (exception) {
				queryResult = queryResultRequest.getQueryResult();
				path = "/" + queryResult.getEntitySet().getQName();
				Log.error("getEntitySetPathWithParameters", "binding path with parameters failed - " + exception || exception.message);
			}
			return path;
		};

		AnnotationHelper.checkParameterizedEntitySet = function (oDataModel, oEntitySet, sPropertyName) {
			var o4a = new oData4Analytics.Model(oData4Analytics.Model.ReferenceByModel(oDataModel));
			var queryResult = o4a.findQueryResultByName(oEntitySet.name);
			var parameterization = queryResult && queryResult.getParameterization();

			if (parameterization) {
				var aParams = parameterization.getAllParameterNames();
				for (var i = 0; i < aParams.length; i++) {
					if (aParams[i] === sPropertyName) {
						return true;
					}
				}
			}
			return false;
		};

		AnnotationHelper.checkForDateTimeParameter = function (oDataModel, oEntitySet, sParameter) {
			var o4a = new oData4Analytics.Model(oData4Analytics.Model.ReferenceByModel(oDataModel));
			var queryResult = o4a.findQueryResultByName(oEntitySet);
			var parameterization = queryResult && queryResult.getParameterization();

			if (parameterization) {
				var aParams = parameterization.getAllParameters();
				if (aParams[sParameter] && aParams[sParameter].getProperty()["type"] === "Edm.DateTime") {
					return true;
				}
			}
			return false;
		};
		AnnotationHelper.checkMandatoryParameter = function (oDataModel, oEntitySet, sParameter) {
			var o4a = new oData4Analytics.Model(oData4Analytics.Model.ReferenceByModel(oDataModel));
			var queryResult = o4a.findQueryResultByName(oEntitySet.name);
			var parameterization = queryResult && queryResult.getParameterization();
			var bIsMandatoryParameter = false;

			if (parameterization) {
				if (parameterization.findParameterByName(sParameter) && !parameterization.findParameterByName(sParameter).isOptional()) {
					bIsMandatoryParameter = true;
				}
			}
			return bIsMandatoryParameter;
		};
		return AnnotationHelper;

	}, true);
