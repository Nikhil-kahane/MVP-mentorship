from django.urls import path
from . import api_views
from rest_framework_simplejwt.views import TokenRefreshView

app_name = 'accounts'

urlpatterns = [
    path('register/', api_views.RegisterView.as_view(), name='register'),
    path('login/', api_views.LoginView.as_view(), name='login'),
    path('logout/', api_views.LogoutView.as_view(), name='logout'),
    path('profile/', api_views.ProfileView.as_view(), name='profile'),
    path('users/', api_views.UserListView.as_view(), name='users'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
