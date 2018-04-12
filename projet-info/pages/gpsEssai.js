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
     }

    render() {
        return (
            <ScrollView style = {styles.root}>
                <View>
            
                <View  style = {{alignItems :'center', justifyContent :'center', paddingTop : 25, paddingBottom : 25}}>
                    <RkText rkType = 'header5'>Vous avez parcouru</RkText>
                    <RkText rkType = 'header1'>0 Kms</RkText>
                </View>
                <View style={styles.save}>
                    <GPSButton gpsActif = {false} />
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
                            rkType='rounded GPSButtonActif'>Démarrer</RkButton>
        )
    }
    else
    {
        return(
            <RkButton style = {{marginBottom : 10}}
                            rkType='rounded GPSButtonInactif'>Fin</RkButton>
        ) 
    }
}

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
