from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from bookings.models import Booking


@login_required
def redirect_dashboard(request):
    if request.user.is_student():
        return redirect('dashboards:student')
    elif request.user.is_mentor():
        return redirect('dashboards:mentor')
    return redirect('/admin/')


@login_required
def student_dashboard_view(request):
    if not request.user.is_student():
        return redirect('dashboards:redirect')
    if not hasattr(request.user, 'student_profile'):
        return redirect('/')

    student = request.user.student_profile
    bookings = Booking.objects.filter(student=student).select_related(
        'course', 'mentor__user'
    )
    total_bookings = bookings.count()
    upcoming = bookings.filter(
        status__in=['pending', 'booked'],
        session_date__gte=timezone.now()
    ).order_by('session_date')[:5]
    recent = bookings.order_by('-created_at')[:5]

    return render(request, 'dashboards/student_dashboard.html', {
        'total_bookings': total_bookings,
        'upcoming_sessions': upcoming,
        'recent_bookings': recent,
    })


@login_required
def mentor_dashboard_view(request):
    if not request.user.is_mentor():
        return redirect('dashboards:redirect')
    if not hasattr(request.user, 'mentor_profile'):
        return redirect('/')

    mentor = request.user.mentor_profile
    courses = mentor.courses.all()
    bookings = Booking.objects.filter(mentor=mentor).select_related(
        'student__user', 'course'
    )
    total_bookings = bookings.count()
    upcoming = bookings.filter(
        status__in=['pending', 'booked'],
        session_date__gte=timezone.now()
    ).order_by('session_date')[:5]
    recent = bookings.order_by('-created_at')[:5]

    return render(request, 'dashboards/mentor_dashboard.html', {
        'courses': courses,
        'total_bookings': total_bookings,
        'upcoming_sessions': upcoming,
        'recent_bookings': recent,
    })
