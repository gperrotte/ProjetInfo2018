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
    RefreshControl
} from 'react-native';
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

import * as firebase from 'firebase';
import { database } from 'firebase';
import {SocialBar} from '../components/socialBar'
///import RNFetchBlob from 'react-native-fetch-blob'


// Prepare Blob support
/*const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob*/

export default class PageMoto extends React.Component{
    static navigationOptions = {
        title: 'Mes Motos',
      };

    constructor(props){
        super(props)
        this.state = {
            status: false,
            marque: '',
            modele: '',
            rootRef: firebase.database().ref(),
            motoRef: firebase.database().ref().child('Motos'),
            dataList : [],
            image :'',
            refreshing: false,
        }
        this.renderItem = this._renderItem.bind(this)
        this.renderAddMotoForm = this.renderAddMotoForm.bind(this)
    }


   /* uploadImage(uri, mime = 'image/jpeg') {
        return new Promise((resolve, reject) => {
          const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
          let uploadBlob = null
    
          const imageRef = FirebaseClient.storage().child('images')
    
          fs.readFile(uploadUri, 'base64')
            .then((data) => {
              return Blob.build(data, { type: `${mime};BASE64` })
            })
            .then((blob) => {
              uploadBlob = blob
              return imageRef.put(blob, { contentType: mime })
            })
            .then(() => {
              uploadBlob.close()
              return imageRef.getDownloadURL()
            })
            .then((url) => {
              resolve(url)
            })
            .catch((error) => {
              reject(error)
          })
        })
      }*/






    _onRefresh() {
        this.setState({refreshing: true});
        this.getMoto();
        this.setState({refreshing: false});
      }


    addMoto = (marque, modele) => { 
        const user = firebase.auth().currentUser
        const userEmail = user.email

        this.state.motoRef.push({
            Marque : marque.toString(),
            Modele : modele.toString(),
            User : userEmail.toString(),
            image : '',
            DateAjout : new Date().toDateString(),
            Entretiens: {
                0 : {
                    Name : "Vidange",
                    NbKilometres : 0,
                    DateModif : new Date().toDateString(),
                },
                1 : {
                    Name : "Pression", 
                    NbKilometres : 0,
                    DateModif : new Date().toDateString(),
                },
                2 : {
                    Name : "Graissage chaine", 
                    NbKilometres : 0,
                    DateModif : new Date().toDateString(),
                },
            }
        })
        this.setState({status: false})
        this._onRefresh();

    }
_keyExtractor(post) {
    return post.id;
    }

pickImage = async () => {
    //selection d'une image dans la galerie 
    let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 4],
    });

    
    if (!result.cancelled) {
        //this.uploadImage(response.uri)
        //.then(url => { alert('uploaded'); this.setState({image_uri: url}) })
        //.catch(error => console.log(error))
        this.saveItem("imageProfile", this.state.image)
    }

    };

    renderImageProfile = () => {
    if(this.state.image !== ''){
        let {image} = this.state
        return(
        <TouchableHighlight onPress={this.pickImage}>
            <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius:0 }} />
        </TouchableHighlight>
        );
    }
    else{
        const sourceImage = require('../img/addImage.png')
        return(
        <TouchableHighlight onPress={this.pickImage}>
            <Image source={sourceImage} style={{ width: 100, height: 100, borderRadius:0 }} />
        </TouchableHighlight>)
    }
    }
    
    

