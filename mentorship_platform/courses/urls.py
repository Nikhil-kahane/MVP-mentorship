from django.urls import path
from . import api_views

app_name = 'courses'

urlpatterns = [
    path('', api_views.CourseListView.as_view(), name='list'),
    path('categories/', api_views.CategoryListView.as_view(), name='categories'),
    path('home/', api_views.HomeView.as_view(), name='home'),
    path('<slug:slug>/', api_views.CourseDetailView.as_view(), name='detail'),
]
