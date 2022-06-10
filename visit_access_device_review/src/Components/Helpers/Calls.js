import axios from "axios";

export default function MyAxios(myApi){

    let URLap = '';

    if(myApi == 'configuration')
        URLap = 'http://est03des.magna.global:5003/api'
    else if(myApi == 'visit_access')
        URLap = 'http://est03des.magna.global:5002/api'
    else
        URLap = 'http://est03des.magna.global:5000/api'

    const instance = axios.create({
        baseURL: (URLap)
    });

    return instance;
}