from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import timedelta
from django.utils import timezone


# Reward for completing tasks:
class Reward(models.Model):
    name = models.CharField(max_length=15, unique=True)
    text = models.TextField(max_length=15)
    price = models.IntegerField()


# Create your models here.
class User(AbstractUser):
    nickname = models.CharField(max_length=16)

    todo = models.ManyToManyField("Todo")
    habits = models.ManyToManyField("Habit")
    dailies = models.ManyToManyField("Daily")

    # Player Stats:
    level = models.IntegerField(default=1)
    health_current = models.IntegerField(default=50)
    health_max = models.IntegerField(default=50)
    exp_current = models.IntegerField(default=0)
    exp_next = models.IntegerField(default=100)
    gold = models.IntegerField(default=100)

    # avatar determines the profile photo of a user:
    avatar = models.CharField(default="spider", max_length=16)
    # Rewards owned for completing tasks:
    rewards_owned = models.ManyToManyField("Reward")
    # Last datetime where the missed deadlines were checked:
    last_deduct = models.DateTimeField(auto_now_add=True)

    # Called when a task is completed:
    def task_complete(self, gold, exp):
        self.gold += gold
        self.exp_current += exp
        # Level up the user (increase in exp)
        if self.exp_current >= self.exp_next:
            self.exp_current -= self.exp_next
            self.exp_next *= 2
            self.level += 1
            self.health_max += 5
            self.health_current += 5
        self.save()

    # Called when a task is marked as incompleted:
    def task_incomplete(self, gold, exp):
        self.gold -= gold
        self.exp_current -= exp
        # Level down the user (revert back to original)
        if self.exp_current < 0:
            self.exp_next /= 2
            self.exp_current += self.exp_next
            self.level -= 1
            self.health_max -= 5
            self.health_current -= 5
        self.save()

    # Used to increase the current health:
    def increase_hp(self, amount):
        self.health_current += amount
        if self.health_current >= self.health_max:
            self.health_current = self.health_max
        self.save()
    
    def decrease_hp(self, amount):
        self.health_current -= amount
        if self.health_current <= 0:
            # Return the user to level 1:
            self.exp_current = 0
            self.health_current = 50
            self.health_max = 50
            self.exp_current = 100
            self.exp_next = 100
            self.level = 1
            self.rewards_owned = None
            self.rewards_owned.add(Reward.objects.get(name='spider'))
            self.avatar = 'spider'
        self.save()


# A task that can be completed only once:
class Todo(models.Model):
    title = models.CharField(max_length=30)
    description = models.CharField(max_length=150)
    created = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField()
    completed = models.DateTimeField(null=True)

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "created": self.created,
            "deadline": self.deadline,
            "completed": self.completed
        }


class Habit(models.Model):
    title = models.CharField(max_length=30)
    description = models.CharField(max_length=150, default='')
    # A habit can be either good or bad
    is_bad = models.BooleanField(default=False)
    last_marked = models.DateTimeField(auto_now_add=True)
    streak = models.IntegerField(default=0)

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "desc": self.description,
            "isBad": self.is_bad,
            "lastMarked": self.last_marked,
            "streak": self.streak
        }
    def reset(self):
        self.streak = 0


class Daily(models.Model):
    title = models.CharField(max_length=30)
    description = models.CharField(max_length=30)
    # date and time when the user last completed a daily task:
    last_completed = models.DateTimeField(null=True)
    # Temporarily stores the previous value for 'last_completed':
    last_completed_prev = models.DateTimeField(null=True)

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'lastCompleted': self.last_completed,
        }
    def update(self, form_data):
        self.title = form_data['title']
        self.description = form_data['description']
        self.save()
    
    def mark(self):
        self.last_completed_prev = self.last_completed
        self.last_completed = timezone.now()
        self.save()
        self.user_set.get().task_complete(gold=15, exp=15)
    def unmark(self):
        self.last_completed = self.last_completed_prev
        self.save()
        self.user_set.get().task_incomplete(gold=15, exp=15)
