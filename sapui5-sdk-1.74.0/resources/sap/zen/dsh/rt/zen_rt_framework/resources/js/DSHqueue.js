sap.zen.request.containsCommand = function(){
	return true;
};
sap.zen.request.getCommandSequence = function(){
	return false;
};
sap.zen.request.zenSendCommandArrayWoEventWZenPVT = function() {
	return "";
}
window.buddhaHasSendLock = 0;

sap.zen.request.que.instance.isSendAllowed = function(){
	return window.buddhaHasSendLock === 0;
};

window.putInQueue = function(funcletToExecute){
	var queExecutor = function(elemGiven){
		if(window.buddhaHasSendLock > 0){
			sap.zen.request.que.instance.insertAtStart(elemGiven);
		}else{
			window.buddhaHasSendLock++;
			setTimeout(funcletToExecute,0);
//			funcletToExecute();
		}
	};
	
	sap.zen.request.que.instance.push({"parameterArray":null,"bOnlyEmptyDeltaWillReturn":false, "funclet": queExecutor});

	sap.zen.request.que.instance.wanderQue(1);
};