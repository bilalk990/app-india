import React, { useState } from 'react';
import { View, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';
import Header from './components/Header';
import Button from '../../../Component/Button';
import Typography from '../../../Component/UI/Typography';


const traditions = [
  'Mizoram', 'Maharashtra', 'Manipur', 'Meghalaya', 'Madhya Pradesh',
  'Nagaland', 'Odisha', 'Pondicherry', 'Punjab', 'Rajasthan',
];

const ChooseTraditionScreen = () => {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = traditions.filter(item =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fffbf6' }}>
      <Header title="Choose Tradition" />

      <View style={{ padding: 20 }}>
        <Typography variant="title" style={{ textAlign: 'center', marginBottom: 10 }}>
          Choose Your Tradition
        </Typography>
        <Typography variant="body" style={{ textAlign: 'center', marginBottom: 20 }}>
          Start with what defines you
        </Typography>

        <TextInput
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            padding: 12,
            marginBottom: 10,
          }}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelected(item)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}
            >
              <Typography variant="body">{item}</Typography>
              <Image
                source={
                  selected === item
                    ? require('./assets/radio_selected.png')
                    : require('./assets/radio_unselected.png')
                }
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          )}
        />

        <Button
          title="Continue"
          onPress={() => console.log('Selected Tradition:', selected)}
          style={{ marginTop: 30 }}
        />
      </View>
    </View>
  );
};

export default ChooseTraditionScreen;
