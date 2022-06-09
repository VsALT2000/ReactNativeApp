import {
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
    useWindowDimensions, PanResponderGestureState
} from 'react-native';
import {View} from '../components/Themed';
import {RootTabScreenProps} from '../types';
import {createRef, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {MaterialIcons} from "@expo/vector-icons";
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import * as Haptics from 'expo-haptics';

export default function PhotoScreen({navigation}: RootTabScreenProps<'Photo'>) {
    const {height, width} = useWindowDimensions();
    const [image, setImage] = useState<string | null>(null);
    const [openedImage, setOpenedImage] = useState(false);
    const [ratio, setRatio] = useState<number>(0);

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
            setRatio(result.height / result.width);
            setImage(result.uri);
            setOpenedImage(false);
        }
    }

    const zoomableViewRef = createRef<ReactNativeZoomableView>();

    const onCloseImage = (event: Event, gestureState: PanResponderGestureState, zoomableViewEventObject: any) => {
        if (zoomableViewEventObject.zoomLevel < 1) {
            zoomableViewRef.current!.zoomTo(1);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setOpenedImage(false);
        }
    }

    const onOpenImage = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setOpenedImage(true);
    }

    return (
        <View lightColor="#eee" darkColor="#1b1b1b" style={styles.pageContainer}>
            {image && openedImage &&
                <View lightColor="#eee" darkColor="#1b1b1b" style={styles.zoomWrapper}>
                    <ReactNativeZoomableView
                        minZoom={0.9}
                        maxZoom={2}
                        zoomStep={0.25}
                        bindToBorders={true}
                        onZoomEnd={onCloseImage}
                        ref={zoomableViewRef}
                    >
                        <Image
                            style={{width: width, height: width * ratio}}
                            source={{uri: image}}
                        />
                    </ReactNativeZoomableView>
                </View>
            }
            {!openedImage && <ScrollView contentContainerStyle={styles.container}>
                {image && !openedImage && <TouchableOpacity activeOpacity={1} onPress={onOpenImage}>
                    <Image source={{uri: image}} style={{width: width, height: width * ratio}}/>
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
            </ScrollView>}
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
