import "./DrawingTools.css"
import {useEffect, useRef, useState} from "react";
import {Settings} from "./FreeDrawCanvas";


function DrawingTools(props: {setSetting:(settings:Settings)=>void}){
    let [color, setColor] = useState("#000000FF");
    let [colorPickerShow, setColorPickerShow] = useState(false);

    useEffect(() => {
        props.setSetting(new Settings(color))
    },[color])
    return (
        <div className="d-flex flex-row" >
            <div className="colour-display" style={{backgroundColor: color}} onClick={event => setColorPickerShow(!colorPickerShow)}>
                <div hidden={!colorPickerShow}
                    className="card text-dark bg-light p-3 mt-1 shadow flex-wrap color-selection-card flex-row"
                >
                    <div className="colour-display" style={{backgroundColor: "black"}} onClick={event => setColor("black")}/>
                    <div className="colour-display" style={{backgroundColor: "grey"}} onClick={event => setColor("grey")}/>
                    <div className="colour-display" style={{backgroundColor: "yellow"}} onClick={event => setColor("yellow")}/>
                    <div className="colour-display" style={{backgroundColor: "red"}} onClick={event => setColor("red")}/>
                    <div className="colour-display" style={{backgroundColor: "green"}} onClick={event => setColor("green")}/>
                    <div className="colour-display" style={{backgroundColor: "violet"}} onClick={event => setColor("violet")}/>
                    <div className="colour-display" style={{backgroundColor: "brown"}} onClick={event => setColor("brown")}/>
                    <div className="colour-display" style={{backgroundColor: "blue"}} onClick={event => setColor("blue  ")}/>
                </div>
            </div>


        </div>
    )
}

export default DrawingTools;