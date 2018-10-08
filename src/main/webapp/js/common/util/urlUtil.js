function checkIfURLisReachable(URL, callback, requiredData) { 
		const functionTypeTag = 'function'
		$.ajax({
			type: 'PUT',
			url: '/run',
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			data: requiredData,
			processData: false,
			timeout: 10000,
			complete: function(xhr) { 
				if (typeof callback == functionTypeTag) { 
					callback.apply(this, [xhr.status]);
				}	
			}
		})
}