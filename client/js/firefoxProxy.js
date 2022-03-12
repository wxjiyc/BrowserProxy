//browser.runtime.sendMessage("workind messages");
var proxySettings = {conf:"DIRECT"};


browser.runtime.sendMessage("proxy INIT");

browser.runtime.onMessage.addListener((message,sender) => {
	
	//browser.runtime.sendMessage(message);
	proxySettings = message;

	if(proxySettings.conf[0].type == 'socks4' || proxySettings.conf[0].type =='socks'){
		proxySettings.conf[0].proxyDNS = true;
	}
});

function FindProxyForURL(url, host) {
	if (proxySettings.itsDirect) {
		return 'DIRECT';	
	}
	var notAlow = '';
	for (var i = 0; i < proxySettings.nop.length; i++) {
		notAlow = proxySettings.nop[i].trim();
		if(notAlow!=''&&notAlow.length>=3){
			notAlow = notAlow.replace('http://', '');
			notAlow = notAlow.replace('https://', '');
			notAlow = notAlow.replace(/\/$/gi, '');
			if(host.indexOf(notAlow)!=-1){
				return 'DIRECT';
			}
		}
	}
	return proxySettings.conf;
	
}