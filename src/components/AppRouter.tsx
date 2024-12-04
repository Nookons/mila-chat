import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { publicRoutes } from "../routes";
import { SIGN_IN_ROUTE } from "../utils/const";
import SignIn from "../pages/SignIn/SignIn";
import {useAppSelector} from "../hooks/storeHooks";

interface RouteObject {
    path: string;
    Component: React.ComponentType<any>;
}

type PublicRoutes = RouteObject[];

const AppRouter: React.FC = () => {
    const user = useAppSelector(state => state.user);  // This would normally be dynamic, e.g., from a context or state

    return (
        <Routes>
            <Route path={SIGN_IN_ROUTE} element={<SignIn />} />
            {publicRoutes.map(({ path, Component }, index) => (
                <Route
                    key={path}
                    path={path}
                    element={user ? <Component /> : <Navigate to={SIGN_IN_ROUTE} key={index} />}
                />
            ))}
        </Routes>
    );
};

export default AppRouter;
