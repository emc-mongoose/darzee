'use strict';

System.register(['app/plugins/sdk', 'moment', './external/moment-duration-format', 'lodash', './css/clock-panel.css!'], function (_export, _context) {
             "use strict";

             var PanelCtrl, moment, _, _createClass, panelDefaults, SVGCtrl;

             function _classCallCheck(instance, Constructor) {
                          if (!(instance instanceof Constructor)) {
                                       throw new TypeError("Cannot call a class as a function");
                          }
             }

             function _possibleConstructorReturn(self, call) {
                          if (!self) {
                                       throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                          }

                          return call && (typeof call === "object" || typeof call === "function") ? call : self;
             }

             function _inherits(subClass, superClass) {
                          if (typeof superClass !== "function" && superClass !== null) {
                                       throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
                          }

                          subClass.prototype = Object.create(superClass && superClass.prototype, {
                                       constructor: {
                                                    value: subClass,
                                                    enumerable: false,
                                                    writable: true,
                                                    configurable: true
                                       }
                          });
                          if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
             }

             return {
                          setters: [function (_appPluginsSdk) {
                                       PanelCtrl = _appPluginsSdk.PanelCtrl;
                          }, function (_moment) {
                                       moment = _moment.default;
                          }, function (_externalMomentDurationFormat) {}, function (_lodash) {
                                       _ = _lodash.default;
                          }, function (_cssClockPanelCss) {}],
                          execute: function () {
                                       _createClass = function () {
                                                    function defineProperties(target, props) {
                                                                 for (var i = 0; i < props.length; i++) {
                                                                              var descriptor = props[i];
                                                                              descriptor.enumerable = descriptor.enumerable || false;
                                                                              descriptor.configurable = true;
                                                                              if ("value" in descriptor) descriptor.writable = true;
                                                                              Object.defineProperty(target, descriptor.key, descriptor);
                                                                 }
                                                    }

                                                    return function (Constructor, protoProps, staticProps) {
                                                                 if (protoProps) defineProperties(Constructor.prototype, protoProps);
                                                                 if (staticProps) defineProperties(Constructor, staticProps);
                                                                 return Constructor;
                                                    };
                                       }();

                                       panelDefaults = {};

                                       _export('SVGCtrl', SVGCtrl = function (_PanelCtrl) {
                                                    _inherits(SVGCtrl, _PanelCtrl);

                                                    function SVGCtrl($scope, $injector) {
                                                                 _classCallCheck(this, SVGCtrl);

                                                                 var _this = _possibleConstructorReturn(this, (SVGCtrl.__proto__ || Object.getPrototypeOf(SVGCtrl)).call(this, $scope, $injector));

                                                                 _.defaultsDeep(_this.panel, panelDefaults);

                                                                 function readTextFile(file) {
                                                                              var rawFile = new XMLHttpRequest();
                                                                              var allText = null;
                                                                              rawFile.open("GET", file, false);
                                                                              rawFile.onreadystatechange = function () {
                                                                                           alert(rawFile.status);
                                                                                           if (rawFile.readyState === 4) {
                                                                                                        if (rawFile.status === 200 || rawFile.status == 0) {
                                                                                                                     allText = rawFile.responseText;
                                                                                                        }
                                                                                           }
                                                                              };
                                                                              rawFile.send(null);
                                                                              return allText;
                                                                 }

                                                                 var jsonContent = { "status": "success", "data": { "resultType": "matrix", "result": [{ "metric": { "__name__": "prometheus_http_response_size_bytes_bucket", "handler": "/label/:name/values", "instance": "localhost:9090", "job": "prometheus", "le": "+Inf" }, "values": [[1539529920, "1"], [1539530640, "1"], [1539531000, "2"]] }, { "metric": { "__name__": "prometheus_http_response_size_bytes_bucket", "handler": "/label/:name/values", "instance": "localhost:9090", "job": "prometheus", "le": "100" }, "values": [[1539529920, "0"], [1539530640, "0"], [1539531000, "0"]] }] } };

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
                                                                 _this.svg = svg.outerHTML.toString();

                                                                 return _this;
                                                    }

                                                    _createClass(SVGCtrl, [{
                                                                 key: 'onInitEditMode',
                                                                 value: function onInitEditMode() {
                                                                              this.addEditorTab('Options', 'public/plugins/grafana-svg-panel/editor.html', 2);
                                                                 }
                                                    }, {
                                                                 key: 'onPanelTeardown',
                                                                 value: function onPanelTeardown() {
                                                                              this.$timeout.cancel(this.nextTickPromise);
                                                                 }
                                                    }]);

                                                    return SVGCtrl;
                                       }(PanelCtrl));

                                       _export('SVGCtrl', SVGCtrl);

                                       SVGCtrl.templateUrl = 'module.html';
                          }
             };
});
//# sourceMappingURL=clock_ctrl.js.map
