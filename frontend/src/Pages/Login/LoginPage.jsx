import React, { Fragment, lazy } from "react";
const Login = lazy(() => import("../../Components/Login/Login.jsx"));
function LoginPage() {
    return <>
        <Fragment>
            <Login></Login>
        </Fragment>
    </>
}

export default LoginPage
