import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

const SignIn = () => {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                {
                    //Logo container 
                }
                <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                <Text style={styles.logoText}>Smart Kissan </Text>
            </View>


        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    signInOptions: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        marginTop: 10


    },
    logo: {
        width: 300,
        height: 300
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 36,
        fontWeight: 600,
        letterSpacing: 2,
        color: "green",
        textShadowColor:"darkgreen",
        textShadowOffset:{width:2,height:1},
        textShadowRadius:4,
        elevation:5
    }

})

export default SignIn       