import React, {useEffect, useState  } from "react";
import {Table} from "./components/Table";
import { useNavigate} from "react-router-dom";
import { Manifesto } from "./components/Manifesto";
import { Explanation } from "./components/Explanation";
import { Tutorial } from "./components/Tutorial";
import "./Frontend.css";
import gwLogo from "./components/gw.png";
import searchLogo from "./search.png"
import { Dropdown } from "react-bootstrap";
import { DropdownButton } from "react-bootstrap";
import uicLogo from "./components/UICLogo.png";
import { DataView } from "./components/DataView";
import { SearchResults } from "./components/SearchResults";
import autofillData from "./components/staticData/autofillDataSorted.json";
import { Search } from "react-bootstrap-icons";


export const Layout = (props) => {// composes navbar with page contents
// ============ init states =============
  const tab = props.tab; // tab is used to keep track of what tab user is looking at
  const navigate = useNavigate(); // obtain refrence to useNavigate hook to call statically

  const[windowDimension, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight
  })

  const[selectedOption, setSelectedOption] = useState(null); 

  const [browseCursor, setBrowseCursor] = useState("")
  const [searchText, setSearchText] = useState(""); // saves text box input as state, updates when text box loses focus
  const [currAppIcon, setCurrAppIcon] = useState(null) // circumvents re loading app icon when opening app in data view

  // ============= end states ============ 

  // ============ setup navbar navigation infrastructure (and style) ==========
  const pages = [<Table setCursorCallback={setBrowseCursor}
                  cursorPos={browseCursor}
                  setAppIcon={setCurrAppIcon}/>, 
                  <Explanation/>, 
                  <DataView appIcon={currAppIcon}/>,
                  <SearchResults
                  setAppIcon={setCurrAppIcon} />,
                <Tutorial />] 

  let currSearchText = searchText

  const GetPage = () =>{ // quickie function to get current page in jsx  syntax
    if(tab != null){
      return pages[tab];
    }else{
      return <Manifesto/>
    }
  }

  const getButtonStyle = (id) => {
    // dynamic button styling for navbar options
    const gwBlue = "#033C5A"
    const gwGold = "#AA9868"
    let styling = {}
    if(tab == id){
      styling = {
        backgroundColor:gwGold,
        color:gwBlue
      }
    }else{
      styling = {
        backgroundColor:gwBlue,
        color:gwGold
      }
    }
    return styling
  }

  // =============== end navbar stying / helpers ==========
  
  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight
    })
  }

  useEffect(() => {
    window.addEventListener('resize', detectSize)
  })

