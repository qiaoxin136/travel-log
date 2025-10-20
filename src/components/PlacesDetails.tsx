import { useParams } from "react-router";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { SyntheticEvent, useEffect, useState } from "react"
import { Place } from "./Places";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { checkLoginAndGetName } from "../utils/AuthUtils";
import { CustomEvent } from "./CreatePlace";
import Comment from "./Comment";

function PlaceDetails() {

    const client = generateClient<Schema>();

    const { id } = useParams();
    const [place, setPlace] = useState<Place | undefined>(undefined)
    const [userName, setUserName] = useState<string | undefined>()
    const [comment, setComment] = useState<string>('')

    useEffect(() => {
        const handleData = async () => {
            const name = await checkLoginAndGetName();
            if (name) {
                setUserName(name)
            }

            const result = await client.models.Place.get({ id: id! })
            if (result.data) {
                setPlace(result.data)
            }
        }
        handleData();
        const sub = client.models.Place.onUpdate({
            filter: {
                id: {
                    eq: id!
                }
            }
        }).subscribe({
            next: (data) => {
                if (data) {
                    setPlace(data)
                }
            }
        })
        return () => sub.unsubscribe();

    }, [])

    function renderPhotos() {
        const rows: any[] = []
        if (place) {
            place.photos?.forEach((photo, index) => {
                if (photo) {
                    /**
                     * Files can be also handled with the aws-amplify/storage package:
                     * https://docs.amplify.aws/angular/build-a-backend/storage/download-files/
                     */
                    rows.push(<StorageImage path={photo} alt={photo} key={index} height={300} />)
                }
            })
        }
        return rows;
    }

    async function addComment(event: SyntheticEvent) {
        event.preventDefault();
        if (comment) {
            const currentComments = place?.comments ? place.comments : []
            await client.models.Place.update({
                id: id!,
                comments: [...currentComments!, {
                    author: userName,
                    content: comment
                }]
            })
            setComment('')
        }
    }

    function renderCommentForm() {
        if (userName) {
            return (
                <form onSubmit={(e) => addComment(e)}>
                    <input onChange={(e: CustomEvent) => setComment(e.target.value)} value={comment} /><br />
                    <input type="submit" value='Add comment' />
                </form>
            )
        }
    }
    
    function renderComments() {
        const rows: any[] = []
        if (place?.comments) {
            for (let index = 0; index < place.comments.length; index++) {
                const comment = place.comments[index];
                rows.push(
                    <Comment author={comment?.author} content={comment?.content} key={index} />
                )

            }
        }
        return rows
    }

    function renderPlace() {
        if (place) {
            return <div>
                <h2>Details for place {place?.name}</h2><br />
                <p>{place?.name}</p>
                <p>{place?.description}</p>
                {renderPhotos()}<br/>
                {renderCommentForm()}
                <p>Comments:</p>
                {renderComments()}
            </div>
        } else {
            return <h2>Place not found</h2>
        }
    }

    return <main>
        {renderPlace()}
    </main>
}

export default PlaceDetails

