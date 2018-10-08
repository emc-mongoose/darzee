function getURLreachabilityStatus(URL, callback) {
    const functionTypeTag = 'function'
    $.ajax({
        url: URL,
        type: 'HEAD',
        timeout: 10000,
        complete: function(xhr) {
            if (typeof callback == functionTypeTag) {
                callback.apply(this, [xhr.status]);
            }
        },
        error: function() { 
        	const misleadingMessage = 'URL is not avaliable: ' + URL;
        	console.log(misleadingMessage);
        }
    });
}