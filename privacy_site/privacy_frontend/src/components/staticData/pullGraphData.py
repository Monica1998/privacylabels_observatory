#!/usr/bin/python3

import json
import requests

num_runs = 69
def pullAppsWithTags(run_id):
    url = 'http://localhost:8000/count_with/' + str(run_id)
    try:
        response = requests.get(url)
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

def pullAppsWithoutTags(run_id):
    url = 'http://localhost:8000/count_without/' + str(run_id)
    try:
        response = requests.get(url)
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

def buildDataJson():
    dataDict = {}
    for i in range(num_runs):
        dataDict[i + 1] = {}
        dataDict[i+1]["apps_with"] = pullAppsWithTags(i+1)
        dataDict[i+1]["apps_without"] = pullAppsWithoutTags(i+1)
        print("finished run " + str(i+1))
    return {"data":dataDict}

def writeGraphData():
    data = json.dumps(buildDataJson())
    graphData = open("tagDichotomyGraph.json", "w")
    graphData.write(data)
    graphData.close()
    print(data)

if __name__ == "__main__":
    writeGraphData()