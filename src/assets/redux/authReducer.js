

const initialState = {
    isAuthenticated: false, 
    token: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                token: action.payload.token,
            };
        case 'LOGOUT_SUCCESS':
            return {
                ...state,
                isAuthenticated: false,
                token: null,
            };
        default:
            return state;
    }
};

export default authReducer;
