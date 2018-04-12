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
    ActivityIndicator
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
import Swipeout from 'react-native-swipeout';
import * as firebase from 'firebase';
import { database } from 'firebase';
import {SocialBar} from '../components/socialBar';
import TimerMixin from 'react-timer-mixin';



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
            dataList : [],
            image :'',
            refreshing: false,
            timer : 0,
            loading : false,
        }
        this.renderItem = this._renderItem.bind(this)
        this.renderAddMotoForm = this.renderAddMotoForm.bind(this)
        this.keyExtractor = this._keyExtractor.bind(this)
    }

    componentWillMount()
    {
        this.setState({loading: true})
        if(firebase.auth().currentUser)
        { 
            this.getMoto()
        }
        let timer = setTimeout(() => this.setState({loading: false}), 1500)

    }
    
    componentDidMount()
    {
        clearInterval(this.state.timer);
    }

    _onRefresh() {
        this.setState({refreshing: true});
        this.getMoto();
        this.setState({refreshing: false});
      }


    addMoto = (marque, modele) => { 
        const user = firebase.auth().currentUser
        const userEmail = user.email
        const userUid = user.uid
        const ref = firebase.database().ref().child('users').child(userUid).child('Motos')
        ref.push({
            Marque : marque.toString(),
            Modele : modele.toString(),
            Uri : 'undefined',
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


    
    removeMoto = (info) => {
        const user = firebase.auth().currentUser
        const userUid = user.uid
        const ref = firebase.database().ref().child('users').child(userUid).child('Motos')
        ref.child(info.item.id).remove();
        this._onRefresh();
    }
    
    pickImage = async (info) => {
        //selection d'une image dans la galerie 
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 4],
        });
        
        if (!result.cancelled) {
           this.updateUri(info, result.uri)
        }
    };

    updateUri = (info, uri) => {
         const user = firebase.auth().currentUser
        const userUid = user.uid
        const ref = firebase.database().ref().child('users').child(userUid).child('Motos').child(info.item.id)
        let postData = uri;
          let updates = {};
          updates['users/'+ userUid + '/Motos/' + info.item.id + '/Uri/'] = postData;
          firebase.database().ref().update(updates)
          this.getMoto()
    }

_renderItem(info) {
    const imgSource = require('../img/addImage.png')
    let swipeBtns = [{
        text: 'Supprimer',
        backgroundColor: 'red',
        onPress: () =>  Alert.alert(
            'Supprimer le véhicule',
            '',
            [
              {text: 'Non, ne pas supprimer', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Oui', onPress: () => this.removeMoto(info)},
            ]
          )
      }];
    return (
        <Swipeout right = {swipeBtns}
         style={styles.card}
         autoClose = {true}
         buttonWidth = {110}>
            <TouchableOpacity
            delayPressIn={70}
            activeOpacity={0.8}
            onPress={() => this.props.navigation.navigate('DetailMoto', {
                id: info.item.id,
                marque: info.item.Marque,
                modele : info.item.Modele,
                uri : info.item.Uri})}
            >
            <RkCard rkType='horizontal' >
                <ImageMoto info = {info} uri = {info.item.Uri} changeImage = {() => this.pickImage(info)}/>
                <View rkCardContent>
                            <RkText numberOfLines={1} rkType='header6'>{info.item.Marque}</RkText>
                            <RkText rkType='secondary1 hintColor'>{info.item.Modele}</RkText>
                            <RkText style={styles.post} numberOfLines={2} rkType='secondary1'>Ajouté le {info.item.DateAjout}</RkText>
                </View>
                <View rkCardFooter>
                    <SocialBar rkType='space' showLabel={true}/>
                </View >
          </RkCard>
        </TouchableOpacity>
        </Swipeout>
      )
    }




    getMoto = () => {
        this.setState({dataList: []})
        let data = [];
        let numberOfMoto = this.state;
        const user = firebase.auth().currentUser
        const userUid = user.uid
        const ref = firebase.database().ref().child('users').child(userUid).child('Motos')
        ref.on('child_added', snapshot => {
            if(snapshot.numChildren() > 0)
            {
                data.push({
                    'id' : snapshot.key, 
                    'Marque' : snapshot.val().Marque,
                    'Modele' : snapshot.val().Modele,
                    'DateAjout' : snapshot.val().DateAjout,
                    'Uri' : snapshot.val().Uri

                })
                this.setState({dataList:data})
            }
            else
            {
                this.setState({dataList:[]})
            }
        })
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
                          <RkButton rkType = 'rounded save' onPress = {() => {this.addMoto(this.state.marque, this.state.modele);
                             this.setState({marque:  '', modele: ''}) }}>Sauvegarder</RkButton>
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
        if(this.state.loading)
        {
            return( <View style = {styles.iconLoading}><ActivityIndicator  size="large"  /></View> )
        }
        else
        {
            const renderAddMotoForm = this.renderAddMotoForm();
            if(this.state.dataList[0] == 'undefined')
            {
            return(
            <ScrollView 
            refreshControl={
                <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}/>}
                style = {styles.root}
            >
                {renderAddMotoForm}
            </ScrollView>)
            }
            else
            {
                return (
                <ScrollView 
                refreshControl={
                    <RefreshControl
                    refreshing={false}
                    onRefresh={this._onRefresh.bind(this)}/>}
                    style = {styles.root}>
                    <FlatList
                    data={this.state.dataList}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    style={[styles.container, styles.root]}/>
                    {renderAddMotoForm}
                </ScrollView>
            )
            }
        }
    }
}


class ImageMoto extends React.Component{
    constructor(props){
        super(props)
    }

    render() 
    {
        if(this.props.uri !== 'undefined'){
            return(
            <TouchableHighlight onPress={this.props.changeImage}>
                <Image source={{ uri: this.props.uri}} style={{ width: 100, height: 100, borderRadius:0 }} />
            </TouchableHighlight>
            );
        }
        else{
            const sourceImage = require('../img/addImage.png')
            return(
            <TouchableHighlight onPress={this.props.changeImage}>
                <Image source={sourceImage} style={{ width: 100, height: 100, borderRadius:0 }} />
            </TouchableHighlight>
            );
        }
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
      marginTop: 13
    },
    iconLoading: {
        flex: 1,
        justifyContent: 'center'
      },
  }));
