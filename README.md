---
---
<img src="https://static.djangoproject.com/img/logos/django-logo-negative.svg" height="50px">&nbsp;&nbsp; <img src="https://www.seekpng.com/png/detail/80-803597_io-is-compatible-with-all-javascript-frameworks-and.png" height="50px">

# Gamified Habit Tracker
This is an RPG habit tracker/task manager similar to Habitica (in progress).


# Preview
![image](https://user-images.githubusercontent.com/76241888/133603462-fe58c29e-3649-4d3b-88c4-49ec3ec59333.png)


# How to Run
Please note that this project was developed using Python 3.9.6.
1. Download a copy of this repo.
3. Run the command line and change directory into the project (where `manage.py` is located)
3. Install Django 3.2.6.
4. Run `python manage.py runserver`. This should output the address on the command line.
5. Go into the address using your Browser.

# Files and Folders

Django's `startproject` command was used to create `/habit_tracker` folder. This folder contains the `settings.py` which contains the project's configurations.

### Models and Views

The `/main_app` folder was created using Django `startapp` command. This folder contains all important files for this project, namely the models (`models.py`), views (`views.py`), and templates.

### Template Folder

The HTML files are located on `/main_app/templates/main_app/`

- `index.html` is the file for rendering the main app (to-dos, habits, dailies and rewards) after the user logs in.
- `splash.html` is the introductory page shown to the user before he/she logs in.

The rest of the files are self-explanatory.

### Static Files

`/main_app/static/main_app/` contains the JavaScript, CSS, and image files.

#### CSS

- `styles.css` includes the styles associated for the specific class attributes and ID's.
- `theme.css` is used to control the app's colors for the dark and light modes.
- `forms.css` includes the styles that are used for the login and registration pages.

#### JavaScript (React)

All the JavaScript files are located on `static/main_app/js`.

- `src` folder contains all the JSX files (React). Each file inside this folder contains a comment block which explains the purpose of the file.
- `.eslintrc.json` is the config file for linting JSX and JS files.
- `main.js` is the output file for transpiling all the files inside the `src` folder. This file is not meant to be directly modified.
- `misc.js` are the JS codes that are not used within the React files.
- The rest of the files are used for developing React using NPM and Webpack. To install the dependencies (for contributing), run `npm install`. To transpile the code after modifying, run `npm run build`.

# Features

### To-dos

- This offers the basic functionalities of a to-do app such as deadlines (optional), editing, and marking as completed.
- If a user has an overdue to-do, his/her HP will decrease constantly (-3 per day) until the to-do is completed. This will only take effect the day after the deadline. This means that a user still has a chance to avoid HP deduction by completing the to-do within the day of the deadline. For example, if the deadline is set to Aug 3, 1 PM, the user will avoid HP deduction by completing the to-do before Aug 4.

### Habits

- A habit is anything that can be done multiple times within a day.
- A habit can be good (e.g., meditation) or bad (e.g., smoking).
- A streak/relapse counter is shown for each habit item. This keeps track of how many times the habit is done within the day.
- Completing a good habit will give EXP and gold reward. On the other hand, doing bad habits will deduct some HP.
- If a user fails to complete a good habit at least once per day, his/her HP will decrease. Avoiding bad habits will give EXP reward.

### Dailies

- A daily task should be completed once per day.
- Completing a daily task will give EXP and gold reward. Missing a daily task will deduct some HP.

### Rewards

- A reward can be obtained by spending gold. Rewards like potion and food can be used to heal the user.
