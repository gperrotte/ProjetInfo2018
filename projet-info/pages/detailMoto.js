import React from 'react';
import { Text, View, ProgressBar, ProgressViewIOS, TouchableOpacity, ScrollView, FlatList } from 'react-native';
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
  import {SocialBar} from '../components/socialBar'
  
export default class PageDetailMoto extends React.Component{
    constructor(props){
        super(props)
        this.state = {
          dataEntretiens: [],
          dataList: [], 
          statut: [],
        }
        this.getRatioEntretien = this.getRatioEntretien.bind(this);
        this.getEntretien = this.getEntretien.bind(this);
        this.renderEntretien = this._renderEntretien.bind(this);

    }

    componentDidMount()
    {
      this.getRatioEntretien()
      this.getEntretien()
    }


    getRatioEntretien =  () => {
      const { params } = this.props.navigation.state;
      const id = params ? params.id : null;
      let data = [];
      const entretienRef = firebase.database().ref().child('Entretiens')

      entretienRef.on('child_added', snapshot => {
        const NbKilometres = snapshot.val().NbKilomètres
        data.push({
            NbKilometres       
        })
        this.setState({dataEntretiens:data})
      })
    }

    getEntretien = () => { 
        const { params } = this.props.navigation.state;
        const id = params ? params.id : null;
        let data = []
        let dataStatut = []
        const entretienRef = firebase.database().ref().child('Motos').child(id).child('Entretiens')
        entretienRef.on('child_added', snapshot => {
            data.push({
                'id' : snapshot.key, 
                'Name' : snapshot.val().Name,
                'NbKilometres' : snapshot.val().NbKilometres,
            })
            this.setState({dataList:data})
            let statut = false;
            dataStatut.push({
              statut
            })
            this.setState({statut:dataStatut})
        })
    }


    _keyExtractor(post) {
        return post.id;
        }

    _renderEntretien(info) {
        const { dataEntretiens, dataList, statut } = this.state;
        const id = info.item.id;
        let statutBis = statut;
      
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
                  <Progress.Bar progress={dataEntretiens.length < dataList.length ? 0 : dataList[id].NbKilometres/dataEntretiens[id].NbKilometres} width={200} height = {15} />
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
                  <RkText rkType='header4 hintColor' style = {{paddingBottom: 5}}>Info</RkText>
                  <Progress.Bar progress={dataEntretiens.length < dataList.length ? 0 : dataList[id].NbKilometres/dataEntretiens[id].NbKilometres} width={200} height = {15} />
              </View>
              <View style = {{flexDirection : row, paddingTop : 10}}> 
                  <RkButton rkType = "rouded"></RkButton>
                  <RkButton rkType = "rouded"></RkButton>
              </View>
            </TouchableOpacity>
        )

      }
      }
        


        render() {
          const { params } = this.props.navigation.state;
          const marque = params ? params.marque : null;
          const modele = params ? params.modele : null;
            return (
              <ScrollView style={styles.root}>
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
                  </View>
                  <View rkCardFooter>
                  </View>
                </RkCard>
              </ScrollView>
            )
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


/*import React from 'react';
import {
  View,
  ScrollView,
} from 'react-native';
import {
  RkText,
  RkButton, RkStyleSheet
} from 'react-native-ui-kitten';
import {Avatar} from '../../components/avatar';
import {Gallery} from '../../components/gallery';
import {data} from '../../data/';
import formatNumber from '../../utils/textUtils';

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