import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './ckStyles.css'
import { Box,Button } from '@mui/material';

const ckEditorComponent = ({ closeCk,recipientUserId }) => {
    const [notificationContent, setNotificationContent] = useState('');
    const [notifications, setNotifications] = useState([]);

    const handleSaveNotification = () => {
        if (notificationContent.trim()) {
            const newNotification = {
                id: notifications.length + 1,
                content: notificationContent,
                timestamp: new Date().toLocaleString(),
            };
            setNotifications([...notifications, newNotification]);
            setNotificationContent(''); // Clear editor after saving
        } else {
            alert('Notification content cannot be empty!');
        }
    };

    const handleSendNotification = async () => {
        if (notificationContent.trim()) {
           
            try {
            
                const token = localStorage.getItem('authToken');
                const response = await fetch('http://localhost:8000/api/notifications', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        user_id: 'recipientUserId',
                    notifications: notificationContent,
                    send_time: new Date().toISOString(),
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to send notification');
                }

                const result = await response.json();
                console.log('Notification sent successfully:', result);

                // Optionally clear notifications or provide user feedback
                setNotificationContent(''); // Clear editor after sending
                closeCk(); // Close CKEditor after sending

            } catch (error) {
                console.error('Error sending notification:', error);
            }
        } else {
            alert('Notification content cannot be empty!');
        }
    };

    return (
        <Box className="notification-editor-container">
            <h2>Create Notification</h2>
            <Box >
                <CKEditor
                    editor={ClassicEditor}
                    data={notificationContent}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setNotificationContent(data);
                    }}

                />
            </Box>
            <Box className="ck-actions">
                <Button variant="outlined" onClick={closeCk} className="cancle-button">
                    Discard Message
                </Button>
                <Button variant="contained" onClick={handleSendNotification} className="save-button">
                    Send Notification
                </Button>
            </Box>

            <ul className="notifications-list">
                {notifications.map((notification) => (
                    <li key={notification.id} className="notification-item">
                        <div
                            dangerouslySetInnerHTML={{ __html: notification.content }}
                            className="notification-content"
                        />
                        <p className="notification-timestamp">
                            <small>{notification.timestamp}</small>
                        </p>
                    </li>
                ))}
            </ul>
        </Box>
    );
};

export default ckEditorComponent;
