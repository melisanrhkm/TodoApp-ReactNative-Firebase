
import React, { useState } from 'react';

import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { firebase } from '../config';

import { useNavigation } from '@react-navigation/native';

const Detail = ({ route }) => {

  const todoRef = firebase.firestore().collection('todos');

  const [textHeading, onChangeHeadingText] = useState(
    route.params.item.heading
  );

  const navigation = useNavigation();

  // Fungsi Update Todo
  const updateTodo = async () => {

    const heading = textHeading.trim();

    if (heading.length === 0) {

      Alert.alert(
        'Peringatan',
        'Nama tugas tidak boleh kosong!'
      );

      return;

    }

    try {

      await todoRef
        .doc(route.params.item.id)
        .update({
          heading: heading,
        });

      Alert.alert(
        'Berhasil',
        'Todo berhasil diperbarui!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );

    } catch (error) {

      Alert.alert('Error', error.message);

    }

  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Edit Todo
      </Text>

      <TextInput
        style={styles.textfield}
        onChangeText={onChangeHeadingText}
        value={textHeading}
        placeholder="Update Todo"
      />

      <TouchableOpacity
        style={styles.buttonUpdate}
        onPress={updateTodo}
      >

        <Text style={styles.buttonText}>
          UPDATE
        </Text>

      </TouchableOpacity>

    </View>

  );

};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    marginTop: 80,
    marginLeft: 15,
    marginRight: 15,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },

  textfield: {
    marginBottom: 10,
    padding: 10,
    fontSize: 15,
    color: '#000000',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },

  buttonUpdate: {
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 10,
    backgroundColor: '#0de065',
  },

  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
  },

});

export default Detail;
