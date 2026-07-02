import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from accounts.models import User, Student, Mentor
from courses.models import Course
from bookings.models import Booking
from payments.models import PaymentRecord


STUDENT_DATA = [
    {'username': 'student_alice', 'first_name': 'Alice', 'last_name': 'Johnson', 'email': 'alice@example.com', 'education': 'B.Sc Computer Science', 'bio': 'Aspiring software developer passionate about web technologies.'},
    {'username': 'student_bob', 'first_name': 'Bob', 'last_name': 'Smith', 'email': 'bob@example.com', 'education': 'B.E. Electronics', 'bio': 'Engineer transitioning to data science.'},
    {'username': 'student_carol', 'first_name': 'Carol', 'last_name': 'Williams', 'email': 'carol@example.com', 'education': 'MBA', 'bio': 'Business professional learning digital marketing.'},
    {'username': 'student_dave', 'first_name': 'David', 'last_name': 'Brown', 'email': 'dave@example.com', 'education': 'Self-taught', 'bio': 'Freelancer looking to improve design skills.'},
    {'username': 'student_emma', 'first_name': 'Emma', 'last_name': 'Davis', 'email': 'emma@example.com', 'education': 'B.Sc Mathematics', 'bio': 'Math graduate exploring machine learning.'},
]

MENTOR_DATA = [
    {'username': 'mentor_james', 'first_name': 'James', 'last_name': 'Wilson', 'email': 'james@example.com', 'expertise': 'Python & Django', 'experience_years': 8, 'bio': 'Senior backend developer with 8 years building scalable web applications.'},
    {'username': 'mentor_sarah', 'first_name': 'Sarah', 'last_name': 'Taylor', 'email': 'sarah@example.com', 'expertise': 'Data Science & ML', 'experience_years': 6, 'bio': 'Data scientist specializing in machine learning and predictive analytics.'},
    {'username': 'mentor_michael', 'first_name': 'Michael', 'last_name': 'Anderson', 'email': 'michael@example.com', 'expertise': 'UI/UX Design', 'experience_years': 7, 'bio': 'Product designer with experience at leading tech companies.'},
    {'username': 'mentor_lisa', 'first_name': 'Lisa', 'last_name': 'Martinez', 'email': 'lisa@example.com', 'expertise': 'Digital Marketing', 'experience_years': 5, 'bio': 'Marketing strategist helping businesses grow their online presence.'},
    {'username': 'mentor_robert', 'first_name': 'Robert', 'last_name': 'Garcia', 'email': 'robert@example.com', 'expertise': 'Cloud & DevOps', 'experience_years': 9, 'bio': 'DevOps engineer with deep expertise in AWS, Docker, and Kubernetes.'},
]

COURSE_DATA = [
    {'title': 'Python for Beginners', 'category': 'programming', 'duration': '6 weeks', 'description': 'A comprehensive introduction to Python programming. Learn variables, data structures, functions, and OOP fundamentals through hands-on projects.'},
    {'title': 'Django Web Development', 'category': 'programming', 'duration': '8 weeks', 'description': 'Build full-stack web applications with Django. Covers models, views, templates, REST APIs, authentication, and deployment.'},
    {'title': 'Data Science with Python', 'category': 'data_science', 'duration': '10 weeks', 'description': 'Master data analysis and visualization with Pandas, NumPy, and Matplotlib. Work on real-world datasets and projects.'},
    {'title': 'Machine Learning Fundamentals', 'category': 'data_science', 'duration': '12 weeks', 'description': 'Introduction to machine learning algorithms including regression, classification, clustering, and neural networks using scikit-learn.'},
    {'title': 'UI/UX Design Principles', 'category': 'design', 'duration': '6 weeks', 'description': 'Learn user-centered design principles, wireframing, prototyping with Figma, and usability testing methodologies.'},
    {'title': 'Figma for Designers', 'category': 'design', 'duration': '4 weeks', 'description': 'Master Figma for creating stunning UI designs, interactive prototypes, and design systems for web and mobile.'},
    {'title': 'Digital Marketing Strategy', 'category': 'marketing', 'duration': '6 weeks', 'description': 'Comprehensive guide to SEO, SEM, social media marketing, content strategy, and analytics for modern businesses.'},
    {'title': 'AWS Cloud Practitioner', 'category': 'programming', 'duration': '8 weeks', 'description': 'Prepare for the AWS Certified Cloud Practitioner exam. Covers EC2, S3, RDS, Lambda, VPC, and cloud architecture best practices.'},
    {'title': 'Docker & Kubernetes', 'category': 'programming', 'duration': '6 weeks', 'description': 'Containerize applications with Docker and orchestrate them with Kubernetes. Covers deployment, scaling, and monitoring in production.'},
    {'title': 'Business Analytics', 'category': 'business', 'duration': '5 weeks', 'description': 'Use data analytics to drive business decisions. Learn Excel, SQL, Tableau, and key business metrics for actionable insights.'},
]


