// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview
 * To enable true encapsulation, private functions used by SmartNavigation service are defined here.
 *
 * This allows for their testability without sacrificing design quality.
 */
(function () {
    "use strict";

    var oInstance = null,
        mConstantInterfaces = {
            STATISTIC_COLLECTION_WINDOW_DAYS: 90,
            PERS_CONTAINER_KEY_PREFIX: "ushell.smartnav.",
            ONE_DAY_IN_MILLISECOND: 24 * 60 * 60 * 1000
        },
        oHashCodeCache = Object.create(null, { "": { value: 0 | 0 } });

    sap.ui.define([], function () {
        if (!oInstance) {
            oInstance = Object.create(null, {
                getHashCode:
                    { value: getHashCode, configurable: true },
                getBaseHashPart:
                    { value: getBaseHashPart, configurable: true },
                getHashFromOArgs:
                    { value: getHashFromOArgs, configurable: true },
                getPersContainerKey:
                    { value: getPersContainerKey, configurable: true },
                getNavigationOccurrences:
                    { value: getNavigationOccurrences, configurable: true },
                prepareLinksForSorting:
                    { value: prepareLinksForSorting, configurable: true },
                mapClickCountsIntoLinkItems:
                    { value: mapClickCountsIntoLinkItems, configurable: true },
                recordNavigationOccurrences:
                    { value: recordNavigationOccurrences, configurable: true },
                updateHistoryEntryWithCurrentUsage:
                    { value: updateHistoryEntryWithCurrentUsage, configurable: true },
                isTrackingEnabled:
                    { value: isTrackingEnabled, configurable: true }
            });

            Object.keys(mConstantInterfaces).forEach(function (sName) {
                Object.defineProperty(oInstance, sName, { value: mConstantInterfaces[sName] });
            });
        }

        return oInstance;
    });

    /**
     * Get the trackingEnabled configuration from the Service Config or returns the default
     *
     * @param {object} oConfig the service configuration object
     * @param {object} oUtils the ushell utils {@link sap.ushell.utils}
     * @returns {boolean} whether the tracking is enabeld for this service
     */
    function isTrackingEnabled (oConfig, oUtils) {
        return oUtils.isDefined(oConfig) && oUtils.isDefined(oConfig.config) && oUtils.isDefined(oConfig.config.isTrackingEnabled)
            ? oConfig.config.isTrackingEnabled
            : /* default = */ false;
    }

    /**
     * Calculates a hash code for the given input. The hash code returned is always the same for a
     * set of inputs where their equivalent string representation determined by `"" + vAny` are equal.
     *
     * For object inputs, this method is guaranteed to execute with a meaningful outcome provided
     * that the input passed has an appropriately implemented `toString` method.
     *
     * @param {object|string|number|undefined} vAny Value for which hash code should be calculated.
     * @returns {number} Hash code of the input value.
     */
    function getHashCode (vAny) {
        var sAny = vAny + "";

        return oHashCodeCache[sAny] || (function (iAnyLength) {
            var iHash = 0 | 0;

            while (iAnyLength--) {
                iHash = (iHash << 5) - iHash + (sAny.charCodeAt(iAnyLength) | 0);
                iHash |= 0;
            }

            oHashCodeCache[sAny] = iHash;

            return iHash;
        })(sAny.length);
    }

    /**
     * Extracts the hash part from the given intent.
     *
     * @param {object} oURLParsing The url parsing service.
     * @param {string} sIntent The intent from which the hash part will be extracted.
     * @returns {string} The hash part extracted from the given intent.
     * @private
     */
    function getBaseHashPart (oURLParsing, sIntent) {
        var oTarget = oURLParsing.parseShellHash(sIntent);

        if (oTarget && oTarget.semanticObject && oTarget.action) {
            return oTarget.semanticObject + "-" + oTarget.action;
        }

        throw "Invalid intent `" + sIntent + "`";
    }

    /**
     * Returns a valid hash if needed parts are provided or undefined if not.
     *
     * @param {object} oArgs `oArgs` as in {@link sap.ushell.services.CrossApplicationNavigation#toExternal}
     * @param {object} oURLParsing URL parsing service.
     * @returns {string} The hash if it can be determined.
     * @private
     */
    function getHashFromOArgs (oArgs, oURLParsing) {
        if (!oArgs) {
            return null;
        }

        if (oArgs.shellHash && oURLParsing.parseShellHash(oArgs.shellHash)) {
            return getBaseHashPart(oURLParsing, oArgs.shellHash);
        }

        if (oArgs.semanticObject && oArgs.action) {
            return oArgs.semanticObject + "-" + oArgs.action;
        }

        return null;
    }

    /**
     * Computes a container key for the given shell hash.
     *
     * @param {string} sShellHash A shell hash for which a key should be computed.
     * @returns {string} The computed hash.
     * @private
     */
    function getPersContainerKey (sShellHash) {
        return mConstantInterfaces.PERS_CONTAINER_KEY_PREFIX + getHashCode(sShellHash);
    }

    /**
     * Determines the frequency of navigation between the given origin hash and various destinations.
     *
     * @param {string} sFromCurrentShellHash An origin hash.
     * @param {object} oPersonalizationStore A personalisation service instance.
     * @param {object} oComponent The current application component.
     * @param {object} oURLParsing A url parsing service instance.
     * @returns {Array} List of navigation occurrences originating from the given hash.
     *   Each item contains a destination hash and the frequency of the occurence of navigations between the origin and the destination.
     * @private
     */
    function getNavigationOccurrences (sFromCurrentShellHash, oPersonalizationStore, oComponent/*, oURLParsing*/) {
        var sPersContainerKey = getPersContainerKey(sFromCurrentShellHash);

        return oPersonalizationStore.getContainer(
            sPersContainerKey,
            {
                keyCategory: oPersonalizationStore.constants.keyCategory.FIXED_KEY,
                writeFrequency: oPersonalizationStore.constants.writeFrequency.HIGH,
                clientStorageAllowed: true
            },
            oComponent
        ).then(function (oStore) {
            return oStore.getItemKeys()
                .map(function (sSemanticObject) {
                    var oSemanticObjectHistoryEntry = oStore.getItemValue(sSemanticObject);

                    return Object.keys(oSemanticObjectHistoryEntry.actions)
                        .map(function (sAction) {
                            var oAction = oSemanticObjectHistoryEntry.actions[sAction];
                            return {
                                intent: sSemanticObject + "-" + sAction,
                                clickCount: oAction.dailyFrequency.reduce(
                                    function (aggregate, iPastNthDayUsageCount) {
                                        return aggregate + iPastNthDayUsageCount;
                                    },
                                    0
                                )
                            };
                        });
                })
                .reduce(function (aEveryIntent, aSOSpecificIntentSet) {
                    Array.prototype.push.apply(aEveryIntent, aSOSpecificIntentSet);
                    return aEveryIntent;
                }, []);
        });
    }

    /**
     * The function completely delegates to `mapClickCountsIntoLinkItems`.
     * The essence of its existence is to support fluency in source code readability and thus to psychologically enhance ease of maintenance.
     *
     * This function ultimately mutates individual items in the aLinks list, because `mapClickCountsIntoLinkItems`
     * does mutate the `aLinks` that is passed to it.
     *
     * @param {Array} aLinks List of link items for which a click count should be inserted.
     * @param {Array} aNavigationOccurrences List of known navigation occurrences from which the click count should be deduced.
     * @param {object} oURLParsing The URL parsing service.
     * @returns {Array} The originally passed list of links.
     * @private
     */
    function prepareLinksForSorting (aLinks, aNavigationOccurrences, oURLParsing) {
        return mapClickCountsIntoLinkItems(
            aLinks,
            aNavigationOccurrences,
            oURLParsing
        );
    }

    /**
     * This function effectively mutates individual items in the aLinks list, by adding the `clickCount` attribute to the items.
     *
     * @param {Array} aLinks List of link items for which a click count should be inserted.
     * @param {Array} aNavigationOccurrences List of known navigation occurrences from which the click count should be deduced.
     * @param {object} oURLParsing The URL parsing service.
     * @returns {Array} The originally passed list of links.
     * @private
     */
    function mapClickCountsIntoLinkItems (aLinks, aNavigationOccurrences, oURLParsing) {
        var mNavigationOccurrences = Object.create(null);

        aNavigationOccurrences.forEach(function (oNavigationOccurrence) {
            mNavigationOccurrences[oNavigationOccurrence.intent] = oNavigationOccurrence;
        });

        aLinks.forEach(function (oLink) {
            var sBaseHashPart = getBaseHashPart(oURLParsing, oLink.intent),
                oLinkNavigationOccurrence = mNavigationOccurrences[sBaseHashPart];

            oLink.clickCount = oLinkNavigationOccurrence
                ? oLinkNavigationOccurrence.clickCount
                : 0;
        });

        return aLinks;
    }

    /**
     * Record the occurrences of navigation from `sFromCurrentShellHash` to `sToDestinationShellHash` and persists it
     * to a remote storage accessed with `oPersonalizationStore`, in the context of the currently running application.
     *
     * @param {string} sFromCurrentShellHash The origin of navigation.
     * @param {string} sToDestinationShellHash The destination of the navigation.
     * @param {object} oPersonalizationStore An interface to access the remote persistent store where the record should be stored.
     * @param {object} oComponent The currently running application's component.
     * @param {object} oURLParsing The URL parsing service.
     * @returns {Promise|jQuerry.Deferred} A promise to record navigation occurrences.
     * @private
     */
    function recordNavigationOccurrences (sFromCurrentShellHash,
        sToDestinationShellHash, oPersonalizationStore, oComponent, oURLParsing) {

        var oTargetDestination = oURLParsing.parseShellHash(sToDestinationShellHash),
            sPersContainerKey = getPersContainerKey(sFromCurrentShellHash),
            sSemanticObject = oTargetDestination.semanticObject,
            oStore;

        return oPersonalizationStore
            .getContainer(
                sPersContainerKey,
                {
                    keyCategory: oPersonalizationStore.constants.keyCategory.FIXED_KEY,
                    writeFrequency: oPersonalizationStore.constants.writeFrequency.HIGH,
                    clientStorageAllowed: true
                },
                oComponent
            )
            .then(function (oContainer) {
                oStore = oContainer;
                return oStore.getItemValue(sSemanticObject);
            })
            .then(function (oSemanticObjectHistoryEntry) {
                var oActionHistoryEntry,
                    sAction = oTargetDestination.action;

                if (!oSemanticObjectHistoryEntry) {
                    oSemanticObjectHistoryEntry = new SemanticObjectHistoryEntry();
                }

                oActionHistoryEntry = oSemanticObjectHistoryEntry.actions[sAction];
                if (!oActionHistoryEntry) {
                    oActionHistoryEntry = new ActionHistoryEntry();
                    oSemanticObjectHistoryEntry.actions[sAction] = oActionHistoryEntry;
                }

                updateHistoryEntryWithCurrentUsage(oSemanticObjectHistoryEntry);
                updateHistoryEntryWithCurrentUsage(oActionHistoryEntry);

                return oSemanticObjectHistoryEntry;
            })
            .then(function (oUsageHistory) {
                oStore.setItemValue(sSemanticObject, oUsageHistory);

                return oStore.save();
            });
    }

    /**
     * Updates the given history item which may be either an instance derived from either
     * factories `SemanticObjectHistoryEntry` or `SemanticObjectHistoryEntry`.
     *
     * Note that the update is done in place. In other words, the passed `oHistoryEntry` reference will be mutated.
     *
     * @param {ActionHistoryEntry|SemanticObjectHistoryEntry} oHistoryEntry A history entry item to be updated.
     * @returns {ActionHistoryEntry|SemanticObjectHistoryEntry} A reference to the updated history enty item.
     * @private
     */
    function updateHistoryEntryWithCurrentUsage (oHistoryEntry) {
        var iNow = Date.now(),
            iTimePassedSinceLastVisit = iNow - oHistoryEntry.latestVisit,
            iDaysPassedSinceLastVisit = Math.floor(iTimePassedSinceLastVisit / mConstantInterfaces.ONE_DAY_IN_MILLISECOND);

        // Account for dormant days between previous and latest usages.
        while (iDaysPassedSinceLastVisit--) {
            oHistoryEntry.dailyFrequency.unshift(0);

            if (oHistoryEntry.dailyFrequency.length > mConstantInterfaces.STATISTIC_COLLECTION_WINDOW_DAYS) {
                oHistoryEntry.dailyFrequency.pop();
            }
        }

        ++oHistoryEntry.dailyFrequency[0];
        oHistoryEntry.latestVisit = iNow;

        return oHistoryEntry;
    }

    /**
     * Constructs a basic SemanticObjectHistoryEntry model.
     *
     * A SemanticObjectHistoryEntry records the frequency of navigation from a given semantic
     * object to various actions, held in its `actions` collection.
     *
     * It also holds information about the latest time of visiting a particular action and the daily frequency of visits in previous days.
     *
     * The dailyFrequency property list is structured in such a way that the number at index 0 counts the number of visits recorded
     * for the latest day of visit, and at index 1 exists the number of visits one day earlier, an so on and so forth.
     *
     * @returns {object} An instance of an SemanticObjectHistoryEntry.
     * @private
     */
    function SemanticObjectHistoryEntry () {
        return {
            actions: {},
            // This is at least equal to the greatest `latestVisit` of its constituent actions.
            latestVisit: Date.now(),
            // Used like a queue, such that latest record is applied at index 0.
            // The sum of the entries should equal the sum of all constituent actions.
            // i.e. Record of usage 'x' days ago will be at index 'x'.
            dailyFrequency: [0]
        };
    }

    /**
     * Constructs a basic ActionHistoryEntry model.
     *
     * Irrespective of an associated semantic object, an instance of an ActionHistoryEntry holds information about the
     * latest time of visiting a particular action and the daily frequency of visits in previous days.
     *
     * The dailyFrequency property list is structured in such a way that the number at index 0 counts the number of visits recorded
     * for the latest day of visit, and at index 1 exists the number of visits one day earlier, an so on and so forth.
     *
     * @returns {object} An instance of an ActionHistoryEntry.
     * @private
     */
    function ActionHistoryEntry () {
        return {
            latestVisit: Date.now(),
            // Used like a queue, such that latest record is applied at index 0.
            // i.e. Record of usage 'x' days ago will be at index 'x'.
            dailyFrequency: [0]
        };
    }
})();
