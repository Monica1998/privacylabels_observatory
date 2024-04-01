from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from apps import views
import debug_toolbar

router = routers.DefaultRouter()
router.register(r"apps", views.AppView, "app")
router.register(r"privacytypes", views.PrivacyView, "privacy_type")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("__debug__/", include(debug_toolbar.urls)),
    path("app_id/<int:id>", views.app_on_id),
    path("app/<str:name>", views.app_on_name),
    path("app_by_id/<str:name>", views.app_id_list),
    path("app_store_icon/<str:url_encoded>", views.app_icon_url),
    path("count_with/<int:run_id>", views.count_apps_with_data),
    path("count_without/<int:run_id>", views.count_apps_without_data),
    path("apps/<int:run_id>", views.multiple_apps_return),
    path("test/<int:run_id>", views.count_total),
    path("reduced/<int:id>", views.reduced_app_on_id),
    path("app_history/<int:id>", views.app_history),
    path("app_history_diffs/<int:id>", views.get_diffs),
    path("app_privacy_count/<int:run_id>", views.apps_privacy_data),
    path("search/<str:name>/<int:position>", views.generate_five_apps),
    path("database/<int:run_id>/<int:position>", views.get_hundred_apps),
    path("download/<int:run_id>", views.download_run_data),
    path("run_numbers", views.run_numbers),
    path("purpose_data", views.purpose_data),
    path("get_diffs/<int:id>", views.get_diffs),
    path("hundred_apps/<int:position>/<int:run_id>", views.get_thousand_apps_with_data),
    path("count/<int:run_id>", views.count)
]
