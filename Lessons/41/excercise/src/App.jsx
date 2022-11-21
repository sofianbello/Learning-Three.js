import { useRef, useState, useMemo, useEffect } from "react"
import Clicker from "./Clicker.jsx";
import People from "./People.jsx";

export default function App({ clickersCount, children })
{
    const [ hasClicker, setHasClicker ] = useState(true)
    const [count, setCount ] = useState(0)
    const buttonRef = useRef() 

    useEffect(()=>
    {
        buttonRef.current.style.backgroundColor = `hsl(${ Math.random()* 360}deg, 100%, 70%)`
        buttonRef.current.style.borderRadius = '3px'

    }, [])


    const toggleClickerClick = () => 
    {
        setHasClicker(!hasClicker)
        
    }

    const increment = () =>
    {
        setCount(count + 1)
    }

    const colors = useMemo(() => 
    {
        const colors =[]
        for(let i = 0; i < clickersCount; i++)
            colors.push(`hsl(${ Math.random()* 360}deg, 100%, 70%)`)
        return colors
    }, [clickersCount])
    

    return <>
        { children }

        <div>Total count { count } </div>

        <button ref={ buttonRef } onClick={ toggleClickerClick }>{ hasClicker ? 'Hide' : 'Show' } Clicker</button>
        {/* { hasClicker ? <Clicker /> : null } */}
        { hasClicker && <>
            {[...Array(clickersCount)].map( (item,index)=>
                <Clicker 
                    key={ index }
                    increment={ increment } 
                    keyName= {`count${index}`}
                    color={ colors[index] } 
                />
                )}
        </> }
                <People />
    </>
}