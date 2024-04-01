import json


# Iterate through the keys and format each group of apps
def buildDataJson(run_id):
    with open(f'./json/run{run_id}.json', 'r') as file:
        data = json.load(file)
    
    number = 0

    formatted_data = ""
    for key, app_list in data.items():
        if app_list is not None:
            formatted_data += "\n".join([json.dumps(entry) for entry in app_list]) + "\n"
        else:
            print("Run " + str(number) + " failed")
        print("Run " + str(number))
        number = number + 1

    graphData = open(f"./test/run{run_id}.json", "w")
    graphData.write(formatted_data)
    graphData.close()

if __name__ == "__main__":
    buildDataJson()