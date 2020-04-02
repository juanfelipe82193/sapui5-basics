if (!window.sap) {
	window.sap = {};
}

if (!sap.zen) {
	sap.zen = {};
}

sap.zen.request = {};

sap.zen.request.zenSendCommandArrayWoEventWZenPVT = function(parameterArray, bOnlyEmptyDeltaWillReturn, useSDKfunclet) {
	var funcletToUse;
	if(useSDKfunclet){
		funcletToUse = function(nextCommand) {
			if (nextCommand) {
				sap.zen.request.ricSendCommand(nextCommand);
			}
		};
	}else{
		funcletToUse = function(nextCommand) {
			if (nextCommand) {
				sap.zen.request.zenSendCommand(nextCommand);
			}
		};
	}
	
	
	sap.zen.request.que.instance.push({"parameterArray":parameterArray,"bOnlyEmptyDeltaWillReturn":bOnlyEmptyDeltaWillReturn, "funclet": funcletToUse});

	sap.zen.request.que.instance.wanderQue(1);

};

sap.zen.request.getCommandSequence = function(parameterArray){
	var commandSeq;
	var parameterList = sapbi_createParameterList(parameterArray);

	var isSequence = parameterList.exists(sapbi_COMMAND);
	if (!isSequence) {
		commandSeq = new sapbi_CommandSequence();
		commandSeq.addCommand(parameterList);
	} else {
		commandSeq = parameterList;
	}
	return commandSeq;
};

sap.zen.request.zenSendCommand = function(parameterObject) {
	if (sapbi_page.m_hasSendLock) {
		jQuery.sap.log.debug("zenSendCommand m_hasSendLock",parameterObject.parameterArray.join(),"bi_command_utils.js");
		sap.zen.request.que.instance.insertAtStart(parameterObject);
	} else {
		var commandSeq = sap.zen.request.getCommandSequence(parameterObject.parameterArray);

		// TODO should check command sequence to only contain paging commands
		if (sap.zen.request.containsCommand(commandSeq, "navigate_by_scrolling") || sap.zen.request.containsCommand(commandSeq, "after_rendering") || parameterObject.bOnlyEmptyDeltaWillReturn) {
			sap.zen.getLoadingIndicator().disableForNextCall();
		}
		jQuery.sap.log.debug("zenSendCommand",parameterObject.parameterArray.join(),"bi_command_utils.js");
		sapbi_page.sendCommandWoPVTWoServerStateChange(commandSeq);
	}
};

sap.zen.request.ricSendCommand = function(command) {
	if (sapbi_page.m_hasSendLock) {
		jQuery.sap.log.debug("zenSendCommand m_hasSendLock",command,"bi_command_utils.js");
		sap.zen.request.que.instance.insertAtStart(command);
	} else {
		jQuery.sap.log.debug("zenSendCommand",command,"bi_command_utils.js");
		sapbi_page.sendCommandWoPVTWoServerStateChange(command.parameterArray);
	}
};

sap.zen.request.zenSendUpdateCommand = function(parameterArray) {
	sapbi_page.m_useSnippets = true;
	sap.zen.request.zenSendCommandArrayWoEventWZenPVT(parameterArray,false);
};

sap.zen.request.que = function() {
	var aItems = [];
	var insideQue = false;
	this.push = function(itemToBePushed) {
		if(this.paused) {
			return;
		}
		if (aItems && aItems.push) {
			aItems.push(itemToBePushed);
		}
	};

	this.getFirstElement = function() {
		if (aItems.length > 0) {
			var tempVal = aItems[0];
			aItems.shift();
			return tempVal;
		} else {
			return null;
		}
	};

	this.size = function() {
		return aItems.length;
	};
	
	this.reset = function(){
		aItems = [];
		insideQue = false;
	}

	this.insertAtStart = function(itemToBeInserted) {
		if(this.paused) {
			return;
		}
		aItems.unshift(itemToBeInserted);
	};
	var that = this;
	this.wanderQue = function(msToTryAgain) {
		if (this.size() > 0) {

			if (!insideQue) {
				if(this.isSendAllowed()){
					var firstElem = sap.zen.request.que.instance.getFirstElement();
					firstElem.funclet(firstElem);
				}
				if (this.size() !== 0) {
					setTimeout(function() {
						jQuery.sap.log.debug("wanderQue","in setTimeout","bi_command_utils.js");
						insideQue = false;
						that.wanderQue(msToTryAgain);
					}, msToTryAgain);
					insideQue = true;
				}
			}

		}
	};
	
	
	this.isSendAllowed = function(){
		//This can be used by other deployments to prevent command sending in special circumstances.
		//It is currently used by DSH.
		return true;
	};	
	
	this.stopScheduling = function() {
		this.paused = true;
	};
	this.continueScheduling = function() {
		this.paused = false;
	};
};
sap.zen.request.que.instance = new sap.zen.request.que();

sap.zen.request.isPagingCommand = function(command,sCommandTypeValue) {
	var commandType = command.getParameter(sapbi_COMMAND_TYPE);
	if (commandType != null) {
		var commandTypeValue = commandType.getValue();

		if (commandTypeValue != null) {
			return commandTypeValue.toLowerCase() === sCommandTypeValue;
		}
	}
	return false;
};

sap.zen.request.containsCommand = function(parameterList, sCommandTypeValue) {
	if (parameterList.getParameterCount) {
		var cnt = parameterList.getParameterCount(sapbi_COMMAND);
		if (cnt > 0) {
			var indices = parameterList.getIndices(sapbi_COMMAND);
			for (var i = 0; i < cnt; i++) {
				var ix = indices[i];
				var command = parameterList.getParameterByIndex(sapbi_COMMAND, ix);
				if (command) {
					var cl = command.getChildList();

					if (cl != null) {
						if (sap.zen.request.isPagingCommand(cl,sCommandTypeValue)) {
							return true;
						}
					}
				}
			}
		} else {
			if (sap.zen.request.isPagingCommand(parameterList,sCommandTypeValue)) {
				return true;
			}
		}
	}
	return false;
};

// sap.zen.request.zenSendCommandSequenceArrayWoEventWZenPVT = function(parameterArray) {
// if (sapbi_page.m_hasSendLock) {
// setTimeout(function() {
// sap.zen.request.zenSendCommandSequenceArrayWoEventWZenPVT(parameterArray);
// }, 100);
// } else {
// var commandSeq = sapbi_createParameterList(parameterArray);
// sap.zen.request.zenSendCommandArrayWoEventWZenPVT(commandSeq);
// }
// };
