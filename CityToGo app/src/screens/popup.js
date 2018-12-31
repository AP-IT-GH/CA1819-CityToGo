import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert, Image, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements'
class ModalExample extends Component {
  state = {
    modalVisible: false,
    showButton:true
  };

  setModalVisible(visible,btnvisible) {
    this.setState({ modalVisible: visible })
    this.setState({showButton :btnvisible})
  }

  startGameSession(){
    this.setModalVisible(false);
    if(this.state.showButton == true){
    this.props.startGameSession()
    }
  }

  render() {
 
    return (
      <View style={{ marginTop: 22 }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {Alert.alert('Modal has been closed.');}}
          >
      
          <View style={{ marginTop: 22 }}>
            <View>
              <Image
                style={styles.image}
                blurRadius={this.props.blur}

                source={{ uri: `${this.props.imageUri}` }}
              />
              <Text>
                {this.props.data}
              </Text>
            
              < Button style={{ marginTop: 150 }}
                onPress={() => {this.startGameSession()}}
                title="Let's go"
              />
            </View>
          </View>
        </Modal>


      </View>
    );
  }
}


export default ModalExample;

const styles = StyleSheet.create({
  image: {
    marginTop: 20,
    marginLeft: 90,
    height: 200,
    width: 200
  }
});