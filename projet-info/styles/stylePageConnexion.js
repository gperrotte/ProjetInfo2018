import { StyleSheet, ViewStyle } from 'react-native';

const stylePageConnexion = StyleSheet.create({
    rootContainer: {
        flex: 1
    },

    logoContainer: {
        flex: 0.4,
        backgroundColor: '#426ef0'
    },

    inputContainer: {
        flex: 0.6,
        backgroundColor: '#fff'
    },

    connexionButtonContainer: {
        justifyContent: 'center',  
    },

    inscriptionButtonContainer: {
        justifyContent: 'center',
     },


    textInput: {
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 0.5,
        marginLeft : '5%',
        marginRight : '5%',
        marginBottom: '3%',
        fontSize : 18,
    },
});


export default stylePageConnexion;