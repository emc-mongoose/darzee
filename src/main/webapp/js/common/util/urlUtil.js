exports.checkIfURLisReachable = function(URL, callback) { 
		const functionTypeTag = 'function'
		$.ajax({
			type: 'PUT',
			url: '/run',
			dataType: 'json',
			contentType: constants.JSON_CONTENT_TYPE,
			data: JSON.stringify(startJson),
			processData: false,
			timeout: 10000,
			complete: function(xhr) { 
				if (typeof callback == functionTypeTag) { 
					callback.apply(this, [xhr.status]);
				}	
			}
		})
}