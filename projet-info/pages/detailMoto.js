import  React from 'react';
import { Text, View, ProgressBar, ProgressViewIOS, TouchableOpacity, ScrollView, FlatList, RefreshControl, Image, Slider,Alert } from 'react-native';
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
import   {SocialBar} from '../components/socialBar'
import { RkTextInput } from 'react-native-ui-kitten/src/components/textinput/rkTextInput';
import TimerMixin from 'react-timer-mixin';
import {scale, scaleModerate, scaleVertical, scaleHonrizontal} from '../utils/scale';
import {NavigationActions} from 'react-navigation';
  

export default class PageDetailMoto extends React.Component{
    constructor(props){
        super(props)
        this.state = {
          dataEntretiens: [],
          dataList: [], 
          statut: [],
          refreshing : false,
          loadingPage : true,
          value : 0,
        }
        this.getRatioEntretien = this.getRatioEntretien.bind(this);
        this.getEntretien = this.getEntretien.bind(this);
        this.renderEntretien = this._renderEntretien.bind(this);
        this.remiseAZeroEntretien = this.remiseAZeroEntretien .bind(this);
    }

    componentWillMount()
    {
      setTimeout(() => this.setState({loadingPage: false}), 1500)
      this.getRatioEntretien()
      this.getEntretien()
    }

    getRatioEntretien =  () => {
      const { params } = this.props.navigation.state;
      const id = params ? params.id : null;
      let data = [];
      const entretienRef = firebase.database().ref().child('Entretiens')
      this.setState({loading : true})
      entretienRef.on('child_added', snapshot => {
        const NbKilometres = snapshot.val().NbKilomètres
        data.push({
            NbKilometres       
        })
        this.setState({dataEntretiens:data})
      })
    }

    getEntretien =() => { 
        const { params } = this.props.navigation.state;
        const userUid = firebase.auth().currentUser.uid
        const id = params ? params.id : null;
        let data = []
        let dataStatut = []
        const entretienRef = firebase.database().ref().child('users').child(userUid).child('Motos').child(id).child('Entretiens')
        this.setState({loading : true})

        entretienRef.on('child_added', snapshot => {
            data.push({
                'id' : snapshot.key, 
                'Name' : snapshot.val().Name,
                'NbKilometres' : snapshot.val().NbKilometres,
                'DateModif' : snapshot.val().DateModif,
            })
            this.setState({dataList:data})
            let statut = false;
            dataStatut.push({
              statut
            })
            this.setState({statut:dataStatut})
        })
    }


    setNbKilometresAllMoto = (nbKilometres) => {
      const { params } = this.props.navigation.state;
      const id = params ? params.id : null; 
      const userUid = firebase.auth().currentUser.uid

      const entretienRef = firebase.database().ref().child('users').child(userUid).child('Motos').child(id).child('Entretiens')
      let postData = [];
      entretienRef.on('child_added', snapshot => {
            postData.push({
                'DateModif' : snapshot.val().DateModif,
                'Name' : snapshot.val().Name,
                'NbKilometres' : snapshot.val().NbKilometres + nbKilometres,
              })
          })
        let updates = {};
        updates['users/' + userUid+ '/Motos/' + id + '/Entretiens/'] = postData;
        firebase.database().ref().update(updates)
        this._onRefresh()
        }

    remiseAZeroEntretien = (info) => {
      const entretienID = info.item.id;
      const userUid = firebase.auth().currentUser.uid
      const { params } = this.props.navigation.state;
      const id = params ? params.id : null;      
      let postData = {
          DateModif : new Date().toDateString(),
          Name: info.item.Name,
          NbKilometres : 0,
      }

      let updates = {};
      updates['users/' + userUid+ '/Motos/' + id + '/Entretiens/' + entretienID] = postData;
      firebase.database().ref().update(updates)
  }
    _keyExtractor(post) {
        return post.id;
        }

