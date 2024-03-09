"use client";
import cx from "classnames";
import React from "react";
import styles from "./tool.module.css";
import { COLORS } from "@/app/constant";
import { useDispatch, useSelector } from "react-redux";
import { changeBrushSize, changeColor } from "@/app/slice/toolboxSlice";
import { socket } from "../../../socket";

const Toolbox = () => {
  const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);
  const dispatch = useDispatch();

  const { color ,size} = useSelector((state) => state.toolbox[activeMenuItem]);

  const updateBrushSize = (e) => {
    let newSize = parseInt(e.target.value, 10);


    if (isNaN(newSize)) {
      newSize = 1; // Set newSize to a default value (1 in this case)
  }
    if(newSize > 100){
      newSize = 100
    console.log(newSize)

    }
    if(newSize <= -1){
      newSize = 1
    console.log(newSize)
    }
    dispatch(changeBrushSize({ item: activeMenuItem, size:newSize }));
    socket.emit("changeConfig",{color,size:e.target.value})
  };

  const updateColor = (newColor) => {
    dispatch(changeColor({ item: activeMenuItem, color: newColor }));
    socket.emit("changeConfig",{color:newColor,size})
  };
  return (
    <div className={styles.toolboxContainer}>
      {(activeMenuItem === "PENCIL" || activeMenuItem === "SQUARE") && (
        <>
          <div className={styles.toolitem}>
            <h4 className={styles.tooltext}>Stroke Color</h4>
            <div className="mt-2 flex justify-between ">
              <div
                className={cx(styles.colorBox, {
                  [styles.active] :color === COLORS.BLACK,
                })}
                style={{ backgroundColor: COLORS.BLACK}}
                onClick={() => updateColor(COLORS.BLACK)}
              />
              <div
               className={cx(styles.colorBox, {
                [styles.active] :color === COLORS.RED,
              })}
                style={{ backgroundColor: COLORS.RED }}
                onClick={() => updateColor(COLORS.RED)}
              />
              <div
              className={cx(styles.colorBox, {
                [styles.active] :color === COLORS.GREEN,
              })}
                style={{ backgroundColor: COLORS.GREEN }}
                onClick={() => updateColor(COLORS.GREEN)}
              />
              <div
               className={cx(styles.colorBox, {
                [styles.active] :color === COLORS.BLUE,
              })}
                style={{ backgroundColor: COLORS.BLUE }}
                onClick={() => updateColor(COLORS.BLUE)}
              />
              <div
               className={cx(styles.colorBox, {
                [styles.active] :color === COLORS.ORANGE,
              })}
                style={{ backgroundColor: COLORS.ORANGE }}
                onClick={() => updateColor(COLORS.ORANGE)}
              />
              <div
                className={cx(styles.colorBox, {
                  [styles.active] :color === COLORS.YELLOW,
                })}
                style={{ backgroundColor: COLORS.YELLOW }}
                onClick={() => updateColor(COLORS.YELLOW)}
              />
            </div>
          </div>
        </>
      )}

      <div className={styles.toolitem}>
        <h4 className={styles.tooltext}>Brush Size {activeMenuItem}</h4>

        <div>
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={size}
            onChange={(e) =>updateBrushSize(e)}
          />
       

        <input className="border block  px-2 w-[60px] " value={size} max={100} placeholder="Add Size" onChange={(e) =>updateBrushSize(e)}/>
        </div>
      </div>
    </div>
  );
};

export default Toolbox;
