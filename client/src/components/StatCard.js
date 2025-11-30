import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react';
import { COLORS } from '../utils/constants';

const StatCard = ({ icon, title, value, color, onPress }) => {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      style={[styles.card, { backgroundColor: color || COLORS.PRIMARY }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </Component>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    minHeight: 140,
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: 5,
  },
  title: {
    fontSize: 13,
    color: COLORS.WHITE,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default StatCard;