from rest_framework import serializers
from .models import Booking
from courses.serializers import CourseSerializer, CourseDetailSerializer


class BookingSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    student_name = serializers.SerializerMethodField()
    mentor_name = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = ['id', 'student', 'mentor', 'course', 'session_date', 'status', 'created_at', 'updated_at', 'student_name', 'mentor_name']
        read_only_fields = ['id', 'student', 'mentor', 'created_at', 'updated_at']

    def get_student_name(self, obj):
        return obj.student.user.get_full_name() or obj.student.user.username

    def get_mentor_name(self, obj):
        return obj.mentor.user.get_full_name() or obj.mentor.user.username


class CreateBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['course', 'session_date']

    def validate(self, attrs):
        request = self.context.get('request')
        if not request.user.is_student():
            raise serializers.ValidationError('Only students can make bookings.')
        if not hasattr(request.user, 'student_profile'):
            raise serializers.ValidationError('Student profile not found.')
        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        course = validated_data['course']
        booking = Booking.objects.create(
            student=request.user.student_profile,
            mentor=course.mentor,
            course=course,
            session_date=validated_data['session_date'],
            status='pending',
        )
        return booking


class BookingDetailSerializer(serializers.ModelSerializer):
    course = CourseDetailSerializer(read_only=True)
    student_name = serializers.SerializerMethodField()
    mentor_name = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = ['id', 'student', 'mentor', 'course', 'session_date', 'status', 'created_at', 'updated_at', 'student_name', 'mentor_name']

    def get_student_name(self, obj):
        return obj.student.user.get_full_name() or obj.student.user.username

    def get_mentor_name(self, obj):
        return obj.mentor.user.get_full_name() or obj.mentor.user.username
