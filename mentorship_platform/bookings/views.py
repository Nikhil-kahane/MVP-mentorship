from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from courses.models import Course
from .models import Booking


def require_student(view_func):
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('accounts:login')
        if not request.user.is_student():
            messages.error(request, 'This page is for students only.')
            return redirect('/')
        if not hasattr(request.user, 'student_profile'):
            messages.error(request, 'Student profile not found.')
            return redirect('/')
        return view_func(request, *args, **kwargs)
    return wrapper


@require_student
def booking_form_view(request, course_slug):
    course = get_object_or_404(Course.objects.select_related('mentor__user'), slug=course_slug)
    if request.method == 'POST':
        session_date = request.POST.get('session_date')
        if not session_date:
            messages.error(request, 'Please select a session date.')
            return render(request, 'bookings/booking_form.html', {'course': course})
        booking = Booking.objects.create(
            student=request.user.student_profile,
            mentor=course.mentor,
            course=course,
            session_date=session_date,
            status='pending',
        )
        return redirect('payments:payment_page', booking_id=booking.pk)
    return render(request, 'bookings/booking_form.html', {'course': course})


@require_student
def booking_history_view(request):
    bookings = Booking.objects.filter(
        student=request.user.student_profile
    ).select_related('course', 'mentor__user', 'course__mentor__user')
    return render(request, 'bookings/booking_history.html', {'bookings': bookings})
