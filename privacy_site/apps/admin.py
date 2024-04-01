from django.contrib import admin
from .models import (
    App, Privacy_Type, Data_Category, Purpose, Data_Type
)
from admin_cursor_paginator import CursorPaginatorAdmin
from .paginator import Paginator


# Register your models here.

class PrivacyTypeInLine(admin.TabularInline):
    model = Privacy_Type


class AppAdmin(CursorPaginatorAdmin):
    list_display = (
        "id",
        "run_id",
        "app_id",
        "app_version",
        "app_name",
        "app_url",
        "country_code",
        "app_flavor",
        "app_size",
        "app_type",
        "artist_name",
        "distribution_kind",
        "user_rating_value", 
        "user_rating_count",
        "user_rating_label",
        "app_store_position",
        "app_store_genre_name",
        "app_store_genre_code",
        "app_store_chart",
        "content_rating",
        "version_release_date",
        "release_date",
        "privacy_policy_url",
        "has_in_app_purchases",
        "seller",
        "price_formatted",
        "price",
        "currency_code",
        "insert_timestamp"
    )

    #inlines = [PrivacyTypeInLine, ]

    cursor_ordering_field = 'id'

class PrivacyTypeAdmin(CursorPaginatorAdmin):
    list_display = (
        'id', 'app', 'privacy_type'
    )
    cursor_ordering_field = 'id'

class PurposeAdmin(CursorPaginatorAdmin):
    list_display = (
        'id', 'privacy_type', 'purpose'
    )
    cursor_ordering_field = 'id'

class DataCategoryAdmin(CursorPaginatorAdmin):
    list_display = (
        'id', 'privacy_type', 'purpose', 'data_category'
    )
    cursor_ordering_field = 'id'

class DataTypeAdmin(CursorPaginatorAdmin):
    list_display = (
        'id', 'data_category', 'data_type'
    )

    cursor_ordering_field = 'id'


admin.site.register(App, AppAdmin)
admin.site.register(Privacy_Type, PrivacyTypeAdmin)
admin.site.register(Purpose, PurposeAdmin)
admin.site.register(Data_Category, DataCategoryAdmin)
admin.site.register(Data_Type, DataTypeAdmin)
