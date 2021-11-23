setButton = document.getElementById('setButton');
setButton.onclick = saveConfiguration;

rollbackButton = document.getElementById('rollbackButton');
rollbackButton.onclick = restoreConfiguration;

async function saveConfiguration() {
	// Save changes
	data = ['mimo', 'otravne', 'prinosne', 'vtipne', 'zajimave', 'nemamNazor']
		.map(key => [key, document.getElementById(key).value])
		.filter(([_, value]) => value.length > 0)
		.reduce((prev, [key, value]) => ({...prev, [key]: value}), {});
	
	chrome.storage.sync.set(data, () => {});
	
	// Apply changes	
	[tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: () => {
			keys = ['mimo', 'otravne', 'prinosne', 'vtipne', 'zajimave', 'nemamNazor'];
	
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
			
			['mimo', 'otravne', 'prinosne', 'vtipne', 'zajimave', 'nemamNazor']
			.forEach(key => {
				defaultValue = style.getPropertyValue('--' + key + 'UrlDefault');
				root.style.setProperty('--' + key + 'Url', defaultValue);
			});
		}
	});
}