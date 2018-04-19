import React from 'react';
import { Text, 
    View, 
    KeyboardAvoidingView, 
    ScrollView, 
    TouchableHighlight, 
    TextInput, 
    TouchableOpacity, 
    ListView, 
    FlatList,
    Image,
    RefreshControl,
    Alert,
    ActivityIndicator,
    Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Button , FormInput, FormLabel, FormValidationMessage, Icon} from 'react-native-elements';
import {
    RkText,
    RkCard, 
    RkStyleSheet,
    RkTheme,
    RkButton,
    RkTextInput
  } from 'react-native-ui-kitten';
import {ImagePicker} from 'expo';
import Swipeout from 'react-native-swipeout';
import * as firebase from 'firebase';
import { database } from 'firebase';
import {SocialBar} from '../components/socialBar';
import TimerMixin from 'react-timer-mixin';
import {bootstrap} from '../config/bootstrap'
import { scaleVertical, scaleHonrizontal } from '../utils/scale';




export default class PageMotoEssai extends React.Component{
    static navigationOptions = {
        title: 'Mes Motos',
      };

    constructor(props){
        super(props)
        this.state = {
            status: false,
        }
    }

    alertConnexion = () => {
        Alert.alert(
            '',
            'Connectez-vous ou inscrivez-vous pour pouvoir utiliser les fonctionnalités de l\'application',
            [
              {text: 'Ok', onPress: () => console.log('Cancel Pressed')},
            ]
          )
    }
renderAddMotoForm = () => {
    if(this.state.status)
    {
    return(
            <TouchableOpacity
                    delayPressIn={70}
                    activeOpacity={0.8}
                    style = {[styles.container, styles.root]}
                    onPress = {()=> this.setState({status: !this.state.status})}>
                <RkCard rkType='horizontal-ajout' style={styles.card}>
                    <View rkCardContent>
                        <RkText numberOfLines={1} rkType='header6' style = {{textAlign: 'center'}}>Ajoutez une moto</RkText>                  
                        <RkTextInput rkType ='basic' label='Marque'
                        color = 'gray'
                        onChangeText = {(text) => this.setState({marque: text})}/>
                        <RkTextInput rkType ='basic' label='Modele'
                        onChangeText = {(text) => this.setState({modele: text})}/>
                        <RkButton rkType = 'rounded save' onPress = {() => this.alertConnexion()}>Sauvegarder</RkButton>
                    </View>
                </RkCard>
            </TouchableOpacity>

    )}
    else {
        return(
            <TouchableOpacity
                delayPressIn={70}
                activeOpacity={0.8}
                style = {[styles.container, styles.root]}
                onPress = {()=> this.setState({status: !this.state.status})}>
              <RkCard rkType='horizontal-vide' style={styles.card}>
                  <View rkCardContent>
                      <RkText numberOfLines={1} rkType='header6' style = {{textAlign: 'center'}}>Ajoutez une moto</RkText>
                  </View>
            </RkCard>
          </TouchableOpacity>
        )
    }
 }
 render() {
        const renderAddMotoForm = this.renderAddMotoForm();
        const imgSource = require('../img/addImage.png')
        let swipeBtns = [{
            text: 'Supprimer',
            backgroundColor: 'red',
            onPress: () =>  Alert.alert(
                'Supprimer le véhicule',
                '',
                [
                  {text: 'Non, ne pas supprimer', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'Oui'},
                ]
              )
          }];
          const data = [{
            'id': 1,
            'Uri': 'undefined',
            'Marque': 'Marque',
            'Modele': 'Modele',
            'Date' : new Date().toDateString(),
        }]

        return (
            
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                enableAutoAutomaticScroll={(Platform.OS === 'ios')}
                style = {styles.root}>
                <Swipeout right = {swipeBtns}
                style={styles.card}
                autoClose = {true}
                buttonWidth = {110}>
                    <TouchableOpacity
                    delayPressIn={70}
                    activeOpacity={0.8}
                    onPress = {() => this.alertConnexion()}
                    style={[styles.container, styles.root]}>
                    <RkCard rkType='horizontal' >
                    <ImageMoto/>
                        <View rkCardContent>
                                    <RkText numberOfLines={1} rkType='header6'>{data[0].Marque}</RkText>
                                    <RkText rkType='secondary1 hintColor'>{data[0].Modele}</RkText>
                                    <RkText style={styles.post} numberOfLines={1} rkType='secondary1'>Ajouté le {data[0].Date}</RkText>
                        </View>
                        <View rkCardFooter>
                            <SocialBar rkType='space' showLabel={true}/>
                        </View >
                </RkCard>
                </TouchableOpacity>
                </Swipeout>
                {renderAddMotoForm}
                <View> 
                    <RkText style = {styles.infoText} rkType = 'hintColor'>
                        Connectez-vous grâce à l'onglet profile si vous souhaitez utiliser les fonctionnalités de l'application.
                    </RkText>
                </View>
                </KeyboardAwareScrollView>
        )
    }
}


class ImageMoto extends React.Component{
    constructor(props){
        super(props)
    }

    render() 
    {
        const sourceImage = require('../img/addImage.png')
        return(
        <TouchableHighlight >
            <Image source={sourceImage} style={{ width: 100, height: 100, borderRadius:0 }} />
        </TouchableHighlight>
        );
    }
}

let styles = RkStyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.screen.base
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
      marginTop: 13, width : 230
    },
    iconLoading: {
        flex: 1,
        justifyContent: 'center'
      },
    infoText : {
        textAlign:'center', 
        marginTop : scaleVertical(20), 
        marginLeft : scaleHonrizontal(20),
        marginRight : scaleHonrizontal(20)
    }
  }));

  