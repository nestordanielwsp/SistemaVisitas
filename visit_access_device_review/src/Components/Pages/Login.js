import Call from "../Helpers/Calls";
import Styled from 'styled-components'
import { useState } from "react";
import { useHistory } from 'react-router';
import { useSignIn } from 'react-auth-kit';
import { toast } from 'react-toastify';

const Logo = Styled.div`
    font-family: monospace !important;
    font-weight: bold;
    font-variant-caps: all-small-caps;
    & > h1{
        text-decoration: overline;
        font-size: 65px !important;
    }
`;

export default function Login({ titulo }) {
    const [user, setUser] = useState(null);
    const [pass, setPass] = useState(null);
    const signIn = useSignIn();
    const notifyError = (msj) => toast.error(msj);
    let history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();
        if(user == null || pass == null){
            notifyError("Missing data to capture");
            return;
        }

        var _data = {
            username: user,
            password: pass
        }

        try {
            let res = await Call('configuration').post('Users/authenticate', _data);

            if(res.status >= 200 && res.status < 300){
                if(signIn({
                    token: res.data.jwtToken.token,
                    expiresIn: res.data.jwtToken.expiresIn,
                    tokenType: "Bearer",
                    authState: res.data.user
                })){
                    history.push("/");
                }
            }
        } catch (error) {
            notifyError(error.response.data.message);
        }
    }

    const handleChangeUsername = (ev) => {
        let value = ev.currentTarget.value;
        value = value.trim() === "" ? null : value;
        setUser(value);
    }
    const handleChangePassword = (ev) => {
        let value = ev.currentTarget.value;
        value = value.trim() === "" ? null : value;
        setPass(value);
    }

    return (
        <div>
            <section className="material-half-bg"><div className="cover"></div></section>
            <section className="login-content">
                <Logo className="logo">
                    <h1>{titulo}</h1>
                </Logo>
                <div className="login-box" style={{ minHeight: Error.isError ? "405px" : "350px" }}>
                    <form className="login-form" onSubmit={handleLogin}>
                        <h3 className="login-head">
                        <span className="icon-magna" style={{fontSize:"36px"}}>
                            <span className="path1"></span><span className="path2"></span>
                            <span className="path3"></span><span className="path4"></span><span className="path5"></span>
                            <span className="path6"></span><span className="path7"></span><span className="path8"></span>
                            <span className="path9"></span>
                        </span>
                        </h3>
                        <div className="form-group">
                            <label className="control-label">USERNAME</label>
                            <input className="form-control"
                            placeholder="Email" autoFocus
                            onChange={handleChangeUsername}
                            />
                        </div>
                        <div className="form-group">
                            <label className="control-label">PASSWORD</label>
                            <input className="form-control"
                            type="password" placeholder="Password"
                            onChange={handleChangePassword}
                            />
                        </div>
                        <div className="form-group btn-container">
                            <button className="btn btn-primary btn-block">
                                <i className="fa fa-sign-in fa-lg fa-fw"></i>ACCESAR
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}