let infoUser = {};
let dateFilters = {
    fechaIni: new Date(),
    fechaFin: new Date()
}
let tbVisitas = null, tbCompanies = null, tbGafetes = null, tbDocumentos = null, tbTipoDisp = null, tbTipoVisitante = null, tbCursoSeg = null;
let vid_repeticion, vid_flagPostVideo = false;

const fnCargarUsuario = () => {
    infoUser = JSON.parse(sessionStorage.getItem("_authVisitorAccess"));
    const userRoutes = JSON.parse(sessionStorage.getItem("_authRoutesVisitorAccess"));
    if(userRoutes.filter(path => path === "/visits").length === 0) location.href = "./schedule.html";
    if(infoUser == null) location.href = "./login.html";

    if(infoUser.image == "" || infoUser.image == null){
        document.querySelector('.app-sidebar__user-avatar').innerHTML =
            `<span>${infoUser.name.slice(0,1).toUpperCase()}</span><span>${infoUser.lastName.slice(0,1).toUpperCase()}</span>`;
    } else
        document.querySelector('.app-sidebar__user-avatar').style.backgroundImage = `url(${PATH_FILES}/CONFIG/PROFILE/${infoUser.image})`;

    document.querySelector('.app-sidebar__user-name').textContent = `${infoUser.name} ${infoUser.lastName}`.toLowerCase();
    document.querySelector('.app-sidebar__user-designation').textContent = infoUser.area.description.toLowerCase();
    document.querySelectorAll('.app-sidebar__user-name, .app-sidebar__user-designation').forEach(e => { e.classList.add('text-capitalize'); });

    return infoUser;
}
const fnCargarFechasInicioFin = () => {
    dateFilters.fechaIni = moment().add(-30,'days');
    dateFilters.fechaFin = moment().add(30,'days');
    document.querySelector('#txt_finicio').textContent = moment(dateFilters.fechaIni).format("DD/MM/YYYY");
    document.querySelector('#txt_ffin').textContent = moment(dateFilters.fechaFin).format("DD/MM/YYYY");
}
const fnCargarDatosVisitas = () => {
    CallGet(`${API_VISITOR_ACCESS}/VisitRecords/Schedule?`+
            `fechaIni=${moment(dateFilters.fechaIni).format("YYYY-MM-DD")}&`+
            `fechaFin=${moment(dateFilters.fechaFin).format("YYYY-MM-DD")}`)
    .then(res => {
        tbVisitas.clear();
        tbVisitas.rows.add(res.data);
        tbVisitas.draw();
    })
    .catch(err => {
        console.error(err);
        NotifyError("There was a problem loading the data")
    });
}
const fnCargarDatosCompanies = () => {
    CallGet(`${API_VISITOR_ACCESS}/Companies`)
    .then(res => {
        tbCompanies.clear();
        tbCompanies.rows.add(res.data);
        tbCompanies.draw();
    })
    .catch(err => {
        console.error(err);
        NotifyError("There was a problem loading the data")
    });
}
const fnCargarDatosSecBadges = () => {
    CallGet(`${API_VISITOR_ACCESS}/SecurityBadges`)
    .then(res => {
        tbGafetes.clear();
        tbGafetes.rows.add(res.data);
        tbGafetes.draw();
    })
    .catch(err => {
        console.error(err);
        NotifyError("There was a problem loading the data")
    });
}
const fnCargarDatosDocuments = () => {
    CallGet(`${API_VISITOR_ACCESS}/Documents`)
    .then(res => {
        tbDocumentos.clear();
        tbDocumentos.rows.add(res.data);
        tbDocumentos.draw();
    })
    .catch(err => {
        NotifyError("There was a problem loading the data")
    });
}
const fnCargarDatosDeviceTypes = () => {
    CallGet(`${API_VISITOR_ACCESS}/DeviceTypes`)
    .then(res => {
        tbTipoDisp.clear();
        tbTipoDisp.rows.add(res.data);
        tbTipoDisp.draw();
    })
    .catch(err => {
        NotifyError("There was a problem loading the data")
    });
}
const fnCargarDatosVisitorTypes = () => {
    CallGet(`${API_VISITOR_ACCESS}/VisitorTypes`)
    .then(res => {
        tbTipoVisitante.clear();
        tbTipoVisitante.rows.add(res.data);
        tbTipoVisitante.draw();
    })
    .catch(err => {
        NotifyError("There was a problem loading the data")
    });
}
const fnCargarDatosSecCourses = () => {
    CallGet(`${API_VISITOR_ACCESS}/SecurityCourses`)
    .then(res => {
        tbCursoSeg.clear();
        tbCursoSeg.rows.add(res.data);
        tbCursoSeg.draw();
    })
    .catch(err => {
        NotifyError("There was a problem loading the data")
    });
}
const fnCargarEstructuraTablaVisitas = () => {
    tbVisitas = $('#tbVisitas').DataTable({
        columns: [
            { data: "folio" },
            { data: "visitorFullName" },
            { data: "company" },
            {
                data: "visitRecordId",
                render: (data, type, full, meta) => (
                    full.securityBadge == null ?
                        `<button class="btn btn-outline-primary btn-sm" onclick='handleOpenModal("assign-gafete",${JSON.stringify(full)})' type="button">ASSIGN</button>` :
                        `<button class="btn btn-outline-primary btn-sm" onclick='handleOpenModal("view-gafete",${JSON.stringify(full)})' type="button">${full.securityBadge} / ${full.document}</button>`
                )
            },
            { data: "contactFullName" },
            {
                data: "deviceQty",
                render: (data, type, full, meta) => (
                    (full.entryDate == null && data === 0) ?
                        `<button class="btn btn-outline-primary btn-sm" onclick='handleOpenModal("assign-devices",${JSON.stringify(full)})' type="button">SELECT</button>` :
                        `<button class="btn btn-outline-primary btn-sm" onclick='handleOpenModal("view-devices",${JSON.stringify(full)})' type="button">${data} Devices</button>`
                )
            },
            {
                data: "visitDate",
                render: (data) => moment(data).format("DD MMM YYYY HH:mm")
            },
            {
                data: "entryDate",
                render:(data, type, full, meta) => {
                    if(data == null && !full.hasCourse)
                        return `<button class="btn btn-outline-primary btn-sm" onclick='handleOpenModal("view-visitSecCourse",${JSON.stringify(full)})' type="button">SAFETY COURSE</button>`;
                    if(data == null && full.hasCourse)
                        return `<button class="btn btn-outline-primary btn-sm" onclick='handleCheckIn(${JSON.stringify(full)})' type="button">CHECK IN</button>`
                    return moment(data).format("DD MMM YYYY HH:mm");
                }
            },
            {
                data: "departureDate",
                render: (data, type, full, meta) => {
                    if(data == null && full.entryDate == null)
                        return '---';
                    if(data == null)
                        return `<button class="btn btn-outline-primary btn-sm" onclick='handleCheckOut(${JSON.stringify(full)})' type="button">CHECK OUT</button>`;
                    return moment(data).format("DD MMM YYYY HH:mm");
                }
            }
        ],
        order: [[ 6, "desc" ]]
    });
}
const fnCargarEstructuraTablaCompanies = () => {
    tbCompanies = $("#tbCompanies").DataTable({
        columns: [
            { data: "companyId" },
            { data: "description" },
            {
                data: "isEnabled",
                render: (data) => (data ? "Activo" : "Inactivo")
            },
            {
                data: "companyId",
                render: (data, type, full, meta) => `<button class='btn btn-outline-primary btn-sm' onclick='handleOpenModal("edit-company",${JSON.stringify(full)})' type='button'>EDIT</button>`
            }
        ]
    });
}
const fnCargarEstructuraTablaGafetes = () => {
    tbGafetes = $("#tbGafetes").DataTable({
        columns: [
            { data: "securityBadgeId" },
            { data: "description" },
            {
                data: "isEnabled",
                render: (data) => (data ? "Activo" : "Inactivo")
            },
            {
                data: "securityBadgeId",
                render: (data, type, full, meta) => `<button class='btn btn-outline-primary btn-sm' onclick='handleOpenModal("edit-gafete", ${JSON.stringify(full)})' type='button'>EDIT</button>`
            }
        ]
    });
}
const fnCargarEstructuraTablaDocuments = () => {
    tbDocumentos = $("#tbIDCards").DataTable({
        columns: [
            { data: "documentId" },
            { data: "description" },
            {
                data: "isEnabled",
                render: (data) => (data ? "Activo" : "Inactivo")
            },
            {
                data: "documentId",
                render: (data, type, full, meta) => `<button class='btn btn-outline-primary btn-sm' onclick='handleOpenModal("edit-document", ${JSON.stringify(full)})' type='button'>EDIT</button>`
            }
        ]
    });
}
const fnCargarEstructuraTablaDeviceType = () => {
    tbTipoDisp = $("#tbDeviceType").DataTable({
        columns: [
            { data: "deviceTypeId" },
            { data: "description" },
            {
            data: "isEnabled",
                render: (data) => (data ? "Activo" : "Inactivo")
            },
            {
                data: "deviceTypeId",
                render: (data, type, full, meta) => `<button class='btn btn-outline-primary btn-sm' onclick='handleOpenModal("edit-device", ${JSON.stringify(full)})' type='button'>EDIT</button>`
            }
        ]
    });
}
const fnCargarEstructuraTablaVisitType = () => {
    tbTipoVisitante = $("#tbTipoVisita").DataTable({
        columns: [
            { data: "visitorTypeId" },
            { data: "description" },
            {
            data: "isEnabled",
                render: (data) => (data ? "Activo" : "Inactivo")
            },
            {
                data: "visitorTypeId",
                render: (data, type, full, meta) => `<button class='btn btn-outline-primary btn-sm' onclick='handleOpenModal("edit-visitorType", ${JSON.stringify(full)})' type='button'>EDIT</button>`
            }
        ]
    });
}
const fnCargarEstructuraTablaSecCourse = () => {
    tbCursoSeg = $("#tbCursoSeg").DataTable({
        columns: [
            { data: "securityCourseId" },
            { data: "description" },
            { data: "fileName" },
            {
                data: "registryDate",
                render: (data) => moment(data).format("DD MMM YYYY HH:mm")
            },
            {
                data: "isEnabled",
                render: (data) => (data ? "Activo" : "Inactivo")
            },
            {
                data: "securityCourseId",
                render: (data, type, full, meta) => `<button class='btn btn-outline-primary btn-sm' onclick='handleOpenModal("edit-secCourse", ${JSON.stringify(full)})' type='button'>EDIT</button> <button class='btn btn-danger btn-sm' onclick='handleDeleteSecCourse(${data})' type='button'>DEL</button>`
            }
        ]
    });
}
const fnGetFormFilter = () => {
    return (
        `<div>
            <div class="form-group">
                <label class="col-form-label col-form-label-sm" for= "inputSmall" > Start date</label>
                <input class="form-control form-control-sm" id="ctrlFechaIni" type="date" value="${moment(dateFilters.fechaIni).format("YYYY-MM-DD")}">
            </div>
            <div class="form-group">
                <label class="col-form-label col-form-label-sm" for="inputSmall">End date</label>
                <input class="form-control form-control-sm" id="ctrlFechaFin" type="date" value="${moment(dateFilters.fechaFin).format("YYYY-MM-DD")}">
            </div>
        </div>`
    );
}
const fnGetFooterFilter = () => {
    return (
        `<div style="width:100%;text-align:right;">
            <button type="button" class="btn btn-success" onclick="handleSaveFilters()">Save changes</button>
        </div>`
    )
}
const handleSaveFilters = () => {
    const dateIni = document.querySelector('#ctrlFechaIni').valueAsDate && document.querySelector('#ctrlFechaIni').valueAsDate.toISOString().slice(0,10);
    const dateFin = document.querySelector('#ctrlFechaIni').valueAsDate && document.querySelector('#ctrlFechaFin').valueAsDate.toISOString().slice(0,10)

    if(dateIni == null || dateFin == null){
        NotifyError("Missing data to capture")
        return;
    }

    dateFilters.fechaIni = moment(dateIni);
    dateFilters.fechaFin = moment(dateFin);
    document.querySelector('#txt_finicio').textContent = moment(dateIni).format("DD/MM/YYYY");
    document.querySelector('#txt_ffin').textContent = moment(dateFin).format("DD/MM/YYYY");

    $('#modalito').modal('toggle');
    fnCargarDatosVisitas();
}
const handleValidateEmailVisitor = () => {
    const email = document.querySelector("#mod_ctrlEmail").value.trim();
    if(email == "") return;

    CallGet(`${API_VISITOR_ACCESS}/Visitors/ByEmail?email=${email}`)
    .then(res => {
        const result = res.data;
        console.log(result);
        document.querySelector('#mod_ctrlNombre').value = result.name;
        document.querySelector('#mod_ctrlApellido').value = result.lastName;
        $('#mod_ctrlTipoVisita').val(result.visitorTypeId.toString());
        $('#mod_ctrlCompany').val(result.companyId.toString());

        //REMOVE DISABLE
        document.querySelectorAll('#mod_ctrlNombre,#mod_ctrlApellido,#mod_ctrlTipoVisita-flexdatalist,#mod_ctrlCompany-flexdatalist')
                .forEach(e=> { e.setAttribute('disabled','disabled'); });
    })
    .catch(error => {
        //REMOVE DISABLE
        document.querySelectorAll('#mod_ctrlNombre,#mod_ctrlApellido,#mod_ctrlTipoVisita-flexdatalist,#mod_ctrlCompany-flexdatalist')
        .forEach(e=> { e.removeAttribute('disabled'); });
    });
}
const handleValidateMayus = (ev) => {
    ev.value = ev.value.toUpperCase();
}
const handleOpenCompanyConfig = () => {
    document.querySelector('#modalito h5.modal-title').innerHTML = "Configuración de compañias";
    document.querySelectorAll('#modalito form:nth-child(1), #modalito div.modal-footer > div:nth-child(1)').forEach(e=>e.classList.add('d-none'));
    document.querySelectorAll('#modalito form:nth-child(2), #modalito div.modal-footer > div:nth-child(2)').forEach(e=>e.classList.remove('d-none'));
    document.querySelector('#modal_ctrlNewCompanie').value = "";
}
const handleAddDays = () => {
    document.querySelector('#mod_ctrlDias').value = (parseInt(document.querySelector('#mod_ctrlDias').value) + 1);
}
const handleRemoveDays = () => {
    if(document.querySelector('#mod_ctrlDias').value > 1)
        document.querySelector('#mod_ctrlDias').value = (parseInt(document.querySelector('#mod_ctrlDias').value) - 1);
}
const handleReturnToVisit = () => {
    document.querySelector('#modalito h5.modal-title').innerHTML = "Register new visit";
    document.querySelectorAll('#modalito form:nth-child(1), #modalito div.modal-footer > div:nth-child(1)').forEach(e=>e.classList.remove('d-none'));
    document.querySelectorAll('#modalito form:nth-child(2), #modalito div.modal-footer > div:nth-child(2)').forEach(e=>e.classList.add('d-none'));
}
const fnGetFormsNewVisit = () => {
    return (
        `<form class="row" onsubmit="event.preventDefault(); handleSaveNewVisit();">
            <div class="form-group col-6">
                <label class="control-label">Visit / supplier email</label>
                <div class="input-group">
                    <input class="form-control" type="mail" id="mod_ctrlEmail" placeholder="Enter an email">
                    <div class="input-group-prepend">
                        <button type="button" class="btn btn-primary" onclick="handleValidateEmailVisitor()"
                                style="border-radius: 0px 4px 4px 0px;"><i class="fa fa-search m-0" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
            <div class="form-group col-6">
                <label class="control-label">Type of visit (visit or provider)</label>
                <input class="form-control" type="text" id="mod_ctrlTipoVisita" placeholder="Select here">
            </div>
            <div class="form-group col-12">
                <label class="control-label">Visit / supplier data</label>
                <div class="row">
                    <div class="col-6">
                        <input class="form-control" type="text" onkeyup="handleValidateMayus(this)" id="mod_ctrlNombre" placeholder="Enter name">
                    </div>
                    <div class="col-6">
                        <input class="form-control" type="text" onkeyup="handleValidateMayus(this)" id="mod_ctrlApellido" placeholder="Enter the last name">
                    </div>
                </div>
            </div>
            <div class="form-group col-6">
                <label class="control-label">Company</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="mod_ctrlCompany" placeholder="Select here" />
                    <div class="input-group-prepend">
                        <button type="button" class="btn btn-primary" onclick="handleOpenCompanyConfig()" style="border-radius: 0px 4px 4px 0px;">
                            <i class="fa fa-cog m-0" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="form-group col-6 mb-0">
                <label class="control-label">Contact</label>
                <input class="form-control" type="text" id="mod_ctrlContactMagna" placeholder="Select here" />
            </div>
            <div class="form-group col-6 mb-0">
                <label class="control-label">Date of the visit</label>
                <input class="form-control" id="mod_ctrlFecha" type="datetime-local" style="background: white;" />
            </div>
        </form>
        <form class="row d-none">
            <div class="form-group col-12  mb-0">
                <label class="control-label">Company</label>
                <div class="row">
                    <div class="col-12">
                        <input class="form-control" type="text" onkeyup="handleValidateMayus(this)" id="modal_ctrlNewCompanie" placeholder="Enter a company">
                    </div>
                </div>
            </div>
        </form>`
    )
}
const fnGetFooterNewVisit = () => {
    return (
        `<div style="width:100%;text-align:right;">
            <button type="button" class="btn btn-success" onclick="handleSaveNewVisit()">Save changes</button>
        </div>
        <div class="d-none" style="width:100%;text-align:right;">
            <button type="button" class="btn btn-success" onclick="handleSaveCompany(()=>{fnFillFlexDataList('#mod_ctrlCompany', 'companies', true, false);})"  style="margin-right: 10px;">Save changes</button>
            <button type="button" onclick="handleReturnToVisit()" class="btn btn-secondary">Return</button>
        </div>`
    )
}
const fnFillFlexDataList = (flexdatalistId, type, selectionRequired, isMultiple) => {
    switch(type){
        case "companies":
            CallGet(`${API_VISITOR_ACCESS}/Companies?isEnabled=true`)
            .then(res => {
                $(flexdatalistId).flexdatalist({
                    minLength: 0,
                    multiple: isMultiple,
                    valueProperty: "id",
                    selectionRequired: selectionRequired,
                    visibleProperties: ["description"],
                    searchIn: "description",
                    searchContain: true,
                    maxShownResults: 5,
                    data: res.data.map(r => ({...r, id: r.companyId.toString()})),
                });
            });
        break;
        case "gafetes":
            CallGet(`${API_VISITOR_ACCESS}/SecurityBadges?isEnabled=true&isAvailable=true`)
            .then(res => {
                $(flexdatalistId).flexdatalist({
                    minLength: 0,
                    multiple: isMultiple,
                    valueProperty: "id",
                    selectionRequired: selectionRequired,
                    visibleProperties: ["description"],
                    searchIn: "description",
                    searchContain: true,
                    maxShownResults: 5,
                    data: res.data.map(r => ({...r, id: r.securityBadgeId.toString()})),
                });
            });
        break;
        case "documents":
            CallGet(`${API_VISITOR_ACCESS}/Documents?isEnabled=true`)
            .then(res => {
                $(flexdatalistId).flexdatalist({
                    minLength: 0,
                    multiple: isMultiple,
                    valueProperty: "id",
                    selectionRequired: selectionRequired,
                    visibleProperties: ["description"],
                    searchIn: "description",
                    searchContain: true,
                    maxShownResults: 5,
                    data: res.data.map(r => ({...r, id: r.documentId.toString()})),
                });
            });
        break;
        case "visitType":
            CallGet(`${API_VISITOR_ACCESS}/VisitorTypes?isEnabled=true`)
            .then(res => {
                $(flexdatalistId).flexdatalist({
                    minLength: 0,
                    multiple: isMultiple,
                    valueProperty: "id",
                    selectionRequired: selectionRequired,
                    visibleProperties: ["description"],
                    searchIn: "description",
                    searchContain: true,
                    maxShownResults: 5,
                    data: res.data.map(r => ({...r, id: r.visitorTypeId.toString()})),
                });
            });
        break;
        case "deviceType":
            CallGet(`${API_VISITOR_ACCESS}/DeviceTypes?isEnabled=true`)
            .then(res => {
                $(flexdatalistId).flexdatalist({
                    minLength: 0,
                    multiple: isMultiple,
                    valueProperty: "id",
                    selectionRequired: selectionRequired,
                    visibleProperties: ["description"],
                    searchIn: "description",
                    searchContain: true,
                    maxShownResults: 5,
                    data: res.data.map(r => ({...r, id: r.deviceTypeId.toString()})),
                });
            });
        break;
        case "users":
            CallGet(`${API_CONFIGURATION}/Users?isEnabled=true`,`Bearer ${JSON.parse(sessionStorage._authTokenVisitorAccess).token}`)
            .then(res => {
                $(flexdatalistId).flexdatalist({
                    minLength: 0,
                    multiple: isMultiple,
                    valueProperty: "userId",
                    selectionRequired: selectionRequired,
                    visibleProperties: ["name","lastName"],
                    searchIn: ["name","lastName"],
                    searchContain: true,
                    maxShownResults: 5,
                    data: res.data.map(r => ({...r, id: r.userId.toString()})),
                });
            });
        break;
    }
}
const handleSaveNewVisit = () => {
    const nombre = document.querySelector('#mod_ctrlNombre').value.trim();
    const apellido = document.querySelector('#mod_ctrlApellido').value.trim();
    const email = document.querySelector('#mod_ctrlEmail').value.trim();
    const company = document.querySelector('#mod_ctrlCompany').value.trim();
    const visitType = document.querySelector('#mod_ctrlTipoVisita').value.trim();
    const fecha = document.querySelector('#mod_ctrlFecha').value.trim();
    const contacto = document.querySelector('#mod_ctrlContactMagna').value.trim();

    if (nombre != "" && apellido != "" && email != "" && company != "" && visitType != "" && fecha != "" && contacto != "") {
        const mis_datos = {
            name: nombre,
            lastName: apellido,
            motherLastName: "",
            email: email,
            companyId: parseInt(company),
            visitorTypeId: parseInt(visitType),
            visitDate: fecha,
            contact: parseInt(contacto),
            qtyDays: 1
        };

        CallPost(`${API_VISITOR_ACCESS}/VisitRecords`,mis_datos)
        .then(res => {
            NotifySuccess("Data saved successfully");
            fnCargarDatosVisitas();
            $("#modalito").modal("toggle");
        });
    } else NotifyError("Missing data to capture");
}
//COMPANY
const handleSaveCompany = (fnCallback) => {
    const company = document.querySelector('#modal_ctrlNewCompanie').value.trim();
    if(company != ""){
        CallPost(`${API_VISITOR_ACCESS}/Companies`,{
            description: company,
            isEnabled: true
        }).then(res => {
            NotifySuccess("Data saved successfully");
            fnCallback();
        }).catch(err => {
            NotifyError(err.response.data.detail);
        });
    } else NotifyError("Missing data to capture");
}
const handleUpdateCompany = (companyId) => {
    const company = document.querySelector('#modal_ctrlEditCompanie').value.trim();
    const sts = (document.querySelector('#modal_ctrlSts').value.trim() === "1");
    if(company != ""){
        CallPut(`${API_VISITOR_ACCESS}/Companies/${companyId}`,{
            companyId: companyId,
            description: company,
            isEnabled: sts
        }).then(res => {
            NotifySuccess("Data saved successfully");
            fnCargarDatosCompanies();
            $('#modalito').modal('toggle');
        }).catch(err => {
            NotifyError(err.response.data.detail);
        });
    } else NotifyError("Missing data to capture");
}
const fnGetFormCompany = (company) => {
    if(company){
        return (
            `<div class="row">
                <div class="form-group col-12">
                    <label class="control-label">Company</label>
                    <input class="form-control" type="text" onkeyup="handleValidateMayus(this)" id="modal_ctrlEditCompanie" value="${company.description}" placeholder="Edit company">
                </div>
                <div class="form-group col-12  mb-0">
                    <label class="control-label">Status</label>
                    <select class="form-control" id="modal_ctrlSts">
                        <option value="1" ${company.isEnabled ? 'selected' : ''}>Active</option>
                        <option value="0" ${!company.isEnabled ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
            </div>`
        )
    }

    return (
        `<div class="row">
            <div class="form-group col-12  mb-0">
                <label class="control-label">Company</label>
                <input class="form-control" type="text" onkeyup="handleValidateMayus(this)" id="modal_ctrlNewCompanie" placeholder="Enter new company">
            </div>
        </div>`
    )
}
const fnGetFooterCompany = (company) => {
    if(company){
        return (
            `<div style="width:100%;text-align:right;">
                <button type="button" class="btn btn-success" onclick="handleUpdateCompany(${company.companyId})">Save changes</button>
            </div>`
        )
    }
    return (
        `<div style="width:100%;text-align:right;">
            <button type="button" class="btn btn-success" onclick="handleSaveCompany(()=>{fnCargarDatosCompanies(); $('#modalito').modal('toggle'); }); ">Save changes</button>
        </div>`
    )
}
//DOCUMENT
const handleSaveDocument = () => {
    const doc = document.querySelector('#modal_ctrlNewIDCard').value.trim();
    if(doc != ""){
        CallPost(`${API_VISITOR_ACCESS}/Documents`,{
            description: doc,
            isEnabled: true
        }).then(res => {
            NotifySuccess("Data saved successfully");
            fnCargarDatosDocuments();
            $('#modalito').modal('toggle');
        }).catch(err => {
            NotifyError(err.response.data.detail);
        });
    } else NotifyError("Missing data to capture");
}
const handleUpdateDocument = (documentId) => {
    const doc = document.querySelector('#modal_ctrlNewIDCard').value.trim();
    const sts = (document.querySelector('#modal_ctrlSts').value.trim() === "1");
    if(doc != ""){
        CallPut(`${API_VISITOR_ACCESS}/Documents/${documentId}`,{
            documentId: documentId,
            description: doc,
            isEnabled: sts
        }).then(res => {
            NotifySuccess("Data saved successfully");
            fnCargarDatosDocuments();
            $('#modalito').modal('toggle');
        }).catch(err => {
            NotifyError(err.response.data.detail);
        });
    } else NotifyError("Missing data to capture");
}
const fnGetFormDocument = (doc) => {
    if(doc){
        return (
            `<div class="row">
                <div class="form-group col-12">
                    <label class="control-label">ID Card</label>
                    <input class="form-control" type="text" onkeyup="handleValidateMayus(this)" id="modal_ctrlNewIDCard" value="${doc.description}" placeholder="Edit document">
                </div>
                <div class="form-group col-12 mb-0">
                    <label class="control-label">Status</label>
                    <select class="form-control" id="modal_ctrlSts">
                        <option value="1" ${doc.isEnabled ? 'selected' : ''}>Active</option>
                        <option value="0" ${!doc.isEnabled ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
            </div>`
        )
    }

    return (
        `<div class="row">
            <div class="form-group col-12  mb-0">
                <label class="control-label">ID Card</label>
                <input class="form-control" type="text" onkeyup="handleValidateMayus(this)" id="modal_ctrlNewIDCard" placeholder="Enter new ID Card">
            </div>
        </div>`
    )
}
const fnGetFooterDocument = (doc) => {
    if(doc){
        return (
            `<div style="width:100%;text-align:right;">
                <button type="button" class="btn btn-success" onclick="handleUpdateDocument(${doc.documentId})">Save changes</button>
            </div>`
        )
    }
    return (
        `<div style="width:100%;text-align:right;">
            <button type="button" class="btn btn-success" onclick="handleSaveDocument();">Save changes</button>
        </div>`
    )
}
//DEVICE TYPE
const handleSaveDeviceType = () => {
    const device = document.querySelector('#modal_ctrlNewTipoDisp').value.trim();
    if(device != ""){
        CallPost(`${API_VISITOR_ACCESS}/DeviceTypes`,{
            description: device,
            isEnabled: true
        }).then(res => {
            NotifySuccess("Data saved successfully");
            fnCargarDatosDeviceTypes();
            $('#modalito').modal('toggle');
        }).catch(err => {
            NotifyError(err.response.data.detail);
        });
    } else NotifyError("Missing data to capture");
}
const handleUpdateDeviceType = (deviceId) => {
    const device = document.querySelector('#modal_ctrlNewTipoDisp').value.trim();
    const sts = (document.querySelector('#modal_ctrlSts').value.trim() === "1");
    if(device != ""){
        CallPut(`${API_VISITOR_ACCESS}/DeviceTypes/${deviceId}`,{
            deviceTypeId: deviceId,
            description: device,
            isEnabled: sts
        }).then(res => {
            NotifySuccess("Data saved successfully");
            fnCargarDatosDeviceTypes();
            $('#modalito').modal('toggle');
        }).catch(err => {
            NotifyError(err.response.data.detail);
        });
    } else NotifyError("Missing data to capture");
}
const fnGetFormDeviceType = (device) => {
    if(device){
        return (
            `<div class="row">
                <div class="form-group col-12">
                    <label class="control-label">Device Type</label>
                    <input class="form-control" type="text" onkeyup="handleValidateMayus(this)" id="modal_ctrlNewTipoDisp" value="${device.description}" placeholder="Edit device type">
                </div>
                <div class="form-group col-12 mb-0">
                    <label class="control-label">Status</label>
                    <select class="form-control" id="modal_ctrlSts">
                        <option value="1" ${device.isEnabled ? 'selected' : ''}>Active</option>
                        <option value="0" ${!device.isEnabled ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
            </div>`
        )
    }

    return (
        `<div class="row">
            <div class="form-group col-12  mb-0">
                <label class="control-label">Device Type</label>
                <input class="form-control" type="text" onkeyup="handleValidateMayus(this)" id="modal_ctrlNewTipoDisp" placeholder="Enter new device type">
            </div>
        </div>`
    )
}
const fnGetFooterDeviceType = (device) => {
    if(device){
        return (
            `<div style="width:100%;text-align:right;">
                <button type="button" class="btn btn-success" onclick="handleUpdateDeviceType(${device.deviceTypeId})">Save changes</button>
            </div>`
        )
    }
    return (
        `<div style="width:100%;text-align:right;">
            <button type="button" class="btn btn-success" onclick="handleSaveDeviceType();">Save changes</button>
        </div>`
    )
}
//VISITOR TYPE
const handleSaveVisitorType = () => {
    const visitorType = document.querySelector('#modal_ctrlNewType').value.trim();
    if(visitorType != ""){
        CallPost(`${API_VISITOR_ACCESS}/VisitorTypes`,{
            description: visitorType,
            isEnabled: true
        }).then(res => {
            NotifySuccess("Data saved successfully");
            fnCargarDatosVisitorTypes();
            $('#modalito').modal('toggle');
        }).catch(err => {
            NotifyError(err.response.data.detail);
        });
    } else NotifyError("Missing data to capture");
}
const handleUpdateVisitorType = (visitorTypeId) => {
    const visitorType = document.querySelector('#modal_ctrlNewType').value.trim();
    const sts = (document.querySelector('#modal_ctrlSts').value.trim() === "1");
    if(visitorType != ""){
        CallPut(`${API_VISITOR_ACCESS}/VisitorTypes/${visitorTypeId}`,{
            visitorTypeId: visitorTypeId,
            description: visitorType,
            isEnabled: sts
        }).then(res => {
            NotifySuccess("Data saved successfully");
            fnCargarDatosVisitorTypes();
            $('#modalito').modal('toggle');
        }).catch(err => {
            NotifyError(err.response.data.detail);
        });
    } else NotifyError("Missing data to capture");
}
const fnGetFormVisitorType = (visitorType) => {
    if(visitorType){
        return (
            `<div class="row">
                <div class="form-group col-12">
                    <label class="control-label">Visitor Type</label>
                    <input class="form-control" type="text" onkeyup="handleValidateMayus(this)" id="modal_ctrlNewType" value="${visitorType.description}" placeholder="Edit visitor type">
                </div>
                <div class="form-group col-12 mb-0">
                    <label class="control-label">Status</label>
                    <select class="form-control" id="modal_ctrlSts">
                        <option value="1" ${visitorType.isEnabled ? 'selected' : ''}>Active</option>
                        <option value="0" ${!visitorType.isEnabled ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
            </div>`
        )
    }

    return (
        `<div class="row">
            <div class="form-group col-12  mb-0">
                <label class="control-label">Visitor Type</label>
                <input class="form-control" type="text" onkeyup="handleValidateMayus(this)" id="modal_ctrlNewType" placeholder="Enter new visitor type">
            </div>
        </div>`
    )
}
const fnGetFooterVisitorType = (visitorType) => {
    if(visitorType){
        return (
            `<div style="width:100%;text-align:right;">
                <button type="button" class="btn btn-success" onclick="handleUpdateVisitorType(${visitorType.visitorTypeId})">Save changes</button>
            </div>`
        )
    }
    return (
        `<div style="width:100%;text-align:right;">
            <button type="button" class="btn btn-success" onclick="handleSaveVisitorType();">Save changes</button>
        </div>`
    )
}
//SECURITY COURSE
const handleSaveSecCourse = () => {
    const fileCourse = document.querySelector('#modal_ctrlNewCourse');
    const description = document.querySelector('#modal_ctrlNewCourseDesc').value.trim();

    if(description != "" || fileCourse.files.length === 0){
        //FORM DATA
        let bodyFormData = new FormData();
        BuildFormData(bodyFormData, {
            description: description,
            fileCourse: fileCourse.files[0]
        });
        CallPost(`${API_VISITOR_ACCESS}/SecurityCourses`,bodyFormData)
        .then(res => {
            NotifySuccess("Data saved successfully");
            fnCargarDatosSecCourses();
            $('#modalito').modal('toggle');
        }).catch(err => {
            NotifyError(err.response.data.detail);
        });
    } else NotifyError("Missing data to capture");
}
const handleUpdateSecCourse = (securityCourseId) => {
    const fileCourse = document.querySelector('#modal_ctrlNewCourse');
    const description = document.querySelector('#modal_ctrlNewCourseDesc').value.trim();
    const sts = (document.querySelector('#modal_ctrlSts').value.trim() === "1");
    if(description != ""){
        //FORM DATA
        let bodyFormData = new FormData();
        BuildFormData(bodyFormData, {
            securityCourseId: securityCourseId,
            description: description,
            fileCourse: (fileCourse.files.length > 0 ? fileCourse.files[0] : null),
            isEnabled: sts
        });

        CallPut(`${API_VISITOR_ACCESS}/SecurityCourses/${securityCourseId}`,bodyFormData)
        .then(res => {
            NotifySuccess("Data saved successfully");
            fnCargarDatosSecCourses();
            $('#modalito').modal('toggle');
        }).catch(err => {
            NotifyError(err.response.data.detail);
        });
    } else NotifyError("Missing data to capture");
}
const fnGetFormSecCourse = (course) => {
    if(course){
        return (
            `<div class="row">
                <div class="form-group col-12">
                    <label class="control-label">Description</label>
                    <input class="form-control" type="text" onkeyup="handleValidateMayus(this)" value="${course.description}" id="modal_ctrlNewCourseDesc" placeholder="Edit description">
                </div>
                <div class="form-group col-12">
                    <label class="control-label">Course</label>
                    <input class="form-control" type="file" id="modal_ctrlNewCourse" placeholder="Add new course (pdf or mp4)">
                </div>
                <div class="form-group col-12 mb-0">
                    <label class="control-label">Status</label>
                    <select class="form-control" id="modal_ctrlSts">
                        <option value="1" ${course.isEnabled ? 'selected' : ''}>Active</option>
                        <option value="0" ${!course.isEnabled ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
            </div>`
        )
    }

    return (
        `<div class="row">
            <div class="form-group col-12">
                <label class="control-label">Description</label>
                <input class="form-control" type="text" onkeyup="handleValidateMayus(this)" id="modal_ctrlNewCourseDesc" placeholder="Enter description">
            </div>
            <div class="form-group col-12">
                <label class="control-label">Course (PDF or MP4)</label>
                <input class="form-control" accept=".mp4,.pdf" type="file" id="modal_ctrlNewCourse" placeholder="Add new course (pdf or mp4)">
            </div>
        </div>`
    )
}
const fnGetFooterSecCourse = (course) => {
    if(course){
        return (
            `<div style="width:100%;text-align:right;">
                <button type="button" class="btn btn-success" onclick="handleUpdateSecCourse(${course.securityCourseId})">Save changes</button>
            </div>`
        )
    }
    return (
        `<div style="width:100%;text-align:right;">
            <button type="button" class="btn btn-success" onclick="handleSaveSecCourse();">Save changes</button>
        </div>`
    )
}
const handleDeleteSecCourse = (securityCourseId) => {
    CallDelete(`${API_VISITOR_ACCESS}/SecurityCourses/${securityCourseId}`)
    .then(res => {
        NotifySuccess("Data saved successfully");
        fnCargarDatosSecCourses();
    })
    .catch(err => {
        NotifyError(err.response.data.detail);
    });
}
//SECURITY BADGE
const handleSaveSecBadge = () => {
    const securityBadge = document.querySelector('#modal_ctrlNewGafete').value.trim();
    if(securityBadge != ""){
        CallPost(`${API_VISITOR_ACCESS}/SecurityBadges`,{
            description: securityBadge,
            isEnabled: true
        }).then(res => {
            NotifySuccess("Data saved successfully");
            fnCargarDatosSecBadges();
            $('#modalito').modal('toggle');
        }).catch(err => {
            NotifyError(err.response.data.detail);
        });
    } else NotifyError("Missing data to capture");
}
const handleUpdateSecBadge = (gafeteId) => {
    const gafete = document.querySelector('#modal_ctrlNewGafete').value.trim();
    const sts = (document.querySelector('#modal_ctrlSts').value.trim() === "1");
    if(gafete != ""){
        CallPut(`${API_VISITOR_ACCESS}/SecurityBadges/${gafeteId}`,{
            securityBadgeId: gafeteId,
            description: gafete,
            isEnabled: sts
        }).then(res => {
            NotifySuccess("Data saved successfully");
            fnCargarDatosSecBadges();
            $('#modalito').modal('toggle');
        }).catch(err => {
            NotifyError(err.response.data.detail);
        });
    } else NotifyError("Missing data to capture");
}
const fnGetFormSecBadge = (gafete) => {
    if(gafete){
        return (
            `<div class="row">
                <div class="form-group col-12">
                    <label class="control-label">Security Badge</label>
                    <input class="form-control" type="text" onkeyup="handleValidateMayus(this)" id="modal_ctrlNewGafete" value="${gafete.description}" placeholder="Enter new security badge">
                </div>
                <div class="form-group col-12  mb-0">
                    <label class="control-label">Status</label>
                    <select class="form-control" id="modal_ctrlSts">
                        <option value="1" ${gafete.isEnabled ? 'selected' : ''}>Active</option>
                        <option value="0" ${!gafete.isEnabled ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
            </div>`
        )
    }

    return (
        `<div class="row">
            <div class="form-group col-12">
                <label class="control-label">Security Badge</label>
                <input class="form-control" type="text" onkeyup="handleValidateMayus(this)" id="modal_ctrlNewGafete" placeholder="Enter new security badge">
            </div>
        </div>`
    )
}
const fnGetFooterSecBadge = (gafete) => {
    if(gafete){
        return (
            `<div style="width:100%;text-align:right;">
                <button type="button" class="btn btn-success" onclick="handleUpdateSecBadge(${gafete.securityBadgeId})">Save changes</button>
            </div>`
        )
    }
    return (
        `<div style="width:100%;text-align:right;">
            <button type="button" class="btn btn-success" onclick="handleSaveSecBadge();">Save changes</button>
        </div>`
    )
}
//ASSING SECURITY BADGE
const handleSaveAssignSecBadge = (visitRecordId) => {
    const securityBadgeId = document.querySelector('#txtModalGafete').value.trim();
    const documentId = document.querySelector('#txtModalTypeID').value.trim();
    if(securityBadgeId != "" && documentId != ""){
        CallPut(`${API_VISITOR_ACCESS}/VisitRecords/AssignSecBadge`,{
            visitRecordId: visitRecordId,
            documentId: documentId,
            securityBadgeId: securityBadgeId
        }).then(res => {
            NotifySuccess("Data saved successfully");
            fnCargarDatosVisitas();
            $('#modalito').modal('toggle');
        }).catch(err => {
            NotifyError(err.response.data.detail);
        });
    } else NotifyError("Missing data to capture");
}
const fnGetFormsAssignSecBadge = (visitRecord) => {
    return (
        `<div class="row">
            <div class="form-group col-12 mb-3">
                <label class="control-label">Security Badge</label>
                <input type="text" class="form-control" id="txtModalGafete" placeholder="Enter Security Badge" />
            </div>
            <div class="form-group col-12 mb-3">
                <label class="control-label">ID Type</label>
                <input type="text" class="form-control" id="txtModalTypeID" placeholder="Enter ID Type" />
            </div>
        </div>`
    )
}
const fnGetFooterAssignSecBadge = (visitRecord) => {
    return (
        `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-success" onclick="handleSaveAssignSecBadge(${visitRecord.visitRecordId})">Save changes</button>`
    )
}
const fnGetFormsViewSecBadge = (visitRecord) => {
    return (
        `<div class="row">
            <div class="col-12 d-flex align-items-baseline justify-content-center">
                <h6 class="mr-1">Visitor:</h6>
                <p class="mb-0" style="text-transform: capitalize;">${visitRecord.visitorFullName.toLowerCase()}</p>
            </div>
            <div class="col-12 d-flex align-items-baseline justify-content-center">
                <h6 class="mr-1">Company:</h6>
                <p class="mb-0">${visitRecord.company}</p>
            </div>
            <div class="col-12 d-flex align-items-baseline justify-content-center">
                <h6 class="mr-1">Gafete:</h6>
                <p class="mb-0">${visitRecord.securityBadge}</p>
            </div>
            <div class="col-12 d-flex align-items-baseline justify-content-center mb-0">
                <h6 class="mr-1">ID:</h6>
                <p class="mb-0">${visitRecord.document}</p>
            </div>
        </div>`
    )
}
const fnGetFooterViewSecBadge = () => (`<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`);

