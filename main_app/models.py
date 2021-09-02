from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    nickname = models.CharField(max_length=16)
    todo = models.ManyToManyField("Todo")
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

    # This method is called when a task is completed:
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

    # This method is called when a task is marked as incompleted:
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

    # This method is used to increase the current health:
    def increase_hp(self, amount):
        self.health_current += amount
        if self.health_current >= self.health_max:
            self.health_current = self.health_max
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


# Reward for completing tasks:
class Reward(models.Model):
    name = models.CharField(max_length=15, unique=True)
    text = models.TextField(max_length=15)
    price = models.IntegerField()
