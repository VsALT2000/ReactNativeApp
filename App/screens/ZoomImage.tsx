import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";
import {Image, StyleSheet, useWindowDimensions} from "react-native";
import {View} from "../components/Themed";
import {useEffect} from "react";
import * as Haptics from "expo-haptics";
import {PhotoType} from "../types";

export default function ZoomImage ({route, navigation}: any) {
    const { openedImage }: {openedImage: PhotoType } = route.params
    const {width} = useWindowDimensions();

    useEffect(() =>
        navigation.addListener('gestureStart', (e: any) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }), [navigation]);

    return (
        <View lightColor="#eee" darkColor="#1b1b1b" style={styles.zoomWrapper}>
            <ReactNativeZoomableView
                minZoom={1}
                maxZoom={2}
                zoomStep={0.25}
                bindToBorders={true}
            >
                <Image
                    style={{width: width, height: width * openedImage.height / openedImage.width}}
                    source={{uri: openedImage.url}}
                />
            </ReactNativeZoomableView>
        </View>
    );
}

const styles = StyleSheet.create({
    zoomWrapper: {
        flex: 1,
        overflow: 'hidden',
    },
});
