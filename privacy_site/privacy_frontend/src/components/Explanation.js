import React, {useState} from "react";
import { DichotomyGraph, PrivacyGraph, RunGraph, PurposeGraph } from "./Graphs";
export const Explanation = () =>{

    const [page, setPage] = useState("DichotomyGraph")

    return(
        <div>
        <div className="nav">
            <button class="bg-[#033C5A] hover:bg-[#AA9868] text-white font-bold py-2 px-4 m-2 rounded" onClick={() => setPage("DichotomyGraph")}>Dichotomy</button>
            <button class="bg-[#033C5A] hover:bg-[#AA9868] text-white font-bold py-2 px-4 m-2 rounded" onClick={() => setPage("PrivacyGraph")}>Privacy</button>
            <button class="bg-[#033C5A] hover:bg-[#AA9868] text-white font-bold py-2 px-4 m-2 rounded" onClick={() => setPage("RunGraph")}>Runs</button>
            <button class="bg-[#033C5A] hover:bg-[#AA9868] text-white font-bold py-2 px-4 m-2 rounded" onClick={() => setPage("PurposeGraph")}>Purposes</button>
        </div>
        <div className="container">
            
            {page == "DichotomyGraph" && <DichotomyGraph/>}
            {page == "PrivacyGraph" && <PrivacyGraph/>}
            {page == "RunGraph" && <RunGraph/>}
            {page == "PurposeGraph" && <PurposeGraph/>}
        </div>
        </div>
        )
    

}