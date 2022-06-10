import PageHeader from "../Template/PageHeader";
import {useState, useEffect, useContext} from 'react';
import {AppContext} from "../Helpers/AppProvider";
import MyAxios from "../Helpers/Calls";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Alert from "../Helpers/Alert";
import { useLocation } from "react-router-dom";
import { useAuthUser } from 'react-auth-kit';
import moment from "moment";

export default function Revision({ item, subItem }){
    const [configAlert, setConfigAlert] = useState({showAlert:false, msgError:"", typeAlert:"error"});
    const [, setState] = useContext(AppContext);
    const [agenda, setAgenda] = useState({});
    const [dispositivos, setDispositivos] = useState([]);
    const [refresh, setRefresh] = useState(true);
    let query = useQuery();
    const folio = query.get("id");
    const infoUserAuth = useAuthUser();
    let perfil = infoUserAuth();

    //FUNCIONES
    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    function fnGetEncabezado(){
        MyAxios("visit_access").get(`/VisitRecords/Schedule/${folio}`).then((res)=>{
            if(res.data){
                setAgenda(res.data);
                fnGetDispositivos(res.data.visitRecordId)
            }else{
                setAgenda({});
                setDispositivos([]);
            }
        });
    }
    function fnGetDispositivos(visitRecordId){
        MyAxios("visit_access").get(`/VisitRecords/${visitRecordId}`).then((res)=>{
            setDispositivos([...res.data.devices]);
        });
    }
    function fnSaveDispositivos(){
        const API_AV = MyAxios("visit_access");
        API_AV.interceptors.request.use((config) => {
            setState(prev=>{return {...prev, loading:true}});
            return config;
        }, (error) => {
            setState(prev=>{return {...prev, loading:false}});
            return Promise.reject(error);
        });

        API_AV.interceptors.response.use((response) => {
            setState(prev=>{return {...prev, loading:false}});
            return response;
        }, (error) => {
            setState(prev=>{return {...prev, loading:false}});
            return Promise.reject(error);
        });

        API_AV.put(`/VisitRecords/DeviceIt?ITReviewer=${perfil.userId}`,
        dispositivos).then((res)=>{
            setConfigAlert(prev=>{ return { ...prev, showAlert:true, typeAlert:"ok" } });
            setRefresh(true);
        }).catch((e) => {
            setConfigAlert(prev=>{return {...prev, showAlert:true,typeAlert:"error",msgError:"It was not possible to save the data"}})
        });
    }

    useEffect(()=>{
        if(refresh){
            setRefresh(false);
            fnGetEncabezado();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[refresh]);

    return (
    <>
        <PageHeader
            titulo="Visit Access - IT Device Review"
            subtitulo=""
            item={item}
            subItem={subItem}
        />
        <div className="card">
            <div className="card-body">
                <table className="table table-sm table-bordered thead-dark">
                    <thead>
                        <tr className="bg-danger text-white"><th style={{width:"215px"}}>Folio</th><td>{agenda.folio || folio}</td></tr>
                        <tr><th>Visitor / Client / Supplier</th><td>{agenda.visitorFullName || "Cargando ..."}</td></tr>
                        <tr><th>Visit Date</th><td>{moment(agenda.visitDate).format("DD MMM YYYY HH:mm") || "Cargando ..."}</td></tr>
                        <tr><th>Company</th><td>{agenda.company}</td></tr>
                        <tr><th>Magna Contact</th><td>{agenda.contactFullName || "Cargando ..."}</td></tr>
                        <tr><th>Reviewed By</th><td>{agenda.itReviewerFullName || `${perfil.name} ${perfil.lastName}`}</td></tr>
                    </thead>
                </table>
                {
                    dispositivos.map((d,i) => {
                        return (
                            <table key={i} className="table table-sm table-bordered">
                                <thead>
                                    <tr className="bg-danger text-white">
                                        <th style={{width:"215px"}}>IT Device</th>
                                        <td>{d.deviceType.description} / {d.brand} / {d.model || '-'} / SN:{d.serial}</td></tr>
                                    <tr>
                                        <th style={{verticalAlign: "middle"}}>Antivirus latest scan</th>
                                        <td>
                                            <DatePicker selected={!d.lastDateOfAntivirusUpdt ? null : new Date(d.lastDateOfAntivirusUpdt)}
                                                showTimeSelect
                                                dateFormat="Pp"
                                                className="form-control form-control-sm"
                                                onChange={(date)=>{
                                                    d.lastDateOfAntivirusUpdt = (new Date(date).toLocaleString('sv-se').replace(" ","T"))
                                                    setDispositivos([...dispositivos]);
                                                }}
                                            />
                                        </td></tr>
                                    <tr>
                                        <th style={{verticalAlign: "top"}}>Comments</th>
                                        <td>
                                            <textarea className="form-control form-control-sm"
                                                value={d.comments || ''}
                                                rows='3'
                                                onChange={(e)=>{
                                                    d.comments = (e.currentTarget.value || '');
                                                    setDispositivos([...dispositivos]);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                </thead>
                            </table>
                        )
                    })
                }
                {
                    dispositivos.length > 0 ?
                    (<div className="text-right">
                        <button className="btn btn-success"
                            disabled={(agenda.itReviewer != null)}
                            onClick={()=>{
                                const hayVacios = dispositivos.filter(d=> d.lastDateOfAntivirusUpdt == null && d.comments == null).length > 0;

                                if(!hayVacios){
                                    fnSaveDispositivos();
                                }
                            }}
                        >Finish review</button>
                    </div>) : <></>
                }
            </div>
        </div>
        {
            configAlert.showAlert &&
                <Alert typeAlert={configAlert.typeAlert}
                    msgSure={configAlert.msgSure}
                    msgError={configAlert.msgError}
                    handleOK={configAlert.handleOK}
                    handleClose={()=>{setConfigAlert(prev=>{return {...prev, showAlert:false}})}} />
        }
    </>);
}