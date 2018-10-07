requirejs.config({

	"paths": {
		// "bootstrap": ["/webjars/bootstrap/4.1.3/js/bootstrap", "js/bootstrap"],
        "bootstrap": ["/webjars/bootstrap/" + depVersion.bootstrap + "/js/bootstrap", "js/bootstrap"],
		"d3js": ["/webjars/d3js/" + depVersion.d3js + "/d3", "d3"],
		"validate-js": ["/webjars/validate.js/" + depVersion.validatejs + "/validate"],
		"jquery": ["/webjars/jquery/" + depVersion.jquery + "/jquery", "jquery"],
		"handlebars": ["/webjars/handlebars/" + depVersion.handlebars + "/handlebars", "handlebars"],
		"pace": ["/webjars/pace/" + depVersion.pace + "/pace", "pace"],
		"text": ["/webjars/requirejs-text/" + depVersion.text + "/text", "text"]
	},

	"shim": {
		"bootstrap": {
			"deps": ["jquery"],
			"exports": "bootstrap"
		},
		"handlebars": {
			"exports": "Handlebars"
		}
	}
});