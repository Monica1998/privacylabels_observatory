import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import "./components.css";
import errorIcon from "./error.png"
import trackingYouIcon from "./trackYou.png"
import linkedToYou from "./linkedToYou.png"
import notLinked from "./notLinkedToYou.png"
import { domain } from "..";
import {Timeline} from "flowbite-react"

export const DataView = ({appIcon}) => {
// =========== state vars ==============
    const id = useParams('id').id // use params returns object, only want id string
    const passedAppIcon = appIcon

    const [currSelected, setSelected] = useState(0)

    const [privTags, setTags] = useState(null)

    const [LINKED, setLINKED] = useState(null)

    const [NOT_LINKED, setNOT_LINKED] = useState(null)

    const [USED_TO_TRACK, setUSED_TO_TRACK] = useState(null)

    const fetchUrl = domain + "app_history_diffs/" + id
    
    const [timelineIndex, setTimelineIndex] = useState(0)

// ================ ez bake fetch ==================
    const { isLoading, error, data } = useQuery(['repoData', fetchUrl], {// refetches when id changes
        queryFn: () => 
        fetch(fetchUrl).then(res => res.json())
    })


// ========== bad and gross state handling ============

    // ok i got a whole ass essay for an excuse for this godforsaken react
    // so basically, since so many components in data view have the ability to cause a rerender
    // we have to save the current state of the rendered priv tags manually
    // (if we don't then the whole page gets reset)

    // In addition, we can't declare a value of a state variable after the fetch
    // since the use state hook cant be called non-determinantly 

    // This means on every re-render (use state fires every time the page is rendered),
    // we need to update the dicts of the different privacy tags.

    // so yeah

    // format of data was tricky to work with but i think this works

    useEffect(() => {
        if(privTags){ // procs on second render
            //console.log("second render")
            for(let i = 0; i < privTags.length; i++){
                const currType = privTags[i]
                if(currType.privacy_type == "DATA_USED_TO_TRACK_YOU"){
                    setUSED_TO_TRACK(currType)
                }else if(currType.privacy_type == "DATA_NOT_LINKED_TO_YOU"){
                    setNOT_LINKED(currType)
                }else{
                    setLINKED(currType)
                }
            }
        }
        else{
            if(data){ // procs only if privTags is null and fetch was successful => first render
                setTags(data.current.privacy_types)
            }
        }
    }, [data, privTags])

// ========== end bad and gross state handling ============
    if (isLoading) return <div><span className="loading loading-infinity loading-lg"></span></div> // loading icon

    if (error){
        if(error instanceof SyntaxError){
            return "Missing data for app id: " + id
        }
        return 'An error has occurred: ' + error.message // handle fetch errors
    } 

    const latestData = data.current // ?

    // app history in the form of 
    //{current: (full app data from last run), initial: (full app data from first run), diffs [{date , changes, full data from run where app was changes}, ...]}
    // subject to change based on what happens to get_diffs()

    // please for the love of god fix get_diffs()

    let AppIcon
    if(passedAppIcon){ //scrape app icon from app store
        AppIcon = () => passedAppIcon
    }else{
        //AppIcon = () => <AppStoreImage queryParam={latestData.app_url}/>
        AppIcon = () => <AppStoreImage queryParam={data.initial.app_url}/> // bad, diffs is broken
        // latest data app url is corrupted for some apps... idk if this is an issue with get_diffs() on the backend
        // or with the data itself but a hacky workaround is just to use the initial app url
        
        // this is a bad temp solution
    }

// ========== butt ugly priv tag render ====================
    const PrivacyTagReadout = () => {
        // mostly just constant formatting, nothing too special

        // this is a gross way to do it and the display feels cluttered
        // recommend only showing one purpose type at a time?

        return(
            <div className="flex justify-around ">
                <div>
                    <div className="avatar flex justify-center">
                        <div className="w-16 h-16 rounded ">
                            <img src={trackingYouIcon}/>
                        </div>
                    </div>
                    <GetPurposes dict={USED_TO_TRACK}/>
                </div>
                <div>
                    <div className="avatar flex justify-center ">
                        <div className="w-16 r h-16 rounded ">
                            <img src={linkedToYou}/>
                        </div>
                    </div>
                    <div className="flex ">
                        <GetPurposes dict={LINKED}/>
                    </div>
                </div>
                <div>
                    <div className="avatar flex justify-center">
                        <div className="w-16 h-16 rounded ">
                            <img src={notLinked}/>
                        </div>
                    </div>
                    <GetPurposes dict={NOT_LINKED}/>
                </div>
            </div>
        )
    }

    const DownloadData = () => { // placeholder ig
        console.log("Working")
    }

    const GetPurposes = ({dict}) => { // parse purposes from backend
        let Purposes = () => <p>None</p>
        if(dict == null){
            return(
                <Purposes/>
            )
        }
        if(dict.purposes.length > 0){
            Purposes = () => {
                // gross but we are limited by the format of the backend
                // this maps each purpose to its own component that renders all of the categories that the app uses
                return(
                    <div className="py-1 flex flex-wrap">
                        {dict.purposes.map((purpose) => {
                            return(
                                <div key={purpose.purpose} className="ml-5 mb-5">
                                    <p className="text-center text-teal-600">{purpose.purpose}:</p>
                                    <GetCategories categoriesArray={purpose.datacategories}/>
                                </div>
                            )
                        })}
                    </div>
                )
            }
        }else{
            Purposes = () => {
                return(
                    <p>Not declared</p>
                )
            }
        }
        return(
            <Purposes/>
        )
    }

    const GetCategories = ({categoriesArray}) => {
        // more functional composition here, just putting each category into a text component
        return(
            <div>
                {categoriesArray.map( (category, index) => {
                    return(
                        <p key={index}>{category.data_category}</p>
                    )
                })}
            </div>
        )
    }
    // ============= end readout code ============

    // ============= timeline code ===============

    const fixTimestamp = (timestamp) =>{ // quickie regex to format date from backend data
        const match = /(.*?)T/.exec(timestamp)
        if(match){
            return match[1]
        }else{
            return timestamp
        }
    }

    const ChangesTimeline = () => { // parse data from backend func to make a node for each change in data
        const diffs = data.diffs.slice().reverse() // composition of slice + reverse to deep copy data array then reverse to make timeline go in order
        let numChanges = 1;

        const getIndexAndCount = (idx) => { // stupid way of doin this
            numChanges++;
            return idx + 1
        }

        // cant write jsx comments so here we go raw:

        // curr tags and initial tags anchors are constant and have specialized functions to render them
        // this is so they play nice with flowbite
        // the in between nodes are rendered dynamically by mapping each diff to a change anchor component
        // index is used to make the button color on the selected node change 

        // this is a dumb way to do it, sorry

        return(
            <Timeline>
                <CurrentTagsAnchor timelineOrder={0}/>
                {diffs.map((diff, index) => {
                    return(
                        <ChangeAnchor change={diff} key={index} timelineOrder={getIndexAndCount(index)}/>
                    )
                })}
                <InitialTagsAnchor timelineOrder={numChanges}/>
            </Timeline>
        )
    }

    const ChangeAnchor = ({change, timelineOrder}) => {
        const selectTimelineNode = () => {
            // when clicking a node, change state to render appropriate priv tags
            setTags(change.full_data)
            setTimelineIndex(timelineOrder) // this is to change the color of the button
        }

        // clear cut formatting here, everything goes in its place
        // check out flowbite timeline api for more info
        return(
            <Timeline.Item>
                <ModdedPoint setCurrItem={selectTimelineNode} index={timelineOrder}/>
                <Timeline.Content>
                    <Timeline.Time>{change.date}</Timeline.Time>
                    <Timeline.Title>Privacy Tags changed</Timeline.Title>
                    <Timeline.Body></Timeline.Body>
                </Timeline.Content>
            </Timeline.Item>
        )
    }

    const CurrentTagsAnchor = ({timelineOrder}) => {
        // same stuff from changes anchor except this is read statically from latest data
        const selectTimelineNode = () => {
            setTags(latestData.privacy_types)
            setTimelineIndex(timelineOrder)
        }
        return(
            <Timeline.Item>
                <ModdedPoint setCurrItem={selectTimelineNode} index={timelineOrder}/>
                <Timeline.Content>
                    <Timeline.Time>{latestData.version_release_date}</Timeline.Time>
                    <Timeline.Title> Current Tags </Timeline.Title>
                    <Timeline.Body>
                    </Timeline.Body>
                </Timeline.Content>
            </Timeline.Item>
        )
    }

    const InitialTagsAnchor = ({timelineOrder}) => {
        // same stuff from changes anchor except this is read statically from initial data
        const selectTimelineNode = () => {
            setTags(data.initial.privacy_types)
            setTimelineIndex(timelineOrder)
        }
        return(
            <Timeline.Item>
                <ModdedPoint setCurrItem={selectTimelineNode} index={timelineOrder}/>
                <Timeline.Content>
                    <Timeline.Time>{data.initial.version_release_date}</Timeline.Time>
                    <Timeline.Title>Tags at inital release</Timeline.Title>
                    <Timeline.Body>
                    </Timeline.Body>
                </Timeline.Content>
            </Timeline.Item>
        )
    }

    const TimelineTernary = () => {
        // if the app never had any changes, dont render the timeline
        let timeline;
        if(data.diffs == "no changes"){
            timeline = <p>App's privacy tags never changed</p>
        }else{
            timeline = <ChangesTimeline/>
        }
        return timeline;
    }

    const ModdedPoint = ({setCurrItem, index}) =>{ // hacky way to make flowbite timeline nodes into buttons
        let StyledButton = () => {
            if(timelineIndex == index){ // timeline button defined in components.css
                //absolute timelineButton
                return <button className="btn btn-secondary btn-circle btn-xs relative timelineButton" onClick={setCurrItem}/>
            }else{
                return <button className="btn btn-primary btn-circle btn-xs relative timelineButton" onClick={setCurrItem}/>
            }
        }
        return(
            <div>
                <Timeline.Point/>
                <StyledButton/>
            </div>
        )
    }

    // ============ end timeline code ==================

    return( // main body of data view
        <div className="max-h-screen max-w-screen bg-base-100">
            <div className="centerDiv my-10">
                <div className="avatar mr-10">
                    <div className="w-32 rounded-xl ">
                        <AppIcon/>
                    </div>
                </div>
                <div className="block">
                    <h1 className="text-5xl font-bold px-1">{latestData.app_name}</h1>
                    <h2 className="text-5lg px-1">Information last gathered on {fixTimestamp(latestData.insert_timestamp)}</h2>
                    <h2 className= "text-5lg px-1">Version {latestData.app_version}</h2>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={DownloadData}>Download</button>
                </div>
            </div>
            <div className="flex w-full">
                <div className="w-3/4 ">
                    <PrivacyTagReadout/>
                </div>
                <div className="w- 1/4 ml-5 mr-2">
                    <TimelineTernary/>
                </div>
            </div>
        </div>
    )
}

// ========== app icon stuff =================
export const AppStoreImage = ({queryParam}) => {
    const fetchUrl = domain+"app_store_icon/" + encodeUrl(queryParam)
    const { data, isLoading, error } = useQuery(['image', queryParam], { // mini fetch hook
        queryFn: () => fetch(fetchUrl).then(res => res.json())
    });

    // the meat of this func is on the backend

    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;

    if(data.url == "failed to scrape icon"){
        data.url = errorIcon
    }

    return (
        <img src={data.url} alt="Fetched Image" />
    );
};

const encodeUrl = (url) => { 
    // regex formatting to encode the url to be read by backend
    const removeDomain = /https:\/\/apps\.apple\.com\//g
    const stripped = url.replace(removeDomain, '')
    const replaceSlashes = new RegExp("/", 'g')
    
    return stripped.replace(replaceSlashes, "+")
}
// ============ EOF =====================