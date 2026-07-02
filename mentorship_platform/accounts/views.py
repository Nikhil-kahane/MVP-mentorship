from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import StudentRegistrationForm, UserProfileForm, StudentProfileForm, MentorProfileForm
from .models import Student, Mentor


def register_view(request):
    if request.user.is_authenticated:
        return redirect('dashboards:redirect')
    if request.method == 'POST':
        form = StudentRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Registration successful! Welcome to the platform.')
            return redirect('dashboards:student')
    else:
        form = StudentRegistrationForm()
    return render(request, 'accounts/register.html', {'form': form})


def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboards:redirect')
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            next_url = request.GET.get('next', '')
            if next_url:
                return redirect(next_url)
            return redirect('dashboards:redirect')
        messages.error(request, 'Invalid username or password.')
    return render(request, 'accounts/login.html')


def logout_view(request):
    logout(request)
    return redirect('/')


@login_required
def profile_view(request):
    user = request.user
    if request.method == 'POST':
        user_form = UserProfileForm(request.POST, request.FILES, instance=user)
        if user.is_student():
            profile_form = StudentProfileForm(request.POST, instance=getattr(user, 'student_profile', None))
        elif user.is_mentor():
            profile_form = MentorProfileForm(request.POST, instance=getattr(user, 'mentor_profile', None))
        else:
            profile_form = None

        forms_valid = user_form.is_valid() and (profile_form is None or profile_form.is_valid())
        if forms_valid:
            user_form.save()
            if profile_form:
                profile_form.save()
            messages.success(request, 'Profile updated successfully.')
            return redirect('accounts:profile')
    else:
        user_form = UserProfileForm(instance=user)
        if user.is_student():
            profile_form = StudentProfileForm(instance=getattr(user, 'student_profile', None))
        elif user.is_mentor():
            profile_form = MentorProfileForm(instance=getattr(user, 'mentor_profile', None))
        else:
            profile_form = None

    return render(request, 'accounts/profile.html', {
        'user_form': user_form,
        'profile_form': profile_form,
    })
