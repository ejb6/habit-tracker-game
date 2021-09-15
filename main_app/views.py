from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from .models import Daily, User, Todo, Habit, Reward
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from datetime import datetime
from django.utils import timezone
import json


# Create your views here.
def index(request):
    # Display a splash page if the user is not logged in:
    if request.user.is_anonymous:
        return render(request, 'main_app/splash.html')
    # Display the task manager app if the user is logged in:
    else:
        # List of rewards for the user:
        return render(request, 'main_app/index.html', {
            'rewards_list': Reward.objects.all(), 
            'rewards_owned': request.user.rewards_owned.all()
        })


# Login the user:
def login_view(request):
    if request.method == 'GET':
        return render(request, 'main_app/login.html')
    else:
        # POST method
        # Attempt to sign user in
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(
            request,
            username=username,
            password=password
        )

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('index'))
        else:
            return render(request, 'main_app/login.html', {
                'message': 'Invalid username and/or password.'
            })


# Logout:
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))
 

# Register / Sign Up
def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        nickname = request.POST['nickname']

        # Ensure password matches confirmation
        password = request.POST['password']
        confirmation = request.POST['confirmation']
        if password != confirmation:
            return render(request, 'main_app/register.html', {
                'message': 'Passwords must match.'
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username=username,
                password=password, nickname=nickname)
            # Reward initially owned by the user:
            user.rewards_owned.add(Reward.objects.get(name='spider'))
            user.save()
        except IntegrityError:
            return render(request, 'main_app/register.html', {
                'message': 'Username already taken.'
            })
        login(request, user)
        return HttpResponseRedirect(reverse('index'))
    else:
        return render(request, 'main_app/register.html')


# The following view manages all Todo related actions 
# Actions: show list, create, edit, mark as complete
# Default action (using GET) returns a list of todo objects
@login_required
def todos(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            # User can only access his/her own todo items:
            todo = request.user.todo.get(id=data['id'])
        except:
            return HttpResponse('Todo object not found', status=404)

        # Mark Todo as completed:
        if data['action'] == 'mark':
            todo.completed = timezone.now()
            todo.save()
            request.user.task_complete(gold=20, exp=10)

            # Return the updated Todo object:
            return JsonResponse(todo.serialize(), status=200)

        # Unmark Todo (set as incompleted):
        elif data['action'] == 'unmark':
            todo.completed = None
            todo.save()
            request.user.task_incomplete(gold=20, exp=10)

            # Return the updated Todo object:
            return JsonResponse(todo.serialize(), status=200)

        # Edit Todo
        elif data['action'] == 'edit':
            try:
                todo.title = data['title']
                todo.description = data['description']
                new_deadline = datetime.fromisoformat(
                    data['deadline'].replace('Z', '+00:00')
                )
                todo.deadline = new_deadline
                todo.save()
                return JsonResponse(todo.serialize(), status=200)
            except:
                return HttpResponse('Failed to Edit', status=400)
        # Delete Todo
        elif data['action'] == 'delete':
            todo.delete()
            return HttpResponse('Deleted', status=200)

    # For creating a Todo:
    elif request.method == 'POST':
        try:
            data = request.POST
            deadline = datetime.fromisoformat(
                data['deadline'].replace('Z', '+00:00')
            )
            todo = Todo.objects.create(
                title = data['title'],
                description = data['description'],
                deadline = deadline
            )
            request.user.todo.add(todo)
            return JsonResponse(todo.serialize(), status=201)
        except:
            return HttpResponse('Fail', status=400)
    # For a GET request:
    # Returns the a list of todo objects in json format:
    todo_all = request.user.todo.all().order_by('created')
    return JsonResponse(
        [todo.serialize() for todo in todo_all],
        safe=False, status=200
    )

@login_required
def user_stats(request):
    user = request.user
    return JsonResponse({
        'nickname': user.nickname,
        'level': user.level,
        'gold': user.gold,
        'healthCurrent': user.health_current,
        'healthMax': user.health_max,
        'expCurrent': user.exp_current,
        'expNext': user.exp_next
    }, status=200)


# For changing profile picture/avatar:
@login_required
def equip_avatar(request, avatar_name):
    try:
        # User can only access rewards that are already purchased: 
        reward = request.user.rewards_owned.get(name=avatar_name)
        request.user.avatar = reward.name
        request.user.save()
        return HttpResponse('Success', status=200)
    except:
        return HttpResponse('Reward item is not owned', status=400)


#
@login_required
def purchase(request, reward_name):
    user = request.user
    try:
        reward = Reward.objects.get(name=reward_name)
    except:
        return HttpResponse('Reward item not found', status=404)
    if reward.price > user.gold:
        return HttpResponse('Insufficient gold', status=400)
    elif reward.name == 'food' or reward.name == 'potion':
        if reward.name == 'food':
            hp_increase = 10
        else:
            hp_increase = 40
        user.increase_hp(hp_increase)
        return HttpResponse('HP restored!', status=200)

    # else (for purchasing avatars):
    user.gold -= reward.price
    user.rewards_owned.add(reward)
    user.save()
    return HttpResponse('Avatar purchased', status=200)


@login_required
def habits(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        try:
            habit = request.user.habits.get(id=data['id'])
        except:
            return HttpResponse('Habit object not found', status=404)

        if data['action'] == 'mark':
            habit.mark()
            return HttpResponse('Marked', status=200)
        elif data['action'] == 'reset':
            habit.reset()
            return HttpResponse('Reset', status=200)
        elif data['action'] == 'edit':
            try:
                if data['habit-type'] == 'bad':
                    is_bad = True
                else:
                    is_bad = False
                habit.title = data['title']
                habit.description = data['description']
                habit.is_bad = is_bad
                habit.streak = int(data['streak'])
                habit.save()
                print(habit.serialize())
                return JsonResponse(habit.serialize(), status=200)
            except:
                return HttpResponse('Failed', status=400)
                
        elif data['action'] == 'delete':
            habit.delete()
            return HttpResponse('Deleted', status=200)

    elif request.method == 'POST':
        data = request.POST
        try:
            if data['habit-type'] == 'bad':
                isBad = True
            else:
                isBad = False
            if data['streak']:
                streak = data['streak']
            else:
                streak = 0
            habit = Habit.objects.create(
                title=data['title'],
                description=data['description'],
                is_bad=isBad,
                streak=streak
            )
            request.user.habits.add(habit)
            return JsonResponse(habit.serialize(), status=200)
        except:
            return HttpResponse('Failed to create habit item', status=400)
    habits = request.user.habits.all()
    return JsonResponse(
        [habit.serialize() for habit in habits],
        safe=False, status=200
    )


@login_required
def dailies(request):
    if request.method == 'POST':
        try:
            data = request.POST
            daily = Daily.objects.create(
                title = data['title'],
                description = data['description']
            )
            request.user.dailies.add(daily)
            return JsonResponse(daily.serialize(), status=200)
        except:
            return JsonResponse({'error': 'Failed to create task'}, status=400)
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            daily_item = request.user.dailies.get(id=data['id'])
        except:
            return JsonResponse({
                'error': 'Cannot find task item on the server.'
            }, status=404)

        if data['action'] == 'delete':
            daily_item.delete()
            return JsonResponse({'message': 'Task deleted'}, status=200)
        elif data['action'] == 'edit':
            daily_item.update(data)
            return JsonResponse(daily_item.serialize(), status=200)
        elif data['action'] == 'mark':
            daily_item.mark()
            return JsonResponse(daily_item.serialize(), status=200)
        elif data['action'] == 'unmark':
            daily_item.unmark()
            return JsonResponse(daily_item.serialize(), status=200)
    dailies = request.user.dailies.all()
    return JsonResponse(
        [daily.serialize() for daily in dailies],
        safe=False, status=200
    )


@login_required
def check_missed(request, query):
    if query == 'last_deduct':
        return JsonResponse({
            'lastDeductString': request.user.last_deduct
        }, status=200)
    elif query == 'todos':
        todos = request.user.todo.filter(completed__isnull=True)
        return JsonResponse(
            [todo.deadline for todo in todos],
            safe=False, status=200
        )
    elif query == 'good_habits':
        habits = request.user.habits.filter(is_bad=False)
        return JsonResponse(
            [habit.check_missed() for habit in habits],
            safe=False, status=200
        )
    elif query == 'bad_habits':
        habits = request.user.habits.filter(is_bad=True)
        return JsonResponse(
            [habit.check_missed() for habit in habits],
            safe=False, status=200
        )
    elif query == 'dailies':
        dailies = request.user.dailies.all()
        return JsonResponse(
            [daily.check_missed() for daily in dailies],
            safe=False, status=200
        )
    
    elif request.method == 'PUT':
        data = json.loads(request.body)
        request.user.decrease_hp(3 * data['hpDeductCount'])
        exp_gain = 3 * data['expGainCount']
        request.user.task_complete(exp=exp_gain)
        request.user.last_deduct = timezone.now()
        request.user.save()
        return JsonResponse({'message': 'Deducted'}, status=200)

    return JsonResponse({
        'error': 'Something is wrong with your request.'
    }, status=400)
