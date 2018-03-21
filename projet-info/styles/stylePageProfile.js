import { StyleSheet, ViewStyle } from 'react-native';

const stylePageProfile = StyleSheet.create({
    rootContainer: {
        flex: 1
    },

    imageContainer: {
        flex: 0.4,
        backgroundColor: '#426ef0',
        alignContent :'center',
        alignItems : 'center',
        justifyContent : 'center'
    },

    detailsContainer: {
        flex: 0.6,
        backgroundColor: '#fff'
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


export default stylePageProfile;