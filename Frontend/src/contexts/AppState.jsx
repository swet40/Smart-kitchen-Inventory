/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer } from 'react';

const AppStateContext = createContext();

const initialState = {
    inventory: [],
    recipes: [],
    loading: false,
    error: null,
    };

    function appReducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
        return { ...state, loading: action.payload };
        case 'SET_INVENTORY':
        return { ...state, inventory: action.payload };
        case 'SET_RECIPES':
        return { ...state, recipes: action.payload };
        case 'SET_ERROR':
        return { ...state, error: action.payload };
        default:
        return state;
    }
    }

    export function AppStateProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
        {children}
        </AppStateContext.Provider>
    );
    }

    export function useAppState() {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
}