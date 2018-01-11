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
import {AudioRecorder, AudioUtils} from 'react-native-audio';

export default class App extends Component<{}> {
  constructor() {
    super()
    this.state = {
      status: 'unknown',
      step: 0,
      gyroX: 0.00,
      gyroY: 0.00,
      gyroZ: 0.00,
      accelX: 0.00,
      accelY: 0.00,
      accelZ: 0.00,
      lightSensor: 0,
      decible: 0,
      proximityNear: '',
      proximityValue: 0,
      proximityMaxRange: 0,
      countForGetStatus: 0,
    }

    this.startSensor = this.startSensor.bind(this)
    this.checkStatus = this.checkStatus.bind(this)
    this.startRecording = this.startRecording.bind(this)
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
    DeviceEventEmitter.addListener('Gyroscope', (data) => {
      this.setState({
        gyroX: (+data.x).toFixed(2),
        gyroY: (+data.y).toFixed(2),
        gyroZ: (+data.z).toFixed(2),
      })
    });
    DeviceEventEmitter.addListener('Accelerometer', (data) => {
      if(this.state.countForGetStatus == 5) {
        console.log(this.state.countForGetStatus)
        this.checkStatus()
        this.stopRecording()
      } else if (this.state.countForGetStatus == 1) {
        this.startRecording()
      }
      this.setState({
        accelX: (+data.x).toFixed(2),
        accelY: (+data.y).toFixed(2),
        accelZ: (+data.z).toFixed(2),
        countForGetStatus: this.state.countForGetStatus + 1
      })
    });
    DeviceEventEmitter.addListener('Proximity', (data) => {
      this.setState({
        proximityNear: data.isNear,
        proximityValue: data.value,
        proximityMaxRange: data.maxRange
      })
    });
  }

  checkStatus() {
    console.log('checkStatus')
    let accelXstatus = this.state.accelX < 1.5 && this.state.accelX > -1.5
    let lightStatus = this.state.lightSensor < 10
    let micStatus = this.state.decible < -45
    console.log(accelXstatus, lightStatus, micStatus)
    if(lightStatus && accelXstatus && micStatus){
      this.setState({
        status: 'rest/sleep',
        countForGetStatus: 0
      })
    } else if (accelXstatus) {
      this.setState({
        status: 'rest/sit',
        countForGetStatus: 0
      })
    } else {
      this.setState({
        countForGetStatus: 0
      })
    }
  }

  componentDidMount() {
    SensorManager.startStepCounter(100);
    SensorManager.startLightSensor(100);
    SensorManager.startAccelerometer(1000);
    SensorManager.startGyroscope(1000);
    SensorManager.startProximity(100);
    this.startSensor()
  }

  startRecording() {
    let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';

    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      MeteringEnabled: true
    });
    AudioRecorder.startRecording()
    .then((data) => {
      AudioRecorder.onProgress = data => {
        let decibels = Math.floor(data.currentMetering);
        this.setState({
          decible: decibels
        })
      };
    });
  }

  stopRecording() {
    AudioRecorder.stopRecording();
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
          <Text style={styles.fontSize}>
            Microphone:
          </Text>
          <View style={{ flexDirection: 'row'}}>
            <View>
              <Text style={styles.fontSize}>
                { this.state.decible }
              </Text>
            </View>
          </View>
        </View>


        <View>
          <Text style={styles.fontSize}>
            Proxymity:
          </Text>
          <View style={{ flexDirection: 'row'}}>
            <View style={{ width: 110, }}>
              <Text style={styles.fontSize}>
                Value
              </Text>
            </View>
            <View style={{ width: 110, }}>
              <Text style={styles.fontSize}>
                Max
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row'}}>
            <View style={{ width: 110, }}>
              <Text style={styles.fontSize}>
                { this.state.proximityValue }
              </Text>
            </View>
            <View style={{ width: 110, }}>
              <Text style={styles.fontSize}>
                { this.state.proximityMaxRange }
              </Text>
            </View>
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
