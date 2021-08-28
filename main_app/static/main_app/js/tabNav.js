function openTab(tabName) {
	const tabContents = document.querySelectorAll('.tabcontent');
	tabContents.forEach((tab) => {
		tab.style.display = 'none';
	});
	const tabLinks = document.querySelectorAll('.tablinks');
	tabLinks.forEach((tabLink) => {
		tabLink.className = tabLink.className.replace(' active', '');
	});
	document.getElementById(tabName).style.display = 'block';
	document.getElementById(tabName + '-tab').className += ' active';
}

