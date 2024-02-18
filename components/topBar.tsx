import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useFonts, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import moment from 'moment';
//import DateTimePickerModal from "react-native-modal-datetime-picker";
//import AgendaIcon from '../assets/agenda.svg';
//import Svg, { Path, SvgUri, SvgXml } from 'react-native-svg'

//require('moment/locale/fr'); // Load the French locale
export default function TopBar(props: any) {
  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayNumber}>{moment(props.selectedDate).date()}</Text>

        <View>
          <Text style={styles.dateName}>{moment(props.selectedDate).format("MMMM")}</Text>
          <Text style={styles.monthYear}>{moment(props.selectedDate).format("YYYY")}</Text>
        </View>

      </View>


      {
        !moment(props.selectedDate).isSame(new Date(), 'day') ?
          <TouchableOpacity onPress={() => {
            props.scrollToToday();
          }} style={styles
            .isTodayBox}>
            <Text style={styles.todayText}>Aujourd'hui</Text>
          </TouchableOpacity> : null
      }

      <TouchableOpacity
        style={{
          height: 45,
          width: 45,
          backgroundColor: '#c5a8ff',
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          props.setIsDatePickerVisible();

        }}
      >
        <Image
          style={{
            height: 30,
            width: 30,

          }}
          source={require('../assets/datePickerIcon.png')}
        ></Image>


      </TouchableOpacity>

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAF9F9',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    height: 136,
    padding: 16,
  },
  dateContainer: {
    backgroundColor: '#FAF9F9',
    flexDirection: 'row',
    alignItems: 'center',
    width: 110,
  },
  dayNumber: {
    fontSize: 44,
    color: 'black',
    fontFamily: 'Poppins_500Medium',

  },
  dateName: {
    fontSize: 14,
    color: '#BCC1CD',
    fontFamily: 'Poppins_500Medium',
    marginLeft: 8,
  },
  monthYear: {
    fontSize: 14,
    color: '#BCC1CD',
    fontFamily: 'Poppins_500Medium',
    marginLeft: 8,
  },
  isTodayBox: {
    backgroundColor: '#E9F5EF',
    height: 40,
    padding: 8,

    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  todayText: {
    fontSize: 16,
    color: '#4DC591',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    borderRadius: 8,
  }
});