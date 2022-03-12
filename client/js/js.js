var el = {};
var els = [
	'popUp',
	'displayProxies',
	'popUpContent',
	'popUpFormAddProxy',
	'popUpFormEditProxy',
	'addProxyName',
	'addProxyIP',
	'addProxyPort',
	'addProxyType',
	'editProxyName',
	'editProxyIP',
	'editProxyPort',
	'editProxyType',
	'settingsForm',
	'ristrictedSites',
	'themeSelect',
	'darkIconLink',
	'blueIconLink',
	'lightIconLink',
	'autoHideCheck',
	'importPanel',
	'importArea',
	'importProxyType',
	'ipPanel',
	'ipDisp',
	'countryDisp'
];
for (var i = els.length - 1; i >= 0; i--) {
	el[els[i]] = document.getElementById(els[i]);
}
var isFireFox = false;
function detectBrowser(argument) {
	if (typeof (browser) == 'object') {
		isFireFox = true;
	}
}
detectBrowser();


if (isFireFox) {
	function gotPlatformInfo(info) {
		//console.log(info.os);
		if (info.os == "android") {
			if (!document.body.classList.contains("touchMode")) {
				document.body.classList.add("touchMode");
			}

		}
	}
	var gettingInfo = browser.runtime.getPlatformInfo();
	gettingInfo.then(gotPlatformInfo);
}

function updateStorage() {
	//remove this later
	if (isFireFox) {
		if (localStorage.getItem("proxies") !== null) {
			browser.storage.local.set({
				"savedData":
					JSON.parse(localStorage.getItem("proxies"))
			});
			localStorage.removeItem("proxies");
			console.log('storage updated', localStorage.getItem("proxies"));
		}

	}
}
updateStorage();

