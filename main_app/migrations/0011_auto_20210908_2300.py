# Generated by Django 3.2.6 on 2021-09-08 15:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0010_habit_description'),
    ]

    operations = [
        migrations.CreateModel(
            name='Daily',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=30)),
                ('description', models.CharField(max_length=30)),
                ('last_completed', models.DateTimeField(null=True)),
            ],
        ),
        migrations.RenameField(
            model_name='habit',
            old_name='last_checked',
            new_name='last_reset',
        ),
        migrations.AddField(
            model_name='user',
            name='dailies',
            field=models.ManyToManyField(to='main_app.Daily'),
        ),
    ]
