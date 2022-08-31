import React, {Component} from 'react';
import { Row, Col } from 'antd';
import axios from "axios";

import SatSetting from './SatSetting';
import SatelliteList from './SatelliteList';
import { SAT_API_KEY, BASE_URL, NEARBY_SATELLITE, STARLINK_CATEGORY } from "../constants";
import WorldMap from "./WorldMap";

class Main extends Component {
    state = {
        setting: {},
        satInfo: {},
        satList: [],
        isLoadingList: false
    };

    showNearbySatellite = (setting) => {
        console.log('show nearby')
        this.setState({
            setting: setting
        });
        //fetch sat list from the server
        this.fetchSatellite(setting);
    };

    fetchSatellite = (setting) => {
        // STEP1: get sat info from the server
        // - setting / req info
        // STEP2: analyze the response
        /*
        * case 1: successfully -> pass res to StaList
        * case 2: failed -> inform users
        */
        console.log("fetching")
        const { latitude, longitude, elevation, altitude } = setting;
        const url = `${BASE_URL}/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;
        //&apiKey is your url key
        this.setState({
            isLoadingList: true
        });
        //we only need the get method
        axios.get(url)
            .then( res => {
                console.log(res.data);//print the response data
                this.setState({ //if (res.status === 200)
                    satInfo: res.data,
                    isLoadingList: false
                })
            })
            .catch( error => {
                this.setState({
                    isLoadingList: false//stop to load, if true, the list will continue to load
                });
                console.log('err in fetch satellite -> ', error);
            });
    };

    showMap = (selected) => {
        this.setState((preState) => ({
            ...preState,
            satList: [...selected],
        }));
    };

    render() {
        const { satInfo, isLoadingList, satList, setting } = this.state;

        return (
            <Row className="main">
                <Col span={8} className="left-side">
                    <SatSetting onShow={this.showNearbySatellite} />
                    <SatelliteList
                        satInfo={satInfo}
                        isLoad={isLoadingList}
                        onShowMap={this.showMap}
                    />
                </Col>
                <Col span={16} className="right-side">
                    <WorldMap satData={satList} observerData={setting} />
                </Col>
            </Row>
        );
    }
}

export default Main;

