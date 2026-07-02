from django.urls import path
from . import api_views

app_name = 'payments'

urlpatterns = [
    path('create/', api_views.CreatePaymentView.as_view(), name='create'),
    path('<int:pk>/', api_views.PaymentDetailView.as_view(), name='detail'),
    path('booking/<int:booking_id>/', api_views.PaymentByBookingView.as_view(), name='by_booking'),
]
