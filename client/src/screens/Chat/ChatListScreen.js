import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { chatAPI } from '../../services/api';
import { COLORS } from '../../utils/constants';
import { useFocusEffect } from '@react-navigation/native';

const ChatListScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [])
  );

  const fetchChats = async () => {
    try {
      const res = await chatAPI.getChatList();
      if (res.success) {
        setChats(res.data);
      }
    } catch (error) {
      console.error('Fetch chats error:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatCard}
      onPress={() =>
        navigation.navigate('ChatScreen', {
          requestId: item.request_id,
          otherUserId: item.other_user_id,
          otherUserName: item.other_user_name,
          bloodGroup: item.blood_group,
        })
      }
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.other_user_name.charAt(0).toUpperCase()}
          </Text>
        </View>
        {item.unread_count > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread_count}</Text>
          </View>
        )}
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.other_user_name}</Text>
          <Text style={styles.bloodGroup}>{item.blood_group}</Text>
        </View>

        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.last_message || 'No messages yet'}
        </Text>

        <Text style={styles.timeText}>
          {item.last_message_time
            ? new Date(item.last_message_time).toLocaleString()
            : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.centerText}>Loading chats...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Messages</Text>

      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.request_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No conversations yet</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
    color: COLORS.DARK,
  },
  chatCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 12,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 15,
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.WHITE,
    fontSize: 20,
    fontWeight: 'bold',
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.DANGER,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.DARK,
  },
  bloodGroup: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 3,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.GRAY,
  },
  centerText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: COLORS.GRAY,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: COLORS.GRAY,
  },
});

export default ChatListScreen;