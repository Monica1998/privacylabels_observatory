import requests
from bs4 import BeautifulSoup
import re
from langdetect import detect

#----------- fetch app store icon ----------
def htmlRequest(url):
    try:
        # Send an HTTP GET request to the URL
        response = requests.get("https://apps.apple.com/" + url)

        # Check if the request was successful
        response.raise_for_status()

        # Parse the page source with BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        # Return the page source as a string
        return soup.prettify()

    except requests.exceptions.RequestException as e:
        print("Error during the request:", e)
        return None
    except Exception as e:
        print("Error during parsing:", e)
        return None

def decode(url):
    delimeted = url.split("+")
    return "/".join(delimeted)

def parseResponseForUrl(html):
    regex = r"ios-app-icon(.*?)srcset=\"(.*?\.webp)"
    result = re.search(regex, html, re.DOTALL)
    if result:
        found_text = result.group(2)
        return found_text
    else:
        return html

def lobotomize(str):
    third = len(str) // 3
    result_string = str[:third]
    return result_string

def scrapeAppStoreIcon(url_encoded):
    html = htmlRequest(decode(url_encoded))
    if html == None:
        return None
    return parseResponseForUrl(lobotomize(html))

def detect_language(text):
    print(text)
    detected = detect(text)
    return detected

# ------------- getting privacy tag diffs per run --------------
def compareDifferences(dict1, dict2):
    differences = {"added": {}, "removed": {}}
    dict1Tags = {}
    dict2Tags = {}

    for i in range(len(dict1["privacy_types"])): #flatten json for both runs
        currItem = dict1["privacy_types"][i]
        dict1Tags[currItem["privacy_type"]] = parsePurposes(currItem["purposes"])
    for i in range(len(dict2["privacy_types"])):
        currItem = dict2["privacy_types"][i]
        dict2Tags[currItem["privacy_type"]] = parsePurposes(currItem["purposes"])

    for privType in dict1Tags: #iterate through flattened dicts and find differences
        if privType in dict2Tags and dict1Tags[privType] != dict2Tags[privType]:
            if len(dict1Tags[privType]) > 0 and len(dict2Tags[privType]) > 0 and detect_language(dict1Tags[privType][0]) == detect_language(dict2Tags[privType][0]):
                added = findAdded(dict1Tags[privType], dict2Tags[privType])  
                if len(added) > 0: #prevent {added: []} bc that doesn't make sense
                    differences["added"][privType] = added
                removed = findRemoved(dict1Tags[privType], dict2Tags[privType])
                if len(removed) > 0:
                    differences["removed"][privType] = removed
            elif len(dict1Tags[privType]) == 0 or len(dict2Tags[privType]) == 0:
                added = findAdded(dict1Tags[privType], dict2Tags[privType])  
                if len(added) > 0: #prevent {added: []} bc that doesn't make sense
                    differences["added"][privType] = added
                removed = findRemoved(dict1Tags[privType], dict2Tags[privType])
                if len(removed) > 0:
                    differences["removed"][privType] = removed
            else:
                print(dict1Tags[privType])
                print(dict2Tags[privType])
                print("Skipped")

    if(differences.get("added") != {} and differences.get("removed") != {}):
        print(differences)
    
    return differences
    
def findAdded(typesList1, typesList2):
    added = []
    for dataType in typesList2:
        if dataType not in typesList1:
            added.append(dataType)
    return added

def findRemoved(typesList1, typesList2):
    removed = findAdded(typesList2, typesList1)
    return removed
    
def parsePurposes(purposes):
    purposeList = []
    for i in range(len(purposes)):
        currItem = purposes[i]
        dataTypes = []
        for j in range(len(currItem["datacategories"])):
            currCategory = currItem["datacategories"][j]
            for h in range(len(currCategory["datatypes"])):
                currDataType = currCategory["datatypes"][h]
                dataTypes.append(currDataType["data_type"])
        for dataType in dataTypes:
            purposeList.append(dataType)
    return purposeList
