# Generated by Django 3.2.6 on 2021-09-14 05:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0014_auto_20210913_1553'),
    ]

    operations = [
        migrations.AlterField(
            model_name='habit',
            name='last_marked',
            field=models.DateTimeField(null=True),
        ),
    ]
