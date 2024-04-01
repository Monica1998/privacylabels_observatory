from django.shortcuts import render
import math
from django.core import serializers
from django.http import (JsonResponse, HttpResponseNotFound)
from rest_framework import viewsets
from django.http import HttpResponse
from .serializers import (dataCount, appHistory, OtherAppSerializer, AppSerializer, PrivacyTypeSerializer, IDSerializer, AppListSerializer, totalCount)
from .models import (App, Privacy_Type, Purpose)
from .paginator import Paginator
from .utils import scrapeAppStoreIcon, compareDifferences
from django.core import serializers
from django_filters.rest_framework import DjangoFilterBackend


class AppView(viewsets.ModelViewSet):
    serializer_class = AppSerializer
    queryset = App.objects.all()
    pagination_class = Paginator

    filterset_fields = ['app_name', 'run_id']


class PrivacyView(viewsets.ModelViewSet):
    serializer_class = PrivacyTypeSerializer
    queryset = Privacy_Type.objects.all()
    pagination_class = Paginator

def reduced_app_on_id(request, id):
    try:
        app = App.objects.get(app_id=id, run_id=69)
    except App.DoesNotExist:
        return HttpResponseNotFound("<h1>Page not found</h1>")
    
    serializers = OtherAppSerializer(app)
    return JsonResponse(serializers.data)

def app_on_id(request, id):
    retries = 3
    for i in range(retries):
        try:
            app = App.objects.get(app_id=id, run_id=69-i)
            break
        except App.DoesNotExist:
            if(i == 2):
                return HttpResponseNotFound("<h1>Page not found</h1>")
            else:
                continue
    
    serializers = AppSerializer(app)
    return JsonResponse(serializers.data)

def app_on_name(request, name):
    try:
        app = App.objects.filter(app_name__icontains=name, run_id=68)
        if app:
            app = app[0:5]
    except App.DoesNotExist:
        return HttpResponseNotFound("<h1>Page not found</h1>")
    
    app_list = AppListSerializer(app, many=True)
    return JsonResponse(app_list.data, safe=False)

def app_id_list(request, name):
    try:
        app = App.objects.filter(app_name__icontains=name).all()[:10]

    except App.DoesNotExist:
        return HttpResponseNotFound("<h1>Page not found</h1>")
    
    serializers = IDSerializer(app, many=True)
    return JsonResponse(serializers.data, safe=False)

def multiple_apps_return(request, run_id):
    try:
        app = App.objects.filter(run_id=run_id).order_by("-user_rating_count").all()[:250]
    except App.DoesNotExist:
        return HttpResponseNotFound("<h1>Page not found</h1>")

    serializer = AppListSerializer(app, many=True)
    return JsonResponse(serializer.data, safe=False)

def app_icon_url(request, url_encoded):
    result = scrapeAppStoreIcon(url_encoded)
    html = result
    if result == None:
       html = "failed to scrape icon" 
    return JsonResponse({'url': html})

def count_apps_with_data(request, run_id):
    app = Privacy_Type.objects.filter(app__run_id=run_id).values('app').distinct().count()
    return JsonResponse(app, safe=False)
   # app_json_format = {
    #    'count': app
    #}
    
def app_history(request, id):
    try:
        app = App.objects.filter(app_id=id)
    except App.DoesNotExist:
        return HttpResponseNotFound("<h1>Page not found</h1>")

    serializer = AppSerializer(app, many=True)
    return JsonResponse(serializer.data, safe=False)

def count_apps_without_data(request, run_id):
    app = App.objects.filter(run_id=run_id).count()
    privacy_type = Privacy_Type.objects.filter(app__run_id=run_id).values('app').distinct().count()
    return JsonResponse(app-privacy_type, safe=False)


def count_total(request, run_id):
    dataTwo = []
    count = 69
    for a in range(1, count+1):
        apps_with = Privacy_Type.objects.filter(app__run_id=a).values('app').distinct().count()
        in_between = App.objects.filter(run_id=a).count()
        apps_without = in_between - apps_with
        run_id = a
        item = {'run_id': run_id, 'apps_with': apps_with, 'apps_without': apps_without}
        dataTwo.append(item)

    
    serializer = totalCount(dataTwo, many=True)
    return JsonResponse(serializer.data, safe=False)


