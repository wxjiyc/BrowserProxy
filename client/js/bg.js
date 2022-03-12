//console.log('hi');
var firstFire = true;
console.log("firstFire:",firstFire);

function handleMessage(request, sender, sendResponse) {
  	if (sender.url === browser.extension.getURL("settings.htm")) {

		if(request.askingForFire){
			sendResponse({"firstF":firstFire});
			firstFire = false;
		}

	}

}
browser.runtime.onMessage.addListener(handleMessage);