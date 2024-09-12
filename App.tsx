/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import '@ethersproject/shims';
import 'react-native-get-random-values';
import { Buffer } from 'buffer';

// Polyfill Buffer globally
global.Buffer = Buffer;
import React, { useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  Button
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Routes from './Navigation/Routes';

type SectionProps = PropsWithChildren<{
  title: string;
}>;



function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [image,setImage]=useState('https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg')
  const [fullimage,setfullImage]=useState({})
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,flex:1,alignItems:'center'
  };
const launchLibrary=async()=>{
  ImagePicker.launchImageLibrary( {
    selectionLimit: 1,
    mediaType: 'photo',
    includeBase64: false,
    
  }, (response:any)=>{
    console.log('response',response)
    if(response.assets)
    {
      setImage(response.assets[0].uri)
      setfullImage(response.assets[0])
    }
  });
}
const postData = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/customers', {
      // Data you want to send in the body of the POST request
      name: 'value1',
      email: 'value2@gmail.com',
    });
    
    console.log('Response:', response.data);
  } catch (error:any) {
    console.error('Error posting data:', error.response ? error.response.data : error.message);
  }
};
const postImage = async () => {
  const formData = new FormData();
  formData.append('image', {
    uri: fullimage.uri, // Local file URI or image file path
    type: fullimage.type, // MIME type, adjust based on the file
    name: fullimage.fileName,  // File name with extension
  });
  console.log('formData',formData)

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Required for file uploads
      },
    });
    console.log('Image uploaded successfully:', response.data);
  } catch (error:any) {
    console.error('Error uploading image:', error.response ? error.response.data : error.message);
  }
};
  return (
   <Routes/>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
