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
} from 'react-native';
import {Client, sign} from '@xmtp/react-native-sdk';
function ChatScreen(props: any): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);

  const [conversation, setConversation] = useState<any>(null);
  const [peerData, setPeerData] = useState<any[]>([]);
  const [messageHistory, setMessageHistory] = useState<any[]>([]);
  const [peerAddressList, setPeerAddressList] = useState<string[]>([]);
  const [peerAddress, setPeerAddress] = useState(null);
  const [messageType, setMessageType] = useState('allInbox');
  const [changeConversationLoading, setChangeConversationLoading] =
    useState(false);
  const [isConnected, setIsConnected] = useState(false);

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
    try {
      setIsLoading(true);
      const ethProvider = await new ethers.providers.JsonRpcProvider(
        '',
      );
      const wallet = await new Wallet(
        '',
        ethProvider,
      );
      setWallet(wallet);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };
  const handleWalletClick = async (chat: any) => {
    props.navigation.navigate('IndividualChat', {
      clientAddress: chat,
      xmtpClient: xmtpClient,
    });
  };

  useEffect(() => {
    initWallet();
  }, []);
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
    <View style={{height: '100%', width: '100%', backgroundColor: 'tomato'}}>
      {isLoading ? (
        <ActivityIndicator size="large" color={'blue'} />
      ) : (
        <ScrollView style={{flex: 1, backgroundColor: 'white', padding: 10}}>
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
                      backgroundColor: 'white',
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
                        backgroundColor: 'white',
                        borderRadius: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                      },
                      styles.shawow,
                    ]}>
                    <Image
                      source={{
                        uri: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Person_Image_Placeholder.png?20230410144854',
                      }}
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
