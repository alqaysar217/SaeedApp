"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type Reminder } from "../lib/reminders";

const weekDays = [
    { value: 'sun', label: 'الأحد' },
    { value: 'mon', label: 'الاثنين' },
    { value: 'tue', label: 'الثلاثاء' },
    { value: 'wed', label: 'الأربعاء' },
    { value: 'thu', label: 'الخميس' },
    { value: 'fri', label: 'الجمعة' },
    { value: 'sat', label: 'السبت' },
];

type ReminderDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (reminder: Reminder) => void;
    reminder?: Reminder;
};

export function ReminderDialog({ isOpen, onClose, onSave, reminder }: ReminderDialogProps) {
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("08:00");
    const [days, setDays] = useState<string[]>(['everyday']);
    const [id, setId] = useState<string>("");

    useEffect(() => {
        if (reminder) {
            setId(reminder.id);
            setTitle(reminder.title);
            setTime(reminder.time);
            setDays(reminder.days);
        } else {
            setId(Date.now().toString());
            setTitle("");
            setTime("08:00");
            setDays(['everyday']);
        }
    }, [reminder, isOpen]);

    const handleSave = () => {
        if (!title) return;
        onSave({ id, title, time, days, enabled: reminder?.enabled ?? true });
        onClose();
    };

    const handleDaysChange = (newDays: string[]) => {
        if (newDays.length === 0) {
            setDays(['everyday']);
            return;
        }

        const isEverydaySelected = newDays.includes('everyday');
        const wasEverydaySelected = days.includes('everyday');

        if (isEverydaySelected && !wasEverydaySelected) {
            // "Everyday" was just selected
            setDays(['everyday']);
        } else if (isEverydaySelected && wasEverydaySelected && newDays.length > 1) {
            // "Everyday" was selected, and now another day is selected
            setDays(newDays.filter(d => d !== 'everyday'));
        } else if (!isEverydaySelected && newDays.length === 7) {
            setDays(['everyday']);
        }
        else {
            setDays(newDays);
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{reminder ? "تعديل التذكير" : "إضافة تذكير جديد"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right col-span-1">
                            العنوان
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="col-span-3"
                            placeholder="مثال: قراءة سورة الكهف"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right col-span-1">
                            الوقت
                        </Label>
                        <Input
                            id="time"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right col-span-1">
                            الأيام
                        </Label>
                        <div className="col-span-3">
                             <ToggleGroup type="multiple" value={days} onValueChange={handleDaysChange} className="flex-wrap justify-end gap-1">
                                <ToggleGroupItem value="everyday" aria-label="Toggle everyday" className="px-3">
                                    كل يوم
                                </ToggleGroupItem>
                                {weekDays.map(day => (
                                     <ToggleGroupItem key={day.value} value={day.value} aria-label={`Toggle ${day.value}`} className="px-3">
                                        {day.label}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
                    <Button type="submit" onClick={handleSave}>حفظ</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
