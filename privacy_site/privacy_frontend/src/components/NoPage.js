import { useNavigate } from "react-router-dom"
import "./components.css"

export const NoPage = () => {
    // renders on invalid url
    const navigate = useNavigate()
    return (
        <div>
            <div className="box">
                <h1>404</h1>
                <p>page not found</p>
                <p onClick={() => navigate("/")} className="hyperlink">return</p>
            </div>
        </div>
    )
}