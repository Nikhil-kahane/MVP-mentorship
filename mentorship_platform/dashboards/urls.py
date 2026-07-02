from django.urls import path
from . import api_views

app_name = 'dashboards'

urlpatterns = [
    path('', api_views.DashboardRedirectView.as_view(), name='redirect'),
    path('student/', api_views.StudentDashboardView.as_view(), name='student'),
    path('mentor/', api_views.MentorDashboardView.as_view(), name='mentor'),
]
