import {
    Image,
    PanResponderGestureState,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions
} from 'react-native';
import {Text, View} from '../components/Themed';
import {RootTabScreenProps} from "../types";
import {createRef, useEffect, useState} from "react";
import Token from "../token";
import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";
import * as Haptics from "expo-haptics";

export default function PhotosScreen({navigation}: RootTabScreenProps<'Profile'>) {
    const {height, width} = useWindowDimensions();
    const [images, setImages] = useState<any>([])
    const [openedImage, setOpenedImage] = useState<any>(null);

    useEffect(() => {
        fetch(`https://api.vk.com/method/wall.get?owner_id=-199514280&count=50&access_token=${Token}&v=5.131`)
            .then((response) => response.json())
            .then((data) => {
                const images = data.response.items
                    .map((item: any) => item.attachments.map((attachment: any) => {
                            if (attachment.type !== "photo")
                                return undefined;
                            const size = attachment.photo.sizes.sort((a: any, b: any) => {
                                return b.height - a.height
                            })[0];
                            return {
                                ...size,
                                id: attachment.photo.id
                            };
                    })).flat(Infinity)
                setImages(images.filter((image: any) => !!image));
            });
    }, [])

    const zoomableViewRef = createRef<ReactNativeZoomableView>();

    const onCloseImage = (event: Event, gestureState: PanResponderGestureState, zoomableViewEventObject: any) => {
        if (zoomableViewEventObject.zoomLevel < 1) {
            zoomableViewRef.current!.zoomTo(1);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setOpenedImage(null);
        }
    }

    const onOpenImage = (image: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setOpenedImage(image);
    }

    return (
        <View lightColor="#eee" darkColor="#1b1b1b" style={styles.pageContainer}>
            {openedImage !== null &&
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
                            style={{width: width, height: width * openedImage.height / openedImage.width}}
                            source={{uri: openedImage.url}}
                        />
                    </ReactNativeZoomableView>
                </View>
            }
            {
                openedImage === null && <ScrollView contentContainerStyle={styles.container}>
                    {
                        images.map((image: any) =>
                            <TouchableOpacity key={image.id} activeOpacity={1} onPress={() => onOpenImage(image)}>
                                <Image source={{uri: image.url}}
                                       style={{height: width * image.height / image.width, width: width}}
                                />
                            </TouchableOpacity>)
                    }
                </ScrollView>
            }
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
    }
});