var animateTime = 500;
function popUp(action) {
	var itsAnimating = false;
	var aWindowsIsOpen = false;
	var previouseMessageIsClosing = false;
	var previousOpenSection = '';

	this.hideForms = function (func) {
		if (aWindowsIsOpen) {
			el['popUp'].classList.remove('showForm');
			itsAnimating = true;
			setTimeout(function () {
				itsAnimating = false;
				aWindowsIsOpen = false;
				el.popUpContent.style.display = 'none';
				el.settingsForm.style.display = 'none';
				el.popUpFormEditProxy.style.display = 'none';
				el.popUpFormAddProxy.style.display = 'none';
				el.importPanel.style.display = 'none';
				el.ipPanel.style.display = 'none';
				if (typeof (func) == 'function') {
					func();
				}
			}, animateTime);
		} else {
			if (typeof (func) == 'function') {
				func();
			}

		}
	}

	this.showSection = function (section) {
		if (!itsAnimating) {
			this.hideForms(function () {
				previousOpenSection = section;
				section.style.display = 'block';
				el['popUp'].classList.add('showForm');
				aWindowsIsOpen = true;
			});
		} else {
			console.log('let the animation to be finished');
		}
	}
	this.showMessage = function (m, ti) {
		if (!previouseMessageIsClosing) {
			el.popUpContent.innerHTML = m;
			this.showSection(el.popUpContent);
			if (ti) {
				previouseMessageIsClosing = true;
				setTimeout(function (d) {
					d.hideForms(function () { });
					previouseMessageIsClosing = false;
				}, ti, this);
			}
		} else {
			console.log('unable to show message at this time');
		}
	}
	this.showAddForm = function () {
		this.showSection(el['popUpFormAddProxy']);
	}
	this.showEditForm = function () {
		this.showSection(el['popUpFormEditProxy']);
	}
	this.showSettings = function () {
		this.showSection(el['settingsForm']);
	}
}
var pop = new popUp();
function proxy() {
	this.save = function (json) {
		if (isFireFox) {
			browser.storage.local.set({ "savedData": json });
			//console.log('i saved',json);
		}
	}
	this.getProxies = function (f) {
		var out = '';
		if (isFireFox) {
			let gettingItem = browser.storage.local.get('savedData');
			gettingItem.then(function (item) {
				//console.log('order to get data',item);
				//if (item.savedData) {

				//	f(item.savedData);
				//} else {
					var builData = {
						proxyies: [
							{
								id: 0,
								name: 'Direct Access',
								type: 'direct',
								ip: '',
								port: '',
								directLink: true,
								active: true,
								icon: 'fa-tasks'
							}
						],
						settings: {
							noProxylist: '192.168.1.1,localhost',
							theme: 'default',
							extensionIcon: 'light'
						}
					};

					//施工区域

					for (var i = 0; i < list.length; i++) {
						var newNode = {
							id: i + 1,
							name: list[i].nickname,
							type: "socks",
							ip: ip,
							port: list[i].port,
							directLink: false,
							icon: document.querySelector('input[name="addIcons"]:checked').value
						};
						builData.proxyies.push(newNode);
					}
					//施工区域

					this.save(builData);
					f(builData);
				//}

			}.bind(this));
		} else {
			var dummyData = {
				proxyies: [
					{
						id: 0,
						name: 'Direct Access',
						type: 'direct',
						ip: '',
						port: '',
						directLink: true,
						active: true,
						icon: 'fa-tasks'
					},
					{
						id: 1,
						name: 'loolooloo',
						type: 'http',
						ip: '0.0.0.0',
						port: '0',
						directLink: false,
						active: false,
						icon: 'fa-tasks'
					},
					{
						id: 2,
						name: '',
						type: 'http',
						ip: '878.879.988.898',
						port: 2099,
						directLink: false,
						active: false,
						icon: 'fa-tasks'
					},
				],
				settings: {
					noProxylist: '192.168.1.1,localhost',
					theme: 'default',
					extensionIcon: 'light'
				}
			};

			f(dummyData);
		}

	}
	this.getProxyByID = function (id, f) {
		this.getProxies(function (ps) {
			console.log('order to get thi id:', id);
			for (var i = 0; i < ps.proxyies.length; i++) {
				if (Number(ps.proxyies[i].id) == Number(id)) {
					f(ps.proxyies[i]);
					return null;
				}
			}
		});
	}
	this.getTheBiggestID = function (currentPs) {
		var biggstID = 0;
		for (var i = 0; i < currentPs.proxyies.length; i++) {
			if (Number(currentPs.proxyies[i].id) > Number(biggstID)) {
				biggstID = currentPs.proxyies[i].id;
			}
		}
		return Number(biggstID);
	}
	this.showProxies = function () {
		this.getProxies(function (ps) {
			var out = '';
			var name = '';
			var icon = '';
			var clas = '';
			var IDs = [];
			for (var i = 0; i < ps.proxyies.length; i++) {
				IDs[parseInt(ps.proxyies[i].id)] = ps.proxyies[i];
			}
			ps.proxyies = IDs.filter(function (id) {
				return id;
			});
			for (var i = 0; i < ps.proxyies.length; i++) {
				if (ps.proxyies[i].name) {
					name = ps.proxyies[i].name;
				} else {
					name = ps.proxyies[i].ip + ':' +
						ps.proxyies[i].port
						;
				}
				if (ps.proxyies[i].active) {
					clas = ' active';
				} else {
					clas = ' deactive';
				}
				if (!ps.proxyies[i].directLink) {
					if (ps.proxyies[i].icon) {
						icon = '<i class="fa ' + ps.proxyies[i].icon + '"></i>';
					} else {
						icon = '<i class="fa fa-server"></i>';
					}

				} else {
					icon = '<i class="fa fa-power-off"></i>';
				}
				out +=
					'<div draggable="true" class="proxy' +
					clas +
					'" data-proxyid="' +
					ps.proxyies[i].id +
					'" title="' +
					ps.proxyies[i].type + '://' +
					ps.proxyies[i].ip + ':' + ps.proxyies[i].port +
					'" ><div class="proxyName" >' +
					icon +
					name +
					'</div>' +
					'<div  class="proxyLinks" data-proxyid="' +
					ps.proxyies[i].id +
					'">';
				if (!ps.proxyies[i].directLink) {
					out +=
						'<i title="Edit" class="editBut fa fa-pencil"></i>' +
						'<i title="Delete" class="deleteBut fa fa-trash-o"></i>';
				}
				out += '</div></div>';

			}
			displayProxies.innerHTML = out;
		}.bind(this));
	}
	this.getExtensionIcon = function (disconnected, f) {

		this.getProxies(function (o) {
			var activeProxyIcon = {
				path: {
					"200": "icons/p-blue.png"
				}
			};
			var diactiveProxyIcon = {
				path: {
					"200": "icons/p.png"
				}
			};
			if (o.settings.extensionIcon) {
				if (o.settings.extensionIcon == 'blue') {
					activeProxyIcon = {
						path: {
							"200": "icons/p-blue.png"
						}
					};
					diactiveProxyIcon = {
						path: {
							"200": "icons/p-disconnected-blue.png"
						}
					};

				} else if (o.settings.extensionIcon == 'dark') {
					activeProxyIcon = {
						path: {
							"200": "icons/p-blue.png"
						}
					};
					diactiveProxyIcon = {
						path: {
							"200": "icons/p-dark.png"
						}
					};


				}
			}
			if (!disconnected) {
				f(activeProxyIcon);
			} else {
				f(diactiveProxyIcon);
			}
		}.bind(this));
	}
	this.setProxy = function (action, onDone) {
		this.getProxies(function (ps) {
			var o = {};
			var pn = '';
			console.log('set proxy order : ' + action);

			if (action == 'direct') {
				for (var i = 0; i < ps.proxyies.length; i++) {
					if (ps.proxyies[i].directLink) {
						o = ps.proxyies[i];
						ps.proxyies[i].active = true;
						console.log('proxy is disabled now ' + i);
					} else {
						ps.proxyies[i].active = false;
					}
				}
				this.save(ps);
			} else if (action == 'setAgain') {
				for (var i = 0; i < ps.proxyies.length; i++) {
					if (ps.proxyies[i].active) {
						o = ps.proxyies[i];
						console.log('we set again ' + i);
					}
				}
			} else {
				for (var i = 0; i < ps.proxyies.length; i++) {
					if (Number(ps.proxyies[i].id) == Number(action)) {
						ps.proxyies[i].active = true;
						o = ps.proxyies[i];
					} else {
						ps.proxyies[i].active = false;
					}
				}
				this.save(ps);
			}
			this.showProxies();
			var proxySpecification = {
				conf: [
					{
						type: o.type,
						host: o.ip,
						port: o.port,
						proxyDNS: false,
					}
				],
				nop: ps.settings.noProxylist.split(','),
				itsDirect: o.directLink
			};
			if (isFireFox) {
				const proxyScriptURL = "js/firefoxProxy.js";
				/*if(typeof(proxyScriptURL)!=undefined){*/
				browser.proxy.register(proxyScriptURL);
				/*}	*/
				if (proxySpecification.itsDirect) {
					this.getExtensionIcon('disconnected', function (pI) {
						browser.browserAction.setIcon(pI);
						browser.browserAction.setTitle({ title: "Direct Internet Access" });
						if (onDone) {
							onDone();
						}
					});
				} else {
					if (o.name) {
						pn = o.name;
					} else {
						pn = o.type + '://' + o.ip + ':' + o.port;
					}
					this.getExtensionIcon(false, function (pI) {
						browser.browserAction.setIcon(pI);
						browser.browserAction.setTitle({ title: pn + ' Is Active' });
						if (onDone) {
							onDone();
						}
					});


				}
				//console.log('message sent');
				browser.runtime.sendMessage(proxySpecification, { toProxyScript: true });
				browser.runtime.onMessage.addListener(function (message, sender) {
					if (sender.url === browser.extension.getURL("js/firefoxProxy.js")) {
						console.log("from pmc", message);
					}
				});
				browser.proxy.onProxyError.addListener(function (error) {
					var er = '<p>Proxy error:</p> ' + error.message + ' <p><input type="button" class="cancelBut"  value="OK"></p>';
					pop.showMessage(er, 4000);
					console.log(er);
				});
			} else {
				var notSupported = 'Curently This Extention works on firefox57 only';
				//pop.showMessage(notSupported);
				//console.log(notSupported);
			}

		}.bind(this));
	}
	this.addProxy = function () {
		this.getProxies(function (currentPs) {
			var biggstID = this.getTheBiggestID(currentPs);
			var newObj = {
				name: el.addProxyName.value,
				ip: el.addProxyIP.value,
				port: el.addProxyPort.value,
				type: el.addProxyType.value,
				id: biggstID + 1,
				directLink: false,
				icon: document.querySelector('input[name="addIcons"]:checked').value
			};
			currentPs.proxyies.push(newObj);
			this.save(currentPs);
			pop.showMessage('<p>' + el.addProxyIP.value + ' added</p>', 500);
			this.setProxy(newObj.id);
		}.bind(this));
	}
	this.saveSettings = function () {
		this.getProxies(function (currentPs) {
			currentPs.settings.noProxylist = el.ristrictedSites.value;
			currentPs.settings.theme = el.themeSelect.value;
			currentPs.settings.autoHideCheck = autoHideCheck.checked ? true : false;
			//console.log("saved settings:",currentPs);
			this.save(currentPs);
			pop.showMessage('<h1 style="text-align:center;"> Done!</h1>', 1500);
			this.setProxy('setAgain');
		}.bind(this));
	}
	this.removeProxy = function (id) {
		this.getProxies(function (ps) {
			console.log("delete this" + id);
			var WasActive = false;
			for (var i = 0; i < ps.proxyies.length; i++) {
				if (Number(ps.proxyies[i].id) == Number(id)) {
					if (ps.proxyies[i].active) {
						WasActive = true;
					}
					ps.proxyies.splice(i, 1);
				}
			}
			this.save(ps);
			//pop.showMessage('Done!',1500);
			pop.hideForms();
			if (WasActive) {
				this.setProxy('direct');
			}
			this.showProxies();
		}.bind(this));
	}
	this.editProxyByID = function (id, f) {
		this.getProxies(function (ps) {
			var pIsActive = false;
			for (var i = 0; i < ps.proxyies.length; i++) {
				if (Number(ps.proxyies[i].id) == Number(id)) {
					ps.proxyies[i].name = el.editProxyName.value;
					ps.proxyies[i].type = el.editProxyType.value;
					ps.proxyies[i].port = el.editProxyPort.value;
					ps.proxyies[i].ip = el.editProxyIP.value;
					ps.proxyies[i].icon = document.querySelector('input[name="edditIcons"]:checked').value;
					if (ps.proxyies[i].active) {
						pIsActive = true;
					}
				}
			}
			this.save(ps);
			if (pIsActive) {
				this.setProxy(id);
			}
			if (f) {
				f();
			}
		}.bind(this));
	}
	this.replaceProxyIDs = function (fI, sI) {
		if (fI == sI) {
			return false;
		}
		this.getProxies(function (ps) {

			var firstIDP = '';
			var secondIDP = '';
			console.log('ps to change', fI, sI);
			for (var i = 0; i < ps.proxyies.length; i++) {
				if (Number(ps.proxyies[i].id) == Number(fI)) {
					firstIDP = i;
				}
				if (Number(ps.proxyies[i].id) == Number(sI)) {
					secondIDP = i;
				}
			}
			ps.proxyies[firstIDP].id = sI;
			ps.proxyies[secondIDP].id = fI;
			this.save(ps);
			this.showProxies();
		}.bind(this));
	}
}

