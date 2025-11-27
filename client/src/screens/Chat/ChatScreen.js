import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatAPI } from '../../services/api';
import { COLORS } from '../../utils/constants';

const ChatScreen = ({ route, navigation }) => {
  const { requestId, otherUserId, otherUserName, bloodGroup } = route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [sending, setSending] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    loadCurrentUser();
    fetchMessages();

    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadCurrentUser = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      setCurrentUserId(parsed.userId);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await chatAPI.getMessages(requestId);
      if (res.success) {
        setMessages(res.data);
      }
    } catch (error) {
      console.error('Fetch messages error:', error.message);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await chatAPI.sendMessage(requestId, otherUserId, newMessage.trim());
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.sender_id === currentUserId;

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.otherMessage,
        ]}
      >
        {!isMyMessage && (
          <Text style={styles.senderName}>{item.sender_name}</Text>
        )}
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.timeText}>
          {new Date(item.created_at).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerName}>{otherUserName}</Text>
        <Text style={styles.headerBlood}>{bloodGroup}</Text>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
        }
      />

      {/* Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, sending && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={sending || !newMessage.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT,
  },
  header: {
    backgroundColor: COLORS.PRIMARY,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  headerBlood: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  messagesList: {
    padding: 15,
    paddingBottom: 10,
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 12,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.PRIMARY,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.GRAY,
    color: COLORS.DARK,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    color: COLORS.WHITE,
  },
  timeText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 14,
    color: COLORS.GRAY,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.LIGHT,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.GRAY,
  },
  sendButtonText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default ChatScreen;