import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
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

export default class App extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);

    this.handlePress = this.handlePress.bind(this);
    this.toggleSwitch = this.toggleSwitch.bind(this);

    this.state = {
      descriptionInput: '',
      modalVisible: false,
      titleInput: '',
      todoItems: [
        {
          title: 'Shopping',
          description: 'Milk',
          switched: false
        },
        {
          title: '13:00',
          description: 'Hair cut',
          switched: false
        }
      ]
    };
  }

  handlePress() {
    const todoItems = this.state.todoItems.concat();
    this.setState({
      descriptionInput: '',
      modalVisible: false,
      titleInput: '',
      todoItems: todoItems.concat([{
        title: this.state.titleInput,
        description: this.state.descriptionInput,
        switched: false
      }])
    });
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

  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          onRequestClose={() => this.setState({ modalVisible: false })}
          transparent={false}
          visible={this.state.modalVisible}>
          <View>
            <Text h4 style={{ textAlign: 'center' }}>Add To-Do Item</Text>
            <FormLabel>Title</FormLabel>
            <FormInput onChangeText={text => this.setState({ titleInput: text })} value={this.state.titleInput} />
            <FormLabel>Description</FormLabel>
            <FormInput onChangeText={text => this.setState({ descriptionInput: text })} value={this.state.descriptionInput} />
            <Button onPress={this.handlePress} title="Add" buttonStyle={{ marginBottom: 5 }} backgroundColor="#009C6B"/>
            <Button onPress={() => this.setState({ modalVisible: false })} title="Close" />
          </View>
        </Modal>

        <Header
          leftComponent={{ icon: 'menu' }}
          centerComponent={{ text: 'To-Do List' }}
          rightComponent={{ icon: 'add', onPress: () => this.setState({ modalVisible: true }) }}
        />
        <List containerStyle={{ marginTop: 70 }}>
          {this.state.todoItems.map((todoItem, index) => (
            <ListItem
              hideChevron={true}
              key={index}
              onSwitch={this.toggleSwitch.bind(null, index)}
              subtitle={todoItem.description}
              subtitleStyle={{ color: todoItem.switched ? '#009C6B' : '#a3a3a3' }}
              switched={todoItem.switched}
              switchButton={true}
              title={todoItem.title}
              titleStyle={{ color: todoItem.switched ? '#009C6B' : '#000000' }}
            />
          ))}
        </List>
      </View>
    );
  }
}
