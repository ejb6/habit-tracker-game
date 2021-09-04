from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import timedelta
from django.utils import timezone

# Todos
# Create a dailies model
# Handle the dailies using JS
#   - JS should check wether a deadline is missed
#   - Deadline should change when a task is complete
# Calculate deduction on login using JS
# for all tasks:
#   if last checked was tody:
#       skip
#   if deadline < now:
#       deduct (send to django)
#       update last checked for this task

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

    # Called when a task is completed:
    def task_complete(self):
        self.gold += 30
        self.exp_current += 10
        # Level up the user (increase in exp)
        if self.exp_current >= self.exp_next:
            self.exp_current -= self.exp_next
            self.exp_next *= 2
            self.level += 1
            self.health_max += 5
            self.health_current += 5
        self.save()

    # Called when a task is marked as incompleted:
    def task_incomplete(self):
        self.gold -= 30
        self.exp_current -= 10
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
    # A habit can be either good or bad
    is_bad = models.BooleanField(default=False)
    last_checked = models.DateTimeField(auto_now_add=True)
    streak = models.IntegerField(default=0)

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "isBad": self.is_bad,
            "lastChecked": self.last_checked,
            "streak": self.streak
        }