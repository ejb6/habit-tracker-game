// Used to navigate each tab (Todos, Habits, Dailies)
function openTab(event) {
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
  const tabTarget = event.target;
  tabTarget.className += ' active';
  const tabContentId = tabTarget.id.replace('-tab', '');
  document.getElementById(tabContentId).style.display = 'block';
}
document.querySelectorAll('.tablinks').forEach((link) => {
  const linkT = link;
  linkT.onclick = openTab;
});

// For dismissing pop-ups
document.querySelector('.dismiss-popup').onclick = () => {
  document.querySelector('#alert-popup').style.display = 'none';
};
