import Toast from 'react-native-root-toast';

const ShowToast = (data) => {
    return Toast.show(data, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        animation: true
    });
}

export default ShowToast;