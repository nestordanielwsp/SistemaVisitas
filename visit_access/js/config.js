const API_CONFIGURATION1= `http://est03des.magna.global:5003/api`;
const API_VISITOR_ACCESS1 = `http://est03des.magna.global:5002/api`; 
const API_VISITOR_ACCESS= `http://localhost:5000/api`; 
const API_CONFIGURATION = `http://localhost:5001/api`; 
const MODULE = "VISITOR ACCESS";
const VERSION = "1.0.7";
const PATH_FILES = `${window.location.origin}/files_app`;


const CallGet = (URLRequest, authBearer = "") => {
    return axios({
        url: URLRequest,
        method: "get",
        headers: {'Authorization': authBearer}
    });
}

const CallPost = (URLRequest, data, authBearer = "") => {
    return axios({
        url: URLRequest,
        method: "post",
        headers: {'Authorization': authBearer},
        data: data
    });
}

const CallPut = (URLRequest, data, authBearer = "") => {
    return axios({
        url: URLRequest,
        method: "put",
        headers: {'Authorization': authBearer},
        data: data
    });
}

const CallDelete = (URLRequest, authBearer = "") => {
    return axios({
        url: URLRequest,
        method: "delete",
        headers: {'Authorization': authBearer}
    });
}

const NotifySuccess = (msg) => {
    return swal("Fine!", msg, "success");
}

const NotifyError = (msg) => {
    return swal("Error!", msg, "error");
}

const NotifySure = (msg, msgButton, fnSuccess) => {
    return swal({
        title: 'Are you sure?',
        text: msg,
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: msgButton,
      },(isConfirmed) => {
        if (isConfirmed) {
            fnSuccess();
          }
    });
}

const BuildFormData = (formData, data, parentKey) => {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
        Object.keys(data).forEach(key => {
            BuildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
        });
    } else {
        const value = data == null ? '' : data;
        formData.append(parentKey, value);
    }
}

