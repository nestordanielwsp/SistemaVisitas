import React,{useState, useCallback} from "react";
import SideBar from "./SideBar";
import Header from "./Header";

export default function Content({children}){
    const [ToggleSideBar, SetSideBar] = useState("");
    const [itemSidebar, setItemSidebar] = useState({item_activo:"", item_expandido:"", subitem_activo:"", sidebar:""})

    // FUNCIONES
    const fnSideBarToggle = useCallback(() => {
        SetSideBar(ToggleSideBar === "sidenav-toggled" ? "" : "sidenav-toggled");
    }, [ToggleSideBar]);

    return (
        <div className={"app sidebar-mini rtl  pace-done " + ToggleSideBar}>
          <Header handleToggle={fnSideBarToggle} />
          <SideBar
            itemSidebar={itemSidebar}
            setItemSidebar={setItemSidebar}
          />
          <main className="app-content">
          {
            React.Children.map(children, child => {
                return React.cloneElement(child, { item: itemSidebar.item_activo, subItem: itemSidebar.subitem_activo })
             })
          }
          </main>
        </div>
    );
}