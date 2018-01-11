/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  DeviceEventEmitter
} from 'react-native';
import { SensorManager } from 'NativeModules';

export default class App extends Component<{}> {
  constructor() {
    super()
    this.state = {
      step: 0,
      accel: false,
      gyro: false,
      light: false,
      status: 'unknown',
      gyroX: 0.00,
      gyroY: 0.00,
      gyroZ: 0.00,
      accelX: 0.00,
      accelY: 0.00,
      accelZ: 0.00,
      lightSensor: 0,
    }

    this.startSensor = this.startSensor.bind(this)
    this.checkStatus = this.checkStatus.bind(this)
  }

  startSensor () {
    console.log('checkStatus')
    this.setState({
      accelX: 0
    })
    DeviceEventEmitter.addListener('LightSensor', (data) => {
      this.setState({
        lightSensor: data.light
      })
    });
    DeviceEventEmitter.addListener('StepCounter', (data) => {
      this.setState({
        step: this.state.step + 1
      })
    });
    DeviceEventEmitter.addListener('StepCounter', (data) => {
      this.setState({
        step: this.state.step + 1,
        status: 'walk/run'
      })
    });

    DeviceEventEmitter.addListener('Accelerometer', (data) => {
      this.setState({
        accelX: data.x,
        accelY: data.y,
        accelZ: data.z,
      })
    });

    DeviceEventEmitter.addListener('Gyroscope', (data) => {
      this.setState({
        gyroX: data.x,
        gyroY: data.y,
        gyroZ: data.z,
      })
    });

  }

  checkStatus() {
    //if banyak set state statusnya
    console.log('checkStatus')
    let accelXstatus = this.state.accelX < 1.5 && this.state.accelX > -1.5
    let lightStatus = this.state.lightSensor < 10
    if(lightStatus && accelXstatus){
      this.setState({
        status: 'rest/sleep'
      })
    } else if (accelXstatus) {
      this.setState({
        status: 'rest/sit'
      })
    }
  }



  componentDidMount() {
    SensorManager.startStepCounter(100);
    SensorManager.startLightSensor(100);
    SensorManager.startAccelerometer(1000);
    SensorManager.startGyroscope(1000);
    this.timer = setTimeout(() => {
     console.log('I do not leak!');
    }, 5000);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 25 }}>
          Human Tracker
        </Text>
        <Text style={styles.fontSize}>
          Your Status: { this.state.status }
        </Text>
        <View>
          <Text style={styles.fontSize}>
            Accelerometer:
          </Text>
          <View style={{ flexDirection: 'row'}}>
            <View style={{ width: 110, }}>
              <Text style={styles.fontSize}>
                X
              </Text>
            </View>
            <View style={{ width: 110, }}>
              <Text style={styles.fontSize}>
                Y
              </Text>
            </View>
            <View style={{ width: 110, }}>
              <Text style={styles.fontSize}>
                Z
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row'}}>
            <View style={{ width: 110, }}>
              <Text style={styles.fontSize}>
                { this.state.accelX }
              </Text>
            </View>
            <View style={{ width: 110, }}>
              <Text style={styles.fontSize}>
                { this.state.accelY }
              </Text>
            </View>
            <View style={{ width: 110, }}>
              <Text style={styles.fontSize}>
                { this.state.accelZ }
              </Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.fontSize}>
            Gyroscope:
          </Text>
          <View style={{ flexDirection: 'row'}}>
            <View style={{ width: 110, }}>
              <Text style={styles.fontSize}>
                X
              </Text>
            </View>
            <View style={{ width: 110, }}>
              <Text style={styles.fontSize}>
                Y
              </Text>
            </View>
            <View style={{ width: 110, }}>
              <Text style={styles.fontSize}>
                Z
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row'}}>
            <View style={{ width: 110, }}>
              <Text style={styles.fontSize}>
                { this.state.gyroX }
              </Text>
            </View>
            <View style={{ width: 110, }}>
              <Text style={styles.fontSize}>
                { this.state.gyroY }
              </Text>
            </View>
            <View style={{ width: 110, }}>
              <Text style={styles.fontSize}>
                { this.state.gyroZ }
              </Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.fontSize}>
            Step:
          </Text>
          <View style={{ flexDirection: 'row'}}>
            <View>
              <Text style={styles.fontSize}>
                { this.state.step }
              </Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.fontSize}>
            LightSensor:
          </Text>
          <View style={{ flexDirection: 'row'}}>
            <View>
              <Text style={styles.fontSize}>
                { this.state.lightSensor }
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View style={{ marginTop: 10 }}>
            <Button
              onPress={this.startSensor}
              title="Start Sensor"
              color="#841584"
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Button
              onPress={this.checkStatus}
              title="Check Status"
              color="#841584"
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: 10,
    marginLeft: 5,
  },
  fontSize: {
    fontSize: 20
  }
});
