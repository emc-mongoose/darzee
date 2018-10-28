import {PanelCtrl} from 'app/plugins/sdk';
import moment from 'moment';
import './external/moment-duration-format';
import _ from 'lodash';
import './css/clock-panel.css!';

const panelDefaults = {};

export class SVGCtrl extends PanelCtrl {
  constructor($scope, $injector) {
      super($scope, $injector);
      _.defaultsDeep(this.panel, panelDefaults);
            
      function readTextFile(file)
      {
	  var rawFile = new XMLHttpRequest();
	  var allText = null;
	  rawFile.open("GET", file, false);
	  rawFile.onreadystatechange = function ()
	  {
	      alert(rawFile.status);
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
      
      var jsonContent = {"status":"success","data":{"resultType":"matrix","result":[{"metric":{"__name__":"prometheus_http_response_size_bytes_bucket","handler":"/label/:name/values","instance":"localhost:9090","job":"prometheus","le":"+Inf"},"values":[[1539529920,"1"],[1539530640,"1"],[1539531000,"2"]]},{"metric":{"__name__":"prometheus_http_response_size_bytes_bucket","handler":"/label/:name/values","instance":"localhost:9090","job":"prometheus","le":"100"},"values":[[1539529920,"0"],[1539530640,"0"],[1539531000,"0"]]}]}};
      
      var data = jsonContent['data'];
      var result = data['result'];
      
      var svg = document.createElement("svg");
      
      svg.setAttribute("width", 200);
      svg.setAttribute("height", 200);
      
      function doForEachMetrics(metrics) {
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
      this.svg = svg.outerHTML.toString();
      
  }
    
    onInitEditMode() {
	this.addEditorTab('Options', 'public/plugins/grafana-svg-panel/editor.html', 2);
    }

    onPanelTeardown() {
	this.$timeout.cancel(this.nextTickPromise);
    }
    
}

SVGCtrl.templateUrl = 'module.html';
