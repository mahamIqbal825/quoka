import { Icon, CheckBox, ListItem, Body, Toast } from 'native-base'


export function toast(message, type = "warning", position = "top"){
    Toast.show({
        text: message,
        buttonText: 'Okay',
        type: type,
        duration: 2000,
        position:position
    });
}