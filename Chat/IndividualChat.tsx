import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const IndividualChat = (props: any) => {
  const [conversation, setConversation] = useState<any>(null);
  const [messageHistory, setMessageHistory] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const {xmtpClient, clientAddress} = props.route.params;
  // const xmtpClient = props?.route?.params?.clientXmtp;
  const startConversation = async () => {
    if (clientAddress && xmtpClient) {
      try {
        const conversation = await xmtpClient.conversations.newConversation(
          clientAddress,
        );
        setConversation(conversation);
        const messages = await conversation.messages();
        if (messages.length > 0) {
          setMessageHistory(messages.reverse());
        }
      } catch (error) {
        console.error('Failed to start conversation:', error);
      }
    }
  };
  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [messageHistory]);
  useEffect(() => {
    startConversation();
  }, [clientAddress]);
  useEffect(() => {
    const streamConversations = async () => {
      const unsubscribe = conversation.streamMessages((conversation: any) => {
        setMessageHistory(pre => [...pre, conversation]);
      });

      // Optional: return a cleanup function to unsubscribe when the component unmounts
      return () => {
        console.log('Unsubscribing from conversation stream');
        // unsubscribe();
      };
    };

    streamConversations();
  }, [conversation]);
  const onSendMessage = async () => {
    try {
      if (newMessage.trim()) {
        await conversation.send(newMessage);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: 'tomato'}}>
      <ScrollView ref={scrollViewRef}>
        {messageHistory.length > 0 &&
          messageHistory.map((message, index) => {
            return (
              <View
                style={
                  message?.senderAddress === clientAddress
                    ? styles.leftStyle
                    : styles.rightStyle
                }
                key={index}>
                <Text style={{color: 'white', fontSize: 15}}>
                  {message?.nativeContent?.text}
                </Text>
              </View>
            );
          })}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          margin: 10,
          borderRadius: 10,
          alignItems: 'center',
        }}>
        <TextInput
          value={newMessage}
          multiline
          onChangeText={t => setNewMessage(t)}
          style={{
            height: 40,
            backgroundColor: 'white',
            margin: 10,
            borderRadius: 10,
          }}
          placeholder="Type a message"
        />
        <TouchableOpacity
          style={{
            margin: 10,
            borderRadius: 10,
            right: 0,
            position: 'absolute',
            height: 40,
            width: 40,
            justifyContent:'center',
            alignItems:'center'
          }}
          onPress={onSendMessage}>
            <Image source={require('../Images/send-message.png')} style={{height: 30, width: 30}} />
          </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  leftStyle: {
    minHeight: 20,
    maxWidth: 200,
    backgroundColor: 'blue',
    marginLeft: 10,
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  rightStyle: {
    minHeight: 20,
    maxWidth: 200,
    backgroundColor: 'green',
    marginRight: 10,
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-end',
  },
});
export default IndividualChat;