var proxyListO = new proxy();
proxyListO.showProxies();

var extractedProxies = [];
function extractProxies() {
	extractedProxies = [];
	setTimeout(function () {
		var pAr = importArea.value.match(/\d+\.\d+\.\d+\.\d+[\s:\t]+\d+/g);
		var out = "";
		if (pAr !== null) {
			for (var i = 0; i < pAr.length; i++) {
				var pr = pAr[i].split(/[\s:\t]+/);
				out += pr[0] + ":" + pr[1] + "\n";
				extractedProxies.push({ ip: pr[0], port: pr[1] });
			}
			out += pAr.length + " Proxies Found :)";
		} else {
			out += "No Proxies Found :|";
		}

		importArea.value = out;

	}, 20);
}

function importProxies() {
	proxyListO.getProxies(function (currentPs) {

		var biggstID = proxyListO.getTheBiggestID(currentPs);

		for (var i = extractedProxies.length - 1; i >= 0; i--) {
			var newObj = {
				name: "",
				ip: extractedProxies[i].ip,
				port: extractedProxies[i].port,
				type: el.importProxyType.value,
				id: biggstID + 1,
				directLink: false,
				icon: "fa-tasks"
			};
			biggstID++;
			currentPs.proxyies.push(newObj);
		}

		proxyListO.save(currentPs);
		proxyListO.showProxies();
		pop.hideForms(function () {
			pop.showMessage('<h1 style="text-align:center;"><b>' +
				extractedProxies.length + "</b> " +
				el.importProxyType.value +
				' Proxies Added</h1>', 2000);

		})

		console.log(currentPs);
	});
}
var xhr = {};
function showIpAddressPanel() {

	function onData(data) {
		var coName = "";
		console.log(data);
		if (data.ip) {
			ipDisp.innerHTML = data.ip;
			coName += '<i class="fa icon-map-marker"></i>' + data.country_name;
			if (data.region_name) {
				coName += '-' + data.region_name;
			}
			countryDisp.innerHTML = coName;
		} else {

		}

	}
	function onError(error) {
		ipDisp.innerHTML = "<span>Retrying..</span>";
		function fAgain() {
			setTimeout(function () {
				fetch();
				console.log(error);
			}, 1000);
		}
		if (error == 'Request Timed Out') {
			countryDisp.innerHTML = 'Request Timed Out';
			fAgain();
		}
		if (error == 'Connection Error') {
			countryDisp.innerHTML = 'Connection Error';
			fAgain();
		}
	}
	function fetch() {
		if (xhr.abort) {
			xhr.abort();
			console.log('p r aborted');
		}
		ipDisp.innerHTML = '<i class="fa sAnimate fa-spinner"></i>Loading..';
		countryDisp.innerHTML = '...';
		xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function (ev) {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					onData(xhr.response);
				} else {
					onError('server error');
				}
			}
		}
		xhr.open("GET", "https://freegeoip.net/json/?" + Math.random());
		xhr.timeout = 5000;
		xhr.responseType = 'json';
		xhr.send();
		xhr.ontimeout = function (ev) {
			onError('Request Timed Out');
		}
		xhr.onerror = function (ev) {
			onError('Connection Error');
		}
	}
	fetch();
}

