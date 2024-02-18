import { Text, View, StyleSheet } from 'react-native';
import ClassButton from './classButton';
import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';
export default function ClassSection(props: any) {

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.classStart}>{moment(props.element.startTime).format('HH:mm')}</Text>
        <Text style={styles.classEnd}>{moment(props.element.endTime).format('HH:mm')}</Text>

      </View>
      <View style={styles.divisionBar} />
      <ClassButton element={props.element} />
    </TouchableOpacity>
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '90%',
  },

  timeContainer: {
    backgroundColor: 'white',
    height: '100%',
    marginBottom: 16,
    marginRight: 16,
    width: 50,
  },

  divisionBar: {
    backgroundColor: '#FAF9F9',
    height: '100%',
    width: 2,
  },

  classStart: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Poppins_500Medium',

  },
  classEnd: {
    fontSize: 14,
    color: '#BCC1CD',
    fontFamily: 'Poppins_500Medium',


  }



});