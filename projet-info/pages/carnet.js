import React from 'react';
import { Text, View, ProgressBar, ProgressViewIOS, TouchableOpacity, ScrollView, FlatList, Geolocation } from 'react-native';
import {Button , FormInput, FormLabel, FormValidationMessage, Icon} from 'react-native-elements';
import { Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';
import * as firebase from 'firebase';
import {
    RkText,
    RkCard, 
    RkStyleSheet,
    RkTheme,
    RkButton,
  } from 'react-native-ui-kitten';
  import {SocialBar} from '../components/socialBar';
  import TimerMixin from 'react-timer-mixin';
  import {scale, scaleModerate, scaleVertical, scaleHonrizontal} from '../utils/scale';


export default class PageCarnet extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            latitude : 0,
            longitude : 0,
            timer : null,
            distanceTotale : 0,
            gpsActif : false,
            }
        this.activateGPS = this.activateGPS.bind(this);
        this.stopGPS = this.stopGPS.bind(this)
        navigator.geolocation.getCurrentPosition((position) => 
        {
            this.setState({longitude : position.coords.longitude,
                           latitude : position.coords.latitude})
        })

    }

    activateGPS = () => 
    {
       let timer = setInterval(() => this.updateKilometres(), 2000)
       this.setState({timer});
       this.setState({gpsActif: true})
    }

    stopGPS = () => 
    {
        clearInterval(this.state.timer);
        this.setState({gpsActif: false})
    }



    updateKilometres = () => {
        navigator.geolocation.getCurrentPosition((position) => 
        {
            let lat1 = this.state.latitude;
            let long1 = this.state.longitude;
            this.setState({latitude : position.coords.latitude,
                longitude: position.coords.longitude})
            let lat2 = this.state.latitude;
            let long2 = this.state.longitude;
            let distance = getDistanceFromLatLonInKM(lat1, long1, lat2, long2)
            if(distance > 0.008)
            {
                let newDistanceTotale = 0;
                newDistanceTotale = this.state.distanceTotale + distance;
                this.setState({distanceTotale: newDistanceTotale})
            }
        },
        (error) => console.log(error.message))
    }

    render() {
        return (
            <View>
                <View style={styles.save}>
                    <GPSButton gpsActif = {this.state.gpsActif} 
                               onPressStart = {() => this.activateGPS()}
                               onPressStop = {() => this.stopGPS()} />
                </View>
                <View  style = {{alignItems :'center', justifyContent :'center', paddingTop : 50}}>
                    <RkText rkType = 'header1'>{this.state.distanceTotale}</RkText>
                </View>
            </View>
        )
    }
    
}

class GPSButton extends React.Component{
    constructor(props){
        super(props)
    }
    
    render() {
        if(!this.props.gpsActif)
        {
            return(
                <RkButton style = {{marginBottom : 10}}
                                onPress = {this.props.onPressStart} 
                                rkType='rounded GPSButtonActif'>Démarrer</RkButton>
            )
        }
        else
        {
            //CHanger la couleur
            return(
                <RkButton style = {{marginBottom : 10}}
                                onPress = {this.props.onPressStop} 
                                rkType='rounded GPSButtonInactif'>Fin</RkButton>
            ) 
        }
    }

}



getDistanceFromLatLonInKM = (lat1,lon1,lat2,lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    const dLon = this.deg2rad(lon2-lon1); 
    const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in m
    return d;
}

deg2rad = (deg) =>  {
    return deg * (Math.PI/180)
}


let styles = RkStyleSheet.create(theme => ({
    save: {
      marginVertical: 20,
      alignItems: 'center',
      justifyContent: 'center',
    }
  }));

RkTheme.setType('RkButton', 'GPSButtonInactif', {
    backgroundColor : 'red',
    width: scaleHonrizontal(320),
    hitSlop: {top: 5, left: 5, bottom: 5, right: 5},
});

RkTheme.setType('RkButton', 'GPSButtonActif', {
    width: scaleHonrizontal(320),
    hitSlop: {top: 5, left: 5, bottom: 5, right: 5},
});

