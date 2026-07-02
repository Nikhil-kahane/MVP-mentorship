from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Student, Mentor

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone_number', 'profile_image', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'role']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        if user.role == 'student':
            Student.objects.create(user=user)
        elif user.role == 'mentor':
            Mentor.objects.create(user=user)
        return user


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['bio', 'education']


class MentorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mentor
        fields = ['expertise', 'experience_years', 'bio', 'linkedin_url']


class UserProfileSerializer(serializers.ModelSerializer):
    student_profile = StudentProfileSerializer(read_only=True)
    mentor_profile = MentorProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone_number', 'profile_image', 'student_profile', 'mentor_profile']
        read_only_fields = ['id', 'role']


class UpdateUserSerializer(serializers.ModelSerializer):
    student_profile = StudentProfileSerializer(required=False)
    mentor_profile = MentorProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone_number', 'profile_image', 'student_profile', 'mentor_profile']

    def update(self, instance, validated_data):
        student_data = validated_data.pop('student_profile', None)
        mentor_data = validated_data.pop('mentor_profile', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if student_data and hasattr(instance, 'student_profile'):
            for attr, value in student_data.items():
                setattr(instance.student_profile, attr, value)
            instance.student_profile.save()

        if mentor_data and hasattr(instance, 'mentor_profile'):
            for attr, value in mentor_data.items():
                setattr(instance.mentor_profile, attr, value)
            instance.mentor_profile.save()

        return instance
