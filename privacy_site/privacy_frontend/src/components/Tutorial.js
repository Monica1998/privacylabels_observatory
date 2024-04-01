import React, { Component, useState, useEffect } from 'react'
import { PrivacyPage, SearchPage, GraphPage, TablePage } from './TutorialPages'
import "./Manifesto.css"
import { Dropdown } from "react-bootstrap";
import { DropdownButton } from "react-bootstrap";


//What kind of pages should be there
//One should definitely explain privacy types and why they are relevant
//One that explains how to use the table
//One that explains how to use the graph
//One that explains how to use the data view.

export const Tutorial = () => {
    const[windowDimension, detectHW] = useState({
        winWidth: window.innerWidth,
        winHeight: window.innerHeight
      })

      const navigateTo = (url) => {

      }
  

      const detectSize = () => {
        detectHW({
          winWidth: window.innerWidth,
          winHeight: window.innerHeight
        })
      }
    
      useEffect(() => {
        window.addEventListener('resize', detectSize)
      })
    
    const [page, setPage] = useState("how_to")

    if(windowDimension.winWidth>1000){
        return(
            <div>
            <div className="nav">
                <button className="bg-[#033C5A] hover:bg-[#AA9868] text-white font-bold py-2 px-4 m-2 rounded" onClick={() => setPage("how_to")}>What's a Privacy Type?</button>
                <button className="bg-[#033C5A] hover:bg-[#AA9868] text-white font-bold py-2 px-4 m-2 rounded" onClick={() => setPage("table")}>How to Use the Table?</button>
                <button className="bg-[#033C5A] hover:bg-[#AA9868] text-white font-bold py-2 px-4 m-2 rounded" onClick={() => setPage("graph")}>How to Use the Graphs?</button>
                <button className="bg-[#033C5A] hover:bg-[#AA9868] text-white font-bold py-2 px-4 m-2 rounded" onClick={() => setPage("search")}>How to Use Search?</button>
            </div>
            <div className="container">
                
                {page == "how_to" && <PrivacyPage/>}
                {page == "table" && <TablePage/>}
                {page == "graph" && <GraphPage/>}
                {page == "search" && <SearchPage/>}
            </div>
            </div>
    
        )
    }
    else{
        return(
            <div className='gwBackground'>
                <div >

                    
                {<PrivacyPage/>}
                {<TablePage/>}
                {<GraphPage/>}
                {<SearchPage/>}

                </div>
            </div>


            
        )
    }

}