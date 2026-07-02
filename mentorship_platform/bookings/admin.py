from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'student', 'mentor', 'course', 'session_date', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['student__user__username', 'mentor__user__username', 'course__title']
    list_editable = ['status']
