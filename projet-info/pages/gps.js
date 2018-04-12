import React from 'react';
import { Text, View, ProgressBar, ProgressViewIOS, TouchableOpacity, ScrollView, FlatList, Geolocation } from 'react-native';
import {Button , FormInput, FormLabel, FormValidationMessage, Icon, CheckBox} from 'react-native-elements';
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


export default class PageGPS extends React.Component{
   static navigationOptions = ({ navigation }) => ({
            title: "GPS",
      });

    constructor(props){
        super(props)
        this.state = {
            latitude : 0,
            longitude : 0,
            timer : null,
            distanceTotale : 0,
            gpsActif : false,
            dataList : [],
            dataChecked : [],
            index : 0,
            motoActiveId: null,
            date: new Date(),
            }
        this.activateGPS = this.activateGPS.bind(this);
        this.stopGPS = this.stopGPS.bind(this)
        this.renderItem = this._renderItem.bind(this)
        navigator.geolocation.getCurrentPosition((position) => 
        {
            this.setState({longitude : position.coords.longitude,
                           latitude : position.coords.latitude})
        })

    }

    componentWillReceiveProps() {
        this.setState({ date: this.props.navigation.state.params.date });
        this.getMoto()
      }

    componentWillMount() 
    {
        this.getMoto()
    }

    activateGPS = () => 
    {
       let timer = setInterval(() => this.updateKilometres(), 2000)
       this.setState({timer});
       this.setState({gpsActif: true})
    }

    stopGPS = () => 
    {
        let motoIsChecked = false;
        if(this.state.motoActiveId !== null)
        {
            this.setNbKilometresAllMoto(this.state.motoActiveId, Math.round(this.state.distanceTotale))
        }
        clearInterval(this.state.timer);
        this.setState({gpsActif: false})
        this.setState({distanceTotale : 0})
    }
    
    setNbKilometresAllMoto = (id, nbKilometres) => {
        const userUid = firebase.auth().currentUser.uid
        const motoRef = firebase.database().ref().child('users').child(userUid).child('Motos').child(id).child('Entretiens')
        let postData = [];
        motoRef.on('child_added', snapshot => {
            postData.push({
                'DateModif' : new Date().toDateString(),
                'Name' : snapshot.val().Name,
                'NbKilometres' : snapshot.val().NbKilometres + nbKilometres,
            })
        })
        let updates = {};
        updates['users/' + userUid +'/Motos/' + id + '/Entretiens/'] = postData;
        firebase.database().ref().update(updates)
        }
        

    getMoto = () => {
        let data = [];
        let dataBis = [];
        let numberOfMoto = this.state;
        let compteur = 0;
        const userUid = firebase.auth().currentUser.uid
        const ref = firebase.database().ref().child('users').child(userUid).child('Motos')
        ref.on('child_added', snapshot => {
            if(snapshot.numChildren() > 0)
            {
                data.push({
                    'id' : snapshot.key, 
                    'Marque' : snapshot.val().Marque,
                    'Modele' : snapshot.val().Modele,
                    'Uri' : snapshot.val().Uri,
                    'Numero': compteur,
                })
                dataBis.push(
                    false,
                )
            compteur++;
            this.setState({dataList:data})
            this.setState({dataChecked: dataBis})
            }
            else
            {
                this.setState({dataList:[]})
            }
        })
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

    _keyExtractor(post) {
        return post.id;
        }
    
    _renderItem(info) {
        const imgSource = require('../img/addImage.png')
        let dataCheckedBis =this.state.dataChecked
        return (
            <CheckBox title={info.item.Marque}
                        size = {30}
                        checkedColor='#1565c0'
                        checked = {this.state.dataChecked[info.item.Numero]}
                        onPress = {() => {  for(let i = 0; i < dataCheckedBis.length; ++i)
                                            {
                                                if(i == info.item.Numero)
                                                    {
                                                        dataCheckedBis[i] = !dataCheckedBis[i];
                                                        if(dataCheckedBis[i])
                                                        {
                                                            this.setState({motoActiveId: info.item.id})
                                                        }
                                                        else
                                                            this.setState({motoActiveId: null})
                                                    }
                                                else
                                                    {dataCheckedBis[i] = false;}
                                            }
                                            this.setState({dataChecked: dataCheckedBis}); 
                                            this.setState(prevState => ({index: prevState.index + 1}))}}
            />
            )
        
    }

    render() {
        return (
            <ScrollView style = {styles.root}>
                <View>
                <View>
                    <FlatList
                        extraData = {this.state.index}
                        data={this.state.dataList}
                        renderItem={this.renderItem}
                        keyExtractor={this._keyExtractor}
                        style = {[styles.container, styles.root]}/>
                </View>
                <View  style = {{alignItems :'center', justifyContent :'center', paddingTop : 25, paddingBottom : 25}}>
                    <RkText rkType = 'header5'>Vous avez parcouru</RkText>
                    <RkText rkType = 'header1'>{Math.round(this.state.distanceTotale)} Kms</RkText>
                </View>
                <View style={styles.save}>
                    <GPSButton gpsActif = {this.state.gpsActif} 
                               onPressStart = {() => this.activateGPS()}
                               onPressStop = {() => this.stopGPS()} />
                </View>
                </View>
            </ScrollView>
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
    root: {
        backgroundColor: theme.colors.screen.base
    },
    save: {
      marginVertical: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
        backgroundColor: theme.colors.screen.scroll,
        paddingVertical: 8,
        paddingHorizontal: 14
      },
      card: {
        marginVertical: 8,
      },
      post: {
        marginTop: 13
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

RkTheme.setType('RkCard', 'motoCard', {
    height: scaleVertical(60),
});

RkTheme.setType('RkCard', 'horizontal-checked', {
    container: {
      height: 60,
    },
    content: {
      flex: 1,
    },
  });
