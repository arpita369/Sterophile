import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

// create context to avoid prop drilling i.e. we can use it any components
export const PlayerContext = createContext();

// create context provider where all the fucntions will be initialized to provide
const PlayerContextProvider = (props) => {

    // refer values to manipulate DOM and recreate ref contents(avoid rendering)
    const audioRef = useRef()
    const seekBg = useRef()
    const seekBar = useRef()

    // manages currently selected track, audio, current playback time and total duration of the audio 
    const [track, setTrack] = useState(songsData[0])  // track -> holds the current track data, setTrack -> function to update 'track' state
    const [playStatus, setPlayStatus] = useState(false)
    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0
        },
        totalTime: {
            second: 0,
            minute: 0
        }
    })

    // create functions to manipulate referenced values
    const play = () => {
        audioRef.current.play()
        setPlayStatus(true)
    }
    const pause = () => {
        audioRef.current.pause()
        setPlayStatus(false)
    }

    // asynchronous arrow function to play a specific audio track based on its ID
    const playWithId = async(id) => {
        await setTrack(songsData[id]) // waits until setTrack completes before moving to the next line
        await audioRef.current.play() // waits until audio starts playing 
        setPlayStatus(true)
    }

    // asynchronous arrow function to set the audio track to the previous song in the songsData array, plays it and update play status
    const previous = async() => {
        if (track.id > 0){
            await setTrack(songsData[track.id - 1])
            await audioRef.current.play()
            setPlayStatus(true)
        }
    }

    // asynchronous arrow function to set the audio track to the next song in the songsData array, plays it and update play status
    const next = async() => {
        if (track.id < songsData.length-1){
            await setTrack(songsData[track.id + 1])
            await audioRef.current.play()
            setPlayStatus(true)
        }
        else{
            await setTrack(songsData[0])
            await audioRef.current.play()
            setPlayStatus(true)
        }
    }

    // asynchronous arrow function that calculates the new playback position of the audio track based on the user's click on the seek bar and updates the audio element's current time accordingly
    const seekSong = async(e) => {
        audioRef.current.currentTime= ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration)
    }

    // it will run initially and whenever audioRef changes
    useEffect(() => {
        setTimeout(() => {  // it delays the execution of its content by 1000ms (1sec)
            audioRef.current.ontimeupdate = () => {  //ontimeevent is a event that fires when the playback position changes
                seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100 )) + "%"  // adjust the width of a progress bar (seekBar) to reflect the current playback progrss as a percentage 
                setTime({  // update time state with the current playback time and total duration
                    currentTime: {
                        second: Math.floor(audioRef.current.currentTime % 60),
                        minute: Math.floor(audioRef.current.currentTime / 60)
                    },
                    totalTime: {
                        second: Math.floor(audioRef.current.duration % 60),
                        minute: Math.floor(audioRef.current.duration / 60)
                    }   
                })
            }
        }, 1000);  //setTimeout function ensures that ontimeupdate event handler is set up after 1000ms
    },[audioRef])  // dependencies -> the effect runs initially and whenever 'audioRef' changes

    // contextValue is an object which holds various values and functions
    const contextValue = {
        audioRef, // reference to audio element to directly manipulate DOM element
        seekBg, // reference to seek bar background, used to control current position within the track
        seekBar, // reference to seek bar, used to display current playback position of the audio track
        track, setTrack, // state and its setter function for current track being played
        playStatus, setPlayStatus, // state and its setter function for whether the audio is playing or paused
        time, setTime, // state and its setter function for the current playback time of the audio
        play, pause, // function to play and pause the audio
        playWithId, // function to play a specific track by its ID
        previous, next, // function to navigate to the previous or next track in the playlist
        seekSong // function to seek a specific time within the current track
    }

    return [ // returns the context provider
        
        //  PlayerContext.Provider component wraps props.children and value is set to contextValue, means any child component inside the provider will have access to the context values
        <PlayerContext.Provider value={contextValue}> 
            {props.children} 
        </PlayerContext.Provider>
    ]

}

export default PlayerContextProvider