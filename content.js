keys = ['mimo', 'otravne', 'prinosne', 'vtipne', 'zajimave', 'nemamNazor'];

chrome.storage.sync.get(keys, items => {
	root = document.querySelector(':root');
	style = getComputedStyle(root);
	
	for ([key, value] of Object.entries(items)) {
		root.style.setProperty('--' + key + 'Url', 'url("' + value + '")');
	}
});
