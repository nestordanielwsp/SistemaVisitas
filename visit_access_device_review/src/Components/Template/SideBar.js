import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthUser } from 'react-auth-kit';
import { fileConfig } from '../../config.js';

//Items del menu
function ItemMenu({ texto, icon, handleToggle, location, children, expanded, active }) {
    return (
      <li
        className = {
          "treeview " + (expanded === texto && children ? "is-expanded" : "")
        }
      >
        <NavLink
          activeClassName="active"
          to={location}
          className="app-menu__item"
          data-toggle="treeview"
        >
          <i className={"app-menu__icon fa " + icon}></i>
          <span className="app-menu__label">{texto}</span>
          {children && <i className="treeview-indicator fa fa-angle-right"></i>}
        </NavLink>
        <ul
          className = "treeview-menu"
        >
          {children}
        </ul>
      </li>
    );
}

export default function SideBar({
    itemSidebar,
    setItemSidebar
}){
    const infoUserAuth = useAuthUser();
    let perfil = infoUserAuth();
    const pathAvatar = (perfil.image == null ? '' : `${fileConfig.pathProfile}/config/profile/${perfil.image}`);
    const [errAvatar, setErrAvatar] = useState(false);

    const handleErrAvatar = () => {
      setErrAvatar(true);
    }
    return (
        <div>
            <div className="app-sidebar__overlay" data-toggle="sidebar"></div>
            <aside className="app-sidebar">
                <div className="app-sidebar__user">
                {
                  errAvatar ? (
                    <svg className="app-sidebar__user-avatar" xmlns="http://www.w3.org/2000/svg"
                    style={{ width: "100%", maxWidth: "48px", backgroundSize: "cover" }}
                    version="1.1" x="0px" y="0px" viewBox="0 0 1000 1000" >
                      <g>
                        <path fillOpacity={.6} fill="white" d="M707.3,573.1C649,614.3,577.4,638.6,500,638.6c-77.4,0-149-24.3-207.3-65.4C163.1,654.9,75.5,810.9,75.5,990h848.9C924.5,810.9,836.9,654.9,707.3,573.1z"/>
                        <path fillOpacity={.6} fill="white" d="M219.9,290.1c0,154.7,125.4,280.1,280.1,280.1c154.7,0,280.1-125.4,280.1-280.1S654.7,10,500,10C345.3,10,219.9,135.4,219.9,290.1z"/>
                      </g>
                    </svg>
                  ) :(
                    <img
                      onError={handleErrAvatar}
                      className="app-sidebar__user-avatar"
                      src={pathAvatar}
                      style={{ width: "100%", maxWidth: "48px", backgroundSize: "cover" }}
                      alt="User"
                    />
                  )
                }
                  <div>
                    <p className="app-sidebar__user-name text-capitalize">
                    {
                      `${perfil.name.split(' ').length > 1 ? `${perfil.name.split(' ')[0]} ${perfil.name.split(' ')[1][0]}.` : perfil.name} ${perfil.lastName}`.toLowerCase()
                    }
                    </p>
                    <p className="app-sidebar__user-designation">{perfil.area && perfil.area.description}</p>
                  </div>
                </div>
                <ul className="app-menu">
                    <ItemMenu
                        icon="fa-check-square-o"
                        location="revision"
                        handleToggle={setItemSidebar}
                        texto="Review"
                        expanded={itemSidebar.item_expandido}
                        active={itemSidebar.item_activo}
                    />
                    <ItemMenu
                        icon="fa-history"
                        location="historico"
                        handleToggle={setItemSidebar}
                        texto="History"
                        expanded={itemSidebar.item_expandido}
                        active={itemSidebar.item_activo}
                    />
                </ul>
                <div className="text-white text-center position-absolute" style={{bottom:"10px",left: 0,right: 0}}>v1.0.0</div>
            </aside>
        </div>
    );
}