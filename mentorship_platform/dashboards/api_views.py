from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from bookings.models import Booking
from courses.models import Course
from courses.serializers import CourseListSerializer
from bookings.serializers import BookingSerializer


class DashboardRedirectView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'role': user.role,
            'redirect': f'/dashboards/{user.role}/'
        })


class StudentDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.is_student() or not hasattr(user, 'student_profile'):
            return Response({'error': 'Student access only'}, status=403)

        student = user.student_profile
        bookings = Booking.objects.filter(student=student).select_related('course', 'mentor__user')

        total_bookings = bookings.count()
        upcoming = bookings.filter(
            status__in=['pending', 'booked'],
            session_date__gte=timezone.now()
        ).order_by('session_date')[:5]
        recent = bookings.order_by('-created_at')[:5]

        return Response({
            'total_bookings': total_bookings,
            'upcoming_sessions': BookingSerializer(upcoming, many=True).data,
            'recent_bookings': BookingSerializer(recent, many=True).data,
        })


class MentorDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.is_mentor() or not hasattr(user, 'mentor_profile'):
            return Response({'error': 'Mentor access only'}, status=403)

        mentor = user.mentor_profile
        courses = mentor.courses.all()
        bookings = Booking.objects.filter(mentor=mentor).select_related('course', 'student__user')

        total_bookings = bookings.count()
        upcoming = bookings.filter(
            status__in=['pending', 'booked'],
            session_date__gte=timezone.now()
        ).order_by('session_date')[:5]
        recent = bookings.order_by('-created_at')[:5]

        return Response({
            'courses': CourseListSerializer(courses, many=True).data,
            'total_bookings': total_bookings,
            'upcoming_sessions': BookingSerializer(upcoming, many=True).data,
            'recent_bookings': BookingSerializer(recent, many=True).data,
        })
