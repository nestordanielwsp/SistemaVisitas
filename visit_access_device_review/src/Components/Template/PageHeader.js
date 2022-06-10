import React from "react";
import {useLocation} from 'react-router-dom';

export default function PageHeader({ titulo, subtitulo, item, subItem }){
    const location = useLocation();
    return (
        <div className="app-title">
            <div>
                <h1>
                    <i className="fa fa-th-list"></i> {titulo}
                </h1>
                <p>{subtitulo}</p>
            </div>
            <ul className="app-breadcrumb breadcrumb side">
                <li className="breadcrumb-item">
                    <i className="fa fa-home fa-lg"></i>
                </li>
                <li className="breadcrumb-item">
                    <span style={{cursor:"default"}}>{location.pathname.replace("/","").replaceAll("_"," ")}</span>
                </li>
                {subItem && (
                    <li className="breadcrumb-item">
                    <span style={{cursor:"pointer"}}> {subItem}</span>
                    </li>
                )}
            </ul>
        </div>
    );
}