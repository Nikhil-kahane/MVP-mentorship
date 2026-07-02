from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, Student, Mentor


class StudentRegistrationForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    email = forms.EmailField(required=True)
    phone_number = forms.CharField(max_length=20, required=False)
    bio = forms.CharField(widget=forms.Textarea(attrs={'rows': 3}), required=False)
    education = forms.CharField(max_length=255, required=False)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'phone_number', 'password1', 'password2']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = 'student'
        user.email = self.cleaned_data['email']
        user.phone_number = self.cleaned_data.get('phone_number', '')
        if commit:
            user.save()
            Student.objects.create(
                user=user,
                bio=self.cleaned_data.get('bio', ''),
                education=self.cleaned_data.get('education', ''),
            )
        return user


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone_number', 'profile_image']
        widgets = {
            'profile_image': forms.FileInput(),
        }


class StudentProfileForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = ['bio', 'education']
        widgets = {
            'bio': forms.Textarea(attrs={'rows': 4}),
        }


class MentorProfileForm(forms.ModelForm):
    class Meta:
        model = Mentor
        fields = ['bio', 'expertise', 'experience_years', 'linkedin_url']
        widgets = {
            'bio': forms.Textarea(attrs={'rows': 4}),
        }
