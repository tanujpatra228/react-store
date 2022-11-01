export const LogIn = (user) => {
    return (dispatch) => {
        dispatch({
            type: 'LOGIN',
            payload: user
        });
    }
}

export const LogOut = () => {
    return (dispatch) => {
        dispatch({
            type: 'LOGOUT',
            payload: {}
        });
    }
}