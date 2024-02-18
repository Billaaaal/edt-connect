import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts, Poppins_500Medium, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { useState } from 'react';

export default function ClassButton(props: any) {
    var backgroundColor = '';
    if (props.element.className.includes("TD")) {
        backgroundColor = ('#4DC591')
    }
    else if (props.element.className.includes("TP")) {
        backgroundColor = ('#4DC591');
    }
    else if (props.element.className.includes("CM")) {
        backgroundColor = ('#87CEEB');
    }
    else if (props.element.className.includes("PRO")) {
        backgroundColor = ('#FFA07A');
    }
    else {
        backgroundColor = ('#87CEEB');
    }
    var styles = StyleSheet.create({

        container: {
            backgroundColor: backgroundColor,
            flex: 1,
            height: 140,
            width: 250,
            borderRadius: 16,
            paddingLeft: 16,
            paddingTop: 16,
            paddingBottom: 16,
            paddingRight: 4,
            marginBottom: 16,
            marginLeft: 16,
        },
        subjectTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'Poppins_600SemiBold',


        },
        classRoomNumber: {
            fontSize: 12,
            color: 'white',
            fontFamily: 'Poppins_400Regular',
            marginTop: 16,
        },
        teacherName: {
            fontSize: 12,
            color: 'white',
            fontFamily: 'Poppins_400Regular',
            marginTop: -5,


        }


    });
    return (
        <TouchableOpacity style={styles.container}
            onPress={() => {
                //ToastAndroid.show(props.element.className, ToastAndroid.SHORT)
            }}>
            <Text numberOfLines={2} style={styles.subjectTitle}>{props.element.className.replaceAll('-', ' ').replace(' CM', '- CM').replace(' TP', '- TP').replace('  PRO', '- PRO')}</Text>
            <Text style={styles.classRoomNumber}>{props.element.location}</Text>
            <Text style={styles.teacherName}>{props.element.teacher?.replace(' ', '')}</Text>
        </TouchableOpacity>
    );
};