//ASSING DEVICE
const handleAddDeviceIT = () => {
    const device = document.querySelector('#txtModalITDevice').value.trim();
    const deviceDesc = document.querySelector('#txtModalITDevice-flexdatalist').value;

    if(device == ""){
        NotifyError("Select a device");
        return;
    }

    const serial = document.querySelector('#txtDeviceSerial').value.trim();
    const brand = document.querySelector('#txtDeviceBrand').value.trim();
    const devicesRegistred = Array.from(document.querySelectorAll("#tbDeviceIT > tbody > tr > td:nth-child(3)")).map(td => td.textContent);

    if(serial == "" || brand == ""){
        NotifyError("Missing data to capture");
        return;
    }

    if(devicesRegistred.includes(serial)){
        NotifyError("Registered serial already exists");
        return;
    }

    document.querySelector("#tbDeviceIT > tbody").innerHTML += (
        `<tr>
            <td data-id="${device}">${deviceDesc}</td>
            <td>${brand}</td>
            <td>${serial}</td>
            <td><button class="btn btn-sm btn-danger" onclick="$(this).parents('tr').remove();"><i class="fa fa-trash m-0" aria-hidden="true"></i></button></td>
        </tr>`
    );
}
const handleChangeDevice = () => {
    const deviceId = document.querySelector('#txtModalITDevice').value.trim();
    const device = document.querySelector('#txtModalITDevice-flexdatalist').value;
    if(deviceId != ""){
        document.querySelector('#divSeriales').innerHTML =
            `<div class="row">
                <div class="form-group col-12 mb-3">
                    <label class="control-label">Device Serial (${device})</label>
                    <input type="text" class="form-control" id="txtDeviceSerial" onkeyup="handleValidateMayus(this)" placeholder="Enter serial" />
                </div>
                <div class="form-group col-12 mb-0">
                    <label class="control-label">Device Brand (${device})</label>
                    <input type="text" class="form-control" id="txtDeviceBrand" onkeyup="handleValidateMayus(this)" placeholder="Enter brand" />
                </div>
            </div>`;
    }
}
const handleSaveDeviceVisit = (visitRecordId) => {
    const devices = Array.from(document.querySelectorAll("#tbDeviceIT > tbody > tr")).map(row => ({
                        visitRecordId: visitRecordId,
                        deviceTypeId: parseInt(row.children[0].dataset.id),
                        brand: row.children[1].textContent,
                        serial: row.children[2].textContent
                    }));
    if(devices.length == 0){
        NotifyError("Missing data to capture");
        return;
    }
    CallPut(`${API_VISITOR_ACCESS}/VisitRecords/AssignDeviceIT`,devices)
    .then(res => {
        NotifySuccess("Data saved successfully");
        fnCargarDatosVisitas();
        $('#modalito').modal('toggle');
    })
    .catch(err => {
        NotifyError(err.response.data.detail);
    });
}
const fnGetFormsAssignDevice = () => {
    return (
        `<div class="row">
            <div class="form-group col-12 mb-0">
                <label class="control-label">IT Device</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="txtModalITDevice" onchange="handleChangeDevice()" placeholder="Enter device" />
                    <div class="input-group-prepend">
                        <button type="button" onclick="handleAddDeviceIT()" class="btn btn-primary" style="border-radius: 0px 4px 4px 0px;">ADD</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="divSeriales"></div>
        <table id="tbDeviceIT" class="text-center table table-sm">
            <thead><tr><th>Description</th><th>Brand</th><th>Serial</th><th>Actions</th></tr></thead>
            <tbody></tbody>
        </table>`
    );
}
const fnGetFooterAssignDevice = (visitRecord) => {
    return (
        `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-success" onclick="handleSaveDeviceVisit(${visitRecord.visitRecordId})">Save changes</button>`
    );
}
const fnGetFormsViewDevices = () => {
    return (
        `<table id="tbDeviceIT" style="width: 100%;" class="text-center table table-sm">
            <thead><tr><th>Description</th><th>Brand</th><th>Model</th><th>Serial</th><th>Antivirus</th><th>Comments</th></tr></thead>
            <tbody></tbody>
        </table>`
    )
}
const fnGetFooterViewDevices = () => (`<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`);
const fnFillDevices = (visitRecord) => {
    CallGet(`${API_VISITOR_ACCESS}/VisitRecords/${visitRecord.visitRecordId}`)
    .then(res => {
        document.querySelector('#tbDeviceIT > tbody').innerHTML = res.data.devices.map(d => (
            `<tr>
                <td>${d.deviceType.description}</td>
                <td>${d.brand}</td>
                <td>${d.model || ""}</td>
                <td>${d.serial}</td>
                <td>${!d.antivirus ? "" : `${d.Antivirus}${!d.lastDateOfAntivirusUpdt && `\n${moment(d.lastDateOfAntivirusUpdt).format("DD MMM YYYY HH:mm")}`}`}</td>
                <td>${d.comments || ""}</td>
            </tr>`
        )).join('');
    })
    .catch(err => {
        NotifyError(err.response.data.detail);
    });
}
//VIEW SEC COURSE
const fnGetFormsViewVisitSecCourse = (visitRecord) => {
    CallGet(`${API_VISITOR_ACCESS}/SecurityCourses?isEnabled=true`)
    .then(res => {
        if(res.data.length == 0) {
            document.querySelector("#contentSecCourse").innerHTML = `<p>There is no safety course</p>`;
            return;
        }
        if(res.data[0].fileName.split(".").reverse()[0].toLowerCase() === "pdf"){
            document.querySelector("#contentSecCourse").innerHTML = (
                `<iframe src="${PATH_FILES}/sec_vm/courses/${res.data[0].fileName}" style="height: 70vh;width:100%;" frameborder="0"></iframe>`
            );
            document.querySelector("#contentFooterSecCourse").innerHTML = (
                `<div style="width:100%;text-align:right;">
                    <button type="button" class="btn btn-info mr-3" onclick="document.querySelector('.modal iframe').src = document.querySelector('.modal iframe').src;">Refresh</button>
                    <button type="button" class="btn btn-success" onclick="handleAcceptTerms(${visitRecord.visitorId},${res.data[0].securityCourseId})">View terms</button>
                </div>`
            );
            return;
        }
        if(res.data[0].fileName.split(".").reverse()[0].toLowerCase() === "mp4"){
            document.querySelector("#contentSecCourse").innerHTML = (
                `<video autoplay style="height: 70vh;width:100%;" preload="none">
                    <source src="${PATH_FILES}/sec_vm/courses/${res.data[0].fileName}" type="video/mp4" autostart="false">
                </video>`
            );
            document.querySelector("#contentFooterSecCourse").innerHTML = (
                `<div style="width:100%;text-align:right;">
                    <button type="button" id="btnClockVideo" class="btn mr-3">--:-- / --:--</button>
                    <button type="button" class="btn btn-info mr-3" id="btnPlayCurso">Play / Pause</button>
                    <button type="button" class="btn btn-success mr-3" id="btnFullScreenCurso">Full Screen</button>
                    <button type="button" class="btn btn-primary d-none" id="btnTerminarCurso" onclick="handleAcceptTerms('${visitRecord.visitorId}','${res.data[0].securityCourseId}')">Finish</button>
                </div>`
            );
            const video = document.querySelector("#contentSecCourse > video");
            video.pause();
            vid_flagPostVideo = false;
            vid_repeticion = window.setInterval(() => {
                                const tiempo_act = video.currentTime;
                                const tiempoTotal = video.duration;
                                document.querySelector("#btnClockVideo").innerText = (tiempo_act + " / " + tiempoTotal);
                                if(tiempo_act >= tiempoTotal) {
                                    window.clearInterval(vid_repeticion);
                                    document.querySelector('#btnTerminarCurso').classList.remove('d-none');
                                }
                            },1000);
            video.addEventListener("click",()=>{
                return false;
            });
            document.querySelector("#btnPlayCurso").addEventListener("click",()=>{
                if(video.paused) video.play();
                else video.pause();
            });
            document.querySelector("#btnFullScreenCurso").addEventListener("click",() => {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.mozRequestFullScreen) {
                    video.mozRequestFullScreen();
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                } else if (video.msRequestFullscreen) {
                    video.msRequestFullscreen();
                }
            });
            return;
        }
    })
    .catch(err => {
        NotifyError(err.response.data.detail);
    });
}
const handleAcceptTerms = (visitRecordId, securityCourseId) => {
    NotifySure(
        "\nYou acknowledge having read and understood the EHS requirements and rules. \n\nReconoce haber leído y entendido los requerimientos y reglas de EHS.",
        "Yes",
        () => {
            CallPost(`${API_VISITOR_ACCESS}/SecurityCourses/CourseRegistred`,{
                visitorId: visitRecordId,
                securityCourseId: securityCourseId
            })
            .then(res => {
                NotifySuccess("Data saved successfully");
                fnCargarDatosVisitas();
                $('#modalito').modal('toggle');
            })
            .catch(err => {
                NotifyError(err.response.data.detail);
            });
        }
    )
}
//CHECKIN & CHECKOUT
const handleCheckIn = (visitRecord) => {
    if(visitRecord.securityBadge == null){
        NotifyError("Need to add a security badge");
        return;
    }
    CallGet(`${API_VISITOR_ACCESS}/VisitRecords/${visitRecord.visitRecordId}`)
    .then(res => {
        const datos = {...res.data, entryDate: moment().format("YYYY-MM-DDTHH:mm")}
        CallPut(`${API_VISITOR_ACCESS}/VisitRecords/${visitRecord.visitRecordId}`, datos)
        .then(r => {
            NotifySuccess("Data saved successfully");
            fnCargarDatosVisitas();
        })
        .catch(err => {
            NotifyError(err.response.data.detail);
        })
    })
    .catch(err => {
        NotifyError(err.response.data.detail);
    })
}
const handleCheckOut = (visitRecord) => {
    CallGet(`${API_VISITOR_ACCESS}/VisitRecords/${visitRecord.visitRecordId}`)
    .then(res => {
        const datos = {...res.data, departureDate: moment().format("YYYY-MM-DDTHH:mm")}
        CallPut(`${API_VISITOR_ACCESS}/VisitRecords/${visitRecord.visitRecordId}`, datos)
        .then(r => {
            NotifySuccess("Data saved successfully");
            fnCargarDatosVisitas();
        })
        .catch(err => {
            NotifyError(err.response.data.detail);
        })
    })
    .catch(err => {
        NotifyError(err.response.data.detail);
    })
}
// OPEN MODAL OPTIONS
const handleOpenModal = (option, obj = null) => {
    let tituloModal = '';
    let htmlTextBody = '';
    let htmlTextFooter = '';
    let fnCallback = null;
    let sizeModal = "";

    switch(option){
        case "view-visitSecCourse":
            tituloModal = "Security Course";
            htmlTextBody = "<div id='contentSecCourse'></div>";
            htmlTextFooter = "<div id='contentFooterSecCourse'></div>";
            sizeModal = "modal-lg w-100"
            fnCallback = () => {
                fnGetFormsViewVisitSecCourse(obj);
            }
        break;
        case "assign-devices":
            tituloModal = "Assign IT Devices";
            htmlTextBody = fnGetFormsAssignDevice(obj);
            htmlTextFooter = fnGetFooterAssignDevice(obj);
            fnCallback = () => {
                //CARGAR LISTA DE DISPOSITIVOS
                fnFillFlexDataList("#txtModalITDevice", "deviceType", true, false);
            }
        break;
        case "view-devices":
            tituloModal = "View IT Devices";
            htmlTextBody = fnGetFormsViewDevices();
            htmlTextFooter = fnGetFooterViewDevices();
            fnCallback = () => {fnFillDevices(obj);}
        break;
        case "assign-gafete":
            tituloModal = "Assign Security Badge";
            htmlTextBody = fnGetFormsAssignSecBadge(obj);
            htmlTextFooter = fnGetFooterAssignSecBadge(obj);
            fnCallback = () => {
                //CARGAR GAFETES
                fnFillFlexDataList("#txtModalGafete", "gafetes", true, false);
                //CARGAR TIPO DE DOCS
                fnFillFlexDataList("#txtModalTypeID", "documents", true, false);
            }
        break;
        case "view-gafete":
            tituloModal = "View Security Badge";
            htmlTextBody = fnGetFormsViewSecBadge(obj);
            htmlTextFooter = fnGetFooterViewSecBadge();
        break;
        case "new-visit":
            tituloModal = "Register new visit";
            htmlTextBody = fnGetFormsNewVisit();
            htmlTextFooter = fnGetFooterNewVisit();
            fnCallback = () => {
                //CARGAR COMPAÑIAS
                fnFillFlexDataList("#mod_ctrlCompany", "companies", true, false);
                //CARGAR TIPO DE VISITAS
                fnFillFlexDataList("#mod_ctrlTipoVisita", "visitType", true, false);
                //CARGAR CONTACTO
                fnFillFlexDataList("#mod_ctrlContactMagna", "users", true, false);
            }
        break;
        case "filters":
            tituloModal = "Date filter";
            htmlTextBody = fnGetFormFilter();
            htmlTextFooter = fnGetFooterFilter();
        break;
        case "new-company":
            tituloModal = "New Company";
            htmlTextBody = fnGetFormCompany();
            htmlTextFooter = fnGetFooterCompany();
        break;
        case "edit-company":
            tituloModal = "Edit Company";
            htmlTextBody = fnGetFormCompany(obj);
            htmlTextFooter = fnGetFooterCompany(obj);
        break;
        case "new-gafete":
            tituloModal = "New Security Badge";
            htmlTextBody = fnGetFormSecBadge();
            htmlTextFooter = fnGetFooterSecBadge();
        break;
        case "edit-gafete":
            tituloModal = "Edit Security Badge";
            htmlTextBody = fnGetFormSecBadge(obj);
            htmlTextFooter = fnGetFooterSecBadge(obj);
        break;
        case "new-document":
            tituloModal = "New ID Card";
            htmlTextBody = fnGetFormDocument();
            htmlTextFooter = fnGetFooterDocument();
        break;
        case "edit-document":
            tituloModal = "Edit ID Card";
            htmlTextBody = fnGetFormDocument(obj);
            htmlTextFooter = fnGetFooterDocument(obj);
        break;
        case "new-device":
            tituloModal = "New Device Type";
            htmlTextBody = fnGetFormDeviceType();
            htmlTextFooter = fnGetFooterDeviceType();
        break;
        case "edit-device":
            tituloModal = "Edit Device Type";
            htmlTextBody = fnGetFormDeviceType(obj);
            htmlTextFooter = fnGetFooterDeviceType(obj);
        break;
        case "new-visitorType":
            tituloModal = "New Visitor Type";
            htmlTextBody = fnGetFormVisitorType();
            htmlTextFooter = fnGetFooterVisitorType();
        break;
        case "edit-visitorType":
            tituloModal = "Edit Visitor Type";
            htmlTextBody = fnGetFormVisitorType(obj);
            htmlTextFooter = fnGetFooterVisitorType(obj);
        break;
        case "new-secCourse":
            tituloModal = "New Security Course";
            htmlTextBody = fnGetFormSecCourse();
            htmlTextFooter = fnGetFooterSecCourse();
        break;
        case "edit-secCourse":
            tituloModal = "Edit Security Course";
            htmlTextBody = fnGetFormSecCourse(obj);
            htmlTextFooter = fnGetFooterSecCourse(obj);
        break;
    }

    //SETEAR ESTRUCTURA Y ABRIR MODAL
    document.querySelector('#modalito').innerHTML = (
        `<div class="modal-dialog ${sizeModal}" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${tituloModal}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="modal-body">${htmlTextBody}</div>
                <div class="modal-footer">${htmlTextFooter}</div>
            </div>
        </div>`
    );
    $('#modalito').modal();
    if(fnCallback) fnCallback();
}
(() => {
    fnCargarUsuario();
    fnCargarFechasInicioFin();
    fnCargarEstructuraTablaVisitas();
    fnCargarEstructuraTablaCompanies();
    fnCargarEstructuraTablaGafetes();
    fnCargarEstructuraTablaDocuments();
    fnCargarEstructuraTablaDeviceType();
    fnCargarEstructuraTablaVisitType();
    fnCargarEstructuraTablaSecCourse();
    if(infoUser)
        fnCargarDatosVisitas();
})();