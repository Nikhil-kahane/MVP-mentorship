from django.shortcuts import render, get_object_or_404
from .models import Course


def home_view(request):
    featured_courses = Course.objects.select_related('mentor__user').all()[:6]
    return render(request, 'home.html', {'featured_courses': featured_courses})


def course_list_view(request):
    courses = Course.objects.select_related('mentor__user').all()
    search_query = request.GET.get('q', '')
    category = request.GET.get('category', '')

    if search_query:
        courses = courses.filter(title__icontains=search_query)
    if category:
        courses = courses.filter(category=category)

    categories = Course.CATEGORY_CHOICES
    return render(request, 'courses/course_list.html', {
        'courses': courses,
        'search_query': search_query,
        'selected_category': category,
        'categories': categories,
    })


def course_detail_view(request, slug):
    course = get_object_or_404(Course.objects.select_related('mentor__user'), slug=slug)
    return render(request, 'courses/course_detail.html', {'course': course})
