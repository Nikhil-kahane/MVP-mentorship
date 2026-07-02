from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Booking
from .serializers import BookingSerializer, CreateBookingSerializer, BookingDetailSerializer
from courses.models import Course


class BookingCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreateBookingSerializer

    def perform_create(self, serializer):
        serializer.save()


class BookingListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BookingSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_student() and hasattr(user, 'student_profile'):
            return Booking.objects.filter(student=user.student_profile).select_related('course', 'mentor__user')
        elif user.is_mentor() and hasattr(user, 'mentor_profile'):
            return Booking.objects.filter(mentor=user.mentor_profile).select_related('course', 'student__user')
        return Booking.objects.none()


class BookingDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BookingDetailSerializer
    lookup_url_kwarg = 'pk'

    def get_queryset(self):
        user = self.request.user
        if user.is_student() and hasattr(user, 'student_profile'):
            return Booking.objects.filter(student=user.student_profile).select_related('course', 'mentor__user')
        elif user.is_mentor() and hasattr(user, 'mentor_profile'):
            return Booking.objects.filter(mentor=user.mentor_profile).select_related('course', 'student__user')
        return Booking.objects.none()


class CancelBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        try:
            if user.is_student() and hasattr(user, 'student_profile'):
                booking = Booking.objects.get(pk=pk, student=user.student_profile)
            elif user.is_mentor() and hasattr(user, 'mentor_profile'):
                booking = Booking.objects.get(pk=pk, mentor=user.mentor_profile)
            else:
                return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

        if booking.status in ['cancelled', 'completed']:
            return Response({'error': 'Cannot cancel this booking'}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = 'cancelled'
        booking.save()
        return Response({'message': 'Booking cancelled successfully'})