_renderItem(info) {
    const imgSource = require('../img/addImage.png')
    const renderImageProfile = this.renderImageProfile();
    //const {image} = this.state
    return (
        <TouchableOpacity
          delayPressIn={70}
          activeOpacity={0.8}
          onPress={() => this.props.navigation.navigate('DetailMoto', {
              id: info.item.id,
              marque: info.item.Marque,
              modele : info.item.Modele})}
          >
            <RkCard rkType='horizontal' style={styles.card}>
            {renderImageProfile}
  
            <View rkCardContent>
              <RkText numberOfLines={1} rkType='header6'>{info.item.Marque + ' ' +info.item.Modele}</RkText>
              <RkText rkType='secondary6 hintColor'>{`${info.item.Modele} ${info.item.Modele}`}</RkText>
              <RkText style={styles.post} numberOfLines={2} rkType='secondary1'>{info.item.Modele}</RkText>
            </View>
            <View rkCardFooter>
              <SocialBar rkType='space' showLabel={true}/>
            </View >
          </RkCard>
        </TouchableOpacity>
      )
    }

    componentWillMount()
    {
        this.getMoto()
    }


    getMoto = () => { 
        let data = []
        const motoRef = firebase.database().ref().child('Motos')
        motoRef.on('child_added', snapshot => {
            data.push({
                'id' : snapshot.key, 
                'Marque' : snapshot.val().Marque,
                'Modele' : snapshot.val().Modele,

            })
            this.setState({dataList:data})
        })
    }

    updateMoto = (marque, modele, user) => {
        const key = '-L5md9uJ89ZIMNfDg7IG';
        let postData = {
            Modele : modele,
            Marque : marque,
            User : user,
        }

        let updates = {};
        updates['Motos/' + key] = postData;
        firebase.database().ref().update(updates)
    }

    renderAddMotoForm = () => {
        if(this.state.status)
        {
        return(
            <TouchableOpacity
                    delayPressIn={70}
                    activeOpacity={0.8}
                    style = {styles.container}
                    onPress = {()=> this.setState({status: !this.state.status})}>
                  <RkCard rkType='horizontal-ajout' style={styles.card}>
                      <View rkCardContent>
                          <RkText numberOfLines={1} rkType='header6' style = {{textAlign: 'center'}}>Ajoutez une moto</RkText>
                          
                          <RkTextInput rkType ='basic' label='Marque'
                          color = 'gray'
                          onChangeText = {(text) => this.setState({marque: text})}/>
                          <RkTextInput rkType ='basic' label='Modele'
                          onChangeText = {(text) => this.setState({modele: text})}/>
                          <RkButton rkType = 'rounded save' onPress = {this.addMoto.bind(this,this.state.marque, this.state.modele)} >Sauvegarder</RkButton>
                      </View>
                </RkCard>
              </TouchableOpacity>
        )}
        else {
            return(
                <TouchableOpacity
                    delayPressIn={70}
                    activeOpacity={0.8}
                    style = {styles.container}
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
    return (
      <ScrollView 
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)}/>}>
        <FlatList
          data={this.state.dataList}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
          style={styles.container}/>
          {renderAddMotoForm}
      </ScrollView>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
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


/*class RenderMoto extends React.Component {
        render(){
            return(
                <View>
                    <View style={{flex: 1, flexDirection : 'row'}}>
                        <Text> {this.props.marque} </Text>
                    </View>

                </View>
            )
        }
}


    renderAddMotoForm = () => {
        if(this.state.status)
        {
        return(
            <View>
                <View style={{flex: 1, flexDirection : 'row'}}>
                <FormLabel>Marque</FormLabel>
                <FormInput placeholder = 'Honda' onChangeText = {(text) => this.setState({marque: text})}/>
                    </View>
            <View style={{flex: 1, flexDirection : 'row'}}>
                <FormLabel>Modele</FormLabel>
                <FormInput placeholder = 'CB500'onChangeText = {(text) => this.setState({modele: text})}/>
            </View>
            <Button title ="Sauvegarder" 
                    style = {{ marginTop : "5%"}} 
                    onPress = {this.addMoto.bind(this,this.state.marque, this.state.modele)}/>
            </View>
        )}
        else return null
    }

    render(){
        
        return(
            <View>
                <ScrollView>
                    <TouchableOpacity onPress = {() => this.setState({status: !this.state.status})}>
                        <View style={{flex: 1, flexDirection : 'row'}}>
                            <FormLabel style = {{marginRight: '70%' }}> + Ajouter une moto ! </FormLabel>
                        </View>
                            {this.state.status ? this.renderAddMotoForm() : null}
                        </TouchableOpacity> 
                        <View>
                            <Button onPress = {this.updateMoto.bind(this, 'Suzuki', 'GSXR', 'blabla@example.fr')}/>
                        </View>              
                </ScrollView>         
            </View>
        )
    }
}*/
