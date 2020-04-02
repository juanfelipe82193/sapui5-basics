/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/Core','sap/ui/core/library','sap/m/library'],function(C,l,a){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.comp",version:"1.74.0",dependencies:["sap.ui.core","sap.m"],designtime:"sap/ui/comp/designtime/library.designtime",types:["sap.ui.comp.smartfield.ControlProposalType","sap.ui.comp.smartfield.ControlContextType","sap.ui.comp.smartfield.ControlType","sap.ui.comp.smartchart.SelectionMode","sap.ui.comp.smartfield.DisplayBehaviour","sap.ui.comp.smartfield.JSONType","sap.ui.comp.smartfield.CriticalityRepresentationType","sap.ui.comp.smartfield.TextInEditModeSource","sap.ui.comp.TextArrangementType","sap.ui.comp.smarttable.TableType","sap.ui.comp.smarttable.ExportType","sap.ui.comp.smartlist.ListType","sap.ui.comp.personalization.AggregationRole","sap.ui.comp.personalization.ResetType","sap.ui.comp.personalization.ChangeType","sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation","sap.ui.comp.smartfilterbar.SelectOptionSign","sap.ui.comp.smartfilterbar.DisplayBehaviour"],interfaces:["sap.ui.comp.smartform.SmartFormLayout"],controls:["sap.ui.comp.filterbar.FilterBar","sap.ui.comp.navpopover.NavigationPopover","sap.ui.comp.navpopover.SmartLink","sap.ui.comp.smartchart.SmartChart","sap.ui.comp.smartfield.SmartField","sap.ui.comp.smartfield.SmartLabel","sap.ui.comp.smartfilterbar.SmartFilterBar","sap.ui.comp.smartform.SmartForm","sap.ui.comp.smartmultiedit.Field","sap.ui.comp.smartmultiedit.Container","sap.ui.comp.smartmicrochart.SmartAreaMicroChart","sap.ui.comp.smartmicrochart.SmartLineMicroChart","sap.ui.comp.smartmicrochart.SmartBulletMicroChart","sap.ui.comp.smartmicrochart.SmartDeltaMicroChart","sap.ui.comp.smartmicrochart.SmartRadialMicroChart","sap.ui.comp.smartmicrochart.SmartStackedBarMicroChart","sap.ui.comp.smartmicrochart.SmartComparisonMicroChart","sap.ui.comp.smartmicrochart.SmartColumnMicroChart","sap.ui.comp.smartmicrochart.SmartHarveyBallMicroChart","sap.ui.comp.smartmicrochart.SmartMicroChart","sap.ui.comp.smarttable.SmartTable","sap.ui.comp.smartlist.SmartList","sap.ui.comp.smartvariants.SmartVariantManagement","sap.ui.comp.smartvariants.SmartVariantManagementUi2","sap.ui.comp.transport.TransportDialog","sap.ui.comp.valuehelpdialog.ValueHelpDialog","sap.ui.comp.variants.EditableVariantItem","sap.ui.comp.variants.VariantManagement"],elements:["sap.ui.comp.filterbar.FilterGroupItem","sap.ui.comp.filterbar.FilterItem","sap.ui.comp.navpopover.LinkData","sap.ui.comp.navpopover.SemanticObjectController","sap.ui.comp.smartfield.Configuration","sap.ui.comp.smartfield.ControlProposal","sap.ui.comp.smartfield.ObjectStatus","sap.ui.comp.smartfilterbar.ControlConfiguration","sap.ui.comp.smartfilterbar.GroupConfiguration","sap.ui.comp.smartfilterbar.SelectOption","sap.ui.comp.smartform.Group","sap.ui.comp.smartform.GroupElement","sap.ui.comp.smartform.Layout","sap.ui.comp.smartvariants.PersonalizableInfo","sap.ui.comp.variants.VariantItem","sap.ui.comp.navpopover.NavigationContainer","sap.ui.comp.smartvariants.SmartVariantManagementAdapter"],extensions:{flChangeHandlers:{"sap.ui.comp.smartform.SmartForm":"sap/ui/comp/smartform/flexibility/SmartForm","sap.ui.comp.smartform.Group":{"hideControl":"default","unhideControl":"default","renameGroup":"sap/ui/comp/smartform/flexibility/changes/RenameGroup","addField":"sap/ui/comp/smartform/flexibility/changes/AddField","addFields":"sap/ui/comp/smartform/flexibility/changes/AddFields","addMultiEditField":"sap/ui/comp/smartmultiedit/flexibility/changes/AddMultiEditFields"},"sap.ui.comp.smartform.GroupElement":{"hideControl":"default","unhideControl":"sap/ui/comp/smartform/flexibility/changes/UnhideControl","renameField":"sap/ui/comp/smartform/flexibility/changes/RenameField"},"sap.ui.comp.navpopover.NavigationContainer":{"addLink":{"changeHandler":"sap/ui/comp/navpopover/flexibility/changes/AddLink","layers":{"USER":true}},"removeLink":{"changeHandler":"sap/ui/comp/navpopover/flexibility/changes/RemoveLink","layers":{"USER":true}}},"sap.ui.comp.smartvariants.SmartVariantManagement":{"addFavorite":{"changeHandler":"sap/ui/comp/smartvariants/flexibility/changes/addFavorite","layers":{"USER":true}},"removeFavorite":{"changeHandler":"sap/ui/comp/smartvariants/flexibility/changes/removeFavorite","layers":{"USER":true}}},"sap.ui.comp.smartfield.SmartField":"sap/ui/comp/smartfield/flexibility/SmartField"},"sap.ui.support":{publicRules:true}}});sap.ui.comp.ANALYTICAL_PARAMETER_PREFIX="$Parameter.";sap.ui.comp.STANDARD_VARIANT_NAME="STANDARD";sap.ui.comp.smartform.inheritCostomDataToFields=function(c){var k=c.getKey();var b={startsWith:{strings:["sap.ui.fl"],compareFunction:function(B){return k.startsWith(B);}},wholeString:{strings:["sap-ui-custom-settings"],compareFunction:function(B){return k==B;}}};var r=true;Object.keys(b).forEach(function(t){if(r&&b[t].strings.some(b[t].compareFunction)){r=false;return true;}});return r;};sap.ui.comp.TextArrangementType={TextFirst:"com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst",TextLast:"com.sap.vocabularies.UI.v1.TextArrangementType/TextLast",TextSeparate:"com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate",TextOnly:"com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"};sap.ui.comp.smartchart.SelectionMode={Multi:"MULTIPLE",Single:"SINGLE",None:"NONE"};sap.ui.comp.smartfield.ControlType={auto:"auto",dropDownList:"dropDownList",input:"input",datePicker:"datePicker",checkBox:"checkBox",selection:"selection"};sap.ui.comp.smartfield.DisplayBehaviour={auto:"auto",descriptionOnly:"descriptionOnly",descriptionAndId:"descriptionAndId",idAndDescription:"idAndDescription",idOnly:"idOnly",TrueFalse:"TrueFalse",OnOff:"OnOff",YesNo:"YesNo"};sap.ui.comp.smartfield.JSONType={String:"String",Date:"Date",Float:"Float",Integer:"Integer",Boolean:"Boolean",DateTime:"DateTime"};sap.ui.comp.smartfield.ControlContextType={None:"",ResponsiveTable:"responsiveTable",Form:"form",Table:"table",SmartFormGrid:"smartFormGrid"};sap.ui.comp.smartfield.ControlProposalType={None:"",ObjectNumber:"ObjectNumber",ObjectIdentifier:"ObjectIdentifier"};sap.ui.comp.smartfield.CriticalityRepresentationType={WithoutIcon:"WithoutIcon",WithIcon:"WithIcon"};sap.ui.comp.smarttable.TableType={Table:"Table",ResponsiveTable:"ResponsiveTable",AnalyticalTable:"AnalyticalTable",TreeTable:"TreeTable"};sap.ui.comp.smarttable.InfoToolbarBehavior={Auto:"Auto",On:"On",Off:"Off"};sap.ui.comp.smartfield.TextInEditModeSource={None:"None",NavigationProperty:"NavigationProperty",ValueList:"ValueList"};sap.ui.comp.smarttable.ExportType={GW:"GW",UI5Client:"UI5Client"};sap.ui.comp.smartlist.ListType={List:"List",Tree:"Tree"};sap.ui.comp.personalization.ResetType={ResetFull:"ResetFull",ResetPartial:"ResetPartial"};sap.ui.comp.personalization.AggregationRole={Dimension:"Dimension",Measure:"Measure",NotDimeasure:"NotDimeasure"};sap.ui.comp.personalization.ChangeType={Unchanged:"Unchanged",ModelChanged:"ModelChanged",TableChanged:"TableChanged"};sap.ui.comp.personalization.TableType={ResponsiveTable:"ResponsiveTable",Table:"Table",AnalyticalTable:"AnalyticalTable",TreeTable:"TreeTable",ChartWrapper:"ChartWrapper",SelectionWrapper:"SelectionWrapper"};sap.ui.comp.personalization.ColumnType={ResponsiveColumn:"ResponsiveColumn",TableColumn:"TableColumn",ColumnWrapper:"ColumnWrapper"};sap.ui.comp.smartfilterbar.FilterType={auto:"auto",single:"single",multiple:"multiple",interval:"interval"};sap.ui.comp.smartfilterbar.ControlType={auto:"auto",input:"input",dropDownList:"dropDownList",date:"date",dateTimePicker:"dateTimePicker"};sap.ui.comp.smartfilterbar.MandatoryType={auto:"auto",mandatory:"mandatory",notMandatory:"notMandatory"};sap.ui.comp.smartfilterbar.DisplayBehaviour={auto:"auto",descriptionOnly:"descriptionOnly",descriptionAndId:"descriptionAndId",idAndDescription:"idAndDescription",idOnly:"idOnly"};sap.ui.comp.smartfilterbar.SelectOptionSign={I:"I",include:"I",E:"E",exclude:"E"};sap.ui.comp.navpopover.ChangeHandlerType={addLink:"addLink",removeLink:"removeLink",moveLink:"moveLink"};sap.ui.comp.smartvariants.ChangeHandlerType={addFavorite:"addFavorite",removeFavorite:"removeFavorite"};sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation={BT:"BT",EQ:"EQ",Contains:"Contains",StartsWith:"StartsWith",EndsWith:"EndsWith",LT:"LT",LE:"LE",GT:"GT",GE:"GE",Initial:"Initial",Empty:"Empty"};return sap.ui.comp;});
