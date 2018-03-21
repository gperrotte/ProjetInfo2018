import React from 'react';
import { Text, View, Image, AsyncStorage, TouchableHighlight} from 'react-native';
import {Button , FormInput, FormLabel, FormValidationMessage, Icon} from 'react-native-elements';
import {NavigationActions} from 'react-navigation';
import { ImagePicker } from 'expo';
//import StylePageProfile from '../styles/stylePageProfile'
import * as firebase from 'firebase';


export default class PageProfile extends React.Component{
    constructor(props){
        super(props)
        this.state = {
             image: null,
        }
    }

    componentDidMount(){
        this.loadItem("imageProfile");
    }

    signOut = () => {
        firebase.auth()
        .signOut()
        .then(() => {
            this.resetNavigation();
            //this.props.navigation.navigate('Connexion');
        })
    }

    resetNavigation() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'Motos' })
            ]
          })
          this.props.navigation.dispatch(resetAction)
          this.props.navigation.navigate('Connexion');
      }

      
    //key est un string permettant de retrouver l'item
    saveItem = (key, item) => {
        AsyncStorage.setItem(key, item)
    }

    loadItem = (key) => {
        AsyncStorage.getItem(key)
        .then((value) => {
            this.setState({image:value})
        })
        .done();
    }

    pickImage = async () => {
        //selection d'une image dans la galerie 
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 4],
        });
    
        
        if (!result.cancelled) {
          this.setState({ image: result.uri });
          this.saveItem("imageProfile", this.state.image)
        }

      };

      renderImageProfile = () => {
        if(this.state.image !== null){
            let {image} = this.state
            return(
            <TouchableHighlight onPress={this.pickImage}>
               <Image source={{ uri: image }} style={{ width: 150, height: 150, borderRadius:0 }} />
            </TouchableHighlight>
            );
        }
      }

    render(){
        let { image } = this.state;
        return(
            <View>
                <View>
                    {this.renderImageProfile()}
                </View>
                <View >
                <Button title = 'Dec' onPress = {this.signOut.bind(this)}/>
                </View>
            </View>
             )
    }
    }