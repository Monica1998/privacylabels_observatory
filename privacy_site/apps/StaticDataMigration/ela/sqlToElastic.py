from migrate import writeGraphData
from importjson import buildDataJson
from elasticTransfer import buildDataJson as elastic

if __name__ == "__main__":
    for i in range (1, 70):
        writeGraphData(i)
        buildDataJson(i)
        elastic(i)