import React, {useState, useEffect, useCallback} from 'react';
import {ethers, Wallet} from 'ethers';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Client, sign} from '@xmtp/react-native-sdk';
import {ALCHEMY_PROVIDER_URL} from '@env';
function ChatScreen(props: any): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [peerAddressList, setPeerAddressList] = useState<string[]>([]);
  const [privateKey, setPrivateKey] = useState<string>('');

  const initXmtp = useCallback(async () => {
    if (wallet) {
      try {
        const xmtp = await Client.create(wallet, {
          env: 'production',
        });
        setXmtpClient(xmtp);
      } catch (error) {
        setIsLoading(false);
        console.error('Failed to initialize XMTP client:', error);
      }
    }
  }, [wallet]);
  const fetchConversations = useCallback(async () => {
    if (xmtpClient) {
      try {
        const conversations = await xmtpClient.conversations.list();
        const peerList = conversations.map(conversation => {
          return conversation.peerAddress;
        });
        setPeerAddressList(peerList);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error('Failed to fetch messages:', error);
      }
    }
  }, [xmtpClient]);
  const initWallet = async () => {
    if(privateKey){try {
      setIsLoading(true);
      const ethProvider = await new ethers.providers.JsonRpcProvider(
        ALCHEMY_PROVIDER_URL,
      );
      const wallet = await new Wallet(privateKey, ethProvider);
      setWallet(wallet);
    } catch (e) {
      Alert.alert('Invalid Private Key');
      setIsLoading(false);
      console.log(e);
    }}
    else{
      Alert.alert('Please enter your private key to access the chat');
    }
  };
  const handleWalletClick = async (chat: any) => {
    props.navigation.navigate('IndividualChat', {
      clientAddress: chat,
      xmtpClient: xmtpClient,
    });
  };

  // useEffect(() => {
  //   initWallet();
  // }, []);
  useEffect(() => {
    if (wallet && !xmtpClient) {
      initXmtp();
    }
  }, [initXmtp, wallet, xmtpClient]);
  useEffect(() => {
    if (wallet && xmtpClient) {
      fetchConversations();
    }
  }, [fetchConversations, wallet, xmtpClient]);

  return (
    <View style={{height: '100%', width: '100%', backgroundColor: '#FFF'}}>
      {!privateKey || !wallet ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 15, fontWeight: 'bold', color: 'tomato'}}>
            Please enter your private key to access the chat
          </Text>
          {/* <View style={{width: '100%', alignItems: 'center'}}> */}
            <TextInput
              style={{
                marginTop: 10,
                padding: 10,
                borderRadius: 5,
                width: '80%',
                backgroundColor: '#fff',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.27,
                shadowRadius: 4.65,

                elevation: 6,
              }}
              onChangeText={text => setPrivateKey(text)}
              placeholder="Paste Your Private Key"
            />
          {/* </View> */}
          <TouchableOpacity style={{marginTop: 20,width:120,height:35,borderRadius:5,justifyContent:'center',alignItems:'center',backgroundColor:'tomato'}} onPress={initWallet} >
            <Text>Submit</Text>
          </TouchableOpacity>
        </View>
      ) : isLoading ? (
        <ActivityIndicator size="large" color={'blue'} />
      ) : (
        <ScrollView style={{flex: 1, backgroundColor: '#FFF', padding: 10}}>
          {peerAddressList.length > 0 &&
            peerAddressList.map((peer, index) => {
              return (
                <TouchableOpacity
                  onPress={() => handleWalletClick(peer)}
                  key={index}
                  style={[
                    {
                      flexDirection: 'row',
                       padding: 10,
                      backgroundColor: '#FFF',
                      margin: 5,
                      borderRadius: 10,
                    },
                    styles.shawow,
                  ]}>
                  <View
                    style={[
                      {
                        height: 30,
                        width: 30,
                        backgroundColor: '#FFF',
                        borderRadius: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                      },
                      styles.shawow,
                    ]}>
                    <Image
                      source={require('../Images/owner.png')}
                      style={{
                        width: 20,
                        height: 20,
                        margin: 10,
                        borderRadius: 10,
                      }}
                    />
                  </View>

                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    {peer.length > 8
                      ? peer.substring(0, 4) + '...' + peer.slice(-4)
                      : peer}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  shawow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
export default ChatScreen;
