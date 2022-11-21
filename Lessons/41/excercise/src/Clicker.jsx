import { useRef, useEffect, useState } from "react";

export default function Clicker({ increment, keyName, color })
{

    const [count, setCount] = useState(localStorage.getItem(keyName) ?? 0)
    const buttonRef1 = useRef()
    const buttonRef2 = useRef()
    

    useEffect(() => 
    {
      buttonRef1.current.style.backgroundColor = 'salmon'
      buttonRef1.current.style.color = 'papayawhip'
      buttonRef1.current.style.borderRadius = '3px'
      buttonRef2.current.style.backgroundColor = 'salmon'
      buttonRef2.current.style.color = 'papayawhip'
      buttonRef2.current.style.borderRadius = '3px'

      
      return () => 
      {
        localStorage.removeItem(keyName)
      }
    }, [])
    useEffect(()=>
    {
        localStorage.setItem(keyName, count)
    },[ count ])


    // Method #1
    const buttonClick0 = () => 
    { 
        setCount ((value)=> value + 1)
        increment()
    }
    // Method #2
    const buttonClick1 = () => 
    { 
        setCount (count - 1 )
    }
    
    return <div>
            <div style={ { color }}>Click count: { count }</div>
            <button ref={ buttonRef1 } onClick={ buttonClick1 }>-</button>
            <span> </span>
            <button ref={ buttonRef2 } onClick={ buttonClick0 }>+</button>
        </div>
}