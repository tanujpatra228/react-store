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
            break;

        case 'LOGOUT':
            return initialState;
            break;
        
        case 'UPDATE':
            let user = action.payload;
            return {
                ...state,
                currUser: {
                    ...state.currUser,
                    user: user
                }
            };
            break;
            
        default:
            return initialState;
    }
}

export default AuthReducer;