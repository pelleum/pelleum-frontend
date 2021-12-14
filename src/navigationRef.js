import { CommonActions } from '@react-navigation/native';

//declaring a variable with 'let' means that we want to be able to
//reassign the variable at some point in the future
let navigator;

export const setNavigator = (nav) => {
    navigator = nav;
};

export const navigate = (name, params) => {
    navigator.dispatch(
        CommonActions.navigate({
            name,
            params
        })
    );
};