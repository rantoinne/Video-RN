import { Platform} from "react-native";

export default{
    baseUrl:'http://159.65.104.109:3003/',
    TOOLBAR_HEIGHT : 56,
    STRIPE_TOKEN: 'pk_test_E7nUiIqmPipJ56YzeFp6LGqg00Fburxzs7',
    STATUS_BAR_HEIGHT : Platform.select({ ios: 20, android: 24 }),
    basicAuthorization:'Basic NWM2M2ZkNjU0ZWUyNGEyZDc2OTkwZTkwOmFiY2QxMjM0',
}