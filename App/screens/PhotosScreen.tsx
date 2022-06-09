import {Image, ScrollView, StyleSheet, useWindowDimensions} from 'react-native';
import {Text, View} from '../components/Themed';
import {RootTabScreenProps} from "../types";
import {useEffect, useState} from "react";
import Token from "../token";

export default function PhotosScreen({navigation}: RootTabScreenProps<'Profile'>) {
    const {height, width} = useWindowDimensions();
    const [images, setImages] = useState<any>([])

    useEffect(() => {
        fetch(`https://api.vk.com/method/wall.get?owner_id=-199514280&count=5&access_token=${Token}&v=5.131`)
            .then((response) => response.json())
            .then((data) => {
                const images = data.response.items
                    .map((item: any) => {
                        const photo = item.attachments[0].photo;
                        const size = photo.sizes.sort((a: any, b: any) => {
                            return b.height - a.height
                        })[0];
                        return {
                            ...size,
                            id: photo.id
                        }
                    })
                setImages(images);
            });
    }, [])

    return (
        <View lightColor="#eee" darkColor="#1b1b1b" style={styles.pageContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                {
                    images.map((image: any) => <Image source={{uri: image.url}} key={image.id} style={{height: width * image.height / image.width, width: width}}/>)
                }
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
    },
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    }
});