// =========== searchbar "code" =============
  const SearchBar = () => {
    /*
    I want the search bar text to be maintained over state changes AND be manuaually controlled to do autofill
    My solution is genuinely criminal
    One local state variable to make it a controlled input
    One global static string to keep track of text without rerendering
    And one global state variable to maintain text over state changes

    it was either this or using refs. the lesser of two evils, but evil nonetheless
    */
    const [localText, setLocalText] = useState(searchText) // controls what text box shows for autofilling purposes
    const [trueTypedText, setTypedText] = useState(searchText) // saves what user physically types
    const [currHoveredElement, setCurrHovered] = useState(null) // saves what autofill suggestion user is hovering over

    const handleChange = (event) => { // called whenever text contents change

      event.preventDefault();

      if(trueTypedText == localText){
        currSearchText = event.target.value // gross
        setLocalText(currSearchText) 
        setTypedText(currSearchText)
        // basically, if user has not hovered over a suggestion, set state accordingly
      }else{
        currSearchText = trueTypedText
        setLocalText(currSearchText)
        // if user has hovered over a suggestion, render the text of the suggestion, but don't lose the text they typed
      }
    }

    const FindAutoFillSuggestions = () => {
      const alphabetRange = autofillData[trueTypedText.charAt(0).toLowerCase()] // returns dropdown menu of results or <p>no results</p>
      // regex witchcraft
      const editedTypedText = trueTypedText.replace(/\\/g, '\\\\')
      const pattern = new RegExp("\"" + editedTypedText + "(.*?)\":(\\d+)", "g")

      /* 
        in refrence to above: this regex pattern is how we find autofill suggestions. 
        idk how well it will scale. its running pretty fast at 500000 but that is < significant when it comes to the app store library
        basically, the json is alphbetized (alphanumericatized?) by the first letter of the app name
        using regex groups to find missing text and app id
        those get mapped into an array of <AutoFillSuggestion/> components
      */

      let results = []
      let count = 0

      if(alphabetRange){ // eek
        for (const match of JSON.stringify(alphabetRange).matchAll(pattern)) { // regex match apps to pattern
          if (count >= 5){ // only want <= 5 options
            break
          }
          const currCount = count
          // map the result to an autofill component and add it to the list of autofill components to render
          results.push({ id:count, Component: () => <AutoFillSuggestion content={trueTypedText + match[1]} appId={match[2]} position={currCount}/>})
          count++
        }
      }

      let Content 

      if(results.length > 0){ // this is the little box that shows up with all the possible matches
        Content = () => {
          return(
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box rounded-sm w-full bg-[#AA9868]">
              {results.map((Suggestion)=>(
                  <li key={Suggestion.id}><Suggestion.Component/></li> // cursed
              ))}
            </ul>
          )
        }
      }else{
        Content = () => {
          return(
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box rounded-sm w-full bg-[#AA9868]">
                <p>no results</p>
              </ul>
          )
        }
      }


      return(
        <Content/>
      )
    }

    const AutoFillSuggestion = ({content, appId, position}) =>{ // quickie component that takes some string and can change what is displayed in text box
      const handleHover = () => {
        if(currHoveredElement != position){ // prevents naughty behavior
          setLocalText(content)
          setCurrHovered(position)
          // text in textbox gets updated to be suggestion
        }
      }
      const handleExitHover = () => {
        setLocalText(trueTypedText)
        setCurrHovered(null)
        // text in text box goes back to what user typed
      }
      const handleClick = () => {
        setCurrAppIcon(null)
        let url = "/Browse/" + appId
        navigate(url, {replace:false})
        // go go gadget dataview
      }

      // its just a text component with fancy event handling

      return(
        <p onMouseEnter={handleHover} onMouseDown={handleClick} onMouseLeave={handleExitHover}>{content}</p> 
      )
    }

    const handleKeyDown = (event) => {
      // catch enter event => go go gadget search
      if (event.key === 'Enter') {
        let url = "/Search/"+localText
        navigate(url, {replace: false})
      }
    }
    if(windowDimension.winWidth > 1000){
    return(

    // rendered body of search bar
 
        <div className="flex-1 gap-2 nudgeRightSearch">
            <div className="dropdown dropdown-bottom w-full h-full">
              <div  className="flex flex-row form-control w-max h-auto max-w-xs float-right">
              <img src={searchLogo} className="w-8 h-8 mr-2" alt="Search Icon" />
                <input type="text"
                placeholder="find app"
                className="input w-full h-full input-lg rounded-sm px-0 noBorder indent-2" 
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                value={localText} />
                
              </div>
              <FindAutoFillSuggestions/>
            </div>
        </div>
    )
  }
  else{
    return(
      <div className="flex-1 gap-2 nudgeRightSearch">
      <div className="dropdown dropdown-bottom w-full h-full">
        <div  className="flex flex-row form-control w-max h-auto max-w-xs float-right">
        <img src={searchLogo} className="w-8 h-8 mr-2" alt="Search Icon" />
          <input type="text"
          placeholder="find app"
          className="input w-1 h-1 input-lg rounded-sm px-0 noBorder indent-2" 
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={localText} />
          
        </div>
        <FindAutoFillSuggestions/>
      </div>
      </div>
    )
  }
}
  // ========== end searchbar ==============


  // ========== render navbar ============== 

  const ConstantBanner = ({className}) =>{ //always present on da site, composes buttons and searchbar into single component
    const navigateTo = (url) => {
      setSearchText(currSearchText)
      navigate("/" + url, {replace: false}); 
    }

    
    const handleChange = (event) => {
      const selectedValue = event.target.value;
      if(selectedValue == "Privacy Observatory"){
        setSelectedOption("");
      }
      else{
        setSelectedOption(selectedValue);
        navigateTo(selectedValue);
      }
    }

    if(windowDimension.winWidth > 1000){
      return(

        <div className={className}>
          <div className="flex justify-start w-1/12 opacity-100">
            <div className="dropdown dropdown-bottom opacity-100">
              <label tabIndex={0} className="btn btn-ghost btn-square avatar pt-2.5 opacity-100">
                <div className="w-16 rounded">
                  <img className="w-auto h-auto" src={gwLogo} alt="George Washington University logo"/>
                </div>
              </label>
              <ul tabIndex={0} className="mt-2 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-64 opacity-100">
                <li>
                  <a className="justify-between gwGold" href="https://www.gwu.edu/">George Washington University</a>
                </li>
                <li><a className="gwGold" href="https://gwusec.seas.gwu.edu/">GWU SEC</a></li>
              </ul>
            </div>
            <div className="dropdown dropdown-bottom ">
              <label tabIndex={0} className="btn btn-ghost btn-square avatar pt-1 ">
                <div className="w-16 rounded ">
                  <img className="w-auto h-auto" src={uicLogo} alt="University of Illinois Chicago logo"/>
                </div>
              </label>
              <ul tabIndex={0} className="mt-1 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-64 ">
                <li>
                  <a className="justify-between gwGold" href="https://www.gwu.edu/">George Washington University</a>
                </li>
                <li><a className="gwGold" href="https://gwusec.seas.gwu.edu/">GWU SEC</a></li>
              </ul>
            </div>
          </div>
  
          <div className="flex flex-row justify-evenly nudgeRightMore w-10/12 min-w-fit">
  
            <div className="flex-none ">
              <button className="btn text-lg noBorder" style={getButtonStyle(null)} onClick={() => navigateTo("")}>Privacy Observatory</button>
            </div>
  
  
            <div className="flex-none nudgeRight">
              <button className="btn text-lg noBorder" style={getButtonStyle(1)} onClick={() => navigateTo("Explanation")}>Explanation</button>
            </div>
  
            <div className="flex-none nudgeRight">
              <button className="btn text-lg noBorder" style={getButtonStyle(0)} onClick={() =>navigateTo("Browse")}>Browse Apps</button>
            </div>
  
            <SearchBar className="float-right"/>
          </div>
        </div>
      )
    }

    else{
      return(
        <div className={className}>
        <div className="flex justify-start w-1/12 ">
          <div className="dropdown dropdown-bottom">
            <label tabIndex={0} className="btn btn-ghost btn-square avatar pt-2.5 ">
              <div className="w-16 rounded">
                <img className="w-auto h-auto" src={gwLogo} alt="George Washington University logo"/>
              </div>
            </label>
            <ul tabIndex={0} className="mt-2 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-64">
              <li>
                <a className="justify-between gwGold" href="https://www.gwu.edu/">George Washington University</a>
              </li>
              <li><a className="gwGold" href="https://gwusec.seas.gwu.edu/">GWU SEC</a></li>
            </ul>
          </div>

          <div className="dropdown dropdown-bottom ">
            <label tabIndex={0} className="btn btn-ghost btn-square avatar pt-1 ">
              <div className="w-16 rounded ">
                <img className="w-auto h-auto" src={uicLogo} alt="University of Illinois Chicago logo"/>
              </div>
            </label>
            <ul tabIndex={0} className="mt-1 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-64 ">
              <li>
                <a className="justify-between gwGold" href="https://www.gwu.edu/">George Washington University</a>
              </li>
              <li><a className="gwGold" href="https://gwusec.seas.gwu.edu/">GWU SEC</a></li>
            </ul>
          </div>
        </div>
        <div>
            <SearchBar className="float-right w-1/2"/>
          </div>  

        <div>
        <DropdownButton title="Observatory" id="nav-dropdown">
          <Dropdown.Item onClick={() => navigateTo("")}>Home Page</Dropdown.Item>
          <Dropdown.Item onClick={() => navigateTo("Explanation")}>Explanation</Dropdown.Item>
          <Dropdown.Item onClick={() => navigateTo("Browse")}>Browse</Dropdown.Item>
          <Dropdown.Item onClick={() => navigateTo("Tutorial")}>Tutorial</Dropdown.Item>
        </DropdownButton>
        </div>
  

      </div>
      )
    }
    
  }
  if(tab != null){
    return ( 
      <div>
        <ConstantBanner className="navbar bg-base-100 gwBlueBg bg-inherit opacity-100"/>
        <GetPage/>
      </div>
    );
  }
  else{
    return(
      <div>
        <GetPage/>
        <ConstantBanner className="fixed top-0 navbar bg-base-100 gwBlueBg bg-inherit opacity-100"/>
      </div>
    )
  }

}
