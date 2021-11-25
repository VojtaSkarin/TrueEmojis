setButton = document.getElementById('setButton');
setButton.onclick = saveConfiguration;

rollbackButton = document.getElementById('rollbackButton');
rollbackButton.onclick = restoreConfiguration;

function saveConfiguration() {
	// Save changes
	data = ['mimo', 'otravne', 'prinosne', 'vtipne', 'zajimave', 'nemamNazor']
		.map(key => [key, document.getElementById(key).value])
		.filter(([_, value]) => value.length > 0)
		.reduce((prev, [key, value]) => ({...prev, [key]: value}), {});
	
	chrome.storage.sync.set(data, () => {});
	
	// Apply changes	
	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		chrome.tabs.executeScript(
			tabs[0].id,
			{
				code: "\
					keys = ['mimo', 'otravne', 'prinosne', 'vtipne', 'zajimave', 'nemamNazor'];\
					\
					chrome.storage.sync.get(keys, items => {\
						root = document.querySelector(':root');\
						\
						for ([key, value] of Object.entries(items)) {\
							root.style.setProperty('--' + key + 'Url', 'url(\"' + value + '\")');\
						}\
					});\
					"
			}
		);
	});
}

function restoreConfiguration() {
	chrome.storage.sync.clear();
	
	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		chrome.tabs.executeScript(
			tabs[0].id,
			{
				code: "\
					root = document.querySelector(':root');\
					style = getComputedStyle(root);\
					['mimo', 'otravne', 'prinosne', 'vtipne', 'zajimave', 'nemamNazor']\
						.forEach(key => {\
							defaultValue = style.getPropertyValue('--' + key + 'UrlDefault');\
							root.style.setProperty('--' + key + 'Url', defaultValue);\
						});\
					"
			}
		);
	});
}