import React from 'react';
import { FlatList, Modal, StyleSheet, ToastAndroid, View } from 'react-native';
import {
  Button,
  FormInput,
  FormLabel,
  Header,
  Icon,
  List,
  ListItem,
  Text
} from 'react-native-elements';
import axios from 'axios';

export default class App extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);

    this.editTodo = this.editTodo.bind(this);
    this.getTodos = this.getTodos.bind(this);
    this.handlePressAdd = this.handlePressAdd.bind(this);
    this.handlePressEdit = this.handlePressEdit.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.toggleSwitch = this.toggleSwitch.bind(this);

    this.state = {
      descriptionInput: '',
      modalVisible: false,
      refreshing: false,
      titleInput: '',
      editId: null,
      mode: 'add',
      todoItems: []
    };
  }

  componentDidMount() {
    this.getTodos();
  }

  getTodos() {
    this.setState({ refreshing: true });

    return axios.get('http://192.168.200.103:3009/api/todos')
      .then(response => {
        const todos = response.data;
        
        this.setState({
          refreshing: false,
          todoItems: todos.map(function (todo) {
            return {
              id: todo.id,
              title: todo.title,
              description: todo.description,
              switched: !!todo.done
            };
          })
        });
      })
      .catch(err => {
        this.setState({ refreshing: false });
        ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
      });
  }

  handlePressEdit() {
    axios.put(`http://192.168.200.103:3009/api/todos/${this.state.editId}`, {
      title: this.state.titleInput,
      description: this.state.descriptionInput
    })
      .then(response => {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

        this.setState({
          descriptionInput: '',
          modalVisible: false,
          titleInput: '',
          editId: null,
          mode: 'add'
        }, () => {
          this.getTodos();
        });
      });
  }

  handlePressAdd() {
    const todoItems = this.state.todoItems.concat();
    const payload = {
      title: this.state.titleInput,
      description: this.state.descriptionInput
    };

    axios.post('http://192.168.200.103:3009/api/todos', payload)
      .then(response => {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

        this.setState({
          descriptionInput: '',
          modalVisible: false,
          titleInput: ''
        })
      })
      .catch(err => ToastAndroid.show(err.response.data.error, ToastAndroid.LONG))
      .then(this.getTodos);
  }

  toggleSwitch(index) {
    const { todoItems } = this.state;
    const todoItem = todoItems[index];

    this.setState({
      todoItems: [
        ...todoItems.slice(0, index),
        {
          ...todoItem,
          switched: !todoItem.switched
        },
        ...todoItems.slice(index + 1)
      ]
    });
  }

  editTodo(index) {
    const todo = this.state.todoItems[index];

    this.setState({
      modalVisible: true,
      titleInput: todo.title,
      descriptionInput: todo.description,
      mode: 'edit',
      editId: todo.id
    });
  }

  renderRow({ item, index }) {
    return (
      <ListItem
        hideChevron={true}
        onPress={this.editTodo.bind(null, index)}
        onSwitch={this.toggleSwitch.bind(null, index)}
        subtitle={item.description}
        subtitleStyle={{ color: item.switched ? '#009C6B' : '#a3a3a3' }}
        switched={item.switched}
        switchButton={true}
        title={item.title}
        titleStyle={{ color: item.switched ? '#009C6B' : '#000000' }}
      />
    );
  }

  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          onRequestClose={() => this.setState({ modalVisible: false, mode: 'add' })}
          transparent={false}
          visible={this.state.modalVisible}>
          <View>
            <Text h4 style={{ textAlign: 'center' }}>{this.state.mode === 'add' ? 'Add' : 'Edit'} To-Do Item</Text>
            <FormLabel>Title</FormLabel>
            <FormInput onChangeText={text => this.setState({ titleInput: text })} value={this.state.titleInput} />
            <FormLabel>Description</FormLabel>
            <FormInput onChangeText={text => this.setState({ descriptionInput: text })} value={this.state.descriptionInput} />
            <Button onPress={this.state.mode === 'add' ? this.handlePressAdd : this.handlePressEdit} title={this.state.mode === 'add' ? 'Add' : 'Save'} buttonStyle={{ marginBottom: 5 }} backgroundColor="#009C6B"/>
            <Button onPress={() => this.setState({ modalVisible: false, mode: 'add', descriptionInput: '', titleInput: '', editId: '' })} title="Close" />
          </View>
        </Modal>

        <Header
          leftComponent={{ icon: 'menu' }}
          centerComponent={{ text: 'To-Do List' }}
          rightComponent={{ icon: 'add', onPress: () => this.setState({ modalVisible: true }) }}
        />
        <List containerStyle={{ marginTop: 70 }}>
          <FlatList
            data={this.state.todoItems}
            keyExtractor={item => item.id}
            onRefresh={this.getTodos}
            refreshing={this.state.refreshing}
            renderItem={this.renderRow}
          />
        </List>
      </View>
    );
  }
}
