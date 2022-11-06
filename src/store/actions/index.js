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

export const UpdateUserData = (user) => {
    return (dispatch) => {
        dispatch({
            type: 'UPDATE',
            payload: user
        });
    }
}