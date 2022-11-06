import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({component: Component, authGateway}) => {
    const navigate = useNavigate();
    const auth = useSelector(store => store.auth.currUser) || {};
    const isAuth = Object.keys(auth).length ? true : false;

    useEffect(() => {
        if (!isAuth) {
            navigate('/login');
        }
    }, [navigate, isAuth]);

    return (
        isAuth && <Component />
    )
}

export default ProtectedRoute;