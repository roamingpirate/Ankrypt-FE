import { useContext , createContext} from "react"


const UserContext = createContext();

export const userInfo = () => {
    return useContext(UserContext);
}


export const userController = ({children}) => {

    

    return (
        <UserContext.Provider>
            {children}
        </UserContext.Provider>
    )
}