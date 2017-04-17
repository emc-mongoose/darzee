require(

	[
		"dojo/store/Memory",

		"dijit/layout/ContentPane",
		"dijit/layout/LayoutContainer",
		"dijit/layout/TabContainer",
		"dijit/Fieldset",
		"dijit/Menu",
		"dijit/MenuItem",
		"dijit/form/Button",
		"dijit/Editor",
		"dijit/tree/ObjectStoreModel",
		"dijit/Tree",

		"dojox/editor/plugins/FindReplace",
		"dojox/editor/plugins/Save",
		"dojox/editor/plugins/StatusBar",

		"gridx/Grid",
		"gridx/core/model/cache/Sync",

		"dojo/domReady!"
	],

	function(Memory) {
	
		dashboardCurrentRunInfoData = new Memory(
			{
				data: [
					{ id: 1, name: "Mongoose Version", value: "3.4.5" },
					{ id: 4, name: "Controller Host", value: "host1"},
					{ id: 2, name: "Configuration", value: "link" },
					{ id: 3, name: "Scenario", value: "link" }
				]
			}
		);
	
		dashboardCurrentRunInfoFields = [
			{ id: "name", field: "name", name: "Name", width: "100px" },
			{ id: "value", field: "value", name: "Value" }
		];
	}
);
