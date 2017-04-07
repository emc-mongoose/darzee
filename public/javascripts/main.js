var config = {
    tabs: {
        name: "tabs-area",
        active: "dashboard",
        right: "<button id=\"submit-run\" class=\"w2ui-btn\">Submit Run</button>",
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
    }
}

$(function () {
    $("#tabs-area").w2tabs(config.tabs);
    $("#dashboard").show();
    $("#tabs_tabs-area_tab_logo").children("div").attr({
        "class": "logo",
        "onmouseover": "",
        "onmouseout": "",
        "onclick": ""
    });
});
