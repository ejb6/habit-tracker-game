// Used to navigate each tab (Todos, Habits, Dailies)
function openTab(tabName) {
  const tabContents = document.querySelectorAll('.tabcontent');
  tabContents.forEach((e) => {
    const tab = e;
    tab.style.display = 'none';
  });
  const tabLinks = document.querySelectorAll('.tablinks');
  tabLinks.forEach((e) => {
    const tabLink = e;
    tabLink.className = tabLink.className.replace(' active', '');
  });
  document.getElementById(tabName).style.display = 'block';
  document.getElementById(`${tabName}-tab`).className += ' active';
}

// For dismissing reward pop-ups
document.querySelector('.dismiss-popup').onclick = () => {
  document.querySelector('#rewards-popup').style.display = 'none';
};
