sap.ui.define(["sap/ui/base/Object", "sap/base/util/extend"
	], function(BaseObject, extend) {
		"use strict";

		function getMethods(oController, oTemplateUtils, oViewProxy, oState) {
			// immutable variables initialized on creation or on demand
			var bIsDraft = oTemplateUtils.oComponentUtils.isDraftEnabled();
			var oBusyHelper = oTemplateUtils.oServices.oApplication.getBusyHelper();
			var oView = oController.getView();
			var oUiModel = oView.getModel("ui");
			var oConfirmationPopover;

			// state variables

			var bIsConfirmationPopoverActive = false;
			var bIsCancelling = false;
			var fnCancellationConfirmed; // function that should be called, when the user has confirmed the cancellation
			var fnCancellationResult; // a function that either rejects or resolves the current process of cancellation. If this is truthy a cancelling process has been started

			if (bIsDraft && oTemplateUtils.oComponentUtils.getViewLevel() !== 1){ // in draft cases cancellation can only be done on root level.
				fnCancellationResult = Function.prototype;                               // This pretends that a cancellation request is already running, so all cancellation requests will be rejected
			}

			function fnFinshed(){
				fnCancellationResult();
				fnCancellationConfirmed = null;
				fnCancellationResult = null;
			}

			// this function cleans up the internal state if cancellation has ended successfully or unsuccessfully
			function fnCleanUpAfterCancellation(){
				bIsCancelling = false;
				if (bIsConfirmationPopoverActive){
					oConfirmationPopover.close(); // triggers fnFinshed to be called in the beforeClose event
				} else {
					fnFinshed();
				}
			}

			function fnOpenConfirmationPopover(oCancelButton, bIsCreate){
				oConfirmationPopover = oConfirmationPopover || oTemplateUtils.oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.fragments.DiscardEditPopover", {
					onDiscardConfirm: function() {
						if (!bIsConfirmationPopoverActive || bIsCancelling){
							return;
						}
						fnCancellationConfirmed();
					},
					beforeClose: function(){
						bIsConfirmationPopoverActive = false;
						fnFinshed();
					}
				}, "discard", function(oFragment, oConfirmationModel){
					oConfirmationModel.setProperty("/placement", sap.m.PlacementType.Top); // initialization
				});
				bIsConfirmationPopoverActive = true;
				var oConfirmationModel = oConfirmationPopover.getModel("discard");
				oConfirmationModel.setProperty("/isCreate", bIsCreate);
				oConfirmationPopover.openBy(oCancelButton);
			}

			// returns a Promise that resolves to a function that performs the actions that should be done after a successfull cancel
			function getExecuteAfterCancelPromise() {
				if (bIsDraft){
					var oContext = oView.getBindingContext();
					return oTemplateUtils.oServices.oApplication.getNavigateAfterDraftCancelPromise(oContext).then(function(fnNavigate){
						return function(){ // this is the function that will be executed after successfull cancel
							oTemplateUtils.oServices.oViewDependencyHelper.setRootPageToDirty();
							oTemplateUtils.oServices.oViewDependencyHelper.unbindChildren(oController.getOwnerComponent());
							// Draft discard is a kind of cross navigation -> invalidate paginator info
							oTemplateUtils.oServices.oApplication.invalidatePaginatorInfo();
							fnNavigate();
						};
					});
				}
				// non draft case
				return Promise.resolve(function(){
					var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
					oTemplatePrivateModel.setProperty("/objectPage/displayMode", 1);
					oViewProxy.setEditable(false);
					if (oTemplateUtils.oComponentUtils.getNonDraftCreateBindingPath()) {
						oTemplateUtils.oServices.oNavigationController.navigateBack();
					}
				});
			}

			function fnNeedsConfirmation(){
				if (bIsDraft){
					var oContext = oView.getBindingContext();
					var sPath = oContext.getPath();
					var bIsDraftModified = oTemplateUtils.oServices.oApplication.getIsDraftModified(sPath) || oState.saveScenarioHandler.hasValidationMessageOnDetailsViews();
					return bIsDraftModified;
				}
				// non draft case
				var bHasExternalChanges = !!oState.aUnsavedDataCheckFunctions && oState.aUnsavedDataCheckFunctions.some(function(fnUnsavedCheck){
					return fnUnsavedCheck();
				}); // check for changes done by breakouts or reuse components
				var oModel = oView.getModel();
				return bHasExternalChanges || oModel.hasPendingChanges();
			}

			function isCreate(){
				if (bIsDraft){
					var oContext = oView.getBindingContext();
					var oEntity = oContext.getObject();
					var bIsCreateDraft = oEntity.hasOwnProperty("HasActiveEntity") && !oContext.getProperty("IsActiveEntity") && !oContext.getProperty(
						"HasActiveEntity");
					return bIsCreateDraft;
				}
				return !!oTemplateUtils.oComponentUtils.getNonDraftCreateBindingPath(); // non draft case
			}

			// this function is executed, when the editing of an entity is ended
			// This can either be via the cancel button or programmatically (in the second case parameter oCancelButton is faulty)
			function fnDiscardEdit(oCancelButton){
				if (fnCancellationResult){ // do not discard while another discard is executed
					return Promise.reject();
				}
				if (!(oTemplateUtils.oComponentUtils.isComponentActive() && oUiModel.getProperty("/editable"))){
					return Promise.reject(); // Cancellation only possible in edit mode
				}
				var oRet = new Promise(function(fnResolve, fnReject){
					fnCancellationResult = fnReject; // until we have an explicit success every end of the cancellation process will be considered as a reject
					var oExecuteAfterCancelPromise = getExecuteAfterCancelPromise(); // determine what should be done after a successfull cancel. Since this possibly requires a backend request it is already started here
					var fnPerformCancellation = function(){
						if (oCancelButton && oBusyHelper.isBusy()){ // dialog case -> check for busy
							fnFinshed();
							return;
						}
						var fnExecuteCancellation = function(){ // This function is called, when we know that we really want to cancel (if confirmation is needed it has been given)
							bIsCancelling = true;
							var oCancellationPromise = oExecuteAfterCancelPromise.then(function(fnAfterCancellation){ // when we know, what we would do after a cancellation we start the cancellation
								var fnSuccess = function(){ // what to do if cancellation was successfull
									fnCancellationResult = fnResolve; // now the end of the process is considered as a resolve
									fnAfterCancellation(); // perform the after cancel navigation
									fnCleanUpAfterCancellation(); // clean up the state of this class
								};
								var oDiscardPromise; // will only be truthy in the draft case
								if (bIsDraft){
									oDiscardPromise = oTemplateUtils.oServices.oCRUDManager.deleteEntity(false, true).then(fnSuccess);
									oDiscardPromise.catch(fnCleanUpAfterCancellation);
								} else {
									fnSuccess(); // in non-draft case the cancel cannot fail
								}
								oTemplateUtils.oCommonUtils.resetChangesAndFireCancelEvent(oDiscardPromise);
								return oDiscardPromise; // oCancellationPromise is only resolved when this Promise is resolved, provided it is truthy (draft case)
							});
							oBusyHelper.setBusy(oCancellationPromise);
						};
						if (oCancelButton && fnNeedsConfirmation()){
							fnCancellationConfirmed = fnExecuteCancellation;
							fnOpenConfirmationPopover(oCancelButton, isCreate());
						} else {
							fnExecuteCancellation();
						}
					};
					oTemplateUtils.oServices.oApplication.performAfterSideEffectExecution(fnPerformCancellation);
				});
				oRet.catch(Function.prototype); // to prevent misleading error logs
				return oRet;
			}

			// public instance methods
			return {
				discardEdit: fnDiscardEdit
			};
		}

		return BaseObject.extend("sap.suite.ui.generic.template.detailTemplates.DiscardEditHandler", {
			constructor: function(oController, oTemplateUtils, oViewProxy, oState) {
				extend(this, getMethods(oController, oTemplateUtils, oViewProxy, oState));
			}
		});
	});
