## Using Mongoose Web UI on Mac OS and Windows OS with Docker

* To make Mongoose Web UI work correctly under Mac OS / Windows OS, <b>replace docker-compose.yml and .env file within the root folder</b> to the ones located in this folder.

#### Referring to localhost address from the UI 
* While running on <b>Mac OS</b> or <b>Windows OS</b>, Docker (version <b>18.06.1</b>) doesn't support host networking.
Instead of "localhost", you should type "host.docker.internal" address in order to refer to actual localhost.
* <b>Example</b>: http://localhost:9999 should be replaces to http://host.docker.internal:9999