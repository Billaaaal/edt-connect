import { Dimensions, Linking, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ToastAndroid } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ClassSection from './components/classSection';
import { useFonts, Poppins_500Medium, Poppins_400Regular, Poppins_600SemiBold, Poppins_300Light } from '@expo-google-fonts/poppins';
import TopBar from './components/topBar';
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';
import ReactNativeCalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
var ical2json = require("ical2json");
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
require('moment/locale/fr');
import { startOfWeek } from "date-fns";
import Carousel from 'react-native-reanimated-carousel';
//import Animated from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';



class CalendarEvent {
  className: string;
  startTime: Date;
  endTime: Date;
  location: string;
  teacher: string;

  constructor(summary: string, startTime: Date, endTime: Date, location: string, enseignant: string) {
    this.className = summary;
    this.startTime = startTime;
    this.endTime = endTime;
    this.location = location;
    this.teacher = enseignant;
  }
}






export default function App() {

  const [events, setEvents] = useState<any[]>([]);
  const [classesOfTheDay, setClassesOfTheDay] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<any>(new Date());
  //const [selectedWeek, setSelectedWeek] = useState<any>(new Date());
  const calendarRef = useRef<ReactNativeCalendarStrip>(null);
  //const datePickerRef = useRef<DateTimePickerModal>(null);
  const [ICSInput, setICSInput] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [maxClassesPerDay, setMaxClassesPerDay] = useState<number>(8);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);
  const [datePickerSelectedDate, setDatePickerSelectedDate] = useState<Date>(dayjs().toDate());

  //const [icsLink, setIcsLink] = useState<string>('');
  //AsyncStorage.clear();
  useEffect(() => {
    //calendarRef.current?.setSelectedDate(moment(new Date()));
    //calendarRef.current?.updateWeekView(moment(new Date()));

    getData();
    /*
    calendarRef.current?.updateWeekView(moment(new Date()));
    setTimeout(() => {
        //calendarRef.current?.setSelectedDate(moment(new Date()));//.add(1, 'day'));
        
    }, 4000);
    */
  }, []);


  //useEffect(() => {

  //console.log(events[parseInt(moment(selectedDate).format('YYYYMMDD'))]);
  //console.log(events);
  //setClassesOfTheDay(events[parseInt(moment(selectedDate).format('YYYYMMDD'))]);
  //setClassesOfTheDay(events);
  //}, [selectedDate]);
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('ics_link');
      if (value !== null) {
        // value previously stored
        readICSFile(value);
      } else {
        setShowModal(true);
      }
    } catch (e) {
      // error reading value
    }
  };



  const storeData = async (value: string) => {
    try {
      await AsyncStorage.setItem('ics_link', value);
      getData();
      setShowModal(false);
    } catch (e) {
      // saving error
    }
  };



  const readICSFile = async (icsLink: string) => {
    try {
      const response = await fetch(icsLink + "?nocache"); // Update the path accordingly
      const text = await response.text();
      const data = ical2json.convert(text.replaceAll('\\n', '\n'))['VCALENDAR'][0]['VEVENT'];
      //console.log(data);

      data.sort(function (a: any, b: any) {
        return (a.DTSTART) < (b.DTEND) ? -1 : 1;
      });

      const groupedEvents: any = {};
      var firstDay = moment("20230901");
      groupedEvents[firstDay.format('YYYYMMDD')] = [];

      for (let i = 0; i < 320; i++) {

        groupedEvents[firstDay.add(1, 'day').format('YYYYMMDD')] = [];
        //if (!groupedEvents[parseInt(date.add(i, 'day').format('YYYYMMDD'))]) {
        //    console.log("Adding ", i, " days")
        //}
      }
      //console.log(groupedEvents)

      for (let i = 0; i < data.length; i++) {

        const dayKey = data[i].DTSTART.split('T')[0]; // Extracting the date part of DTSTART
        const className = data[i]["SUMMARY"];
        const startTime = data[i]["DTSTART"];
        const endTime = data[i]["DTEND"];
        const location = data[i]["LOCATION"];
        const enseignant = data[i]["ENSEIGNANT "];
        //if (!groupedEvents[dayKey]) {
        //    groupedEvents[dayKey] = [];
        //}
        groupedEvents[dayKey].push(new CalendarEvent(className, startTime, endTime, location, enseignant));

        if (i != data.length - 1 && moment(endTime).isSame(moment(data[i + 1]["DTSTART"]), 'day') && moment(data[i + 1]["DTSTART"]).diff(endTime, 'minutes') > 30) {

          groupedEvents[dayKey].push({ breakLength: moment(data[i + 1]["DTSTART"]).diff(endTime, 'minutes') });

        }

        //if(moment(endTime).diff(moment(), 'days') > 1) {
      };

      //console.log(Object.entries(groupedEvents));
      let maxSize: number = 0;
      const eventsTemp = Object.entries(groupedEvents);
      setEvents(eventsTemp);
      var nbOfClasses = 0;
      for (let i = 0; i < eventsTemp.length; i++) {

        nbOfClasses = parseInt((eventsTemp[i][1] as any).length as string);
        if (nbOfClasses > maxSize) {
          maxSize = nbOfClasses;
        }
      }

      setMaxClassesPerDay(maxSize);
      //TODO
      //check for the difference in minutes between each class
      //if it is bigger than 30 minutes, add a break

      //Top bar à modifier :
      //bug si clic sur jour, la top bar ne se met pas à jour

      //console.log(Object.entries(groupedEvents))
      //console.log(moment(selectedDate).format('YYYYMMDD'))

      //console.log(Object.entries(groupedEvents)[0][1]);
      //console.log(groupedEvents);

      // groupedEvents now contains events grouped by the same day
      //console.log(groupedEvents);

      //console.log(calendarEvents);

      //setEvents(calendarEvents);
    } catch (error) {
    }
  };



  let [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_300Light
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <GestureHandlerRootView
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 0,
        backgroundColor: 'white',


      }}>
      <ExpoStatusBar style="auto" backgroundColor='#FAF9F9' />
      <Modal
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        isVisible={isDatePickerVisible}
      >

        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 10,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >

          <DateTimePicker
            headerButtonsPosition='right'
            headerButtonStyle={{
              marginRight: 15,
              borderRadius: 8,
              backgroundColor: '#fff',
              padding: 5,
              shadowColor: '#000',
              shadowOpacity: 0.8,
              elevation: 3,
              shadowRadius: 10,
              shadowOffset: { width: 1, height: 13 },
            }}
            headerTextStyle={
              {
                fontFamily: 'Poppins_500Medium',
                fontWeight: '600',
                fontSize: 20,
                color: 'black',
                textTransform: 'capitalize',

              }
            }
            firstDayOfWeek={1}
            locale={'fr'}
            mode="single"
            date={datePickerSelectedDate}
            dayContainerStyle={
              {
                backgroundColor: 'white',
                borderRadius: 10,

              }
            }
            calendarTextStyle={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 16,
              color: 'black',
              fontWeight: '600'
            }}
            selectedTextStyle={{
              fontFamily: 'Poppins_500Medium',
              fontSize: 16,
              color: 'white',
            }}
            weekDaysTextStyle={
              {
                fontFamily: 'Poppins_500Medium',
                fontSize: 16,
                color: '#BCC1CD',
                textTransform: 'capitalize',
              }

            }


            onChange={(params) => //alert(params.date)
            {
              setDatePickerSelectedDate(new Date(Number(params.date)))

            }
            }
          />
          <View
            style={{
              backgroundColor: 'transparent',
              height: 40,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setIsDatePickerVisible(false);
              }}
              style={{
                backgroundColor: '#c5a8ff',
                height: 40,
                width: 80,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins_600SemiBold',
                  color: 'white',
                  fontSize: 16,

                }}
              >Fermer
              </Text>

            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                calendarRef.current?.setSelectedDate(moment(datePickerSelectedDate));
                calendarRef.current?.updateWeekView(moment(datePickerSelectedDate));
                setSelectedDate(datePickerSelectedDate);
                setIsDatePickerVisible(false);
              }}
              style={{
                marginLeft: 10,
                backgroundColor: '#c5a8ff',
                height: 40,
                width: 80,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >

              <Text
                style={{
                  fontFamily: 'Poppins_600SemiBold',
                  color: 'white',
                  fontSize: 16,


                }}
              >OK
              </Text>

            </TouchableOpacity>

          </View>
        </View>
      </Modal>
      {/*
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onChange={(date) => {
          //setSelectedDate(moment(date));

        }}
        onConfirm={(date) => {
          calendarRef.current?.setSelectedDate(moment(date));
          calendarRef.current?.updateWeekView(moment(date));
          setTimeout(() => {

            //setIsDatePickerVisible(false);
          }, 500);


        }}
        onCancel={() => {
          setIsDatePickerVisible(false);
        }}
        //date={moment(selectedDate).toDate()}
        date={datePickerSelectedDate}
      />*/}
      <Modal isVisible={showModal}>
        <View style={{
          width: '100%',
          height: 400,
          borderRadius: 16,
          backgroundColor: 'white',
          padding: 0,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              width: '90%'

            }}
          >

            <Text style={{
              color: 'black',
              fontFamily: 'Poppins_600SemiBold',
              fontSize: 15,
              flex: 1


            }}>Récupère ton lien ICS : </Text>
            <TouchableOpacity
              style={{}}
              onPress={() => {
                Linking.openURL('https://nvt.iut-orsay.fr');
              }}><Text
                style={{

                  color: '#30BCED',
                  fontFamily: 'Poppins_500Medium',
                  fontSize: 16,
                }}
              >nvt.iut-orsay.fr</Text></TouchableOpacity>

          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',

            }}
          >
            <Image
              source={require('./assets/settingsIcon.png')}


            />
            <Text
              style={{

              }}>
              {"➡️ 'Mon lien ICS' ➡️ Copie le premier lien"}
            </Text>
          </View>
          <TextInput placeholder='Ton lien ICS  '

            style={{
              fontFamily: 'Poppins_500Medium',
              fontSize: 16,
              padding: 16,
              marginTop: 60,

              borderRadius: 10,
              width: '90%',
              backgroundColor: '#F5F5F5',
            }}
            onChangeText={(text) => {
              setICSInput(text);
            }}
          >
          </TextInput>
          <TouchableOpacity
            onPress={() => {
              //ToastAndroid.show('Lien ICS ajouté', ToastAndroid.SHORT);
              storeData(ICSInput);

            }}


            style={{
              height: 40,
              backgroundColor: '#FFA07A',
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 40,
              padding: 8,


            }}

          ><Text style={{
            fontFamily: 'Poppins_600SemiBold', color: 'white',



          }}>Valider</Text></TouchableOpacity>

        </View>
      </Modal>
      <ScrollView contentContainerStyle={styles.container}
        scrollEnabled={true}

      >
        <TopBar
          scrollToToday={() => {

            calendarRef.current?.setSelectedDate(moment(new Date()));
            calendarRef.current?.updateWeekView(moment(new Date()));
            setSelectedDate(moment(new Date()));

          }}
          selectedDate={
            selectedDate}
          setIsDatePickerVisible={() => {
            //datePickerRef.current?.setState({ date: moment(selectedDate).toDate() });

            setIsDatePickerVisible(true);
            setDatePickerSelectedDate(moment(calendarRef.current?.getSelectedDate()).toDate())


          }}
        />
        <View
          style={{
            width: '100%',
            flex: 1,
            backgroundColor: 'black',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >

          <ReactNativeCalendarStrip
            iconLeft={null}
            iconRight={null}
            leftSelector={[]}
            rightSelector={[]}

            locale={
              {
                name: 'fr',
                config: {
                  week: { dow: 0, doy: 0 },
                  weekdaysShort: ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'],



                }
              }
            }
            useIsoWeekday={true}
            dayComponentHeight={50}
            daySelectionAnimation={{ type: 'background', duration: 300, highlightColor: '#4DC591', animType: 'background', animUpdateType: 'spring' }}
            ref={calendarRef}
            //startingDate={selectedDate}
            selectedDate={new Date()}
            scrollerPaging={true}
            scrollToOnSetSelectedDate={false}
            scrollable={true}
            style={styles.dateSelector}
            showMonth={false}
            //updateWeek={true}
            dateNameStyle={{
              color: '#BCC1CD',
              fontFamily: 'Poppins_500Medium',
              fontSize: 12,

            }}
            dateNumberStyle={{
              color: 'black',
              fontFamily: 'Poppins_600SemiBold',
              fontSize: 16
            }}
            highlightDateNumberStyle={{
              color: 'white',
              fontFamily: 'Poppins_600SemiBold',
              fontSize: 16
            }}
            highlightDateNameStyle={{
              color: 'white',
              fontFamily: 'Poppins_500Medium',
              fontSize: 12,

            }}
            dayContainerStyle={{
              borderRadius: 10,
              height: 50,
            }}
            highlightDateContainerStyle={
              {
                backgroundColor: '#c5a8ff',
                borderRadius: 10,
                height: 50,


              }
            }

            onDateSelected={(date) => {
              //setSelectedDate(moment(date));
              setSelectedDate(moment(date));
            }}
            onWeekScrollEnd={(date) => {
              //setSelectedDate(moment(date).add(1, 'day'));
              //const date_ = moment(startOfWeek(date.add(-1, 'day').add(1, 'week').toDate(), { weekStartsOn: 1 }) as Date);
              calendarRef.current?.setSelectedDate(moment(date));//.add(1, 'day'));
              setSelectedDate(moment(date));

            }}
          />
        </View>
        <View
          style={{
            backgroundColor: '#FAF9F9',
            width: '85%',
            height: 2,
          }}></View>


        <View
          style={{
            backgroundColor: 'white',
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              width: '90%',
              gap: 30,
              backgroundColor: 'white',
              paddingBottom: 16,
              paddingTop: 16,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins_500Medium',
                fontSize: 14,
                color: '#BCC1CD'
              }}
            >Horaires</Text>
            <Text
              style={{
                fontFamily: 'Poppins_500Medium',
                fontSize: 14,
                color: '#BCC1CD'
              }}
            >Cours</Text>
          </View>
        </View>

        <Carousel
          style={{

          }}
          loop
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
          }}
          width={Dimensions.get('window').width}
          height={maxClassesPerDay * 120}
          data={events}
          windowSize={3}//1, 2, 3, 4, 5
          //3 is not bad
          scrollAnimationDuration={200}
          defaultIndex={
            events.findIndex(item => item[0] === moment(selectedDate).format('YYYYMMDD'))}
          onSnapToItem={(index) => {
            //const date_ = moment(moment(events[index][0]).toDate() as Date);
            const date_ = moment(events[index][0]);
            calendarRef.current?.setSelectedDate(date_);//.add(1, 'day'));
            calendarRef.current?.updateWeekView(date_);
            setSelectedDate(date_);

            /*calendarRef.current?.setSelectedDate(events[index][0]);//.add(1, 'day'));
            */
            //calendarRef.current?.updateWeekView(events[index][0]);
            /*  
            if (!(moment(events[index][0]).isSame(moment(selectedDate).add(-1, 'day'), 'week'))) {
              ToastAndroid.show('Différente semaine', ToastAndroid.SHORT);
              calendarRef.current?.updateWeekView(moment(events[index][0]).add(1, 'day'));
            } else {
              ToastAndroid.show('Meme semaine', ToastAndroid.SHORT);

            }*/
          }}
          renderItem={({ index }) => (
            events[index][1].length === 0 ? <Text style={styles.vacances}>Pas de cours aujourd'hui 🎉🎉</Text> :
              events[index][1][0].className == 'Vacances' ? <Text style={styles.vacances}>Vacances 🎉🎉</Text> :
                events[index][1][0].className == 'Férié' ? <Text style={styles.vacances}>Jour férié 🎉🎉</Text> :



                  <View style={{
                    backgroundColor: 'white', width: '100%'
                    , flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'
                  }}>

                    {events[index][1].map((event: any, index: any) => {
                      return event.breakLength != undefined ? <View
                        style={{
                          height: Math.min(event.breakLength, 60),
                          flexDirection: 'row',
                          alignContent: 'flex-start',
                          justifyContent: 'flex-start',
                          width: '90%'

                        }}
                        key={index}>
                        <View
                          style={
                            {
                              backgroundColor: '#FAF9F9',
                              height: '100%',
                              width: 2,
                              marginLeft: 66
                            }
                          } />
                      </View> :
                        <ClassSection key={index} element={event} />;
                    })}


                  </View>

          )}


        />


        {/*

<Text style={{color:'black', fontSize:8}}>Made with ❤️ by Billal</Text>
<TouchableOpacity onPress={() => Linking.openURL('https://github.com/Billaaaal')}>
<Text>Mon Github</Text>
</TouchableOpacity>
*/}
        <View>
          <Text>Par Billal EL HACHLAF</Text>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'flex-start',

  },
  dateSelector: {
    width:
      '100%',
    padding: 16,
    backgroundColor: 'white',
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
    marginTop: -26,

  },
  vacances: {
    fontSize: 24,
    color: 'black',
    fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
    backgroundColor: 'white',
    marginTop: '50%',
  }
});


{/*events == undefined ? <Text style={styles.vacances}>Pas de cours aujourd'hui 🎉🎉</Text> :
            events[0][1].className == 'Vacances' ? <Text style={styles.vacances}>Vacances 🎉🎉</Text> :



              <View style={{
                backgroundColor: 'white', width: '100%'
                , flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'
              }}>

                {events[0][1].map((event:any, index:any) => {
                  return <ClassSection key={index} element={event} />;
                })}


              </View>
              */ }
