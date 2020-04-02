jQuery.sap.declare("sap.rules.ui.parser.ruleBody.lib.ruleBody");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.parsingBackendMediator");jQuery.sap.require("sap.rules.ui.parser.ruleBody.lib.constants");jQuery.sap.require("sap.rules.ui.parser.infrastructure.errorHandling.hrfException");jQuery.sap.require("sap.rules.ui.parser.infrastructure.messageHandling.lib.responseCollector");jQuery.sap.require("sap.rules.ui.parser.infrastructure.util.utilsBase");jQuery.sap.require("sap.rules.ui.parser.ruleBody.lib.decisionTableCell");sap.rules.ui.parser.ruleBody.lib.ruleBody=sap.rules.ui.parser.ruleBody.lib.ruleBody||{};sap.rules.ui.parser.ruleBody.lib.ruleBody.lib=(function(){var p=new sap.rules.ui.parser.businessLanguage.lib.parsingBackendMediator.lib.parsingBackendMediatorLib();var r=sap.rules.ui.parser.ruleBody.lib.constants.lib;var h=sap.rules.ui.parser.infrastructure.errorHandling.hrfException.lib;var R=sap.rules.ui.parser.infrastructure.messageHandling.lib.responseCollector.lib.ResponseCollector;var u=sap.rules.ui.parser.infrastructure.util.utilsBase.lib;var a=new u.utilsBaseLib();var d=sap.rules.ui.parser.ruleBody.lib.decisionTableCell.lib;var e=function(c){if(c===null||c===undefined||c===""){return true;}return false;};function b(){this.ruleType="";this.ruleBodyCopy=null;this.needDeserializeInput=false;this.serializedHeaders=[];}b.prototype.initTraversalParts=function initTraversalParts(t){this.traversalParts={};if(t!==undefined&&t!==null){this.traversalParts[r.traversalEnum.condition]=(t.hasOwnProperty(r.traversalEnum.condition)?t[r.traversalEnum.condition]:true);this.traversalParts[r.traversalEnum.outputParams]=(t.hasOwnProperty(r.traversalEnum.outputParams)?t[r.traversalEnum.outputParams]:true);this.traversalParts[r.traversalEnum.actionParams]=(t.hasOwnProperty(r.traversalEnum.actionParams)?t[r.traversalEnum.actionParams]:true);this.traversalParts[r.traversalEnum.actions]=(t.hasOwnProperty(r.traversalEnum.actions)?t[r.traversalEnum.actions]:true);}else{this.traversalParts[r.traversalEnum.condition]=true;this.traversalParts[r.traversalEnum.outputParams]=true;this.traversalParts[r.traversalEnum.actionParams]=true;this.traversalParts[r.traversalEnum.actions]=true;}};b.prototype.traverse=function traverse(c,v,f,t,g){jQuery.sap.log.debug("Traverse rule --> "+JSON.stringify(c));this.initTraversalParts(t);this.vocabulary=v;this.vocaRTServ=f;if(c!==null&&c!==undefined){if(c.hasOwnProperty(r.RULE_BODY_TYPE)){this.ruleType=c.type;this.setHitPolicy(c);this.ruleBodyCopy=JSON.parse(JSON.stringify(c));if(this.ruleType===r.SINGLE_TEXT){this.traverseText(this.ruleBodyCopy,g);}else if(this.ruleType===r.DECISION_TABLE||this.ruleType===r.RULE_SET){this.traverseDecisionTable(this.ruleBodyCopy,g);}}}return this;};b.prototype.traverseText=function traverseText(c,f){var i;var g;if(c.hasOwnProperty(r.RULE_CONTENT)){this.initResult();var j=this.initRowResult(c.content,0);g=a.buildJsonPath(f,r.RULE_CONTENT);if(c.content.hasOwnProperty(r.CONDITION)&&this.traversalParts[r.traversalEnum.condition]===true){g=a.buildJsonPath(g,r.CONDITION);j=this.handleTextCondition(c.content.condition,j,g);}if(c.content.hasOwnProperty(r.RULE_OUTPUTS)&&this.traversalParts[r.traversalEnum.outputParams]===true){this.initTextOutputsResult();var k;for(i=0;i<c.content.outputs.length;i++){g=a.buildJsonPath(f,r.RULE_OUTPUTS,i);k=c.content.outputs[i];if(k.hasOwnProperty(r.RULE_CONTENT)){j=this.handleTextOutputParameter(k,j,g);}}}if(c.content.hasOwnProperty(r.RULE_PARAMETERS)&&this.traversalParts[r.traversalEnum.actionParams]===true){this.initTextParametersResult();var l;for(i=0;i<c.content.parameters.length;i++){g=a.buildJsonPath(f,r.RULE_PARAMETERS,i);l=c.content.parameters[i];if(l.hasOwnProperty(r.RULE_CONTENT)){j=this.handleTextActionParameter(l,j,i,g);}}}if(c.content.hasOwnProperty(r.RULE_ACTIONS)&&this.traversalParts[r.traversalEnum.actionParams]===true){this.initTextActionsResult();var m;for(i=0;i<c.content.actions.length;i++){g=a.buildJsonPath(f,r.RULE_ACTIONS,i);m=c.content.actions[i];j=this.handleTextAction(m,j,g);}}this.addRowResult(j);}else{this.handleEmptyRuleBody();}};b.prototype.traverseDecisionTable=function traverseDecisionTable(c,f){var g,i;var j;var k;var l=null;if(c.hasOwnProperty(r.RULE_CONTENT)&&c.content.hasOwnProperty(r.RULE_ROWS)&&c.content.hasOwnProperty(r.RULE_HEADERS)){j=c.content;this.initResult();k=this.handleHeaders(j);var m,n;for(g=0;g<j.rows.length;g++){m=j.rows[g];if(m.hasOwnProperty(r.RULE_ROW)&&m.hasOwnProperty(r.RULE_ROW_ID)){n=this.initRowResult(j,g);for(i=0;i<m.row.length;i++){if(m.row[i].hasOwnProperty(r.RULE_COL_ID)){l=null;if(k.hasOwnProperty(m.row[i].colID)){l=k[m.row[i].colID];}if(l&&l.hasOwnProperty(r.RULE_CELL_TYPE)){if(l.type===r.CONDITION&&this.traversalParts[r.traversalEnum.condition]===true){n=this.handleDecisionTableCondition(l,m,i,n);}else if(l.type===r.PARAM&&this.traversalParts[r.traversalEnum.actionParams]===true){n=this.handleDecisionTableActionParameter(l,m,i,n);}else if(l.type===r.OUTPUT_PARAM&&this.traversalParts[r.traversalEnum.outputParams]===true){n=this.handleDecisionTableOutputParameter(l,m,i,n);}else if(l.type===r.ACTION_PARAM&&this.traversalParts[r.traversalEnum.actions]===true){n=this.handleDecisionTableAction(l,m,i,n);}}}}this.addRowResult(n);}}this.finalizeResult(c);}else{this.handleEmptyRuleBody();}};b.prototype.handleTextCondition=function handleTextCondition(c,f,g){};b.prototype.initTextOutputsResult=function initTextOutputsResult(){};b.prototype.handleTextOutputParameter=function handleTextOutputParameter(c,f,g){};b.prototype.initTextParametersResult=function initTextParametersResult(){};b.prototype.handleTextActionParameter=function handleTextActionParameter(c,f,i,g){};b.prototype.initTextActionsResult=function initTextActionsResult(){};b.prototype.handleTextAction=function handleTextAction(c,f,g){};b.prototype.handleHeaders=function handleHeaders(c){return[];};b.prototype.handleDecisionTableCondition=function handleDecisionTableCondition(c,f,g,i){if(f.row[g].hasOwnProperty(r.RULE_CONTENT)){if(this.needDeserializeInput){f.row[g][r.RULE_CONTENT]=f.row[g][r.RULE_CONTENT]?d.deserializeExpression(f.row[g][r.RULE_CONTENT]).text:null;}if(c.hasOwnProperty(r.afterConversionParts.fixedOperator)&&c.fixedOperator.operator){f.row[g][r.RULE_CONTENT]=c.fixedOperator.operator+' '+f.row[g][r.RULE_CONTENT];}}};b.prototype.handleDecisionTableActionParameter=function handleDecisionTableActionParameter(c,f,g,i){return i;};b.prototype.handleDecisionTableOutputParameter=function handleDecisionTableOutputParameter(c,f,g,i){if(f.row[g].hasOwnProperty(r.RULE_CONTENT)&&this.needDeserializeInput){f.row[g][r.RULE_CONTENT]=f.row[g][r.RULE_CONTENT]?d.deserializeExpression(f.row[g][r.RULE_CONTENT]).text:null;}};b.prototype.handleDecisionTableAction=function handleDecisionTableAction(c,f,g,i){return i;};b.prototype.traverseDecisionTableHeaders=function traverseDecisionTableHeaders(c,f){var g=0,i=0;var j={};if(c.hasOwnProperty(r.RULE_HEADERS)){i=c.headers.length;for(g=0;g<i;g++){j=c.headers[g];if(this.needDeserializeInput&&!this.serializedHeaders.hasOwnProperty(g)&&!this.serializedHeaders[g]){if(j[r.RULE_DT_EXPRESSION]){j[r.RULE_DT_EXPRESSION]=j[r.RULE_DT_EXPRESSION]?d.deserializeExpression(j[r.RULE_DT_EXPRESSION]).text:null;}if(j.hasOwnProperty(r.afterConversionParts.fixedOperator)){j.fixedOperator.operator=j.fixedOperator.operator?d.deserializeExpression(j.fixedOperator.operator).text:null;}this.serializedHeaders[g]=true;}if(j.hasOwnProperty(r.RULE_COL_ID)){if(f!==null){f(j);}}}}};b.prototype.buildHeadersMap=function buildHeadersMap(c){var f=[];this.traverseDecisionTableHeaders(c,function(g){f[g.colID]=g;});return f;};b.prototype.concatToDecisionTableCondition=function concatToDecisionTableCondition(c,f,o){return d.concatToDecisionTableCondition(c,f,o);};b.prototype.splitDecisionTableCondition=function splitDecisionTableCondition(c,f,o){return d.splitDecisionTableCondition(c,f,o);};b.prototype.initResult=function initResult(){};b.prototype.initRowResult=function initRowResult(c,f){};b.prototype.addRowResult=function addRowResult(c){};b.prototype.finalizeResult=function finalizeResult(c){};b.prototype.handleEmptyRuleBody=function handleEmptyRuleBody(){};b.prototype.getParserAST=function getParserAST(c,f,v,g,i){var j=p.parseInputRT(c,f,this.vocaRTServ,v,g,this.vocabulary,i);jQuery.sap.log.debug("****************************************************************************************************");jQuery.sap.log.debug("expresstion to parser: "+c+" type: "+g+" vocabulary: "+this.vocabulary+" "+f);jQuery.sap.log.debug("*****************************************************************************************************");if(j===undefined||(j===null&&e(c)===false)){R.getInstance().addMessage("error_in_parsing_expression",[c]);throw new h.HrfException("error_in_parsing_expression: "+c,false);}if(f===p.PARSE_MODE){if(j!==null&&j.status==='Error'){throw new h.HrfException('',false);}}jQuery.sap.log.debug(JSON.stringify(j));return j;};b.prototype.setHitPolicy=function setHitPolicy(c){if(c.hasOwnProperty(r.HIT_POLICY_PROPERTY)){this.hitPolicy=c.hitPolicy;}else{this.hitPolicy=r.ALL_MATCH;}};b.prototype.getHitPolicy=function getHitPolicy(){return this.hitPolicy;};return{RuleBody:b};}());
