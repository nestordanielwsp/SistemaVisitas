import axios from "axios";

export default function _axios(myApi, auth){
    let URLap = '';

    if(myApi == 'configuration')
        URLap = 'http://localhost:5000/api'
    else if(myApi == 'visit_access')
        URLap = 'http://est03des.magna.global:5002/api'
    else
        URLap = 'http://localhost:5000/api'

    const instance = axios.create({
        baseURL: (URLap)
    });

    instance.defaults.headers.common['Authorization'] = auth;
    return instance;
    
}
