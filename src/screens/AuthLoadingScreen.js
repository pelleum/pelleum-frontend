import { useEffect, useContext } from 'react';
import { Context as AuthContext } from '../context/AuthContext';

const AuthLoadingScreen = () => {
    const { tryLocalLogin } = useContext(AuthContext);
    
    useEffect(() => {
        tryLocalLogin();
    }, []);

    return null;
};

export default AuthLoadingScreen;