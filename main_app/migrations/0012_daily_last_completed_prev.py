# Generated by Django 3.2.6 on 2021-09-10 01:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0011_auto_20210908_2300'),
    ]

    operations = [
        migrations.AddField(
            model_name='daily',
            name='last_completed_prev',
            field=models.DateTimeField(null=True),
        ),
    ]
