"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MENU_ITEMS } from "@/app/constant";
import { actionItemClick } from "@/app/slice/MenuSlice";

import { socket } from "../../../socket";
import Styles from "./board.module.css";

const Board = () => {
  const dispatch = useDispatch();

  const { activeMenuItem, actionMenuItem } = useSelector(
    (state) => state?.menu
  );

  const { color, size } = useSelector(
    (state) => state?.toolbox[activeMenuItem]
  );

  const canvasRef = useRef(null);
  const shouldDraw = useRef(false);
  const drawHistory = useRef([]);
  const historyPointer = useRef(0);
  const drawRectRef = useRef(false);
  const canvasOffsetX = useRef(null);
  const canvasOffsetY = useRef(null);
  const startX = useRef(null);
  const startY = useRef(null);

  const Scolor = useRef(null);
  let Ssize = useRef(null);

  const [overlayX, setoverlayX] = useState(0);
  const [overlayY, setoverlayY] = useState(0);
  const squares = [];
  const AllLines = [];

  const [eraserleft, seteraserleft] = useState(0);
  const [eraserTop, seteraserTop] = useState(0);

  const lineStartX = useRef(null);
  const lineStartY = useRef(null);

  useEffect(() => {
    if (activeMenuItem === "ERASER") {
      drawRectRef.current = false;

      window.addEventListener("mousemove", (e) => {
        setoverlayX(e.clientX);
        setoverlayY(e.clientY);

        seteraserleft(e.clientX - size / 2);
        seteraserTop(e.clientY - size / 2);
        console.log(eraserTop, eraserleft);
      });
    }
    if (activeMenuItem === "SQUARE") {
      drawRectRef.current = true;
    }
    if (activeMenuItem === "PENCIL") {
      drawRectRef.current = false;
    }
  }, [activeMenuItem]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
      const URL = canvas.toDataURL();
      const anchor = document.createElement("a");
      anchor.href = URL;
      anchor.download = "sketch.png";
      anchor.click();
      console.log(URL);
    } else if (
      actionMenuItem === MENU_ITEMS.UNDO ||
      actionMenuItem === MENU_ITEMS.REDO
    ) {
      if (historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO)
        historyPointer.current -= 1;
      if (
        historyPointer.current < drawHistory.current.length - 1 &&
        actionMenuItem === MENU_ITEMS.REDO
      )
        historyPointer.current += 1;

      const imageData = drawHistory.current[historyPointer.current];
      context.putImageData(imageData, 0, 0);
    }
    dispatch(actionItemClick(null));
  }, [actionMenuItem]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const changeConfig = (color, size) => {
      context.strokeStyle = color;
      context.lineWidth = size;
      Scolor.current = color;
      Ssize.current = size;
    };

    const handlechange = (config) => {
      changeConfig(config.color, config.size);
    };
    changeConfig(color, size);
    socket.on("changeConfig", handlechange);

    return () => {
      socket.off("changeConfig", handlechange);
    };
  }, [color, size]);

  // before browser paint
  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    //when moutning
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const drawLine = (x, y) => {
      context.lineTo(x, y);
      context.stroke();
    };

    const beginPath = (x, y) => {
      context.beginPath();

      context.moveTo(x, y);
    };

    const DrawAllLines = () => {
      console.log(AllLines);
      AllLines.forEach((item) => {
        context.beginPath(); // Start a new path
        context.moveTo(item.x1, item.y1); // Move to the starting point of the line
        context.lineTo(item.x2, item.y2); // Draw a line to the ending point
        context.stroke();
      });
    };

    const addLines = (startX, startY, endX, endY) => {
      const line = {
        x1: startX,
        y1: startY,
        x2: endX,
        y2: endY,
      };
      AllLines.push(line);
    };

    const canvasOffset = canvas.getBoundingClientRect();
    canvasOffsetX.current = canvasOffset.top;
    canvasOffsetY.current = canvasOffset.left;

    const DrawSquare = (startX, startY, width, height, scolor, size) => {
      context.strokeStyle = scolor;
      context.lineWidth = size;
      context.strokeRect(startX, startY, width, height);
    };

    const DrawAllSquare = () => {
      context.fillStyle = "white";
      squares.forEach((square) => {
        context.lineWidth = square.size;
        context.strokeStyle = square.scolor;
        context.strokeRect(square.x, square.y, square.width, square.height);
      });
    };

    const addSqaure = (x, y, width, height, scolor, size) => {
      squares.push({ x, y, width, height, scolor, size });
    };

    const handleMouseDown = (e) => {
      shouldDraw.current = true;
      if (drawRectRef.current) {
        startX.current = e.clientX - canvasOffsetX.current;
        startY.current = e.clientY - canvasOffsetY.current;
      } else {
        lineStartY.current = e.clientY;
        lineStartX.current = e.clientX;
        beginPath(e.clientX, e.clientY);
        socket.emit("beginPath", { x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseMOve = (e) => {
      if (!shouldDraw.current) return;

      if (drawRectRef.current) {
        const newMOusex = e.clientX;
        const newMOusey = e.clientY;
        const rectwidth = newMOusex - startX.current;
        const rectheight = newMOusey - startY.current;
        context.clearRect(startX.current, startY.current, rectwidth, rectheight) ;

        DrawSquare(
          startX.current,
          startY.current,
          rectwidth,
          rectheight,
          Scolor.current,
          Ssize.current
        );
        DrawAllSquare();
      } else {
        drawLine(e.clientX, e.clientY);
        socket.emit("drawLine", { x: e.clientX, y: e.clientY });
      }
    };
    const handleMouseUp = (e) => {
      shouldDraw.current = false;


      // push into sqaures
      if (drawRectRef.current) {
        const newMOusex = e.clientX;
        const newMOusey = e.clientY;
        const rectwidth = newMOusex - startX.current;
        const rectheight = newMOusey - startY.current;
        addSqaure(
          startX.current,
          startY.current,
          rectwidth,
          rectheight,
          Scolor.current,
          Ssize.current
        );
      }
console.log(activeMenuItem)
      if (activeMenuItem === "PENCIL") {
        const newMOusex = e.clientX;
        const newMOusey = e.clientY;
        addLines(lineStartX.current, lineStartY.current, newMOusex, newMOusey);
      }

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      drawHistory.current.push(imageData);
      historyPointer.current = drawHistory.current.length - 1;
    };

    const handleBeginPath = (path) => {
      beginPath(path.x, path.y);
    };
    const handledrawLine = (path) => {
      drawLine(path.x, path.y);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMOve);
    canvas.addEventListener("mouseup", handleMouseUp);

    socket.on("beginPath", handleBeginPath);
    socket.on("drawLine", handledrawLine);

    const handleTouchStart = (event) => {
      shouldDraw.current = true;
      const touch = event.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;
      beginPath(x, y);
    };

    const handleTouchMove = (event) => {
      if (!shouldDraw.current) {
        return;
      }
      event.preventDefault();
      const touch = event.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;
      drawLine(x, y);
    };

    function handleTouchEnd(event) {
      shouldDraw.current = false;
      event.preventDefault();
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      drawHistory.current.push(imageData);
      historyPointer.current = drawHistory.current.length - 1;
    }

    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMOve);
      canvas.removeEventListener("mouseup", handleMouseUp);
      socket.off("beginPath", handleBeginPath);
      socket.off("drawLine", handledrawLine);
    };
  }, []);

  return (
    <div>
      <canvas className="overflow-hidden sm:overflow-hidden" ref={canvasRef}>
        {" "}
      </canvas>
      {activeMenuItem === "ERASER" && (
        <div
          className={Styles.overlay}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `-${size / 2}px`,
            left: `-${size / 2}px`,
            transform: `translateX(${overlayX}px) translateY(${overlayY}px)`,
          }}
        ></div>
      )}
    </div>
  );
};

export default Board;
