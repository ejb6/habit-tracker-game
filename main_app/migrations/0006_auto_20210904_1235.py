# Generated by Django 3.2.6 on 2021-09-04 04:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0005_user_hp_last_decreased'),
    ]

    operations = [
        migrations.CreateModel(
            name='Habit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=30)),
                ('is_bad', models.BooleanField(default=False)),
                ('last_checked', models.DateTimeField(null=True)),
                ('next_deadline', models.DateTimeField()),
            ],
        ),
        migrations.RemoveField(
            model_name='user',
            name='hp_last_decreased',
        ),
    ]
