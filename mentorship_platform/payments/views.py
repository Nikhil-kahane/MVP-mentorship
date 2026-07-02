import uuid
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from bookings.models import Booking
from .models import PaymentRecord


def require_student(view_func):
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('accounts:login')
        if not request.user.is_student():
            messages.error(request, 'This page is for students only.')
            return redirect('/')
        return view_func(request, *args, **kwargs)
    return wrapper


@require_student
def payment_page_view(request, booking_id):
    booking = get_object_or_404(
        Booking.objects.select_related('student__user', 'mentor__user', 'course'),
        pk=booking_id,
        student=request.user.student_profile,
    )
    return render(request, 'payments/payment_page.html', {'booking': booking})


@require_student
def process_payment_view(request, booking_id):
    booking = get_object_or_404(
        Booking.objects.select_related('student__user', 'mentor__user', 'course'),
        pk=booking_id,
        student=request.user.student_profile,
    )
    if request.method == 'POST':
        reference = f'PAY-{uuid.uuid4().hex[:12].upper()}'
        payment = PaymentRecord.objects.create(
            booking=booking,
            payment_reference=reference,
            amount=99.99,
            payment_status='success',
        )
        booking.status = 'booked'
        booking.save()
        return redirect('payments:success', payment_id=payment.pk)
    return redirect('payments:payment_page', booking_id=booking_id)


@require_student
def payment_success_view(request, payment_id):
    payment = get_object_or_404(
        PaymentRecord.objects.select_related('booking__student__user', 'booking__mentor__user', 'booking__course'),
        pk=payment_id,
        booking__student=request.user.student_profile,
    )
    return render(request, 'payments/payment_success.html', {'payment': payment})
