import * as React from "react";
import { IContextProvider, } from '../../uxp';
import { IStreetLight } from "../../../crud-component";
import axios from "axios";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";

import * as L from "leaflet";
import classNames from "classnames";
import { DataGrid, ItemCard, WidgetWrapper } from "uxp/components";

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string,
}

const StreetLight: React.FunctionComponent<IWidgetProps> = (props) => {

    // let [selected, setSelected] = React.useState<string | null>("op-1");

    let [streetlights, setStreetlights] = React.useState<IStreetLight[]>([])
    let [globalInfo, setGlobalInfo] = React.useState<{ [key: string]: any }>({});

    React.useEffect(() => {
        const { uxpContext } = props;

        getStreetlights(uxpContext);

    }, [props.uxpContext])

    const getStreetlights = async (uxpContext: IContextProvider) => {
        try {
            let res = await uxpContext.executeAction('StreetLight', 'GetStreetLights', { "max": 500 }, { json: true })
            let data = JSON.parse(res.data);
            // console.log("streetlight data", data, res)
            setStreetlights(data as IStreetLight[])
        }
        catch (err) {
            console.log(err)
        }
    }

    React.useEffect(() => {
        const noOfLightOnline = streetlights.filter(s => {
            try {
                return s.status.toLowerCase() === "ok"
                    && s.powerState.toLowerCase() === "on"
            } catch (error) {
                console.error(error);

                return false;
            }
        });
        const noOfLightOffline = streetlights.filter(s => {
            try {
                return s.status.toLowerCase() === "ok"
                    && s.powerState.toLowerCase() === "off"
            } catch (error) {
                console.error(error);

                return false;
            }
        });
        const notWorking = streetlights.filter(s => s.status.toLowerCase() !== "ok");
        const watts = noOfLightOnline.reduce((sum, s) => s.powerConsumption ? s.powerConsumption + sum : sum, 0);

        const newGlobalInfo = {} as { [key: string]: any };

        newGlobalInfo["Lights Online"] = { value: noOfLightOnline.length, color: "green" }
        newGlobalInfo["Lights Offline"] = { value: noOfLightOffline.length, color: "pink" }
        newGlobalInfo["Not Working"] = { value: notWorking.length, color: "orange" }
        newGlobalInfo["Total Consumption"] = { value: `${watts} kW h`, color: "green" }

        setGlobalInfo(newGlobalInfo);
    }, [streetlights])

    const renderGridItem = (item: any, key: number) => {
        return (<ItemCard
            item={{ ...item, value: <h3 className={item?.color}>{item?.value}</h3> }}
            imageField="icon"
            titleField="value"
            subTitleField="key"
            nameField="name"
        />)
    }

    return (
        <WidgetWrapper className="smart_light">
            <div className="transport_map">
                <div className="transport_map-sec" style={{ width: "100%", height: "100%" }}>
                    <Map
                        id="map-component-streetlight"
                        center={[24.45163243367238, 39.631279509717075]}
                        zoom={12}
                    >
                        <TileLayer
                            url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                            attribution='&amp;copy <a href="https://www.google.com/intl/en-US/help/terms_maps/">Google Maps</a>'
                            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                        />
                        {/* <TileLayer
                            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                            attribution='&amp;copy <a href="https://www.google.com/intl/en-US/help/terms_maps/">Google Maps</a>'
                            // subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                        ></TileLayer> */}

                        {streetlights.map((streetlight, index) => {
                            try {
                                // console.log(streetlight)
                                const status = streetlight.status.toLowerCase() === "ok";
                                const powerState = streetlight.powerState.toLowerCase() === "on";
                                const locationType = streetlight.location.type;
                                const coordinates = streetlight.location.coordinates
                                if(typeof coordinates[1] !== "number" && typeof coordinates[0] !== "number"){
                                    return <React.Fragment key={index}></React.Fragment>
                                }

                                return locationType === "Point" ?
                                    <Marker
                                        key={index}
                                        icon={L.divIcon({
                                            className: classNames("light", {
                                                "green-light": status && powerState,
                                                "dark-red-light": status && !powerState,
                                                "orange-light": !status && powerState,
                                                "grey-light": !status && !powerState
                                            }),
                                            html: "<div class='bulb-tungsten'></div>",
                                            iconSize: [35, 35]
                                        })}
                                        position={{ lat: coordinates[1], lng: coordinates[0] }}>
                                        <Popup opacity={1} direction={'top'}>
                                            <div className={classNames("energy_content", {
                                                "green-energy_content": status && powerState,
                                                "dark-red-energy_content": status && !powerState,
                                                "orange-energy_content": !status && powerState,
                                                "grey-energy_content": !status && !powerState
                                            })}>
                                                {/* <div className="days">7 days</div> */}
                                                <div className="section-content">
                                                    <div className="icon"></div>
                                                    <h5>{streetlight.powerConsumption} kW h</h5>
                                                    <p>Energy Cosumption</p>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                    : <React.Fragment key={index}></React.Fragment>

                                // : <Polygon positions={streetlight.location.coordinates}></Polygon>
                            } catch (error) {
                                console.error(error);
                            }
                        }
                        )}
                    </Map>
                </div>
            </div>
            <div className="smart-light-box">

                <div className="smart-light-box-top">

                    <div className="smart-light-box_lft">
                        <h4>Global Lighting</h4>
                    </div>

                    {/* <div className="smart-light-box_rht">
                        <div className="uti-sel-boxes">
                            <div className="uti-sel-box">
                                <FormField inline className="showcase-input">
                                    <Select
                                        selected={selected}
                                        options={[
                                            { label: "Entire City", value: "op-1" },
                                            { label: "Hotels", value: "op-2" },
                                            { label: "Hospital", value: "op-3" }
                                        ]}
                                        onChange={(value) => { setSelected(value) }}
                                        placeholder=" -- select --"
                                    />
                                </FormField>
                            </div>
                        </div>
                    </div> */}
                </div>

                <div className="smart-light-box_details" >
                    <DataGrid
                        data={Object.keys(globalInfo).map(key => ({ key, ...globalInfo[key] }))}
                        renderItem={renderGridItem}
                        columns={2}
                    />
                </div>


            </div>
        </WidgetWrapper>
    );

};

export default StreetLight;