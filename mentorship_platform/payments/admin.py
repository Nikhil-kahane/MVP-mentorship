from django.contrib import admin
from .models import PaymentRecord


@admin.register(PaymentRecord)
class PaymentRecordAdmin(admin.ModelAdmin):
    list_display = ['payment_reference', 'booking', 'amount', 'payment_status', 'created_at']
    list_filter = ['payment_status', 'created_at']
    search_fields = ['payment_reference', 'booking__student__user__username']
    readonly_fields = ['payment_reference', 'created_at']
