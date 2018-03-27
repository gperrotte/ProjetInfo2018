import  React from 'react';
import { Text, View, ProgressBar, ProgressViewIOS, TouchableOpacity, ScrollView, FlatList, RefreshControl } from 'react-native';
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
  
export default class PageDetailMoto extends React.Component{
    constructor(props){
        super(props)
        this.state = {
          dataEntretiens: [],
          dataList: [], 
          statut: [],
          refreshing : false,
        }
        this.getRatioEntretien = this.getRatioEntretien.bind(this);
        this.getEntretien = this.getEntretien.bind(this);
        this.renderEntretien = this._renderEntretien.bind(this);
        this.remiseAZeroEntretien = this.remiseAZeroEntretien .bind(this);

    }

    componentWillMount()
    {
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
        const id = params ? params.id : null;
        let data = []
        let dataStatut = []
        const entretienRef = firebase.database().ref().child('Motos').child(id).child('Entretiens')
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
      const motoRef = firebase.database().ref().child('Motos').child(id).child('Entretiens')
      let postData = [];
      motoRef.on('value', snapshot => {
          snapshot.forEach(childSnapshot => {
              postData.push({
                  'DateModif' : new Date().toDateString(),
                  'Name' : childSnapshot.val().Name,
                  'NbKilometres' : nbKilometres,
              })
          })
        let updates = {};
        updates['Motos/' + id + '/Entretiens/'] = postData;
        firebase.database().ref().update(updates)
      })


    }



    remiseAZeroEntretien = (info) => {
      const entretienID = info.item.id;
      const { params } = this.props.navigation.state;
      const id = params ? params.id : null;      
      let postData = {
          DateModif : new Date().toDateString(),
          Name: info.item.Name,
          NbKilometres : 0,
      }

      let updates = {};
      updates['Motos/' + id + '/Entretiens/' + entretienID] = postData;
      firebase.database().ref().update(updates)
  }
    _keyExtractor(post) {
        return post.id;
        }

    _renderEntretien(info) {
        const { dataEntretiens, dataList, statut } = this.state;
        const id = info.item.id;
        let statutBis = statut;

        if(dataEntretiens[id] == null || dataList[id] == null)
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
                      <Progress.Bar color = {color} 
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
                      <Progress.Bar color = {color}
                                  progress={dataList[id].NbKilometres/dataEntretiens[id].NbKilometres < 1 ? 
                                                dataList[id].NbKilometres/dataEntretiens[id].NbKilometres : 1} width={200} height = {15} />
                      <View style = {{paddingTop : 10}}> 
                        <RkText rkType = 'secondary1 hintColor'>Nombre de kilomètres : {dataList[id].NbKilometres} / {dataEntretiens[id].NbKilometres}</RkText>
                        <RkText rkType = 'secondary1 hintColor'>Effectué(e) le {info.item.DateModif}</RkText>
                      </View>
                      <View style = {{paddingTop : 10}}> 
                          <RkButton onPress= {() => {
                            this.remiseAZeroEntretien(info);
                            this._onRefresh()}}>Effectué(e)</RkButton>
                      </View>
                    </View>
                </TouchableOpacity>
            )
          }
        }
      }
        


        render() {
          const { params } = this.props.navigation.state;
          const marque = params ? params.marque : null;
          const modele = params ? params.modele : null;
            return (
              <ScrollView style={styles.root}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}/>}>
                <RkCard rkType='article'>
                  <View style={[styles.header, styles.bordered]}>
                    {/*<Image rkCardImg source={this.data.photo}/>*/}
                    <RkText rkType='header2'>{marque + ' ' + modele}</RkText>
                  </View>
                  <View rkCardContent>
                  <FlatList
                    data={this.state.dataList}
                    renderItem={this.renderEntretien}
                    keyExtractor={this._keyExtractor}
                    //style={styles.container}
                    />
                    <View style = {{flexDirection : 'row', paddingTop: 25, alignItems: 'center', justifyContent :'center'}}>
                        <RkButton  style = {{width : 200, height : 50}}
                        onPress = {() => this.setNbKilometresAllMoto(300)}> Mettre à jours les kilomètres</RkButton>
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
  }
}));


/* React from 'react';
 {
  View,
  ScrollView,
} from 'react-native';
 {
  RkText,
  RkButton, RkStyleSheet
} from 'react-native-ui-kitten';
 {Avatar} from '../../components/avatar';
 {Gallery} from '../../components/gallery';
 {data} from '../../data/';
 formatNumber from '../../utils/textUtils';

export class ProfileV1 extends React.Component {
  static navigationOptions = {
    title: 'User Profile'.toUpperCase()
  };

  constructor(props) {
    super(props);
    let {params} = this.props.navigation.state;
    let id = params ? params.id : 1;
    this.user = data.getUser(id);
  }

  render() {
    let name = `${this.user.firstName} ${this.user.lastName}`;
    let images = this.user.images;
    return (
      <ScrollView style={styles.root}>
        <View style={[styles.header, styles.bordered]}>
          <Avatar img={this.user.photo} rkType='big'/>
          <RkText rkType='header2'>{name}</RkText>
        </View>
        <View style={[styles.userInfo, styles.bordered]}>
          <View style={styles.section}>
            <RkText rkType='header3' style={styles.space}>{this.user.postCount}</RkText>
            <RkText rkType='secondary1 hintColor'>Posts</RkText>
          </View>
          <View style={styles.section}>
            <RkText rkType='header3' style={styles.space}>{formatNumber(this.user.followersCount)}</RkText>
            <RkText rkType='secondary1 hintColor'>Followers</RkText>
          </View>
          <View style={styles.section}>
            <RkText rkType='header3' style={styles.space}>{this.user.followingCount}</RkText>
            <RkText rkType='secondary1 hintColor'>Following</RkText>
          </View>
        </View>
        <View style={styles.buttons}>
          <RkButton style={styles.button} rkType='clear link'>FOLLOW</RkButton>
          <View style={styles.separator}/>
          <RkButton style={styles.button} rkType='clear link'>MESSAGE</RkButton>
        </View>
        <Gallery items={images}/>
      </ScrollView>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
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
  }
}));*/