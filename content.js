emojis = {
	'mimo': 'KingPepega.png',
	'otravne': 'Tarded.png',
	'prinosne': 'WeSmart.png',
	'vtipne': 'Kekw.png',
	'zajimave': 'PagChomp.png',
	'nemamNazor': 'Peeposhrug.png'
};

browser.storage.sync.set({'mimo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/How_to_use_icon.svg/1200px-How_to_use_icon.svg.png'});

root = document.querySelector(':root');

for ([key, value] of Object.entries(emojis)) {
	root.style.setProperty('--' + key + 'Url', 'url(' + browser.runtime.getURL('/emojis/' + value) + ')');
	root.style.setProperty('--' + key + 'DefaultUrl', 'url(' + browser.runtime.getURL('/emojis/' + value) + ')');
}

browser.storage.sync.get(emojis.keys).then(stored => {
	for ([key, value] of Object.entries(stored)) {
		root.style.setProperty('--' + key + 'Url', 'url(' + value + ')');
	}
});

/*
chrome.storage.sync.get(keys, items => {
	root = document.querySelector(':root');
	style = getComputedStyle(root);
	
	for ([key, value] of Object.entries(items)) {
		root.style.setProperty('--' + key + 'Url', 'url("' + value + '")');
	}
});
*/