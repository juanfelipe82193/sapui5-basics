/*global QUnit */
sap.ui.define([
	"sap/gantt/drawer/ShapeCrossRow",
	"sap/gantt/config/Shape",
	"sap/gantt/GanttChart",
	"sap/gantt/shape/Rectangle",
	"sap/gantt/shape/ext/rls/Relationship"
], function (ShapeCrossRow, ShapeConfig, GanttChart) {
	"use strict";
	QUnit.module("Test public method generateRelationshipDataSet.", {
		beforeEach: function () {
			this.oRelationships = [{
				fromDataId: "activity1",
				fromObjectPath: "0000",
				fromShapeId: "ActivityKey",
				id: "rls001",
				relation_type: 1,
				stroke: "#000000",
				style: 0,
				toDataId: "activity3",
				toObjectPath: "0001",
				toShapeId: "ActivityKey",
				tooltip: "Finish-to-Start",
				uid: "|DATA:relationship[rls001]"
			}];
			this.oShapeConfig = [new ShapeConfig({
				key: "rls",
				shapeDataName: "relationship",
				shapeClassName: "sap.gantt.shape.ext.rls.Relationship",
				shapeProperties: {
					category: sap.gantt.shape.ShapeCategory.Relationship,
					isDuration: false,
					lShapeforTypeFS: true,
					showStart: false,
					showEnd: true,
					stroke: "{stroke}",
					strokeWidth: 1,
					type: "{relation_type}",
					fromObjectPath: "{fromObjectPath}",
					toObjectPath: "{toObjectPath}",
					fromDataId: "{fromDataId}",
					toDataId: "{toDataId}",
					fromShapeId: "{fromShapeId}",
					toShapeId: "{toShapeId}",
					title: "{tooltip}"
				}
			}),
			new ShapeConfig({
				key: "activity",
				shapeDataName: "activity",
				shapeClassName: "sap.gantt.shape.Rectangle",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					rx: 0,
					ry: 0,
					isDuration: true,
					yBias: 8,
					strokeWidth: 1,
					fill: "red",
					stroke: "#FFF",
					height: 3
				}
			})
			];
			//ganttChart instance
			this.oGanttChart = new GanttChart({
				shapes: this.oShapeConfig
			});
			//rectangle instance
			this.activity = this.oGanttChart.getShapeInstance("activity");
			//relationship instance
			this.rlsInstance = this.oGanttChart.getShapeInstance("rls");
			this.rlsInstance.dataSet = [{
				objectInfoRef: {
					chartScheme: "ac_main",
					id: "0000",
					uid: "PATH:/data/view/0/root/children/0|SCHEME:ac_main[0]",
					data: {
						id: "0000",
						type: "04",
						uuid: "01_0",
						activity: [{
							id: "activity1",
							name: "activity1",
							startTime: "20140919000000",
							endTime: "20140921000000",
							status: 1,
							type: 1,
							uid: "PATH:/data/view/0/root/children/0|SCHEME:ac_main[0]|DATA:activity[activity1]"
						}]
					}
				},
				shapeData: [
					{
						id: "activity1",
						startTime: "20140919000000",
						endTime: "20140921000000",
						status: 1,
						type: 1,
						uid: "PATH:/data/view/0/root/children/0|SCHEME:ac_main[0]|DATA:activity[activity1]"
					}
				]
			},
			{
				objectInfoRef: {
					chartScheme: "ac_main",
					id: "0001",
					uid: "PATH:/data/view/0/root/children/1|SCHEME:ac_main[0]",
					data: {
						id: "0001",
						type: "TOL",
						uuid: "01_1",
						activity: [{
							id: "activity3",
							name: "activity 3",
							startTime: "20140929000000",
							endTime: "20140931000000",
							status: 2,
							type: 2,
							uid: "PATH:/data/view/0/root/children/1|SCHEME:ac_main[0]|DATA:activity[activity3]"
						}]
					}
				},
				shapeData: [
					{
						id: "activity3",
						startTime: "20140929000000",
						endTime: "20140931000000",
						status: 2,
						type: 2,
						uid: "PATH:/data/view/0/root/children/0/children/1|SCHEME:ac_main[0]|DATA:activity[activity3]"
					}
				]
			}
			];
			//parameter oShapeinstance
			this.oShapeInstance = {
				relationship: this.rlsInstance,
				ActivityKey: this.activity
			};
			//parameter oShapeDataNames
			this.oShapeDataNames = ["activity",
				"activity_overlap",
				"activity_greedy",
				"order", "order_greedy",
				"order_overlap_shortage",
				"bc",
				"ulc",
				"relationship",
				"phase",
				"task",
				"bc_overcapacity"];
			//parameter oNonVisibleShapeData
			this.oNonVisibleShapeData = [{
				chartScheme: "ac_main",
				id: "0002",
				uid: "PATH:0002|SCHEME:ac_main[0]",
				data: {
					id: "0002",
					type: "01",
					uuid: "01_2",
					activity: [{
						id: "activity2",
						name: "activity 2",
						startTime: "20150930000000",
						endTime: "20151005000000",
						status: 2,
						type: 1,
						uid: "PATH:0002|DATA:activity[activity2]"
					},
					{
						id: 5,
						name: "activity 5",
						startTime: "20150929000000",
						endTime: "20150931000000",
						status: 1,
						type: 1,
						uid: "PATH:0002|DATA:activity[5]"
					}]
				}
			},
			{
				chartScheme: "ac_main",
				id: "0000",
				uid: "PATH:/data/view/1/root/children/0|SCHEME:ac_main[0]",
				data: {
					id: "0000",
					startTime: "2014.09.19",
					endTime: "2014.09.21",
					status: 1,
					type: "TOL",
					uuid: "01_0",
					activity: [{
						id: "activity1",
						startTime: "20140919000000",
						endTime: "20140921000000",
						status: 1,
						type: 1,
						uid: "PATH:/data/view/1/root/children/0|SCHEME:ac_main[0]|DATA:activity[activity1]"
					}]
				}
			},
			{
				chartScheme: "ac_main",
				id: "0001",
				uid: "PATH:/data/view/0/root/children/1|SCHEME:ac_main[0]",
				data: {
					id: "0001",
					type: "TOL",
					uuid: "01_1",
					activity: [{
						id: "activity3",
						name: "activity 3",
						startTime: "20140929000000",
						endTime: "20140931000000",
						status: 2,
						type: 2,
						uid: "PATH:/data/view/0/root/children/1|SCHEME:ac_main[0]|DATA:activity[activity3]"
					}]
				}
			}];
			//create an instance of ShapeCrossRow
			this.oShapeCrossRow = new ShapeCrossRow();
			//expected relationship dataSet
			this.oRelationShipDataSet = [{
				fromDataId: "activity1",
				fromObjectPath: "0000",
				fromShapeId: "ActivityKey",
				id: "rls001",
				relation_type: 1,
				stroke: "#000000",
				style: 0,
				toDataId: "activity3",
				toObjectPath: "0001",
				toShapeId: "ActivityKey",
				uid: "|DATA:relationship[rls001]",
				tooltip: "Finish-to-Start",
				fromObject: {
					chartScheme: "ac_main",
					id: "0000",
					uid: "PATH:/data/view/1/root/children/0|SCHEME:ac_main[0]",
					data: {
						id: "0000",
						startTime: "2014.09.19",
						endTime: "2014.09.21",
						status: 1,
						type: "TOL",
						uuid: "01_0",
						activity: [{
							id: "activity1",
							startTime: "20140919000000",
							endTime: "20140921000000",
							status: 1,
							type: 1,
							uid: "PATH:/data/view/1/root/children/0|SCHEME:ac_main[0]|DATA:activity[activity1]"
						}]
					}
				},
				fromShapeRawData: {
					id: "activity1",
					startTime: "20140919000000",
					endTime: "20140921000000",
					status: 1,
					type: 1,
					uid: "PATH:/data/view/1/root/children/0|SCHEME:ac_main[0]|DATA:activity[activity1]"
				},
				toObject: {
					chartScheme: "ac_main",
					id: "0001",
					uid: "PATH:/data/view/0/root/children/1|SCHEME:ac_main[0]",
					data: {
						id: "0001",
						type: "TOL",
						uuid: "01_1",
						activity: [{
							id: "activity3",
							name: "activity 3",
							startTime: "20140929000000",
							endTime: "20140931000000",
							status: 2,
							type: 2,
							uid: "PATH:/data/view/0/root/children/1|SCHEME:ac_main[0]|DATA:activity[activity3]"
						}]
					}
				},
				toShapeRawData: {
					id: "activity3",
					name: "activity 3",
					startTime: "20140929000000",
					endTime: "20140931000000",
					status: 2,
					type: 2,
					uid: "PATH:/data/view/0/root/children/1|SCHEME:ac_main[0]|DATA:activity[activity3]"
				}
			}];
		},

		afterEach: function () {
			this.oShapeCrossRow = undefined;
			this.rlsInstance = undefined;
			this.activity = undefined;
			this.oNonVisibleShapeData = undefined;
			this.oShapeInstance = undefined;
			this.oShapeDataNames = undefined;
			this.oRelationships = undefined;
			this.oRelationShipDataSet = undefined;
			this.oShapeConfig = undefined;
			this.oGanttChart = undefined;
		}
	});

	QUnit.test("Test public generateRelationshipDataSet method.", function (assert) {
		var generatedShapeData = this.oShapeCrossRow.generateRelationshipDataSet(null, this.oShapeInstance, this.oNonVisibleShapeData, this.oShapeDataNames, this.oRelationships)[0].shapeData[0];
		assert.deepEqual(generatedShapeData.fromObject,
			this.oRelationShipDataSet[0].fromObject,
			"The expected fromObject of relationship can be get successfully through method generateRelationshipDataSet.");
		assert.deepEqual(generatedShapeData.fromShapeRawData,
			this.oRelationShipDataSet[0].fromShapeRawData,
			"The expected fromShapeRawData of relationship can be get successfully through method generateRelationshipDataSet.");
		assert.deepEqual(generatedShapeData.toObject,
			this.oRelationShipDataSet[0].toObject,
			"The expected toObject of relationship can be get successfully through method generateRelationshipDataSet.");
		assert.deepEqual(generatedShapeData.toShapeRawData,
			this.oRelationShipDataSet[0].toShapeRawData,
			"The expected toShapeRawData of relationship can be get successfully through method generateRelationshipDataSet.");
	});

});
