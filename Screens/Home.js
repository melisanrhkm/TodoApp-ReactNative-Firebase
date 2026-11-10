
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
} from 'react-native';

import { firebase } from '../config';

import { FontAwesome } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {

  const [todos, setTodos] = useState([]);

  const [addData, setAddData] = useState('');

  const navigation = useNavigation();

  const todoRef = firebase.firestore().collection('todos');

  // Mengambil data dari Firebase
  useEffect(() => {

    const unsubscribe = todoRef
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (querySnapshot) => {

          const todos = [];

          querySnapshot.forEach((doc) => {

            const { heading } = doc.data();

            todos.push({
              id: doc.id,
              heading,
            });

          });

          setTodos(todos);

        },
        (error) => {
          Alert.alert('Error', error.message);
        }
      );

    return () => unsubscribe();

  }, []);

  // Menambahkan Todo
  const addTodo = async () => {

    const heading = addData.trim();

    if (heading.length === 0) {
      Alert.alert('Peringatan', 'Masukkan tugas terlebih dahulu!');
      return;
    }

    try {

      const timestamp =
        firebase.firestore.FieldValue.serverTimestamp();

      const data = {
        heading: heading,
        createdAt: timestamp,
      };

      await todoRef.add(data);

      setAddData('');

      Keyboard.dismiss();

    } catch (error) {

      Alert.alert('Error', error.message);

    }

  };

  // Menghapus Todo
  const deleteTodo = (item) => {

    Alert.alert(
      'Hapus Todo',
      'Apakah kamu yakin ingin menghapus tugas ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {

            try {

              await todoRef.doc(item.id).delete();

              Alert.alert(
                'Berhasil',
                'Todo berhasil dihapus!'
              );

            } catch (error) {

              Alert.alert('Error', error.message);

            }

          },
        },
      ]
    );

  };

  // Tampilan setiap Todo
  const renderItem = ({ item }) => (

    <View style={styles.container}>

      <TouchableOpacity
        onPress={() => deleteTodo(item)}
      >

        <FontAwesome
          name="trash-o"
          color="red"
          size={22}
          style={styles.todoIcon}
        />

      </TouchableOpacity>

      <TouchableOpacity
        style={styles.innerContainer}
        onPress={() =>
          navigation.navigate('Detail', { item })
        }
      >

        <Text style={styles.itemHeading}>
          {item.heading}
        </Text>

      </TouchableOpacity>

    </View>

  );

  return (

    <SafeAreaView style={styles.safeArea}>

      <View style={styles.textHeadingContainer}>

        <Text style={styles.textHeading}>
          Todos App
        </Text>

      </View>

      <View style={styles.formContainer}>

        <TextInput
          style={styles.input}
          placeholder="Add new todo"
          placeholderTextColor="#aaaaaa"
          onChangeText={setAddData}
          value={addData}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={addTodo}
        >

          <Text style={styles.buttonText}>
            Add
          </Text>

        </TouchableOpacity>

      </View>

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Belum ada tugas. Tambahkan tugas baru!
          </Text>
        }
      />

    </SafeAreaView>

  );

};

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  container: {
    backgroundColor: '#e5e5e5',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  textHeadingContainer: {
    paddingVertical: 20,
    alignContent: 'center',
    alignItems: 'center',
  },

  textHeading: {
    fontWeight: 'bold',
    fontSize: 24,
  },

  innerContainer: {
    flex: 1,
    marginLeft: 35,
  },

  itemHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333333',
  },

  formContainer: {
    flexDirection: 'row',
    height: 80,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
  },

  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },

  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: '#788eec',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 20,
  },

  todoIcon: {
    marginLeft: 5,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#888888',
  },

});

export default Home;
