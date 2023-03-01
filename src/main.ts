import { createApp } from 'vue'
import './style.css'
import VueApp from './App.vue'
import router from './router'
import { vfmPlugin } from 'vue-final-modal'
import VuePdf from 'vue3-pdfjs'
import Vue3TouchEvents from "vue3-touch-events"

// Functions
import { setLocalCacheItem } from './cache/services/LocalStorageService';

// Vue App
const app = createApp(VueApp)
app.use(router)
app.use(VuePdf)
app.use(Vue3TouchEvents)
app.use(vfmPlugin({
    key: '$vfm',
    componentName: 'VueFinalModal',
    dynamicContainerName: 'ModalsContainer'
}))
app.mount('#app')

// Platform
import { Capacitor } from '@capacitor/core';
const platform = Capacitor.getPlatform();
localStorage.setItem("__platform__", platform)

// Notifications
import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from "@capacitor-community/fcm";
const addListeners = async () => {
    await PushNotifications.addListener('registration', token => {
        console.info('Registration token: ', token.value);
    });

    await PushNotifications.addListener('registrationError', err => {
        console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
        console.log('Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
}
const registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
}
const getDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
}
if (platform != "web") {
    registerNotifications();
    addListeners();
    getDeliveredNotifications();
    FCM.subscribeTo({ topic: "updates" })
        .catch((err) => console.log(err));
}

// Internet Connection
import { Network } from '@capacitor/network';
if (platform != "web") {
    Network.addListener('networkStatusChange', status => {
        setLocalCacheItem("__network_status__", status, true);
    });
    const logCurrentNetworkStatus = async () => {
        const status = await Network.getStatus();
        setLocalCacheItem("__network_status__", status, true);
    };
    logCurrentNetworkStatus();
}

// Capacitor.js Handle Back Button
import { App } from '@capacitor/app';
App.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
        App.exitApp();
    } else {
        window.history.back();
    }
});