def get_diffs(request, id):
    try:
        app = App.objects.filter(app_id=id) # get app history
    except App.DoesNotExist:
        return HttpResponseNotFound("<h1>Page not found</h1>") 
    app_size = app.count()
    app = list(app)
    history = {"initial":AppSerializer(app[0]).data, "current":AppSerializer(app[app_size - 1]).data}
    diffs = []
    currRun = {}
    for i in range(app_size): #iterate through all runs in app history
        run = app[i]
        serializer = AppSerializer(run)
        run = serializer.data  
        date = fixTimestamp(run["insert_timestamp"])
        if i == 0:
            currRun = run
        elif i < app_size - 1:
            currDiff = compareDifferences(currRun, run) #util func gets added/removed between 2 runs
            print(i)
            if len(currDiff["added"]) > 0 or len(currDiff["removed"]) > 0:
                newDiff = {"date":date, "diff":currDiff, "full_data":run["privacy_types"]}
                diffs.append(newDiff)
                currRun = run
    if(len(diffs) == 0):
        diffs = "no changes"
    history["diffs"] = diffs
    return JsonResponse(history)

def fixTimestamp(timestamp):
    return timestamp[0:timestamp.index("T")]

def apps_privacy_data(request, run_id):
    linked= Privacy_Type.objects.filter(app__run_id=run_id, privacy_type="DATA_LINKED_TO_YOU").count()
    not_linked = Privacy_Type.objects.filter(app__run_id=run_id, privacy_type="DATA_NOT_LINKED_TO_YOU").count()
    not_collected = Privacy_Type.objects.filter(app__run_id=run_id, privacy_type="DATA_NOT_COLLECTED").count()
    track = Privacy_Type.objects.filter(app__run_id=run_id, privacy_type="DATA_USED_TO_TRACK_YOU").count()
    item = {
        "linked": linked,
        "not_linked": not_linked,
        "not_collected": not_collected,
        "track": track
    }

    serializer = dataCount(item)
    return JsonResponse(serializer.data)

def run_numbers(request):
    data = {}
    for i in range(1, 70):
        count = App.objects.filter(run_id = i).order_by().count()
        print(count)
        data[f'run{i}'] = count

    return JsonResponse(data)

def purpose_data(request):
    # Need to create a dictionary that stores all the different purpose types in order to store them
    data = {}
    for i in range(1, 70):
        count = Purpose.objects.filter(purpose = "ANALYTICS", privacy_type__privacy_type="DATA_LINKED_TO_YOU").order_by().count()
        print(count)
        data[f'run{i}'] = count

    return JsonResponse(data)


def generate_five_apps(request, position, name):
    num_position = position * 5;
    #print(num_position)
    try:
        #limit this query below instead of doing pagination manually
        app = App.objects.filter(app_name__icontains=name, run_id=68).order_by()[num_position:num_position+20]
        #i`f app:`
        #    app = app[num_position:num_position+5]
    except App.DoesNotExist:
        return HttpResponseNotFound("<h1>Page not found</h1>")


    if  ((len(app) < 20)):

        app_list = AppListSerializer(app, many=True)
        newdict = app_list.data

        print(newdict)
        return JsonResponse(newdict, safe=False)


    app_list = AppListSerializer(app, many=True)
    return JsonResponse(app_list.data, safe=False)


def get_hundred_apps(request, position, run_id):
    num_position = position * 100; 
    if(run_id < 1 or run_id > 69 or position < 0):
        return HttpResponseNotFound("<h1>Page not found</h1>")

    total = App.objects.filter(run_id=run_id).count()
    total = total/100
    print(total)
    

    try:
        app = App.objects.filter(run_id=run_id).order_by()[num_position:num_position+100]
    except App.DoesNotExist:
        return HttpResponseNotFound("<h1>Page not found</h1>")

    app_list = AppSerializer(app, many=True)
    return JsonResponse(app_list.data, safe=False)

def get_thousand_apps_with_data(request, position, run_id):
    
    dict = {}
    index = 0
    pos = position
    query = App.objects.filter(run_id=run_id).order_by()
    while(index < 1000):
        try:
            app = query[pos]
            pos+=1
            app_two = AppSerializer(app)
            app_two = app_two.data
            print(app_two["privacy_types"])
            #index += 1
            if(len(app_two["privacy_types"]) > 0):
                dict[index] = app_two
                index = index+1
                print(index)
        except App.DoesNotExist:
            return HttpResponseNotFound("<h1>Page not found</h1>")
    print(dict)
    return JsonResponse(dict)

def count(request, run_id):
    total_apps = App.objects.filter(run_id=run_id).order_by().count()
    total_apps /= 100
    total_apps = math.ceil(total_apps)
    return JsonResponse(total_apps, safe=False)

def download_run_data(request, run_id):
    try:
        app = App.objects.filter(run_id=run_id).order_by()[0:100]
    except App.DoesNotExist:
        return HttpResponseNotFound("<h1>Page not found</h1>")

    json_str = serializers.serialize('json', app)
    response = JsonResponse(json_str, safe=False)
    response['Content-Disposition'] = 'attachment; filename=export.json'
    return response

