import {Image, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';
import {View} from '../components/Themed';
import {PhotoType, RootTabScreenProps} from '../types';
import {useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {MaterialIcons} from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import * as url from "url";

export default function PhotoScreen({navigation}: RootTabScreenProps<'Photo'>) {
    const {width} = useWindowDimensions();
    const [image, setImage] = useState<PhotoType | null>(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1,
        });
        loadImage(result);
    };

    const openCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            alert("You've refused to allow this app to access your camera!");
            return;
        }
        const result = await ImagePicker.launchCameraAsync();
        loadImage(result);
    }

    const loadImage = (result: ImagePicker.ImagePickerResult) => {
        if (!result.cancelled) {
            setImage({url: result.uri, height: result.height, width: result.width, id: 0});
        }
    }

    const onOpenImage = (image: PhotoType) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        // @ts-ignore
        navigation.navigate('Zoom', {openedImage: image});
    }

    return (
        <View lightColor="#eee" darkColor="#1b1b1b" style={styles.pageContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                {image && <TouchableOpacity activeOpacity={1} onPress={() => onOpenImage(image)}>
                    <Image source={{uri: image.url}} style={{width: width, height: width * image.height / image.width}}/>
                </TouchableOpacity>
                }
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <MaterialIcons name="add-photo-alternate" size={24} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={openCamera}>
                        <MaterialIcons name="add-a-photo" size={24} color="white"/>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
    },
    zoomWrapper: {
        flex: 1,
        overflow: 'hidden',
    },
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "transparent",
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
    image: {
        flex: 1,
        width: '100%',
    },
    buttonText: {
        fontSize: 20,
    }
});
