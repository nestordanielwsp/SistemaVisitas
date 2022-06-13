let infoUser = {};
let dateFilters = {
    fechaIni: new Date(),
    fechaFin: new Date()
}
let tbVisitas = null;

const fnCargarFechasInicioFin = () => {
    dateFilters.fechaIni = moment().add(-30,'days');
    dateFilters.fechaFin = moment().add(30,'days');
    document.querySelector('#txt_finicio').textContent = moment(dateFilters.fechaIni).format("DD/MM/YYYY");
    document.querySelector('#txt_ffin').textContent = moment(dateFilters.fechaFin).format("DD/MM/YYYY");
}
const fnCargarUsuario = () => {
    infoUser = JSON.parse(sessionStorage.getItem("_authVisitorAccess"));
    const userRoutes = JSON.parse(sessionStorage.getItem("_authRoutesVisitorAccess"));
    if(userRoutes.filter(path => path === "/schedule").length === 0) location.href = "./login.html";
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
const fnCargarEstructuraTablaVisitas = () => {
    tbVisitas = $('#tbVisitas').DataTable({
        columns: [
            { data: "folio" },
            { data: "visitorFullName" },
            { data: "company" },
            {
                data: "securityBadge",
                render: (data, type, full, meta) => (data == null ? "Pending" : `${full.securityBadge} / ${full.document}`)
            },
            { data: "contactFullName" },
            {
                data: "deviceQty",
                render: (data) => `${data} Devices`
            },
            {
                data: "visitDate",
                render: (data) => moment(data).format("DD MMM YYYY HH:mm")
            },
            {
                data: "entryDate",
                render:(data, type, full, meta) => {
                    if(data == null && !full.hasCourse)
                        return "Pending the course";
                    if(data == null && full.hasCourse)
                        return "---"
                    return moment(data).format("DD MMM YYYY HH:mm");
                }
            },
            {
                data: "departureDate",
                render: (data) => (data == null ? '---' : moment(data).format("DD MMM YYYY HH:mm"))
            },
            {
                data: "visitRecordId",
                render: (data) => `<button class="btn btn-danger" onclick="handleDeleteRecordSchedule(${data})"><i class="fa fa-trash m-0"></i></button>`
            }
        ],
        order: [[ 6, "desc" ]]
    });
}
const fnCargarDatosVisitas = () => {
    CallGet(`${API_VISITOR_ACCESS}/VisitRecords/Schedule?`+
            `contact=${infoUser.userId}&fechaIni=${moment(dateFilters.fechaIni).format("YYYY-MM-DD")}&`+
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
const handleSaveNewVisit = () => {
    const nombre = document.querySelector('#mod_ctrlNombre').value.trim();
    const apellido = document.querySelector('#mod_ctrlApellido').value.trim();
    const email = document.querySelector('#mod_ctrlEmail').value.trim();
    const company = document.querySelector('#mod_ctrlCompany').value.trim();
    const visitType = document.querySelector('#mod_ctrlTipoVisita').value.trim();
    const fecha = document.querySelector('#mod_ctrlFecha').value.trim();
    const cantDias = document.querySelector('#mod_ctrlDias').value.trim();

    if (nombre != "" && apellido != "" && email != "" && company != "" && visitType != "" && fecha != "") {
        const mis_datos = {
            name: nombre,
            lastName: apellido,
            motherLastName: "",
            email: email,
            companyId: parseInt(company),
            visitorTypeId: parseInt(visitType),
            visitDate: fecha,
            contact: infoUser.userId,
            qtyDays: parseInt(cantDias)
        };

        CallPost(`${API_VISITOR_ACCESS}/VisitRecords`,mis_datos)
        .then(res => {
            fnCargarDatosVisitas();
            $("#modalito").modal("toggle");
            NotifySuccess("Data saved successfully");
        });
    } else NotifyError("Missing data to capture");
}
const handleDeleteRecordSchedule = (visitRecordId) => {
    NotifySure("It will not be possible to reverse the deletion", "Yes, delete!", () => {
        CallDelete(`${API_VISITOR_ACCESS}/VisitRecords/${visitRecordId}`)
        .then(res => {
            fnCargarDatosVisitas();
            NotifySuccess("Data saved successfully");
        })
        .catch(err => {
            console.error(err);
            NotifyError("There was a problem deleting");
        });
    });
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
const handleSaveCompany = () => {
    const company = document.querySelector('#modal_ctrlNewCompanie').value.trim();
    if(company != ""){
        CallPost(`${API_VISITOR_ACCESS}/Companies`,{
            description: company,
            isEnabled: true
        }).then(res => {
            fnFillFlexDataList("#mod_ctrlCompany", "companies", true, false);
            NotifySuccess("Data saved successfully");
        }).catch(err => {
            NotifyError(err.response.data.detail);
        });
    } else {
        NotifyError("Missing data to capture");
    }
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
                <label class="control-label">Date of the visit</label>
                <input class="form-control" id="mod_ctrlFecha" type="datetime-local" style="background: white;" />
            </div>
            <div class="form-group col-12 mb-0">
                <label class="control-label">Number of consecutive days</label>
                <div class="input-group">
                    <input class="form-control" type="number" value="1" readonly id="mod_ctrlDias" style="background: white;" />
                    <div class="input-group-prepend">
                        <button type="button" class="btn btn-primary" onclick="handleAddDays()" style="border-radius: 0px 4px 4px 0px;border-right: 4px solid #87abb7;">
                            <i class="fa fa-plus-circle m-0" aria-hidden="true"></i>
                        </button>
                        <button type="button" class="btn btn-primary" onclick="handleRemoveDays()" style="border-radius: 0px 4px 4px 0px;">
                            <i class="fa fa-minus-circle m-0" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
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
const fnGetFotterNewVisit = () => {
    return (
        `<div style="width:100%;text-align:right;">
            <button type="button" class="btn btn-success" onclick="handleSaveNewVisit()">Save changes</button>
        </div>
        <div class="d-none" style="width:100%;text-align:right;">
            <button type="button" class="btn btn-success" onclick="handleSaveCompany()"  style="margin-right: 10px;">Save changes</button>
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
    }
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
const fnGetFotterFilter = () => {
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
const handleOpenModal = (option) => {
    let tituloModal = '';
    let htmlTextBody = '';
    let htmlTextFooter = '';
    let fnCallback = null;

    switch(option){
        case "new-visit":
            tituloModal = "Register new visit";
            htmlTextBody = fnGetFormsNewVisit();
            htmlTextFooter = fnGetFotterNewVisit();
            fnCallback = () => {
                //CARGAR COMPAÑIAS
                fnFillFlexDataList("#mod_ctrlCompany", "companies", true, false);
                //CARGAR TIPO DE VISITAS
                fnFillFlexDataList("#mod_ctrlTipoVisita", "visitType", true, false);
            }
        break;
        case "filters":
            tituloModal = "Date filter";
            htmlTextBody = fnGetFormFilter();
            htmlTextFooter = fnGetFotterFilter();
        break;
    }

    //SETEAR ESTRUCTURA Y ABRIR MODAL
    document.querySelector('#modalito').innerHTML = (
        `<div class="modal-dialog" role="document">
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
    if(infoUser)
        fnCargarDatosVisitas();
})();