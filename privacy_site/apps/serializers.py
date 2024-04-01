from rest_framework import serializers
from .models import (App, Purpose, Data_Category, Data_Type, Privacy_Type)


class DataTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Data_Type
        fields = ("data_category", "data_type")

class DataCategorySerializer(serializers.ModelSerializer):
    datatypes = DataTypeSerializer(many=True, read_only=True)

    class Meta:
        model = Data_Category
        fields = ("privacy_type", "purpose", "data_category", "datatypes")

class PurposeSerializer(serializers.ModelSerializer):
    datacategories = DataCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Purpose
        fields = ("privacy_type", "purpose", "datacategories")


class PrivacyTypeSerializer(serializers.ModelSerializer):
    purposes = PurposeSerializer(many=True, read_only=True)

    class Meta:
        model = Privacy_Type
        fields = ("app", "privacy_type", "purposes")

class OtherDataTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Data_Type
        fields = ("data_type", )

class OtherDataCategorySerializer(serializers.ModelSerializer):
    datatypes = OtherDataTypeSerializer(many=True, read_only=True)

    class Meta:
        model = Data_Category
        fields = ("data_category", "datatypes")


class OtherPurposeSerializer(serializers.ModelSerializer):
    datacategories = OtherDataCategorySerializer(many=True, read_only=True)
    class Meta:
        model = Purpose
        fields = ("purpose", "datacategories")


class OtherPrivacyTypeSerializer(serializers.ModelSerializer):
    purposes = OtherPurposeSerializer(many=True, read_only=True)
    class Meta:
        model = Privacy_Type
        fields = ("privacy_type", "purposes")

class OtherAppSerializer(serializers.ModelSerializer):
    privacy_types = OtherPrivacyTypeSerializer(many=True, read_only=True)
    class Meta:
        model = App
        fields = ("run_id",
        "app_id",
        "app_name",
        "privacy_types")

class AppSerializer(serializers.ModelSerializer):

    privacy_types = PrivacyTypeSerializer(many=True, read_only=True)
    class Meta:
        model = App
        fields = (
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
        "insert_timestamp",
        "privacy_types"
        )

class IDSerializer(serializers.Serializer):
    app_id = serializers.IntegerField()


class AppListSerializer(serializers.ModelSerializer):
    class Meta:
        model = App
        fields = ("app_id", "app_name", "app_url")

class totalCount(serializers.Serializer):
    run_id = serializers.IntegerField()
    apps_with = serializers.IntegerField()
    apps_without = serializers.IntegerField()

class dataCount(serializers.Serializer):
    linked = serializers.IntegerField()
    not_linked = serializers.IntegerField()
    not_collected = serializers.IntegerField()
    track = serializers.IntegerField()

class runCount(serializers.Serializer):
    run_total = serializers.IntegerField()

class appHistory(serializers.Serializer):
    run_id = serializers.CharField()


    