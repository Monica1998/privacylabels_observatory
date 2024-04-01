import requests
import elasticTransfer
import json
import os

def pullApps(run_id):
    url = 'http://localhost:8000/hundred_apps/0/' + str(run_id)
    try:
        response = requests.get(url)
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

def buildDataJsonTwo(run_id):
    with open(f'./middle/transfer{run_id}.json', 'r') as file:
        data = json.load(file)
    
    number = 0

    formatted_data = ""
    for key, app_list in data.items():
        print(key)
        print(app_list)
        if app_list is not None:
            formatted_data += "\n".join([json.dumps(app_list)]) + "\n"
        else:
            print("Run " + str(number) + " failed")
        print("Run " + str(number))
        number = number + 1

    graphData = open(f"./runs/transfer{run_id}.json", "w")
    graphData.write(formatted_data)
    graphData.close()

if __name__ == "__main__":
    for i in range(1, 70):
        dataDict = pullApps(i)
        data = json.dumps(dataDict)
        graphData = open(f"./middle/transfer{i}.json", "w")
        graphData.write(data)
        graphData.close()
        buildDataJsonTwo(i)
        elasticTransfer.buildDataJsonTwo(i)
        os.remove(f"./middle/transfer{i}.json")
        os.remove(f"./runs/transfer{i}.json")
        print("finished run " + str(i))



