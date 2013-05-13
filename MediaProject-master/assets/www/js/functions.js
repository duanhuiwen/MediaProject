	$("#loginbutton").click(function() {
		var url = "http://nodejs.spagu.metropolia.fi/socket.io/socket.io.js";
		var script=document.createElement('script');
		script.type='text/javascript';
		script.src=url;
		$("body").append(script);

		window.plugins.childBrowser.showWebPage("http://spagu.metropolia.fi/jg/", { showLocationBar: false });
		window.plugins.childBrowser.onLocationChange = logIn;
		//window.plugins.childBrowser.onClose = closed;
	});