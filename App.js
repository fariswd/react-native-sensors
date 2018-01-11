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
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

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
      countForGetStatus: 0,
    }

    this.startSensor = this.startSensor.bind(this)
    this.checkStatus = this.checkStatus.bind(this)
    this.timeMixin = this.timeMixin.bind(this)
  }

  startSensor () {
    console.log('start Sensor')
    DeviceEventEmitter.addListener('LightSensor', (data) => {
      this.setState({
        lightSensor: data.light
      })
    });
    DeviceEventEmitter.addListener('StepCounter', (data) => {
      this.setState({
        step: this.state.step + 1,
        status: 'walk/run',
        countForGetStatus: 0
      })
    });
    DeviceEventEmitter.addListener('Accelerometer', (data) => {
      if(this.state.countForGetStatus == 5) {
        console.log(this.state.countForGetStatus)
        this.checkStatus()
      }
      this.setState({
        accelX: (+data.x).toFixed(2),
        accelY: (+data.y).toFixed(2),
        accelZ: (+data.z).toFixed(2),
        countForGetStatus: this.state.countForGetStatus + 1
      })
    });
    DeviceEventEmitter.addListener('Gyroscope', (data) => {
      this.setState({
        gyroX: (+data.x).toFixed(2),
        gyroY: (+data.y).toFixed(2),
        gyroZ: (+data.z).toFixed(2),
      })
    });

  }

  checkStatus() {
    console.log('checkStatus')
    let accelXstatus = this.state.accelX < 1.5 && this.state.accelX > -1.5
    let lightStatus = this.state.lightSensor < 10
    if(lightStatus && accelXstatus){
      this.setState({
        status: 'rest/sleep',
        countForGetStatus: 0
      })
    } else if (accelXstatus) {
      this.setState({
        status: 'rest/sit',
        countForGetStatus: 0
      })
    }
  }

  timeMixin () {
    this.setTimeout(() => {
      console.log('I do not leak!');
    }, 200);
  }

  componentDidMount() {
    SensorManager.startStepCounter(100);
    SensorManager.startLightSensor(100);
    SensorManager.startAccelerometer(1000);
    SensorManager.startGyroscope(1000);
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
          <View style={{ marginTop: 10 }}>
            <Button
              onPress={this.timeMixin}
              title="Check time"
              color="#841584"
            />
          </View>
        </View>
      </View>
    );
  }
}

reactMixin(App.prototype, TimerMixin);

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
