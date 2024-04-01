#!/usr/bin/python3

import json
import requests

def pull_demo_data():
    url = "localhost:8000/apps/20" 
    try:
        response = requests.get(url)
        if response.status_code == 200:
            json_data = response.json()
            return json_data
        else:
            print(f"Request failed with status code: {response.status_code}")
            return None
    except requests.RequestException as e:
        print(f"An error occurred: {e}")
        return None

def load_data():
    json_file = open("./demoDataUnsorted.json")
    json_data = json_file.read()
    json_file.close()
    json_data = json.loads(json_data)
    print(len(json_data))
    return json_data

def compose():
    return alphabetize(load_data())

def alphabetize(json):
    alphabetized = {"unknown":{}}
    for i in range(26):
        asciiNum = i+97
        alphabetized[chr(asciiNum)] = {}

    for z in range(10):
        alphabetized[str(z)] = {}

    for j in range(len(json)):
        currName = json[j]["app_name"].lower()
        currId = int(json[j]["app_id"])
        try:
            alphabetized[currName[0]][currName] = currId
        except KeyError:
            alphabetized["unknown"][currName] = currId
    return alphabetized

def write_file():
    data = json.dumps(compose())
    cache = open("./autofillDataSorted.json", "w")
    cache.write(data)
    cache.close()



if __name__ == "__main__":
    write_file()