import SweetAlert from "react-bootstrap-sweetalert";

export default function InsertSweetAlert({handleClose, handleOK, typeAlert, msgError, msgSure}){
    return (
      <>
        {
          typeAlert === "sure" ?
            <SweetAlert
              warning
              showCancel
              confirmBtnText="Continue"
              title="Are you sure?"
              focusCancelBtn
              onCancel={handleClose}
              onConfirm={handleOK}
            >
              {msgSure}
            </SweetAlert>
            : (typeAlert === "ok" ?
                <SweetAlert
                  success
                  title="Ready!"
                  onConfirm={handleClose}
                >
                  Changes have been made
                </SweetAlert>
                : (typeAlert === "error" ?
                    <SweetAlert
                      error
                      title="Error!"
                      onConfirm={handleClose}
                    >
                      {msgError}
                    </SweetAlert> :null))
        }
      </>
    );
}