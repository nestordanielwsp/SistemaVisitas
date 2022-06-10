import {useState} from "react";
import { useSignOut } from 'react-auth-kit';

export default function Header({ handleToggle }){
    const [showDD,setShowDD] = useState("");
    const singOut = useSignOut();

    return (
        <header className="app-header">
          <span
            style={{ cursor: "default" }}
            className="app-header__logo d-flex align-items-center justify-content-center"
          >
            <span
              className="icon-magna"
              style={{
                fontSize: "16px",
                color: "black",
                fontFamily: "sans-serif"
              }}
            >
              <span className="icon-magna" style={{fontSize:"36px"}}><span className="path1"></span><span className="path2"></span><span
                  className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span
                  className="path7"></span><span className="path8"></span><span className="path9"></span></span>
            </span>
          </span>
          <span
            data-toggle="sidebar"
            onClick={handleToggle}
            className="app-sidebar__toggle"
            style={{ cursor: "pointer" }}
          ></span>
          <ul className="app-nav">
            <li className="dropdown show">
              <span
                style={{cursor:"pointer"}}
                className="app-nav__item"
                data-toggle="dropdown"
                onClick={()=>{setShowDD(showDD === "" ? "show" : "")}}
              ><i className="fa fa-user fa-lg"></i></span>
              <ul
                className={`dropdown-menu settings-menu dropdown-menu-right ${showDD}`}
                x-placement="bottom-end"
                style={{
                  position: "absolute",
                  transform: "translate3d(-117px, 50px, 0px)",
                  top: "0px",
                  left: "0px",
                  willChange: "transform"
                }}
              >
                <li>
                  <span
                    className="dropdown-item"
                    style={{cursor:"pointer"}}
                    onClick={ev=>{singOut();}}
                  >
                    <i className="fa fa-sign-out fa-lg"></i> Logout
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </header>
    );
}
