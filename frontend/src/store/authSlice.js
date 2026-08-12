export const login = (payload) =>({
    type: 'auth/login',
    payload,
})

export const logout =()=>({
    type :'auth/logout',
})

const readStoredAuth = () => {
    if (typeof window === 'undefined') {
        return null
    }

    try {
        const raw = window.localStorage.getItem('auth')
        if (!raw) {
            return null
        }

        const parsed = JSON.parse(raw)
        const token = parsed?.token || parsed?.accessToken || parsed?.data?.accessToken

        if (!parsed || !token) {
            window.localStorage.removeItem('auth')
            return null
        }

        return {
            status: Boolean(parsed.status),
            userData: parsed.userData || parsed.data?.user || null,
            token,
        }
    } catch (e) {
        window.localStorage.removeItem('auth')
        return null
    }
}

const init = readStoredAuth() || {
    status: false,
    userData: null,
    token: null,
}

export default function authReducer(state= init, action){
    switch(action.type){
        case 'auth/login':{
            const {user,token} = action.payload || {}
            const newState = {
                ...state,
                status: true,
                userData: user || action.payload,
                token: token || null,
            }
            try{
                if(typeof window !=='undefined'){
                    window.localStorage.setItem('auth',JSON.stringify(newState))
                }
            }catch(e){
                //ignore
            }
            return newState
        }
        case 'auth/logout':{
            try{
                if(typeof window !== 'undefined'){
                    window.localStorage.removeItem('auth')
                }
            }catch(e){
                //ignore
            }
            return {
                status: false,
                userData: null,
                token: null,
            }
        }
        default:
            return state
    }
}
