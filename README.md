---
---
<img src="https://static.djangoproject.com/img/logos/django-logo-negative.svg" height="50px">&nbsp;&nbsp; <img src="https://www.seekpng.com/png/detail/80-803597_io-is-compatible-with-all-javascript-frameworks-and.png" height="50px">

# Gamified Habit Tracker
This is an RPG habit tracker/task manager similar to Habitica (in progress).


## Screenshot
![image](https://user-images.githubusercontent.com/76241888/131854859-1493f046-279a-44f9-afd3-e8e0c1f3a327.png)


## How to Run
Please note that this project was developed using Python 3.9.6.
1. Download a copy of this repo.
3. Run the command line and change directory into the project (where `manage.py` is located)
3. Install Django 3.2.6.
4. Run `python manage.py runserver`. This should output the address on the command line.
5. Go into the address using your Browser.

## Files and Folders

###### `/habit_tracker/`

This was automatically created using Django's `startproject` command. This folder contains the `settings.py` which contains the project's configurations.

###### `/main_app/`

This was created using Django `startapp` command. This folder contains all important files for this project, namely the models, views, and templates.

###### `main_app/templates/main_app`

- `index.html` is the file for rendering the main app (to-dos, habits, dailies and rewards) after the user logs in.
- `splash.html` is the introductory page shown to the user before he/she logs in.

The rest of the files are self-explanatory.

###### `/main_app/static/main_app/`

This folder contains the JavaScript, CSS, and image files.

- `styles.css` includes the styles associated for the class attributes and ID's.
- `theme.css` is used to control the app's colors for the dark and light modes.
- `forms.css` includes the styles that are used for the login and registration pages.

`/main_app/static/main_app/js/`

