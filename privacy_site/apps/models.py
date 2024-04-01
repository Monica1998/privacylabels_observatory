from django.db import models


# Create your models here.
class App(models.Model):
    id = models.IntegerField(primary_key=True)
    run_id = models.IntegerField(blank=True, null=True)
    app_id = models.CharField(max_length=10, default=1029384234, blank=True, null=True)
    app_version = models.CharField(max_length=50, blank=True, null=True)
    app_name = models.CharField(max_length=1000, blank=True, null=True)
    app_url = models.CharField(max_length=1000, blank=True, null=True)
    country_code = models.CharField(max_length=5, blank=True, null=True)
    app_flavor = models.CharField(max_length=20, default="None")
    app_size = models.BigIntegerField(blank=True, null=True)
    app_type = models.CharField(max_length=20, blank=True, null=True)
    artist_name = models.CharField(max_length=300, blank=True, null=True)
    distribution_kind = models.CharField(max_length=20, blank=True, null=True)
    user_rating_value = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)
    user_rating_count = models.IntegerField(blank=True, null=True)
    user_rating_label = models.CharField(max_length=20, blank=True, null=True)
    app_store_position = models.IntegerField(blank=True, null=True)
    app_store_genre_name = models.CharField(max_length=200, blank=True, null=True)
    app_store_genre_code = models.IntegerField(blank=True, null=True)
    app_store_chart = models.CharField(max_length=30, blank=True, null=True)
    content_rating = models.CharField(max_length=10, blank=True, null=True)
    version_release_date = models.CharField(max_length=40, blank=True, null=True)
    release_date = models.CharField(max_length=40, blank=True, null=True)
    privacy_policy_url = models.CharField(max_length=300, blank=True, null=True)
    has_in_app_purchases = models.SmallIntegerField(blank=True, null=True)
    seller = models.CharField(max_length=300, blank=True, null=True)
    price_formatted = models.CharField(max_length=10, blank=True, null=True)
    price = models.IntegerField(blank=True, null=True)
    currency_code = models.CharField(max_length=10, blank=True, null=True)
    insert_timestamp = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'app'
        ordering = ['app_id']

class App_Genre(models.Model):
    id = models.IntegerField(primary_key=True)
    app_id = models.ForeignKey(App, on_delete=models.PROTECT)
    genre_code = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'app_genre'

#class Review(models.Model):
#    id = models.IntegerField(primary_key=True)
#    app_id = models.ForeignKey(App, on_delete=models.CASCADE)
#    review_id = models.IntegerField()
#    review_date = models.CharField(max_length=40)
#    review_rating = models.IntegerField()
#    review_title= models.CharField(max_length=3000)
#    review_text= models.TextField()
#    review_user_name = models.CharField(max_length=40)
#    review_is_edited = models.SmallIntegerField()

#   class Meta:
#        managed = False
#        db_table = 'app'

class Privacy_Type(models.Model):
    id = models.IntegerField(primary_key=True)
    app = models.ForeignKey(App, related_name="privacy_types", on_delete= models.PROTECT)
    privacy_type = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'privacy_type'

class Purpose(models.Model):
    id = models.IntegerField(primary_key=True)
    privacy_type = models.ForeignKey(Privacy_Type, related_name="purposes", on_delete=models.PROTECT)
    purpose = models.CharField(max_length=200)

    class Meta:
        managed = False
        db_table = 'purpose'

class Data_Category(models.Model):
    id = models.IntegerField(primary_key=True)
    privacy_type = models.ForeignKey(Privacy_Type, on_delete= models.PROTECT, related_name="datacategories", blank=True, null=True)
    purpose = models.ForeignKey(Purpose, on_delete=models.PROTECT, related_name="datacategories", blank=True, null=True)
    data_category = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'data_category'

class Data_Type(models.Model):
    id = models.IntegerField(primary_key=True)
    data_category = models.ForeignKey(Data_Category, related_name="datatypes", on_delete=models.PROTECT)
    data_type = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'data_type'

