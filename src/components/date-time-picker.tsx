import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Surface } from 'react-native-paper';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function CrossPlatformDateTimePicker({ purchaseDatetime, onChangeDate }) {

    const datetime = purchaseDatetime

   
    const showPicker = (mode) => {
        DateTimePickerAndroid.open({
            value: datetime ? datetime : new Date(),
            onChange: onChangeDate,
            mode,
            is24Hour: false,
        });
    }


    const showDatePicker = () => showPicker('date');
    const showTimePicker = () => showPicker('time');



    return(<>

        {Platform.OS === 'ios' ? (
            <Surface style={[styles.datetimePickerIosContainer, styles.surface]} >
                <Text style={styles.label}>Due</Text>
                <DateTimePicker
                    value={datetime ? datetime : new Date()}
                    onChange={onChangeDate}
                    mode='datetime'
                    display='default'
                />
            </Surface>
        ) : (
            <>
                <Surface style={styles.surface}>
                    <Text style={styles.label}>{datetime ? datetime.toLocaleString() : null}</Text>
                </Surface>
                <View style={styles.buttonsDatetime}>
                    <Button color={'#000000'} onPress={showDatePicker} title="Pick Date" />
                    <Button color={'#000000'} onPress={showTimePicker} title="Pick Time" />
                </View> 
            </>
        )}  
        </>
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  pageTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 16,
  },
  buttonsDatetime: {
    display: 'flex',
    flexDirection:'row',
    margin: 'auto',
    gap: 48

  },
  buttonsForm: {
    display: 'flex',
    flexDirection:'column',
    margin: 'auto',
    gap: 48

  },
  button: {
    backgroundColor: 'black'
  },
  label: {
    fontSize: 18,
    marginTop: 4,
    marginBottom: 4,
    textAlign: 'center'
  },
  input: {
    margin: 12,
    // gap: 15
  },
  dropdown: {
    backgroundColor: '#fafafa',
  },
  dropdownContainer: {
    backgroundColor: '#e3e3e3',
  },
  frequencyInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: 'auto',
    backgroundColor: 'black'

  },
  frequencyTitleContainer: {
    margin: 'auto',
  },
  frequencyTitle: {
    fontSize:18,
    padding: 16,
    textAlign:'center'
  },
  datetimePickerIosContainer: {
    alignItems: 'center',
    padding: 16,
  },
  surface: {
    margin: 16,
    padding:16
  },
  frequencyInputLabel: {
    textAlign: 'center'
  }
});
