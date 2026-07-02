from rest_framework import serializers
from .models import Course
from accounts.serializers import UserSerializer


class MentorMinimalSerializer(serializers.Serializer):
    user = UserSerializer()
    expertise = serializers.CharField()
    experience_years = serializers.IntegerField()


class CourseSerializer(serializers.ModelSerializer):
    mentor = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'description', 'mentor', 'category', 'duration', 'thumbnail', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']

    def get_mentor(self, obj):
        return {
            'id': obj.mentor.id,
            'user': {
                'id': obj.mentor.user.id,
                'name': obj.mentor.user.get_full_name() or obj.mentor.user.username,
                'profile_image': obj.mentor.user.profile_image.url if obj.mentor.user.profile_image else None,
            },
            'expertise': obj.mentor.expertise,
        }


class CourseListSerializer(serializers.ModelSerializer):
    mentor_name = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'description', 'category', 'duration', 'thumbnail', 'mentor_name', 'created_at']

    def get_mentor_name(self, obj):
        return obj.mentor.user.get_full_name() or obj.mentor.user.username


class CourseDetailSerializer(serializers.ModelSerializer):
    mentor = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'description', 'mentor', 'category', 'duration', 'thumbnail', 'created_at', 'updated_at']

    def get_mentor(self, obj):
        return {
            'id': obj.mentor.id,
            'user': {
                'id': obj.mentor.user.id,
                'name': obj.mentor.user.get_full_name() or obj.mentor.user.username,
                'email': obj.mentor.user.email,
                'profile_image': obj.mentor.user.profile_image.url if obj.mentor.user.profile_image else None,
            },
            'expertise': obj.mentor.expertise,
            'experience_years': obj.mentor.experience_years,
            'bio': obj.mentor.bio,
            'linkedin_url': obj.mentor.linkedin_url,
        }
