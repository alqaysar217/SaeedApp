"use client";

import { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BellRing, PlusCircle } from "lucide-react";
import { ReminderDialog } from "./components/ReminderDialog";
import { ReminderList } from "./components/ReminderList";
import { defaultReminders, type Reminder } from "./lib/reminders";

// Helper to check for service worker and push manager
const isPushSupported = () =>
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window;

const scheduleReminder = (reminder: Reminder) => {
    if (!isPushSupported() || Notification.permission !== 'granted') {
        return;
    }

    navigator.serviceWorker.ready.then(registration => {
        // This is a simplified scheduling logic for demonstration purposes.
        // A robust solution would involve calculating the exact time for the next reminder
        // and using the Push API with a server to send notifications reliably.
        // For this client-only example, we'll show an immediate notification as a test.
        if (reminder.enabled) {
            registration.showNotification('تذكير من تطبيق سعيد', {
                body: reminder.title,
                icon: '/icons/icon-192x192.png',
                tag: reminder.id,
                data: {
                    url: window.location.origin,
                },
                lang: 'ar',
                vibrate: [100, 50, 100],
            });
        } else {
             // If reminder is disabled, try to find and close any existing notification with the same tag
             registration.getNotifications({ tag: reminder.id }).then(notifications => {
                notifications.forEach(notification => notification.close());
            });
        }
    });
};

const cancelAllReminders = () => {
    if (!isPushSupported()) return;
    navigator.serviceWorker.ready.then(registration => {
        registration.getNotifications().then(notifications => {
            notifications.forEach(notification => notification.close());
        });
    });
};

const scheduleAllReminders = (reminders: Reminder[]) => {
    if (!isPushSupported() || Notification.permission !== 'granted') return;
    cancelAllReminders(); // Clear old ones first
    // In a real-world scenario, you'd calculate and schedule all reminders.
    // For this demo, we're not scheduling future notifications.
    console.log("Scheduling reminders...", reminders.filter(r => r.enabled).length);
};


export default function RemindersPage() {
    const { toast } = useToast();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingReminder, setEditingReminder] = useState<Reminder | undefined>(undefined);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
    const [isPushApiSupported, setIsPushApiSupported] = useState(true);


    const checkNotificationPermission = useCallback(() => {
        if (isPushSupported()) {
            setNotificationPermission(Notification.permission);
        } else {
            setIsPushApiSupported(false);
        }
    }, []);


    useEffect(() => {
        const savedReminders = localStorage.getItem("reminders");
        if (savedReminders) {
            setReminders(JSON.parse(savedReminders));
        } else {
            setReminders(defaultReminders);
        }
        checkNotificationPermission();
    }, [checkNotificationPermission]);


    const updateReminders = useCallback((newReminders: Reminder[]) => {
        setReminders(newReminders);
        localStorage.setItem("reminders", JSON.stringify(newReminders));
        if (notificationPermission === 'granted') {
            scheduleAllReminders(newReminders);
        }
    }, [notificationPermission]);

    const requestNotificationPermission = async () => {
        if (!isPushApiSupported) {
            toast({
                variant: "destructive",
                title: "التصفح غير مدعوم",
                description: "متصفحك لا يدعم خاصية الإشعارات.",
            });
            return;
        }
        
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        
        if (permission === "granted") {
            toast({
                title: "تم تفعيل الإشعارات بنجاح!",
                description: "ستصلك التذكيرات في وقتها بإذن الله.",
            });
            scheduleAllReminders(reminders);
        } else if (permission === 'denied') {
             toast({
                variant: "destructive",
                title: "تم رفض الإذن",
                description: "لم تسمح بوصول الإشعارات. لتلقي التذكيرات، يرجى تفعيلها من إعدادات المتصفح.",
                duration: 5000,
            });
        }
    };
    
    const handleSaveReminder = (reminder: Reminder) => {
        let newReminders: Reminder[];
        const existingIndex = reminders.findIndex(r => r.id === reminder.id);
        if (existingIndex > -1) {
            newReminders = [...reminders];
            newReminders[existingIndex] = reminder;
        } else {
            newReminders = [...reminders, reminder];
        }
        updateReminders(newReminders);

        toast({
            title: `تم حفظ التذكير`,
            description: reminder.title,
        });
        
        // Optional: schedule a test notification immediately
        // if (reminder.enabled && notificationPermission === 'granted') {
        //     scheduleReminder(reminder);
        // }
    };

    const handleDeleteReminder = (id: string) => {
        const newReminders = reminders.filter(r => r.id !== id);
        updateReminders(newReminders);
        toast({
            variant: "destructive",
            title: "تم حذف التذكير",
        });
    };
    
    const handleEdit = (reminder: Reminder) => {
        setEditingReminder(reminder);
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingReminder(undefined);
        setIsDialogOpen(true);
    };

     const handleToggleReminder = (toggledReminder: Reminder) => {
        const newReminders = reminders.map(r => r.id === toggledReminder.id ? toggledReminder : r);
        updateReminders(newReminders);
    };

    const renderPermissionCard = () => {
        if (!isPushApiSupported) {
             return (
                <Card className="mb-6 bg-destructive/10 border-destructive/20 shadow-lg">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-destructive/20 rounded-full">
                            <BellRing className="w-6 h-6 text-destructive" />
                        </div>
                        <div>
                            <h3 className="font-semibold">خاصية الإشعارات غير مدعومة</h3>
                            <p className="text-sm text-muted-foreground">
                               للأسف، متصفحك الحالي لا يدعم إرسال الإشعارات.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        if (notificationPermission === 'granted') {
            return null; // Don't show the card if permission is granted
        }

        const isDenied = notificationPermission === 'denied';

        return (
            <Card className="mb-6 bg-accent/10 border-accent/20 shadow-lg">
                <CardContent className="p-4 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                         <div className="p-3 bg-accent/20 rounded-full">
                            <BellRing className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <h3 className="font-semibold">
                                {isDenied ? 'الإشعارات محظورة' : 'تفعيل الإشعارات'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                               {isDenied 
                                 ? 'لقد قمت بحظر الإشعارات. يرجى تفعيلها يدويًا من إعدادات المتصفح ثم تحديث الصفحة.'
                                 : 'اضغط للسماح بالإشعارات ليصلك كل تذكير في وقته.'
                               }
                            </p>
                        </div>
                    </div>
                    {!isDenied && (
                        <Button onClick={requestNotificationPermission} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors shadow-sm hover:shadow-md">
                            السماح بالإشعارات
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }


    return (
        <div onFocus={checkNotificationPermission}>
            <PageHeader title="التذكيرات" description="وذكر فإن الذكرى تنفع المؤمنين" />

            <div className="p-4">
              {renderPermissionCard()}
            
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">قائمة التذكيرات</h2>
                    <Button variant="ghost" size="sm" onClick={handleAddNew}>
                        <PlusCircle className="ml-2 h-5 w-5" />
                        إضافة جديد
                    </Button>
                </div>
                <ReminderList reminders={reminders} onEdit={handleEdit} onDelete={handleDeleteReminder} onToggle={handleToggleReminder} />
            </div>

            <ReminderDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSaveReminder}
                reminder={editingReminder}
            />
        </div>
    );
}
