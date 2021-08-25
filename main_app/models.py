from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    nickname = models.CharField(max_length=16)
    todo = models.ManyToManyField("Todo")
    avatar = models.CharField(max_length=16)
    health_current = models.IntegerField()
    health_max = models.IntegerField()
    exp_current = models.IntegerField()
    exp_next = models.IntegerField()

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

