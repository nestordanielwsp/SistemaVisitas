import {createContext,useState} from 'react';

export const AppContext = createContext();

export default function AppProvider({children}){
    const [state, setState] = useState({loading:false});

    return (
        <>
            <AppContext.Provider value={[state, setState]}>
                {children}
            </AppContext.Provider>
        </>
    )
}