function setProxyAgain() {
	/*
	//console.log('we sat proxy again');
	if(isFireFox){
		var send = browser.runtime.sendMessage({askingForFire:true});
			send.then(function (m) {
				//console.log(m);
				if (m.firstF) {
					console.log("f fire is true");
			
				}
			});  
	}*/
	proxyListO.setProxy('setAgain');
}
setProxyAgain();

function iconSelectorIconTop(el) {
	el.parentElement.insertBefore(el.parentElement.children[0], el);
	el.parentElement.insertBefore(el, el.parentElement.children[0]);
}
function setExtensionIcon(name) {
	proxyListO.getProxies(function (o) {
		o.settings.extensionIcon = name;
		proxyListO.save(o);
		proxyListO.setProxy('direct');
	});
}
function setEditValues(id) {
	proxyListO.getProxyByID(id, function (p) {
		el.editProxyIP.value = p.ip;
		el.editProxyName.value = p.name;
		el.editProxyPort.value = p.port;
		el.editProxyType.value = p.type;
		if (p.icon) {
			var curI = document.querySelector('input[id="edit-' + p.icon + '"]');
			curI.checked = true;
		} else {
			var curI = document.querySelector('input[id="edit-fa-tasks"]');
			curI.checked = true;
		}
		iconSelectorIconTop(curI.parentElement);
	});
}
function setSettingsValues() {
	proxyListO.getProxies(function (o) {
		el.ristrictedSites.value = o.settings.noProxylist;
		el.themeSelect.value = o.settings.theme;
		el.autoHideCheck.checked = o.settings.autoHideCheck;
	});
}

