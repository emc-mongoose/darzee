# Darzee's server

# Contents 

1. [Purpose](#1-purpose)<br/>
2. [REST API](#2-rest-api)<br>

# 1. Purpose

Darzee's reverse proxy server was created to both serve web UI and to overcome browser's limitations that occurred while developing. Some of the cases are: </br>
* Serve web interface; </br>
* Change Prometheus configuration; </br>
* Reload Prometheus; </br>

It's described as "Reverse Proxy Server" in the figure below.
![](../../screenshots/architecture_overview.png)

# 2. REST API 

| Method | Type | Arguments' type | Arguments | Description |
| --- | --- | --- | --- | --- |
| `/savefile` | **POST** | `multipart/form-data` | `filename` - name of saving file, </br> `fileContent` - content of saving file |  Saves file on specified path defined in **PROMETHEUS_CONFIGURATION_FOLDER_PATH** within [.env](.env) file. |
| `/reloadprometheus` | **POST** | `application/json` | `ipAddress` - IPv4 address of Prometheus, </br> `port` - Prometheus' exposing port | Reloads Prometheus on specified address. That was done because Prometheus' reload from the web UI is being blocked by browser in a preflight request stage. |
| `/*` | **GET** | `static files` | - | Serves HTML files for the web UI. |
