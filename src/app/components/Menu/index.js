"use client";
import cx from "classnames";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faEraser,
  faRotateRight,
  faRotateLeft,
  faFileArrowDown,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";

import { FaRegSquare } from "react-icons/fa6";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { MENU_ITEMS } from "@/app/constant";
import { menuItemClick, actionItemClick } from "@/app/slice/MenuSlice";

const Menu = () => {
  const dispatch = useDispatch();
  const { activeMenuItem } = useSelector((state) => state.menu);

  const handleMenuClick = (itemname) => {
    dispatch(menuItemClick(itemname));
  };

  const handleActionItem = (itemname) => {
    dispatch(actionItemClick(itemname));
  };

  return (
    <div className={styles.menuContainer}>
      <div
        className={cx(styles.iconWrapper, {
          [styles.active]: activeMenuItem === MENU_ITEMS.PENCIL,
        })}
        onClick={() => handleMenuClick(MENU_ITEMS.PENCIL)}
      >
        <FontAwesomeIcon icon={faPencil} className={styles.icon} />
      </div>
      <div
        className={cx(styles.iconWrapper, {
          [styles.active]: activeMenuItem === MENU_ITEMS.SQUARE,
        })}
        onClick={() => handleMenuClick(MENU_ITEMS.SQUARE)}
      >
      <FaRegSquare/>
      </div>
      <div
        className={cx(styles.iconWrapper, {
          [styles.active]: activeMenuItem === MENU_ITEMS.ERASER,
        })}
        onClick={() => handleMenuClick(MENU_ITEMS.ERASER)}
      >
        <FontAwesomeIcon icon={faEraser} className={styles.icon} />
      </div>

      <div
        className={styles.iconWrapper}
        onClick={() => handleActionItem(MENU_ITEMS.UNDO)}
      >
        <FontAwesomeIcon icon={faRotateLeft} className={styles.icon} />
      </div>

      <div
        className={styles.iconWrapper}
        onClick={() => handleActionItem(MENU_ITEMS.REDO)}
      >
        <FontAwesomeIcon icon={faRotateRight} className={styles.icon} />
      </div>

      <div
        className={styles.iconWrapper}
        onClick={() => handleActionItem(MENU_ITEMS.DOWNLOAD)}
      >
        <FontAwesomeIcon icon={faFileArrowDown} className={styles.icon} />
      </div>

    </div>
  );
};

export default Menu;
