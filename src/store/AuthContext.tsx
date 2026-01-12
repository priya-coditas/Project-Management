import { createContext, type Dispatch, type SetStateAction } from 'react';

interface AuthContextType{
    role: string;
    setRole: Dispatch<SetStateAction<string>>;

    user: string | null;
    setUser: Dispatch<SetStateAction<string>>;

    userId: string | number;
    setUserId: Dispatch<SetStateAction<string | number>>;
} 

const AuthContext = createContext<AuthContextType>({
    role: '',
    setRole: () => {}, 
    user: '',
    setUser: () => {},
    userId: '',
    setUserId: () => {},
});

export default AuthContext;