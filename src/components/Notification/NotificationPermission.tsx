import React, { useEffect } from 'react';

const NotificationPermission: React.FC = () => {
    useEffect(() => {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Permission granted');
                } else {
                    console.log('Permission denied');
                }
            });
        }
    }, []);

    return <div>Requesting notification permission...</div>;
};

export default NotificationPermission;
