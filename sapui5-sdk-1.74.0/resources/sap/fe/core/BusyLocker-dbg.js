/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(["sap/base/Log"], function(Log) {
	"use strict";

	var _iTimeoutInSeconds = 50,
		_mLockCounters = {},
		_oReferenceDummy = {
			getId: function() {
				return "BusyLocker.ReferenceDummy";
			},
			setBusy: function(bBusy) {
				Log.info("setBusy(" + bBusy + ") triggered on dummy reference");
			}
		};

	function getLockCountEntry(oReference, sPath) {
		if (!oReference || !oReference.getId) {
			Log.warning("No reference for BusyLocker, using dummy reference");
			oReference = _oReferenceDummy;
		}

		var sPath = sPath || "/busy",
			sId = oReference.getId() + sPath;

		if (!(sId in _mLockCounters)) {
			_mLockCounters[sId] = {
				id: sId,
				path: sPath,
				reference: oReference,
				count: 0
			};
		}
		return _mLockCounters[sId];
	}

	function deleteLockCountEntry(mLockCountEntry) {
		delete _mLockCounters[mLockCountEntry.id];
	}

	function applyLockState(mLockCountEntry) {
		var bIsModel = mLockCountEntry.reference.isA && mLockCountEntry.reference.isA("sap.ui.model.Model"),
			bBusy = mLockCountEntry.count !== 0;

		if (bIsModel) {
			mLockCountEntry.reference.setProperty(mLockCountEntry.path, bBusy);
		} else {
			mLockCountEntry.reference.setBusy(bBusy);
		}

		clearTimeout(mLockCountEntry.timeout);
		if (bBusy) {
			mLockCountEntry.timeout = setTimeout(function() {
				Log.error(
					"busy lock for " +
						mLockCountEntry.id +
						" with value " +
						mLockCountEntry.count +
						" timed out after " +
						_iTimeoutInSeconds +
						" seconds!"
				);
			}, _iTimeoutInSeconds * 1000);
		} else {
			deleteLockCountEntry(mLockCountEntry);
		}

		return bBusy;
	}

	function changeLockCount(mLockCountEntry, iDelta) {
		if (iDelta === 0) {
			mLockCountEntry.count = 0;
			Log.info("busy lock count '" + mLockCountEntry.id + "' was reset to 0");
		} else {
			mLockCountEntry.count += iDelta;
			Log.info("busy lock count '" + mLockCountEntry.id + "' is " + mLockCountEntry.count);
		}
	}

	return {
		lock: function(oModelOrControl, sPath) {
			return this._updateLock(oModelOrControl, sPath, 1);
		},

		unlock: function(oModelOrControl, sPath) {
			return this._updateLock(oModelOrControl, sPath, -1);
		},

		_updateLock: function(oReference, sPath, iDelta) {
			var mLockCountEntry = getLockCountEntry(oReference, sPath);
			changeLockCount(mLockCountEntry, iDelta);
			return applyLockState(mLockCountEntry);
		}
	};
});
