import {
    ScrollView,
    StyleSheet,
    Text
} from 'react-native';
import {View} from '../components/Themed';
import {RootTabScreenProps} from '../types';


export default function ProfileScreen({navigation}: RootTabScreenProps<'Photo'>) {
    return (
        <View lightColor="#eee" darkColor="#1b1b1b" style={styles.pageContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text>alo</Text>
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
