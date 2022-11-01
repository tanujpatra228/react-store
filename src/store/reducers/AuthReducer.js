const AuthReducer = (initialState = {}, action) => {
    switch (action.type){
        case 'LOGIN':
            return action.payload;

        case 'LOGOUT':
            return action.payload;
            
        default:
            return {};
    }
}

export default AuthReducer;