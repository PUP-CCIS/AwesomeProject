import React from 'react';
import {
  Button,
  DrawerLayoutAndroid,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View
} from 'react-native';

export default class App extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);

    this.handlePress = this.handlePress.bind(this);

    this.state = {
      inputValue: '',
      todoItems: [
        {
          key: 1,
          title: 'Shopping',
          description: 'Milk'
        },
        {
          key: 2,
          title: '13:00',
          description: 'Hair cut'
        }
      ]
    };
  }

  componentWillMount() {
    ToastAndroid.show('Component will mount', ToastAndroid.SHORT);
  }

  componentDidMount() {
    ToastAndroid.show('Component did mount', ToastAndroid.SHORT);
  }

  componentDidUpdate() {
    ToastAndroid.show('Component updated', ToastAndroid.SHORT);
  }

  handlePress() {
    const todoItems = this.state.todoItems.concat();
    const lastKey = todoItems[todoItems.length - 1].key;
    this.setState({
      todoItems: todoItems.concat([{
        key: lastKey + 1,
        title: this.state.inputValue
      }]),
      inputValue: ''
    });
  }

  render() {
    var navigationView = (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Text>I'm in the drawer</Text>
      </View>
    );

    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}>
        <View style={styles.container}>
          <Text style={{ fontSize: 50 }}>To-Do</Text>
          <TextInput
            style={{ width: 200, fontSize: 40 }}
            onChangeText={(text) => this.setState({ inputValue: text })}
            value={this.state.inputValue}
          />
          <Button
            onPress={this.handlePress}
            title="Add"
          />
          <FlatList
            data={this.state.todoItems}
            renderItem={({item}) => <Text style={{ fontSize: 20 }}>{item.title}</Text>}
          />
        </View>
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
