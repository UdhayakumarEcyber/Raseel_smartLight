import * as React from "react";
import { registerUI, IContextProvider, } from './uxp';

import './assets/styles/styles.scss';
// import './styles.scss'
import App from "./components/App/App";

// import { Button, FormField, IconButton, MapComponent, NotificationBlock, WidgetWrapper } from 'uxp/components';

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string,

}


const Street_lightingUI: React.FunctionComponent<IWidgetProps> = (props) => {
    return <App uxpContext={props.uxpContext} />
}

/**
 * Register as a UI
 */


registerUI({
   id:"smart-city-platform",
   component: Street_lightingUI,
   showDefaultHeader: false
});