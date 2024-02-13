import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [maara, setMaara] = useState('');
  const [exchangeRates, setExchangeRates] = useState({});
  const [valittuKurrensi, setValittuKurrensi] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState('');

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const apiKey = '0z2f2lZqyYFKWPF25y3yK7hC2UAHvCD4';
      const response = await fetch(`https://api.apilayer.com/exchangerates_data/latest`, {
  headers: {
    'apikey': apiKey
    }
  });
      const data = await response.json();
      console.log('API response:', data); 
      if (data && data.success) {
        setExchangeRates(data.rates);
      } else {
        console.error('Error fetching exchange rates:', data.error);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };
  
  const convertCurrency = () => {
    const rate = exchangeRates[valittuKurrensi];
    const converted = (parseFloat(maara) * rate).toFixed(2);
    setConvertedAmount(converted);
    console.log(rate);
  };

 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>
      <Picker
        selectedValue={valittuKurrensi}
        onValueChange={(itemValue, itemIndex) => 
        setValittuKurrensi(itemValue)}
        style={styles.picker}
      >
        {Object.keys(exchangeRates).map(currency => (
          <Picker.Item key={currency} label={currency} value={currency} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        value={maara}
        onChangeText={text => setMaara(text)}
        keyboardType="numeric"
      />
      <Button title="Convert" onPress={convertCurrency} />
      {convertedAmount !== '' && (
        <Text style={styles.result}>{maara} {valittuKurrensi} is {convertedAmount} EUR</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    marginBottom: 20,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
  },
});
