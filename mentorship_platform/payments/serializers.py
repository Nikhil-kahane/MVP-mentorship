from rest_framework import serializers
from .models import PaymentRecord
from bookings.serializers import BookingDetailSerializer


class PaymentSerializer(serializers.ModelSerializer):
    booking = BookingDetailSerializer(read_only=True)

    class Meta:
        model = PaymentRecord
        fields = ['id', 'booking', 'payment_reference', 'amount', 'payment_status', 'created_at']
        read_only_fields = ['id', 'payment_reference', 'created_at']


class CreatePaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentRecord
        fields = ['booking', 'amount']

    def validate_booking(self, booking):
        request = self.context.get('request')
        if booking.student.user != request.user:
            raise serializers.ValidationError('You can only pay for your own bookings.')
        return booking

    def create(self, validated_data):
        import uuid
        validated_data['payment_reference'] = f'PAY-{uuid.uuid4().hex[:10].upper()}'
        validated_data['payment_status'] = 'success'  # Simulating successful payment
        return PaymentRecord.objects.create(**validated_data)
