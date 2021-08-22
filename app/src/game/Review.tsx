import {useEffect, useState} from "react";

interface DrawnImage{
    name: string;
    dataImageUrl: string;
}

function fetchSentence(setSentence: (value: (((prevState: undefined) => undefined) | undefined)) => void) {

}

function fetchImages(setImages: (value: (((prevState: (DrawnImage[] | undefined)) => (DrawnImage[] | undefined)) | DrawnImage[] | undefined)) => void) {

}

function Review(){
    let [images, setImages] = useState<DrawnImage[]>();
    let [sentence, setSentence] = useState();

    useEffect(() => {
        fetchSentence(setSentence)
        fetchImages(setImages)
    }, [])

    return (
        <div className="d-flex p-3 flex-column h-100">

        </div>
    )
}

export default Review;