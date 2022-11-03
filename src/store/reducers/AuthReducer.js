const initialState = {
    currUser: {}
};

const AuthReducer = (state = initialState, action) => {
    switch (action.type){
        case 'LOGIN':
            return {
                ...state,
                currUser: action.payload
            };

        case 'LOGOUT':
            return initialState;
            
        default:
            return initialState;
    }
}

export default AuthReducer;