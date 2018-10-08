function checkIfURLisReachable(URL, callback) {
    const functionTypeTag = 'function'
    $.ajax({
            url: URL,
            type: 'HEAD',
            timeout: 10000,
            complete: function(xhr) {
                if (typeof callback == functionTypeTag) {
                    callback.apply(this, [xhr.status]);
                }
            }
    });
}