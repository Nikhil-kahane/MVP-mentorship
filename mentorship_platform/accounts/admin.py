from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Student, Mentor, MentorCertificate


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'is_staff']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Platform Info', {'fields': ('role', 'phone_number', 'profile_image')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Platform Info', {'fields': ('role', 'phone_number', 'email', 'first_name', 'last_name')}),
    )


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['user', 'education', 'created_at']
    search_fields = ['user__username', 'user__email', 'education']


@admin.register(Mentor)
class MentorAdmin(admin.ModelAdmin):
    list_display = ['user', 'expertise', 'experience_years', 'is_approved', 'created_at']
    list_filter = ['is_approved']
    search_fields = ['user__username', 'user__email', 'expertise']


@admin.register(MentorCertificate)
class MentorCertificateAdmin(admin.ModelAdmin):
    list_display = ['title', 'mentor', 'uploaded_at']
    search_fields = ['title', 'mentor__user__username', 'mentor__user__email']
