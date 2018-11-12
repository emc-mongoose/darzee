import requests
import json
from http.server import BaseHTTPRequestHandler, HTTPServer

class HttpProcessor(BaseHTTPRequestHandler):

    def getGraphJSON(self, url):
        apiKey = open("key.txt").read().strip()
        authHeader = {"Authorization" : "Bearer " + apiKey}
        response = requests.get(url, headers=authHeader)
        return json.loads(response.text)

    def getSVGFromJSON(self, jsonData):

        jsonData = jsonData['data']
        jsonData = jsonData['result']

        svgString = '<svg>\n<polyline points="'
        for metrics in jsonData:
            values = metrics['values']
            startTime = values[0][0]

            x = []
            y = []
            for value in values:
                # TODO: adjusting values to fit graph size
                x.append(value[0] - startTime)
                y.append(int(float(value[1]) * 1000))

            pts = ""
            for i in range (len(x)):
                pts += str(x[i]) + ","
                pts += str(y[i]) + " "

        svgString += pts
        svgString += '" style="fill:none;stroke:black;stroke-width:3"/>\n</svg>'

        return svgString


    def do_GET(self):
        self.send_response(200)
        self.send_header('content-type','text/html')
        self.end_headers()
        url = open('url.txt').read().strip()
        jsonResponse = self.getGraphJSON(url)
        self.wfile.write(bytes(self.getSVGFromJSON(jsonResponse), 'utf-8'))


serv = HTTPServer(("localhost", 80), HttpProcessor)
serv.serve_forever()
