
import {useEffect, useRef, useState} from "react";
import {Layer, Stage, Line} from "react-konva";
import Timer from "./Timer";
import Konva from "konva";
import {useHistory} from "react-router-dom";
import {History} from "history";
import {NotifyService} from "../global/NotifyService";
import {GameCommunicationService} from "../global/GameCommunicationService";


class Settings{
    constructor(public color: string) {
    }
}


class DrawElement{
    constructor(public settings: Settings) {
    }

}

class LineElement extends DrawElement{
    constructor(public settings:Settings, public points:{x:number, y:number}[]) {
        super(settings);
    }

    pointsAsTuple() : number[]{
        return this.points.reduce((accumulator:number[], currentValue) =>
            accumulator.concat(currentValue.x, currentValue.y), []);
    }
}


function drawElements(i: number, element: DrawElement) {
    let line = element as LineElement;
    return <Line
        key={i}
        points={line.pointsAsTuple()}
        stroke={line.settings.color}
        strokeWidth={5}
        tension={0.5}
        lineCap="round"
    />;
}

function uploadImage(stageRef: React.MutableRefObject<Konva.Stage | null>, uploaded: () => void) {
    return () =>{
        let dataURL = stageRef.current?.toDataURL();
        GameCommunicationService.uploadImage(dataURL)
            .then(_ => uploaded())
            .catch(err => NotifyService.warn(err, "Could not upload result"))
    }
}

function FreeDrawCanvas(props: {drawTime:number|null, uploaded: ()=>void}){
    const [elements, setElements] = useState<DrawElement[]>([]);
    const history = useHistory();
    const [dimension, setDimension] = useState({w:0,h:0});
    const [settings, setSettings] = useState<Settings>(new Settings("#000000"));
    const isDrawing = useRef(false);
    const divRef = useRef<HTMLDivElement|null>(null);
    const stageRef = useRef<Konva.Stage|null>(null);

    useEffect(() => {
        let current = divRef.current as HTMLDivElement;
        const width= current.offsetWidth
        const height= current.offsetHeight
        setDimension({w:width as number,h:height as number})
        window.onresize = _ => {
            const width= current.offsetWidth
            const height= current.offsetHeight
            setDimension({w:width as number,h:height as number})
        }
    }, [])

    const handleMouseDown = (e: any) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        let element = new LineElement(settings, [{"x": pos.x, "y": pos.y}]);
        setElements([...elements, element]);
    };

    const handleMouseMove = (e: any) => {
        // no drawing - skipping
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastElement = elements[elements.length - 1];
        // add point
        if(lastElement instanceof LineElement){
            lastElement.points = lastElement.points.concat({"x":point.x, "y":point.y});

            // replace last
            elements.splice(elements.length - 1, 1, lastElement);
            setElements(elements.concat());
        }
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    return (
        <div className="flex-grow-1 d-flex mt-2 d-flex flex-column">
            <div className="d-flex mb-2">
                <div className="flex-grow-1">
                    Drawing tools coming soon
                </div>
                <div>
                    <Timer timerFinished={uploadImage(stageRef, props.uploaded)}/>
                </div>
            </div>
            <div className="card flex-grow-1" ref={divRef}>
                <Stage
                    width={dimension.w}
                    height={dimension.h}
                    onMouseDown={handleMouseDown}
                    onMousemove={handleMouseMove}
                    onMouseup={handleMouseUp}
                    ref={stageRef}
                >
                    <Layer>
                        {elements.map((line, i) => drawElements(i, line))}
                    </Layer>
                </Stage>
            </div>
        </div>

    );
}

export default FreeDrawCanvas;