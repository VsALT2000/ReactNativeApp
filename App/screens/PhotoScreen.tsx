import {Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, useWindowDimensions} from 'react-native';
import {Text, View} from '../components/Themed';
import {PhotoType, RootTabScreenProps} from '../types';
import {useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {MaterialIcons} from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import Token from "../token";

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

    const [text, onChangeText] = useState("");

    const sendPost = async () => {
        if (!image) {
            fetch(`https://api.vk.com/method/wall.post?owner_id=-199514280&from_group=1&message=${text}&access_token=${Token}&v=5.131`)
                .then((response) => response.json())
                .then((data) => console.log(data.response.post_id))
        }
        const uploadUrl = await fetch(`https://api.vk.com/method/photos.getWallUploadServer?group_id=199514280&access_token=${Token}&v=5.131`)
            .then(response => response.json())
            .then(data => data.response.upload_url)
        const formData = new FormData();
        // @ts-ignore
        formData.append("photo", { uri: image.url, type: 'image/jpeg', name: "photo.jpg"});
        const photoData = await fetch(uploadUrl, {
            method: 'POST',
            headers: {'Content-Type': 'multipart/form-data'},
            body: formData,
        })
            .then(response => response.json())
        const uploadPhotoData = await fetch(`https://api.vk.com/method/photos.saveWallPhoto?group_id=199514280&photo=${photoData.photo}&server=${photoData.server}&hash=${photoData.hash}&access_token=${Token}&v=5.131`)
            .then(response => response.json())
            .then(data => data.response[0])
        fetch(`https://api.vk.com/method/wall.post?owner_id=-199514280&from_group=1&message=${text}&attachments=photo${uploadPhotoData.owner_id}_${uploadPhotoData.id}&access_token=${Token}&v=5.131`)
            .then((response) => response.json())
            .then((data) => {
                setImage(null);
                onChangeText("");
                console.log(data.response.post_id);
            })
    }


    return (
        <View lightColor="#eee" darkColor="#1b1b1b" style={styles.pageContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                {image && <TouchableOpacity activeOpacity={1} onPress={() => onOpenImage(image)}>
                    <Image source={{uri: image.url}}
                           style={{width: width, height: width * image.height / image.width}}/>
                </TouchableOpacity>
                }
                <View style={styles.buttonWrapper}>
                    <TextInput style={styles.input} onChangeText={onChangeText} value={text}/>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <MaterialIcons name="add-photo-alternate" size={24} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={openCamera}>
                        <MaterialIcons name="add-a-photo" size={24} color="white"/>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity style={styles.button} onPress={sendPost}>
                        <Text style={{color: "white", marginRight: 10}}>Опубликовать</Text>
                        <MaterialIcons name="add-photo-alternate" size={24} color="white"/>
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
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        padding: 12,
        backgroundColor: "#00b6ea",
        borderRadius: 5,
    },
    input: {
        width: "90%",
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    image: {
        flex: 1,
        width: '100%',
    },
    buttonText: {
        fontSize: 20,
    }
});
