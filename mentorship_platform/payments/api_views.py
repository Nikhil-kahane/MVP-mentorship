from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import PaymentRecord
from .serializers import PaymentSerializer, CreatePaymentSerializer
from bookings.models import Booking


class CreatePaymentView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreatePaymentSerializer

    def perform_create(self, serializer):
        serializer.save()


class PaymentDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer
    lookup_url_kwarg = 'pk'

    def get_queryset(self):
        user = self.request.user
        if user.is_student() and hasattr(user, 'student_profile'):
            return PaymentRecord.objects.filter(booking__student=user.student_profile).select_related('booking')
        return PaymentRecord.objects.none()


class PaymentByBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, booking_id):
        user = request.user
        try:
            payment = PaymentRecord.objects.filter(
                booking__student=user.student_profile,
                booking_id=booking_id
            ).first() if hasattr(user, 'student_profile') else None

            if not payment:
                return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
            return Response(PaymentSerializer(payment).data)
        except Exception:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
