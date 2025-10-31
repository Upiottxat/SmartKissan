import React from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';


const SignIn = () => {


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.logoContainer}>
        {
          //Logo container
        }
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Smart Kissan App Logo"
        />
        <Text style={styles.logoText}>Smart Kissan </Text>
      </View>

      {/* Form container */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>📞</Text>
          <TextInput
            placeholder="Enter your 10-digit mobile number"
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={10}
            placeholderTextColor="#888" 
          ></TextInput>
        </View>

        <TouchableOpacity style={styles.submitButton} activeOpacity={0.7}>
          <Text style={styles.submitButtonText}>Get OTP</Text>
        </TouchableOpacity>

        <View style={{flex: 1}} />

        {/* Social Sign In Section */}
        <View style={styles.socialLoginContainer}>
          <Text style={styles.orText}>Or continue with</Text>

    
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
            <Text style={styles.socialIcon}>🇬</Text>
            <Text style={styles.socialButtonText}>Sign in with Google</Text>
          </TouchableOpacity>

         
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
         
            <Text style={styles.socialIcon}>📧</Text>
            <Text style={styles.socialButtonText}>Sign in with Email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    
    width: 250,
    height: 250,
  },
  logoContainer: {
    marginTop: 20, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
    fontWeight: '600', 
    letterSpacing: 2,
    color: 'green',
    textShadowColor: 'darkgreen',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
    elevation: 5,
    fontFamily: 'Runtime', 
    marginTop: -20, 
  },
  formContainer: {
    marginTop: 40, 
    width: '90%',
    flex: 1,
    alignItems: 'center',
    
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#F9F9F9', 
  },
 
  inputIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  
  input: {
    flex: 1, 
   
    borderWidth: 0,
    paddingVertical: 15, 
    fontSize: 16,
    fontFamily: 'SpaceMono', 
    color: '#333', 
  },
 
  submitButton: {
    width: '100%',
    backgroundColor: 'green', 
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
   
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
  
  socialLoginContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  orText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
    fontFamily: 'SpaceMono',
  },
 
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'green', 
    backgroundColor: '#fff', 
    marginBottom: 10,
  },
 
  socialButtonText: {
    color: 'green', 
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SpaceMono',
  },
  
  socialIcon: {
    fontSize: 20,
    marginRight: 12,
  },
});

export default SignIn;
