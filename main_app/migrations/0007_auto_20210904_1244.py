# Generated by Django 3.2.6 on 2021-09-04 04:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0006_auto_20210904_1235'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='habit',
            name='next_deadline',
        ),
        migrations.AddField(
            model_name='habit',
            name='streak',
            field=models.IntegerField(default=0),
        ),
    ]