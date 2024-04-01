import React, { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import "./components.css";
import {domain} from "../index"
import { AppStoreImage } from "./DataView";
import { useNavigate } from "react-router-dom";


export const SearchResults = ({setAppIcon}) => {
    const query = useParams("query")['query']
    const [pagePosition, setPosition] = useState(0)
    const fetchUrl = domain +"search/"

    const { isLoading, error, data } = useQuery(['repoData', query, pagePosition], {// refetches when cursor changes
        queryFn: () => fetch(fetchUrl + query + "/" + pagePosition).then(res => res.json())
    })

    if (isLoading) return <div><span className="loading loading-infinity loading-lg"></span></div> // loading page

    if (error) return 'An error has occurred: ' + error.message // handle fetch errors

    let last = false
    if(data.length < 20){ //If the actual length of the list is less than 20, then it's the last page
        last = true
    }

    // no sweat, render nav buttons and table
    return(
        <div>
            <TableNavButtons currPosition={pagePosition} setPosition={setPosition} lastPage={last}/>
            <SearchResultsTable data={data} forwardIcon={setAppIcon} query={query}/>
        </div>
    )
}

const TableNavButtons = ({currPosition, setPosition, lastPage}) =>{
    const nextEnabled = !lastPage //this is a placeholder
    const prevEnabled = currPosition != 0
    // setup buttons that increment/decrement cursor to sift thru search results
    const nextPage = () =>{
      if(nextEnabled){
        setPosition(currPosition+1)
      }
    }
    const prevPage = () =>{
      if(prevEnabled){
        setPosition(currPosition-1)
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

const SearchResultsTable = ({data, forwardIcon, query}) => {
    const navigate = useNavigate()

    const openInDataView = (id, Icon) =>{
        forwardIcon(Icon)
        navigate("/Browse/" + id, {replace: false})
    }

    // stoled from faris' table component
    // AppStoreImage defined in DataView
    return(
        <table className="table">
          <thead>
            <tr>
              <th scope="col"/>
              <th scope="col">Search Restults for "{query}"</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.app_id}>
                <td>
                  <div className="avatar">
                    <div className="w-8 rounded-md">
                        <AppStoreImage queryParam={item.app_url}/>
                    </div>
                  </div>
                </td>
                <td className="hyperlink" onClick={() => openInDataView(item.app_id, <AppStoreImage queryParam={item.app_url}/>)}>{item.app_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
    )
}