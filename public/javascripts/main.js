var pstyle = "border: 1px solid #dfdfdf; padding: 5px;"
var config = {
    tabs: {
        name: "tabs-area",
        active: "dashboard",
        right: "<button id=\"submit-run\" class=\"w2ui-btn submit-run\">Submit Run</button>",
        tabs: [
            { id: "logo", caption: "Mongoose Web Console" },
            { id: "dashboard", caption: "Dashboard" },
            { id: "configuration", caption: "Configuration" },
            { id: "scenario", caption: "Scenario" },
            { id: "hosts", caption: "Hosts" }
        ],
        onClick: function (event) {
            console.log(event.target);
            if(event.target != "logo" && event.target != "submit") {
                $("#main .tab-content").hide();
                $("#main #" + event.target).show();
            }
        }
    },
    dashboardLayout: {
        name: "dashboard-layout",
        panels: [
            { type: "left", size: 250, style: pstyle, title: "Test Runs" },
            {
                type: "main", style: pstyle, title: "Current Run",
                toolbar: {
                    items: [
                        { type: "button", id: "stop-run", text: "Stop", icon: "w2ui-icon-empty" },
                        { type: "button", id: "delete-run", text: "Delete", icon: "w2ui-icon-cross" },
                        { type: "button", id: "resubmit-run", text: "Resubmit", icon: "w2ui-icon-reload" }
                    ]
                }
            }
        ]
    },
    dashboardCurrentRunLayout: {
        name: "dashboard-current-run-layout",
        panels: [
            { type: "top" },
            { type: "main", title: "Results", style: pstyle },
            { type: "bottom", title: "Output", style: pstyle }
        ]
    },
    dashboardCurrentRunHeaderLayout: {
        name: "dashboard-current-run-header-layout",
        panels: [
            { type: "main", title: "Basic Info", style: pstyle },
            { type: "right", size: "50%", title: "Logs", style: pstyle }
        ]
    }
}

$(function () {

    $("#tabs-area").w2tabs(config.tabs);
    $("#tabs_tabs-area_tab_logo").children("div").attr({
        "class": "logo",
        "onmouseover": "",
        "onmouseout": "",
        "onclick": ""
    });

    $("#dashboard").show();
    $("#dashboard").w2layout(config.dashboardLayout);
    $("div.tab-content").children("div").css("height", "100%");
    $().w2layout(config.dashboardCurrentRunLayout);
    w2ui["dashboard-layout"].content("main", w2ui["dashboard-current-run-layout"]);
    $().w2layout(config.dashboardCurrentRunHeaderLayout);
    w2ui["dashboard-current-run-layout"].content("top", w2ui["dashboard-current-run-header-layout"]);
});