class Command(BaseCommand):
    help = 'Seed the database with sample data for development and testing'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        mentors = []
        for data in MENTOR_DATA:
            user, created = User.objects.get_or_create(
                username=data['username'],
                defaults={
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'email': data['email'],
                    'role': 'mentor',
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(f'  Created mentor user: {user.username}')

            mentor, _ = Mentor.objects.get_or_create(
                user=user,
                defaults={
                    'expertise': data['expertise'],
                    'experience_years': data['experience_years'],
                    'bio': data['bio'],
                }
            )
            mentors.append(mentor)

        self.stdout.write(self.style.SUCCESS(f'Created {len(mentors)} mentors'))

        courses = []
        mentor_cycle = mentors[:]
        for i, data in enumerate(COURSE_DATA):
            mentor = mentor_cycle[i % len(mentor_cycle)]
            course, created = Course.objects.get_or_create(
                title=data['title'],
                defaults={
                    'description': data['description'],
                    'mentor': mentor,
                    'category': data['category'],
                    'duration': data['duration'],
                }
            )
            if created:
                self.stdout.write(f'  Created course: {course.title}')
            courses.append(course)

        self.stdout.write(self.style.SUCCESS(f'Created {len(courses)} courses'))

        students = []
        for data in STUDENT_DATA:
            user, created = User.objects.get_or_create(
                username=data['username'],
                defaults={
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'email': data['email'],
                    'role': 'student',
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(f'  Created student user: {user.username}')

            student, _ = Student.objects.get_or_create(
                user=user,
                defaults={
                    'bio': data['bio'],
                    'education': data['education'],
                }
            )
            students.append(student)

        self.stdout.write(self.style.SUCCESS(f'Created {len(students)} students'))

        bookings_created = 0
        for i in range(10):
            student = students[i % len(students)]
            course = courses[i % len(courses)]
            session_date = timezone.now() + timedelta(days=random.randint(1, 30))

            booking, created = Booking.objects.get_or_create(
                student=student,
                course=course,
                defaults={
                    'mentor': course.mentor,
                    'session_date': session_date,
                    'status': random.choice(['booked', 'pending', 'completed']),
                }
            )
            if created:
                bookings_created += 1

                if booking.status in ('booked', 'completed'):
                    import uuid
                    reference = f'PAY-{uuid.uuid4().hex[:12].upper()}'
                    PaymentRecord.objects.get_or_create(
                        booking=booking,
                        defaults={
                            'payment_reference': reference,
                            'amount': 99.99,
                            'payment_status': 'success',
                        }
                    )

        self.stdout.write(self.style.SUCCESS(f'Created {bookings_created} bookings'))

        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write('  Created admin user: admin / admin123')

        self.stdout.write(self.style.SUCCESS('\nDatabase seeded successfully!'))
        self.stdout.write('Login credentials:')
        self.stdout.write('  Admin:   admin / admin123')
        self.stdout.write('  Student: student_alice / password123')
        self.stdout.write('  Mentor:  mentor_james / password123')
