"use client";

import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { MENU_ITEMS } from '@/app/constant'; 
import { actionItemClick } from '@/app/slice/MenuSlice';

// import { Socket } from 'socket.io-client';
import { socket } from "../../../socket";

const  Board = () => {

  const dispatch = useDispatch()

const {activeMenuItem,actionMenuItem} = useSelector((state)=>state?.menu);

const {color,size} = useSelector((state) =>state?.toolbox[activeMenuItem])

const canvasRef = useRef(null)
const shouldDraw = useRef(false)

console.log("active",activeMenuItem)

const drawHistory = useRef([])
const historyPointer = useRef(0)



useEffect(() =>{

  if(!canvasRef.current) return
  const canvas = canvasRef.current;
  const context = canvas.getContext('2d')

  if(actionMenuItem === MENU_ITEMS.DOWNLOAD) {
    const URL = canvas.toDataURL()
    const anchor = document.createElement('a')
    anchor.href = URL
    anchor.download = 'sketch.png'
    anchor.click()
    console.log(URL)

  }else if(actionMenuItem === MENU_ITEMS.UNDO  || actionMenuItem === MENU_ITEMS.REDO ) {
if(historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO ) historyPointer.current -= 1
if(historyPointer.current < drawHistory.current.length -1 && actionMenuItem === MENU_ITEMS.REDO ) historyPointer.current += 1

    const imageData = drawHistory.current[historyPointer.current]
context.putImageData(imageData , 0,0)
}
dispatch(actionItemClick(null))

},[actionMenuItem])


useEffect(() =>{
  if(!canvasRef.current) return
  const canvas = canvasRef.current;
  const context = canvas.getContext('2d')

  const changeConfig =(color,size) =>{
    context.strokeStyle = color
    context.lineWidth = size
  }
const handlechange =(config) =>{
  console.log(config)
  changeConfig(config.color ,config.size)

}
  changeConfig(color,size)
  socket.on("changeConfig",handlechange)

  return () =>{
  socket.off("changeConfig",handlechange)

  }

},[color,size])



// before browser paint
    useLayoutEffect(()=>{
        if(!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')
        //when moutning
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);

        const drawLine =(x,y) =>{
          context.lineTo(x,y)
          context.stroke()
        }

        const beginPath =(x,y) =>{
          context.beginPath();
          context.moveTo(x,y)
        }

        const handleMouseDown =(e)=> {
            shouldDraw.current = true
          beginPath(e.clientX,e.clientY)

          socket.emit('beginPath',{x:e.clientX,y:e.clientY})
          
        }
        const handleMouseMOve =(e)=> {
          if(!shouldDraw.current) return
          drawLine(e.clientX,e.clientY)
          socket.emit('drawLine',{x:e.clientX,y:e.clientY})
          

        }
        const handleMouseUp =(e)=> {
          shouldDraw.current = false
          const imageData =context.getImageData(0,0,canvas.width , canvas.height)
          drawHistory.current.push(imageData);
          historyPointer.current = drawHistory.current.length - 1
        }
        
        const handleBeginPath=(path) =>{
          beginPath(path.x,path.y)
        }
        const handledrawLine=(path) =>{
          drawLine(path.x,path.y)
        }

          canvas.addEventListener("mousedown",handleMouseDown)
          canvas.addEventListener("mousemove",handleMouseMOve)
          canvas.addEventListener("mouseup",handleMouseUp)
        
          socket.on('beginPath',handleBeginPath)
          socket.on('drawLine',handledrawLine)

          return() =>{
            canvas.removeEventListener("mousedown",handleMouseDown)
            canvas.removeEventListener("mousemove",handleMouseMOve)
            canvas.removeEventListener("mouseup",handleMouseUp)
            socket.off('beginPath',handleBeginPath)
            socket.off('drawLine',handledrawLine)
          }

    },[])



  return (

<canvas ref={canvasRef} >
    
</canvas>

  )
}

export default Board