    _renderEntretien(info) {
        const { dataEntretiens, dataList, statut } = this.state;
        const id = info.item.id;
        let statutBis = statut;

        if(this.state.loadingPage)
        {
          return null
        }
        else {
          let color = 'rgba(44, 226, 3, 1)'
          if(dataList[id].NbKilometres/dataEntretiens[id].NbKilometres < 0.5) color = 'rgba(44, 226, 3, 1)'
          else if (dataList[id].NbKilometres/dataEntretiens[id].NbKilometres > 0.8) color = 'rgba(226, 3, 3, 1)'
          else color ='rgba(237, 114, 12, 1)'
          if(statut[id])
          {
          return (
              <TouchableOpacity
                        delayPressIn={70}
                        activeOpacity={0.8}
                        style = {styles.container}
                        onPress = {() => {statutBis[id] = false; this.setState({statut : statutBis})}}>
                          <View  style = {[styles.section, {paddingTop : 20}]}>
                      <RkText rkType='header4 hintColor' style = {{paddingBottom: 5}}>{info.item.Name}</RkText>
                      <Progress.Bar color = {color} borderColor = {'rgba(0,0,0,256)'}
                      progress={ dataList[id].NbKilometres/dataEntretiens[id].NbKilometres < 1 ? 
                      dataList[id].NbKilometres/dataEntretiens[id].NbKilometres : 1} width={200} height = {15} />
                  </View>
                </TouchableOpacity>
              )
            }
            else {
            return(
              <TouchableOpacity
                        delayPressIn={70}
                        activeOpacity={0.8}
                        style = {styles.container}
                        onPress = {() => {statutBis[id] = true; this.setState({statut : statutBis})}}>
                    <View  style = {[styles.section, {paddingTop : 20}]}>
                      <RkText rkType='header4 hintColor' style = {{paddingBottom: 5}}>{info.item.Name}</RkText>
                      <Progress.Bar color = {color} borderColor = {'rgba(0,0,0,256)'}
                                  progress={dataList[id].NbKilometres/dataEntretiens[id].NbKilometres < 1 ? 
                                                dataList[id].NbKilometres/dataEntretiens[id].NbKilometres : 1} width={200} height = {15} />
                      <View style = {{paddingTop : 10}}> 
                        <RkText rkType = 'secondary1 hintColor'>Nombre de kilomètres : {dataList[id].NbKilometres} / {dataEntretiens[id].NbKilometres}</RkText>
                        <RkText rkType = 'secondary1 hintColor'>Effectué(e) le {info.item.DateModif}</RkText>
                      </View>
                      <View style = {{paddingTop : 10}}> 
                          <RkButton rkType = 'outline'
                          onPress= {() => {
                            this.remiseAZeroEntretien(info);
                            this._onRefresh()}}>Effectué(e)</RkButton>
                      </View>
                    </View>
                </TouchableOpacity>
            )
          }
        }
      }
    resetNavigation(targetRoute) {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: targetRoute }),
        ],
      });
      this.props.navigation.dispatch(resetAction);
    }
          
    removeMoto = () => {
      const user = firebase.auth().currentUser
      const userUid = user.uid;
      const { params } = this.props.navigation.state;
      const id = params ? params.id : null; 
      const ref = firebase.database().ref().child('users').child(userUid).child('Motos')
      ref.child(id).remove();
      this.resetNavigation('Motos')
  }      

        render() {
          const { params } = this.props.navigation.state;
          const marque = params ? params.marque : null;
          const modele = params ? params.modele : null;
          const uriPhoto = params ? params.uri : null;
            return (
              <ScrollView style={styles.root}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}/>}>
                <RkCard rkType='article'>
                  <View style={[styles.header, styles.bordered]}>
                    <Image rkCardImg source={{ uri: uriPhoto}} style={{ width: 150, height: 150, borderRadius: 75,  marginBottom : 20 }} />
                    <RkText rkType='header2'>{marque}</RkText>
                    <RkText rkType='secondary2 h3'>{modele}</RkText>
                  </View>
                  <View rkCardContent>
                  <FlatList
                    data={this.state.dataList}
                    renderItem={this.renderEntretien}
                    keyExtractor={this._keyExtractor}
                    />
                    <View style = {{marginTop : 25}}>
                      <Slider   value={this.state.value}
                                onSlidingComplete={(value) => this.setState({value})} 
                                maximumValue = {250} step = {5}/>
                      <View style ={{flexDirection : 'row'}}>
                        <View>
                          <RkText>0</RkText>
                        </View>
                        <View style = {{marginLeft :'85%'}}>
                          <RkText>250</RkText>
                        </View>
                      </View>
                    </View>
                    <View style = {{flexDirection : 'row', paddingTop: 25, alignItems: 'center', justifyContent :'center'}}>
                        <RkButton   rkType = 'rounded outline'
                                    style = {{width : 200, height : 50}}
                                    onPress = {() => this.setNbKilometresAllMoto(this.state.value)}> Ajouter {this.state.value.toString()} kilomètres</RkButton>
                    </View>
                    <View style = {{paddingTop: 25, alignItems: 'center', justifyContent :'center'}}>
                    <RkButton  rkType = 'rounded'
                                    style = {styles.buttonRemove}
                                    onPress = {() =>  Alert.alert(
                                      'Supprimer le véhicule',
                                      '',
                                      [
                                        {text: 'Non, ne pas supprimer', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                        {text: 'Oui', onPress: () => this.removeMoto()},
                                      ]
                                    )}>Supprimer le véhicule</RkButton>
                    </View>
                  </View>
                  <View rkCardFooter>
                  </View>
                </RkCard>
              </ScrollView>
            )
          }
          
            _onRefresh() {
              this.setState({refreshing: true});
              this.getEntretien()
              this.getRatioEntretien()
              this.setState({refreshing: false});
            }

}

RkTheme.setType('RkButton', 'kilometres', {
  width: scaleHonrizontal(240),
  hitSlop: {top: 5, left: 5, bottom: 5, right: 5},
});


let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  title: {
    marginBottom: 5,
  },
  header: {
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 17
  },
  userInfo: {
    flexDirection: 'row',
    paddingVertical: 18,
  },
  bordered: {
    borderBottomWidth: 1,
    borderColor: theme.colors.border.base
  },
  section: {
    flex: 1,
    alignItems: 'center'
  },
  space: {
    marginBottom: 3
  },
  separator: {
    backgroundColor: theme.colors.border.base,
    alignSelf: 'center',
    flexDirection: 'row',
    flex: 0,
    width: 1,
    height: 42
  },
  buttons: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  button: {
    flex: 1,
    alignSelf: 'center'
  },
  buttonRemove : {
    backgroundColor : theme.colors.primary,
    width : 200, 
    height : 50
  }
}));

