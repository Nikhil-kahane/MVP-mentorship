from django.contrib import admin
from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'mentor', 'category', 'duration', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['title', 'description', 'mentor__user__username']
    prepopulated_fields = {'slug': ('title',)}
