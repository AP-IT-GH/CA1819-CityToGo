import React, { Component, } from "react";
import {
    StyleSheet,
    View,
    Text
} from "react-native";
import SInfo from "react-native-sensitive-info";

import { Button } from 'react-native-elements'
import Maps from "./Maps";
import Profile from "./Profile";
import { NavigationActions, StackActions } from "react-navigation";
import ModalExample from "./popup"
import Quiz_popUp from "./Quiz_popup";
import randomLocation from 'random-location';
import geolib from "geolib";


const LATITUDE = 29.95539;
const LONGITUDE = 78.07513;
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
var MyLocation;

const R = 500;
var center;
var distanceToCheckpoint;
var stral;




class Home extends Component {


    constructor(props) {
        super(props);
        this.Quiz = this.getQuizpopup.bind(this);
        
        this.state = {
            latitude: LATITUDE,
            longitude: LONGITUDE,
            polygons: [],
            visible: false,
            quiz_visible:false,
            data:"",
            Name:"",
            polygons: [],
            randomQuizes: [],
            randomNumber:0

        };
    }
    Quiz = () => {
        //button click handler.
      }
    componentDidMount() {
        this.watchID = navigator.geolocation.watchPosition(
            position => {
                const { latitude, longitude } = position.coords;

                this.setState({
                    latitude,
                    longitude,
                });
            },
            error => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

        SInfo.getItem("accessTokenServer", {}).then(accessToken => {
            global.token = accessToken
        })

    }

    componentWillMount() {
        navigator.geolocation.getCurrentPosition(
            error => alert(error.message),
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000
            }
        );
       // this.getRandomQuizes();
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }
    getQuizpopup=  ()=>{
        console.log("method is working")
        this.setState({quiz_visible: true});
        this.refs.quizchild.setModalVisible(this.state.quiz_visible);
    }


    getMonument = async () => {
        fetch('http://192.168.1.60:3000/api/getNextLocation', {
            method: 'POST',
            headers: {
                authorization: 'Bearer ' + global.token,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                latitude: String(this.state.latitude),
                longitude: String(this.state.longitude)
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({ polygons: responseJson.geometry.coordinates[0] });
                this.setState({data:responseJson.properties.imageUrl})
                this.setState({Name:responseJson.properties.Naam})
                this.setState({visible: true});
                this.refs.popupchild.setModalVisible(this.state.visible);
                
                this.setState({ polygons: responseJson.geometry.coordinates[0] })
                this.getRandomQuizes();
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
            });
            
            //console.log("destination: "  + parseFloat(+"Lat: "+this.state.polygons[1][1]+ " long: "+ this.state.polygons[1][1]))
           
        }
        // Functie om random int te generaren.
    generateRandomint(min, max){
        return Math.random() * (max - min) + min;
    }

    getRandomQuizes() {
        //Current location
        MyLocation = {
            latitude: this.getMapRegion().latitude,
            longitude: this.getMapRegion().longitude
        }
        //console.log("my Location:  "+ MyLocation);
        
        //middenpunt tussen bestemming en huidige locatie 
        center = geolib.getCenter([
            { latitude: MyLocation.latitude, longitude: MyLocation.longitude },
            { latitude: parseFloat( this.state.polygons[1][1]), longitude: parseFloat( this.state.polygons[1][0]) }]);
       
            //Afstand tussen bestemming en huidgie locatie 
        distanceToCheckpoint = randomLocation.distance(MyLocation, { latitude: parseFloat( this.state.polygons[1][1]), longitude: parseFloat( this.state.polygons[1][0]) })
        
        //Grootte van de circle waar Quizes gegenereerd worden
        stral = parseInt(distanceToCheckpoint) / 3;
        let arr = []

        //Aantal Quizes worden getoond op basis van afstand tot checkpoint .
        if(parseInt( distanceToCheckpoint)<1000){
            this.setState({randomNumber: this.generateRandomint(2,5)})
        }
        else{
            this.setState({randomNumber: this.generateRandomint(4,7)})
        }
        console.log(this.state.randomNumber)
        
        // Random Quizes worden in een array gestoken
        for (let i = 0; i < parseInt (this.state.randomNumber); i++) {
            var randomPoints = randomLocation.randomCirclePoint(center, stral)
            arr.push(randomPoints); 
        }
        this.setState({ randomQuizes: arr })

    }

    getMapRegion = () => ({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    });



    onButtonPress() {
        const resetAction = StackActions.reset({
            index: 0,

            actions: [

                NavigationActions.navigate({
                    routeName: "Profile",

                    params: {}
                })
            ]

        });
        this.props.navigation.dispatch(resetAction);

    };
   

    render() {

        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>

                <Maps getRandom={this.state.randomQuizes} getPolygons={this.state.polygons} getMapRegion={this.getMapRegion.bind(this)} Quiz2={this.Quiz} />
                <View style={{
                    position: 'absolute',//use absolute position to show button on top of the map
                    top: '2%', //for center align
                    alignSelf: 'flex-end' //for align to right
                }}>
                    <Button
                        onPress={() => navigate('Profile', { name: 'Jane' })}
                        buttonStyle={styles.buttonStyle}
                        title="Profiel"
                    />
                </View>
                <View style={styles.bottomView}>
                    <Button
                        onPress={this.getMonument}
                        buttonStyle={styles.buttonStyle}
                        title="Start"
                    />
                
                </View>
                
                <ModalExample ref='popupchild' imageUri={this.state.data}  data={this.state.Name}/>
                <Quiz_popUp ref='quizchild' imageUri={this.state.data}  data={this.state.Name}/>
                
            </View>

            // <View style={styles.container} >
            //   <Button>Profile</Button>
            //     <Maps />
            // </View>
            // <View style={{ flex: 1 }}>
            //     <Maps />
            // </View>
        );

    }
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonStyle: {
        backgroundColor: "rgba(92, 99,216, 1)",
        width: 200,
        height: 45,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 5
    },
    bottomView: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20
    },
});