import {ScrollView, StyleSheet, Image, TouchableOpacity, useWindowDimensions} from 'react-native';
import {View} from '../components/Themed';
import {RootTabScreenProps} from '../types';
import {useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {MaterialIcons} from "@expo/vector-icons";

export default function TabOneScreen({navigation}: RootTabScreenProps<'TabOne'>) {
    const {height, width} = useWindowDimensions();
    const [image, setImage] = useState<string | null>(null);
    const [temp, setTemp] = useState<number>(0);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1,
        });

        if (!result.cancelled) {
            setTemp(result.height / result.width)
            setImage(result.uri);
        }
    };

    const openCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
            alert("You've refused to allow this app to access your camera!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();

        if (!result.cancelled) {
            setTemp(result.height / result.width)
            setImage(result.uri);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {image && <Image source={{uri: image}} style={{width: width, height: width * temp}}/>}
            <View style={styles.buttonWrapper}>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <MaterialIcons name="add-photo-alternate" size={24} color="white"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={openCamera}>
                    <MaterialIcons name="add-a-photo" size={24} color="white"/>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    buttonWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "transparent",
        width: "100%"
    },
    button: {
        marginVertical: 10,
        padding: 12,
        backgroundColor: "#00b6ea",
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 20,
    }
});
