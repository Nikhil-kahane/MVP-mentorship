from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health_check(request):
    return JsonResponse({'status': 'healthy'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health_check, name='health_check'),
    path('api/accounts/', include('accounts.urls', namespace='accounts')),
    path('api/courses/', include('courses.urls', namespace='courses')),
    path('api/bookings/', include('bookings.urls', namespace='bookings')),
    path('api/payments/', include('payments.urls', namespace='payments')),
    path('api/dashboards/', include('dashboards.urls', namespace='dashboards')),
]
