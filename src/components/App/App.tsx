import * as React from 'react'
import { Input } from 'uxp/components';
import { HashRouter as Router, Redirect, Route, Switch, useLocation } from "react-router-dom";
import LandingPage from '../LandingPage/LandingPage';
import { IContextProvider } from '../../uxp';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';

import dashboardIcon from '../../assets/images/home.svg';
import smartParkingIcon from "../../assets/images/carpark.svg";
import smartLightingIcon from '../../assets/images/smart-lighting.svg';

import ExtendedRoute from '../common/ExtendedRoute';
import PageNotFound from '../common/Error/PageNotFound';
import StreetLight from '../Streetlight/Streetlight';

export interface IMenuItem {
    name: string,
    link: string,
    iconPath?: string,
    roles?: string[],
    component: React.FC<any> | null,
    redirect?: boolean,
    parag : string,
}

export let MenuItems: IMenuItem[] = [
    { 
        name: 'Dashboard',
        iconPath: `"${dashboardIcon}"`, 
        link: '/landing-page', 
        parag : "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Contrary to popular belief, Lorem Ipsum is not simply random text.",
        component: LandingPage,
       
    },
    { 
        name: 'Street Light',
        iconPath: `"${smartLightingIcon}"`, 
        link: '/street-light',  
        parag : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        component: StreetLight
    },
    { 
        name: 'Smart Parking',
        iconPath: `"${smartParkingIcon}"`,
        link: "smart-parking",
        component: null,
        parag : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        redirect: true,
        roles: ["canaccesssmartparking"]
    }
]

interface IAppProps {
    uxpContext: IContextProvider
}


const App: React.FunctionComponent<IAppProps> = (props) => {

    let { uxpContext } = props
    
    return (
        <div className="mda-spa-web-ui-container">
            <Router>
                <Sidebar menuItems={MenuItems} uxpContext={props.uxpContext} />

                <div className="main">

                    <Header uxpContext={props.uxpContext} title="Raseel Smart City Platform" />

                    <Switch>

                        <Route exact path={"/"} >
                            <Redirect to={'/landing-page'} />
                        </Route>

                        {
                            MenuItems.map((m, k) => {
                                let Component = m.component
                                let redirect = m.redirect

                                if(redirect) return null

                                return <ExtendedRoute key={k} uxpContext={uxpContext} roles={m.roles || []} path={m.link} >
                                    {Component && <Component uxpContext={uxpContext} />}
                                </ExtendedRoute>

                            })
                        }

                        < Route >
                            <PageNotFound />
                        </Route >
                    </Switch >
                </div >
            </Router >

        </div >
    )
}

export default App;
