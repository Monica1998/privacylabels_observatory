import { useNavigate } from "react-router-dom"
import React, {useEffect, useState} from "react";
import ScrollLock from 'react-scroll-lock-component'
import { ArrowDown, ArrowDownCircleFill, ArrowUpCircleFill, HouseFill, Search } from 'react-bootstrap-icons'
import { PrivacyPage, SearchPage, GraphPage, TablePage } from './TutorialPages'
import { useRef } from "react";
import "./Manifesto.css"


export const Manifesto = () => {

    const home = useRef(null);
    const privacy = useRef(null);
    const search = useRef(null);
    const graph = useRef(null);
    const table = useRef(null);

    const handleClick = (ref) => {
        ref.current?.scrollIntoView({behavior: 'smooth'});
    }

    const scrollToSection = (elementRef) => {
        window.scrollTo({
            top: elementRef.current.offsetTop, 
            behavior: 'smooth'
        })
    }


    const getBackground = () =>{
        let styling = {
            backgroundColor: "#10588B"
        }
        return styling;
    }

    const navigate = useNavigate();
    const[windowDimension, detectHW] = useState({
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
    
    if(windowDimension.winWidth >= 1000){
        return(
            
            <div className="page  blackBorder">
                <div ref={home} className="hero min-h-screen bg-base-100 primary bg-[#10588B]" style={getBackground()}>

                <div className="hero-content text-center">
                    <div className="max-w-md gwText">
                        <h1 className="text-5xl font-bold">Welcome to the GWUSEC Privacy Label Observatory</h1>
                        <div id="siteDescription" className="flex flex-row items-end">
                            <p className="py-6 removeMarginBottom">This is a tool to explore and access an extensive database of the history and usage of privacy tags</p>
                        </div>
                        <button className="btn btn-outline m-2 bg-[#e4cf9f]" onClick={() => navigate("/Browse", {replace:false})}>Show me the apps!</button>
                        <button className="btn btn-outline m-2 bg-[#e4cf9f]" onClick={() => navigate("/Explanation", {replace:false})}>Show me the graphs!</button>
              
                    </div>
           
                </div>

                <div className="privBttn" onClick={() => handleClick(privacy)}>
                    <ArrowDownCircleFill size={50} className="hover animate-bounce"/>
                </div>

                </div>
                <div ref={privacy} className="privacy bg-[#e4cf9f]">
                    <PrivacyPage/>
                    <div className="relative flex flex-row place-content-center right-1">
                        <ArrowUpCircleFill size={50} className="hoverTwo m-1" onClick={() => handleClick(home)}/>
                        <ArrowDownCircleFill size={50} className="hoverTwo m-1" onClick={() => handleClick(search)}/>
                    </div>
                </div>
                <div ref={search} className="search bg-[#e4cf9f]">
                    <SearchPage/>
                    <div className="relative flex flex-row place-content-center">
                        <ArrowUpCircleFill size={50} className="hoverTwo m-1" onClick={() => handleClick(privacy)}/>
                        <ArrowDownCircleFill size={50} className="hoverTwo m-1" onClick={() => handleClick(graph)}/>
                        <HouseFill size={50} className="hoverTwo m-1" onClick={() => handleClick(home)}/>
                    </div>
                </div>
                <div ref={graph} className="search bg-[#e4cf9f]">
                    <GraphPage/>
                    <div className="relative flex flex-row place-content-center">
                        <ArrowUpCircleFill size={50} className="hoverTwo m-1" onClick={() => handleClick(search)}/>
                        <ArrowDownCircleFill size={50} className="hoverTwo m-1" onClick={() => handleClick(table)}/>
                        <HouseFill size={50} className="hoverTwo m-1" onClick={() => handleClick(home)}/>
                    </div>
                </div>
                <div ref={table} className="search bg-[#e4cf9f]">
                    <TablePage/>
                    <div className="relative flex flex-row place-content-center">
                        <ArrowUpCircleFill size={50} className="hoverTwo m-1" onClick={() => handleClick(graph)}/>
                        <HouseFill size={50} className="hoverTwo m-1" onClick={() => handleClick(home)}/>
                    </div>
                </div>
            </div>
            
        )
    }
    else{
        return(
            <div className="hero min-h-screen primary gwBackground">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-lg font-bold">Welcome to GWU Privacy Tag Observatory</h1>
                        <div id="siteDescription" className="flex flex-row items-end">
                            <p className="py-6 removeMarginBottom">This is a tool to explore and access an extensive database of the history and usage of privacy tags</p>
                        </div>
                        <div className="flex flex-col">
                            <button className="btn btn-outline px-2 w-full text-xs" onClick={() => navigate("/Browse", {replace:false})}>Apps!</button>
                            <button className="btn btn-outline px-2 mt-2 w-full text-xs" onClick={() => navigate("/Tutorial", {replace:false})}>Privacy Tags?</button>
                        </div>

                    </div>

                </div>


            </div>
        )
    }

}