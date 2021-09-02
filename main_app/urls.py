from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login_view, name='login'),
    path('register', views.register, name='register'),
    path('logout', views.logout_view, name='logout'),
    path('todos', views.todos, name='todos'),
    path('stats', views.user_stats, name='stats'),
    path(
        'equip_avatar/<str:avatar_name>',
        views.equip_avatar,
        name='equip_avatar'
        ),
]


