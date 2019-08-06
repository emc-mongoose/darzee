[![Issue Tracker](https://img.shields.io/badge/Issue-Tracker-red.svg)](https://mongoose-issues.atlassian.net/projects/GUI)
[![Docker Pulls](https://img.shields.io/docker/pulls/emcmongoose/darzee.svg)](https://hub.docker.com/r/emcmongoose/darzee/)
[![CI status](https://gitlab.com/Andrey_Koltsov/darzee/badges/master/pipeline.svg)](https://gitlab.com/Andrey_Koltsov/darzee/badges/master)

# Darzee
Provides web interface for Mongoose - storage performance testing tool maintained by Dell EMC. 

# Contents 

1. [Overview](#1-overview)<br/>
&nbsp;&nbsp;1.1 [Launch Mongoose run](#11-launch-mongoose-run)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;1.1.1 [Nodes selection](#111-nodes-selection)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;1.1.2 [Configuration](#112-configuration)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;1.1.3 [Scenario](#113-scenario)<br/>
&nbsp;&nbsp;1.2 [Monitoring](#12-monitoring)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;1.2.1 [Mongoose runs table](#121-mongoose-runs-table)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;1.2.2 [Mongoose run statistics](#122-mongoose-run-statistics)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.2.2.1 [Mongoose logs](#1221-mongoose-logs)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.2.2.2 [Mongoose charts](#1222-mongoose-charts)<br/>
&nbsp;&nbsp;1.3 [Terminate Mongoose run](#13-terminate-mongoose-run)<br/>
2. [Configuration](#2-configuration)<br/>
&nbsp;&nbsp;2.1 [Deploying ports](#21-deploying-ports)<br/>
&nbsp;&nbsp;2.2 [Image versions](#22-image-versions)<br/>
&nbsp;&nbsp;2.3 [Container configuration](#23-container-configuration)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;2.3.1 [Prometheus](#231-prometheus)<br/>
&nbsp;&nbsp;2.4 [Other parameters](#24-other-parameters) <br/>
3. [Build and run](#3-build-and-run)<br/>
4. [Deployment](#4-deployment)<br/>
&nbsp;&nbsp;4.1 [Docker](#41-docker)<br/>
&nbsp;&nbsp;4.2 [Kubernetes](#42-kubernetes)<br/>
&nbsp;&nbsp;&nbsp;&nbsp; 4.2.1 [Test Darzee in Kubernetes using predefined Mongoose environment](#421-test-darzee-in-kubernetes-using-predefined-mongoose-environment)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 4.2.1.1 [Mongoose base](#4211-mongoose-base)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 4.2.1.2 [Mongoose Pravega driver](#4212-mongoose-pravega-driver)<br/>
5. [Troubleshooting](#5-troubleshooting)<br/>
&nbsp;&nbsp;5.1 [Prometheus inactivity](#51-prometheus-inactivity)<br/>
&nbsp;&nbsp;5.2 [Missing load step node address](#52-missing-load-step-node-address)<br/>
&nbsp;&nbsp;5.3 [Chart.js error on start up](#53-chartjs-error-on-start-up)<br/>

6. [Open issues](#6-open-issues)<br/>
&nbsp;&nbsp;6.1 [Mongoose run logs unavailability](#61-mongoose-run-logs-unavailability)<br/>


# 1. Overview 

Darzee lets you configure, run and monitor Mongoose runs. 
![](screenshots/architecture_overview.png)


## 1.1 Launch Mongoose run

Mongoose launching process is divided in 3 steps: 
![](screenshots/setup/set_up_overview.png)


### 1.1.1 Nodes selection 

![](screenshots/setup/nodes/nodes-selection.png)
Multiple Mongoose run nodes could be selected. <b>First</b> selected node will be the entry one. <br/>

## 1.1.2 Configuration 

![](screenshots/setup/configuration/configuration.png)

Configuration is presented as an editable JSON tree. <br/>
Initially, the configuration is fetched from the entry node.

## 1.1.3 Scenario 
Mongoose's scenarios are written in JavaScript. It's possible to write JavaScript code in the UI using code editor. 
![](screenshots/setup/scenario/scenario_general.png)



## 1.2 Monitoring 

### 1.2.1 Mongoose runs table
Discovered Mongoose's runs are displayed within the runs table. 
![](screenshots/runs-table/run_table_filled.png)

There's 3 possible status of Mongoose runs: 	 
	 
* ![#29a329](https://placehold.it/15/29a329/000000?text=+) <b>Finished</b> - means Mongoose run has finished and its logs are available; <br/>
* ![#ffd633](https://placehold.it/15/ffd633/000000?text=+) <b>Running</b> - means Mongoose is still performing the benchmark. Charts will be updated every time Darzee received a new data; <br/>
* ![#a6a6a6](https://placehold.it/15/a6a6a6/000000?text=+) <b>Unavailable</b> - means info about Mongoose run has been found on the server, but the related data is lost or couldn't be loaded. <br/>

You could see Mongoose run status or run details by pressing the status icon. 

![](screenshots/runs-table/run_status_overview.png)


By pressing run status icon, you'll be redirected to run statistics screen. See [Mongoose logs](#1421-mongoose-logs), [Mongoose charts](#1422-mongoose-charts).<br/>

### 1.2.2 Mongoose run statistics

![](screenshots/monitoring/run_statistics_overview.png)
 If the run is still being processed, the data will be updating dynamically based on the Mongoose's exported metrics and generated logs. 


#### 1.2.2.1 Mongoose logs 
![](screenshots/monitoring/logs/logs_overview.png)

#### 1.2.2.2 Mongoose charts

![](screenshots/monitoring/charts/charts_overview.png)

Charts are drawn based on Mongoose's exported metrics. There're 4 types of Mongoose charts available:

* <b>duration</b> - mean duration of Mongoose's performed operations;
* <b>bandwidth</b> - amount of processed bytes per second; 
* <b>throughput</b> - shows rate of successful and failed operations performed by Mongoose. It takes mean values for each metric; 
* <b>latency</b> - shows minimal and maximal latency during Mongoose's run; 

## 1.3 Terminate Mongoose run

Processing Mongoose run could be terminated from the UI. 
![](screenshots/monitoring/termination_instruction.png)


# 2. Configuration 

UI's configuration depends on the parameters listen within [.env](.env) file.

## 2.1 Deploying ports 
The following parameters are being used to specify deploying ports of the services: 
 
* DARZEE_PORT - for Darzee itself; 
* PROMETHEUS_PORT - for Prometheus; 
* MONGOOSE_PORT - for Mongoose; 

## 2.2 Image versions 
The following parameters are being used to specify docker image version of a specific service: 
* DARZEE_VER - Darzee's image version; 
* PROMETHEUS_VER - Prometheus image version; 


## 2.3 Container configuration 

### 2.3.1 Prometheus 
Prometheus configuration is being rewritten in a runtime in order to add targets dynamically. 
To implement this, we're using internal container volume. 
* PROMETHEUS_CONFIGURATION_PATH - full path for Prometheus configuration; 
* PROMETHEUS_CONFIGURATION_FOLDER_PATH - path to Prometheus folder; 

## 2.4 Other parameters 

* MONGOOSE_HOST - specifies host of an initially loaded Mongoose (optional); 

# 3. Build and run 

## 3.1 Build 

### 3.1.1 Build docker image 

Docker image is being builted via Gradle. To build Docker image, use: 
``` 
$ ./gradlew buildImage
```

### 3.1.2 Build project 
Darzee has been created with Angular 7.0. You could build it just like any Angular app. 
```
$ npm install
$ ng build 
```

## 3.2 Run 

### 3.2.1 Run via docker
Darzee is deploying via docker image. The image contains front-end files, nodeJS server to serving the app and Prometheus.
In order to have the access from outside, NodeJS server should be mapped to port 8080 and Prometheus should be mapped to port 9090:
``` 
$ docker run --env-file .env -p 8080:8080 -p 9090:9090 emcmongoose/darzee
```
Note that you should use project's [.env](.env) file.

### 3.2.2 Run in development mode 
Darzee has been created with Angular CLI. It could be ran in development mode using the appropriate command: 
```
$ npm install
$ ng serve 
```

# 4. Deployment 

## 4.1 Docker

Darzee image is being loaded into the [docker hub](https://hub.docker.com/r/emcmongoose/darzee).

```
bash
docker run \
    --env-file .env \
    -p {DARZEE_PORT}:{DARZEE_PORT} \
    -p {PROMETHEUS_PORT}:{PROMETHEUS_PORT} \
    emcmongoose/darzee[-<VERSION>] 
```
Note that you should use project's [.env](.env) file.

## 4.2 Kubernetes

Darzee can be deployed in a [kubernetes](https://kubernetes.io/) cluster. Examples of kubernetes object discription files are in the directory `/console/kubernetes`. <br/>
In order to connect with the outside network, Darzee uses Kubernetes service `/console/kubernetes/darzee-service.yml`

Run Darzee as a deployment: <br/>
```
$ bash kubectl apply -f /console/kubernetes/darzee-deployment.yml
$ bash kubectl apply -f /console/kubernetes/darzee-service.yml
```
### 4.2.1 Test Darzee in Kubernetes using predefined Mongoose environment

The project contains scripts for deploying predefined Mongoose environment in order to run the UI. <br/>
Mongoose's environments are described via Kubernetes deplyoments. Note that there's 2 type of ports for Mongoose: 
* <b>Remote API port</b>. You should specify remote API port when adding it into [nodes list](#111-nodes-selection).
* <b>RMI port</b> (Remote Method Invocation port). You should specify RMI port when adding additional Mongoose nodes in order to run it in distributed mode.
RMI ports should be specified in [configuration](#112-configuration) (load-step-node-addrs).

#### 4.2.1.1 Mongoose base 
```
$ bash cd /console/src/assets/configuration-examples/kubernetes/mongoose-base/tools
$ bash chmod +x  create-mongoose-environment.sh
$ bash ./create-mongoose-environment.sh 
```
This will deploy 2 pods, each of them will contain 5 Mongoose instances. <b>Remote API ports are 9991...9994, 9999, RMI ports are 1091...1094, 1099</b>.
Every one of them are connected to the web outside of k8s cluster via the service. 
You can get service's external IP via 
```
$ bash kubectl get svc mongoose-base-svc
$ bash kubectl get svc mongoose-base-svc-2
```
Combining external IP with Mongoose ports, you'll get an access to it from the network outside of cluster.

In order to delete the environment, use: 
```
$ bash cd /console/src/assets/configuration-examples/kubernetes/mongoose-base/tools
$ bash chmod +x  delete-mongoose-environment.sh
$ bash ./delete-mongoose-environment.sh 
```

#### 4.2.1.2 Mongoose Pravega driver
```
$ bash cd /console/src/assets/configuration-examples/kubernetes/mongoose-pravega/tools
$ bash chmod +x  create-mongoose-pravega-environment.sh
$ bash ./create-mongoose-pravega-environment.sh 
```
This will create a deployment and a service. 
The deployment will contain instance of Mongoose Pravega driver, the service will connect it to the network outside of cluster via <b>remote API port 9999</b>. <br/>
Note that in [kubernetes object description for Mongoose pravega driver](/console/src/assets/configuration-examples/kubernetes/mongoose-pravega/mongoose-pravega-service.yml), you should 
specify a running Pravega controller IP (<b><PRAVEGA_CONTROLLER_IP></b>), otherwise it won't work.
```
args: [--run-node, --storage-namespace=mongoose-pravega-scope, --run-port=9999, --load-step-node-port=1099, 
          --storage-net-node-addrs=<PRAVEGA_CONTROLLER_IP>, --load-batch-size=100, --storage-driver-limit-queue-input=10000]
```

You can get service's external IP via 
```
$ bash kubectl get svc mongoose-pravega-svc
```

In order to delete the environment, use: 
```
$ bash cd /console/src/assets/configuration-examples/kubernetes/mongoose-pravega/tools
$ bash chmod +x  delete-mongoose-pravega-environment.sh
$ bash ./delete-mongoose-pravega-environment.sh 
```

# 5. Troubleshooting 

## 5.1 Prometheus inactivity

If Darzee's container Prometheus is not active, it's possible to use a custom one with some limitations. <br/>
It's recommended to restart the image in case of Prometheus inactivity thought.
![](screenshots/troubleshooting/prometheus-inactivity.png)

## 5.2 Missing load step node address

In case data for the load step is fetched from the Prometheus, but its IP address hasn't been found, it's possible to write it from the UI.
![](screenshots/troubleshooting/mongoose-node-inactivity.png)

## 5.3 Chart.js error on start up
<b>NOTE: Actual for 06.08.2019</b> </br>

With Angular builder version change, some errors are popping up. We've experienced issues with the [charts library we're using](https://github.com/valor-software/ng2-charts): after building Darzee docker image from Gitlab CI, the UI hasn't been starting up because of invalid linking of the charts library with the UI via Webpack. Althought, it has been working correctly with manual build. </br>
Different Angular CLI and Angular versions is the reason why the issue took a place. </br>

<b>Related issues: </b> 
* [ERROR Error: Uncaught (in promise): TypeError: Object(...) is not a function #1117](https://github.com/valor-software/ng2-charts/issues/1117) - same issue; </br>
* ["export 'ɵɵinject' was not found in '@angular/core' since v8.0.0-beta.12](https://github.com/angular/angular/issues/30413) - explains why some libraries are breaking because of different Angular versions usage; </br>



# 6. Open issues 
We're constantly working on making the UI and Mongoose project overall better. 
In this section, you'd find a list of a high-priority issues that would be fixed as soon as possible.

## 6.1 Mongoose run logs unavailability 
Mongoose run's table is constructed based on the retrieved data from Prometheus: run ID, additional nodes, load step ID, etc. The list doesn't contain entry node address. <br/>
<b>Now</b>: Mongoose run's entry nodes addresses are stored within browser's local storage. It helps to retain the information about entry nodes as long as the local storage not getting cleaned up, yet it'd be saved even if the browser and/or tab has been closed.<br/>
We need entry node's address in order to get logs via POST request with Mongoose Logs API to its entry node. <br/>
<b>Problem</b>: while working outside of the browser from which Mongoose run has been launched (other browser, other computer, etc.), the data about run's entry node is missing, thus logs couldn't be gathered via the Logs API.<br/>
<b>Temporary solution</b>: see [Missing load step node address](#52-missing-load-step-node-address).

Track progress on the issue [here](https://mongoose-issues.atlassian.net/projects/GUI/issues/GUI-137?filter=allissues).


