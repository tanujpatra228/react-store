import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { actionCreators } from "../../store";

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector(store => store.auth.currUser);
    useEffect(()=>{
        if (Object.keys(auth).length) {
            dispatch(actionCreators.LogOut());
        }
        navigate('/login');
    }, [navigate, dispatch, auth]);
    return <>Loging out...</>;
}

export default Logout;