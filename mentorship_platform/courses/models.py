from django.db import models
from django.utils.text import slugify
from accounts.models import Mentor


class Course(models.Model):
    CATEGORY_CHOICES = [
        ('programming', 'Programming'),
        ('data_science', 'Data Science'),
        ('design', 'Design'),
        ('business', 'Business'),
        ('marketing', 'Marketing'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()
    mentor = models.ForeignKey(Mentor, on_delete=models.CASCADE, related_name='courses')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    duration = models.CharField(max_length=100, help_text='e.g., 4 weeks, 10 hours')
    thumbnail = models.ImageField(upload_to='courses/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
