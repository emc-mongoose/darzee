$(function () {

    var pstyle = "background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 5px;";

    $("#layout").w2layout({
        name: "layout",
        panels: [
            { type: "left", size: "20%", resizable: true, style: pstyle, content: "left" },
            { type: "main", style: pstyle, content: "main" }
        ]
    });
    
    var d = $("#layout div");
    console.log(d.);
    d.css("height", "100%");
    
    w2ui["layout"].content("main", $().w2tabs({
    	name: "tabs",
    	active: "dashboard",
    	tabs: [
    		{ id: "dashboard", caption: "Dashboard" },
    		{ id: "configuration", caption: "Configuration" },
    		{ id: "scenario", caption: "Scenario" },
    		{ id: "hosts", caption: "Hosts" },
    	],
    	onClick: function (event) {
    		$("#tab-content").html("Tab: " + event.target);
    	}
    }));

});
