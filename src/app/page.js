

import Board from "./components/Board/board";
import Menu from "./components/Menu";
import Toolbox from "./components/Toolbox/tool";

export default function Home() {
  return (
    <>

<div className="overflow-x-hidden overflow-y-hidden">
<Menu/>
  <Toolbox/>
  <Board/> </div>


  </>
  );
}
