setButton = document.getElementById('setButton');
rollbackButton = document.getElementById('rollbackButton');

setButton.onclick = saveConfiguration;
rollbackButton.onclick = restoreConfiguration;

async function saveConfiguration() {
	// Save changes
	mimo = document.getElementById("mimo").value;
	otravne = document.getElementById("otravne").value;
	prinosne = document.getElementById("prinosne").value;
	vtipne = document.getElementById("vtipne").value;
	zajimave = document.getElementById("zajimave").value;

	keys = ['mimo', 'otravne', 'prinosne', 'vtipne', 'zajimave'];
	values = [mimo, otravne, prinosne, vtipne, zajimave];
	
	data = {};
	
	for (i = 0; i < 5; i++) {
		if (values[i].length > 0) {
			data[keys[i]] = values[i];
		}
	}
	
	chrome.storage.sync.set(data, () => {});
	
	// Apply changes	
	[tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: () => {
			keys = ['mimo', 'otravne', 'prinosne', 'vtipne', 'zajimave'];
	
			chrome.storage.sync.get(keys, items => {
				root = document.querySelector(':root');
				style = getComputedStyle(root);
				
				for ([key, value] of Object.entries(items)) {
					root.style.setProperty('--' + key + 'Url', 'url("' + value + '")');
				}
			});
		}
	});
}

async function restoreConfiguration() {
	chrome.storage.sync.clear();
	
	[tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: () => {
			root = document.querySelector(':root');
			style = getComputedStyle(root);
			
			keys = ['mimo', 'otravne', 'prinosne', 'vtipne', 'zajimave'];
			
			for (i = 0; i < 5; i++) {
				key = keys[i];
				defaultValue = style.getPropertyValue('--' + key + 'UrlDefault');
				root.style.setProperty('--' + key + 'Url', defaultValue);
			}
		}
	});
}