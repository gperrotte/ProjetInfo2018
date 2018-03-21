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

export default class PageCarnet extends React.Component{
    constructor(props){
        super(props)
    }

        render() {
            return (
                <Text>Page carnet</Text>
                        )
          }
}

