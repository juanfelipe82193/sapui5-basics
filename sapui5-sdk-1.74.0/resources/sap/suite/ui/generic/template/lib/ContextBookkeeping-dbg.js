sap.ui.define(["sap/ui/base/Object", "sap/base/util/extend"], function (BaseObject, extend) {
		"use strict";

		/* This class is a helper class for supporting navigation to contexts.
		 * More precisely, for each App an instance of this class is created.
		 * This instance stores information about all 'header contexts' of entities which are loaded within the lifetime of the App.
		 * The public methods of this class can be divided into two categories:
		 * - registration methods: Contexts and actions on contexts are registered at this class in order to update the bookkeeping
		 * - retrieval methods: Methods that exploit the information which is stored in this registry
		 */
		function getMethods(oAppComponent) {

			// This is the central registry for all the contexts. It maps the path for this context onto a registry entry containing some metadata for this context.
			// More precisely, the entry contains the following properties:
			// - oContext: the context. Note that it is removed, when the entity is deleted.
			// - oContextInfo: information about the context. This object has the following attributes:
			//                 - bIsDraftSupported: Does the entity this context belongs to support draft at all
			//                 - bIsDraft: is this context representing a draft (only possible when bIsDraftSupported is true)
			//                 - bIsCreate: Is this a create context
			//                 - bIsDraftModified: Is this a draft which has been modified
			//                 - bOwnDraftExists: Does the active version/context have an own draft.
			// - oSiblingPromise: This property is only valid for non-create drafts. In this case it contains a Promise that resolves to the context of the
			//   active sibling. The property is filled when this Promise is requested the first time (via getDraftSiblingPromise).
			// - oEditingPromise: This property is only valid for top-level active contexts that support draft. In this case it is available, as soon as an editing
			//   session for this object has started. It is removed again, when the editing session ends.
			//   The promise resolves to EditingInfo when the editing really takes place. Thereby, EditingInfo has a property 'context' which contains the
			//   context of the editing draft.
			//   The promise is rejected, when the editing session could not become active (e.g. because the object is currently locked by another user).
			// - oRemovalPromise: This property is only valid for top-level drafts. In this case it is available as soon as an cancellation (only for edit drafts) or activation session for this
			//   draft has started. If this session fails (e.g. because the activation is rejected) the Promise is rejected and oRemovalPromise is set to be faulty again.
			//   If the session succeeds the Promise resolves to an object with a property 'context' which contains the context of the active version.
			// - bReplaceByActive: This property can only be truthy for edit(not for Create) drafts. "bReplaceByActive" is set(!isDraft) after registering Context(registerContext) is called.
			//   In the case with bReplaceActive set true, when Alternate context is requested the draft is surpressed and the corresponding active version is displayed.
			//   And vice-versa, when set to false, active versions will be redirected to draft.
			// Note that this registry only contains contexts that belong to existing backend entries. Thus, contexts being created in non-draft create scenarios
			// are not stored in this registry (since they do not yet exist on the server).
			var mPath2ContextData = {}; // currently only used for draft scenarios
			var aPathOfLastShownDraftRoots = []; // Is used if displayNextObjectAfterDelete is set in manifest to return to the last ObjectPage

			/* Begin of registration methods */

			// Private method that creates the ContextInfo for a given context
			function fnCreateDraftInfo(oContext) {
				var oDraftController = oAppComponent.getTransactionController().getDraftController();
				var oDraftContext = oDraftController.getDraftContext();
				var oActiveEntity = oContext.getObject();
				// check whether we are draft enabled AND the current context represents a draft
				var bIsDraftSupported = oDraftContext.hasDraft(oContext);
				var bIsDraft = bIsDraftSupported && !oActiveEntity.IsActiveEntity;
				var bIsCreate = bIsDraft && !oActiveEntity.HasActiveEntity;
				var bIsDraftModified = false;
				var bOwnDraftExists = oActiveEntity.HasDraftEntity ? oContext.getObject("DraftAdministrativeData/DraftIsCreatedByMe") : false;
				if (oActiveEntity.DraftEntityCreationDateTime && oActiveEntity.DraftEntityLastChangeDateTime) {
					bIsDraftModified = oActiveEntity.DraftEntityCreationDateTime.getTime() !== oActiveEntity.DraftEntityLastChangeDateTime.getTime();
				}
				return {
					bIsDraft: bIsDraft,
					bIsDraftSupported: bIsDraftSupported,
					bIsCreate: bIsCreate,
					bIsDraftModified: bIsDraftModified,
					bOwnDraftExists: bOwnDraftExists
				};
			}

			// Public method that registers a context at this instance
			// Note this is the only method which can also be called in non draft scenarios
			function registerContext(oContext, iViewLevel, sEntitySet) {
				var sPath = oContext.getPath();
				var oContextInfo = fnCreateDraftInfo(oContext);
				if (iViewLevel === 1 && !oContextInfo.bIsCreate) {
					aPathOfLastShownDraftRoots.push(sPath);
				}
				var aSemanticKeysValues = null;
				if (oContextInfo.bIsDraftSupported && !oContextInfo.bIsCreate) {
					var oModel = oContext.getModel();
					var oMetaModel = oModel.getMetaModel();
					var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
					var oEntityType = oEntitySet && oMetaModel.getODataEntityType(oEntitySet.entityType);
					var aSemanticKey = oEntityType && oEntityType["com.sap.vocabularies.Common.v1.SemanticKey"];
					if (aSemanticKey) {
						aSemanticKeysValues = [];
						for (var i = 0; i < aSemanticKey.length; i++) {
							aSemanticKeysValues.push(oContext.getProperty(aSemanticKey[i].PropertyPath));
						}
					}
				}

				// When edit of the an active context starts in the session, "oEditingPromise" is added to the contextData of the active context.
				// As a result, old contextData(mPath2ContextData[sPath]) is extended with the new contextData so that "oEditingPromise" is not cleared.
				var oContextData = extend(mPath2ContextData[sPath] || {}, {
					oContextInfo: oContextInfo,
					oContext: oContext,
					aSemanticKeysValues: aSemanticKeysValues
				});
				delete oContextData.oRemovalPromise; // this is needed for scenarios the keys of removed drafts may be reused for new drafts
				mPath2ContextData[sPath] = oContextData;

				if (oContextInfo.bIsDraft && !oContextInfo.bIsCreate) {
					// Updating "bReplaceByActive" when the new context is draft.
					mPath2ContextData[sPath].bReplaceByActive = false;
				} else if (oContextInfo.bOwnDraftExists && !oContextInfo.bIsCreate) {
					// Updating "bReplaceByActive" when the new context is active context.
					if (mPath2ContextData[sPath].oEditingPromise) {
						// When edit of the active version has started in the same session.
						mPath2ContextData[sPath].oEditingPromise.then(function (oDraftContext) {
							var sDraftPath = oDraftContext.context.getPath();
							mPath2ContextData[sDraftPath].bReplaceByActive = true;
						});
					} else {
						// When the corresponding draft was not created in the same session.
						getDraftSiblingPromise(oContext).then(function (oDraftContext) {
							var sDraftPath = oDraftContext.getPath();
							var oEditingContextData = mPath2ContextData[sDraftPath];
							if (oEditingContextData) {
								mPath2ContextData[sDraftPath].bReplaceByActive = true;
							}
						});
					}
				}
				return oContextInfo;
			}

			function getPathOfLastShownDraftRoot() {
				for (var i = aPathOfLastShownDraftRoots.length - 1; i >= 0; i--) {
					var oContext = mPath2ContextData[aPathOfLastShownDraftRoots[i]].oContext;
					if (oContext) {
						return aPathOfLastShownDraftRoots[i];
					}
				}
			}

			// Private method that retrieves the information for the given context. If the context is not yet registered, this happens now.
			function getContextData(oContext) {
				var sPath = oContext.getPath();
				var oRet = mPath2ContextData[sPath];
				return oRet;
			}

			// Private method that is called when the removal (activation, cancellation) of top-level draft oContext is started.
			// bIsCancellation contains the information which case applies
			// oRemovalPromise must be a Promise that is resolved when the removal is executed successfully.
			// If there exists an active version of the draft afterwards (i.e. the operation was activation or the draft was an edit-draft) oRemovalPromise
			// must resolve to an object with property 'context' representing this active version.
			// If the removal fails oRemovalPromise must be rejected.
			function draftRemovalStarted(oContext, oRemovalPromise, bIsCancellation) {
				// When the removal is successfull, property oContext of the context info is set to be faulty.
				// When we have an active version of the entity after the removal (i.e. we are not cancelling a create draft) the stored Promises need to be updated
				var oContextData = getContextData(oContext);
				if (!oContextData.oContextInfo.bIsCreate || !bIsCancellation) {
					oContextData.oRemovalPromise = oRemovalPromise;
				}
				oRemovalPromise.then(function (oResponse) {
					if (!oContextData.oContextInfo.bIsCreate || !bIsCancellation) { // remove Edit Promise from the active version
						var sDisplayPath = oResponse.context.getPath();
						var oDisplayContextInfo = mPath2ContextData[sDisplayPath];
						if (oDisplayContextInfo) {
							delete oDisplayContextInfo.oEditingPromise;
							oDisplayContextInfo.oContextInfo.bOwnDraftExists = false;
						}
					}
					oContextData.oContext = null;  // remove deleted context
				}, function () {
					delete oContextData.oRemovalPromise;
				});
			}

			// Public method that is called, when the activation of oContext is started. oActivationPromise must be a RemovalPromise like described in draftRemovalStarted
			function activationStarted(oContext, oActivationPromise) {
				draftRemovalStarted(oContext, oActivationPromise, false);
			}

			// Public method that is called, when the cancellation of oContext is started. oCancellationPromise must be a RemovalPromise like described in draftRemovalStarted
			function cancellationStarted(oContext, oCancellationPromise) {
				draftRemovalStarted(oContext, oCancellationPromise, true);
			}

			// Public method called when the user has started an editing procedure (of a draft based object)
			// oContext: the context of the object to be edited
			// oEditingPromise: A promise that behaves as the Promise returned by function editEntity of CRUDManager
			function editingStarted(oContext, oEditingPromise) {
				var oContextData = getContextData(oContext);
				oContextData.oEditingPromise = new Promise(function (fnResolve, fnReject) {
					var fnNoEdit = function(){
						delete oContextData.oEditingPromise;
						oContextData.oContextInfo.bOwnDraftExists = false;
						fnReject();
					};
					oEditingPromise.then(function (oEditInfo) {
						if (oEditInfo.draftAdministrativeData) {
							fnNoEdit();
						} else {
							oContextData.oContextInfo.bOwnDraftExists = true;
							// create the contextData object for the edit draft.
							// Note: In case that draft keys are reused this might replace an outdated entry.
							// Since the draft will be navigated to shortly afterwards, this entry will be updated. However, sActiveContextPath will stay.
							var sPath = oEditInfo.context.getPath();
							mPath2ContextData[sPath] = {
								sActiveContextPath: oContext.getPath(),
								oContextInfo: {
									bIsDraft: true,
									bIsDraftSupported: true,
									bIsCreate: false,
									bIsDraftModified: false,
									bOwnDraftExists: false
								}
							};
							fnResolve(oEditInfo);
						}
					}, fnNoEdit);
				});
				oContextData.oEditingPromise.catch(Function.prototype); // avoid ugly console messages
			}

			// Private method that is called when the object with path sPath has been deleted
			function fnAdaptAfterObjectDeleted(sPath) {
				var oContextData = mPath2ContextData[sPath];
				if (oContextData) {
					oContextData.oContext = null;
				}
			}

			/* End of registration methods */

			/* Begin of retrieval methods */

			// Private method that creates and returns a Promise that resolves to the context for the sibling of the specified context.
			// If the determination of the sibling information fails or no sibling currently exists, the Promise is rejected.
			// More precisely: If the determination of the sibling fails due to an error the Promise is rejected with the corresponding error object.
			// If no sibling exists, the Promise is rejected to nothing.
			function createDraftSiblingPromise(oModel, sPath) {
				return new Promise(function (fnResolve, fnReject) {
					oModel.read(sPath + "/SiblingEntity", {
						success: function (oResponseData) {
							if (oResponseData) {
								var oActive = oModel.getContext("/" + oModel.getKey(oResponseData));
								fnResolve(oActive);
							} else {
								fnReject();
							}
						},
						error: function (oError) {
							fnReject(oError);
						}
					});
				});
			}

			// Public method that returns a Promise that resolves to the sibling of the given context.
			// More precisely:
			// - The Promise resolves to nothing, when oContext is a Create-draft
			// - The Promise resolves to oContext, if oContext does not support drafts
			// - The Promise is rejected if an error occurs
			// - The Promise is rejected if oContext is active, supports drafts, but does not have a sibling
			// - The Promise resolves to the sibling context of oContext if it has one (and the sibling context can be determined).
			//   DraftContext has a reference to the ActiveContext path it is retrieved using the same and backend request is not send
			function getDraftSiblingPromise(oContext) {
				var oContextData = getContextData(oContext);
				if (oContextData.oContextInfo.bIsCreate) {
					return Promise.resolve();
				} else if (oContextData.sActiveContextPath) {
					var oActiveContextData = mPath2ContextData[oContextData.sActiveContextPath];
					return Promise.resolve(oActiveContextData.oContext);
				}
				var oSiblingPromise = oContextData.oSiblingPromise;
				if (!oSiblingPromise) {
					oSiblingPromise = oContextData.oContextInfo.bIsDraftSupported ?
						createDraftSiblingPromise(oContext.getModel(), oContext.getPath()) :
						Promise.resolve(oContext);
					// For active draft supporting contexts the sibling can change over time. Therefore, the Promise can only be cached
					// for later reuse, when oContext is either a draft or does not support drafts
					if (oContextData.oContextInfo.bIsDraft || !oContextData.oContextInfo.bIsDraftSupported) {
						oContextData.oSiblingPromise = oSiblingPromise;
					}
				}
				return oSiblingPromise;
			}

			function getSiblingPromise(sContextPath) {
				var oContextData = mPath2ContextData[sContextPath];
				return oContextData ? getDraftSiblingPromise(oContextData.oContext) : createDraftSiblingPromise(oAppComponent.getModel(), sContextPath);
			}

			// Public method that is used to check whether navigation to a context should be forwarded to another context.
			// sPath describes the path that is navigated to
			// Returns a Promise that either returns to faulty (no forwarding needed) or to an AlternativeContextInfo
			// AlternativeContextInfo is an object containing the following properties:
			// - context: The context that should be navigated to
			// - iDisplayMode: the display mode to be used as described in function init of sap.suite.ui.generic.template.ObjectPage.Component
			function getAlternativeContextPromise(sPath) {
				var oContextData = mPath2ContextData[sPath];
				if (!oContextData) { // nothing known about this context -> no forwarding needed
					return Promise.resolve();
				}
				return new Promise(function (fnResolve) {
					var oAlternativeContextInfo = null; // the object that will be resolved to -> current assumption: no forwarding needed
					var fnResolveToAlternativeContext = function () { // execute the resolution
						fnResolve(oAlternativeContextInfo);
					};
					var fnHandleEditingPromise = function (oEditingPromise) { // function to be called when there is an EditingPromise for the object to be displayed
						oEditingPromise.then(function (oEditingInfo) { // oEditingInfo contains the context for the draft that currently replaces the object
							// There are two scenarios in which we would not replace the active version by the editing version:
							// 1. Currently we have the following problem: A delete operation on the draft does not delete the whole object, but only the draft.
							//    However, in this case draftRemovalStarted is not called, but only fnAdaptAfterObjectDeleted.
							//    This function does NOT remove the EditingPromise from the active version. Thus, although the EditingPromise is present
							//    it still might be correct to show the active object.
							//    Therefore, we check for the corresponsing entry of the draft. If this entry exists, but no context is available anymore
							//    the draft has meanwhile been deleted -> do not (try to) navigate to the draft
							// 2. The draft of the active version is created in the same session and the user is now navigating to active. "bReplaceByActive" is checked to redirect to draft if required.
							var sEditingPath = oEditingInfo.context.getPath();
							var oEditingContextData = mPath2ContextData[sEditingPath];
							if (oEditingContextData && oEditingContextData.oContext && !oEditingContextData.bReplaceByActive) {
								oAlternativeContextInfo = {
									context: oEditingInfo.context,
									iDisplayMode: 2
								};
							}
							fnResolveToAlternativeContext();
						}, fnResolveToAlternativeContext);
					};

					if (oContextData.oRemovalPromise) { // sPath describes a draft for which an activation/cancellation has been started
						oContextData.oRemovalPromise.then(function (oResponse) { // activation was successfull
							oAlternativeContextInfo = { // forward to active entity
								context: oResponse.context,
								iDisplayMode: 1
							};
							var sDisplayPath = oResponse.context.getPath();
							var oDisplayData = mPath2ContextData[sDisplayPath];
							var oEditingPromise = oDisplayData && oDisplayData.oEditingPromise;
							if (oEditingPromise) { // active entity might already be in (another) draft
								fnHandleEditingPromise(oEditingPromise);
							} else {
								fnResolveToAlternativeContext();
							}
						}, fnResolveToAlternativeContext);
					} else if (oContextData.bReplaceByActive) { // sPath describes a draft and needs to be redirected to active version.
						getDraftSiblingPromise(oContextData.oContext).then(function (oActiveContext) {
							oAlternativeContextInfo = { // forward to active entity
								context: oActiveContext,
								iDisplayMode: 1
							};
							fnResolveToAlternativeContext();
						});
					} else if (oContextData.oContextInfo && !oContextData.oContextInfo.bIsDraft && oContextData.oContextInfo.bOwnDraftExists) { // sPath describes an active object for which a draft is being created (and not surpressed)
						if (oContextData.oEditingPromise) {
							// If draft is created in the same session.
							fnHandleEditingPromise(oContextData.oEditingPromise);
						} else {
							getDraftSiblingPromise(oContextData.oContext).then(function (oDraftContext) {
								var sDraftPath = oDraftContext.getPath();
								var oEditingContextData = mPath2ContextData[sDraftPath];
								if (oEditingContextData && oEditingContextData.oContext && !oEditingContextData.bReplaceByActive) {
									oAlternativeContextInfo = {
										context: oDraftContext,
										iDisplayMode: 2
									};
								}
								fnResolveToAlternativeContext();
							});
						}
					} else {
						fnResolveToAlternativeContext();
					}
				});
			}

			// sPath1 is the old one, sPath2 should be the current one
			function areTwoKnownPathesIdentical(sPath1, sPath2, bIsRoot) {
				return new Promise(function (fnResolve, fnReject) {
					if (sPath1 === sPath2) {
						fnResolve(true);
						return;
					}
					if (!sPath1 || !sPath2) {
						fnResolve(false);
						return;
					}
					var oContextData1 = mPath2ContextData[sPath1];
					if (!oContextData1 || !oContextData1.oContextInfo.bIsDraftSupported) {
						fnResolve(false);
						return;
					}
					var oContextData2 = mPath2ContextData[sPath2];
					if (!oContextData2 || !oContextData2.oContextInfo) {
						fnResolve(false);
						return;
					}
					// If both are active they cannot represent the same object
					if (!oContextData1.oContextInfo.bIsDraft && !oContextData2.oContextInfo.bIsDraft) {
						fnResolve(false);
						return;
					}
					// If both are create they cannot be the same object
					if (oContextData1.oContextInfo.bIsCreate && oContextData2.oContextInfo.bIsCreate) {
						fnResolve(false);
						return;
					}
					if (bIsRoot) {
						getAlternativeContextPromise(sPath1).then(function (oAlternativeContextInfo) {
							fnResolve(!!oAlternativeContextInfo && oAlternativeContextInfo.context.getPath() === sPath2);
						}, fnReject);
						return;
					}
					if (oContextData1.aSemanticKeysValues) {
						var bIsEqual = !!oContextData2.aSemanticKeysValues;
						for (var i = 0; bIsEqual && i < oContextData1.aSemanticKeysValues.length; i++) {
							bIsEqual = oContextData1.aSemanticKeysValues[i] === oContextData2.aSemanticKeysValues[i];
						}
						fnResolve(bIsEqual);
						return;
					}
					fnResolve(false);
				});
			}

			//method to provide IsDraftModified info for a given draft
			function getIsDraftModified(sPath) {
				return mPath2ContextData[sPath].oContextInfo.bIsDraftModified;
			}

			/* End of retrieval methods */

			// method which update existing map's IsDraftModified Information when draft changed
			function markDraftAsModified(sPath) {
				if (mPath2ContextData[sPath]) {
					mPath2ContextData[sPath].oContextInfo.bIsDraftModified = true;
				}
			}

			return {
				registerContext: registerContext,
				adaptAfterObjectDeleted: fnAdaptAfterObjectDeleted,
				activationStarted: activationStarted,
				cancellationStarted: cancellationStarted,
				editingStarted: editingStarted,
				getDraftSiblingPromise: getDraftSiblingPromise,
				getSiblingPromise: getSiblingPromise,
				getAlternativeContextPromise: getAlternativeContextPromise,
				getPathOfLastShownDraftRoot: getPathOfLastShownDraftRoot,
				areTwoKnownPathesIdentical: areTwoKnownPathesIdentical,
				markDraftAsModified: markDraftAsModified,
				getIsDraftModified: getIsDraftModified
			};
		}

		return BaseObject.extend("sap.suite.ui.generic.template.lib.ContextBookkeeping", {
			constructor: function (oAppComponent) {
				extend(this, getMethods(oAppComponent));
			}
		});
	});
