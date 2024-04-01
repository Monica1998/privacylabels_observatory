import React, { Component, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {useQuery, refetch} from 'react-query';
import {AppStoreImage} from "./DataView.js"
import "./components.css";
import linkIcon from "./link.png";
import { domain } from "../index.js";



export const Table = ({setCursorCallback, cursorPos, setAppIcon}) => {

  const cursor = cursorPos//this is how we navigate through the pages on the api

  const fetchUrl = domain + "api/apps/"



  const { isLoading, error, data } = useQuery(['repoData', cursor], {// refetches when cursor changes
    queryFn: () => 
      fetch(fetchUrl + cursor).then(res => res.json())
  })

  if (isLoading) return <div><span className="loading loading-infinity loading-lg"></span></div> // loading page

  if (error) return 'An error has occurred: ' + error.message // handle fetch errors

  const appList = data.results

  const getCursorPosition = (url) => { // scrapes cursor value from data.next/previous strings
    const regex = /\?cursor=.*/
    let cursorPos = url.match(regex)
    return cursorPos[0]
  }



  // page navigation buttons
  const TableNavButtons = () =>{
    const nextEnabled = data.next != null
    const prevEnabled = data.previous != null
    const nextPage = () =>{
      if(nextEnabled){
        setCursorCallback(getCursorPosition(data.next))
      }
    }
    const prevPage = () =>{
      if(prevEnabled){
        setCursorCallback(getCursorPosition(data.previous))
      }
    }
    const PrevButton = prevEnabled ? () => <button className="join-item btn-primary rounded-none btn-outline" onClick={prevPage}>Previous page</button> : () => <button className="join-item btn-secondary btn-outline rounded-none btn-disabled" onClick={prevPage}>Previous page</button>
    const NextButton = nextEnabled ? () => <button className="join-item btn-primary btn-outline rounded-none" onClick={nextPage}>Next</button> : () => <button className="join-item btn-secondary btn-outline rounded-none btn-disabled" onClick={nextPage}>Next</button>
    return(
      <div className="join grid grid-cols-2" data-theme="tableButtons">
        <PrevButton/>
        <NextButton/>
      </div>
    )
  }

  return (
    <div>
      <TableNavButtons/>
      <AppTable appList={appList} forwardIcon={() => setAppIcon()}/>
      <TableNavButtons/>
    </div>
  );
}

export const AppTable = ({appList, forwardIcon}) =>{
  const navigate = useNavigate()

  const[winDimension, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight
  })
  
  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight
    })
  }

  useEffect(() => {
    window.addEventListener('resize', detectSize)
  })

  appList.map((app) => {
    app.Icon = () => <AppStoreImage queryParam={app.app_url}/>
  })
  const openInDataView = (id, Icon) =>{
    forwardIcon(Icon)
    navigate("/Browse/" + id, {replace: false})
  }

  if(winDimension.winWidth > 1000){

  return(
      <table className="table">
        <thead>
          <tr>
            <th scope="col"/>
            <th scope="col">App Name</th>
            <th scope="col">App ID</th>
            <th scope="col">Privacy Type</th>
            <th scope="col">Release Date</th>
            <th scope="col">Version Release Date</th>
            <th scope="col">App URL</th>
          </tr>
        </thead>
        <tbody>
          {appList.map((item) => (
            <tr key={item.app_id}>
              <td>
                <div className="avatar">
                  <div className="w-8 rounded-md">
                    <item.Icon/>
                  </div>
                </div>
              </td>
              <td className="hyperlink" onClick={() => openInDataView(item.app_id, item.Icon)}>{item.app_name}</td>
              <td>{item.app_id}</td>
              <td>{privacyTypeMethod(item.privacy_types)}</td>
              <td>{item.release_date}</td>
              <td>{item.version_release_date}</td>
              <td>
                <a href={item.app_url} target="_blank">
                  <div className="w-8">
                    <img className="w-auto h-auto" src={linkIcon} alt="External link"/>
                  </div>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  else{
    return(
      <table className="table">
        <thead>
          <tr>
            <th scope="col" />
            <th scope="col">App Name</th>
            <th scope="col">App ID</th>
          </tr>
        </thead>
        <tbody>
        {appList.map((item) => (
            <tr key={item.app_id}>
              <td>
                <div className="avatar">
                  <div className="w-8 rounded-md">
                    <item.Icon/>
                  </div>
                </div>
              </td>
              <td className="hyperlink" onClick={() => openInDataView(item.app_id, item.Icon)}>{item.app_name}</td>
              <td>{item.app_id}</td>
              </tr>
              ))}
        </tbody>
      </table>
    )
  }
}

function privacyTypeMethod(str) {
  //console.log(str[0])
  if(str[0] == null){
    return "None"
  }
  else{
    let result = {}
    for (const [key, value] of Object.entries(str[0])) {
      result[key] = value
    } 
    if(result["privacy_type"] == "	DATA_LINKED_TO_YOU"){
      return "Data Linked to You"
    }
    else if(result["privacy_type"] == "DATA_NOT_COLLECTED"){
      return "Data Not Collected"
    }

    else if(result["privacy_type"] == "DATA_NOT_LINKED_TO_YOU"){
      return "Data Not Linked to You"
    }
    else{
      return "Data Used to Track You"
    }
}

}


function purposeMethod(str) {
  let purposes = "";


  if(str[0] == null){
    return "None"
  }
  else{
  let result = {}
  for (const [key, value] of Object.entries(str[0])) {
 
      result[key] = value
    } 
  let resultTwo = {}
    //for (const [key, value] of Object.entries(purposes[0])) {
 
 //     resultTwo[key] = value
   // } 
    //return resultTwo["purpose"];
  }

 // console.log(purposes)
  
}



function dataTypeMethod(str) {
  if (str === "AD") {
    return "Advertising Data";
  }
  if (str === "AU") {
    return "Audio Data";
  }
  if (str === "B") {
    return "Browsing History";
  }
  if (str === "CL") {
    return "Coarse Location";
  }
  if (str === "C") {
    return "Contacts";
  }
  if (str === "CD") {
    return "Crash Data";
  }
  if (str === "CI") {
    return "Credit Info";
  }
  if (str === "CS") {
    return "Customer Support";
  }
  if (str === "D") {
    return "Device ID";
  }
  if (str === "E") {
    return "Email Address";
  }
  if (str === "ET") {
    return "Emails or Text Messages";
  }
  if (str === "F") {
    return "Fitness";
  }
  if (str === "G") {
    return "Gameplay Content";
  }
  if (str === "H") {
    return "Health";
  }
  if (str === "N") {
    return "Name";
  }
  if (str === "PI") {
    return "Payment Info";
  }
  if (str === "PD") {
    return "Performance Data";
  }
  if (str === "PN") {
    return "Phone Number";
  }
  if (str === "PV") {
    return "Photos or Videos";
  }
  if (str === "PA") {
    return "Physical Address";
  }
  if (str === "PL") {
    return "Precise Location";
  }
  if (str === "PR") {
    return "Product Interaction";
  }
  if (str === "PH") {
    return "Purchase History";
  }
  if (str === "SH") {
    return "Search History";
  }
  if (str === "SI") {
    return "Sensitive Info";
  }
  if (str === "U") {
    return "User ID";
  }
  if (str === "O") {
    return "Other";
  }
  return "Unknown";
}
