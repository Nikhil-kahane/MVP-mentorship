from django.urls import path
from . import api_views

app_name = 'bookings'

urlpatterns = [
    path('', api_views.BookingListView.as_view(), name='list'),
    path('create/', api_views.BookingCreateView.as_view(), name='create'),
    path('<int:pk>/', api_views.BookingDetailView.as_view(), name='detail'),
    path('<int:pk>/cancel/', api_views.CancelBookingView.as_view(), name='cancel'),
]
