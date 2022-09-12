import { IContextProvider } from "./src/uxp";

interface IStreetLight {
    id: string,
    type: string,
    alternateName: string,
    areaServed: string,
    controllingMethod: string,
    current: number,
    dateCreated: string,
    dateLastSwitchingOff: string,
    dateLastSwitchingOn: string,
    dateModified: string,
    dateServiceStarted:  string,
    description: string,
    deviceInfo: {
        serialNumber: string,
        deviceName:  string,
        deviceID:  string,
        measurand:  string,
        deviceModel: {
            brandName:  string,
            modelName:  string,
            modelURL: string
        }
    },
    feederPillarNum:  string,
    lanternHeight: number,
    location: {
        type: "Point" | "Polygon",
        coordinates: [number, number]
    },
    locationCategory:  string,
    municipalityInfo: {
        municipalityName: string,
        stateName:  string,
        cityName:  string,
        zoneName: string
    },
    name: string,
    observationDateTime: string,
    powerConsumption: number,
    powerFactor: number,
    powerRating: number,
    powerState:  string,
    status:  string,
    streetPoleNum: string,
    voltage: number
}

interface IErrorProps {
    error: string,
    message: string
}
interface IErrorCodes {
    [code: number]: IErrorProps[]
    // this will be used to cvalidate the resposse 
    // Ex: {103202: [ {error: "ERR_REGISTRATION_NUMBER_ALREADY_EXISTS", message: "Registration number already exists"}  ]}
}