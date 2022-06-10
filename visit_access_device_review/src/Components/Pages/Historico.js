import PageHeader from "../Template/PageHeader";
import {useState, useEffect, useContext} from 'react';
import {AppContext} from "../Helpers/AppProvider";
import TemaMuiDt from "../Helpers/TemaMuiDt";
import MUIDataTable from "mui-datatables";
import MyAxios from "../Helpers/Calls";
import moment from "moment";

export default function Historico({ item, subItem }){
    const [, setState] = useContext(AppContext);
    const [refresh, setRefresh] = useState(true);
    const [historico, setHistorico] = useState([]);
    const [filtro, setFiltro] = useState({fechaIni: moment().add(-30,'days'), fechaFin: moment().add(30,'days')})

    const fnGetHistorico = () => {
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

        API_AV.get(`/VisitRecords/Schedule?fechaIni=${moment(filtro.fechaIni).format("YYYY-MM-DD")}&fechaFin=${moment(filtro.fechaFin).format("YYYY-MM-DD")}&isReviewedByIT=true`).then((res)=>{
            setHistorico([...res.data]);
            setRefresh(false);
        }).catch((e) => {
            setHistorico([]);
        });
    }
    useEffect(()=>{
        if(refresh){
            setRefresh(false);
            fnGetHistorico();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[refresh]);

    return (
    <>
        <PageHeader
            titulo="Visit Access - History of IT Devices"
            subtitulo=""
            item={item}
            subItem={subItem}
        />

        <div className="card mb-2">
            <div className="card-body py-1">
                <div className="d-flex">
                    <div className="form-group mr-1">
                        <small className="form-text text-muted">Start Date</small>
                        <input type="date" value={moment(filtro.fechaIni).format("YYYY-MM-DD")} className="form-control form-control-sm"
                        onChange={(ev)=>{
                            const date = (ev.currentTarget.valueAsDate && ev.currentTarget.valueAsDate.toISOString().slice(0,10));
                            setFiltro(prev=> ({...prev, fechaIni: date})) }} />
                    </div>
                    <div className="form-group mr-1">
                        <small className="form-text text-muted">End Date</small>
                        <input type="date" value={moment(filtro.fechaFin).format("YYYY-MM-DD")} className="form-control form-control-sm"
                        onChange={(ev)=>{
                            const date = (ev.currentTarget.valueAsDate && ev.currentTarget.valueAsDate.toISOString().slice(0,10));
                            setFiltro(prev=> ({...prev, fechaFin: date})) }} />
                    </div>
                    <div className="d-flex align-items-center">
                        <button className="btn btn-sm btn-primary ml-1 mt-1"
                                onClick={()=>{ setRefresh(true);  }}
                        ><i className="fa fa-search m-0"></i></button>
                    </div>
                </div>
            </div>
        </div>

        <TemaMuiDt>
            <MUIDataTable
                title={""}
                data={historico}
                columns={[
                    {
                        name: "folio",
                        label: "Folio",
                        options: {
                            sort: false,
                            customBodyRender: (value, tableMeta, updateValue) => (
                                <div className="px-2 py-1">{value}</div>
                            ),
                            customHeadRender: (columnMeta, updateDirection) => (
                                <th key={0} className="px-2" style={{ border:"1px solid lightgray" }}>
                                    {columnMeta.label}
                                </th>
                            )
                        }
                    },
                    {
                        name: "visitorFullName",
                        label: "Visitor / Client / Supplier",
                        options: {
                            customBodyRender: (value, tableMeta, updateValue) => (
                                <div className="px-2 py-1 text-capitalize">{value.toLowerCase()}</div>
                            ),
                            customHeadRender: (columnMeta, updateDirection) => (
                                <th key={1} className="px-2" style={{ border:"1px solid lightgray" }}>
                                    {columnMeta.label}
                                </th>
                            )
                        }
                    },
                    {
                        name: "visitDate",
                        label: "Visit Date",
                        options: {
                            sort: false,
                            customBodyRender: (value, tableMeta, updateValue) => (
                                <div className="px-2 py-1">{moment(value).format("DD MMM YYYY HH:mm")}</div>
                            ),
                            customHeadRender: (columnMeta, updateDirection) => (
                                <th key={2} className="px-2" style={{ border:"1px solid lightgray" }}>
                                    {columnMeta.label}
                                </th>
                            )
                        }
                    },
                    {
                        name: "company",
                        label: "Company",
                        options: {
                            customBodyRender: (value, tableMeta, updateValue) => (
                                <div className="px-2 py-1">{value}</div>
                            ),
                            customHeadRender: (columnMeta, updateDirection) => (
                                <th key={3} className="px-2" style={{ border:"1px solid lightgray" }}>
                                    {columnMeta.label}
                                </th>
                            )
                        }
                    },
                    {
                        name: "contactFullName",
                        label: "Contact",
                        options: {
                            customBodyRender: (value, tableMeta, updateValue) => (
                                <div className="px-2 py-1 text-capitalize">{value.toLowerCase()}</div>
                            ),
                            customHeadRender: (columnMeta, updateDirection) => (
                                <th key={4} className="px-2" style={{ border:"1px solid lightgray" }}>
                                    {columnMeta.label}
                                </th>
                            )
                        }
                    },
                    {
                        name: "itReviewerFullName",
                        label: "IT Reviewer",
                        options: {
                            customBodyRender: (value, tableMeta, updateValue) => (
                                <div className="px-2 py-1 text-capitalize">{value && value.toLowerCase()}</div>
                            ),
                            customHeadRender: (columnMeta, updateDirection) => (
                                <th key={5} className="px-2" style={{ border:"1px solid lightgray" }}>
                                    {columnMeta.label}
                                </th>
                            )
                        }
                    }
                ]}
                options={{
                    selectableRows: "none",
                    download: false,
                    print: false,
                    viewColumns: false,
                    onRowClick:(rowData, rowMeta)=>{
                        window.location.href = (window.location.href.replace("historico",`revision?id=${historico[rowMeta.dataIndex].folio}`))
                    }
                }}
            />
        </TemaMuiDt>
    </>);
}