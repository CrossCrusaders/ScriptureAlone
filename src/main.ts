import { createApp } from 'vue'
import './style.css'
import VueApp from './App.vue'
import router from './router'
import vfmPlugin from 'vue-final-modal'
import VuePdf from 'vue3-pdfjs'
import Vue3TouchEvents from "vue3-touch-events";

const app = createApp(VueApp)
app.use(vfmPlugin)
app.use(router)
app.use(VuePdf)
app.use(Vue3TouchEvents);
app.mount('#app')

import { App } from '@capacitor/app';

App.addListener('backButton', data => {
    window.history.back()
})

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

import { Capacitor } from '@capacitor/core';
if (Capacitor.getPlatform() != "web") {
    registerNotifications();
    addListeners();
    getDeliveredNotifications();
    FCM.subscribeTo({ topic: "updates" })
        .catch((err) => console.log(err));
}