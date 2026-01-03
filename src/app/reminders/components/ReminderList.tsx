"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Bell, BellOff } from "lucide-react";
import { type Reminder } from "../lib/reminders";
import { cn } from "@/lib/utils";


const dayLabels: { [key: string]: string } = {
  sun: 'الأحد', mon: 'الإثنين', tue: 'الثلاثاء', wed: 'الأربعاء',
  thu: 'الخميس', fri: 'الجمعة', sat: 'السبت'
};

function getDaysLabel(days: string[]): string {
    if (days.includes('everyday') || days.length === 7) return 'يومياً';
    if (days.length === 0) return 'لا يوجد';
    if (days.length === 1 && days[0] === 'fri') return 'كل يوم جمعة';
    if (days.length === 2 && days.includes('mon') && days.includes('thu')) return 'الإثنين والخميس';
    
    return days.map(d => dayLabels[d]).join('، ');
}

type ReminderListProps = {
    reminders: Reminder[];
    onToggle: (reminder: Reminder) => void;
    onEdit: (reminder: Reminder) => void;
    onDelete: (id: string) => void;
};


export function ReminderList({ reminders, onToggle, onEdit, onDelete }: ReminderListProps) {
  if (reminders.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>لا توجد تذكيرات.</p>
        <p>اضغط على "إضافة جديد" لإنشاء تذكير.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reminders.map((reminder) => (
        <Card key={reminder.id} className={cn("transition-all duration-300 shadow-md hover:shadow-lg", !reminder.enabled && "bg-muted/30 dark:bg-card/50 opacity-70")}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{reminder.title}</CardTitle>
                    <CardDescription className="pt-1">
                      {getDaysLabel(reminder.days)} - الساعة {reminder.time}
                    </CardDescription>
                  </div>
              </div>
            </CardHeader>
            <CardFooter className="flex justify-end gap-2 p-3 pt-0">
                {reminder.enabled ? (
                    <Button variant="ghost" size="sm" onClick={() => onToggle({ ...reminder, enabled: false })} className="gap-2 text-muted-foreground">
                        <BellOff className="h-4 w-4" />
                        إيقاف
                    </Button>
                ) : (
                    <Button variant="secondary" size="sm" onClick={() => onToggle({ ...reminder, enabled: true })} className="gap-2">
                        <Bell className="h-4 w-4" />
                        تفعيل
                    </Button>
                )}
               <Button variant="outline" size="sm" onClick={() => onEdit(reminder)} className="gap-2">
                  <Edit className="h-4 w-4" />
                  تعديل
              </Button>
              <Button variant="destructive" size="icon" onClick={() => onDelete(reminder.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">حذف</span>
              </Button>
            </CardFooter>
        </Card>
      ))}
    </div>
  );
}
