import React from 'react';
import {
  View,
  Image,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {
  RkButton,
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkTheme,
  RkAvoidKeyboard
} from 'react-native-ui-kitten';
import {scale, scaleModerate, scaleVertical, scaleHonrizontal} from '../utils/scale';
import { NavigationActions } from 'react-navigation';
import * as firebase from 'firebase';

export default class Inscription extends React.Component {

static navigationOptions = {
  header: null,
}
  constructor(props){
    super(props)
    this.state = {
        id : '',
        password :'',
        confirmPassword:'',
        error:'',
        loading: false,
    }
    signUp = this.signUp.bind(this)
}

stringIsEmpty = (string) => {
    if(string !== '') return false;
    else return true;
  }

stringsAreEquals = (string, string2) => {
    if(string !== string2) return false;
    else return true;
}

resetNavigation(targetRoute) {
  const resetAction = NavigationActions.reset({
    index: 0,
    key: null,
    actions: [
      NavigationActions.navigate({ routeName: targetRoute }),
    ],
  });
  this.props.navigation.dispatch(resetAction);
}

signUp = () => {
    this.setState({error: '', errorID: ''})
    if(!this.stringsAreEquals(this.state.password, this.state.confirmPassword))
    {
        this.setState({error : "Les mots de passe ne sont pas identiques"})
        return;
    }

    this.setState({loading : true})
    const {id, password} = this.state;
    firebase.auth()
    .createUserWithEmailAndPassword(id, password)
    .then(() => { this.setState({ error: '', loading: false });
                //Alert.alert("Inscription réussie !");
                //this.props.navigation.goBack();
                firebase.auth().signInWithEmailAndPassword(id, password),
                this.resetNavigation('UserLogged')
    })
    .catch((error) => {
        const errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode == 'auth/invalid-email') {
            errorMessage = "Saisie d'email invalide !"
            this.setState({error: errorMessage})
        } 
        else if (errorCode == 'auth/email-already-in-use'){
            errorMessage = "Cet utilisateur existe déjà"
            this.setState({error: errorMessage})
        }
        else if(errorCode == 'auth/weak-password'){
            errorMessage = "La sécurité de votre mot de passe est trop faible"
            this.setState({error : errorMessage})
        }
        this.setState({loading : false})
    })
}

  render() {
    return (
      <KeyboardAwareScrollView     
      onStartShouldSetResponder={ (e) => true}
      //onResponderRelease={ (e) => Keyboard.dismiss()}
      behavior={"padding"}
      contentContainerStyle={styles.screen}>
        <View style={{alignItems: 'center', marginTop: scaleVertical(75)}}>
          {/*renderIcon()*/}
          <RkText rkType='h1'>Inscription</RkText>
        </View>
        <View style={styles.content}>
          <View>
            <RkTextInput rkType='rounded' placeholder='Email'
                          keyboardType = 'email-address'
                         onChangeText = {(text) => this.setState({id : text.toLowerCase()})}
                         returnKeyType = {"next"}
                         />

            <RkTextInput rkType='rounded' placeholder='Mot de passe' secureTextEntry={true}
                         onChangeText = {(text) => this.setState({password : text})}
                         returnKeyType = {"next"}
                         ref='SecondInput'
                        />
            <RkTextInput rkType='rounded' placeholder='Confirmer mot de passe' secureTextEntry={true}
                         onChangeText = {(text) => this.setState({confirmPassword : text})}
                         returnKeyType = {"done"}
                         />
            <View style = {{alignItems:'center'}}>
              <RkText rkType='light h4 danger'>{this.state.error}</RkText>
            </View>            
            <RkButton style={styles.save} 
                      rkType='rounded inscription'
                      onPress={this.signUp}>Inscription</RkButton>
            </View>
          <View style={styles.footer}>
            <View style={styles.textRow}>
              <RkText rkType='primary3'>Déjà un compte?</RkText>
              <RkButton rkType='clear' onPress={() => this.props.navigation.goBack()}>
                <RkText rkType='header6'> Connectez-vous ici!</RkText>
              </RkButton>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: theme.colors.screen.base
  },
  image: {
    marginBottom: 10,
    height:scaleVertical(77),
    resizeMode:'contain'
  },
  content: {
    marginTop: scaleVertical(70),
    justifyContent: 'space-between'
  },
  save: {
    marginVertical: 20
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: 24,
    marginHorizontal: 24,
    justifyContent: 'space-around'
  },
  footer:{
    justifyContent:'flex-end'
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
}));

RkTheme.setType('RkButton', 'inscription', {
  width: scaleHonrizontal(320),
  hitSlop: {top: 5, left: 5, bottom: 5, right: 5},

});