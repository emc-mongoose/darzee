function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    var allText = null;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}

var jsonContent = readTextFile("data.json");
jsonContent = JSON.parse(jsonContent);
data = jsonContent['data'];
result = data['result'];

function doForEachMetrics(metrics) {
    var svg = document.createElement("svg");
    svgdiv.appendChild(svg);
    var values = metrics['values'];
    var startTime = values[0][0];

    var x = [];
    var y = [];

    function doForEachValuePair(value) {
        x.push(value[0] - startTime);
        y.push(value[1]);
    }

    values.forEach(doForEachValuePair);

    var polyline = document.createElement("polyline");
    svg.appendChild(polyline);

    var pts = "";
    for (var i = 0; i < x.length; ++i) {
        pts += x[i].toString() + ",";
        pts += y[i].toString() + " ";
    }
    polyline.setAttribute("points", pts);

    polyline.setAttribute("style", "fill:none;stroke:black;stroke-width:3");
}

result.forEach(doForEachMetrics);
