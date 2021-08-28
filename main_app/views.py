from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from .models import User, Todo
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from datetime import datetime, timezone
import json

# Create your views here.
def index(request):
    # Display a splash page if the user is not logged in:
    if request.user.is_anonymous:
        return render(request, "main_app/splash.html")
    # Display the task manager app if the user is logged in:
    else:
        return render(request, "main_app/index.html")

# Login the user:
def login_view(request):
    if request.method == "GET":
        return render(request, "main_app/login.html")
    else:
        # POST method
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username,
            password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "main_app/login.html", {
                "message": "Invalid username and/or password."
            })
# Logout:
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))
 
# Register / Sign Up
def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        nickname = request.POST["nickname"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "main_app/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username=username,
                password=password, nickname=nickname)
            user.save()
        except IntegrityError:
            return render(request, "main_app/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "main_app/register.html")


# The following view manages all Todo related actions 
# Actions: show list, create, edit, mark as complete
# Default action (using GET) returns a list of todo objects
@login_required
def todos(request):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            # User can only access his/her own todo items:
            todo = request.user.todo.get(id=data["id"])
        except:
            return HttpResponse("Todo object not found", status=404)

        # Mark Todo as completed:
        if data["action"] == "mark":
            todo.completed = datetime.now(timezone.utc)
            todo.save()

            # Level up the user (increase in exp)
            request.user.exp_current += 10
            if request.user.exp_current >= request.user.exp_next:
                request.user.exp_current -= request.user.exp_next
                request.user.exp_next += 20
                request.user.level += 1
                request.user.health_max += 5
                request.user.health_current += 5
            request.user.save()

            # Return the updated Todo object:
            return JsonResponse(todo.serialize(), status=200)

        # Unmark Todo (set as incompleted):
        elif data["action"] == "unmark":
            todo.completed = None
            todo.save()

            # Level down the user (revert back to original)
            request.user.exp_current -= 10
            if request.user.exp_current < 0:
                request.user.exp_next -= 20
                request.user.exp_current += request.user.exp_next
                request.user.level -= 1
                request.user.health_max -= 5
                request.user.health_current -= 5
            request.user.save()

            # Return the updated Todo object:
            return JsonResponse(todo.serialize(), status=200)

        # Edit Todo
        elif data["action"] == "edit":
            try:
                todo.title = data["title"]
                todo.description = data["description"]
                new_deadline = datetime.fromisoformat(
                    data["deadline"].replace("Z", "+00:00"))
                todo.deadline = new_deadline
                todo.save()
                return JsonResponse(todo.serialize(), status=200)
            except:
                return HttpResponse("Failed to Edit", status=400)
        # Delete Todo
        elif data["action"] == "delete":
            todo.delete()
            return HttpResponse("Deleted", status=200)

    # For creating a Todo:
    elif request.method == "POST":
        try:
            data = request.POST
            deadline = datetime.fromisoformat(
                data["deadline"].replace("Z", "+00:00"))
            todo = Todo.objects.create(
                title = data["title"],
                description = data["description"],
                deadline = deadline)
            request.user.todo.add(todo)
            return JsonResponse(todo.serialize(), status=201)
        except:
            return HttpResponse("Fail", status=400)
    # For a GET request:
    # Returns the a list of todo objects in json format:
    todo_all = request.user.todo.all().order_by("created")
    return JsonResponse(
        [todo.serialize() for todo in todo_all],
        safe=False, status=200)

@login_required
def user_stats(request):
    user = request.user
    return JsonResponse({
        "nickname": user.nickname,
        "level": user.level,
        "healthCurrent": user.health_current,
        "healthMax": user.health_max,
        "expCurrent": user.exp_current,
        "expNext": user.exp_next}, status=200)
