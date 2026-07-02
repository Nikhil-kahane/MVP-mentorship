from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import Course
from .serializers import CourseListSerializer, CourseDetailSerializer
from accounts.models import Mentor


class CourseListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CourseListSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Course.objects.select_related('mentor__user').all()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class CourseDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = CourseDetailSerializer
    lookup_field = 'slug'
    queryset = Course.objects.select_related('mentor__user')


class HomeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        featured_courses = Course.objects.select_related('mentor__user').all()[:6]
        serializer = CourseListSerializer(featured_courses, many=True)
        return Response({
            'featured_courses': serializer.data
        })


class CategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response([
            {'value': choice[0], 'label': choice[1]}
            for choice in Course.CATEGORY_CHOICES
        ])
