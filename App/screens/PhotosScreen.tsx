import {Image, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';
import {Text, View} from '../components/Themed';
import {PhotoType, RootTabScreenProps} from "../types";
import {useEffect, useRef, useState} from "react";
import Token from "../token";
import * as Haptics from "expo-haptics";

export default function PhotosScreen({navigation}: RootTabScreenProps<'Profile'>) {
    const [posts, setPosts] = useState<any>([])

    useEffect(() => {
        fetch(`https://api.vk.com/method/wall.get?owner_id=-199514280&count=25&access_token=${Token}&v=5.131`)
            .then((response) => response.json())
            .then((data) => {
                const posts = data.response.items
                    .map((item: any) => {
                        const photos = item.attachments.map((attachment: any) => {
                            if (attachment.type !== "photo")
                                return undefined;
                            const size = attachment.photo.sizes.sort((a: any, b: any) => {
                                return b.height - a.height
                            })[0];
                            return {
                                height: size.height,
                                width: size.width,
                                url: size.url,
                                id: attachment.photo.id
                            };
                        }).filter((photo: PhotoType | undefined) => !!photo)
                        return {
                            id: item.id,
                            text: item.text,
                            photos: photos
                        }
                    })
                setPosts(posts);
            });
    }, [])

    return (
        <View lightColor="#eee" darkColor="#1b1b1b" style={styles.pageContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                {
                    posts.map((post: any) => <Post post={post} navigation={navigation}/>)
                }
            </ScrollView>
        </View>
    );
}

const Post = ({post, navigation}: any) => {
    const {width} = useWindowDimensions();

    const onOpenImage = (image: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        // @ts-ignore
        navigation.navigate('Zoom', {openedImage: image});
    }

    return (
        <View style={styles.postContainer} key={post.id}>
            {
                !!post.text && <Text style={styles.textContainer}>{post.text}</Text>
            }
            {post.photos.map((photo: any) => <TouchableOpacity key={photo.id} activeOpacity={1}
                                                               onPress={() => onOpenImage(photo)}>
                <Image source={{uri: photo.url}}
                       style={{height: width * photo.height / photo.width, width: width}}
                />
            </TouchableOpacity>)}
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
        marginVertical: -5
    },
    postContainer: {
        marginVertical: 5
    },
    textContainer: {
        padding: 10,
    }
});