function findeDragTarget(t) {

	if (t.tagName == 'DIV') {
		//console.log(t);
		switch (true) {
			case t.classList.contains('proxy'):
				return t;
				break;

			case t.parentElement.classList.contains('proxy'):
				return t.parentElement;
				break;

			case t.parentElement.parentElement.classList.contains('proxy'):
				return t.parentElement.parentElement;
				break;
			default:
				return false;
		}
	} else {
		return false;
	}

}
var deletID = '';
var editID = '';
var draggingEl = '';
document.onclick = eventHandler;
document.onpaste = eventHandler;
document.onsubmit = eventHandler;
document.onselectstart = eventHandler;
document.ondragstart = eventHandler;
document.ondrag = eventHandler;
document.ondrop = eventHandler;
document.ondragover = eventHandler;
document.ondragleave = eventHandler;
function eventHandler(ev) {
	if (ev.type == 'click') {


		if (ev.target.id == 'importBut') {
			if (extractedProxies.length > 0) {
				importProxies();
			} else {
				ev.target.value = 'Paste Proxies';
			}

		}
		if (ev.target.id == 'getProxyLink') {
			if (ev.ctrlKey) {
				ev.preventDefault();
				pop.showMessage('Welcome to the hidden area!');
			}
		}
		if (ev.target.id == 'addProxyLink') {
			el.addProxyIP.focus();
			pop.showAddForm();
		}
		if (ev.target.id == 'editProxySave') {
			proxyListO.editProxyByID(editID, function () {
				/* body... */
				proxyListO.showProxies();
				//pop.hideForms();
				pop.showMessage('<h1 style="text-align:center;"> Saved!</h1>', 1500);

			});

		}
		if (ev.target.classList.contains('editBut')) {
			editID = ev.target.parentElement.getAttribute('data-proxyid');
			setEditValues(editID);
			pop.showEditForm();
		}
		if (ev.target.classList.contains('cancelBut')) {
			pop.hideForms();
		}
		if (ev.target.id == 'settingsSaveBut') {
			proxyListO.saveSettings();
		}
		if (ev.target.id == 'confirmDeleteBut') {
			//pop.showMessage('ok<input type="button" id="confirmDeleteBut" value="Delete">',2000);
			proxyListO.removeProxy(deletID);
		}
		if (ev.target.classList.contains('proxyName')) {
			proxyListO.getProxies(function (o) {
				var id = ev.target.parentElement.getAttribute('data-proxyid');
				proxyListO.setProxy(id, function () {
					if (o.settings.autoHideCheck) {
						window.close();
					}
				});

			});
		}
		if (ev.target.classList.contains('deleteBut')) {
			deletID = ev.target.parentElement.getAttribute('data-proxyid');
			proxyListO.getProxyByID(deletID, function (dp) {
				//console.log('dele'+deletID,dp);
				var dpn = '';
				if (dp.name) {
					dpn = dp.name;
				} else {
					dpn = dp.ip + ':' + dp.port;
				}
				pop.showMessage(
					'Are You Sure You Want To Delete ' +
					dpn +
					'?' +
					'<p><input type="button" id="confirmDeleteBut" value="Delete">' +
					'<input type="button" class="cancelBut"  value="Cancel"></p>'
				);
			});
		}
		if (ev.target.id == 'settingsLink') {
			setSettingsValues();
			pop.showSettings();

		}
		if (ev.target.id == 'importinfo') {
			pop.hideForms(function () {
				pop.showMessage(
					'<h1>Import manual</h1>' +
					'Go to one of your favorite proxy provider sites,then copy and paste whole proxies table or the entire page into import section then select the right proxy type and click on import!' +
					"<p style='text-align:center;' ><input type='button'class='cancelBut' value='Ok'></p><br>"

				);
			});
		}
		if (ev.target.id == 'noProxyinfo') {
			pop.hideForms(function () {
				pop.showMessage(
					'<h1>No Proxy Rules</h1><ul class="pRules">' +
					'<li>You must separate each hostname with comma ","</li>' +
					'<li>To disable proxy on www.google.com write: "www.google.com"</li>' +
					'<li>To disable proxy on www.google.com and subdomains write: ".google.com"</li>' +
					'<li>To disable proxy on websites that contain .com in their hostname write: ".com"</li>' +
					'<li>To disable proxy on websites that contain abc in their hostname write: "abc"</li>' +
					'<li>Little Proxy is not supporting Mozilla\'s "no proxy for" specifications so you can\'t use * or other standard rules.</li>' +
					'</ul>' +
					"<p style='text-align:center;' ><input type='button'class='cancelBut' value='Ok'></p><br>"

				);
			});
		}
		if (ev.target.id == 'addProxySave') {
			proxyListO.addProxy();
			proxyListO.showProxies();
		}
		if (ev.target.getAttribute('data-ic')) {
			setExtensionIcon(ev.target.getAttribute('data-ic'));
		}
		if (ev.target.tagName == 'I' && ev.target.parentElement.tagName == 'LABEL') {
			iconSelectorIconTop(ev.target.parentElement.parentElement);
		}
	}
	if (ev.type == 'paste') {
		if (ev.target === el.addProxyIP) {
			setTimeout(function () {
				var val = el.addProxyIP.value;
				if (val.indexOf('http://') != -1 || val.indexOf('https://') != -1) {
					val = val.replace('http://', '');
					val = val.replace('https://', '');
				}
				if (val.indexOf(':') != -1) {
					var hostAndPort = val.split(':');
					el.addProxyIP.value = hostAndPort[0].trim();
					el.addProxyPort.value = hostAndPort[1].trim();
				} else if (val.trim().indexOf('	') != -1 ||
					val.trim().indexOf(' ') != -1 ||
					val.trim().indexOf("\n") != -1
				) {
					var hostAndPort = val.split(/\s+/g);
					if (hostAndPort.length === 2) {
						el.addProxyIP.value = hostAndPort[0].trim();
						el.addProxyPort.value = hostAndPort[1].trim();
					}

				}
			}, 10);

		}
		if (ev.target === el.importArea) {
			extractProxies();
		}
	}
	if (ev.type == 'submit') {
		ev.preventDefault();
	}
	if (ev.type == 'selectstart') {
		ev.preventDefault();
	}
	if (ev.type == 'dragover') {
		ev.preventDefault();
		if (findeDragTarget(ev.target)) {
			findeDragTarget(ev.target).classList.add('dropHere');
		}
	}
	if (ev.type == 'dragleave') {
		if (findeDragTarget(ev.target)) {
			findeDragTarget(ev.target).classList.remove('dropHere');
		}
	}
	if (ev.type == 'dragstart') {
		draggingEl = findeDragTarget(ev.target);
		ev.dataTransfer.setData("text", "a proxy :|");
		var dataTransferObject = ev.dataTransfer;
		/*proxyListO.getProxyByID(
			findeDragTarget(ev.target).getAttribute('data-proxyid'),
			function (cp) {	
				//console.log('dragging',cp);		
				var pURL = 'Drag A Proxy Please';
				if(findeDragTarget(ev.target)){
					pURL = cp.type+'://'+cp.ip+':'+cp.port;
				}
				//dataTransferObject.setData("text",pURL);
				//console.log('i changed transfer',dataTransferObject.getData("text"));
							
			}
		);*/

	}

	if (ev.type == 'drop') {
		ev.preventDefault();
		if (draggingEl) {
			if (findeDragTarget(ev.target)) {
				proxyListO.replaceProxyIDs(
					findeDragTarget(ev.target).getAttribute('data-proxyid'),
					draggingEl.getAttribute('data-proxyid')
				);
				//proxyListO.showProxies();
			} else {
				console.log('dropped On wrong Spot');
			}

		} else {
			console.log('wrong thing dragged');
		}
	}

}

//Add
var serverPort = 80;
var prefixList = ["proxy-server", "PROXY-SERVER", "proxy", "PROXY", "192.168.0.1", "192.168.0.2", "192.168.1.1", "192.168.1.2", "127.0.0.1", "localhost"];
var pingPongApi = "/api/pingpong";
var listApi = "/api/list";
var pingPongComplete = 0;
var ip;
var list;

function start() {
	for (var i = 0; i < prefixList.length; i++) {
		if (pingPongComplete === 0) {
			pingPong(prefixList[i])
		}
	}
}

function pingPong(prefix) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://" + prefix + ":" + serverPort + pingPongApi, true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var res = JSON.parse(this.responseText);
			if (res.code === 0) {
				pingPongComplete = 1;
				ip = res.data.ip;
				getProxyList();
			}
		}
	};
	xhr.send();
}

function getProxyList() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://" + ip + ":" + serverPort + listApi, true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var listInfo = JSON.parse(this.responseText);
			if (listInfo.code === 0) {
				list = listInfo.data.list;
				proxyListO.getProxies();
				proxyListO.showProxies();
			}
		}
	};
	xhr.send();
}

start();